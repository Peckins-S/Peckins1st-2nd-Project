const leagues = [
  { id: "eng.1", espnId: "700", name: "Premier League", country: "England", mark: "PL", badge: "badges/premier-league.png" },
  { id: "esp.1", espnId: "740", name: "La Liga", country: "Spain", mark: "LL", badge: "badges/laliga.png" },
  { id: "ger.1", espnId: "720", name: "Bundesliga", country: "Germany", mark: "BL", badge: "badges/bundesliga.png" },
  { id: "ita.1", espnId: "730", name: "Serie A", country: "Italy", mark: "SA", badge: "badges/serie-a.png" },
  { id: "fra.1", espnId: "710", name: "Ligue 1", country: "France", mark: "L1", badge: "badges/ligue-1.png" }
];
const internationalCompetitions = [
  { id: "espn-775", espnId: "775", apiSlug: "uefa.champions", name: "UEFA Champions League", country: "Europe", mark: "UCL", badge: "badges/champions-league.png" },
  { id: "espn-776", espnId: "776", apiSlug: "uefa.europa", name: "UEFA Europa League", country: "Europe", mark: "UEL", badge: "badges/europa-league.png" },
  { id: "espn-20296", espnId: "20296", apiSlug: "uefa.europa.conf", name: "UEFA Conference League", country: "Europe", mark: "UECL", badge: "badges/conference-league.svg" }
];
const otherCompetitions = [
  { id: "espn-715", espnId: "715", name: "Primeira Liga", country: "Portugal", mark: "POR", badge: "badges/primeira-liga.png" },
  { id: "espn-725", espnId: "725", name: "Eredivisie", country: "Netherlands", mark: "NED", badge: "badges/eredivisie.png" },
  { id: "espn-630", espnId: "630", name: "Brasileirão Série A", country: "Brazil", mark: "BRA", badge: "badges/brasileirao.png" },
  { id: "espn-745", espnId: "745", name: "Primera División", country: "Argentina", mark: "ARG", badge: "badges/primera-division-arg.png" },
  { id: "espn-770", espnId: "770", name: "Major League Soccer", country: "USA", mark: "MLS", badge: "badges/mls.png" },
  { id: "espn-21231", espnId: "21231", name: "Saudi Pro League", country: "Saudi Arabia", mark: "SPL", badge: "badges/saudi-pro-league.svg" },
  { id: "espn-735", espnId: "735", name: "Scottish Premiership", country: "Scotland", mark: "SPL", badge: "badges/scottish-premiership.png" },
  { id: "espn-3946", espnId: "3946", name: "Turkish Süper Lig", country: "Türkiye", mark: "TSL", badge: "badges/super-lig.png" },
  { id: "espn-3901", espnId: "3901", name: "Belgian Pro League", country: "Belgium", mark: "BEL", badge: "badges/belgian-pro-league.png" },
  { id: "espn-760", espnId: "760", name: "Liga MX", country: "Mexico", mark: "MX", badge: "badges/liga-mx.png" },
  { id: "espn-3951", espnId: "3951", name: "Copa del Rey", country: "Spain", mark: "CDR", badge: "badges/copa-del-rey.png" },
  { id: "espn-3952", espnId: "3952", name: "Coupe de France", country: "France", mark: "CDF", badge: "badges/coupe-de-france.png" },
  { id: "espn-3914", espnId: "3914", name: "EFL Championship", country: "England", mark: "EFL", badge: "badges/efl-championship.png" },
  { id: "espn-18481", espnId: "18481", name: "FA Cup / EFL Trophy", country: "England", mark: "FAC", badge: "badges/fa-cup.png" },
  { id: "espn-5454", espnId: "5454", name: "Copa Libertadores", country: "South America", mark: "CS", badge: "badges/copa-libertadores.png" }
];

const leagueBadgeMap = {
  "eng.1": "badges/premier-league.png",
  "700": "badges/premier-league.png",
  "esp.1": "badges/laliga.png",
  "740": "badges/laliga.png",
  "ger.1": "badges/bundesliga.png",
  "720": "badges/bundesliga.png",
  "ita.1": "badges/serie-a.png",
  "730": "badges/serie-a.png",
  "fra.1": "badges/ligue-1.png",
  "710": "badges/ligue-1.png",
  "775": "badges/champions-league.png",
  "espn-775": "badges/champions-league.png",
  "776": "badges/europa-league.png",
  "espn-776": "badges/europa-league.png",
  "20296": "badges/conference-league.svg",
  "espn-20296": "badges/conference-league.svg",
  "715": "badges/primeira-liga.png",
  "725": "badges/eredivisie.png",
  "630": "badges/brasileirao.png",
  "4007": "badges/brasileirao.png",
  "745": "badges/primera-division-arg.png",
  "3903": "badges/primera-division-arg.png",
  "3904": "badges/primera-division-arg.png",
  "770": "badges/mls.png",
  "8301": "badges/mls.png",
  "760": "badges/liga-mx.png",
  "23541": "badges/liga-mx.png",
  "3932": "badges/liga-mx.png",
  "21231": "badges/saudi-pro-league.svg",
  "735": "badges/scottish-premiership.png",
  "3940": "badges/scottish-premiership.png",
  "3959": "badges/scottish-premiership.png",
  "3946": "badges/super-lig.png",
  "3901": "badges/belgian-pro-league.png",
  "3951": "badges/copa-del-rey.png",
  "3952": "badges/coupe-de-france.png",
  "17": "badges/dfb-pokal.png",
  "3914": "badges/efl-championship.png",
  "3915": "badges/efl-league-one.png",
  "3916": "badges/efl-league-two.png",
  "18481": "badges/fa-cup.png",
  "20226": "badges/fa-cup.png",
  "5454": "badges/copa-libertadores.png",
  "all": "badges/all-competitions.svg"
};

