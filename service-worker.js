var cacheName = 'afterschoolactivities-v1';
var cacheFiles = [
    'index.html',
    'activities.js',
    'afterschoolactivities.webmanifest',
    'package.json',
    'server.js',
    'styles.css',
    'images/art.jpg',
    'images/chess.png',
    'images/cricket.jpg',
    'images/dance.jpg',
    'images/gymnastics.jpg',
    'images/karate.png',
    'images/logo-192.png',
    'images/logo-512.png',
    'images/music.jpg',
    'images/soccer.jpg',
    'images/tennis.jpg',
    'images/theatre.JPG'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(cacheName).then(function(cache) {
        return Promise.all(cacheFiles.map(function(url) {
          return fetch(url).then(function(response) {
            if (!response.ok) {
              throw new Error('Failed to fetch resource: ' + url);
            }
            return cache.put(url, response);
          });
        }));
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  