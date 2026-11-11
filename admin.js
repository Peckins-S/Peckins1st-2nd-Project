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
  advertAddButton: document.querySelector("#advert-add-button"),
  advertListStatus: document.querySelector("#advert-list-status"),
  advertList: document.querySelector("#advert-admin-list"),
  advertEditor: document.querySelector("#advert-editor"),
  advertEditorTitle: document.querySelector("#advert-editor-title"),
  advertEditorStatus: document.querySelector("#advert-editor-status"),
  advertId: document.querySelector("#advert-id"),
  advertPlacement: document.querySelector("#advert-placement"),
  advertHeadline: document.querySelector("#advert-headline"),
  advertDescription: document.querySelector("#advert-description"),
  advertButtonText: document.querySelector("#advert-button-text"),
  advertButtonUrl: document.querySelector("#advert-button-url"),
  advertBackgroundFile: document.querySelector("#advert-background-file"),
  advertLogoFile: document.querySelector("#advert-logo-file"),
  advertBackgroundPreview: document.querySelector("#advert-background-preview"),
  advertLogoPreview: document.querySelector("#advert-logo-preview"),
  advertBackgroundRemove: document.querySelector("#advert-background-remove"),
  advertBackgroundRemoveWrap: document.querySelector("#advert-background-remove-wrap"),
  advertLogoRemove: document.querySelector("#advert-logo-remove"),
  advertLogoRemoveWrap: document.querySelector("#advert-logo-remove-wrap"),
  advertCancelButton: document.querySelector("#advert-cancel-button"),
  advertSaveButton: document.querySelector("#advert-save-button"),
  advertPublishButton: document.querySelector("#advert-publish-button"),
  visitsToday: document.querySelector("#dashboard-visits-today"),
  visitsWeek: document.querySelector("#dashboard-visits-week"),
  visitsMonth: document.querySelector("#dashboard-visits-month"),
  visitsStatus: document.querySelector("#dashboard-visits-status"),
  settingsForm: document.querySelector("#settings-form"),
  brandName: document.querySelector("#brand-name"),
  announcement: document.querySelector("#announcement"),
  leagueOptions: document.querySelector("#league-options"),
  signedInEmail: document.querySelector("#signed-in-email"),
  loginButton: document.querySelector("#login-button"),
  saveButton: document.querySelector("#save-button"),
  signOutButton: document.querySelector("#sign-out-button")
};

let supabaseClient;
let adverts = [];
let currentAdvert = null;
let currentBackgroundUrl = "";
let currentLogoUrl = "";
const maxAdvertImageSize = 5 * 1024 * 1024;
const allowedAdvertImageTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

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
  const { data, error } = await supabaseClient
    .from("site_settings")
    .select("brand_name, announcement, featured_competitions, updated_at")
    .eq("id", true)
    .maybeSingle();
  if (error) {
    setNotice(`Could not load settings: ${error.message}`, "error");
    return;
  }
  if (!data) {
    setNotice("Settings row is missing. Run supabase-schema.sql in the Supabase SQL Editor.", "error");
    return;
  }

  adminElements.brandName.value = data.brand_name || "90+minutes";
  adminElements.announcement.value = data.announcement || "";
  const selected = new Set(data.featured_competitions || []);
  adminElements.leagueOptions.querySelectorAll('input[name="featured-competition"]')
    .forEach((input) => { input.checked = selected.has(input.value); });
  updateSettingsSummary(data);
  adminElements.notice.hidden = true;
  await Promise.all([loadMatchDashboard(), loadVisitorStats(), loadAdverts()]);
}

function updateSettingsSummary(settings) {
  const selectedNames = (settings.featured_competitions || [])
    .map((id) => adminLeagues.find(([leagueId]) => leagueId === id))
    .filter(Boolean)
    .map(([, name]) => name);
  adminElements.summaryBrand.textContent = settings.brand_name || "90+minutes";
  adminElements.summaryAnnouncement.textContent = settings.announcement || "None";
  adminElements.featuredCount.textContent = selectedNames.join(", ") || "None";
  adminElements.adStatus.textContent = `${adverts.filter((advert) => advert.is_enabled && advert.is_published).length} active`;
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
  const monthStart = `${today.slice(0, 7)}-01`;
  const utcWeekStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  utcWeekStart.setUTCDate(utcWeekStart.getUTCDate() - (utcWeekStart.getUTCDay() + 6) % 7);
  const weekStart = utcWeekStart.toISOString().slice(0, 10);
  const rangeStart = weekStart < monthStart ? weekStart : monthStart;
  const visits = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabaseClient
      .from("site_visits")
      .select("visit_date, session_id")
      .gte("visit_date", rangeStart)
      .lte("visit_date", today)
      .order("visit_date", { ascending: true })
      .range(offset, offset + 999);
    if (error) {
      adminElements.visitsToday.textContent = "—";
      adminElements.visitsWeek.textContent = "—";
      adminElements.visitsMonth.textContent = "—";
      adminElements.visitsStatus.textContent = ["PGRST202", "PGRST205"].includes(error.code)
        ? "Visitor database is not set up. Run supabase-schema.sql in Supabase SQL Editor."
        : `Visitor stats unavailable: ${error.message}`;
      return;
    }
    visits.push(...data);
    if (data.length < 1000) break;
  }

  const todayVisitors = new Set();
  const weekVisitors = new Set();
  const monthVisitors = new Set();
  if (visits.some((visit) => !visit.visit_date || !visit.session_id)) {
    adminElements.visitsToday.textContent = "—";
    adminElements.visitsWeek.textContent = "—";
    adminElements.visitsMonth.textContent = "—";
    adminElements.visitsStatus.textContent = "Visitor stats unavailable: a visit record is incomplete.";
    return;
  }
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

