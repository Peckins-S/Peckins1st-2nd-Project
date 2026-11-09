const leagues = [
  { id: "eng.1", espnId: "700", name: "Premier League", country: "England", mark: "PL" },
  { id: "esp.1", espnId: "740", name: "La Liga", country: "Spain", mark: "LL" },
  { id: "ger.1", espnId: "720", name: "Bundesliga", country: "Germany", mark: "BL" },
  { id: "ita.1", espnId: "730", name: "Serie A", country: "Italy", mark: "SA" },
  { id: "fra.1", espnId: "710", name: "Ligue 1", country: "France", mark: "L1" }
];

const featuredLeagueChoices = [
  { id: "700", name: "Premier League" },
  { id: "740", name: "La Liga" },
  { id: "720", name: "Bundesliga" },
  { id: "730", name: "Serie A" },
  { id: "710", name: "Ligue 1" },
  { id: "715", name: "Primeira Liga" },
  { id: "725", name: "Eredivisie" },
  { id: "630", name: "Brasileirão Série A" },
  { id: "745", name: "Argentina Primera División" }
];
const defaultFeaturedCompetitionIds = featuredLeagueChoices.map((league) => league.id);
const defaultSitePromotion = {
  ad_enabled: true,
  ad_title: "Your matchday, all in one place",
  ad_message: "Follow live scores, upcoming fixtures, and league tables on 90+minutes.",
  ad_cta_label: "Explore matches",
  ad_url: "https://peckins1st-2nd-project.vercel.app/#fixtures"
};
const siteAdminEmail = "peckinssmart@gmail.com";

const fotmobLeagueStatsUrls = {
  "700": "https://www.fotmob.com/leagues/47/stats/premier-league/players",
  "740": "https://www.fotmob.com/leagues/87/stats/laliga/players",
  "720": "https://www.fotmob.com/leagues/54/stats/bundesliga/players",
  "730": "https://www.fotmob.com/leagues/55/stats/serie-a/players",
  "710": "https://www.fotmob.com/leagues/53/stats/ligue-1/players"
};

const globalLeagueNames = {
  "770": ["Major League Soccer", "USA", "MLS"],
  "8301": ["National Women's Soccer League", "USA", "NWSL"],
  "760": ["Liga MX", "Mexico", "MX"],
  "725": ["Eredivisie", "Netherlands", "NED"],
  "8097": ["Women's Super League", "England", "WSL"],
  "3914": ["EFL Championship", "England", "EFL"],
  "23633": ["USL Super League", "USA", "USL"],
  "20226": ["Women's FA Cup", "England", "FAC"],
  "20956": ["Liga F", "Spain", "F"],
  "20955": ["Premiere Ligue", "France", "D1"],
  "735": ["Scottish Premiership", "Scotland", "SPL"],
  "3959": ["Scottish Cup", "Scotland", "SC"],
  "3906": ["A-League Men", "Australia", "A"],
  "18992": ["A-League Women", "Australia", "AW"],
  "21231": ["Saudi Pro League", "Saudi Arabia", "SPL"],
  "715": ["Primeira Liga", "Portugal", "POR"],
  "3946": ["Turkish Super Lig", "Türkiye", "TSL"],
  "4002": ["USL Championship", "USA", "USLC"],
  "19915": ["USL League One", "USA", "USL1"],
  "3932": ["Liga de Expansión MX", "Mexico", "MX"],
  "23541": ["Liga MX", "Mexico", "MX"],
  "3939": ["Russian Premier League", "Russia", "RPL"],
  "3901": ["Belgian Pro League", "Belgium", "BEL"],
  "3921": ["Segunda División", "Spain", "2ª"],
  "3927": ["2. Bundesliga", "Germany", "2BL"],
  "3931": ["Serie B", "Italy", "B"],
  "3926": ["Ligue 2", "France", "L2"],
  "3907": ["Austrian Bundesliga", "Austria", "AUT"],
  "3955": ["Greek Super League", "Greece", "GRE"],
  "8376": ["Chinese Super League", "China", "CSL"],
  "20865": ["FIFA U-17 World Cup", "International", "U17"],
  "3915": ["EFL League One", "England", "L1"],
  "3916": ["EFL League Two", "England", "L2"],
  "3917": ["National League", "England", "NL"],
  "3940": ["Scottish Championship", "Scotland", "SC"],
  "3933": ["Eerste Divisie", "Netherlands", "ED"],
  "3945": ["Allsvenskan", "Sweden", "SWE"],
  "3960": ["Eliteserien", "Norway", "NOR"],
  "745": ["Primera División", "Argentina", "ARG"],
  "3903": ["Primera Nacional", "Argentina", "PN"],
  "3904": ["Primera B Metropolitana", "Argentina", "PB"],
  "630": ["Brasileirão Série A", "Brazil", "BRA"],
  "4007": ["Brasileirão Série B", "Brazil", "BRB"],
  "640": ["Primera División", "Chile", "CHI"],
  "680": ["Primera División", "Uruguay", "URU"],
  "650": ["Primera A", "Colombia", "COL"],
  "670": ["Primera División", "Peru", "PER"],
  "3934": ["Primera División", "Paraguay", "PAR"],
  "660": ["LigaPro Serie A", "Ecuador", "ECU"],
  "620": ["División Profesional", "Bolivia", "BOL"],
  "750": ["J1 League", "Japan", "J1"],
  "3929": ["Liga Nacional", "Honduras", "HON"],
  "4005": ["Primera División", "Costa Rica", "CRC"],
  "3928": ["Liga Nacional", "Guatemala", "GUA"],
  "3943": ["Primera División", "El Salvador", "SLV"],
  "8316": ["Indian Super League", "India", "ISL"],
  "2391": ["CAF Champions League", "Africa", "CAF"],
  "18000": ["Egyptian Premier League", "Egypt", "EGY"],
  "5487": ["NCAA Division I Men's Soccer", "USA", "NCAA"],
  "5499": ["NCAA Division I Women's Soccer", "USA", "NCAA"]
};

const competitionOrder = [
  "700", "740", "720", "730", "710",
  "715", "725", "630", "745", "760", "23541", "770", "21231", "3946", "3901",
  "735", "3939", "3907", "3955", "750", "3945", "3960", "8376", "640", "650",
  "660", "680", "670", "620", "8316",
  "8301", "8097", "20956", "18992", "20955", "23633",
  "3914", "3927", "3931", "3926", "3921", "3933", "3940", "4002", "4007",
  "3932", "3903", "3904", "19915", "3915", "3916", "3917", "3929", "3928",
  "4005", "3943",
  "20226", "3959", "20865", "2391", "18000", "5487", "5499"
];
const competitionRanks = new Map(competitionOrder.map((id, index) => [id, index]));
const lastVisibleCompetitionRank = competitionRanks.get("745");
const defaultVisibleCompetitionIds = new Set(
  competitionOrder.slice(0, lastVisibleCompetitionRank + 1)
);
let visibleCompetitionIds = new Set(defaultVisibleCompetitionIds);

const state = {
  matches: [],
  competitions: [...leagues],
  standings: new Map(),
  leagueStats: new Map(),
  selectedDate: dateKey(new Date()),
  selectedLeague: "all",
  filter: "upcoming",
  page: "fixtures",
  favoritesOnly: false,
  favoriteIds: readFavorites(),
  loading: false,
  detailMatchId: null,
  detailTab: "overview",
  detailData: null,
  detailLoading: false,
  detailError: "",
  detailRequest: 0,
  matchError: "",
  playerDialog: document.querySelector("#player-dialog"),
  playerDialogBody: document.querySelector("#player-dialog-body")
};

