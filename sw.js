importScripts('serviceworker-cache-polyfill.js');
// Polyfill untuk support old browser

// referensi: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers

// Nama storage cache yang akan dibuat
var CACHE_NAME = 'pwa-jquery-v2';

// List daftar file yang akan di cache pertama kali
// File want to cache
var urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './serviceworker-cache-polyfill.js',
  './assets/img/blank-thumbnail.png',
  './assets/img/favicon.png',
  './assets/img/48x48.png',
  './assets/img/96x96.png',
  './assets/img/apple-touch-icon-120x120.png',
  './assets/img/apple-touch-icon-152x152.png',
  './assets/img/192x192.png',
  './assets/img/512x512.png',
  './css/normalize.css',
  './css/main.css',
  './js/jquery-1.11.1.min.js',
  './js/main.js',
];


// Event Saat serviceWorker diinstall
self.oninstall = function (e) {
  console.log('[serviceWorker]: Installing...');
  // perform install steps
  e.waitUntil(
    // Membuat cache storage baru dengan nama sesuai dengan value pada variable CACHE_NAME
    caches.open(CACHE_NAME)
      // Kemudian, setelah cache terbuka
      .then(function (cache) {
        console.log('[serviceWorker]: Cache All');
        // Tambahkan url yang ada di variable urlsToCache untuk langsung di cache
        return cache.addAll(urlsToCache);
      })
      // Kemudian, setelah selesai disimpan di cache
      .then(function () {
        console.log('[serviceWorker]: Intalled And Skip Waiting on Install');
        // Akhiri event oninstall dengan menggunakan method 'skipWaiting'
        return self.skipWaiting();
      })
  );
};


/*
  Event saat web app melaukan fetching
  ex: load image, fetch data, get Data, dll.
  Yang hanya bisa disimpan di cache hanyalah HTTP request yang bermethod 'GET'
*/
self.onfetch = function (e) {

  // Mengambil URL yang sedang dituju melaui object e.request.url
  console.log('[serviceWorker]: Fetching ' + e.request.url);

  // URL tujuan, pemicu race URL
  var raceUrl = 'api/';

  // Jika menuju race URL, maka
  if(e.request.url.indexOf(raceUrl) > -1){
    // Respond dengan (Cache By Default)
    e.respondWith(
      // Buka Cache,
      caches.open(CACHE_NAME).then(function (cache) {
        // Fetch URL tujuan
        return fetch(e.request).then(function (res) {
          // Letakkan response ke dalam cache, lakukan cloning response untuk diberikan pada user (cache hanya sebagai backup)
          cache.put(e.request.url, res.clone());
          return res;
        // Jika Error maka
        }).catch(err => {
          console.log('[serviceWorker]: Fetch Error ' + err);
        });
      })
    );
  }

  // Jika menuju ke konten gambar dengan url ('assets/img-content')
  else if (e.request.url.indexOf('assets/img-content') > -1) {

    // response dengan
    e.respondWith(

      // Jika sudah ada cache sebelumnya, maka
      caches.match(e.request).then(function (res) {

        // tampilkan caches
        if(res) return res

        // Jika belum ada, maka lakukan fetch dengan mode no-cors kemudian
        return fetch(e.request.clone(), { mode: 'no-cors' }).then(function (newRes) {
          // Jika fetch gagal, maka
          if(!newRes || newRes.status !== 200 || newRes.type !== 'basic') {
            // tampilkan error fetch / data yang gagal diambil
            return newRes;
          }

          // Jika berhasil, maka buka cache
          caches.open(CACHE_NAME).then(function (cache) {
            // Simpan hasil fetch kedalam cache
            cache.put(e.request, newRes.clone());

            // Jika Error, maka tampilkan log error
          }).catch(err => {
            console.log('[serviceWorker]: Fetch Error ' + err);
          });

          // Jika sudah disimpan maka tampilkan hasil fetchnya
          return newRes;
        });

      })
    );
  }


  // Jika menuju url yang tidak harus di cache, maka
  else {
    // response dengan
    e.respondWith(
      // cari di cache terlebih dahulu
      caches.match(e.request).then(function (res) {
        // Jika ditemukan di cache maka tampilkan dari cache jika tidak maka lakukan fetch
        return res || fetch(e.request)
      })
    );
  }

};


/*
  Saat serviceWorker Aktif
  Disini Worker akan menghapus worker2 yang lawas atau old worker dan membersihkan cache yang tidak diperlukan atau tidak terdaftar dalam whitelist.

  Setelah itu, memastikan tidak ada worker yang lebih baru. Jika ada, maka browser akan menggunakan worker yang baru itu.
*/
self.onactivate = function (e) {

  console.log('[serviceWorker]: Actived');

  // Nama cache yang tidak akan dihapus
  var whiteList = ['pwa-jquery-v2'];

  // Tunggu proses,
  e.waitUntil(
    // Ambil nama caches yang ada
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        // setiap nama cache diseleksi dan dicheck
        cacheNames.map(function (cacheName) {
          // Apabila tidak termasuk di whitelist, maka
          if (whiteList.indexOf(cacheName) === -1) {
            // hapus cache tersebut
            return caches.delete(cacheName);
          }
        })
      )
    }).then(function () {
      console.log('[serviceWorker]: Clients Claims');
      // self.clients.claim ini fungsinya untuk memastikan bahwa sw js yang baru yang akan digunakan (bukan sw.js yang ada di cache)
      return self.clients.claim();
    })
  );

};
