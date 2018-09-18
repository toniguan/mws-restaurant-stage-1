let myCache = 'cache_v1';
let urlToCache = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/dbhelper.js',
  '/js/restaurant_info.js',
  '/data/restaurants.json',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg'

];

self.addEventListener('install', function(event) {
  // open cache and cache all files
  event.waitUntil(
    caches.open(myCache)
      .then(function(cache) {
        console.log('cache all files ');
        return cache.addAll(urlToCache);
      })
  );
});

/*clean up some old caches*/
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(allcaches) {
      return Promise.all(
        allcaches.map(function(cache) {
          if (cache != myCache) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});


self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request)
    .then(function(response){
      //if the request/response is in cache, return
      if(response){
        return response;
      }
      let requestcopy = event.request.clone();
      //else return the fetch result and save to cache
      return fetch(requestcopy)
              .then(function(response){
                if(!response||response.status!==200|| response.type!='basic'){
                  return response;
                }
                let responsecopy = response.clone();
                caches.open(myCache)
                  .then(function(cache){
                    cache.put(event.request,responsecopy);
                  });
                return response;
              });
    })
  );
});