function resolveLeagueBadge(league) {
  if (!league) return "badges/default-crest.svg";
  if (league.badge && typeof league.badge === "string" && league.badge.trim()) {
    return league.badge.trim();
  }
  if (league.badge_url && typeof league.badge_url === "string" && league.badge_url.trim()) {
    return league.badge_url.trim();
  }
  const id = String(league.id || "");
  const espnId = String(league.espnId || "");
  if (leagueBadgeMap[id]) return leagueBadgeMap[id];
  if (leagueBadgeMap[espnId]) return leagueBadgeMap[espnId];

  const name = String(league.name || "").toLowerCase();
  if (/premier\s*league/i.test(name)) return "badges/premier-league.png";
  if (/la\s*liga/i.test(name)) return "badges/laliga.png";
  if (/bundesliga/i.test(name)) return "badges/bundesliga.png";
  if (/serie\s*a/i.test(name)) return "badges/serie-a.png";
  if (/ligue\s*1/i.test(name)) return "badges/ligue-1.png";
  if (/champions\s*league/i.test(name)) return "badges/champions-league.png";
  if (/europa\s*league/i.test(name)) return "badges/europa-league.png";
  if (/conference\s*league/i.test(name)) return "badges/conference-league.svg";
  if (/eredivisie/i.test(name)) return "badges/eredivisie.png";
  if (/primeira\s*liga/i.test(name)) return "badges/primeira-liga.png";
  if (/brasil|brasileir/i.test(name)) return "badges/brasileirao.png";
  if (/argentin|primera.*divisi/i.test(name)) return "badges/primera-division-arg.png";
  if (/major\s*league\s*soccer|\bmls\b/i.test(name)) return "badges/mls.png";
  if (/saudi/i.test(name)) return "badges/saudi-pro-league.svg";
  if (/scottish/i.test(name)) return "badges/scottish-premiership.png";
  if (/super\s*lig|s\u00fcper\s*lig/i.test(name)) return "badges/super-lig.png";
  if (/belgian|pro\s*league/i.test(name)) return "badges/belgian-pro-league.png";
  if (/liga\s*mx/i.test(name)) return "badges/liga-mx.png";
  if (/copa\s*del\s*rey/i.test(name)) return "badges/copa-del-rey.png";
  if (/coupe\s*de\s*france/i.test(name)) return "badges/coupe-de-france.png";
  if (/dfb/i.test(name)) return "badges/dfb-pokal.png";
  if (/fa\s*cup/i.test(name)) return "badges/fa-cup.png";
  if (/championship/i.test(name)) return "badges/efl-championship.png";
  if (/libertadores|sudamericana/i.test(name)) return "badges/copa-libertadores.png";

  return "badges/default-crest.svg";
}

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
let featuredCompetitionIds = new Set(defaultFeaturedCompetitionIds);
const siteAdminEmail = "peckinssmart@gmail.com";

const fotmobLeagueStatsUrls = {
  "700": "https://www.fotmob.com/leagues/47/stats/premier-league/players",
  "740": "https://www.fotmob.com/leagues/87/stats/laliga/players",
  "720": "https://www.fotmob.com/leagues/54/stats/bundesliga/players",
  "730": "https://www.fotmob.com/leagues/55/stats/serie-a/players",
  "710": "https://www.fotmob.com/leagues/53/stats/ligue-1/players"
};

const globalLeagueNames = {
  "775": ["UEFA Champions League", "Europe", "UCL"],
  "776": ["UEFA Europa League", "Europe", "UEL"],
  "20296": ["UEFA Conference League", "Europe", "UECL"],
  "19483": ["UEFA Women's Champions League", "Europe", "UWCL"],
  "23390": ["English WSL Players Cup", "England", "WPC"],
  "24079": ["UEFA Women's Europa Cup", "Europe", "UWEC"],
  "18505": ["Indian Football League", "India", "IFL"],
  "3951": ["Spanish Copa del Rey", "Spain", "CDR"],
  "3952": ["Coupe de France", "France", "CDF"],
  "20381": ["Spanish Copa de la Reina", "Spain", "CDR"],
  "8315": ["Africa Cup of Nations Qualifying", "Africa", "AFCON"],
  "2395": ["UEFA Nations League", "Europe", "UNL"],
  "20114": ["UEFA European Under-21 Championship Qualifying", "Europe", "U21"],
  "18481": ["English EFL Trophy", "England", "EFLT"],
  "23284": ["Copa Bolivia", "Bolivia", "BOL"],
  "18914": ["SAFF Championship", "South Asia", "SAFF"],
  "19267": ["Concacaf Nations League", "North America", "CNL"],
  "23286": ["Northern Super League", "Canada", "NSL"],
  "8107": ["Copa Argentina", "Argentina", "CA"],
  "8313": ["Copa Colombia", "Colombia", "CC"],
  "5454": ["CONMEBOL Sudamericana", "South America", "CS"],
  "2466": ["AFC Champions League Two", "Asia", "ACL2"],
  "5331": ["Scottish League Challenge Cup", "Scotland", "CHC"],
  "8312": ["Copa Chile", "Chile", "CC"],
  "18969": ["Concacaf W Championship", "North America", "CWC"],
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
  "775", "776", "20296", "700", "740", "720", "730", "710",
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
const openLigaScheduleCache = new Map();
const openLigaScheduleRequests = new Map();
const competitionApiSlugCache = new Map();
const competitionApiSlugRequests = new Map();

const state = {
  matches: [],
  competitions: [...leagues, ...internationalCompetitions, ...otherCompetitions],
  standings: new Map(),
  standingsErrors: new Map(),
  leagueStats: new Map(),
  selectedDate: dateKey(new Date()),
  selectedLeague: "eng.1",
  filter: "upcoming",
  page: "fixtures",
  favoritesOnly: false,
  favoriteIds: readFavorites(),
  loading: false,
  matchesLoaded: false,
  detailMatchId: null,
  detailTab: "overview",
  detailData: null,
  detailLoading: false,
  detailError: "",
  detailRequest: 0,
  matchError: "",
  matchSource: "",
  playerDialog: document.querySelector("#player-dialog"),
  playerDialogBody: document.querySelector("#player-dialog-body")
};

const elements = {
  appLayout: document.querySelector("#fixtures"),
  adminNavLink: document.querySelector("#admin-nav-link"),
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
  datePicker: document.querySelector("#date-picker"),
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
  topAdvert: document.querySelector("#top-advert"),
  popupAdvert: document.querySelector("#popup-advert")
};
let siteAdminClient = null;
let signedInSiteAdmin = false;
let supabaseLibraryRequest = null;

function loadSupabaseLibrary() {
  if (window.supabase && typeof window.supabase.createClient === "function") return Promise.resolve();
  if (supabaseLibraryRequest) return supabaseLibraryRequest;
  supabaseLibraryRequest = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.async = true;
    script.onload = () => window.supabase && typeof window.supabase.createClient === "function"
      ? resolve()
      : reject(new Error("The Supabase client could not be initialized."));
    script.onerror = () => reject(new Error("The Supabase client could not be loaded."));
    document.head.append(script);
  }).catch((error) => {
    supabaseLibraryRequest = null;
    throw error;
  });
  return supabaseLibraryRequest;
}

