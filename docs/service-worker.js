if(!self.define){const e=async e=>{if("require"!==e&&(e+=".js"),!c[e]&&(await new Promise(async i=>{if("document"in self){const c=document.createElement("script");c.src=e,document.head.appendChild(c),c.onload=i}else importScripts(e),i()}),!c[e]))throw new Error(`Module ${e} didn’t register its module`);return c[e]},i=async(i,c)=>{const a=await Promise.all(i.map(e));c(1===a.length?a[0]:a)},c={require:Promise.resolve(i)};self.define=(i,a,d)=>{c[i]||(c[i]=new Promise(async c=>{let r={};const f={uri:location.origin+i.slice(1)},n=await Promise.all(a.map(i=>"exports"===i?r:"module"===i?f:e(i))),s=d(...n);r.default||(r.default=s),c(r)}))}}define("./service-worker.js",["./workbox-7c85bfc1"],(function(e){"use strict";self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),e.precacheAndRoute([{url:"dict/base.dat.gz",revision:"7c8bbced46e88cdb77c9c66c9ca9fbcb"},{url:"dict/cc.dat.gz",revision:"05321caff24f87d1bed64fe1d44576fc"},{url:"dict/check.dat.gz",revision:"dcbeea0429520f5e669a75ff504241a7"},{url:"dict/tid.dat.gz",revision:"48d8e87b50f900b4795e55e9a70c2696"},{url:"dict/tid_map.dat.gz",revision:"ab259890529abb432a5c20aff4efb021"},{url:"dict/tid_pos.dat.gz",revision:"6b89472ae7b079cc8cb6d5758356ff37"},{url:"dict/unk.dat.gz",revision:"9229f1b8c742cd15ff3229ed3700112a"},{url:"dict/unk_char.dat.gz",revision:"557c5cc25a480e1946150625face4c91"},{url:"dict/unk_compat.dat.gz",revision:"da69ebce7400cc6ba01f5ce19d3108f1"},{url:"dict/unk_invoke.dat.gz",revision:"6b5a7c42a945cbba596148fecc2d56b4"},{url:"dict/unk_map.dat.gz",revision:"eda6e0354662ee169e817f5848ab56d4"},{url:"dict/unk_pos.dat.gz",revision:"5986e78e268fa51e3e119511ec914dd9"},{url:"favicon.png",revision:"daa807aa932db3b33fabe29364f5a674"},{url:"index.html",revision:"8fe57f0b4f4db415c068ee90052dadef"},{url:"index.json",revision:"020231d0b7c2735ab58643c273c79eb7"},{url:"main.js",revision:"0c85ffa67c88dbf9efe1499c9d37b65d"},{url:"manifest.json",revision:"8055b4b07a6c0ed4c18b77eb440c47f7"},{url:"prh/kanji-open.yml",revision:"a5cb7f20f7921d3c3495ed17cafad685"},{url:"prh/spoken.yml",revision:"903663fc90a148a386b8708fa4feacd1"},{url:"prh/typo.yml",revision:"485725809fb19f1288d6051848cf5836"},{url:"prh/web+db.yml",revision:"93179a7dc20f7ef754a2bc2edde647ff"}],{})}));
