if (new URLSearchParams(location.search).get("embedded") === "1") {
  document.body.classList.add("embedded-admin-page");
}

const adminConfig = window.SUPABASE_CONFIG;
const adminEmail = "peckinssmart@gmail.com";
const adminLeagues = [
  ["700", "Premier League"],
  ["740", "La Liga"],
  ["720", "Bundesliga"],
  ["730", "Serie A"],
  ["710", "Ligue 1"],
  ["715", "Primeira Liga"],
  ["725", "Eredivisie"],
  ["630", "Brasileirão Série A"],
  ["745", "Argentina Primera División"]
];
const adminElements = {
  notice: document.querySelector("#admin-notice"),
  login: document.querySelector("#admin-login"),
  loginForm: document.querySelector("#login-form"),
  password: document.querySelector("#login-password"),
  passwordReset: document.querySelector("#password-reset"),
  passwordResetForm: document.querySelector("#password-reset-form"),
  newPassword: document.querySelector("#new-password"),
  confirmPassword: document.querySelector("#confirm-password"),
  passwordResetButton: document.querySelector("#password-reset-button"),
  workspace: document.querySelector("#admin-workspace"),
  dashboard: document.querySelector("#admin-dashboard"),
  dashboardRefresh: document.querySelector("#dashboard-refresh"),
  visitorsRefresh: document.querySelector("[data-refresh-visitors]"),
  liveCount: document.querySelector("#dashboard-live-count"),
  upcomingCount: document.querySelector("#dashboard-upcoming-count"),
  finishedCount: document.querySelector("#dashboard-finished-count"),
  matchStatus: document.querySelector("#dashboard-match-status"),
  matchList: document.querySelector("#dashboard-match-list"),
  feedStatus: document.querySelector("#dashboard-feed-status"),
  settingsUpdated: document.querySelector("#dashboard-settings-updated"),
  summaryBrand: document.querySelector("#dashboard-brand-name"),
  summaryAnnouncement: document.querySelector("#dashboard-announcement"),
  featuredCount: document.querySelector("#dashboard-featured-count"),
  adStatus: document.querySelector("#dashboard-ad-status"),
  visitsToday: document.querySelector("#dashboard-visits-today"),
  visitsWeek: document.querySelector("#dashboard-visits-week"),
  visitsMonth: document.querySelector("#dashboard-visits-month"),
  visitsStatus: document.querySelector("#dashboard-visits-status"),
  migrationNotice: document.querySelector("#admin-migration-notice"),
  settingsForm: document.querySelector("#settings-form"),
  brandName: document.querySelector("#brand-name"),
  announcement: document.querySelector("#announcement"),
  adSettings: document.querySelector("#ad-settings-card"),
  adEnabled: document.querySelector("#ad-enabled"),
  adTitle: document.querySelector("#ad-title"),
  adMessage: document.querySelector("#ad-message"),
  adCtaLabel: document.querySelector("#ad-cta-label"),
  adUrl: document.querySelector("#ad-url"),
  leagueOptions: document.querySelector("#league-options"),
  signedInEmail: document.querySelector("#signed-in-email"),
  loginButton: document.querySelector("#login-button"),
  saveButton: document.querySelector("#save-button"),
  signOutButton: document.querySelector("#sign-out-button")
};

let supabaseClient;
let hasExtendedSettings = true;

function setNotice(message, type = "info") {
  adminElements.notice.textContent = message;
  adminElements.notice.dataset.type = type;
  adminElements.notice.hidden = false;
}

function validConfig() {
  return adminConfig
    && typeof adminConfig.url === "string"
    && /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(adminConfig.url)
    && typeof adminConfig.anonKey === "string"
    && adminConfig.anonKey.length > 20
    && !adminConfig.anonKey.includes("YOUR_SUPABASE");
}

