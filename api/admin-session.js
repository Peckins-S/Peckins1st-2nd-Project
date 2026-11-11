const SUPABASE_URL = "https://epmrvuucjlebneyheelx.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ONc2GDqSz_APsVSfDkjh8g_nWmpC41a";
const ADMIN_EMAIL = "peckinssmart@gmail.com";
const COOKIE_NAME = "__Host-90m-admin";

async function getAdminUser(accessToken) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!response.ok) return null;
  const user = await response.json();
  return (user.email || "").toLowerCase() === ADMIN_EMAIL ? user : null;
}

function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body !== "string") return null;
  try {
    return JSON.parse(req.body);
  } catch {
    return null;
  }
}

module.exports = async function adminSession(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const origin = req.headers.origin;
  if (origin && new URL(origin).host !== req.headers.host) {
    return res.status(403).json({ error: "Origin is not allowed." });
  }

  const body = readBody(req);
  if (!body) return res.status(400).json({ error: "Invalid request." });
  if (body.logout === true) {
    res.setHeader("Set-Cookie", `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`);
    return res.status(200).json({ ok: true });
  }

  const accessToken = body.access_token;
  if (typeof accessToken !== "string" || accessToken.length > 4096
    || !/^[A-Za-z0-9._-]+$/.test(accessToken)) {
    return res.status(401).json({ error: "Admin sign-in is required." });
  }

  let user;
  try {
    user = await getAdminUser(accessToken);
  } catch (error) {
    console.error("Could not verify the admin session.", error);
    return res.status(502).json({ error: "Admin session verification is unavailable." });
  }
  if (!user) return res.status(401).json({ error: "Admin sign-in is required." });

  const tokenPayload = accessToken.split(".")[1];
  const expiresAt = Number(JSON.parse(Buffer.from(tokenPayload, "base64url").toString("utf8")).exp);
  const maxAge = Math.max(0, Math.min(3600, expiresAt - Math.floor(Date.now() / 1000)));
  if (!maxAge) return res.status(401).json({ error: "Admin session has expired." });

  res.setHeader("Set-Cookie", `${COOKIE_NAME}=${accessToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`);
  return res.status(200).json({ ok: true });
};