async function ensureSiteAdminClient() {
  const config = getSupabaseConfig();
  if (!config) return null;
  await loadSupabaseLibrary();
  if (!siteAdminClient) siteAdminClient = window.supabase.createClient(config.url, config.anonKey);
  return siteAdminClient;
}

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
  const allButton = document.querySelector('[data-league="all"]');
  if (allButton) {
    allButton.classList.toggle("selected", state.selectedLeague === "all");
  }

  const topLeaguesSet = new Set(["eng.1", "esp.1", "ger.1", "ita.1", "fra.1", "espn-775", "espn-776", "espn-20296", "700", "740", "720", "730", "710", "775", "776", "20296"]);
  const topLeagues = competitions.filter((l) => topLeaguesSet.has(l.id) || topLeaguesSet.has(l.espnId));
  const moreLeagues = competitions.filter((l) => !topLeaguesSet.has(l.id) && !topLeaguesSet.has(l.espnId));

  function renderLeagueItem(league) {
    const isSelected = league.id === state.selectedLeague || (state.selectedLeague === "eng.1" && (league.id === "eng.1" || league.espnId === "700"));
    const badge = resolveLeagueBadge(league);
    const country = league.country || "League";
    return `
      <button class="league-filter${isSelected ? " selected" : ""}" type="button" data-league="${escapeHtml(league.id)}" title="${escapeHtml(league.name)} (${escapeHtml(country)})">
        <img class="league-badge" src="${escapeHtml(badge)}" alt="${escapeHtml(league.name)} badge" loading="lazy" onerror="this.onerror=null; this.src='badges/default-crest.svg';">
        <span class="league-text">
          <span class="league-name">${escapeHtml(league.name)}</span>
          <span class="league-country">${escapeHtml(country)}</span>
        </span>
      </button>
    `;
  }

  let html = `<div class="sidebar-section-title">TOP LEAGUES</div>`;
  html += topLeagues.map(renderLeagueItem).join("");

  if (moreLeagues.length) {
    html += `<div class="sidebar-section-title">MORE LEAGUES</div>`;
    html += moreLeagues.map(renderLeagueItem).join("");
  }

  elements.leagueFilters.innerHTML = html;
}

function compareCompetitions(a, b) {
  const isAPremier = a.id === "eng.1" || a.espnId === "700" || /premier\s*league/i.test(a.name || "");
  const isBPremier = b.id === "eng.1" || b.espnId === "700" || /premier\s*league/i.test(b.name || "");
  if (isAPremier !== isBPremier) return isAPremier ? -1 : 1;

  if (a.isCustom && !b.isCustom) return -1;
  if (!a.isCustom && b.isCustom) return 1;

  const topOrder = ["eng.1", "esp.1", "ger.1", "ita.1", "fra.1", "espn-775", "espn-776", "espn-20296", "700", "740", "720", "730", "710", "775", "776", "20296"];
  const aTopIndex = topOrder.indexOf(a.id) !== -1 ? topOrder.indexOf(a.id) : topOrder.indexOf(a.espnId);
  const bTopIndex = topOrder.indexOf(b.id) !== -1 ? topOrder.indexOf(b.id) : topOrder.indexOf(b.espnId);
  if (aTopIndex !== -1 && bTopIndex !== -1) return aTopIndex - bTopIndex;
  if (aTopIndex !== -1) return -1;
  if (bTopIndex !== -1) return 1;

  const aRank = competitionRanks.get(String(a.espnId || "")) ?? Number.MAX_SAFE_INTEGER;
  const bRank = competitionRanks.get(String(b.espnId || "")) ?? Number.MAX_SAFE_INTEGER;
  if (aRank !== bRank) return aRank - bRank;

  return (a.country || "").localeCompare(b.country || "") || (a.name || "").localeCompare(b.name || "");
}

function renderDateStrip() {
  const today = new Date();
  elements.datePicker.value = `${state.selectedDate.slice(0, 4)}-${state.selectedDate.slice(4, 6)}-${state.selectedDate.slice(6, 8)}`;
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
  const knownLeague = [...leagues, ...internationalCompetitions].find((league) => league.espnId === espnId);
  if (knownLeague) return knownLeague;

  const mapped = globalLeagueNames[espnId];
  const seasonSlug = event.season && event.season.slug || "";
  const cleanSlug = seasonSlug.replace(/^\d{4}(?:-\d{2})?-/, "");
  const isTournamentStage = /(?:^|-)(?:league-phase|group-stage|playoffs?|quarterfinals?|semifinals?|finals?|first-round|second-round|third-round|seventh-round|round-of-\d+)(?:$|-)/i.test(cleanSlug);
  const slugName = cleanSlug && !isTournamentStage
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
  const parsedUrl = new URL(url, location.href);
  const providerHosts = ["site.api.espn.com", "site.web.api.espn.com", "api.openligadb.de"];
  const requestUrl = location.protocol !== "file:" && providerHosts.includes(parsedUrl.hostname)
    ? `/api/football?url=${encodeURIComponent(parsedUrl.href)}`
    : url;
  const response = await fetch(requestUrl);
  if (!response.ok) throw new Error(`Feed request failed (${response.status}).`);
  return response.json();
}

function getSeasonStartYear(date) {
  return date.getMonth() >= 6 ? date.getFullYear() : date.getFullYear() - 1;
}

