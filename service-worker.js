var cacheName = 'afterschoolactivities-v1';
var cacheFiles = [
    'index.html',
    'activities.js',
    'afterschoolactivities.webmanifest',
    'products.js',
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

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(    
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all the files');
            return cache.addAll(cacheFiles);
    })
);
 });

self.addEventListener('fetch', function (e){
    e.respondWith(
        caches.match(e.request).then(function (r){
            // console.log('[Service Worker] Fetching resource: ' + e.request.url);
            return r || fetch(e.request).then(function(response){
                return caches.open(cacheName).then(function (cache){
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});