function validAdvertDestination(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function validAdvertImageUrl(value) {
  if (!value || !adminConfig) return "";
  try {
    const image = new URL(value);
    return image.protocol === "https:" && image.origin === new URL(adminConfig.url).origin
      && image.pathname.startsWith("/storage/v1/object/public/site-adverts/")
      ? image.href
      : "";
  } catch {
    return "";
  }
}

function updateAdvertImagePreview(image, url) {
  const safeUrl = validAdvertImageUrl(url);
  image.hidden = !safeUrl;
  image.removeAttribute("src");
  if (safeUrl) image.src = safeUrl;
}

function updateAdvertSummary() {
  adminElements.adStatus.textContent = `${adverts.filter((advert) => advert.is_enabled && advert.is_published).length} active`;
}

function createAdvertButton(label, className, handler) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", handler);
  return button;
}

function renderAdvertList() {
  adminElements.advertList.replaceChildren();
  adminElements.advertListStatus.textContent = adverts.length
    ? `${adverts.length} advert${adverts.length === 1 ? "" : "s"}`
    : "No adverts yet. Add one to get started.";
  updateAdvertSummary();

  for (const advert of adverts) {
    const card = document.createElement("article");
    card.className = "advert-admin-card";
    const imageUrl = validAdvertImageUrl(advert.logo_image_url) || validAdvertImageUrl(advert.background_image_url);
    if (imageUrl) {
      const image = document.createElement("img");
      image.className = "advert-admin-thumbnail";
      image.src = imageUrl;
      image.alt = "";
      card.append(image);
    }

    const details = document.createElement("div");
    details.className = "advert-admin-details";
    const title = document.createElement("h3");
    title.textContent = advert.headline;
    const meta = document.createElement("p");
    meta.textContent = `${advert.placement === "top_banner" ? "Top banner" : "Bottom-right pop up"} · ${advert.is_published ? (advert.is_enabled ? "Published · on" : "Published · off") : "Draft"}`;
    const description = document.createElement("p");
    description.textContent = advert.description;
    details.append(title, meta, description);
    card.append(details);

    const actions = document.createElement("div");
    actions.className = "advert-admin-actions";
    actions.append(
      createAdvertButton("Edit", "admin-secondary-button", () => showAdvertEditor(advert))
    );
    if (!advert.is_published) {
      actions.append(createAdvertButton("Publish", "admin-primary-button", () => setAdvertState(advert, true)));
    } else {
      actions.append(createAdvertButton(advert.is_enabled ? "Turn off" : "Turn on", "admin-secondary-button", () =>
        setAdvertState(advert, !advert.is_enabled)));
    }
    actions.append(createAdvertButton("Delete", "advert-delete-button", () => deleteAdvert(advert)));
    card.append(actions);
    adminElements.advertList.append(card);
  }
}

async function loadAdverts() {
  adminElements.advertListStatus.textContent = "Loading adverts…";
  const { data, error } = await supabaseClient
    .from("site_adverts")
    .select("id, placement, headline, description, button_text, button_url, background_image_url, logo_image_url, is_enabled, is_published, created_at, updated_at")
    .order("updated_at", { ascending: false });
  if (error) {
    adminElements.advertListStatus.textContent = "Advert service unavailable.";
    setNotice(`Could not load adverts. Apply the adverts and storage setup in supabase-schema.sql: ${error.message}`, "error");
    return false;
  }
  adverts = data || [];
  renderAdvertList();
  return true;
}

function resetAdvertEditor() {
  currentAdvert = null;
  currentBackgroundUrl = "";
  currentLogoUrl = "";
  adminElements.advertId.value = "";
  adminElements.advertPlacement.value = "top_banner";
  adminElements.advertHeadline.value = "";
  adminElements.advertDescription.value = "";
  adminElements.advertButtonText.value = "";
  adminElements.advertButtonUrl.value = "";
  adminElements.advertBackgroundFile.value = "";
  adminElements.advertLogoFile.value = "";
  adminElements.advertBackgroundRemove.checked = false;
  adminElements.advertLogoRemove.checked = false;
  adminElements.advertBackgroundRemoveWrap.hidden = true;
  adminElements.advertLogoRemoveWrap.hidden = true;
  adminElements.advertBackgroundPreview.hidden = true;
  adminElements.advertLogoPreview.hidden = true;
  adminElements.advertEditorStatus.textContent = "";
  adminElements.advertEditor.hidden = true;
}