function mapOpenLigaMatch(match, league) {
  const date = match.matchDateTimeUTC;
  const timestamp = Date.parse(date);
  if (!Number.isFinite(timestamp)) return null;

  const results = Array.isArray(match.matchResults) ? match.matchResults : [];
  const result = results.find((item) => item.resultTypeKind === "After90Minutes")
    || results.slice().sort((a, b) => b.resultOrderID - a.resultOrderID)[0];
  const ageInHours = (Date.now() - timestamp) / 3600000;
  const isLive = !match.matchIsFinished && ageInHours >= 0 && ageInHours <= 4;
  const home = match.team1 || {};
  const away = match.team2 || {};
  const competitionName = (match.leagueName || league.leagueName || "Football")
    .replace(/\s+\d{4}(?:\/\d{2,4})?.*$/, "");
  const internationalCompetition = internationalCompetitions.find((item) =>
    item.name.toLowerCase().includes("champions league") && /champions league/i.test(competitionName)
    || item.name.toLowerCase().includes("europa league") && /europa league/i.test(competitionName)
    || item.name.toLowerCase().includes("conference league") && /conference league/i.test(competitionName)
  );
  const competitionId = internationalCompetition
    ? internationalCompetition.id : `openligadb-${match.leagueId || league.leagueId}`;

  return {
    id: `openligadb-${match.matchID}`,
    provider: "openligadb",
    league: {
      id: competitionId,
      espnId: internationalCompetition ? internationalCompetition.espnId : match.leagueShortcut || league.leagueShortcut,
      name: internationalCompetition ? internationalCompetition.name : competitionName,
      country: /champions league|europa league|conference league/i.test(competitionName)
        ? "Europe"
        : /premier league/i.test(competitionName) ? "England"
          : /laliga|la liga/i.test(competitionName) ? "Spain" : "Germany",
      mark: internationalCompetition ? internationalCompetition.mark
        : /champions league/i.test(competitionName) ? "UCL"
        : /europa league/i.test(competitionName) ? "UEL"
          : /conference league/i.test(competitionName) ? "UECL"
            : /premier league/i.test(competitionName) ? "PL"
              : /laliga|la liga/i.test(competitionName) ? "LL"
                : /2\./.test(competitionName) ? "2BL" : "BL"
    },
    home: { id: String(home.teamId || ""), name: home.teamName || "Home", displayName: home.teamName || "Home" },
    away: { id: String(away.teamId || ""), name: away.teamName || "Away", displayName: away.teamName || "Away" },
    homeScore: result && result.pointsTeam1,
    awayScore: result && result.pointsTeam2,
    date,
    state: match.matchIsFinished ? "post" : isLive ? "in" : "pre",
    status: match.matchIsFinished ? "Full time" : isLive ? "LIVE" : "",
    note: match.group && match.group.groupName || ""
  };
}

async function fetchOpenLigaSchedule(season) {
  const cached = openLigaScheduleCache.get(season);
  if (cached && Date.now() - cached.fetchedAt < 5 * 60 * 1000) return cached.matches;
  if (openLigaScheduleRequests.has(season)) return openLigaScheduleRequests.get(season);

  const request = (async () => {
    const available = await fetchJson(`https://api.openligadb.de/getavailableleagues/${season}`);
    const footballLeagues = available.filter((league) => league
      && Number(league.leagueSeason) === season
      && (!league.sport || /fu(?:ß|ss)ball/i.test(league.sport.sportName || ""))
      && !/test/i.test(league.leagueName || ""));
    const competitions = [
      { pattern: /^1\.\s*(?:fu(?:ß|ss)ball-)?bundesliga/i, preferred: "bl1" },
      { pattern: /^2\.\s*(?:fu(?:ß|ss)ball-)?bundesliga/i, preferred: "bl2" },
      { pattern: /^premier league \d/i, preferred: "pl" },
      { pattern: /^laliga ea sports \d|^la liga español/i, preferred: "la1" },
      { pattern: /^champions league \d/i, preferred: "ucl" },
      { pattern: /^europa league \d/i, preferred: `uel${season}` },
      { pattern: /^conference league \d/i, preferred: `uecl${season}` }
    ];
    const selected = competitions.map((competition) => {
      const candidates = footballLeagues.filter((league) => competition.pattern.test(league.leagueName || ""));
      return candidates.find((league) => league.leagueShortcut === competition.preferred)
        || candidates.sort((a, b) => (a.leagueShortcut || "").length - (b.leagueShortcut || "").length)[0];
    }).filter(Boolean);

    if (!selected.length) throw new Error(`No backup competition schedules are available for ${season}.`);
    const results = await Promise.allSettled(selected.map(async (league) => ({
      league,
      matches: await fetchJson(`https://api.openligadb.de/getmatchdata/${encodeURIComponent(league.leagueShortcut)}/${season}`)
    })));
    const successful = results.filter((result) => result.status === "fulfilled");
    if (!successful.length) {
      throw new Error(`The backup fixture feed could not load schedules for ${season}.`);
    }

    const matches = successful.flatMap((result) =>
      result.value.matches.map((match) => mapOpenLigaMatch(match, result.value.league)).filter(Boolean)
    );
    openLigaScheduleCache.set(season, { fetchedAt: Date.now(), matches });
    if (successful.length !== selected.length) {
      console.warn("Some backup competition schedules could not be loaded.");
    }
    return matches;
  })().finally(() => {
    openLigaScheduleRequests.delete(season);
  });

  openLigaScheduleRequests.set(season, request);
  return request;
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

async function syncAdminGateSession(session) {
  const isAdmin = Boolean(session && session.access_token && session.user
    && (session.user.email || "").toLowerCase() === siteAdminEmail);
  const response = await fetch("/api/admin-session", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(isAdmin ? { access_token: session.access_token } : { logout: true })
  });
  if (!response.ok) throw new Error("Could not verify the admin session with the server.");
}

async function initializeSiteAdmin() {
  const config = getSupabaseConfig();
  if (!config) return;
  try {
    await ensureSiteAdminClient();
  } catch (error) {
    console.error("Could not load the admin sign-in client.", error);
    return;
  }

  elements.adminAuthEmail.value = siteAdminEmail;
  const { data, error } = await siteAdminClient.auth.getSession();
  if (error && error.name !== "AuthSessionMissingError") {
    console.error("Could not check the site admin session.", error);
    setSiteAdminUser(null);
    return;
  }
  try {
    await syncAdminGateSession(data && data.session);
    setSiteAdminUser(data && data.session && data.session.user);
  } catch (sessionError) {
    console.error("Could not secure the admin session.", sessionError);
    setSiteAdminUser(null);
  }
  siteAdminClient.auth.onAuthStateChange((_event, session) => {
    syncAdminGateSession(session).then(() => {
      setSiteAdminUser(session && session.user);
    }).catch((sessionError) => {
      console.error("Could not secure the admin session.", sessionError);
      setSiteAdminUser(null);
    });
  });
}

