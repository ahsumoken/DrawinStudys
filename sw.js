const CACHE = "blok-v20";
const ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./data.js",
  "./kat.js",
  "./sheets.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./favicon.svg",
  "./kat/dag-01.jpg",
  "./kat/dag-02.jpg",
  "./kat/dag-03.jpg",
  "./kat/dag-04.jpg",
  "./kat/dag-05.jpg",
  "./kat/dag-06.jpg",
  "./kat/dag-07.jpg",
  "./kat/dag-08.jpg",
  "./kat/dag-09.jpg",
  "./kat/dag-10.jpg",
  "./kat/dag-11.jpg",
  "./kat/dag-12.jpg",
  "./kat/dag-13.jpg",
  "./kat/dag-14.jpg",
  "./kat/dag-15.jpg",
  "./kat/dag-16.jpg",
  "./kat/dag-17.jpg",
  "./kat/dag-18.jpg",
  "./kat/dag-19.jpg",
  "./kat/dag-20.jpg",
  "./kat/dag-21.jpg",
  "./kat/dag-22.jpg",
  "./kat/dag-23.jpg",
  "./kat/dag-24.jpg",
  "./kat/dag-25.jpg",
  "./kat/dag-26.jpg",
  "./kat/dag-27.jpg",
  "./kat/dag-28.jpg",
  "./kat/dag-29.jpg",
  "./kat/dag-30.jpg",
  "./kat/dag-31.jpg",
  "./kat/dag-32.jpg",
  "./kat/dag-33.jpg",
  "./kat/dag-34.jpg",
  "./kat/dag-35.jpg",
  "./kat/dag-36.jpg",
  "./kat/dag-37.jpg",
  "./kat/dag-38.jpg",
  "./kat/dag-39.jpg",
  "./kat/dag-40.jpg",
  "./kat/dag-41.jpg",
  "./kat/dag-42.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          if (res.ok && new URL(event.request.url).origin === self.location.origin) {
            caches.open(CACHE).then((c) => c.put(event.request, copy));
          }
          return res;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