function setSignedIn(user) {
  const isAdmin = Boolean(user && (user.email || "").toLowerCase() === adminEmail);
  adminElements.login.hidden = isAdmin;
  adminElements.passwordReset.hidden = true;
  adminElements.workspace.hidden = !isAdmin;
  adminElements.dashboard.hidden = !isAdmin;
  adminElements.settingsForm.hidden = !isAdmin;
  adminElements.notice.hidden = isAdmin;
  if (isAdmin) adminElements.signedInEmail.textContent = `Signed in as ${user.email}`;
}

async function syncAdminGateCookie(session) {
  const isAdmin = Boolean(session && session.access_token && session.user
    && (session.user.email || "").toLowerCase() === adminEmail);
  const response = await fetch("/api/admin-session", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(isAdmin ? { access_token: session.access_token } : { logout: true })
  });
  if (!response.ok) throw new Error("Could not verify the admin session with the server.");
}

async function loadSettings() {
  setNotice("Loading shared settings…");
  let { data, error } = await supabaseClient
    .from("site_settings")
    .select("brand_name, announcement, featured_competitions, updated_at, ad_enabled, ad_title, ad_message, ad_cta_label, ad_url")
    .eq("id", true)
    .maybeSingle();
  if (error) {
    const legacyResult = await supabaseClient
      .from("site_settings")
      .select("brand_name, announcement, featured_competitions, updated_at")
      .eq("id", true)
      .maybeSingle();
    if (legacyResult.error) {
      setNotice(`Could not load settings: ${legacyResult.error.message}`, "error");
      return;
    }
    data = legacyResult.data;
    hasExtendedSettings = false;
    adminElements.adSettings.hidden = true;
    adminElements.migrationNotice.hidden = false;
  } else {
    hasExtendedSettings = true;
    adminElements.adSettings.hidden = false;
    adminElements.migrationNotice.hidden = true;
  }
  if (!data) {
    setNotice("Settings row is missing. Run supabase-schema.sql in the Supabase SQL Editor.", "error");
    return;
  }

  adminElements.brandName.value = data.brand_name || "90+minutes";
  adminElements.announcement.value = data.announcement || "";
  adminElements.adEnabled.checked = Boolean(data.ad_enabled);
  adminElements.adTitle.value = data.ad_title || "";
  adminElements.adMessage.value = data.ad_message || "";
  adminElements.adCtaLabel.value = data.ad_cta_label || "";
  adminElements.adUrl.value = data.ad_url || "";
  const selected = new Set(data.featured_competitions || []);
  adminElements.leagueOptions.querySelectorAll('input[name="featured-competition"]')
    .forEach((input) => { input.checked = selected.has(input.value); });
  updateSettingsSummary(data);
  adminElements.notice.hidden = true;
  await Promise.all([loadMatchDashboard(), loadVisitorStats()]);
}

function updateSettingsSummary(settings) {
  const selectedNames = (settings.featured_competitions || [])
    .map((id) => adminLeagues.find(([leagueId]) => leagueId === id))
    .filter(Boolean)
    .map(([, name]) => name);
  adminElements.summaryBrand.textContent = settings.brand_name || "90+minutes";
  adminElements.summaryAnnouncement.textContent = settings.announcement || "None";
  adminElements.featuredCount.textContent = selectedNames.join(", ") || "None";
  adminElements.adStatus.textContent = settings.ad_enabled ? "Enabled" : "Disabled";
  if (!settings.updated_at) {
    adminElements.settingsUpdated.textContent = "Not available";
    return;
  }
  const updatedAt = new Date(settings.updated_at);
  adminElements.settingsUpdated.textContent = Number.isNaN(updatedAt.getTime())
    ? "Not available"
    : updatedAt.toLocaleString();
}

