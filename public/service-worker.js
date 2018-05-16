var CACHE = 'cache';
var urlsToCache = [
	'/',
	'/about',
	'/bucket-list',
	'/tag/blog',
	'/blog/devinjap',
	'/blog/bac-xiu',
	'/blog/tra-da',
	'/tag/rest',
	'/tag/chatbot',
	'/tag/yearinreview',
	'/tag/amazingjapan',
];
var preCacheSrc = [
	'/manifest.json',
	'/service-worker.js',
];

self.addEventListener('install', function (evt) {
	console.log('The service worker is being installed.');
	caches.open(CACHE)
		.then(function (cache) {
			console.log('Opened cache');
			return cache.addAll(urlsToCache);
		});
	evt.waitUntil(precache());
});


self.addEventListener('fetch', function (evt) {
	console.log('The service worker is serving the asset.');
	evt.respondWith(fromNetwork(evt.request, 500).catch(function () {
		return fromCache(evt.request);
	}));
});

function fromNetwork (request, timeout) {
	return new Promise(function (fulfill, reject) {
		var timeoutId = setTimeout(reject, timeout);
		fetch(request).then(function (response) {
			clearTimeout(timeoutId);
			fulfill(response);
		}, reject);
	});
}

function precache () {
	return caches.open(CACHE).then(function (cache) {
		return cache.addAll(preCacheSrc);
	});
}

function fromCache (request) {
	return caches.open(CACHE).then(function (cache) {
		return cache.match(request).then(function (matching) {
			return matching || Promise.reject('no-match');
		});
	});
}


