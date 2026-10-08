const leagues = [
  { id: "eng.1", name: "Premier League", country: "England", mark: "PL" },
  { id: "esp.1", name: "La Liga", country: "Spain", mark: "LL" },
  { id: "ger.1", name: "Bundesliga", country: "Germany", mark: "BL" },
  { id: "ita.1", name: "Serie A", country: "Italy", mark: "SA" },
  { id: "fra.1", name: "Ligue 1", country: "France", mark: "L1" }
];

const state = {
  matches: [],
  standings: new Map(),
  selectedDate: dateKey(new Date()),
  selectedLeague: "all",
  filter: "upcoming",
  page: "fixtures",
  favoritesOnly: false,
  favoriteIds: readFavorites(),
  loading: false,
  refreshQueued: false,
  matchError: ""
};

const elements = {
  headerDate: document.querySelector("#header-date"),
  leagueFilters: document.querySelector("#league-filters"),
  dateStrip: document.querySelector("#date-strip"),
  matchList: document.querySelector("#match-list"),
  matchCount: document.querySelector("#match-count"),
  lastUpdated: document.querySelector("#last-updated"),
  refreshButton: document.querySelector("#refresh-button"),
  searchInput: document.querySelector("#search-input"),
  favoritesToggle: document.querySelector("#favorites-toggle"),
  matchView: document.querySelector("#match-view"),
  standingsView: document.querySelector("#standings-view"),
  standingsTitle: document.querySelector("#standings-title"),
  standingsSource: document.querySelector("#standings-source"),
  standingsContent: document.querySelector("#standings-content")
};

function dateKey(date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

function parseDate(key) {
  return new Date(Number(key.slice(0, 4)), Number(key.slice(4, 6)) - 1, Number(key.slice(6, 8)));
}

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem("touchline-favorites") || "[]");
    return new Set(Array.isArray(saved) ? saved : []);
  } catch (error) {
    console.warn("Could not read saved favorites.", error);
    return new Set();
  }
}

function saveFavorites() {
  try {
    localStorage.setItem("touchline-favorites", JSON.stringify([...state.favoriteIds]));
  } catch (error) {
    console.warn("Could not save favorites in this browser.", error);
  }
}

