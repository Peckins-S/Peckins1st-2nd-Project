const CACHE = new Map();
const IN_FLIGHT = new Map();
const MAX_CACHE_ENTRIES = 256;

function getAllowedUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.username || url.password) return null;

  const isEspn = ["site.api.espn.com", "site.web.api.espn.com"].includes(url.hostname)
    && /^\/apis\/(?:site\/v2|v2)\/sports\/soccer\/(?:all\/(?:scoreboard|summary)|[a-z]{3}\.[a-z0-9._-]+\/(?:standings|statistics))$/i.test(url.pathname);
  const isOpenLiga = url.hostname === "api.openligadb.de"
    && (/^\/getavailableleagues\/\d{4}$/.test(url.pathname)
      || /^\/getmatchdata\/[a-z0-9_-]+\/\d{4}$/i.test(url.pathname));
  if (url.protocol !== "https:" || (!isEspn && !isOpenLiga)) return null;

  if (/\/scoreboard$/.test(url.pathname)
    && !/^\d{8}$/.test(url.searchParams.get("dates") || "")) return null;
  if (/\/summary$/.test(url.pathname)
    && !/^\d+$/.test(url.searchParams.get("event") || "")) return null;
  if (url.pathname.endsWith("/standings")) {
    for (const [key, value] of url.searchParams) {
      if (!["region", "lang", "contentorigin"].includes(key)
        || !/^[a-z0-9_-]{1,20}$/i.test(value)) return null;
    }
  }
  if (url.pathname.endsWith("/statistics") && url.search) return null;
  if (/^\/getavailableleagues\//.test(url.pathname) && url.search) return null;
  if (/^\/getmatchdata\//.test(url.pathname) && url.search) return null;
  return url;
}

function cacheDuration(url) {
  if (url.pathname.endsWith("/scoreboard")) return 45;
  if (/^\/getmatchdata\//.test(url.pathname)) return 60;
  if (/^\/getavailableleagues\//.test(url.pathname)) return 3600;
  return 300;
}

function trimCache() {
  while (CACHE.size > MAX_CACHE_ENTRIES) {
    CACHE.delete(CACHE.keys().next().value);
  }
}

async function loadProviderData(url) {
  const key = url.href;
  const cached = CACHE.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.data;
  if (IN_FLIGHT.has(key)) return IN_FLIGHT.get(key);

  const request = (async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      if (!response.ok) {
        const error = new Error(`Football data provider returned ${response.status}.`);
        error.status = response.status;
        throw error;
      }
      const data = await response.json();
      CACHE.set(key, { data, expiresAt: Date.now() + cacheDuration(url) * 1000 });
      trimCache();
      return data;
    } finally {
      clearTimeout(timeout);
      IN_FLIGHT.delete(key);
    }
  })();
  IN_FLIGHT.set(key, request);
  return request;
}

module.exports = async function footballData(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.setHeader("Cache-Control", "no-store");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const value = typeof req.query.url === "string" && req.query.url.length <= 2048
    ? req.query.url : "";
  const url = getAllowedUrl(value);
  if (!url) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(400).json({ error: "Unsupported football data request." });
  }

  const ttl = cacheDuration(url);
  try {
    const data = await loadProviderData(url);
    res.setHeader("Cache-Control", `public, max-age=0, s-maxage=${ttl}, stale-while-revalidate=${ttl}`);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Could not load football data.", error);
    res.setHeader("Cache-Control", "no-store");
    const status = error.status >= 400 && error.status < 500 ? error.status : 502;
    return res.status(status).json({ error: "Football data is temporarily unavailable." });
  }
};