elements.adminNavLink.addEventListener("click", (event) => {
  event.preventDefault();
  if (signedInSiteAdmin) {
    history.replaceState(null, "", "#admin");
    selectPage("admin");
  }
});

document.querySelector("#admin-auth-close").addEventListener("click", () => {
  elements.adminAuthDialog.close();
});

elements.adminAuthForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  let client;
  try {
    client = await ensureSiteAdminClient();
  } catch (error) {
    console.error("Could not load the admin sign-in client.", error);
    showAdminAuthNotice("Admin sign-in is unavailable. Check your connection and try again.");
    return;
  }
  if (!client) {
    showAdminAuthNotice("Admin sign-in is unavailable. Check your connection and try again.");
    return;
  }
  elements.adminAuthSubmit.disabled = true;
  showAdminAuthNotice("Signing in…");
  const { data, error } = await client.auth.signInWithPassword({
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
    await client.auth.signOut();
    showAdminAuthNotice(`This panel is restricted to ${siteAdminEmail}.`);
    return;
  }
  try {
    await syncAdminGateSession(data.session);
  } catch (sessionError) {
    console.error("Could not secure the admin session.", sessionError);
    await client.auth.signOut();
    showAdminAuthNotice("Could not verify the admin session with the server. Please try again.");
    return;
  }
  setSiteAdminUser(data.user);
  elements.adminAuthDialog.close();
  history.replaceState(null, "", "#admin");
  selectPage("admin");
});

elements.adminResetRequest.addEventListener("click", async () => {
  let client;
  try {
    client = await ensureSiteAdminClient();
  } catch (error) {
    console.error("Could not load the admin sign-in client.", error);
    showAdminAuthNotice("Password reset is unavailable. Check your connection and try again.");
    return;
  }
  if (!client) {
    showAdminAuthNotice("Password reset is unavailable. Check your connection and try again.");
    return;
  }
  elements.adminResetRequest.disabled = true;
  const { error } = await client.auth.resetPasswordForEmail(siteAdminEmail, {
    redirectTo: `${location.origin}/admin.html`
  });
  elements.adminResetRequest.disabled = false;
  showAdminAuthNotice(error
    ? `Could not send a reset email: ${error.message}`
    : `If an account exists for ${siteAdminEmail}, a password reset email has been sent.`);
});

function validAdvertImageUrl(value) {
  const config = getSupabaseConfig();
  if (!config || typeof value !== "string" || !value) return "";
  try {
    const image = new URL(value);
    const storageOrigin = new URL(config.url).origin;
    return image.protocol === "https:" && image.origin === storageOrigin
      && image.pathname.startsWith("/storage/v1/object/public/site-adverts/")
      ? image.href
      : "";
  } catch {
    return "";
  }
}

function configureAdvertImage(image, source) {
  const safeSource = validAdvertImageUrl(source);
  image.hidden = !safeSource;
  image.removeAttribute("src");
  if (safeSource) {
    image.src = safeSource;
    image.addEventListener("error", () => { image.hidden = true; }, { once: true });
  }
}

function configureAdvertLink(link, advert) {
  let destination;
  try {
    destination = new URL(advert.button_url);
  } catch {
    return false;
  }
  if (destination.protocol !== "https:") return false;
  link.href = destination.href;
  link.textContent = advert.button_text;
  return true;
}

function renderAdvertPlacement(placement, advert) {
  if (!advert) return;
  const isBanner = placement === "top_banner";
  const prefix = isBanner ? "top-advert" : "popup-advert";
  const container = isBanner ? elements.topAdvert : elements.popupAdvert;
  const background = document.querySelector(`#${prefix}-background`);
  const logo = document.querySelector(`#${prefix}-logo`);
  const headline = document.querySelector(`#${prefix}-headline`);
  const description = document.querySelector(`#${prefix}-description`);
  const cta = document.querySelector(`#${prefix}-cta`);

  headline.textContent = advert.headline;
  description.textContent = advert.description;
  configureAdvertImage(background, advert.background_image_url);
  configureAdvertImage(logo, advert.logo_image_url);
  if (!configureAdvertLink(cta, advert)) return;
  if (isBanner) {
    container.hidden = false;
    return;
  }
  window.setTimeout(() => { container.hidden = false; }, 5000);
}

async function loadPublicAdverts() {
  const config = getSupabaseConfig();
  if (!config) return;
  const baseUrl = config.url.replace(/\/+$/, "");
  const response = await fetch(
    `${baseUrl}/rest/v1/site_adverts?select=placement,headline,description,button_text,button_url,background_image_url,logo_image_url,updated_at&is_enabled=eq.true&is_published=eq.true&order=updated_at.desc`,
    {
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`
      }
    }
  );
  if (!response.ok) throw new Error(`Published adverts request failed (${response.status}).`);
  const adverts = await response.json();
  if (!Array.isArray(adverts)) throw new Error("Published adverts response was not a list.");
  for (const placement of ["top_banner", "popup"]) {
    renderAdvertPlacement(placement, adverts.find((advert) => advert.placement === placement));
  }
}

async function recordSiteVisit() {
  const config = getSupabaseConfig();
  if (!config) return;
  try {
    const cookieName = "90plus-visit-session";
    const cookieValue = document.cookie.split("; ").find((cookie) => cookie.startsWith(`${cookieName}=`));
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let sessionId = cookieValue && cookieValue.slice(cookieName.length + 1);
    if (!uuidPattern.test(sessionId || "")) {
      sessionId = localStorage.getItem(cookieName);
      if (!uuidPattern.test(sessionId || "")) sessionId = crypto.randomUUID();
      const secure = location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `${cookieName}=${sessionId}; Max-Age=3888000; Path=/; SameSite=Lax${secure}`;
      if (!document.cookie.split("; ").some((cookie) => cookie === `${cookieName}=${sessionId}`)) {
        localStorage.setItem(cookieName, sessionId);
      }
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
    if (selected.length) featuredCompetitionIds = new Set(selected);
  }
}

async function loadPublicSiteSettings() {
  const config = getSupabaseConfig();
  if (!config) return false;
  try {
    const baseUrl = config.url.replace(/\/+$/, "");
    const response = await fetch(`${baseUrl}/rest/v1/site_settings?id=eq.true&select=brand_name,announcement,featured_competitions`, {
      headers: {
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`
      }
    });
    if (!response.ok) throw new Error(`Settings request failed (${response.status}).`);
    const rows = await response.json();
    if (Array.isArray(rows) && rows[0]) applySiteSettings(rows[0]);
    return Array.isArray(rows) && Boolean(rows[0]);
  } catch (error) {
    console.error("Could not load shared site settings.", error);
    return false;
  }
}