function formatDate(date, options) {
  return new Intl.DateTimeFormat(undefined, options).format(date);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function renderHeaderDate() {
  elements.headerDate.textContent = formatDate(new Date(), {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

function renderLeagueFilters() {
  elements.leagueFilters.innerHTML = leagues.map((league) => `
    <button class="league-filter" type="button" data-league="${league.id}">
      <span class="side-icon">${league.mark}</span>${league.name}
    </button>
  `).join("");
}

function renderDateStrip() {
  const today = new Date();
  const dates = Array.from({ length: 11 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index - 3);
    return date;
  });

  elements.dateStrip.innerHTML = dates.map((date) => {
    const key = dateKey(date);
    const day = key === dateKey(today) ? "Today" : formatDate(date, { weekday: "short" });
    return `
      <button class="date-button${key === state.selectedDate ? " selected" : ""}" type="button" data-date="${key}" aria-pressed="${key === state.selectedDate}">
        <span class="date-day">${day}</span>
        <span class="date-number">${formatDate(date, { month: "short", day: "numeric" })}</span>
      </button>
    `;
  }).join("");
}

function getEventLeague(event, fallbackId) {
  const competition = event.competitions && event.competitions[0];
  const leagueId = competition && competition.competitors && competition.competitors[0]
    && competition.competitors[0].team && competition.competitors[0].team.leagues
    && competition.competitors[0].team.leagues[0] && competition.competitors[0].team.leagues[0].id;
  return leagues.find((league) => league.id === leagueId || league.id === fallbackId)
    || leagues.find((league) => league.id === fallbackId);
}

function mapEvent(event, league) {
  const competition = event.competitions && event.competitions[0];
  const competitors = (competition && competition.competitors) || [];
  const home = competitors.find((team) => team.homeAway === "home") || competitors[0] || {};
  const away = competitors.find((team) => team.homeAway === "away") || competitors[1] || {};
  const status = (event.status && event.status.type) || {};
  const stateName = status.state || "pre";
  const id = String(event.id);

  return {
    id,
    league,
    home: home.team || {},
    away: away.team || {},
    homeScore: home.score,
    awayScore: away.score,
    date: event.date,
    state: stateName,
    status: status.shortDetail || status.detail || "",
    note: (competition && competition.notes && competition.notes[0] && competition.notes[0].headline) || "",
    favorite: state.favoriteIds.has(id)
  };
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Feed request failed (${response.status}).`);
  }
  return response.json();
}

async function fetchMatches() {
  const requests = leagues.map(async (league) => {
    const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${league.id}/scoreboard?dates=${state.selectedDate}`;
    const data = await fetchJson(url);
    return (data.events || []).map((event) => mapEvent(event, getEventLeague(event, league.id)));
  });
  const results = await Promise.allSettled(requests);
  const successful = results.filter((result) => result.status === "fulfilled");
  state.matches = successful.flatMap((result) => result.value);
  state.matches.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (successful.length === 0) {
    const failures = results.filter((result) => result.status === "rejected");
    throw new Error(failures.map((result) => result.reason.message).join(" "));
  }

  const failedCount = results.length - successful.length;
  return failedCount;
}

function flattenStandings(node) {
  const tables = [];
  if (node && node.standings && Array.isArray(node.standings.entries)) {
    tables.push(...node.standings.entries);
  }
  for (const child of (node && node.children) || []) {
    tables.push(...flattenStandings(child));
  }
  return tables;
}

function statValue(entry, names) {
  const stats = entry.stats || [];
  const stat = stats.find((item) => names.includes(item.name));
  return stat ? stat.displayValue ?? stat.value ?? "—" : "—";
}

function mapStanding(entry, index) {
  return {
    rank: statValue(entry, ["rank", "playoffSeed"]) || index + 1,
    team: (entry.team && entry.team.displayName) || "Team",
    played: statValue(entry, ["gamesPlayed", "games"]),
    wins: statValue(entry, ["wins"]),
    draws: statValue(entry, ["ties", "draws"]),
    losses: statValue(entry, ["losses"]),
    goalDifference: statValue(entry, ["pointDifferential", "goalDifference"]),
    points: statValue(entry, ["points"])
  };
}

async function fetchStandings() {
  const requests = leagues.map(async (league) => {
    const url = `https://site.web.api.espn.com/apis/v2/sports/soccer/${league.id}/standings?region=us&lang=en&contentorigin=espn`;
    const data = await fetchJson(url);
    const entries = flattenStandings(data);
    if (entries.length === 0) {
      throw new Error(`No standings were returned for ${league.name}.`);
    }
    state.standings.set(league.id, entries.map(mapStanding));
    return league;
  });
  const results = await Promise.allSettled(requests);
  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length === leagues.length) {
    throw new Error(failed.map((result) => result.reason.message).join(" "));
  }
  return failed.length;
}

