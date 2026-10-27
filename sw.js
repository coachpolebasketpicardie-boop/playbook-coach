const CACHE='tableau-coach-v18';
const FILES=['./','index.html','manifest.webmanifest','icon.svg','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Réseau d'abord pour la page (mises à jour), cache sinon ; cache d'abord pour le reste (icônes, polices)
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const isPage=e.request.mode==='navigate';
  e.respondWith(isPage
    ?fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html')))
    :caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return res})));
});