function showAdvertEditor(advert = null) {
  currentAdvert = advert;
  currentBackgroundUrl = advert ? validAdvertImageUrl(advert.background_image_url) : "";
  currentLogoUrl = advert ? validAdvertImageUrl(advert.logo_image_url) : "";
  adminElements.advertId.value = advert ? advert.id : "";
  adminElements.advertPlacement.value = advert ? advert.placement : "top_banner";
  adminElements.advertHeadline.value = advert ? advert.headline : "";
  adminElements.advertDescription.value = advert ? advert.description : "";
  adminElements.advertButtonText.value = advert ? advert.button_text : "";
  adminElements.advertButtonUrl.value = advert ? advert.button_url : "";
  adminElements.advertBackgroundFile.value = "";
  adminElements.advertLogoFile.value = "";
  adminElements.advertBackgroundRemove.checked = false;
  adminElements.advertLogoRemove.checked = false;
  adminElements.advertBackgroundRemoveWrap.hidden = !currentBackgroundUrl;
  adminElements.advertLogoRemoveWrap.hidden = !currentLogoUrl;
  updateAdvertImagePreview(adminElements.advertBackgroundPreview, currentBackgroundUrl);
  updateAdvertImagePreview(adminElements.advertLogoPreview, currentLogoUrl);
  adminElements.advertEditorTitle.textContent = advert ? "Edit advert" : "New advert";
  adminElements.advertSaveButton.textContent = advert ? "Save changes" : "Save draft";
  adminElements.advertEditorStatus.textContent = "";
  adminElements.advertEditor.hidden = false;
  adminElements.advertEditor.scrollIntoView({ behavior: "smooth", block: "start" });
}

function previewAdvertFile(input, preview, kind) {
  const file = input.files[0];
  if (!file) return;
  if (!allowedAdvertImageTypes.has(file.type) || file.size > maxAdvertImageSize) {
    input.value = "";
    adminElements.advertEditorStatus.textContent = "Choose a PNG, JPG, WebP or GIF image no larger than 5 MB.";
    return;
  }
  const previewUrl = URL.createObjectURL(file);
  preview.src = previewUrl;
  preview.hidden = false;
  if (kind === "background") adminElements.advertBackgroundRemove.checked = false;
  else adminElements.advertLogoRemove.checked = false;
}

async function uploadAdvertImage(file, advertId, kind) {
  if (!file) return "";
  if (!allowedAdvertImageTypes.has(file.type) || file.size > maxAdvertImageSize) {
    throw new Error("Choose a PNG, JPG, WebP or GIF image no larger than 5 MB.");
  }
  const extensionByType = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif"
  };
  const path = `${advertId}/${kind}-${crypto.randomUUID()}.${extensionByType[file.type]}`;
  const { error } = await supabaseClient.storage.from("site-adverts").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false
  });
  if (error) throw new Error(`Could not upload the ${kind} image: ${error.message}`);
  const { data } = supabaseClient.storage.from("site-adverts").getPublicUrl(path);
  if (!data || !validAdvertImageUrl(data.publicUrl)) {
    await supabaseClient.storage.from("site-adverts").remove([path]);
    throw new Error("The advert image upload returned an invalid public URL.");
  }
  return data.publicUrl;
}

function advertStoragePath(url) {
  const safeUrl = validAdvertImageUrl(url);
  if (!safeUrl) return "";
  const pathname = new URL(safeUrl).pathname;
  const prefix = "/storage/v1/object/public/site-adverts/";
  return pathname.slice(prefix.length).split("/").map(decodeURIComponent).join("/");
}

async function removeAdvertImages(urls) {
  const paths = [...new Set(urls.map(advertStoragePath).filter(Boolean))];
  if (!paths.length) return null;
  const { error } = await supabaseClient.storage.from("site-adverts").remove(paths);
  return error;
}

