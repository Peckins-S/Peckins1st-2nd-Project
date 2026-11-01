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
  email: document.querySelector("#login-email"),
  password: document.querySelector("#login-password"),
  passwordReset: document.querySelector("#password-reset"),
  passwordResetForm: document.querySelector("#password-reset-form"),
  newPassword: document.querySelector("#new-password"),
  confirmPassword: document.querySelector("#confirm-password"),
  passwordResetButton: document.querySelector("#password-reset-button"),
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
  adminElements.login.hidden = Boolean(user);
  adminElements.passwordReset.hidden = true;
  adminElements.settingsForm.hidden = !user;
  adminElements.notice.hidden = Boolean(user);
  if (user) adminElements.signedInEmail.textContent = `Signed in as ${user.email}`;
}

function showPasswordReset() {
  adminElements.login.hidden = true;
  adminElements.passwordReset.hidden = false;
  adminElements.settingsForm.hidden = true;
  adminElements.notice.hidden = true;
}

async function loadSettings() {
  setNotice("Loading shared settings…");
  const { data, error } = await supabaseClient
    .from("site_settings")
    .select("brand_name, announcement, featured_competitions")
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
  adminElements.notice.hidden = true;
}

async function authorizeUser(user) {
  if (!user || (user.email || "").toLowerCase() !== adminEmail) {
    await supabaseClient.auth.signOut();
    setSignedIn(null);
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
    email: adminElements.email.value.trim(),
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

  adminElements.saveButton.disabled = true;
  setNotice("Saving shared settings…");
  const { error } = await supabaseClient
    .from("site_settings")
    .upsert({
      id: true,
      brand_name: brandName,
      announcement: adminElements.announcement.value.trim(),
      featured_competitions: featuredCompetitions,
      updated_at: new Date().toISOString()
    }, { onConflict: "id" });
  adminElements.saveButton.disabled = false;
  if (error) {
    setNotice(`Could not save settings: ${error.message}`, "error");
    return;
  }
  setNotice("Settings saved. They will appear for all visitors on their next page load.", "success");
});

adminElements.signOutButton.addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    setNotice(`Could not sign out: ${error.message}`, "error");
    return;
  }
  adminElements.settingsForm.hidden = true;
  adminElements.login.hidden = false;
  adminElements.email.value = "";
  setNotice("You have signed out.");
});

renderLeagueOptions();
if (!validConfig()) {
  setNotice("Admin setup is not finished. Add your Supabase project URL and public anon key to supabase-config.js, then create the database table using supabase-schema.sql.", "error");
} else if (!window.supabase || typeof window.supabase.createClient !== "function") {
  setNotice("The Supabase client could not be loaded. Check your connection and reload this page.", "error");
} else {
  supabaseClient = window.supabase.createClient(adminConfig.url, adminConfig.anonKey);
  adminElements.email.value = adminEmail;
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
      adminElements.notice.hidden = true;
    }
  });
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      showPasswordReset();
      return;
    }
    if (session && session.user) authorizeUser(session.user);
  });
}
