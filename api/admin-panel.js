const fs = require("node:fs");
const path = require("node:path");

const SUPABASE_URL = "https://epmrvuucjlebneyheelx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ONc2GDqSz_APsVSfDkjh8g_nWmpC41a";
const ADMIN_EMAIL = "peckinssmart@gmail.com";
const COOKIE_NAME = "__Host-90m-admin";

async function isAuthorized(accessToken) {
  if (!accessToken) return false;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!response.ok) return false;
  const user = await response.json();
  return (user.email || "").toLowerCase() === ADMIN_EMAIL;
}

function readCookie(header, name) {
  const item = (header || "").split(";").map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return item ? item.slice(name.length + 1) : "";
}

module.exports = async function adminPanel(req, res) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end("Method not allowed.");
  }

  let authorized;
  try {
    authorized = await isAuthorized(readCookie(req.headers.cookie, COOKIE_NAME));
  } catch (error) {
    console.error("Could not verify the admin page request.", error);
    return res.status(503).end("Admin access verification is unavailable.");
  }
  if (!authorized) {
    res.setHeader("Location", "/admin.html");
    return res.status(302).end();
  }

  const dashboardPath = path.join(__dirname, "..", "admin-dashboard.html");
  const html = fs.readFileSync(dashboardPath, "utf8");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Content-Length", Buffer.byteLength(html));
  return req.method === "HEAD" ? res.status(200).end() : res.status(200).send(html);
};