async function saveAdvert(publish) {
  const headline = adminElements.advertHeadline.value.trim();
  const description = adminElements.advertDescription.value.trim();
  const buttonText = adminElements.advertButtonText.value.trim();
  let buttonUrl = "";
  try {
    const destination = new URL(adminElements.advertButtonUrl.value.trim());
    if (destination.protocol === "https:") buttonUrl = destination.href;
  } catch {
    buttonUrl = "";
  }
  const placement = adminElements.advertPlacement.value;
  const backgroundFile = adminElements.advertBackgroundFile.files[0];
  const logoFile = adminElements.advertLogoFile.files[0];
  if (!headline || !description || !buttonText || !validAdvertDestination(buttonUrl)) {
    adminElements.advertEditorStatus.textContent = "Add a headline, description, button text, and a valid HTTPS button link.";
    return;
  }
  const id = currentAdvert ? currentAdvert.id : crypto.randomUUID();
  const uploadedUrls = [];
  const buttons = [adminElements.advertSaveButton, adminElements.advertPublishButton];
  buttons.forEach((button) => { button.disabled = true; });
  adminElements.advertEditorStatus.textContent = "Saving advert…";
  try {
    let backgroundUrl = adminElements.advertBackgroundRemove.checked ? "" : currentBackgroundUrl;
    let logoUrl = adminElements.advertLogoRemove.checked ? "" : currentLogoUrl;
    if (backgroundFile) {
      backgroundUrl = await uploadAdvertImage(backgroundFile, id, "background");
      uploadedUrls.push(backgroundUrl);
    }
    if (logoFile) {
      logoUrl = await uploadAdvertImage(logoFile, id, "logo");
      uploadedUrls.push(logoUrl);
    }
    if (publish && !backgroundUrl && !logoUrl) {
      throw new Error("Upload at least one background image or logo before publishing.");
    }
    const isPublished = publish || Boolean(currentAdvert && currentAdvert.is_published);
    const isEnabled = publish || Boolean(currentAdvert && currentAdvert.is_enabled);
    if (isPublished && isEnabled) {
      const { error: deactivateError } = await supabaseClient
        .from("site_adverts")
        .update({ is_enabled: false, updated_at: new Date().toISOString() })
        .eq("placement", placement)
        .eq("is_published", true)
        .eq("is_enabled", true)
        .neq("id", id);
      if (deactivateError) throw new Error(`Could not make room for this placement: ${deactivateError.message}`);
    }
    const record = {
      id,
      placement,
      headline,
      description,
      button_text: buttonText,
      button_url: buttonUrl,
      background_image_url: backgroundUrl,
      logo_image_url: logoUrl,
      is_published: isPublished,
      is_enabled: isEnabled,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabaseClient.from("site_adverts").upsert(record, { onConflict: "id" });
    if (error) throw new Error(`Could not save advert: ${error.message}`);

    const oldUrls = currentAdvert
      ? [currentAdvert.background_image_url, currentAdvert.logo_image_url]
        .filter((url) => url && url !== backgroundUrl && url !== logoUrl)
      : [];
    const cleanupError = await removeAdvertImages(oldUrls);
    resetAdvertEditor();
    const refreshed = await loadAdverts();
    if (!refreshed) return;
    if (cleanupError) {
      setNotice(`Advert saved, but an old image could not be removed: ${cleanupError.message}`, "error");
    } else {
      setNotice(isPublished ? "Advert published and live on the site." : "Advert draft saved.", "success");
    }
  } catch (error) {
    const cleanupError = await removeAdvertImages(uploadedUrls);
    adminElements.advertEditorStatus.textContent = cleanupError
      ? `${error.message} Uploaded image cleanup also failed: ${cleanupError.message}`
      : error.message;
  } finally {
    buttons.forEach((button) => { button.disabled = false; });
  }
}

async function setAdvertState(advert, enabled) {
  if (enabled) {
    if (!validAdvertImageUrl(advert.background_image_url) && !validAdvertImageUrl(advert.logo_image_url)) {
      setNotice("Add a background image or logo in Edit before publishing this advert.", "error");
      return;
    }
    const { error: deactivateError } = await supabaseClient
      .from("site_adverts")
      .update({ is_enabled: false, updated_at: new Date().toISOString() })
      .eq("placement", advert.placement)
      .eq("is_published", true)
      .eq("is_enabled", true)
      .neq("id", advert.id);
    if (deactivateError) {
      setNotice(`Could not activate this advert: ${deactivateError.message}`, "error");
      return;
    }
  }
  const { error } = await supabaseClient
    .from("site_adverts")
    .update({
      is_enabled: enabled,
      is_published: enabled || advert.is_published,
      updated_at: new Date().toISOString()
    })
    .eq("id", advert.id);
  if (error) {
    setNotice(`Could not change advert status: ${error.message}`, "error");
    return;
  }
  if (!await loadAdverts()) return;
  setNotice(enabled ? "Advert published and live on the site." : "Advert turned off.", "success");
}

async function deleteAdvert(advert) {
  if (!window.confirm(`Delete "${advert.headline}"? This cannot be undone.`)) return;
  const { error } = await supabaseClient.from("site_adverts").delete().eq("id", advert.id);
  if (error) {
    setNotice(`Could not delete advert: ${error.message}`, "error");
    return;
  }
  const cleanupError = await removeAdvertImages([advert.background_image_url, advert.logo_image_url]);
  if (!await loadAdverts()) return;
  setNotice(cleanupError
    ? `Advert deleted, but an image could not be removed: ${cleanupError.message}`
    : "Advert deleted.", cleanupError ? "error" : "success");
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

adminElements.advertAddButton.addEventListener("click", () => showAdvertEditor());
adminElements.advertCancelButton.addEventListener("click", resetAdvertEditor);
adminElements.advertSaveButton.addEventListener("click", () => saveAdvert(false));
adminElements.advertPublishButton.addEventListener("click", () => saveAdvert(true));
adminElements.advertBackgroundFile.addEventListener("change", () =>
  previewAdvertFile(adminElements.advertBackgroundFile, adminElements.advertBackgroundPreview, "background"));
adminElements.advertLogoFile.addEventListener("change", () =>
  previewAdvertFile(adminElements.advertLogoFile, adminElements.advertLogoPreview, "logo"));
adminElements.advertBackgroundRemove.addEventListener("change", () => {
  if (adminElements.advertBackgroundRemove.checked && !adminElements.advertBackgroundFile.files[0]) {
    adminElements.advertBackgroundPreview.hidden = true;
  } else if (currentBackgroundUrl) {
    updateAdvertImagePreview(adminElements.advertBackgroundPreview, currentBackgroundUrl);
  }
});
adminElements.advertLogoRemove.addEventListener("change", () => {
  if (adminElements.advertLogoRemove.checked && !adminElements.advertLogoFile.files[0]) {
    adminElements.advertLogoPreview.hidden = true;
  } else if (currentLogoUrl) {
    updateAdvertImagePreview(adminElements.advertLogoPreview, currentLogoUrl);
  }
});
adminElements.advertEditor.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") event.preventDefault();
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
  advertAddButton: document.querySelector("#advert-add-button"),
  advertListStatus: document.querySelector("#advert-list-status"),
  advertList: document.querySelector("#advert-admin-list"),
  advertEditor: document.querySelector("#advert-editor"),
  advertEditorTitle: document.querySelector("#advert-editor-title"),
  advertEditorStatus: document.querySelector("#advert-editor-status"),
  advertId: document.querySelector("#advert-id"),
  advertPlacement: document.querySelector("#advert-placement"),
  advertHeadline: document.querySelector("#advert-headline"),
  advertDescription: document.querySelector("#advert-description"),
  advertButtonText: document.querySelector("#advert-button-text"),
  advertButtonUrl: document.querySelector("#advert-button-url"),
  advertBackgroundFile: document.querySelector("#advert-background-file"),
  advertLogoFile: document.querySelector("#advert-logo-file"),
  advertBackgroundPreview: document.querySelector("#advert-background-preview"),
  advertLogoPreview: document.querySelector("#advert-logo-preview"),
  advertBackgroundRemove: document.querySelector("#advert-background-remove"),
  advertBackgroundRemoveWrap: document.querySelector("#advert-background-remove-wrap"),
  advertLogoRemove: document.querySelector("#advert-logo-remove"),
  advertLogoRemoveWrap: document.querySelector("#advert-logo-remove-wrap"),
  advertCancelButton: document.querySelector("#advert-cancel-button"),
  advertSaveButton: document.querySelector("#advert-save-button"),
  advertPublishButton: document.querySelector("#advert-publish-button"),
  visitsToday: document.querySelector("#dashboard-visits-today"),
  visitsWeek: document.querySelector("#dashboard-visits-week"),
  visitsMonth: document.querySelector("#dashboard-visits-month"),
  visitsStatus: document.querySelector("#dashboard-visits-status"),
  settingsForm: document.querySelector("#settings-form"),
  brandName: document.querySelector("#brand-name"),
  announcement: document.querySelector("#announcement"),
  leagueOptions: document.querySelector("#league-options"),
  signedInEmail: document.querySelector("#signed-in-email"),
  loginButton: document.querySelector("#login-button"),
  saveButton: document.querySelector("#save-button"),
  signOutButton: document.querySelector("#sign-out-button")
};

let supabaseClient;
let adverts = [];
let currentAdvert = null;
let currentBackgroundUrl = "";
let currentLogoUrl = "";
const maxAdvertImageSize = 5 * 1024 * 1024;
const allowedAdvertImageTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

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
  const { data, error } = await supabaseClient
    .from("site_settings")
    .select("brand_name, announcement, featured_competitions, updated_at")
    .eq("id", true)
    .maybeSingle();
  if (error) {
    setNotice(`Could not load settings: ${error.message}`, "error");
    return;
  }
  if (!data) {
    setNotice("Settings row is missing. Run supabase-schema.sql in the Supabase SQL Editor.", "error");
    return;
  }

  adminElements.brandName.value = data.brand_name || "90+minutes";
  adminElements.announcement.value = data.announcement || "";
  const selected = new Set(data.featured_competitions || []);
  adminElements.leagueOptions.querySelectorAll('input[name="featured-competition"]')
    .forEach((input) => { input.checked = selected.has(input.value); });
  updateSettingsSummary(data);
  adminElements.notice.hidden = true;
  await Promise.all([loadMatchDashboard(), loadVisitorStats(), loadAdverts()]);
}

