if(!self.define){let s,e={};const l=(l,i)=>(l=new URL(l+".js",i).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(i,n)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let u={};const t=s=>l(s,r),a={module:{uri:r},exports:u,require:t};e[r]=Promise.all(i.map((s=>a[s]||t(s)))).then((s=>(n(...s),u)))}}define(["./workbox-3e911b1d"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/_...all_-Dt_bH2nf.js",revision:null},{url:"assets/_name_-Dw7Hv5jz.js",revision:null},{url:"assets/_plugin-vue_export-helper-DlAUqK2U.js",revision:null},{url:"assets/404-BgBTCbmG.js",revision:null},{url:"assets/about-DMiECsc3.js",revision:null},{url:"assets/app-BNHd5zlt.js",revision:null},{url:"assets/app-CW21thQX.css",revision:null},{url:"assets/ar-9Pga1d3t.js",revision:null},{url:"assets/de-CQa2zd0B.js",revision:null},{url:"assets/default-C1CazQfL.js",revision:null},{url:"assets/en-C014eCAT.js",revision:null},{url:"assets/es-hloIUyAw.js",revision:null},{url:"assets/fr-DAYj2OhX.js",revision:null},{url:"assets/home-DVeHKuRj.js",revision:null},{url:"assets/id-Cwe0KQuR.js",revision:null},{url:"assets/index-DUHatW-F.js",revision:null},{url:"assets/it-A6E079kC.js",revision:null},{url:"assets/ja-Dd_-ynnZ.js",revision:null},{url:"assets/ka-DoGpLmrY.js",revision:null},{url:"assets/ko-B_jMkcWC.js",revision:null},{url:"assets/pl-BscUaaxT.js",revision:null},{url:"assets/pt-BR-DFUJcVuz.js",revision:null},{url:"assets/README-BUIQBYEp.js",revision:null},{url:"assets/route-block-B_A1xBdJ.js",revision:null},{url:"assets/ru-BpAZjRdm.js",revision:null},{url:"assets/tr-vqusm-Rn.js",revision:null},{url:"assets/uk-BdWyRLvH.js",revision:null},{url:"assets/uz-DXWaXLnd.js",revision:null},{url:"assets/vi-BWmt2ZGP.js",revision:null},{url:"assets/virtual_pwa-register-BE4OhIMi.js",revision:null},{url:"assets/workbox-window.prod.es5-DFjpnwFp.js",revision:null},{url:"assets/zh-CN-CxHQXvmj.js",revision:null},{url:"index.html",revision:"861368406ed0c9477ffadc5a47183fb1"},{url:"favicon.svg",revision:"50eaa5ff03f3d89bea3e4450aefa60af"},{url:"safari-pinned-tab.svg",revision:"21a5632e21f7421e63e58f3a8a3e205e"},{url:"pwa-192x192.png",revision:"65f6c00ff3d88d8371df0480c1ba0272"},{url:"pwa-512x512.png",revision:"20a2db7d5040eb315e6acf49c6983de9"},{url:"manifest.webmanifest",revision:"37e8d18026b05432f623fc5efac2b4b1"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