const elements = {
  appLayout: document.querySelector("#fixtures"),
  adminNavLink: document.querySelector("#admin-nav-link"),
  adminLoginLink: document.querySelector("#admin-login-link"),
  adminAuthDialog: document.querySelector("#admin-auth-dialog"),
  adminAuthForm: document.querySelector("#admin-auth-form"),
  adminAuthEmail: document.querySelector("#admin-auth-email"),
  adminAuthPassword: document.querySelector("#admin-auth-password"),
  adminAuthNotice: document.querySelector("#admin-auth-notice"),
  adminAuthSubmit: document.querySelector("#admin-auth-submit"),
  adminResetRequest: document.querySelector("#admin-reset-request"),
  adminPanelView: document.querySelector("#admin-panel-view"),
  adminPanelFrame: document.querySelector("#admin-panel-frame"),
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
  standingsContent: document.querySelector("#standings-content"),
  leagueStatsView: document.querySelector("#league-stats-view"),
  leagueStatsTitle: document.querySelector("#league-stats-title"),
  leagueStatsSource: document.querySelector("#league-stats-source"),
  leagueStatsContent: document.querySelector("#league-stats-content"),
  detailView: document.querySelector("#match-detail-view"),
  detailContent: document.querySelector("#match-detail-content"),
  detailUpdated: document.querySelector("#detail-updated"),
  siteAnnouncement: document.querySelector("#site-announcement"),
  adDialog: document.querySelector("#ad-dialog"),
  adDialogLabel: document.querySelector(".ad-dialog-label"),
  adDialogTitle: document.querySelector("#ad-dialog-title"),
  adDialogMessage: document.querySelector("#ad-dialog-message"),
  adDialogLink: document.querySelector("#ad-dialog-link")
};
let siteAdminClient = null;
let signedInSiteAdmin = false;

function dateKey(date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

function parseDate(key) {
  return new Date(Number(key.slice(0, 4)), Number(key.slice(4, 6)) - 1, Number(key.slice(6, 8)));
}

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem("touchline-favorites") || "[]");
    return new Set(Array.isArray(saved) ? saved.map(String) : []);
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
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function teamLogo(team) {
  if (!team || typeof team !== "object") return "";
  const logos = Array.isArray(team.logos) ? team.logos
    : Array.isArray(team.teamLogos) ? team.teamLogos : [];
  const preferred = logos.find((logo) => logo.rel && logo.rel.includes("default")) || logos[0];
  const url = preferred && (preferred.href || preferred.url)
    || typeof (team.logo || team.teamLogo) === "string" && (team.logo || team.teamLogo)
    || (team.logo || team.teamLogo) && ((team.logo || team.teamLogo).href || (team.logo || team.teamLogo).url)
    || (team.id || team.teamId) && `https://a.espncdn.com/i/teamlogos/soccer/500/${encodeURIComponent(team.id || team.teamId)}.png`;
  return typeof url === "string" && /^https:\/\/[a-z0-9.-]+\/.+/i.test(url) ? url : "";
}

function clubBadge(team, sizeClass = "") {
  const name = team && (team.displayName || team.name) || "Club";
  const logo = teamLogo(team);
  return `<span class="club-badge ${sizeClass}" role="img" aria-label="${escapeHtml(name)}">
    ${logo ? `<img class="club-badge-image" src="${escapeHtml(logo)}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ""}
    <span class="club-badge-fallback"${logo ? " hidden" : ""} aria-hidden="true">${escapeHtml(initials(team || {}))}</span>
  </span>`;
}

document.addEventListener("error", (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  if (image.classList.contains("match-media-image")) {
    const card = image.closest(".match-media-card");
    if (card) card.hidden = true;
    return;
  }
  if (!image.classList.contains("club-badge-image")) return;
  image.hidden = true;
  const fallback = image.nextElementSibling;
  if (fallback) fallback.hidden = false;
}, true);

function renderHeaderDate() {
  elements.headerDate.textContent = formatDate(new Date(), {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

function renderLeagueFilters() {
  const competitions = state.competitions.filter((league) => league.id !== "all");
  document.querySelector('[data-league="all"]').classList.toggle("selected", state.selectedLeague === "all");
  elements.leagueFilters.innerHTML = competitions.map((league) => `
    <button class="league-filter${league.id === state.selectedLeague ? " selected" : ""}" type="button" data-league="${escapeHtml(league.id)}">
      <span class="side-icon">${escapeHtml(league.mark)}</span>${escapeHtml(league.name)}
    </button>
  `).join("");
}

function compareCompetitions(a, b) {
  const aRank = competitionRanks.get(String(a.espnId || "")) ?? Number.MAX_SAFE_INTEGER;
  const bRank = competitionRanks.get(String(b.espnId || "")) ?? Number.MAX_SAFE_INTEGER;
  return aRank - bRank || a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
}

function renderDateStrip() {
  const today = new Date();
  elements.dateStrip.innerHTML = Array.from({ length: 11 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index - 3);
    const key = dateKey(date);
    const selected = key === state.selectedDate;
    return `
      <button class="date-button${selected ? " selected" : ""}" type="button" data-date="${key}" aria-pressed="${selected}">
        <span class="date-day">${key === dateKey(today) ? "Today" : formatDate(date, { weekday: "short" })}</span>
        <span class="date-number">${formatDate(date, { month: "short", day: "numeric" })}</span>
      </button>
    `;
  }).join("");
}

function getEventLeague(event, fallbackId) {
  const leagueUid = event.uid && event.uid.match(/~l:(\d+)/);
  const espnId = leagueUid ? leagueUid[1] : "";
  const knownLeague = leagues.find((league) => league.espnId === espnId);
  if (knownLeague) return knownLeague;

  const mapped = globalLeagueNames[espnId];
  const seasonSlug = event.season && event.season.slug || "";
  const cleanSlug = seasonSlug.replace(/^\d{4}(?:-\d{2})?-/, "");
  const slugName = cleanSlug && !["regular-season", "fall-season", "first-round", "second-round", "group-stage"].includes(cleanSlug)
    ? cleanSlug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ")
    : "";
  const name = mapped ? mapped[0] : slugName || `Soccer competition ${espnId || fallbackId}`;
  const generated = {
    id: `espn-${espnId || fallbackId}`,
    espnId,
    name,
    country: mapped ? mapped[1] : "International",
    mark: mapped ? mapped[2] : name.split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase()
  };
  return generated;
}

function mapEvent(event, league) {
  const competition = event.competitions && event.competitions[0];
  const competitors = (competition && competition.competitors) || [];
  const home = competitors.find((team) => team.homeAway === "home") || competitors[0] || {};
  const away = competitors.find((team) => team.homeAway === "away") || competitors[1] || {};
  const status = (event.status && event.status.type) || {};
  return {
    id: String(event.id),
    league,
    home: home.team || {},
    away: away.team || {},
    homeScore: home.score,
    awayScore: away.score,
    date: event.date,
    state: status.state || "pre",
    status: status.shortDetail || status.detail || "",
    note: competition && competition.notes && competition.notes[0]
      ? competition.notes[0].headline : ""
  };
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Feed request failed (${response.status}).`);
  return response.json();
}

function getSupabaseConfig() {
  const config = window.SUPABASE_CONFIG;
  if (!config || typeof config.url !== "string" || typeof config.anonKey !== "string"
    || !config.url.trim() || !config.anonKey.trim()
    || config.url.includes("YOUR_PROJECT") || config.anonKey.includes("YOUR_SUPABASE")) {
    return null;
  }
  return config;
}

function setSiteAdminUser(user) {
  signedInSiteAdmin = Boolean(user && (user.email || "").toLowerCase() === siteAdminEmail);
  elements.adminNavLink.hidden = !signedInSiteAdmin;
  elements.adminLoginLink.textContent = signedInSiteAdmin ? "Admin panel" : "Admin sign in";
  if (!signedInSiteAdmin) {
    elements.adminPanelFrame.src = "about:blank";
    elements.adminPanelView.hidden = true;
    elements.appLayout.hidden = false;
    if (state.page === "admin") {
      state.page = "fixtures";
      history.replaceState(null, "", "#fixtures");
      renderPage();
    }
  } else if (location.hash === "#admin") {
    selectPage("admin");
  }
}

function showAdminAuthNotice(message) {
  elements.adminAuthNotice.textContent = message;
  elements.adminAuthNotice.hidden = false;
}