async function loadCustomLeagues(initialList) {
  let list = Array.isArray(initialList) ? initialList : [];
  if (!list.length) {
    try {
      const raw = localStorage.getItem("90minutes_custom_leagues");
      if (raw) list = JSON.parse(raw);
    } catch {}
  }

  const config = getSupabaseConfig();
  if (config) {
    try {
      const baseUrl = config.url.replace(/\/+$/, "");
      const response = await fetch(`${baseUrl}/rest/v1/custom_leagues?select=*`, {
        headers: {
          apikey: config.anonKey,
          Authorization: `Bearer ${config.anonKey}`
        }
      });
      if (response.ok) {
        const rows = await response.json();
        if (Array.isArray(rows) && rows.length) {
          list = rows.map((item) => ({
            id: item.id,
            name: item.name,
            country: item.country || "International",
            badge: item.badge_url || item.badge || "badges/default-crest.svg",
            espnId: item.espn_id || item.espnId || "",
            isCustom: true
          }));
          try {
            localStorage.setItem("90minutes_custom_leagues", JSON.stringify(list));
          } catch {}
        }
      }
    } catch (e) {
      console.warn("Could not load custom leagues from Supabase API", e);
    }
  }

  if (Array.isArray(list) && list.length) {
    for (const cl of list) {
      if (!cl || !cl.name) continue;
      const leagueObj = {
        id: cl.id || `custom-${cl.name.toLowerCase().replace(/\s+/g, "-")}`,
        espnId: cl.espnId || cl.espn_id || "",
        name: cl.name,
        country: cl.country || "Custom",
        badge: cl.badge || cl.badge_url || "badges/default-crest.svg",
        isCustom: true
      };
      const existingIdx = state.competitions.findIndex((c) => c.id === leagueObj.id);
      if (existingIdx !== -1) {
        state.competitions[existingIdx] = leagueObj;
      } else {
        state.competitions.push(leagueObj);
      }
    }
    state.competitions.sort(compareCompetitions);
    renderLeagueFilters();
  }
}

async function fetchMatches() {
  const selectedDate = parseDate(state.selectedDate);
  const selectedDateKey = state.selectedDate;
  let scoreboard;
  try {
    scoreboard = await fetchJson(`https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard?dates=${selectedDateKey}&limit=1000`);
  } catch (primaryError) {
    const season = getSeasonStartYear(selectedDate);
    try {
      state.matches = (await fetchOpenLigaSchedule(season))
        .filter((match) => dateKey(new Date(match.date)) === selectedDateKey);
      state.matchSource = state.matches.length ? "backup" : "primary";
    } catch (backupError) {
      state.matches = [];
      state.matchSource = "";
      throw new Error(`The main fixture feed failed: ${primaryError.message} The backup feed failed: ${backupError.message}`);
    }
    if (!state.matches.length) {
      throw new Error(`The main fixture feed failed: ${primaryError.message} The backup feed confirmed no fixtures.`);
    }
    state.matches.sort((a, b) => new Date(a.date) - new Date(b.date));
    updateCompetitionsFromMatches();
    return 1;
  }

  state.matches = (scoreboard.events || [])
    .filter((event) => event.date && dateKey(new Date(event.date)) === selectedDateKey)
    .map((event) => {
    const competition = { ...getEventLeague(event, event.id), eventId: String(event.id) };
    return mapEvent(event, competition);
  });

  state.matchSource = "primary";
  state.matches.sort((a, b) => new Date(a.date) - new Date(b.date));
  updateCompetitionsFromMatches();
  return 0;
}

function updateCompetitionsFromMatches() {
  const allKnown = [...leagues, ...internationalCompetitions, ...otherCompetitions, ...state.competitions, ...state.matches.map((match) => match.league)];
  const competitionMap = new Map(allKnown.map((league) => [league.id, league]));
  state.competitions = [...competitionMap.values()].sort(compareCompetitions);
  const isSelectedPremier = state.selectedLeague === "eng.1" || state.selectedLeague === "700";
  if (state.selectedLeague !== "all"
    && !isSelectedPremier
    && !state.competitions.some((league) => league.id === state.selectedLeague)) {
    state.selectedLeague = "eng.1";
  }
  renderLeagueFilters();
}