function getFilteredMatches() {
  const query = elements.searchInput.value.trim().toLocaleLowerCase();
  return state.matches.filter((match) => {
    if (state.selectedLeague !== "all" && match.league.id !== state.selectedLeague) return false;
    if (state.filter === "live" && match.state !== "in") return false;
    if (state.filter === "upcoming" && match.state !== "pre") return false;
    if (state.filter === "finished" && match.state !== "post") return false;
    if (state.favoritesOnly && !state.favoriteIds.has(match.id)) return false;
    if (query) {
      const haystack = `${match.home.displayName || ""} ${match.away.displayName || ""} ${match.league.name}`.toLocaleLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

function initials(team) {
  const name = team.displayName || team.name || "?";
  return name.split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase();
}

function safeScore(score) {
  return score === undefined || score === null || score === "" ? "" : String(score);
}

function matchStatus(match) {
  if (match.state === "in") return { main: match.status || "LIVE", className: "live", note: "Live" };
  if (match.state === "post") return { main: "FT", className: "finished", note: match.status };
  const time = new Date(match.date);
  return { main: formatDate(time, { hour: "numeric", minute: "2-digit" }), className: "", note: match.note };
}

function renderMatch(match) {
  const status = matchStatus(match);
  const isFinished = match.state === "post";
  const showScores = match.state !== "pre";
  return `
    <article class="match-row">
      <div class="match-state">
        <span class="match-status ${status.className}">${escapeHtml(status.main)}</span>
        ${status.note ? `<span class="match-note">${escapeHtml(status.note)}</span>` : ""}
      </div>
      <div class="teams">
        <div class="team"><span class="team-crest" aria-hidden="true">${escapeHtml(initials(match.home))}</span><span class="team-name">${escapeHtml(match.home.displayName || match.home.name || "Home")}</span></div>
        <div class="team"><span class="team-crest" aria-hidden="true">${escapeHtml(initials(match.away))}</span><span class="team-name">${escapeHtml(match.away.displayName || match.away.name || "Away")}</span></div>
      </div>
      <div class="scores${showScores ? " has-score" : ""}" aria-label="${showScores ? "Score" : "Kickoff"}">${showScores ? `${escapeHtml(safeScore(match.homeScore))}<br>${escapeHtml(safeScore(match.awayScore))}` : "–<br>–"}</div>
      <button class="favorite-button${state.favoriteIds.has(match.id) ? " selected" : ""}" type="button" data-favorite="${escapeHtml(match.id)}" aria-label="${state.favoriteIds.has(match.id) ? "Remove favorite" : "Add favorite"}" aria-pressed="${state.favoriteIds.has(match.id)}">${state.favoriteIds.has(match.id) ? "★" : "☆"}</button>
    </article>
  `;
}

function renderMatches() {
  const matches = getFilteredMatches();
  elements.matchCount.textContent = String(matches.length);
  if (matches.length === 0) {
    const title = state.matches.length === 0
        ? state.matchError ? "Fixtures could not be loaded" : "No matches scheduled"
      : state.filter === "live" ? "No live matches right now" : "No matches found";
    elements.matchList.innerHTML = `<div class="empty-state"><strong>${title}</strong>Try another date, competition, or filter.</div>`;
    return;
  }

  const groups = new Map();
  for (const match of matches) {
    if (!groups.has(match.league.id)) groups.set(match.league.id, []);
    groups.get(match.league.id).push(match);
  }

  elements.matchList.innerHTML = [...groups.entries()].map(([leagueId, leagueMatches]) => {
    const league = leagues.find((item) => item.id === leagueId) || leagueMatches[0].league;
    return `
      <section class="league-group">
        <div class="league-heading">
          <span class="league-symbol">${league.mark}</span>
          <span class="league-name">${league.name}</span>
          <span class="league-country">${league.country}</span>
          <span class="league-match-count">${leagueMatches.length} ${leagueMatches.length === 1 ? "match" : "matches"}</span>
        </div>
        ${leagueMatches.map(renderMatch).join("")}
      </section>
    `;
  }).join("");
}

function renderStandings() {
  const selected = state.selectedLeague === "all"
    ? leagues
    : leagues.filter((league) => league.id === state.selectedLeague);
  const available = selected.filter((league) => state.standings.has(league.id));
  elements.standingsTitle.textContent = state.selectedLeague === "all"
    ? "League standings"
    : `${selected[0].name} standings`;

  if (available.length === 0) {
    elements.standingsContent.innerHTML = `<div class="empty-state"><strong>Standings are unavailable</strong>Please refresh to try the league table again.</div>`;
    return;
  }

  elements.standingsContent.innerHTML = available.map((league) => `
    <section class="table-league">
      <h3><span class="league-symbol">${league.mark}</span>${league.name}<span>${league.country}</span></h3>
      <div class="table-scroll">
        <table class="standings-table">
          <thead><tr><th>Pos</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead>
          <tbody>${state.standings.get(league.id).map((team) => `
            <tr><td>${escapeHtml(team.rank)}</td><td>${escapeHtml(team.team)}</td><td>${escapeHtml(team.played)}</td><td>${escapeHtml(team.wins)}</td><td>${escapeHtml(team.draws)}</td><td>${escapeHtml(team.losses)}</td><td>${escapeHtml(team.goalDifference)}</td><td><strong>${escapeHtml(team.points)}</strong></td></tr>
          `).join("")}</tbody>
        </table>
      </div>
    </section>
  `).join("");
}

function renderPage() {
  const isStandings = state.page === "standings";
  elements.matchView.hidden = isStandings;
  elements.standingsView.hidden = !isStandings;
  document.querySelectorAll(".primary-link").forEach((link) => {
    const selected = link.dataset.page === state.page;
    link.classList.toggle("selected", selected);
    if (selected) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.querySelector(".section-kicker").textContent = `FOOTBALL / ${state.page.toUpperCase()}`;
  document.querySelector("h1").childNodes[0].textContent = state.page === "standings" ? "Standings " : state.page === "scores" ? "Scores " : "Matches ";
  elements.dateStrip.hidden = isStandings;
  elements.refreshButton.disabled = state.loading;
  if (isStandings) renderStandings();
  else renderMatches();
}

async function loadData() {
  if (state.loading) {
    state.refreshQueued = true;
    return;
  }
  state.loading = true;
  elements.refreshButton.disabled = true;
  elements.lastUpdated.textContent = "Loading fixtures…";
  if (state.page === "standings" && state.standings.size === 0) {
    elements.standingsSource.textContent = "Loading table…";
  }

  const tasks = [fetchMatches()];
  if (state.standings.size < leagues.length) tasks.push(fetchStandings());
  const results = await Promise.allSettled(tasks);
  const matchesResult = results[0];
  if (matchesResult.status === "fulfilled") {
    state.matchError = "";
    const dateLabel = formatDate(parseDate(state.selectedDate), { month: "short", day: "numeric" });
    elements.lastUpdated.textContent = `Updated ${formatDate(new Date(), { hour: "numeric", minute: "2-digit" })} · ${dateLabel}${matchesResult.value ? ` · ${matchesResult.value} league feed${matchesResult.value > 1 ? "s" : ""} unavailable` : ""}`;
  } else {
    state.matchError = matchesResult.reason.message;
    elements.lastUpdated.textContent = `Could not load fixtures: ${matchesResult.reason.message}`;
  }

  const standingsResult = results[1];
  if (standingsResult) {
    if (standingsResult.status === "fulfilled") {
      elements.standingsSource.textContent = standingsResult.value
        ? `${standingsResult.value} league table${standingsResult.value > 1 ? "s" : ""} unavailable`
        : "Table by ESPN";
    } else {
      elements.standingsSource.textContent = "Could not load table";
    }
  } else {
    elements.standingsSource.textContent = "Table by ESPN";
  }

  state.loading = false;
  elements.refreshButton.disabled = false;
  renderPage();
  if (state.refreshQueued) {
    state.refreshQueued = false;
    loadData();
  }
}

function selectPage(page) {
  if (!["scores", "fixtures", "standings"].includes(page)) return;
  state.page = page;
  if (page === "scores") state.filter = "live";
  if (page === "fixtures") state.filter = "upcoming";
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    const active = tab.dataset.filter === state.filter;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  renderPage();
  if (page === "standings" && state.standings.size < leagues.length) loadData();
}

document.querySelector(".primary-nav").addEventListener("click", (event) => {
  const link = event.target.closest("[data-page]");
  if (!link) return;
  event.preventDefault();
  const page = link.dataset.page;
  history.replaceState(null, "", `#${page}`);
  selectPage(page);
});

document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  history.replaceState(null, "", "#fixtures");
  selectPage("fixtures");
});

document.querySelector("#competitions").addEventListener("click", (event) => {
  const button = event.target.closest("[data-league]");
  if (!button) return;
  state.selectedLeague = button.dataset.league;
  document.querySelectorAll(".league-filter").forEach((filter) => {
    filter.classList.toggle("selected", filter.dataset.league === state.selectedLeague);
  });
  renderPage();
});

elements.dateStrip.addEventListener("click", (event) => {
  const button = event.target.closest("[data-date]");
  if (!button) return;
  state.selectedDate = button.dataset.date;
  renderDateStrip();
  loadData();
});

document.querySelector(".filter-tabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  state.filter = button.dataset.filter;
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    const active = tab === button;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  renderMatches();
});

elements.matchList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-favorite]");
  if (!button) return;
  const id = button.dataset.favorite;
  if (state.favoriteIds.has(id)) state.favoriteIds.delete(id);
  else state.favoriteIds.add(id);
  saveFavorites();
  renderMatches();
});

elements.searchInput.addEventListener("input", renderMatches);
elements.favoritesToggle.addEventListener("click", () => {
  state.favoritesOnly = !state.favoritesOnly;
  elements.favoritesToggle.setAttribute("aria-pressed", String(state.favoritesOnly));
  elements.favoritesToggle.setAttribute("aria-label", state.favoritesOnly ? "Show all matches" : "Show favorite matches");
  elements.favoritesToggle.textContent = state.favoritesOnly ? "★" : "☆";
  renderMatches();
});
elements.refreshButton.addEventListener("click", loadData);

renderHeaderDate();
renderLeagueFilters();
renderDateStrip();
const initialPage = location.hash.slice(1);
if (["scores", "fixtures", "standings"].includes(initialPage)) {
  selectPage(initialPage);
} else {
  renderPage();
}
if (!state.loading) loadData();
window.setInterval(() => {
  if (!document.hidden && state.page !== "standings") loadData();
}, 60000);