async function initializeSiteAdmin() {
  const config = getSupabaseConfig();
  if (!config || !window.supabase || typeof window.supabase.createClient !== "function") return;

  siteAdminClient = window.supabase.createClient(config.url, config.anonKey);
  elements.adminAuthEmail.value = siteAdminEmail;
  const { data, error } = await siteAdminClient.auth.getUser();
  if (error && error.name !== "AuthSessionMissingError") {
    console.error("Could not check the site admin session.", error);
  }
  setSiteAdminUser(data && data.user);
  siteAdminClient.auth.onAuthStateChange((_event, session) => {
    setSiteAdminUser(session && session.user);
  });
}

elements.adminNavLink.addEventListener("click", (event) => {
  event.preventDefault();
  if (signedInSiteAdmin) {
    history.replaceState(null, "", "#admin");
    selectPage("admin");
  }
});

elements.adminLoginLink.addEventListener("click", (event) => {
  event.preventDefault();
  if (signedInSiteAdmin) {
    history.replaceState(null, "", "#admin");
    selectPage("admin");
    return;
  }
  elements.adminAuthNotice.hidden = true;
  elements.adminAuthDialog.showModal();
});

document.querySelector("#admin-auth-close").addEventListener("click", () => {
  elements.adminAuthDialog.close();
});

elements.adminAuthForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!siteAdminClient) {
    showAdminAuthNotice("Admin sign-in is unavailable. Check your connection and try again.");
    return;
  }
  elements.adminAuthSubmit.disabled = true;
  showAdminAuthNotice("Signing in…");
  const { data, error } = await siteAdminClient.auth.signInWithPassword({
    email: elements.adminAuthEmail.value.trim(),
    password: elements.adminAuthPassword.value
  });
  elements.adminAuthPassword.value = "";
  elements.adminAuthSubmit.disabled = false;
  if (error) {
    showAdminAuthNotice(`Sign-in failed: ${error.message}`);
    return;
  }
  if (!data.user || (data.user.email || "").toLowerCase() !== siteAdminEmail) {
    await siteAdminClient.auth.signOut();
    showAdminAuthNotice(`This panel is restricted to ${siteAdminEmail}.`);
    return;
  }
  setSiteAdminUser(data.user);
  elements.adminAuthDialog.close();
  history.replaceState(null, "", "#admin");
  selectPage("admin");
});

elements.adminResetRequest.addEventListener("click", async () => {
  if (!siteAdminClient) {
    showAdminAuthNotice("Password reset is unavailable. Check your connection and try again.");
    return;
  }
  elements.adminResetRequest.disabled = true;
  const { error } = await siteAdminClient.auth.resetPasswordForEmail(siteAdminEmail, {
    redirectTo: `${location.origin}/admin.html`
  });
  elements.adminResetRequest.disabled = false;
  showAdminAuthNotice(error
    ? `Could not send a reset email: ${error.message}`
    : `If an account exists for ${siteAdminEmail}, a password reset email has been sent.`);
});

function maybeShowSiteAd(settings) {
  if (!settings.ad_enabled || !elements.adDialog || !settings.ad_title || !settings.ad_message
    || !settings.ad_cta_label || !settings.ad_url) return;

  let destination;
  try {
    destination = new URL(settings.ad_url);
  } catch {
    return;
  }
  if (destination.protocol !== "https:") return;

  const storageKey = "90plus-ad-last-shown";
  try {
    const lastShown = Number(localStorage.getItem(storageKey));
    if (Number.isFinite(lastShown) && Date.now() - lastShown < 24 * 60 * 60 * 1000) return;
  } catch (error) {
    console.error("Could not check the popup ad frequency setting.", error);
    return;
  }

  elements.adDialogTitle.textContent = settings.ad_title;
  elements.adDialogMessage.textContent = settings.ad_message;
  elements.adDialogLink.textContent = settings.ad_cta_label;
  elements.adDialogLink.href = destination.href;
  elements.adDialogLabel.textContent = destination.host === "peckins1st-2nd-project.vercel.app"
    ? "90+minutes featured"
    : "Advertisement";
  const showAd = () => {
    if (elements.adDialog.open) return;
    if (document.hidden) {
      document.addEventListener("visibilitychange", showAd, { once: true });
      return;
    }
    try {
      elements.adDialog.showModal();
      localStorage.setItem(storageKey, String(Date.now()));
    } catch (error) {
      console.error("Could not show the popup ad.", error);
    }
  };
  window.setTimeout(showAd, 12000);
}

async function recordSiteVisit() {
  const config = getSupabaseConfig();
  if (!config) return;
  try {
    let sessionId = sessionStorage.getItem("90plus-visit-session");
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("90plus-visit-session", sessionId);
    }
    const response = await fetch(`${config.url.replace(/\/+$/, "")}/rest/v1/rpc/record_site_visit`, {
      method: "POST",
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ p_session_id: sessionId })
    });
    if (!response.ok) throw new Error(`Visitor count request failed (${response.status}).`);
  } catch (error) {
    console.error("Could not record an anonymous visitor session.", error);
  }
}

function applySiteSettings(settings) {
  if (!settings || typeof settings !== "object") return;
  const brandName = typeof settings.brand_name === "string" ? settings.brand_name.trim() : "";
  if (brandName) {
    const brandText = document.querySelector("[data-site-brand]");
    brandText.textContent = brandName;
    document.querySelector(".brand").setAttribute("aria-label", `${brandName} home`);
    document.title = `${brandName} — Soccer Fixtures`;
  }

  if (elements.siteAnnouncement && typeof settings.announcement === "string") {
    const announcement = settings.announcement.trim();
    elements.siteAnnouncement.textContent = announcement;
    elements.siteAnnouncement.hidden = !announcement;
  }

  if (Array.isArray(settings.featured_competitions)) {
    const selected = settings.featured_competitions
      .filter((id) => typeof id === "string" && defaultFeaturedCompetitionIds.includes(id));
    if (selected.length) visibleCompetitionIds = new Set(selected);
  }
  maybeShowSiteAd(settings);
}