function selectedCompetitions() {
  if (state.selectedLeague === "all") return leagues;
  const isSelectedPremier = state.selectedLeague === "eng.1" || state.selectedLeague === "700";
  if (isSelectedPremier) {
    const pl = state.competitions.find((league) => league.id === "eng.1" || league.espnId === "700" || /premier\s*league/i.test(league.name || ""));
    if (pl) return [pl];
  }
  return [state.competitions.find((league) => league.id === state.selectedLeague || league.espnId === state.selectedLeague)].filter(Boolean);
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

async function resolveCompetitionApiSlug(league) {
  if (league.apiSlug) return league.apiSlug;
  const international = internationalCompetitions.find((item) => item.id === league.id
    || item.espnId === String(league.espnId || ""));
  if (international && international.apiSlug) return international.apiSlug;
  if (competitionApiSlugCache.has(league.id)) return competitionApiSlugCache.get(league.id);
  if (competitionApiSlugRequests.has(league.id)) return competitionApiSlugRequests.get(league.id);

  const request = (async () => {
    if (/^[a-z]{3}\.\d+$/i.test(league.id)) {
      competitionApiSlugCache.set(league.id, league.id);
      return league.id;
    }
    if (!league.eventId) throw new Error(`Competition details are not available for ${league.name}.`);

    const summary = await fetchJson(`https://site.api.espn.com/apis/site/v2/sports/soccer/all/summary?event=${encodeURIComponent(league.eventId)}`);
    const apiSlug = summary.header && summary.header.league && summary.header.league.slug;
    if (!apiSlug) throw new Error(`The data provider did not identify ${league.name}.`);
    competitionApiSlugCache.set(league.id, apiSlug);
    return apiSlug;
  })().finally(() => {
    competitionApiSlugRequests.delete(league.id);
  });
  competitionApiSlugRequests.set(league.id, request);
  return request;
}

async function fetchStandingsForLeague(league, force = false) {
  if (!force && state.standings.has(league.id)) return;
  try {
    const apiSlug = await resolveCompetitionApiSlug(league);
    const url = `https://site.web.api.espn.com/apis/v2/sports/soccer/${encodeURIComponent(apiSlug)}/standings?region=us&lang=en&contentorigin=espn`;
    const data = await fetchJson(url);
    const entries = flattenStandings(data);
    if (!entries.length) {
      state.standings.delete(league.id);
      state.standingsErrors.set(league.id, "The data provider does not publish a standings table for this competition.");
      return;
    }
    state.standings.set(league.id, entries.map(mapStanding));
    state.standingsErrors.delete(league.id);
  } catch (error) {
    state.standings.delete(league.id);
    state.standingsErrors.set(league.id, error.message.includes("(404)")
      ? "The data provider does not publish a standings table for this competition."
      : error.message);
  }
}

async function loadStandings(force = false) {
  const selectedLeagues = selectedCompetitions();
  const pending = selectedLeagues.filter((league) => force || !state.standings.has(league.id)
    && !state.standingsErrors.has(league.id));
  if (!pending.length) {
    renderStandings();
    return;
  }
  pending.forEach((league) => state.standingsErrors.set(league.id, "Loading standings…"));
  renderStandings();
  for (let index = 0; index < pending.length; index += 2) {
    await Promise.all(pending.slice(index, index + 2).map((league) => fetchStandingsForLeague(league, force)));
  }
  renderStandings();
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
  const apiSlug = await resolveCompetitionApiSlug(league);
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/${encodeURIComponent(apiSlug)}/statistics`;
  const data = await fetchJson(url);
  const categories = (data.stats || []).map(mapLeagueStatCategory)
    .filter((category) => category.leaders.length);
  if (!categories.length) throw new Error(`No player leader stats were returned for ${league.name}.`);
  return { season: data.season && data.season.displayName || "", categories };
}

async function loadLeagueStats(force = false) {
  const selectedLeagues = selectedCompetitions();
  const requests = selectedLeagues.map((league) => async () => {
    if (!force && state.leagueStats.has(league.id)) return;
    state.leagueStats.set(league.id, { loading: true, categories: [], season: "", error: "" });
    try {
      const data = await fetchLeagueStats(league);
      state.leagueStats.set(league.id, { ...data, loading: false, error: "" });
    } catch (error) {
      state.leagueStats.set(league.id, {
        loading: false,
        categories: [],
        season: "",
        error: error.message.includes("(404)")
          ? `The data provider does not publish player statistics for ${league.name}.`
          : error.message
      });
    }
    renderLeagueStats();
  });

  renderLeagueStats();
  for (let index = 0; index < requests.length; index += 2) {
    await Promise.all(requests.slice(index, index + 2).map((request) => request()));
  }
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
      title: item.headline || item.description || "Match video",
      description: item.description || "",
      image: item.thumbnail,
      link: item.links && item.links.web && item.links.web.href || item.link,
      type: "Match video"
    })),
    ...listFrom(summary.news && summary.news.articles).map((item) => {
      const firstImage = listFrom(item.images)[0];
      return {
        title: item.headline || item.description || "Match article",
        description: item.description || "",
        image: typeof firstImage === "string" ? firstImage : firstImage && (firstImage.url || firstImage.href),
        link: item.links && item.links.web && item.links.web.href || item.link,
        type: "Match article"
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
      <h3>Related match coverage</h3>
      <p class="media-note">No related images are available for this match yet.</p>
    </section>`;
  }
  return `<section class="match-media">
    <h3>Related match coverage</h3>
    <p class="media-note">These article or video previews may not show action from this match.</p>
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
    <p class="player-detail-source">Player match data provided by our match data provider.</p>
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
    if (state.selectedLeague !== "all") {
      const matchLeagueId = match.league && match.league.id;
      const matchEspnId = match.league && match.league.espnId;
      const matchName = match.league && match.league.name;
      const isSelectedPremier = state.selectedLeague === "eng.1" || state.selectedLeague === "700";
      const isMatchPremier = matchLeagueId === "eng.1" || matchEspnId === "700" || /premier\s*league/i.test(matchName || "");

      if (isSelectedPremier) {
        if (!isMatchPremier) return false;
      } else if (matchLeagueId !== state.selectedLeague && matchEspnId !== state.selectedLeague) {
        return false;
      }
    }
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
        ${match.provider === "openligadb" ? "" : `<button class="match-detail-link" type="button" data-match-detail="${escapeHtml(match.id)}">Match details</button>`}
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
  if (state.loading && !state.matches.length) {
    elements.matchList.innerHTML = `<div class="loading-state" role="status"><span class="loading-spinner" aria-hidden="true"></span><span>Loading fixtures and live scores…</span></div>`;
    return;
  }
  if (!matches.length) {
    const noMatchesForDate = !state.matches.length && state.filter !== "live";
    const noUpcomingMatches = state.filter === "upcoming" && state.matches.length > 0;
    const title = noUpcomingMatches
      ? "No upcoming matches for this date"
      : noMatchesForDate
      ? state.matchError ? "Fixtures could not be loaded" : "No matches for this date"
      : state.filter === "live" && !state.matches.length ? "No live matches right now" : "No matches found";
    const message = state.matchError
      ? "Please try again in a little while."
      : noUpcomingMatches ? "Try All to see every match, or choose another date."
        : noMatchesForDate ? "Check tomorrow or choose another date." : "Try another competition, filter, or search.";
    elements.matchList.innerHTML = `<div class="empty-state"><strong>${title}</strong>${message}</div>`;
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
  const selected = selectedCompetitions();
  const available = selected.filter((league) => state.standings.has(league.id));
  elements.standingsTitle.textContent = state.selectedLeague === "all"
    ? "League standings" : selected.length ? `${selected[0].name} standings` : "League standings";
  if (state.selectedLeague === "all") {
    elements.standingsSource.textContent = "League tables";
  }
  if (!available.length) {
    const loading = selected.some((league) => state.standingsErrors.get(league.id) === "Loading standings…");
    if (loading) {
      elements.standingsContent.innerHTML = `<div class="loading-state" role="status"><span class="loading-spinner" aria-hidden="true"></span><span>Loading standings…</span></div>`;
      return;
    }
    const message = state.selectedLeague === "all"
      ? "Standings are not published for these competitions."
      : state.standingsErrors.get(selected[0] && selected[0].id) || "Standings are not published for this competition.";
    elements.standingsContent.innerHTML = `<div class="empty-state"><strong>Standings are unavailable</strong>${escapeHtml(message)}</div>`;
    return;
  }
  const tables = available.map((league) => `
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
  const unavailable = selected.filter((league) => !state.standings.has(league.id));
  elements.standingsContent.innerHTML = tables + unavailable.map((league) => `
    <div class="empty-state"><strong>${escapeHtml(league.name)} standings unavailable</strong>
      ${escapeHtml(state.standingsErrors.get(league.id) || "Standings are not published for this competition.")}
    </div>
  `).join("");
}