function localDateKey(date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

async function loadMatchDashboard() {
  adminElements.matchStatus.textContent = "Loading today’s matches…";
  adminElements.feedStatus.textContent = "Checking…";
  adminElements.matchList.replaceChildren();
  const selectedIds = new Set([...adminElements.leagueOptions
    .querySelectorAll('input[name="featured-competition"]:checked')]
    .map((input) => input.value));
  const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard?dates=${localDateKey(new Date())}&limit=1000`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Feed request failed (${response.status}).`);
    const data = await response.json();
    const matches = (data.events || []).filter((event) => {
      const leagueUid = event.uid && event.uid.match(/~l:(\d+)/);
      return leagueUid && selectedIds.has(leagueUid[1]);
    }).map((event) => {
      const competition = event.competitions && event.competitions[0];
      const competitors = competition && competition.competitors || [];
      const home = competitors.find((team) => team.homeAway === "home") || competitors[0] || {};
      const away = competitors.find((team) => team.homeAway === "away") || competitors[1] || {};
      const status = event.status && event.status.type || {};
      return {
        home: home.team && (home.team.displayName || home.team.name) || "Home",
        away: away.team && (away.team.displayName || away.team.name) || "Away",
        score: status.state !== "pre" ? `${home.score ?? "0"}–${away.score ?? "0"}` : "",
        state: status.state || "pre",
        detail: status.shortDetail || status.detail || new Date(event.date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      };
    });

    const counts = {
      live: matches.filter((match) => match.state === "in").length,
      upcoming: matches.filter((match) => match.state === "pre").length,
      finished: matches.filter((match) => match.state === "post").length
    };
    adminElements.liveCount.textContent = String(counts.live);
    adminElements.upcomingCount.textContent = String(counts.upcoming);
    adminElements.finishedCount.textContent = String(counts.finished);
    adminElements.matchStatus.textContent = matches.length
      ? `${matches.length} match${matches.length === 1 ? "" : "es"} across your featured competitions.`
      : "No matches found today for the featured competitions.";

    matches.slice(0, 20).forEach((match) => {
      const item = document.createElement("li");
      const teams = document.createElement("span");
      const detail = document.createElement("small");
      teams.textContent = `${match.home} vs ${match.away}`;
      detail.textContent = [match.score, match.detail].filter(Boolean).join(" · ");
      item.append(teams, detail);
      adminElements.matchList.append(item);
    });
    if (matches.length > 20) {
      const remainder = document.createElement("li");
      remainder.textContent = `${matches.length - 20} more matches`;
      adminElements.matchList.append(remainder);
    }
    adminElements.feedStatus.textContent = `Online · refreshed ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  } catch (error) {
    adminElements.matchStatus.textContent = `Could not load today’s matches: ${error.message}`;
    adminElements.feedStatus.textContent = "Unavailable";
  }
}

async function loadVisitorStats() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const monthStart = today.slice(0, 7) + "-01";
  const weekStartDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  weekStartDate.setUTCDate(weekStartDate.getUTCDate() - (weekStartDate.getUTCDay() + 6) % 7);
  const weekStart = weekStartDate.toISOString().slice(0, 10);
  const rangeStart = weekStart < monthStart ? weekStart : monthStart;
  const visits = [];
  try {
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await supabaseClient
        .from("site_visits")
        .select("visit_date, session_id")
        .gte("visit_date", rangeStart)
        .lte("visit_date", today)
        .order("visit_date", { ascending: true })
        .range(offset, offset + 999);
      if (error) throw error;
      visits.push(...data);
      if (data.length < 1000) break;
    }
  } catch (error) {
    adminElements.visitsToday.textContent = "—";
    adminElements.visitsWeek.textContent = "—";
    adminElements.visitsMonth.textContent = "—";
    adminElements.visitsStatus.textContent = ["PGRST202", "PGRST205"].includes(error.code)
      ? "Visitor database is not set up. Run supabase-schema.sql in Supabase SQL Editor."
      : "Visitor stats unavailable: " + error.message;
    return;
  }
  if (visits.some((visit) => !visit.visit_date || !visit.session_id)) {
    adminElements.visitsToday.textContent = "—";
    adminElements.visitsWeek.textContent = "—";
    adminElements.visitsMonth.textContent = "—";
    adminElements.visitsStatus.textContent = "Visitor stats unavailable: a visit record is incomplete.";
    return;
  }
  const todayVisitors = new Set();
  const weekVisitors = new Set();
  const monthVisitors = new Set();
  for (const visit of visits) {
    if (visit.visit_date >= monthStart) monthVisitors.add(visit.session_id);
    if (visit.visit_date >= weekStart) weekVisitors.add(visit.session_id);
    if (visit.visit_date === today) todayVisitors.add(visit.session_id);
  }
  adminElements.visitsToday.textContent = String(todayVisitors.size);
  adminElements.visitsWeek.textContent = String(weekVisitors.size);
  adminElements.visitsMonth.textContent = String(monthVisitors.size);
  adminElements.visitsStatus.textContent = "Unique anonymous browser sessions this UTC period; repeat loads are deduplicated per day. No IP addresses or personal details are stored.";
}

async function authorizeUser(user) {
  if (!user || (user.email || "").toLowerCase() !== adminEmail) {
    setSignedIn(null);
    await supabaseClient.auth.signOut();
    setNotice(`This panel is restricted to ${adminEmail}.`, "error");
    return;
  }
  setSignedIn(user);
  await loadSettings();
}

function renderLeagueOptions() {
  adminElements.leagueOptions.innerHTML = adminLeagues.map(([id, name]) => `
    <label class="admin-league-option">
      <input type="checkbox" name="featured-competition" value="${id}">
      <span>${name}</span>
    </label>
  `).join("");
}

adminElements.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) return;
  adminElements.loginButton.disabled = true;
  setNotice("Signing in…");
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: adminEmail,
    password: adminElements.password.value
  });
  adminElements.password.value = "";
  adminElements.loginButton.disabled = false;
  if (error) {
    setNotice(`Sign-in failed: ${error.message}`, "error");
    return;
  }
  await authorizeUser(data.user);
});

adminElements.passwordResetForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) return;

  const password = adminElements.newPassword.value;
  if (password.length < 8) {
    setNotice("Use a password with at least 8 characters.", "error");
    return;
  }
  if (password !== adminElements.confirmPassword.value) {
    setNotice("The passwords do not match.", "error");
    return;
  }

  adminElements.passwordResetButton.disabled = true;
  setNotice("Updating your password…");
  const { data, error } = await supabaseClient.auth.updateUser({ password });
  adminElements.newPassword.value = "";
  adminElements.confirmPassword.value = "";
  adminElements.passwordResetButton.disabled = false;
  if (error) {
    setNotice(`Could not update your password: ${error.message}`, "error");
    return;
  }
  await authorizeUser(data.user);
});

adminElements.settingsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) return;
  const featuredCompetitions = [...adminElements.leagueOptions
    .querySelectorAll('input[name="featured-competition"]:checked')]
    .map((input) => input.value);
  const brandName = adminElements.brandName.value.trim();
  if (!brandName) {
    setNotice("Enter a site name before saving.", "error");
    return;
  }
  if (!featuredCompetitions.length) {
    setNotice("Select at least one featured competition.", "error");
    return;
  }

  const settings = {
    id: true,
    brand_name: brandName,
    announcement: adminElements.announcement.value.trim(),
    featured_competitions: featuredCompetitions,
    updated_at: new Date().toISOString()
  };
  if (hasExtendedSettings) {
    const adUrl = adminElements.adUrl.value.trim();
    if (adminElements.adEnabled.checked) {
      let secureAdUrl = false;
      try {
        secureAdUrl = new URL(adUrl).protocol === "https:";
      } catch {
        secureAdUrl = false;
      }
      if (!adminElements.adTitle.value.trim() || !adminElements.adMessage.value.trim()
        || !adminElements.adCtaLabel.value.trim() || !secureAdUrl) {
        setNotice("For an enabled ad, add a headline, message, button label, and valid HTTPS destination.", "error");
        return;
      }
    }
    Object.assign(settings, {
      ad_enabled: adminElements.adEnabled.checked,
      ad_title: adminElements.adTitle.value.trim(),
      ad_message: adminElements.adMessage.value.trim(),
      ad_cta_label: adminElements.adCtaLabel.value.trim(),
      ad_url: adUrl
    });
  }

  adminElements.saveButton.disabled = true;
  setNotice("Saving shared settings…");
  const { error } = await supabaseClient
    .from("site_settings")
    .upsert(settings, { onConflict: "id" });
  adminElements.saveButton.disabled = false;
  if (error) {
    setNotice(`Could not save settings: ${error.message}`, "error");
    return;
  }
  updateSettingsSummary(settings);
  setNotice("Settings saved. They will appear for all visitors on their next page load.", "success");
});

adminElements.dashboardRefresh.addEventListener("click", async () => {
  adminElements.dashboardRefresh.disabled = true;
  await Promise.all([loadMatchDashboard(), loadVisitorStats()]);
  adminElements.dashboardRefresh.disabled = false;
});

adminElements.visitorsRefresh.addEventListener("click", async () => {
  adminElements.visitorsRefresh.disabled = true;
  await loadVisitorStats();
  adminElements.visitorsRefresh.disabled = false;
});

adminElements.signOutButton.addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    setNotice(`Could not sign out: ${error.message}`, "error");
    return;
  }
  try {
    await syncAdminGateCookie(null);
    location.replace("/admin.html");
  } catch (sessionError) {
    console.error("Could not clear the admin session.", sessionError);
    setSignedIn(null);
    setNotice("You have signed out, but the server session could not be cleared. Close this page and try again.", "error");
  }
});

const adminSections = [...document.querySelectorAll("[data-admin-section]")];
function setActiveAdminSection(sectionId) {
  adminSections.forEach((link) => {
    if (link.dataset.adminSection === sectionId) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

adminSections.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const section = document.getElementById(link.dataset.adminSection);
    if (!section) return;
    setActiveAdminSection(section.id);
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const activeEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (activeEntry) setActiveAdminSection(activeEntry.target.id);
  }, { rootMargin: "-15% 0px -65% 0px", threshold: [0, 0.1, 0.25, 0.5] });
  document.querySelectorAll(".admin-section-anchor").forEach((section) => sectionObserver.observe(section));
}

renderLeagueOptions();
if (!validConfig()) {
  setNotice("Admin setup is not finished. Add your Supabase project URL and public anon key to supabase-config.js, then create the database table using supabase-schema.sql.", "error");
} else if (!window.supabase || typeof window.supabase.createClient !== "function") {
  setNotice("The Supabase client could not be loaded. Check your connection and reload this page.", "error");
} else {
  supabaseClient = window.supabase.createClient(adminConfig.url, adminConfig.anonKey);
  setNotice("Checking admin session…");
  supabaseClient.auth.getUser().then(({ data, error }) => {
    if (error && error.name !== "AuthSessionMissingError") {
      setSignedIn(null);
      setNotice(`Could not check the sign-in session: ${error.message}`, "error");
      return;
    }
    if (data.user) authorizeUser(data.user);
    else {
      setSignedIn(null);
      location.replace("/admin.html");
    }
  });
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      location.replace("/admin.html");
      return;
    }
    if (session && session.user) {
      syncAdminGateCookie(session).then(() => authorizeUser(session.user)).catch((sessionError) => {
        console.error("Could not secure the admin session.", sessionError);
        setSignedIn(null);
        setNotice("Could not verify the admin session with the server.", "error");
        location.replace("/admin.html");
      });
    } else {
      syncAdminGateCookie(null).then(() => {
        setSignedIn(null);
        location.replace("/admin.html");
      }).catch((sessionError) => {
        console.error("Could not clear the admin session.", sessionError);
        setSignedIn(null);
        location.replace("/admin.html");
      });
    }
  });
}
