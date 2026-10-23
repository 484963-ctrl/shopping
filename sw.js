// רשת קודם, מטמון כגיבוי: הרשימה נפתחת גם בסופר בלי קליטה.
const CACHE='shopping-v4',PHOTOS='shopping-photos',FILES=['./','index.html','manifest.webmanifest','icon.svg','fonts/rubik-hebrew-400-normal.woff2','fonts/rubik-hebrew-700-normal.woff2'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('shopping-')&&k!==CACHE&&k!==PHOTOS).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
// תמונות המוצרים: מהמטמון קודם, כדי שיופיעו גם בסופר בלי קליטה
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method==='GET'&&/^(images\.unsplash\.com|images\.openfoodfacts\.org|upload\.wikimedia\.org|commons\.wikimedia\.org)$/.test(u.host)){e.respondWith(caches.open(PHOTOS).then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{c.put(e.request,r.clone());return r}))));return}
if(e.request.method!=='GET'||u.origin!==location.origin)return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)))});
