const { chromium } = require('/opt/homebrew/lib/node_modules/playwright/index.js');
(async()=>{
  const errs=[];
  const b=await chromium.launch({args:['--enable-unsafe-swiftshader','--use-angle=swiftshader','--use-gl=angle',
    '--ignore-gpu-blocklist','--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});
  const p=await b.newPage({viewport:{width:1280,height:720}});
  p.on('pageerror',e=>errs.push('PAGE:'+e.message.slice(0,180)));
  p.on('console',m=>{ if(m.type()==='error'&&!/favicon|okok|XNNPACK/.test(m.text())) errs.push('CON:'+m.text().slice(0,180)); });
  await p.goto('http://localhost:8731/pinch-test.html',{waitUntil:'load'});
  await p.waitForFunction(()=>!!window.__T,{timeout:30000});
  await p.waitForFunction(()=>window.__T.bgReady>=8,{timeout:20000}).catch(()=>{});
  const out=await p.evaluate(async()=>{
    const T=window.__T, o={}; const wait=ms=>new Promise(r=>setTimeout(r,ms));
    const until=async(fn,tm=6000)=>{ const t0=performance.now(); while(performance.now()-t0<tm){ if(fn()) return true; await wait(60); } return false; };
    window.__freeze=true; await wait(200);
    // 1) single-hand messages
    const singles={peace:'I LOVE YOU',fist:"ISN'T THIS COOL?",four:'KOMEN "KICAU"\nAKU KIRIM LINKNYA',
      three:'BUT GIVING AWAY FOR FREE',thumb:'Hey',shaka:'SPENT $128 AI CREDIT :)',horns:'OH WAIT WHAT IS THIS?'};
    o.singles={};
    for(const k of Object.keys(singles)){ T.setHand(0,0.5,0.4,k); T.clear(1); o.singles[k]=await until(()=>T.preset()===singles[k],3000); }
    // 2) combos
    T.setHand(0,0.4,0.4,'thumb'); T.setHand(1,0.6,0.4,'shaka'); o.comboCheck=await until(()=>T.preset()==='CHECK THIS FIRST',3000);
    T.setHand(0,0.4,0.4,'peace'); o.comboWant=await until(()=>T.preset()==='DO YOU WANT IT?',3000);
    // 3) DEDUP: both fists → NO text (aura territory)
    T.setHand(0,0.4,0.5,'fist'); T.setHand(1,0.6,0.5,'fist'); await wait(400); o.dedupFists=(T.preset()===null);
    // 4) horns+horns → tree, no message
    T.setHand(0,0.35,0.6,'horns'); T.setHand(1,0.65,0.6,'horns'); o.tree=await until(()=>T.treeA===true,6000) && T.preset()===null;
    // 5) DEDUP: open+open → lens only, field stands down
    T.setHand(0,0.3,0.5,'open'); T.setHand(1,0.7,0.5,'open');
    o.lens=await until(()=>T.lensV===true && T.live===true,6000) && await until(()=>T.treeA===false,6000);
    o.dedupLens=await until(()=>T.lensEng===true && T.partVis===false,4000);
    // 5b) one open hand → field returns, lens gone
    T.clear(1); o.fieldSolo=await until(()=>T.lensEng===false && T.partVis===true && T.lensV===false,6000);
    // 6) DEDUP: point+point → holo cubes, jjk cloud hidden
    T.setHand(0,0.3,0.5,'point'); T.setHand(1,0.7,0.5,'point');
    o.holo=await until(()=>T.holoVis[0]===true && T.holoVis[1]===true && T.jjkActive===true,8000) && T.lensV===false;
    o.dedupJJK=(T.jjkPtsVis===false);
    // 7) puzzle: L+L → framing → pinch snap → 3×3
    T.clear(0); T.clear(1); await until(()=>T.jjkActive===false,6000);
    T.setHand(0,0.28,0.2,'frame'); T.setHand(1,0.72,0.78,'frame');
    o.framing=await until(()=>T.pzState==='framing',6000);
    T.setPinch(0,true,0);
    o.puzzle=await until(()=>T.pzState==='puzzle' && T.tilesVis===9,8000);
    return o;
  });
  console.log(JSON.stringify(out,null,1));
  console.log('errs:', JSON.stringify(errs.slice(0,5)));
  await b.close();
})();
