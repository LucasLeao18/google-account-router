const STORAGE_KEY = "googleAccountRouterSettings";

const DEFAULT_SETTINGS = {
  classroom: { enabled: false, accountIndex: 0 },
  gmail: { enabled: false, accountIndex: 0 },
  google: { enabled: false, accountIndex: 0 }
};

const HOST_TO_SERVICE = {
  "classroom.google.com": "classroom",
  "mail.google.com": "gmail",
  "www.google.com": "google"
};

const GOOGLE_SAFE_PATHS = new Set(["/", "/search", "/webhp"]);
const GOOGLE_BLOCKED_PREFIXES = [
  "/url",
  "/imgres",
  "/sorry",
  "/recaptcha",
  "/preferences",
  "/setprefs",
  "/complete",
  "/async",
  "/gen_204",
  "/client_204",
  "/xjs",
  "/favicon.ico"
];

const recentRedirects = new Map();

function normalizeAccountIndex(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function normalizeSettings(settings = {}) {
  return Object.fromEntries(
    Object.entries(DEFAULT_SETTINGS).map(([service, defaults]) => {
      const value = settings[service] || {};

      return [
        service,
        {
          enabled: Boolean(value.enabled ?? defaults.enabled),
          accountIndex: normalizeAccountIndex(value.accountIndex ?? defaults.accountIndex)
        }
      ];
    })
  );
}

function ensureLeadingSlash(path) {
  return path.startsWith("/") ? path : `/${path}`;
}

function withPath(url, path) {
  const nextUrl = new URL(url.href);
  nextUrl.pathname = path;
  return nextUrl.href === url.href ? null : nextUrl.href;
}

function routeClassroom(url, accountIndex) {
  const match = url.pathname.match(/^\/u\/\d+(\/.*)?$/);
  const rest = match ? match[1] || "/" : url.pathname;

  return withPath(url, `/u/${accountIndex}${ensureLeadingSlash(rest)}`);
}

function routeGmail(url, accountIndex) {
  const path = url.pathname;
  const match = path.match(/^\/mail\/u\/\d+(\/.*)?$/);

  if (match) {
    return withPath(url, `/mail/u/${accountIndex}${ensureLeadingSlash(match[1] || "/")}`);
  }

  if (path === "/" || path === "/mail" || path === "/mail/") {
    return withPath(url, `/mail/u/${accountIndex}/`);
  }

  if (path.startsWith("/mail/")) {
    return withPath(url, `/mail/u/${accountIndex}${ensureLeadingSlash(path.slice("/mail".length))}`);
  }

  return null;
}

function routeGoogle(url, accountIndex) {
  const path = url.pathname;
  const match = path.match(/^\/u\/\d+(\/.*)?$/);

  if (match) {
    return withPath(url, `/u/${accountIndex}${ensureLeadingSlash(match[1] || "/")}`);
  }

  if (GOOGLE_BLOCKED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) {
    return null;
  }

  if (!GOOGLE_SAFE_PATHS.has(path)) {
    return null;
  }

  return withPath(url, `/u/${accountIndex}${path}`);
}

function getRedirectUrl(rawUrl, settings) {
  let url;

  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  if (url.protocol !== "https:") {
    return null;
  }

  const service = HOST_TO_SERVICE[url.hostname];
  const preference = settings[service];

  if (!service || !preference?.enabled) {
    return null;
  }

  const accountIndex = normalizeAccountIndex(preference.accountIndex);

  if (service === "classroom") {
    return routeClassroom(url, accountIndex);
  }

  if (service === "gmail") {
    return routeGmail(url, accountIndex);
  }

  return routeGoogle(url, accountIndex);
}

function readSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ [STORAGE_KEY]: DEFAULT_SETTINGS }, (result) => {
      resolve(normalizeSettings(result[STORAGE_KEY]));
    });
  });
}

function wasRecentlyRedirected(tabId, fromUrl, toUrl) {
  const now = Date.now();
  const previous = recentRedirects.get(tabId);

  if (
    previous &&
    previous.fromUrl === fromUrl &&
    previous.toUrl === toUrl &&
    now - previous.time < 2000
  ) {
    return true;
  }

  recentRedirects.set(tabId, { fromUrl, toUrl, time: now });
  return false;
}

async function handleNavigation(details) {
  if (details.frameId !== 0 || details.tabId < 0) {
    return;
  }

  const settings = await readSettings();
  const redirectUrl = getRedirectUrl(details.url, settings);

  if (!redirectUrl || wasRecentlyRedirected(details.tabId, details.url, redirectUrl)) {
    return;
  }

  const update = chrome.tabs.update(details.tabId, { url: redirectUrl });

  if (update?.catch) {
    update.catch(() => {});
  }
}

if (typeof chrome !== "undefined" && chrome.webNavigation && chrome.storage) {
  chrome.webNavigation.onBeforeNavigate.addListener(handleNavigation, {
    url: [
      { hostEquals: "classroom.google.com", schemes: ["https"] },
      { hostEquals: "mail.google.com", schemes: ["https"] },
      { hostEquals: "www.google.com", schemes: ["https"] }
    ]
  });
}

if (typeof module !== "undefined") {
  module.exports = {
    DEFAULT_SETTINGS,
    normalizeSettings,
    getRedirectUrl
  };
}