async function loadPublicSiteSettings() {
  const config = getSupabaseConfig();
  if (!config) return false;
  try {
    const baseUrl = config.url.replace(/\/+$/, "");
    let extendedSettingsLoaded = true;
    let response = await fetch(`${baseUrl}/rest/v1/site_settings?id=eq.true&select=brand_name,announcement,featured_competitions,ad_enabled,ad_title,ad_message,ad_cta_label,ad_url`, {
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`
      }
    });
    if (response.status === 400) {
      response = await fetch(`${baseUrl}/rest/v1/site_settings?id=eq.true&select=brand_name,announcement,featured_competitions`, {
        headers: {
          apikey: config.anonKey,
          Authorization: `Bearer ${config.anonKey}`
        }
      });
      extendedSettingsLoaded = false;
      if (response.ok) console.warn("Popup ads need the updated site_settings columns from supabase-schema.sql.");
    }
    if (!response.ok) throw new Error(`Settings request failed (${response.status}).`);
    const rows = await response.json();
    if (Array.isArray(rows) && rows[0]) {
      applySiteSettings(extendedSettingsLoaded
        ? rows[0]
        : { ...rows[0], ...defaultSitePromotion });
    }
    return extendedSettingsLoaded && Array.isArray(rows) && Boolean(rows[0]);
  } catch (error) {
    console.error("Could not load shared site settings.", error);
    return false;
  }
}

async function fetchMatches() {
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard?dates=${state.selectedDate}&limit=1000`;
  const data = await fetchJson(url);
  state.matches = (data.events || []).filter((event) => {
    const leagueUid = event.uid && event.uid.match(/~l:(\d+)/);
    return leagueUid && visibleCompetitionIds.has(leagueUid[1]);
  }).map((event) => {
    const competition = getEventLeague(event, event.id);
    return mapEvent(event, competition);
  });
  state.matches.sort((a, b) => new Date(a.date) - new Date(b.date));
  const competitionMap = new Map([...leagues, ...state.matches.map((match) => match.league)]
    .map((league) => [league.id, league]));
  state.competitions = [...competitionMap.values()].sort(compareCompetitions);
  if (state.selectedLeague !== "all"
    && !state.competitions.some((league) => league.id === state.selectedLeague)) {
    state.selectedLeague = "all";
  }
  renderLeagueFilters();
  return 0;
}

function flattenStandings(node) {
  if (!node || typeof node !== "object") return [];
  const entries = node.standings && Array.isArray(node.standings.entries)
    ? node.standings.entries : [];
  return entries.concat((node.children || []).flatMap(flattenStandings));
}

function statValue(entry, names) {
  const stat = (entry.stats || []).find((item) => names.includes(item.name));
  return stat ? stat.displayValue ?? stat.value ?? "—" : "—";
}

function mapStanding(entry, index) {
  return {
    rank: statValue(entry, ["rank", "playoffSeed"]) || index + 1,
    team: entry.team && entry.team.displayName || "Team",
    teamId: entry.team && entry.team.id || "",
    teamLogos: entry.team && entry.team.logos || [],
    teamLogo: entry.team && entry.team.logo || "",
    played: statValue(entry, ["gamesPlayed", "games"]),
    wins: statValue(entry, ["wins"]),
    draws: statValue(entry, ["ties", "draws"]),
    losses: statValue(entry, ["losses"]),
    goalDifference: statValue(entry, ["pointDifferential", "goalDifference"]),
    points: statValue(entry, ["points"])
  };
}

async function fetchStandings() {
  const results = await Promise.allSettled(leagues.map(async (league) => {
    const url = `https://site.web.api.espn.com/apis/v2/sports/soccer/${league.id}/standings?region=us&lang=en&contentorigin=espn`;
    const data = await fetchJson(url);
    const entries = flattenStandings(data);
    if (!entries.length) throw new Error(`No standings returned for ${league.name}.`);
    state.standings.set(league.id, entries.map(mapStanding));
  }));
  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length === leagues.length) {
    throw new Error(failed.map((result) => result.reason.message).join(" "));
  }
  return failed.length;
}

function mapLeagueStatCategory(category) {
  return {
    id: category.name || category.abbreviation || category.displayName,
    name: (category.displayName || category.name || "Player statistics").replace(/\s+leaders$/i, ""),
    leaders: (category.leaders || []).map((leader) => ({
      name: leader.athlete && (leader.athlete.displayName || leader.athlete.fullName) || "Player",
      team: leader.athlete && leader.athlete.team && leader.athlete.team.displayName || "",
      teamId: leader.athlete && leader.athlete.team && leader.athlete.team.id || "",
      teamLogos: leader.athlete && leader.athlete.team && leader.athlete.team.logos || [],
      teamLogo: leader.athlete && leader.athlete.team && leader.athlete.team.logo || "",
      value: leader.value ?? leader.displayValue ?? "—",
      detail: leader.displayValue || ""
    }))
  };
}

async function fetchLeagueStats(league) {
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${league.id}/statistics`;
  const data = await fetchJson(url);
  const categories = (data.stats || []).map(mapLeagueStatCategory)
    .filter((category) => category.leaders.length);
  if (!categories.length) throw new Error(`No player leader stats were returned for ${league.name}.`);
  return { season: data.season && data.season.displayName || "", categories };
}

async function loadLeagueStats(force = false) {
  const selectedLeagues = state.selectedLeague === "all"
    ? leagues : [state.competitions.find((league) => league.id === state.selectedLeague)].filter(Boolean);
  const requests = selectedLeagues.map(async (league) => {
    if (!leagues.some((supported) => supported.id === league.id)) {
      state.leagueStats.set(league.id, {
        loading: false,
        categories: [],
        season: "",
        error: `Player leader statistics are not available for ${league.name} from ESPN.`
      });
      return;
    }
    if (!force && state.leagueStats.has(league.id)) return;
      state.leagueStats.set(league.id, { loading: true, categories: [], season: "", error: "" });
      try {
        const data = await fetchLeagueStats(league);
        state.leagueStats.set(league.id, { ...data, loading: false, error: "" });
      } catch (error) {
        state.leagueStats.set(league.id, { loading: false, categories: [], season: "", error: error.message });
      }
      renderLeagueStats();
  });

  renderLeagueStats();
  await Promise.all(requests);
}

function listFrom(value) {
  if (Array.isArray(value)) return value;
  if (value && Array.isArray(value.items)) return value.items;
  if (value && Array.isArray(value.events)) return value.events;
  return [];
}

function sameTeam(candidate, team) {
  if (!candidate || !team) return false;
  const candidateId = candidate.id || candidate.team && candidate.team.id;
  if (candidateId && team.id && String(candidateId) === String(team.id)) return true;
  const name = candidate.displayName || candidate.name
    || candidate.team && (candidate.team.displayName || candidate.team.name);
  return Boolean(name && name === (team.displayName || team.name));
}

function getTeamRoster(summary, team, side) {
  const sections = listFrom(summary.rosters);
  const section = sections.find((item) => sameTeam(item.team || item, team))
    || sections.find((item) => item.homeAway === side);
  let roster = section && (section.roster || section.athletes || section.players);
  if (!Array.isArray(roster)) {
    const playerSection = listFrom(summary.boxscore && summary.boxscore.players)
      .find((item) => sameTeam(item.team, team));
    roster = (playerSection && playerSection.statistics || [])
      .flatMap((group) => group.athletes || []);
  }
  return {
    formation: section && (section.formation || section.formationName) || "",
    players: (roster || []).map((item) => {
      const athlete = item.athlete || item;
      return {
        id: String(athlete.id || athlete.uid || ""),
        name: athlete.displayName || athlete.fullName || athlete.name || "Player",
        number: athlete.jersey || item.jersey || "",
        position: item.position && (item.position.displayName || item.position.abbreviation)
          || athlete.position && (athlete.position.displayName || athlete.position.abbreviation) || "",
        starter: Boolean(item.starter),
        subbedIn: Boolean(item.subbedIn),
        subbedOut: Boolean(item.subbedOut),
        stats: (item.stats || []).map((stat) => ({
          name: stat.displayName || stat.name || stat.abbreviation || "",
          value: stat.displayValue ?? stat.value ?? "—"
        })).filter((stat) => stat.name)
      };
    })
  };
}

function getTeamStatistics(summary, match) {
  const sections = listFrom(summary.boxscore && summary.boxscore.teams);
  const home = sections.find((item) => sameTeam(item.team || item, match.home));
  const away = sections.find((item) => sameTeam(item.team || item, match.away));
  if (!home || !away) return [];
  const toMap = (section) => new Map((section.statistics || []).map((stat) => [
    stat.name || stat.label || stat.abbreviation,
    stat.displayValue ?? stat.value ?? "—"
  ]));
  const homeStats = toMap(home);
  const awayStats = toMap(away);
  return [...homeStats.entries()].filter(([name]) => name && awayStats.has(name))
    .map(([name, value]) => ({
      name,
      home: value,
      away: awayStats.get(name),
      homeNumber: Number.parseFloat(value),
      awayNumber: Number.parseFloat(awayStats.get(name))
    }));
}

function getPlayerStatistics(summary) {
  const rosterPlayers = listFrom(summary.rosters).flatMap((section) =>
    (section.roster || []).map((item) => {
      const athlete = item.athlete || item;
      return {
        id: String(athlete.id || athlete.uid || ""),
        teamId: String(section.team && section.team.id || ""),
        team: section.team && (section.team.displayName || section.team.name) || "",
        name: athlete.displayName || athlete.fullName || athlete.name || "Player",
        number: item.jersey || athlete.jersey || "",
        position: item.position && (item.position.displayName || item.position.abbreviation) || "",
        starter: Boolean(item.starter),
        subbedIn: Boolean(item.subbedIn),
        subbedOut: Boolean(item.subbedOut),
        stats: (item.stats || []).map((stat) => ({
          name: stat.displayName || stat.name || stat.abbreviation || "",
          value: stat.displayValue ?? stat.value ?? "—"
        })).filter((stat) => stat.name)
      };
    }).filter((player) => player.stats.length)
  );
  if (rosterPlayers.length) return rosterPlayers;

  return listFrom(summary.boxscore && summary.boxscore.players).flatMap((section) =>
    (section.statistics || []).flatMap((group) => (group.athletes || []).map((player) => {
      const labels = player.labels || group.labels || [];
      return {
        id: String(player.athlete && player.athlete.id || ""),
        teamId: String(section.team && section.team.id || ""),
        team: section.team && section.team.displayName || "",
        name: player.athlete && (player.athlete.displayName || player.athlete.fullName) || "Player",
        stats: (player.stats || []).map((value, index) => ({
          name: labels[index] || `Stat ${index + 1}`,
          value
        }))
      };
    }).filter((player) => player.stats.length))
  );
}

function getMatchEvents(summary) {
  return listFrom(summary.keyEvents).length ? listFrom(summary.keyEvents)
    : listFrom(summary.plays).length ? listFrom(summary.plays)
      : listFrom(summary.commentary);
}

function safeEspnUrl(value, allowedDomains) {
  if (typeof value !== "string") return "";
  try {
    const url = new URL(value);
    const allowed = allowedDomains.some((domain) =>
      url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    );
    return url.protocol === "https:" && allowed ? url.href : "";
  } catch (error) {
    return "";
  }
}

function getRelatedMatchMedia(summary, match) {
  const teamNames = [match.home, match.away]
    .flatMap((team) => [team.displayName, team.name, team.shortDisplayName])
    .filter((name) => typeof name === "string" && name.trim().length > 3)
    .map((name) => name.toLocaleLowerCase());
  const candidates = [
    ...listFrom(summary.videos).map((item) => ({
      title: item.headline || item.description || "ESPN video",
      description: item.description || "",
      image: item.thumbnail,
      link: item.links && item.links.web && item.links.web.href || item.link,
      type: "ESPN video"
    })),
    ...listFrom(summary.news && summary.news.articles).map((item) => {
      const firstImage = listFrom(item.images)[0];
      return {
        title: item.headline || item.description || "ESPN article",
        description: item.description || "",
        image: typeof firstImage === "string" ? firstImage : firstImage && (firstImage.url || firstImage.href),
        link: item.links && item.links.web && item.links.web.href || item.link,
        type: "ESPN article"
      };
    })
  ];
  const unique = new Set();
  return candidates.filter((item) => {
    const searchText = `${item.title} ${item.description || ""}`.toLocaleLowerCase();
    if (!teamNames.some((name) => searchText.includes(name))) return false;
    item.image = safeEspnUrl(item.image, ["espncdn.com", "akamaized.net"]);
    item.link = safeEspnUrl(item.link, ["espn.com"]);
    if (!item.image || !item.link || unique.has(item.image)) return false;
    unique.add(item.image);
    return true;
  }).slice(0, 6);
}

function renderRelatedMatchMedia(summary, match) {
  const items = getRelatedMatchMedia(summary, match);
  if (!items.length) {
    return `<section class="match-media">
      <h3>Related ESPN coverage</h3>
      <p class="media-note">No team-related ESPN images are available for this match yet.</p>
    </section>`;
  }
  return `<section class="match-media">
    <h3>Related ESPN coverage</h3>
    <p class="media-note">These are ESPN article or video previews and may not show action from this match.</p>
    <div class="match-media-grid">${items.map((item) => `
      <a class="match-media-card" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">
        <img class="match-media-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" referrerpolicy="no-referrer">
        <span class="match-media-caption"><small>${escapeHtml(item.type)}</small><strong>${escapeHtml(item.title)}</strong></span>
      </a>
    `).join("")}</div>
  </section>`;
}

function updateMatchFromSummary(match, summary) {
  const competition = summary.header && summary.header.competitions
    && summary.header.competitions[0];
  if (!competition) return;
  for (const competitor of competition.competitors || []) {
    if (sameTeam(competitor.team, match.home) || competitor.homeAway === "home") {
      if (competitor.score !== undefined) match.homeScore = competitor.score;
    } else if (sameTeam(competitor.team, match.away) || competitor.homeAway === "away") {
      if (competitor.score !== undefined) match.awayScore = competitor.score;
    }
  }
  const status = competition.status && (competition.status.type || competition.status);
  if (status) {
    match.state = status.state || match.state;
    match.status = status.shortDetail || status.detail || status.displayClock || match.status;
  }
}

async function loadMatchDetails(matchId, preserveTab = false) {
  const match = state.matches.find((item) => item.id === matchId);
  if (!match) return;
  state.detailMatchId = matchId;
  if (!preserveTab) state.detailTab = "overview";
  if (!preserveTab) state.detailData = null;
  state.detailError = "";
  state.detailLoading = !preserveTab || !state.detailData;
  const requestId = ++state.detailRequest;
  history.replaceState(null, "", `#match/${encodeURIComponent(matchId)}`);
  renderPage();
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/all/summary?event=${encodeURIComponent(matchId)}`;
    const summary = await fetchJson(url);
    if (requestId !== state.detailRequest) return;
    state.detailData = summary;
    updateMatchFromSummary(match, summary);
  } catch (error) {
    if (requestId !== state.detailRequest) return;
    state.detailError = error.message;
  } finally {
    if (requestId === state.detailRequest) {
      state.detailLoading = false;
      elements.detailUpdated.textContent = `Updated ${formatDate(new Date(), { hour: "numeric", minute: "2-digit" })}`;
      renderPage();
    }
  }
}

function renderMatchEvents(summary) {
  const events = getMatchEvents(summary);
  if (!events.length) return `<p class="detail-empty">Match events are not available for this fixture yet.</p>`;
  return `<ol class="event-timeline">${events.slice(-40).reverse().map((item) => {
    const clock = item.clock && (item.clock.displayValue || item.clock.value)
      || item.time || item.period && item.period.displayValue || "";
    const type = item.type && (item.type.text || item.type.name) || "";
    const athlete = item.athlete && (item.athlete.displayName || item.athlete.fullName) || "";
    const text = item.text || item.description || item.headline || item.shortText || "";
    return `<li class="timeline-event"><span class="timeline-time">${escapeHtml(clock || "•")}</span><span>${escapeHtml([type, athlete, text].filter(Boolean).join(" · ") || "Match event")}</span></li>`;
  }).join("")}</ol>`;
}

function renderLineups(summary, match) {
  const renderPlayerButton = (player) => `<button class="player-name-button" type="button" data-player-id="${escapeHtml(player.id)}" data-player-team="${escapeHtml(player.teamId || "")}" data-player-name="${escapeHtml(player.name)}" aria-haspopup="dialog">${escapeHtml(player.name)}<span aria-hidden="true"> ↗</span></button>`;
  const renderTeam = (team, side) => {
    const roster = getTeamRoster(summary, team, side);
    const players = roster.players.length
      ? `<ol>${roster.players.map((player) => `
          <li><span class="lineup-number">${escapeHtml(player.number || "—")}</span>
          ${renderPlayerButton({ ...player, teamId: team.id })}
          <small>${escapeHtml(player.position)}</small></li>
        `).join("")}</ol>`
      : `<p class="detail-empty">Lineup not published yet.</p>`;
    return `<section class="lineup-team"><h3>${clubBadge(team, "club-badge--lineup")}<span class="lineup-team-name">${escapeHtml(team.displayName || team.name)}</span>${roster.formation ? `<span class="lineup-formation">${escapeHtml(roster.formation)}</span>` : ""}</h3>${players}</section>`;
  };
  return `<div class="lineups-grid">${renderTeam(match.home, "home")}${renderTeam(match.away, "away")}</div>`;
}

function renderPlayerDetails(player, match) {
  const appearance = player.starter ? "Started"
    : player.subbedIn ? "Substitute appearance"
      : "Squad player";
  const details = [
    player.number ? { name: "Number", value: player.number } : null,
    player.position ? { name: "Position", value: player.position } : null,
    { name: "Appearance", value: appearance }
  ].filter(Boolean);
  const stats = player.stats && player.stats.length
    ? `<div class="player-detail-stats">${player.stats.map((stat) => `
        <div class="player-detail-stat"><span>${escapeHtml(stat.name)}</span><strong>${escapeHtml(stat.value)}</strong></div>
      `).join("")}</div>`
    : `<p class="detail-empty">Individual match stats are not available for this player.</p>`;
  const fotmobUrl = fotmobLeagueStatsUrls[match.league.espnId];
  state.playerDialogBody.innerHTML = `
    <p class="player-detail-kicker">${escapeHtml(match.league.name)} · Match stats</p>
    <h2 id="player-dialog-title">${escapeHtml(player.name)}</h2>
    <p class="player-detail-team">${escapeHtml(player.team || "Team unavailable")}</p>
    <div class="player-detail-meta">${details.map((item) => `
      <div><span>${escapeHtml(item.name)}</span><strong>${escapeHtml(item.value)}</strong></div>
    `).join("")}</div>
    <h3>Match performance</h3>
    ${stats}
    <p class="player-detail-source">Player match data provided by ESPN.</p>
    ${fotmobUrl ? `<a class="player-fotmob-link" href="${fotmobUrl}" target="_blank" rel="noopener noreferrer">Browse ${escapeHtml(match.league.name)} player stats on FotMob ↗</a>` : ""}
  `;
  if (!state.playerDialog.open) state.playerDialog.showModal();
}

function openPlayerDetails(button) {
  const match = state.matches.find((item) => item.id === state.detailMatchId);
  if (!match || !state.detailData) return;
  const playerId = button.dataset.playerId;
  const teamId = button.dataset.playerTeam;
  const rosterPlayers = [
    ...getTeamRoster(state.detailData, match.home, "home").players.map((player) => ({
      ...player,
      team: match.home.displayName || match.home.name,
      teamId: String(match.home.id || "")
    })),
    ...getTeamRoster(state.detailData, match.away, "away").players.map((player) => ({
      ...player,
      team: match.away.displayName || match.away.name,
      teamId: String(match.away.id || "")
    }))
  ];
  const players = [...rosterPlayers, ...getPlayerStatistics(state.detailData)];
  const player = players.find((item) =>
    playerId && item.id === playerId && (!teamId || item.teamId === teamId)
  ) || players.find((item) =>
    item.name === button.dataset.playerName && (!teamId || item.teamId === teamId)
  );
  if (!player) {
    state.playerDialogBody.innerHTML = `
      <p class="player-detail-kicker">${escapeHtml(match.league.name)} · Match stats</p>
      <h2 id="player-dialog-title">${escapeHtml(button.dataset.playerName || "Player")}</h2>
      <p class="detail-empty">Individual player statistics are not available for this match.</p>
    `;
    if (!state.playerDialog.open) state.playerDialog.showModal();
    return;
  }
  renderPlayerDetails(player, match);
}

function renderStatistics(summary, match) {
  const statistics = getTeamStatistics(summary, match);
  const teamStats = statistics.length
    ? `<div class="team-statistics">
        <div class="team-stat-labels"><strong>${escapeHtml(match.home.displayName || match.home.name)}</strong><span>Team stats</span><strong>${escapeHtml(match.away.displayName || match.away.name)}</strong></div>
        ${statistics.map((stat) => {
          const total = stat.homeNumber + stat.awayNumber;
          const homeWidth = Number.isFinite(total) && total > 0 ? Math.round(stat.homeNumber / total * 100) : 50;
          const label = stat.name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
          return `<div class="team-stat-row"><strong>${escapeHtml(stat.home)}</strong><span>${escapeHtml(label)}</span><strong>${escapeHtml(stat.away)}</strong><div class="stat-bar"><i style="width:${homeWidth}%"></i><i style="width:${100 - homeWidth}%"></i></div></div>`;
        }).join("")}
      </div>`
    : `<p class="detail-empty">Team statistics are not available for this match.</p>`;
  const players = getPlayerStatistics(summary);
  const playerStats = players.length
    ? `<section class="player-stat-list"><h3>Player statistics</h3>
        <div class="player-stat-row player-stat-heading"><strong>Player</strong><span>Team</span><span>Available match stats</span></div>
        ${players.map((player) => `<div class="player-stat-row"><strong><button class="player-name-button" type="button" data-player-id="${escapeHtml(player.id)}" data-player-team="${escapeHtml(player.teamId)}" data-player-name="${escapeHtml(player.name)}" aria-haspopup="dialog">${escapeHtml(player.name)}<span aria-hidden="true"> ↗</span></button></strong><span>${escapeHtml(player.team)}</span><span>${player.stats.map((stat) => `${escapeHtml(stat.name)} ${escapeHtml(stat.value)}`).join(" · ")}</span></div>`).join("")}
      </section>`
    : "";
  return `${teamStats}${playerStats}`;
}

function renderMatchDetails() {
  const match = state.matches.find((item) => item.id === state.detailMatchId);
  if (!match) {
    elements.detailContent.innerHTML = `<div class="empty-state"><strong>Match not found</strong>Go back and choose another fixture.</div>`;
    return;
  }
  const summary = state.detailData || {};
  const score = match.state === "pre" ? "vs" : `${match.homeScore ?? "0"} – ${match.awayScore ?? "0"}`;
  const status = match.state === "in" ? match.status || "LIVE"
    : match.state === "post" ? "Full time"
      : formatDate(new Date(match.date), { dateStyle: "medium", timeStyle: "short" });
  const tabs = ["overview", "lineups", "stats", "media"];
  const panel = state.detailLoading
    ? `<p class="detail-empty">Loading match details…</p>`
    : state.detailError
      ? `<p class="detail-error">Match details could not be loaded: ${escapeHtml(state.detailError)}</p>`
      : state.detailTab === "overview" ? renderMatchEvents(summary)
        : state.detailTab === "lineups" ? renderLineups(summary, match)
          : state.detailTab === "stats" ? renderStatistics(summary, match)
            : renderRelatedMatchMedia(summary, match);
  elements.detailContent.innerHTML = `
    <header class="match-hero">
      <p>${escapeHtml(match.league.name)} · ${escapeHtml(match.league.country)}</p>
      <div class="match-hero-teams">
        <div>${clubBadge(match.home, "club-badge--hero")}<strong>${escapeHtml(match.home.displayName || match.home.name)}</strong></div>
        <strong class="match-hero-score">${escapeHtml(score)}</strong>
        <div>${clubBadge(match.away, "club-badge--hero")}<strong>${escapeHtml(match.away.displayName || match.away.name)}</strong></div>
      </div>
      <span class="match-hero-status${match.state === "in" ? " live" : ""}">${escapeHtml(status)}</span>
    </header>
    <nav class="detail-tabs" role="tablist" aria-label="Match details">
      ${tabs.map((tab) => `<button type="button" role="tab" data-detail-tab="${tab}" aria-selected="${state.detailTab === tab}" class="${state.detailTab === tab ? "active" : ""}">${tab === "stats" ? "Stats" : tab[0].toUpperCase() + tab.slice(1)}</button>`).join("")}
    </nav>
    <div class="detail-panel">${panel}</div>
  `;
}

function getFilteredMatches() {
  const query = elements.searchInput.value.trim().toLocaleLowerCase();
  return state.matches.filter((match) => {
    if (state.selectedLeague !== "all" && match.league.id !== state.selectedLeague) return false;
    if (state.filter === "live" && match.state !== "in") return false;
    if (state.filter === "upcoming" && match.state !== "pre") return false;
    if (state.filter === "finished" && match.state !== "post") return false;
    if (state.favoritesOnly && !state.favoriteIds.has(match.id)) return false;
    const haystack = `${match.home.displayName || ""} ${match.away.displayName || ""} ${match.league.name}`.toLocaleLowerCase();
    return !query || haystack.includes(query);
  });
}

function initials(team) {
  return (team.displayName || team.name || "?").split(/\s+/).slice(0, 2)
    .map((part) => part.charAt(0)).join("").toUpperCase();
}

function matchStatus(match) {
  if (match.state === "in") return { main: match.status || "LIVE", className: "live", note: "Live" };
  if (match.state === "post") return { main: "FT", className: "finished", note: match.status };
  return {
    main: formatDate(new Date(match.date), { hour: "numeric", minute: "2-digit" }),
    className: "",
    note: match.note
  };
}

function renderMatch(match) {
  const status = matchStatus(match);
  const favorite = state.favoriteIds.has(match.id);
  const showScores = match.state !== "pre";
  return `
    <article class="match-row">
      <div class="match-state">
        <span class="match-status ${status.className}">${escapeHtml(status.main)}</span>
        ${status.note ? `<span class="match-note">${escapeHtml(status.note)}</span>` : ""}
        <button class="match-detail-link" type="button" data-match-detail="${escapeHtml(match.id)}">Match details</button>
      </div>
      <div class="teams">
        <div class="team">${clubBadge(match.home, "club-badge--fixture")}<span class="team-name">${escapeHtml(match.home.displayName || match.home.name || "Home")}</span></div>
        <div class="team">${clubBadge(match.away, "club-badge--fixture")}<span class="team-name">${escapeHtml(match.away.displayName || match.away.name || "Away")}</span></div>
      </div>
      <div class="scores${showScores ? " has-score" : ""}">${showScores ? `${escapeHtml(match.homeScore ?? "0")}<br>${escapeHtml(match.awayScore ?? "0")}` : "–<br>–"}</div>
      <button class="favorite-button${favorite ? " selected" : ""}" type="button" data-favorite="${escapeHtml(match.id)}" aria-label="${favorite ? "Remove favorite" : "Add favorite"}" aria-pressed="${favorite}">${favorite ? "★" : "☆"}</button>
    </article>
  `;
}

function renderMatches() {
  const matches = getFilteredMatches();
  elements.matchCount.textContent = String(matches.length);
  if (!matches.length) {
    const title = !state.matches.length
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
  elements.matchList.innerHTML = [...groups.entries()].sort(([aId], [bId]) => {
    const a = groups.get(aId)[0].league;
    const b = groups.get(bId)[0].league;
    return compareCompetitions(a, b);
  }).map(([leagueId, leagueMatches]) => {
    const league = leagues.find((item) => item.id === leagueId) || leagueMatches[0].league;
    return `<section class="league-group">
      <div class="league-heading"><span class="league-symbol">${escapeHtml(league.mark)}</span><span class="league-name">${escapeHtml(league.name)}</span><span class="league-country">${escapeHtml(league.country)}</span><span class="league-match-count">${leagueMatches.length} ${leagueMatches.length === 1 ? "match" : "matches"}</span></div>
      ${leagueMatches.map(renderMatch).join("")}
    </section>`;
  }).join("");
}

function renderStandings() {
  const selected = state.selectedLeague === "all"
    ? leagues : [state.competitions.find((league) => league.id === state.selectedLeague)].filter(Boolean);
  const available = selected.filter((league) => state.standings.has(league.id));
  elements.standingsTitle.textContent = state.selectedLeague === "all"
    ? "League standings" : selected.length ? `${selected[0].name} standings` : "League standings";
  if (state.selectedLeague === "all") {
    elements.standingsSource.textContent = "Tables for ESPN-supported leagues";
  }
  if (!available.length) {
    const message = state.selectedLeague === "all"
      ? "Tables are available for the five leagues supported by ESPN standings."
      : `ESPN does not provide a league table for ${escapeHtml(selected[0] && selected[0].name || "this competition")}.`;
    elements.standingsContent.innerHTML = `<div class="empty-state"><strong>Standings are unavailable</strong>${message}</div>`;
    return;
  }
  elements.standingsContent.innerHTML = available.map((league) => `
    <section class="table-league">
      <h3><span class="league-symbol">${league.mark}</span>${escapeHtml(league.name)}<span>${escapeHtml(league.country)}</span></h3>
      <div class="table-scroll"><table class="standings-table">
        <thead><tr><th>Pos</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead>
        <tbody>${state.standings.get(league.id).map((team) => `
          <tr><td>${escapeHtml(team.rank)}</td><td><span class="table-club">${clubBadge(team, "club-badge--table")}<span>${escapeHtml(team.team)}</span></span></td><td>${escapeHtml(team.played)}</td><td>${escapeHtml(team.wins)}</td><td>${escapeHtml(team.draws)}</td><td>${escapeHtml(team.losses)}</td><td>${escapeHtml(team.goalDifference)}</td><td><strong>${escapeHtml(team.points)}</strong></td></tr>
        `).join("")}</tbody>
      </table></div>
    </section>
  `).join("");
}

function renderLeagueStats() {
  const selected = state.selectedLeague === "all"
    ? leagues : [state.competitions.find((league) => league.id === state.selectedLeague)].filter(Boolean);
  elements.leagueStatsTitle.textContent = state.selectedLeague === "all"
    ? "League leaders" : selected.length ? `${selected[0].name} leaders` : "League leaders";

  const complete = selected.filter((league) => state.leagueStats.has(league.id)
    && !state.leagueStats.get(league.id).loading);
  const seasons = [...new Set(complete.map((league) => state.leagueStats.get(league.id).season).filter(Boolean))];
  elements.leagueStatsSource.textContent = seasons.length === 1
    ? `${seasons[0]} · ESPN`
    : seasons.length > 1 ? `${seasons.length} seasons · ESPN` : "Season stats by ESPN";

  if (selected.some((league) => !state.leagueStats.has(league.id) || state.leagueStats.get(league.id).loading)) {
    elements.leagueStatsContent.innerHTML = `<div class="empty-state"><strong>Loading league leaders…</strong>Fetching player statistics for the selected competitions.</div>`;
    return;
  }

  const successful = selected.filter((league) => state.leagueStats.get(league.id).categories.length);
  if (!successful.length) {
    const errors = selected.map((league) => state.leagueStats.get(league.id).error).filter(Boolean);
    elements.leagueStatsContent.innerHTML = `<div class="empty-state"><strong>League stats are unavailable</strong>${escapeHtml(errors.join(" "))}</div>`;
    return;
  }

  const categoryOrder = (category) => {
    const key = category.id.toLowerCase();
    if (key.includes("goal") && !key.includes("conceded")) return 0;
    if (key.includes("assist")) return 1;
    if (key.includes("cleansheet") || key.includes("clean_sheet")) return 2;
    return 3;
  };

  elements.leagueStatsContent.innerHTML = successful.map((league) => {
    const data = state.leagueStats.get(league.id);
    const categories = [...data.categories].sort((a, b) => categoryOrder(a) - categoryOrder(b));
    const hasCleanSheets = categories.some((category) => /clean[\s_-]?sheets?/i.test(`${category.id} ${category.name}`));
    const cards = categories.map((category) => {
      const rows = [...category.leaders]
        .sort((a, b) => (Number(b.value) || 0) - (Number(a.value) || 0))
        .slice(0, 5);
      return `<section class="leader-card">
        <h4>${escapeHtml(category.name)}</h4>
        <ol>${rows.map((leader, index) => `
          <li><span class="leader-rank">${index + 1}</span>
            <span class="leader-player"><strong>${escapeHtml(leader.name)}</strong><small>${clubBadge(leader, "club-badge--leader")}<span>${escapeHtml(leader.team || "Club unavailable")}</span></small></span>
            <strong class="leader-value">${escapeHtml(leader.value)}</strong>
          </li>
        `).join("")}</ol>
      </section>`;
    });
    if (!hasCleanSheets) {
      cards.push(`<section class="leader-card leader-unavailable">
        <h4>Clean sheets</h4>
        <p>This stat is not provided in ESPN's current league leaders feed.</p>
      </section>`);
    }
    return `<section class="league-leaders">
      <header><span class="league-symbol">${league.mark}</span><h3>${escapeHtml(league.name)}</h3><span>${escapeHtml(league.country)}</span></header>
      <div class="leader-grid">${cards.join("")}</div>
    </section>`;
  }).join("") + selected.filter((league) => !state.leagueStats.get(league.id).categories.length)
    .map((league) => `<div class="empty-state"><strong>${escapeHtml(league.name)} stats unavailable</strong>${escapeHtml(state.leagueStats.get(league.id).error)}</div>`)
    .join("");
}

function renderPage() {
  if (state.page === "admin") {
    elements.appLayout.hidden = true;
    elements.adminPanelView.hidden = false;
    if (elements.adminPanelFrame.src === "about:blank" || !elements.adminPanelFrame.src) {
      elements.adminPanelFrame.src = "admin.html?embedded=1";
    }
    document.querySelectorAll(".primary-link").forEach((link) => {
      const selected = link === elements.adminNavLink;
      link.classList.toggle("selected", selected);
      if (selected) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    return;
  }
  elements.appLayout.hidden = false;
  elements.adminPanelView.hidden = true;
  const isDetail = Boolean(state.detailMatchId);
  const isStandings = state.page === "standings";
  const isLeagueStats = state.page === "stats";
  elements.matchCount.hidden = isDetail || isStandings || isLeagueStats;
  elements.matchView.hidden = isStandings || isDetail;
  elements.standingsView.hidden = !isStandings || isDetail;
  elements.leagueStatsView.hidden = !isLeagueStats || isDetail;
  elements.detailView.hidden = !isDetail;
  document.querySelectorAll(".primary-link").forEach((link) => {
    const selected = link.dataset.page === state.page;
    link.classList.toggle("selected", selected);
    if (selected) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
  document.querySelector(".section-kicker").textContent = isDetail
    ? "FOOTBALL / MATCH CENTRE" : `FOOTBALL / ${state.page.toUpperCase()}`;
  document.querySelector("h1").childNodes[0].textContent = isDetail ? "Match centre "
    : state.page === "standings" ? "Standings " : state.page === "stats" ? "Player stats " : state.page === "scores" ? "Scores " : "Matches ";
  elements.dateStrip.hidden = isStandings || isLeagueStats || isDetail;
  elements.refreshButton.hidden = isDetail;
  elements.refreshButton.disabled = state.loading;
  if (isDetail) renderMatchDetails();
  else if (isStandings) renderStandings();
  else if (isLeagueStats) renderLeagueStats();
  else renderMatches();
}

async function loadData() {
  if (state.loading) return;
  state.loading = true;
  elements.refreshButton.disabled = true;
  elements.lastUpdated.textContent = "Loading fixtures…";
  const tasks = [fetchMatches()];
  if (state.standings.size < leagues.length) tasks.push(fetchStandings());
  const results = await Promise.allSettled(tasks);
  const matchResult = results[0];
  if (matchResult.status === "fulfilled") {
    state.matchError = "";
    const dateLabel = formatDate(parseDate(state.selectedDate), { month: "short", day: "numeric" });
    elements.lastUpdated.textContent = `Updated ${formatDate(new Date(), { hour: "numeric", minute: "2-digit" })} · ${dateLabel}${matchResult.value ? ` · ${matchResult.value} league feeds unavailable` : ""}`;
  } else {
    state.matchError = matchResult.reason.message;
    elements.lastUpdated.textContent = `Could not load fixtures: ${matchResult.reason.message}`;
  }
  if (results[1]) {
    const standingsResult = results[1];
    elements.standingsSource.textContent = standingsResult.status === "fulfilled"
      ? standingsResult.value ? `${standingsResult.value} league tables unavailable` : "Table by ESPN"
      : "Could not load table";
  } else {
    elements.standingsSource.textContent = "Table by ESPN";
  }
  state.loading = false;
  elements.refreshButton.disabled = false;
  renderPage();
}

function selectPage(page) {
  if (page === "admin" && !signedInSiteAdmin) {
    elements.adminAuthNotice.hidden = true;
    elements.adminAuthDialog.showModal();
    return;
  }
  if (!["scores", "fixtures", "standings", "stats", "admin"].includes(page)) return;
  state.page = page;
  if (page === "admin") {
    state.detailMatchId = null;
    state.detailRequest += 1;
    renderPage();
    return;
  }
  if (page === "scores") state.filter = "live";
  if (page === "fixtures") state.filter = "upcoming";
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    const active = tab.dataset.filter === state.filter;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  renderPage();
  if (page === "stats") loadLeagueStats();
}

document.querySelector(".primary-nav").addEventListener("click", (event) => {
  const link = event.target.closest("[data-page]");
  if (!link) return;
  event.preventDefault();
  state.detailMatchId = null;
  state.detailRequest += 1;
  const page = link.dataset.page;
  history.replaceState(null, "", `#${page}`);
  selectPage(page);
});

document.querySelector(".brand").addEventListener("click", (event) => {
  event.preventDefault();
  state.detailMatchId = null;
  state.detailRequest += 1;
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
  if (state.page === "stats") loadLeagueStats();
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
  const detailButton = event.target.closest("[data-match-detail]");
  if (detailButton) {
    loadMatchDetails(detailButton.dataset.matchDetail);
    return;
  }
  const favoriteButton = event.target.closest("[data-favorite]");
  if (!favoriteButton) return;
  const id = favoriteButton.dataset.favorite;
  if (state.favoriteIds.has(id)) state.favoriteIds.delete(id);
  else state.favoriteIds.add(id);
  saveFavorites();
  renderMatches();
});

document.querySelector("#detail-back").addEventListener("click", () => {
  state.detailMatchId = null;
  state.detailRequest += 1;
  history.replaceState(null, "", `#${state.page}`);
  renderPage();
});

elements.detailContent.addEventListener("click", (event) => {
  const playerButton = event.target.closest("[data-player-id], [data-player-name]");
  if (playerButton) {
    openPlayerDetails(playerButton);
    return;
  }
  const tab = event.target.closest("[data-detail-tab]");
  if (!tab) return;
  state.detailTab = tab.dataset.detailTab;
  renderMatchDetails();
});

document.querySelector(".player-dialog-close").addEventListener("click", () => {
  state.playerDialog.close();
});
state.playerDialog.addEventListener("click", (event) => {
  if (event.target === state.playerDialog) state.playerDialog.close();
});

elements.searchInput.addEventListener("input", renderMatches);
elements.favoritesToggle.addEventListener("click", () => {
  state.favoritesOnly = !state.favoritesOnly;
  elements.favoritesToggle.setAttribute("aria-pressed", String(state.favoritesOnly));
  elements.favoritesToggle.setAttribute("aria-label", state.favoritesOnly ? "Show all matches" : "Show favorite matches");
  elements.favoritesToggle.textContent = state.favoritesOnly ? "★" : "☆";
  renderMatches();
});
elements.refreshButton.addEventListener("click", () => {
  if (state.page === "stats") loadLeagueStats(true);
  else loadData();
});

document.querySelector("#ad-dialog-close").addEventListener("click", () => {
  elements.adDialog.close();
});

renderHeaderDate();
renderLeagueFilters();
renderDateStrip();
const initialPage = location.hash.slice(1);
initializeSiteAdmin().then(() => {
  if (initialPage === "admin" && signedInSiteAdmin) selectPage("admin");
  else if (["scores", "fixtures", "standings", "stats"].includes(initialPage)) selectPage(initialPage);
  else renderPage();
  return loadPublicSiteSettings();
}).then((settingsReady) => {
  if (settingsReady) recordSiteVisit();
  loadData();
}).catch((error) => {
  console.error("Could not initialize the site.", error);
  loadData();
});

window.setInterval(() => {
  if (!document.hidden && !state.detailMatchId) loadData();
}, 60000);
window.setInterval(() => {
  if (!document.hidden && state.detailMatchId && !state.detailLoading) {
    loadMatchDetails(state.detailMatchId, true);
  }
}, 30000);
