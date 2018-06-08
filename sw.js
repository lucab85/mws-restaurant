var staticCacheName = 'mws-restaurant';
let fileToCache = [
  'index.html',
  'restaurant.html',
  'js/dbhelper.js',
  'js/main.js',
  'js/restaurant_info.js',
  'sw.js',
  'css/styles.css',
  'css/responsive.css',
  'img/1.jpg',
  'img/2.jpg',
  'img/3.jpg',
  'img/4.jpg',
  'img/5.jpg',
  'img/6.jpg',
  'img/7.jpg',
  'img/8.jpg',
  'img/9.jpg',
  'img/10.jpg'
];

self.addEventListener('install', event => {
  console.log('service worker installed');
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('serviceWorker is caching app shell');
      return cache.addAll(fileToCache);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('Activating new service worker...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('mws-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      ).then(() => { console.log('Service worker active');} );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(response => {
      if (response) return response;
      return fetch(event.request);
    }).catch((error) => {
      console.log(error);}
    )
  );
});

self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