function updateSettingsSummary(settings) {
  const selectedNames = (settings.featured_competitions || [])
    .map((id) => adminLeagues.find(([leagueId]) => leagueId === id))
    .filter(Boolean)
    .map(([, name]) => name);
  adminElements.summaryBrand.textContent = settings.brand_name || "90+minutes";
  adminElements.summaryAnnouncement.textContent = settings.announcement || "None";
  adminElements.featuredCount.textContent = selectedNames.join(", ") || "None";
  adminElements.adStatus.textContent = `${adverts.filter((advert) => advert.is_enabled && advert.is_published).length} active`;
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
  const monthStart = `${today.slice(0, 7)}-01`;
  const utcWeekStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  utcWeekStart.setUTCDate(utcWeekStart.getUTCDate() - (utcWeekStart.getUTCDay() + 6) % 7);
  const weekStart = utcWeekStart.toISOString().slice(0, 10);
  const rangeStart = weekStart < monthStart ? weekStart : monthStart;
  const visits = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabaseClient
      .from("site_visits")
      .select("visit_date, session_id")
      .gte("visit_date", rangeStart)
      .lte("visit_date", today)
      .order("visit_date", { ascending: true })
      .range(offset, offset + 999);
    if (error) {
      adminElements.visitsToday.textContent = "—";
      adminElements.visitsWeek.textContent = "—";
      adminElements.visitsMonth.textContent = "—";
      adminElements.visitsStatus.textContent = ["PGRST202", "PGRST205"].includes(error.code)
        ? "Visitor database is not set up. Run supabase-schema.sql in Supabase SQL Editor."
        : `Visitor stats unavailable: ${error.message}`;
      return;
    }
    visits.push(...data);
    if (data.length < 1000) break;
  }

  const todayVisitors = new Set();
  const weekVisitors = new Set();
  const monthVisitors = new Set();
  if (visits.some((visit) => !visit.visit_date || !visit.session_id)) {
    adminElements.visitsToday.textContent = "—";
    adminElements.visitsWeek.textContent = "—";
    adminElements.visitsMonth.textContent = "—";
    adminElements.visitsStatus.textContent = "Visitor stats unavailable: a visit record is incomplete.";
    return;
  }
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

