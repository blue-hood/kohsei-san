if(!self.define){const e=async e=>{if("require"!==e&&(e+=".js"),!i[e]&&(await new Promise(async c=>{if("document"in self){const i=document.createElement("script");i.src=e,document.head.appendChild(i),i.onload=c}else importScripts(e),c()}),!i[e]))throw new Error(`Module ${e} didn’t register its module`);return i[e]},c=async(c,i)=>{const a=await Promise.all(c.map(e));i(1===a.length?a[0]:a)},i={require:Promise.resolve(c)};self.define=(c,a,d)=>{i[c]||(i[c]=new Promise(async i=>{let r={};const t={uri:location.origin+c.slice(1)},s=await Promise.all(a.map(c=>"exports"===c?r:"module"===c?t:e(c))),n=d(...s);r.default||(r.default=n),i(r)}))}}define("./service-worker.js",["./workbox-7c85bfc1"],(function(e){"use strict";self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),e.precacheAndRoute([{url:"dict/base.dat.gz",revision:"7c8bbced46e88cdb77c9c66c9ca9fbcb"},{url:"dict/cc.dat.gz",revision:"05321caff24f87d1bed64fe1d44576fc"},{url:"dict/check.dat.gz",revision:"dcbeea0429520f5e669a75ff504241a7"},{url:"dict/tid.dat.gz",revision:"48d8e87b50f900b4795e55e9a70c2696"},{url:"dict/tid_map.dat.gz",revision:"ab259890529abb432a5c20aff4efb021"},{url:"dict/tid_pos.dat.gz",revision:"6b89472ae7b079cc8cb6d5758356ff37"},{url:"dict/unk.dat.gz",revision:"9229f1b8c742cd15ff3229ed3700112a"},{url:"dict/unk_char.dat.gz",revision:"557c5cc25a480e1946150625face4c91"},{url:"dict/unk_compat.dat.gz",revision:"da69ebce7400cc6ba01f5ce19d3108f1"},{url:"dict/unk_invoke.dat.gz",revision:"6b5a7c42a945cbba596148fecc2d56b4"},{url:"dict/unk_map.dat.gz",revision:"eda6e0354662ee169e817f5848ab56d4"},{url:"dict/unk_pos.dat.gz",revision:"5986e78e268fa51e3e119511ec914dd9"},{url:"favicon.png",revision:"daa807aa932db3b33fabe29364f5a674"},{url:"index.html",revision:"946929cca6d83c36bb4043492553ffb9"},{url:"main.js",revision:"e845b3c8dd269f78a2fcd73491493fdf"},{url:"manifest.json",revision:"8055b4b07a6c0ed4c18b77eb440c47f7"}],{})}));
