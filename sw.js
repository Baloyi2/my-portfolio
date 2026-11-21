// Service worker: lets the portfolio open without an internet connection after the first visit.
// It always tries the network first, so visitors see the latest version whenever they are online,
// and falls back to the saved copy when they are offline.

const CACHE = "baloyi-portfolio-v2";
const PRECACHE = [
  "./",
  "index.html",
  "css/styles.css",
  "js/theme.js",
  "js/main.js",
  "manifest.webmanifest",
  "assets/fonts/manrope/manrope-latin-variable.woff2",
  "assets/images/favicon.svg",
  "assets/images/me.jpeg",
  "assets/images/icons/icon-192.png",
  "assets/images/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Remove caches left by older versions of this file.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("baloyi-portfolio-") && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || (request.mode === "navigate" ? caches.match("index.html") : Response.error()))
      )
  );
});
