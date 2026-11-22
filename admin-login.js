const adminConfig = window.SUPABASE_CONFIG;
const loginForm = document.querySelector("#login-form");
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const loginButton = document.querySelector("#login-button");
const loginSection = document.querySelector("#admin-login");
const resetSection = document.querySelector("#password-reset");
const resetRequest = document.querySelector("#reset-request");
const resetForm = document.querySelector("#password-reset-form");
const resetButton = document.querySelector("#password-reset-button");
const newPassword = document.querySelector("#new-password");
const confirmPassword = document.querySelector("#confirm-password");
const notice = document.querySelector("#login-notice");
let panelNavigationStarted = false;
let passwordRecoveryActive = new URLSearchParams(location.hash.slice(1)).get("type") === "recovery";

if (loginEmail) {
  const savedEmail = localStorage.getItem("90plus_admin_email");
  if (savedEmail) loginEmail.value = savedEmail;
}

function showNotice(message, type = "info") {
  notice.textContent = message;
  notice.dataset.type = type;
  notice.hidden = false;
}

async function establishAdminSession(session) {
  const response = await fetch("/api/admin-session", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token: session.access_token })
  });
  if (!response.ok) throw new Error("The server could not verify your admin session.");
}

function openAdminPanel(session, client) {
  if (!session || !session.user || !session.user.email) {
    showNotice("Sign-in failed: No user session found.", "error");
    return Promise.resolve();
  }
  if (panelNavigationStarted) return Promise.resolve();
  panelNavigationStarted = true;
  loginButton.disabled = true;
  return establishAdminSession(session).then(() => {
    location.replace("/admin-panel");
  }).catch((error) => {
    panelNavigationStarted = false;
    loginButton.disabled = false;
    showNotice(error.message, "error");
  });
}

async function clearAdminCookie() {
  const response = await fetch("/api/admin-session", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ logout: true })
  });
  if (!response.ok) throw new Error("Could not clear the server admin session.");
}

if (!adminConfig || !window.supabase || typeof window.supabase.createClient !== "function") {
  showNotice("Admin sign-in is unavailable. Check your connection and try again.", "error");
} else {
  const client = window.supabase.createClient(adminConfig.url, adminConfig.anonKey);

  client.auth.getSession().then(({ data, error }) => {
    if (error) {
      showNotice(`Could not check the sign-in session: ${error.message}`, "error");
      return;
    }
    if (data.session) {
      if (passwordRecoveryActive) {
        loginSection.hidden = true;
        resetSection.hidden = false;
        return;
      }
      if (data.session.user && data.session.user.email) {
        return openAdminPanel(data.session, client);
      }
      return client.auth.signOut().then(clearAdminCookie).then(() => {
        loginSection.hidden = false;
      }).catch((sessionError) => {
        showNotice(`Could not clear the previous session: ${sessionError.message}`, "error");
      });
    }
    return clearAdminCookie().then(() => {
      loginSection.hidden = false;
    }).catch((sessionError) => {
      showNotice(`Could not clear the previous session: ${sessionError.message}`, "error");
    });
  }).catch((error) => {
    showNotice(`Could not check the sign-in session: ${error.message}`, "error");
  });

  client.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY") {
      passwordRecoveryActive = true;
      loginSection.hidden = true;
      resetSection.hidden = false;
    } else if (session && session.user) {
      openAdminPanel(session, client);
    } else {
      clearAdminCookie().catch((sessionError) => {
        console.error("Could not clear the server admin session.", sessionError);
      });
    }
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = loginEmail ? loginEmail.value.trim() : "";
    if (!email) {
      showNotice("Please enter your admin email.", "error");
      return;
    }
    loginButton.disabled = true;
    showNotice("Signing in…");
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password: loginPassword.value
    });
    loginPassword.value = "";
    if (error) {
      loginButton.disabled = false;
      showNotice(`Sign-in failed: ${error.message}`, "error");
      return;
    }
    localStorage.setItem("90plus_admin_email", email);
    await openAdminPanel(data.session, client);
  });

  resetRequest.addEventListener("click", async () => {
    const email = loginEmail ? loginEmail.value.trim() : "";
    if (!email) {
      showNotice("Please enter your email above to receive a password reset link.", "error");
      return;
    }
    resetRequest.disabled = true;
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/admin.html`
    });
    resetRequest.disabled = false;
    showNotice(error
      ? `Could not send a reset email: ${error.message}`
      : `If an account exists for ${email}, a password reset email has been sent.`, error ? "error" : "info");
  });

  resetForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (newPassword.value !== confirmPassword.value) {
      showNotice("The passwords do not match.", "error");
      return;
    }
    resetButton.disabled = true;
    const { error } = await client.auth.updateUser({ password: newPassword.value });
    newPassword.value = "";
    confirmPassword.value = "";
    resetButton.disabled = false;
    if (error) {
      showNotice(`Could not update the password: ${error.message}`, "error");
      return;
    }
    passwordRecoveryActive = false;
    const { data, error: sessionError } = await client.auth.getSession();
    if (sessionError) {
      showNotice(`Could not check the updated session: ${sessionError.message}`, "error");
      return;
    }
    await openAdminPanel(data.session, client);
  });
}