function validAdvertDestination(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function validAdvertImageUrl(value) {
  if (!value || !adminConfig) return "";
  try {
    const image = new URL(value);
    return image.protocol === "https:" && image.origin === new URL(adminConfig.url).origin
      && image.pathname.startsWith("/storage/v1/object/public/site-adverts/")
      ? image.href
      : "";
  } catch {
    return "";
  }
}

function updateAdvertImagePreview(image, url) {
  const safeUrl = validAdvertImageUrl(url);
  image.hidden = !safeUrl;
  image.removeAttribute("src");
  if (safeUrl) image.src = safeUrl;
}

function updateAdvertSummary() {
  adminElements.adStatus.textContent = `${adverts.filter((advert) => advert.is_enabled && advert.is_published).length} active`;
}

function createAdvertButton(label, className, handler) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", handler);
  return button;
}

function renderAdvertList() {
  adminElements.advertList.replaceChildren();
  adminElements.advertListStatus.textContent = adverts.length
    ? `${adverts.length} advert${adverts.length === 1 ? "" : "s"}`
    : "No adverts yet. Add one to get started.";
  updateAdvertSummary();

  for (const advert of adverts) {
    const card = document.createElement("article");
    card.className = "advert-admin-card";
    const imageUrl = validAdvertImageUrl(advert.logo_image_url) || validAdvertImageUrl(advert.background_image_url);
    if (imageUrl) {
      const image = document.createElement("img");
      image.className = "advert-admin-thumbnail";
      image.src = imageUrl;
      image.alt = "";
      card.append(image);
    }

    const details = document.createElement("div");
    details.className = "advert-admin-details";
    const title = document.createElement("h3");
    title.textContent = advert.headline;
    const meta = document.createElement("p");
    meta.textContent = `${advert.placement === "top_banner" ? "Top banner" : "Bottom-right pop up"} · ${advert.is_published ? (advert.is_enabled ? "Published · on" : "Published · off") : "Draft"}`;
    const description = document.createElement("p");
    description.textContent = advert.description;
    details.append(title, meta, description);
    card.append(details);

    const actions = document.createElement("div");
    actions.className = "advert-admin-actions";
    actions.append(
      createAdvertButton("Edit", "admin-secondary-button", () => showAdvertEditor(advert))
    );
    if (!advert.is_published) {
      actions.append(createAdvertButton("Publish", "admin-primary-button", () => setAdvertState(advert, true)));
    } else {
      actions.append(createAdvertButton(advert.is_enabled ? "Turn off" : "Turn on", "admin-secondary-button", () =>
        setAdvertState(advert, !advert.is_enabled)));
    }
    actions.append(createAdvertButton("Delete", "advert-delete-button", () => deleteAdvert(advert)));
    card.append(actions);
    adminElements.advertList.append(card);
  }
}

async function loadAdverts() {
  adminElements.advertListStatus.textContent = "Loading adverts…";
  const { data, error } = await supabaseClient
    .from("site_adverts")
    .select("id, placement, headline, description, button_text, button_url, background_image_url, logo_image_url, is_enabled, is_published, created_at, updated_at")
    .order("updated_at", { ascending: false });
  if (error) {
    adminElements.advertListStatus.textContent = "Advert service unavailable.";
    setNotice(`Could not load adverts. Apply the adverts and storage setup in supabase-schema.sql: ${error.message}`, "error");
    return false;
  }
  adverts = data || [];
  renderAdvertList();
  return true;
}

function resetAdvertEditor() {
  currentAdvert = null;
  currentBackgroundUrl = "";
  currentLogoUrl = "";
  adminElements.advertId.value = "";
  adminElements.advertPlacement.value = "top_banner";
  adminElements.advertHeadline.value = "";
  adminElements.advertDescription.value = "";
  adminElements.advertButtonText.value = "";
  adminElements.advertButtonUrl.value = "";
  adminElements.advertBackgroundFile.value = "";
  adminElements.advertLogoFile.value = "";
  adminElements.advertBackgroundRemove.checked = false;
  adminElements.advertLogoRemove.checked = false;
  adminElements.advertBackgroundRemoveWrap.hidden = true;
  adminElements.advertLogoRemoveWrap.hidden = true;
  adminElements.advertBackgroundPreview.hidden = true;
  adminElements.advertLogoPreview.hidden = true;
  adminElements.advertEditorStatus.textContent = "";
  adminElements.advertEditor.hidden = true;
}