function renderLeagueStats() {
  const selected = selectedCompetitions();
  elements.leagueStatsTitle.textContent = state.selectedLeague === "all"
    ? "League leaders" : selected.length ? `${selected[0].name} leaders` : "League leaders";

  const complete = selected.filter((league) => state.leagueStats.has(league.id)
    && !state.leagueStats.get(league.id).loading);
  const seasons = [...new Set(complete.map((league) => state.leagueStats.get(league.id).season).filter(Boolean))];
  elements.leagueStatsSource.textContent = seasons.length === 1
    ? seasons[0]
    : seasons.length > 1 ? `${seasons.length} seasons` : "Season stats";

  if (selected.some((league) => !state.leagueStats.has(league.id) || state.leagueStats.get(league.id).loading)) {
    elements.leagueStatsContent.innerHTML = `<div class="loading-state" role="status"><span class="loading-spinner" aria-hidden="true"></span><span>Loading player stats…</span></div>`;
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
        <p>This statistic is not available in the current league leaders data.</p>
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
      elements.adminPanelFrame.src = "/admin-panel?embedded=1";
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
  renderPage();
  try {
    const unavailableFeeds = await fetchMatches();
    state.matchError = "";
    const dateLabel = formatDate(parseDate(state.selectedDate), { month: "short", day: "numeric" });
    const sourceLabel = state.matchSource === "backup" ? " · Backup feed" : "";
    elements.lastUpdated.textContent = `Updated ${formatDate(new Date(), { hour: "numeric", minute: "2-digit" })} · ${dateLabel}${sourceLabel}${unavailableFeeds ? ` · ${unavailableFeeds} fixture feed requests unavailable` : ""}`;
  } catch (error) {
    state.matchError = error.message;
    elements.lastUpdated.textContent = `Could not load fixtures: ${error.message}`;
  } finally {
    state.matchesLoaded = true;
    state.loading = false;
    elements.refreshButton.disabled = false;
    renderPage();
  }
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
  if (page === "standings") loadStandings();
  if ((page === "fixtures" || page === "scores") && !state.matchesLoaded) loadData();
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

function selectStartPremierLeague(event) {
  if (event) event.preventDefault();
  state.detailMatchId = null;
  state.detailRequest += 1;
  state.selectedLeague = "eng.1";
  state.filter = "upcoming";
  history.replaceState(null, "", "#fixtures");
  selectPage("fixtures");
  renderLeagueFilters();
  renderPage();
}

document.querySelector(".brand").addEventListener("click", selectStartPremierLeague);
const startNavLink = document.querySelector("#start-nav-link");
if (startNavLink) {
  startNavLink.addEventListener("click", selectStartPremierLeague);
}

document.querySelector("#competitions").addEventListener("click", (event) => {
  const button = event.target.closest("[data-league]");
  if (!button) return;
  state.selectedLeague = button.dataset.league;
  document.querySelectorAll(".league-filter").forEach((filter) => {
    filter.classList.toggle("selected", filter.dataset.league === state.selectedLeague);
  });
  renderPage();
  if (state.page === "stats") loadLeagueStats();
  if (state.page === "standings") loadStandings();
});

elements.dateStrip.addEventListener("click", (event) => {
  const button = event.target.closest("[data-date]");
  if (!button) return;
  state.selectedDate = button.dataset.date;
  renderDateStrip();
  loadData();
});

elements.datePicker.addEventListener("change", () => {
  if (!elements.datePicker.value) return;
  state.selectedDate = elements.datePicker.value.replace(/-/g, "");
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
  else if (state.page === "standings") loadStandings(true);
  else loadData();
});

document.querySelector("#popup-advert-close").addEventListener("click", () => {
  elements.popupAdvert.hidden = true;
});

renderHeaderDate();
renderLeagueFilters();
renderDateStrip();
const initialPage = location.hash.slice(1);
if (["scores", "fixtures", "standings", "stats"].includes(initialPage)) selectPage(initialPage);
else if (initialPage === "admin") {
  initializeSiteAdmin().then(() => {
    if (signedInSiteAdmin) selectPage("admin");
    else selectPage("fixtures");
  }).catch((error) => {
    console.error("Could not initialize the site admin session.", error);
    selectPage("fixtures");
  });
} else selectPage("fixtures");

if (initialPage !== "admin") {
  initializeSiteAdmin().catch((error) => {
    console.error("Could not initialize the site admin session.", error);
  });
}
loadPublicSiteSettings().catch((error) => {
  console.error("Could not load public site settings.", error);
});
loadCustomLeagues().catch((error) => {
  console.error("Could not load custom leagues.", error);
});
window.addEventListener("storage", (event) => {
  if (event.key === "90minutes_custom_leagues") {
    loadCustomLeagues().catch(() => {});
  }
});
loadPublicAdverts().catch((error) => {
  console.error("Could not load published adverts.", error);
});
recordSiteVisit();

window.setInterval(() => {
  if (!document.hidden && !state.detailMatchId && state.matchesLoaded
    && (state.page === "fixtures" || state.page === "scores")) loadData();
}, 60000);
window.setInterval(() => {
  if (!document.hidden && state.detailMatchId && !state.detailLoading) {
    loadMatchDetails(state.detailMatchId, true);
  }
}, 30000);