function showAdvertEditor(advert = null) {
  currentAdvert = advert;
  currentBackgroundUrl = advert ? validAdvertImageUrl(advert.background_image_url) : "";
  currentLogoUrl = advert ? validAdvertImageUrl(advert.logo_image_url) : "";
  adminElements.advertId.value = advert ? advert.id : "";
  adminElements.advertPlacement.value = advert ? advert.placement : "top_banner";
  adminElements.advertHeadline.value = advert ? advert.headline : "";
  adminElements.advertDescription.value = advert ? advert.description : "";
  adminElements.advertButtonText.value = advert ? advert.button_text : "";
  adminElements.advertButtonUrl.value = advert ? advert.button_url : "";
  adminElements.advertBackgroundFile.value = "";
  adminElements.advertLogoFile.value = "";
  adminElements.advertBackgroundRemove.checked = false;
  adminElements.advertLogoRemove.checked = false;
  adminElements.advertBackgroundRemoveWrap.hidden = !currentBackgroundUrl;
  adminElements.advertLogoRemoveWrap.hidden = !currentLogoUrl;
  updateAdvertImagePreview(adminElements.advertBackgroundPreview, currentBackgroundUrl);
  updateAdvertImagePreview(adminElements.advertLogoPreview, currentLogoUrl);
  adminElements.advertEditorTitle.textContent = advert ? "Edit advert" : "New advert";
  adminElements.advertSaveButton.textContent = advert ? "Save changes" : "Save draft";
  adminElements.advertEditorStatus.textContent = "";
  adminElements.advertEditor.hidden = false;
  adminElements.advertEditor.scrollIntoView({ behavior: "smooth", block: "start" });
}

function previewAdvertFile(input, preview, kind) {
  const file = input.files[0];
  if (!file) return;
  if (!allowedAdvertImageTypes.has(file.type) || file.size > maxAdvertImageSize) {
    input.value = "";
    adminElements.advertEditorStatus.textContent = "Choose a PNG, JPG, WebP or GIF image no larger than 5 MB.";
    return;
  }
  const previewUrl = URL.createObjectURL(file);
  preview.src = previewUrl;
  preview.hidden = false;
  if (kind === "background") adminElements.advertBackgroundRemove.checked = false;
  else adminElements.advertLogoRemove.checked = false;
}

async function uploadAdvertImage(file, advertId, kind) {
  if (!file) return "";
  if (!allowedAdvertImageTypes.has(file.type) || file.size > maxAdvertImageSize) {
    throw new Error("Choose a PNG, JPG, WebP or GIF image no larger than 5 MB.");
  }
  const extensionByType = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif"
  };
  const path = `${advertId}/${kind}-${crypto.randomUUID()}.${extensionByType[file.type]}`;
  const { error } = await supabaseClient.storage.from("site-adverts").upload(path, file, {
    cacheControl: "3600",
    contentType: file.type,
    upsert: false
  });
  if (error) throw new Error(`Could not upload the ${kind} image: ${error.message}`);
  const { data } = supabaseClient.storage.from("site-adverts").getPublicUrl(path);
  if (!data || !validAdvertImageUrl(data.publicUrl)) {
    await supabaseClient.storage.from("site-adverts").remove([path]);
    throw new Error("The advert image upload returned an invalid public URL.");
  }
  return data.publicUrl;
}

function advertStoragePath(url) {
  const safeUrl = validAdvertImageUrl(url);
  if (!safeUrl) return "";
  const pathname = new URL(safeUrl).pathname;
  const prefix = "/storage/v1/object/public/site-adverts/";
  return pathname.slice(prefix.length).split("/").map(decodeURIComponent).join("/");
}

async function removeAdvertImages(urls) {
  const paths = [...new Set(urls.map(advertStoragePath).filter(Boolean))];
  if (!paths.length) return null;
  const { error } = await supabaseClient.storage.from("site-adverts").remove(paths);
  return error;
}

async function saveAdvert(publish) {
  const headline = adminElements.advertHeadline.value.trim();
  const description = adminElements.advertDescription.value.trim();
  const buttonText = adminElements.advertButtonText.value.trim();
  let buttonUrl = "";
  try {
    const destination = new URL(adminElements.advertButtonUrl.value.trim());
    if (destination.protocol === "https:") buttonUrl = destination.href;
  } catch {
    buttonUrl = "";
  }
  const placement = adminElements.advertPlacement.value;
  const backgroundFile = adminElements.advertBackgroundFile.files[0];
  const logoFile = adminElements.advertLogoFile.files[0];
  if (!headline || !description || !buttonText || !validAdvertDestination(buttonUrl)) {
    adminElements.advertEditorStatus.textContent = "Add a headline, description, button text, and a valid HTTPS button link.";
    return;
  }
  const id = currentAdvert ? currentAdvert.id : crypto.randomUUID();
  const uploadedUrls = [];
  const buttons = [adminElements.advertSaveButton, adminElements.advertPublishButton];
  buttons.forEach((button) => { button.disabled = true; });
  adminElements.advertEditorStatus.textContent = "Saving advert…";
  try {
    let backgroundUrl = adminElements.advertBackgroundRemove.checked ? "" : currentBackgroundUrl;
    let logoUrl = adminElements.advertLogoRemove.checked ? "" : currentLogoUrl;
    if (backgroundFile) {
      backgroundUrl = await uploadAdvertImage(backgroundFile, id, "background");
      uploadedUrls.push(backgroundUrl);
    }
    if (logoFile) {
      logoUrl = await uploadAdvertImage(logoFile, id, "logo");
      uploadedUrls.push(logoUrl);
    }
    if (publish && !backgroundUrl && !logoUrl) {
      throw new Error("Upload at least one background image or logo before publishing.");
    }
    const isPublished = publish || Boolean(currentAdvert && currentAdvert.is_published);
    const isEnabled = publish || Boolean(currentAdvert && currentAdvert.is_enabled);
    if (isPublished && isEnabled) {
      const { error: deactivateError } = await supabaseClient
        .from("site_adverts")
        .update({ is_enabled: false, updated_at: new Date().toISOString() })
        .eq("placement", placement)
        .eq("is_published", true)
        .eq("is_enabled", true)
        .neq("id", id);
      if (deactivateError) throw new Error(`Could not make room for this placement: ${deactivateError.message}`);
    }
    const record = {
      id,
      placement,
      headline,
      description,
      button_text: buttonText,
      button_url: buttonUrl,
      background_image_url: backgroundUrl,
      logo_image_url: logoUrl,
      is_published: isPublished,
      is_enabled: isEnabled,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabaseClient.from("site_adverts").upsert(record, { onConflict: "id" });
    if (error) throw new Error(`Could not save advert: ${error.message}`);

    const oldUrls = currentAdvert
      ? [currentAdvert.background_image_url, currentAdvert.logo_image_url]
        .filter((url) => url && url !== backgroundUrl && url !== logoUrl)
      : [];
    const cleanupError = await removeAdvertImages(oldUrls);
    resetAdvertEditor();
    const refreshed = await loadAdverts();
    if (!refreshed) return;
    if (cleanupError) {
      setNotice(`Advert saved, but an old image could not be removed: ${cleanupError.message}`, "error");
    } else {
      setNotice(isPublished ? "Advert published and live on the site." : "Advert draft saved.", "success");
    }
  } catch (error) {
    const cleanupError = await removeAdvertImages(uploadedUrls);
    adminElements.advertEditorStatus.textContent = cleanupError
      ? `${error.message} Uploaded image cleanup also failed: ${cleanupError.message}`
      : error.message;
  } finally {
    buttons.forEach((button) => { button.disabled = false; });
  }
}

async function setAdvertState(advert, enabled) {
  if (enabled) {
    const { error: deactivateError } = await supabaseClient
      .from("site_adverts")
      .update({ is_enabled: false, updated_at: new Date().toISOString() })
      .eq("placement", advert.placement)
      .eq("is_published", true)
      .eq("is_enabled", true)
      .neq("id", advert.id);
    if (deactivateError) {
      setNotice(`Could not activate this advert: ${deactivateError.message}`, "error");
      return;
    }
  }
  const { error } = await supabaseClient
    .from("site_adverts")
    .update({
      is_enabled: enabled,
      is_published: enabled || advert.is_published,
      updated_at: new Date().toISOString()
    })
    .eq("id", advert.id);
  if (error) {
    setNotice(`Could not change advert status: ${error.message}`, "error");
    return;
  }
  if (!await loadAdverts()) return;
  setNotice(enabled ? "Advert published and live on the site." : "Advert turned off.", "success");
}

async function deleteAdvert(advert) {
  if (!window.confirm(`Delete "${advert.headline}"? This cannot be undone.`)) return;
  const { error } = await supabaseClient.from("site_adverts").delete().eq("id", advert.id);
  if (error) {
    setNotice(`Could not delete advert: ${error.message}`, "error");
    return;
  }
  const cleanupError = await removeAdvertImages([advert.background_image_url, advert.logo_image_url]);
  if (!await loadAdverts()) return;
  setNotice(cleanupError
    ? `Advert deleted, but an image could not be removed: ${cleanupError.message}`
    : "Advert deleted.", cleanupError ? "error" : "success");
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

adminElements.advertAddButton.addEventListener("click", () => showAdvertEditor());
adminElements.advertCancelButton.addEventListener("click", resetAdvertEditor);
adminElements.advertSaveButton.addEventListener("click", () => saveAdvert(false));
adminElements.advertPublishButton.addEventListener("click", () => saveAdvert(true));
adminElements.advertBackgroundFile.addEventListener("change", () =>
  previewAdvertFile(adminElements.advertBackgroundFile, adminElements.advertBackgroundPreview, "background"));
adminElements.advertLogoFile.addEventListener("change", () =>
  previewAdvertFile(adminElements.advertLogoFile, adminElements.advertLogoPreview, "logo"));
adminElements.advertBackgroundRemove.addEventListener("change", () => {
  if (adminElements.advertBackgroundRemove.checked && !adminElements.advertBackgroundFile.files[0]) {
    adminElements.advertBackgroundPreview.hidden = true;
  } else if (currentBackgroundUrl) {
    updateAdvertImagePreview(adminElements.advertBackgroundPreview, currentBackgroundUrl);
  }
});
adminElements.advertLogoRemove.addEventListener("change", () => {
  if (adminElements.advertLogoRemove.checked && !adminElements.advertLogoFile.files[0]) {
    adminElements.advertLogoPreview.hidden = true;
  } else if (currentLogoUrl) {
    updateAdvertImagePreview(adminElements.advertLogoPreview, currentLogoUrl);
  }
});
adminElements.advertEditor.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") event.preventDefault();
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
