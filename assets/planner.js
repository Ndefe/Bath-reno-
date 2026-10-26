
/* ===================== Planner (simple 3D) ===================== */
window.LOOKS={
  'budget-compact':{name:'Budget Compact',floor:'stone-code',wall:'whoosh-white',metal:'black',wood:0xf7f7f5},
  'grey-modern':{name:'Grey Modern',floor:'regina-grey',wall:'regina-white',metal:'black',wood:0xf2f2ef},
  'beige-copper':{name:'Beige Copper',floor:'sand-600',wall:'cream-gloss',metal:'brass',wood:0xf7f4ef},
  'marble-luxe':{name:'Marble Luxe',floor:'statuario',wall:'statuario',metal:'bronze',wood:0x5c4038},
  'accessible-care':{name:'Accessible Care',floor:'orion-dark',wall:'regina-white',metal:'chrome',wood:0xf7f7f5}
};
const Planner=(()=>{
  const TILES={
    'white-subway':{name:'White subway',size:[0.6,0.6],draw:(g,S)=>{g.fillStyle='#f4f4f1';g.fillRect(0,0,S,S);g.strokeStyle='#c9cbc8';g.lineWidth=3;const rh=S/8;for(let r=0;r<8;r++){g.beginPath();g.moveTo(0,r*rh);g.lineTo(S,r*rh);g.stroke();const off=r%2?S/6:0;for(let c=-1;c<4;c++){const x=off+c*S/3;g.beginPath();g.moveTo(x,r*rh);g.lineTo(x,(r+1)*rh);g.stroke();}}}},
    'grey-large':{name:'Grey large format',size:[1.2,1.2],draw:(g,S)=>{g.fillStyle='#8d9196';g.fillRect(0,0,S,S);noise(g,S,18);g.strokeStyle='#6f7377';g.lineWidth=3;g.strokeRect(0,0,S/2,S);g.strokeRect(S/2,0,S/2,S/2);g.strokeRect(S/2,S/2,S/2,S/2);g.strokeRect(0,S/2,S/2,S/2)}},
    'terrazzo':{name:'Terrazzo',size:[0.6,0.6],draw:(g,S)=>{g.fillStyle='#eae4da';g.fillRect(0,0,S,S);const cols=['#b9a58c','#8c8f93','#d3b6a2','#5f6366','#c48d6a'];let r=seed(7);for(let i=0;i<260;i++){g.fillStyle=cols[i%5];g.beginPath();g.ellipse(r()*S,r()*S,2+r()*7,2+r()*5,r()*3,0,7);g.fill();}g.strokeStyle='#cfc7ba';g.lineWidth=2;g.strokeRect(0,0,S,S)}},
    'black-hex':{name:'Black hex',size:[0.3,0.3],draw:null},
    'beige-stone':{name:'Beige stone',size:[0.6,0.6],draw:(g,S)=>{g.fillStyle='#d8c6a8';g.fillRect(0,0,S,S);noise(g,S,14);g.strokeStyle='#bba887';g.lineWidth=3;g.strokeRect(0,0,S,S)}},
    'white-matte':{name:'White matte (plain)',size:[0.6,0.6],draw:(g,S)=>{g.fillStyle='#f2f2ef';g.fillRect(0,0,S,S);g.strokeStyle='#dcdcd8';g.lineWidth=2;g.strokeRect(0,0,S,S)}},
    'stone-code':{name:'Stone Code grey 600×600',size:[0.6,0.6],draw:(g,S)=>{g.fillStyle='#8a8d90';g.fillRect(0,0,S,S);noise(g,S,12);g.strokeStyle='#6e7276';g.lineWidth=4;g.strokeRect(2,2,S-4,S-4)}},
    'whoosh-white':{name:'Whoosh white gloss 75×300',size:[0.3,0.075],aspect:true,draw:(g,W,H)=>{g.fillStyle='#f7f7f5';g.fillRect(0,0,W,H);const grd=g.createLinearGradient(0,0,0,H);grd.addColorStop(0,'rgba(255,255,255,0.7)');grd.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=grd;g.fillRect(0,0,W,H);g.strokeStyle='#deded8';g.lineWidth=Math.max(2,H*0.08);g.strokeRect(1,1,W-2,H-2)}},
    'regina-grey':{name:'Regina grey 300×600',size:[0.6,0.3],aspect:true,draw:(g,W,H)=>{g.fillStyle='#8e9398';g.fillRect(0,0,W,H);specks(g,W,H,16,500);g.strokeStyle='#6a6f74';g.lineWidth=Math.max(3,W*0.025);g.strokeRect(1.5,1.5,W-3,H-3)}},
    'regina-white':{name:'Regina white 300×600',size:[0.6,0.3],aspect:true,draw:(g,W,H)=>{g.fillStyle='#f4f3f0';g.fillRect(0,0,W,H);specks(g,W,H,8,280);g.strokeStyle='#d4d4cf';g.lineWidth=Math.max(3,W*0.025);g.strokeRect(1.5,1.5,W-3,H-3)}},
    'sand-600':{name:'Concrete sand 600×600',size:[0.6,0.6],draw:(g,S)=>{g.fillStyle='#d9c7aa';g.fillRect(0,0,S,S);noise(g,S,16);g.strokeStyle='#c3ad8c';g.lineWidth=4;g.strokeRect(2,2,S-4,S-4)}},
    'cream-gloss':{name:'Light cream gloss 300×600',size:[0.6,0.3],aspect:true,draw:(g,W,H)=>{const grd=g.createLinearGradient(0,0,W,H);grd.addColorStop(0,'#f7f1e4');grd.addColorStop(0.5,'#efe4d0');grd.addColorStop(1,'#f8f3e8');g.fillStyle=grd;g.fillRect(0,0,W,H);g.strokeStyle='#e0d3bc';g.lineWidth=Math.max(3,W*0.02);g.strokeRect(1.5,1.5,W-3,H-3)}},
    'statuario':{name:'Statuario 600×1200',size:[1.2,0.6],aspect:true,draw:(g,W,H)=>{g.fillStyle='#f7f5f2';g.fillRect(0,0,W,H);g.lineCap='round';for(let i=0;i<6;i++){g.strokeStyle=i%2?'rgba(170,172,176,0.55)':'rgba(186,186,190,0.4)';g.lineWidth=i%3?1.4:2.4;g.beginPath();g.moveTo(-10,H*(0.08+i*0.15));g.bezierCurveTo(W*0.28,H*(0.02+i*0.16),W*0.62,H*(0.22+i*0.1),W+10,H*(0.06+i*0.14));g.stroke();}g.strokeStyle='#e6e2dc';g.lineWidth=3;g.strokeRect(1.5,1.5,W-3,H-3)}},
    'orion-dark':{name:'Orion dark grey P5 600×600',size:[0.6,0.6],draw:(g,S)=>{g.fillStyle='#4a4e52';g.fillRect(0,0,S,S);noise(g,S,10);g.strokeStyle='#34383c';g.lineWidth=4;g.strokeRect(2,2,S-4,S-4)}}
  };
  TILES['black-hex'].draw=(g,S)=>{g.fillStyle='#d9d9d9';g.fillRect(0,0,S,S);g.fillStyle='#1e1f22';const w=S/2,rh=S/2,R=Math.min(w/Math.sqrt(3),rh/1.5)-2;
    for(let row=-1;row<=2;row++)for(let col=-1;col<=2;col++)hex(g,col*w+(row%2?w/2:0),row*rh,R)};
  const METALS={black:{name:'Matte black',c:0x1c1c1e,m:0.22,r:0.64,env:0.32},chrome:{name:'Chrome',c:0xf3f5f7,m:1,r:0.07,env:1.15},copper:{name:'Brushed copper',c:0xc27a4e,m:0.92,r:0.32,env:0.85},brass:{name:'Brushed brass',c:0xb08d57,m:0.94,r:0.3,env:0.85},bronze:{name:'Brushed bronze',c:0x8d5a3a,m:0.9,r:0.36,env:0.8}};
  /* Defaults are Grey Modern. sizeFromPackage() replaces these from the catalogue. */
  const ITEMS={
    bath:{name:'Bath',w:1.56,d:0.75,h:0.56,y:0},
    shower:{name:'Shower',w:0.9,d:0.9,h:1.95,y:0},
    vanity:{name:'Vanity + basin',w:0.75,d:0.46,h:0.543,y:0},
    toilet:{name:'Toilet',w:0.36,d:0.655,h:0.862,y:0},
    tap:{name:'Tap / mixer',w:0.15,d:0.12,h:0.2,y:1.0},
    mirror:{name:'Mirror',w:0.75,d:0.15,h:0.7,y:1.12},
    rail:{name:'Towel rail',w:0.799,d:0.133,h:0.6,y:1.0,ring:false},
    grab:{name:'Grab rail',w:0.94,d:0.08,h:0.6,y:0.8},
    seat:{name:'Fold-down seat',w:0.6,d:0.45,h:0.08,y:0.45},
    basin:{name:'Wall basin',w:0.5,d:0.42,h:0.19,y:0.8}
  };
  function seed(s){return()=>(s=(s*16807)%2147483647)/2147483647}
  function noise(g,S,a){const r=seed(3);for(let i=0;i<4000;i++){const v=(r()-.5)*a;g.fillStyle=`rgba(${v>0?255:0},${v>0?255:0},${v>0?255:0},${Math.abs(v)/255*3})`;g.fillRect(r()*S,r()*S,3,3)}}
  function specks(g,W,H,a,n){const r=seed(5);for(let i=0;i<n;i++){const v=(r()-.5)*a;g.fillStyle=`rgba(${v>0?255:0},${v>0?255:0},${v>0?255:0},${Math.abs(v)/90})`;g.fillRect(r()*W,r()*H,2,2)}}
  function hex(g,x,y,R){g.beginPath();for(let i=0;i<6;i++){const a=Math.PI/3*i+Math.PI/6;g.lineTo(x+R*Math.cos(a),y+R*Math.sin(a))}g.closePath();g.fill()}
  function sizeText(v){const a=Math.round(v.w*1000), b=Math.round((v.y>0?v.h:v.d)*1000);return `${a}×${b}`}

  let renderer,scene,camera,controls,roomMesh,itemsGroup,selHelper,ray=new THREE.Raycaster(),inited=false;
  let design=null,selected=null,drag=null;
  let walking=false,pixelRatio=1,adaptAcc=0,adaptN=0,savedView=null;
  const PLAYER_R=0.17;
  const player={x:0,z:0,yaw:0,pitch:0};
  const held={w:false,a:false,s:false,d:false};
  const joy={on:false,dx:0,dy:0,id:null};
  const lookPtr={on:false,id:null,x:0,y:0};
  const texCache={};
  const defaultDesign=()=>({room:{shape:'rect',l:2.5,w:2.0,h:2.4,notchL:1.2,notchW:1,notchCorner:'ne'},floor:'regina-grey',wall:'regina-white',metal:'black',wood:0xf2f2ef,stepFree:false,items:[],doors:[],windows:[]});
  let planOn=false;
  let undoStack=[], redoStack=[], histLock=false, forceNums=false;
  function snapshot(){
    if(histLock||!design) return;
    const snap=JSON.stringify(design);
    if(undoStack.length&&undoStack[undoStack.length-1]===snap) return;
    undoStack.push(snap);
    if(undoStack.length>40) undoStack.shift();
    redoStack=[];
    paintHist();
  }
  function paintHist(){
    const u=$('pl-undo'), r=$('pl-redo');
    if(u) u.disabled=undoStack.length<1;
    if(r) r.disabled=redoStack.length<1;
  }
  function restoreDesign(raw){
    histLock=true;
    forceNums=true;
    design=normalizeDesign(JSON.parse(raw));
    if(window.BQ&&BQ.quote) BQ.quote.design=design;
    selected=null;
    if(inited){
      buildRoom();buildItems();renderOpenings();
      if($('pl-look')) $('pl-look').value=design.look||'';
      if($('pl-stepfree')) $('pl-stepfree').checked=!!design.stepFree;
      syncToQuote();
    }
    forceNums=false;
    histLock=false;
    paintHist();
  }
  function undoDesign(){
    if(!design) return;
    const current=JSON.stringify(design);
    let snap=null;
    while(undoStack.length){
      snap=undoStack.pop();
      if(snap!==current) break;
      snap=null;
    }
    if(!snap){paintHist();return}
    redoStack.push(current);
    restoreDesign(snap);
  }
  function redoDesign(){
    if(!design||!redoStack.length) return;
    undoStack.push(JSON.stringify(design));
    restoreDesign(redoStack.pop());
  }
  function ask(text, yes){
    return new Promise(resolve=>{
      const box=$('pl-ask'), y=$('pl-ask-yes'), n=$('pl-ask-no');
      $('pl-ask-text').textContent=text;
      y.textContent=yes;
      box.hidden=false;
      const done=v=>{box.hidden=true;y.removeEventListener('click',onY);n.removeEventListener('click',onN);resolve(v)};
      function onY(){done(true)}
      function onN(){done(false)}
      y.addEventListener('click', onY);
      n.addEventListener('click', onN);
    });
  }

  function tileCanvas(key){
    if(texCache[key]) return texCache[key];
    const [sx,sy]=TILES[key].size, long=512, c=document.createElement('canvas');
    if(TILES[key].aspect){
      c.width=sx>=sy?long:Math.max(2,Math.round(long*sx/sy));
      c.height=sy>=sx?long:Math.max(2,Math.round(long*sy/sx));
    }else c.width=c.height=long;
    TILES[key].draw(c.getContext('2d'),c.width,c.height);
    return texCache[key]=c;
  }
  function tileSurface(key){
    const n=(TILES[key]&&TILES[key].name||'').toLowerCase();
    if(/matte|p5|grip/.test(n)&&!/gloss/.test(n)) return {roughness:0.84,metalness:0,clearcoat:0.02,envMapIntensity:0.22};
    if(key==='statuario'||/gloss/.test(n)) return {roughness:0.16,metalness:0.02,clearcoat:0.62,clearcoatRoughness:0.18,envMapIntensity:0.85};
    if(/stone|sand|terrazzo|hex/.test(n)) return {roughness:0.68,metalness:0.02,clearcoat:0.08,envMapIntensity:0.32};
    return {roughness:0.48,metalness:0.02,clearcoat:0.2,clearcoatRoughness:0.32,envMapIntensity:0.5};
  }
  const matPool=new Map();
  function cheapLook(){return Math.min(window.innerWidth,window.innerHeight)<=900}
  function matKey(kind,opts){
    return kind+'|'+Object.keys(opts).sort().map(k=>{
      const v=opts[k];
      if(v&&v.isTexture) return k+'@'+v.uuid;
      if(v&&v.isColor) return k+'#'+v.getHexString();
      return k+'='+v;
    }).join(',');
  }
  function physicalMat(opts){
    const src=Object.assign({roughness:0.5,metalness:0,envMapIntensity:0.45,clearcoat:0,clearcoatRoughness:0.3}, opts);
    let kind='phy', use=src;
    if(cheapLook()){
      kind='std';
      use={color:src.color,map:src.map,roughness:src.roughness,metalness:src.metalness,envMapIntensity:0.35,side:src.side,transparent:src.transparent,opacity:src.opacity,depthWrite:src.depthWrite};
      if(src.transmission>0){use.transparent=true;use.opacity=0.34;use.depthWrite=false;use.roughness=Math.max(use.roughness||0,0.08)}
    }
    if(use.map) return kind==='std'?new THREE.MeshStandardMaterial(use):new THREE.MeshPhysicalMaterial(use);
    const key=matKey(kind,use);
    const hit=matPool.get(key);
    if(hit) return hit;
    const m=kind==='std'?new THREE.MeshStandardMaterial(use):new THREE.MeshPhysicalMaterial(use);
    m.userData.shared=true;
    matPool.set(key,m);
    return m;
  }
  function tileMat(key,wm,hm){
    const spec=TILES[key]||TILES['white-matte'];
    const real=spec===TILES[key]?key:'white-matte';
    const t=new THREE.CanvasTexture(tileCanvas(real));
    t.wrapS=t.wrapT=THREE.RepeatWrapping;
    const [sx,sy]=spec.size;t.repeat.set(wm/sx,hm/sy);t.anisotropy=4;t.encoding=THREE.sRGBEncoding;
    const surf=tileSurface(real);
    return physicalMat({map:t,side:THREE.BackSide,roughness:surf.roughness,metalness:surf.metalness,clearcoat:surf.clearcoat||0,clearcoatRoughness:surf.clearcoatRoughness==null?0.3:surf.clearcoatRoughness,envMapIntensity:surf.envMapIntensity==null?0.5:surf.envMapIntensity});
  }
  const PALETTE=[['Room',['bath','shower','toilet','vanity','basin']],['Fittings',['tap','mirror','rail','grab','seat']]];
  const ICONS={
    bath:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z"/><path d="M6 12V8a2 2 0 0 1 2-2h1"/></svg>',
    shower:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12v1H6z"/><path d="M8 4h8a2 2 0 0 1 2 2v1"/><path d="M8 12v2M12 12v2M16 12v2M9 17v2M13 17v2"/></svg>',
    toilet:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3h8v5H8z"/><path d="M7 10h10a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4z"/><path d="M12 14v4"/></svg>',
    vanity:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11h16v7H4z"/><circle cx="12" cy="7" r="2.2"/></svg>',
    basin:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10h14v2a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6v-2z"/></svg>',
    tap:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h5a4 4 0 0 1 4 4v2H8z"/><path d="M10 13v5M8 18h4"/></svg>',
    mirror:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="2"/></svg>',
    rail:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7v10M18 7v10M6 10h12M6 15h12"/></svg>',
    grab:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 19V9a4 4 0 0 1 4-4h8"/></svg>',
    seat:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14h14v3H4z"/><path d="M16 14V8"/></svg>'
  };
  function paintPalette(){
    $('pl-palette').innerHTML=PALETTE.map(([group,keys])=>{
      const btns=keys.filter(k=>ITEMS[k]).map(k=>`<button class="btn sec pl-tile" type="button" data-add="${k}">${ICONS[k]||''}<span>${esc(ITEMS[k].name)}</span></button>`).join('');
      return `<p class="pl-group">${group}</p>${btns}`;
    }).join('');
  }
  function toast(msg){
    let el=$('pl-toast');
    if(!el){
      el=document.createElement('p');
      el.id='pl-toast';
      el.className='pl-toast';
      el.setAttribute('role','status');
      el.hidden=true;
      document.body.appendChild(el);
    }
    el.textContent=msg;
    el.hidden=false;
    clearTimeout(el._t);
    el._t=setTimeout(()=>{el.hidden=true},1800);
  }
  function mm(obj,key,fallback){const v=obj&&+obj[key];return v>0?v/1000:fallback}

  /* Fit the planner blocks to the selected package's real product dimensions. */
  function sizeFromPackage(pkgId){
    const pkg=(window.BQ&&BQ.catalogue)?BQ.catalogue.packages.find(p=>p.id===pkgId):null;
    if(!pkg) return;
    const find=c=>pkg.items.find(i=>i.category===c);
    const van=find('vanity');
    if(van){const d=van.dimensions_mm||{};ITEMS.vanity.w=mm(d,'width_mm',ITEMS.vanity.w);ITEMS.vanity.d=mm(d,'depth_mm',ITEMS.vanity.d);ITEMS.vanity.h=mm(d,'height_mm',ITEMS.vanity.h)}
    const bath=find('bath');
    if(bath){const d=bath.dimensions_mm||{};ITEMS.bath.w=mm(d,'length_mm',ITEMS.bath.w);ITEMS.bath.d=mm(d,'width_mm',ITEMS.bath.d);ITEMS.bath.h=mm(d,'height_mm',ITEMS.bath.h)}
    const wc=find('toilet_suite');
    if(wc){const d=wc.dimensions_mm||{};ITEMS.toilet.w=mm(d,'pan_width_mm',mm(d,'width_mm',ITEMS.toilet.w));ITEMS.toilet.d=mm(d,'pan_projection_mm',ITEMS.toilet.d);ITEMS.toilet.h=mm(d,'height_mm',ITEMS.toilet.h)}
    const sh=find('shower_screen')||find('shower_curtain');
    if(sh){const d=sh.dimensions_mm||{};ITEMS.shower.w=mm(d,'width_mm',ITEMS.shower.w);ITEMS.shower.d=mm(d,'depth_mm',sh.category==='shower_curtain'?1.2:0.9)}
    const grab=find('grab_rail');
    if(grab){const d=grab.dimensions_mm||{};ITEMS.grab.w=mm(d,'width_mm',0.94);ITEMS.grab.h=mm(d,'height_mm',0.6);ITEMS.grab.d=0.08}
    const seat=find('shower_seat');
    if(seat){const d=seat.dimensions_mm||{};ITEMS.seat.w=mm(d,'width_mm',0.6);if(+d.depth_mm>0) ITEMS.seat.d=d.depth_mm/1000}
    const basin=find('wall_basin');
    if(basin){const d=basin.dimensions_mm||{};ITEMS.basin.w=mm(d,'width_mm',0.5);ITEMS.basin.d=mm(d,'depth_mm',0.42);ITEMS.basin.h=mm(d,'height_mm',0.19)}
    const mir=find('mirror_cabinet')||find('mirror');
    if(mir){
      const d=mir.dimensions_mm||{};
      ITEMS.mirror.w=mm(d,'width_mm',ITEMS.mirror.w);
      ITEMS.mirror.h=mm(d,'height_mm',0.7);
      ITEMS.mirror.d=mm(d,'depth_mm', mir.category==='mirror'?0.03:0.15);
      const ceiling=design?.room?.h||2.4;
      ITEMS.mirror.y=Math.max(0.85, Math.min(1.12, ceiling-ITEMS.mirror.h-0.08));
    }
    const rail=find('towel_rail');
    if(rail){
      const d=rail.dimensions_mm||{};
      const w=mm(d,'width_mm',ITEMS.rail.w);
      ITEMS.rail.w=w;
      ITEMS.rail.d=mm(d,'projection_mm',0.12);
      ITEMS.rail.ring=w<0.35;
      ITEMS.rail.h=ITEMS.rail.ring?mm(d,'height_mm',0.15):0.6;
      ITEMS.rail.y=ITEMS.rail.ring?1.25:1.0;
      ITEMS.rail.name=ITEMS.rail.ring?'Towel ring':'Towel rail';
    }else ITEMS.rail.name='Towel rail';
    if(inited) paintPalette();
  }

  function init(){
    const host=$('pl-canvas');
    renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
    pixelRatio=basePixelRatio();
    renderer.setPixelRatio(pixelRatio);renderer.outputEncoding=THREE.sRGBEncoding;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    host.appendChild(renderer.domElement);
    scene=new THREE.Scene();scene.background=new THREE.Color(0xdfe5ea);
    camera=new THREE.PerspectiveCamera(45,1,0.05,100);camera.position.set(3.2,3.6,4.2);
    controls=new THREE.OrbitControls(camera,renderer.domElement);controls.target.set(0,0.9,0);controls.enableDamping=true;controls.maxPolarAngle=Math.PI*0.49;controls.minDistance=1.5;controls.maxDistance=12;
    controls.touches.TWO=THREE.TOUCH.DOLLY_PAN;
    renderer.domElement.style.touchAction='pan-y';
    scene.add(new THREE.HemisphereLight(0xfff1e0,0x6a6158,0.62));
    const fill=new THREE.DirectionalLight(0xc5d4e8,0.48);fill.name='fill';fill.position.set(-2.2,2.2,-1.2);scene.add(fill);
    const small=Math.min(window.innerWidth,window.innerHeight)<=900;
    const sm=small?512:1024;
    const key=new THREE.DirectionalLight(0xffd7ae,1.45);
    key.name='key';key.position.set(1.8,3.1,1.5);key.castShadow=true;
    key.shadow.mapSize.set(sm,sm);key.shadow.bias=-0.00035;key.shadow.normalBias=0.035;key.shadow.radius=small?3:8;
    key.shadow.camera.near=0.05;key.shadow.camera.far=12;
    scene.add(key);scene.add(key.target);
    const spot=new THREE.SpotLight(0xfff0d6,0.42,0,Math.PI/2.4,0.92,1);
    spot.name='ceil';spot.castShadow=false;
    scene.add(spot);scene.add(spot.target);
    const lamp=new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.09,0.02,24),new THREE.MeshStandardMaterial({color:0xfff8ef,emissive:0xffe2b8,emissiveIntensity:0.7,roughness:0.4}));
    lamp.name='lamp';lamp.castShadow=false;scene.add(lamp);
    itemsGroup=new THREE.Group();scene.add(itemsGroup);
    selHelper=new THREE.BoxHelper(undefined,0x0e7c86);selHelper.visible=false;scene.add(selHelper);
    $('pl-look').innerHTML=Object.entries(LOOKS).map(([k,v])=>`<option value="${k}">${esc(v.name)}</option>`).join('')+'<option value="">Custom</option>';
    const opts=Object.entries(TILES).map(([k,v])=>`<option value="${k}">${esc(v.name)}</option>`).join('');
    $('pl-floor').innerHTML=opts;$('pl-wall').innerHTML=opts;
    $('pl-metal').innerHTML=Object.entries(METALS).map(([k,v])=>`<option value="${k}">${esc(v.name)}</option>`).join('');
    paintPalette();
    $('pl-palette').onclick=e=>{const k=e.target.closest('[data-add]');if(k)addItem(k.dataset.add)};
    ['pl-l','pl-w','pl-h','pl-notch-l','pl-notch-w'].forEach(id=>{
      $(id).addEventListener('focus', ()=>snapshot());
      $(id).addEventListener('input', applyRoomSize);
    });
    $('pl-shape').onchange=()=>{snapshot();applyRoomSize()};
    $('pl-notch-corner').onchange=()=>{snapshot();applyRoomSize()};
    $('pl-look').onchange=e=>{if(e.target.value){snapshot();applyLook(e.target.value)}};
    $('pl-stepfree').onchange=()=>{if(!design)return;snapshot();design.stepFree=$('pl-stepfree').checked;buildItems()};
    $('pl-floor').onchange=e=>{snapshot();design.floor=e.target.value;$('pl-look').value='';buildRoom()};
    $('pl-wall').onchange=e=>{snapshot();design.wall=e.target.value;$('pl-look').value='';buildRoom()};
    $('pl-metal').onchange=e=>{snapshot();design.metal=e.target.value;$('pl-look').value='';buildItems()};
    $('pl-openings').addEventListener('input',onOpeningEdit);
    $('pl-openings').addEventListener('change',onOpeningEdit);
    $('pl-openings').addEventListener('click',onOpeningClick);
    document.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{if(!selected)return;snapshot();const [dx,dz]=b.dataset.mv.split(',').map(Number);nudgeItem(dx*0.1,dz*0.1)});
    const rotateSelected=()=>{if(!selected)return;snapshot();const r0=selected.rot;selected.rot=(selected.rot+1)%4;clampItem(selected);if(itemHitsOpening(selected)){selected.rot=r0;setWarn(ITEMS[selected.type].name+' can\'t sit in a door opening or swing.')}else refreshWarnings();buildItems()};
    $('pl-rot').onclick=rotateSelected;
    if($('pl-rot-fab')) $('pl-rot-fab').onclick=rotateSelected;
    if($('pl-flip')) $('pl-flip').onclick=flipSelected;
    if($('pl-dup')) $('pl-dup').onclick=duplicateSelected;
    if($('pl-suggest')) $('pl-suggest').onclick=suggestLayout;
    $('pl-del').onclick=deleteSelected;
    if($('pl-fab-del')) $('pl-fab-del').onclick=deleteSelected;
    $('pl-clear').onclick=clearAll;
    if($('pl-fab-clear')) $('pl-fab-clear').onclick=clearAll;
    if($('pl-undo')) $('pl-undo').onclick=undoDesign;
    if($('pl-redo')) $('pl-redo').onclick=redoDesign;
    if($('pl-fab-render')) $('pl-fab-render').onclick=runRender;
    if($('pl-sheet-open')) $('pl-sheet-open').onclick=()=>setTray(true);
    if($('pl-sheet-close')) $('pl-sheet-close').onclick=()=>setTray(false);
    setTray(false);
    paintHist();
    $('pl-client').onclick=toggleClient;$('pl-png').onclick=saveImage;
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('client')&&!walking)toggleClient()});
    bindWalkInput();
    const el=renderer.domElement;
    el.addEventListener('pointerdown',onDown);el.addEventListener('pointermove',onMove);window.addEventListener('pointerup',onUp);window.addEventListener('pointercancel',onUp);
    el.addEventListener('touchmove',ev=>{if(ev.touches.length>=2||drag||pending) ev.preventDefault()},{passive:false});
    new ResizeObserver(resize).observe(host);
    loadStudio();
    inited=true;
    let lastFrame=performance.now();
    (function loop(now){
      requestAnimationFrame(loop);
      const dt=Math.min(0.05,(now-lastFrame)/1000)||0;lastFrame=now;
      if(walking) stepWalk(dt);
      else{controls.update();if(selected)selHelper.update();placeFloat()}
      renderer.render(scene,camera);
    })();
  }
  function resize(){const h=$('pl-canvas');const w=h.clientWidth,ht=h.clientHeight;if(!w||!ht||!renderer)return;renderer.setPixelRatio(pixelRatio);renderer.setSize(w,ht,false);camera.aspect=w/ht;camera.updateProjectionMatrix();placeFloat();if(walking){$('pl-joy').hidden=!useTouchWalk()}}

  const DOOR_H=2.04;
  const WALL_NAME={n:'Far wall',s:'Near wall',e:'Right wall',w:'Left wall',nh:'Notch end',nv:'Notch side'};
  function wallLabel(w){return WALL_NAME[w.id]||w.id}

  function normRoom(room){
    room=room||{};
    const shape=room.shape==='l'?'l':'rect';
    const l=Math.min(12,Math.max(1,+room.l||2.5));
    const w=Math.min(12,Math.max(1,+room.w||2));
    const h=Math.min(4,Math.max(2,+room.h||2.4));
    const corners=['nw','ne','sw','se'];
    const notchCorner=corners.includes(room.notchCorner)?room.notchCorner:'ne';
    let notchL=+room.notchL||0, notchW=+room.notchW||0;
    if(shape==='l'){
      if(!(notchL>0)) notchL=Math.min(1.2,l*0.4);
      if(!(notchW>0)) notchW=Math.min(1,w*0.4);
      notchL=Math.min(Math.max(0.4,notchL),Math.max(0.4,l-0.6));
      notchW=Math.min(Math.max(0.4,notchW),Math.max(0.4,w-0.6));
    }
    return {shape,l:Calc.round(l),w:Calc.round(w),h:Calc.round(h),notchL:Calc.round(notchL),notchW:Calc.round(notchW),notchCorner};
  }
  function roomPolygon(room){
    const L=room.l,W=room.w,x0=-L/2,x1=L/2,z0=-W/2,z1=W/2;
    if(room.shape!=='l') return [[x0,z0],[x1,z0],[x1,z1],[x0,z1]];
    const nl=room.notchL,nw=room.notchW,c=room.notchCorner;
    if(c==='ne') return [[x0,z0],[x1-nl,z0],[x1-nl,z0+nw],[x1,z0+nw],[x1,z1],[x0,z1]];
    if(c==='nw') return [[x0+nl,z0],[x1,z0],[x1,z1],[x0,z1],[x0,z0+nw],[x0+nl,z0+nw]];
    if(c==='se') return [[x0,z0],[x1,z0],[x1,z1-nw],[x1-nl,z1-nw],[x1-nl,z1],[x0,z1]];
    return [[x0,z0],[x1,z0],[x1,z1],[x0+nl,z1],[x0+nl,z1-nw],[x0,z1-nw]];
  }
  function floorRects(room){
    if(room.shape!=='l') return [{x:0,z:0,sx:room.l,sz:room.w}];
    const L=room.l,W=room.w,nl=room.notchL,nw=room.notchW,c=room.notchCorner;
    const xSign=(c==='ne'||c==='se')?1:-1;
    const zSign=(c==='ne'||c==='nw')?-1:1;
    return [
      {x:-xSign*nl/2,z:0,sx:L-nl,sz:W},
      {x:xSign*(L/2-nl/2),z:-zSign*nw/2,sx:nl,sz:W-nw}
    ];
  }
  function floorCentroid(room){
    const rects=floorRects(room);
    let a=0,x=0,z=0;
    rects.forEach(r=>{const ar=r.sx*r.sz;a+=ar;x+=r.x*ar;z+=r.z*ar});
    return a?{x:x/a,z:z/a}:{x:0,z:0};
  }
  function designFloorArea(){
    const r=normRoom(design.room);
    return Calc.round(r.shape==='l'?r.l*r.w-r.notchL*r.notchW:r.l*r.w);
  }
  function pointInPoly(x,z,poly){
    let inside=false;
    for(let i=0,j=poly.length-1;i<poly.length;j=i++){
      const xi=poly[i][0],zi=poly[i][1],xj=poly[j][0],zj=poly[j][1];
      if(((zi>z)!==(zj>z))&&(x<(xj-xi)*(z-zi)/((zj-zi)||1e-9)+xi)) inside=!inside;
    }
    return inside;
  }
  function distToSeg(x,z,a,b){
    const dx=b[0]-a[0],dz=b[1]-a[1],len2=dx*dx+dz*dz||1e-9;
    let t=((x-a[0])*dx+(z-a[1])*dz)/len2;
    t=Math.max(0,Math.min(1,t));
    return Math.hypot(x-(a[0]+t*dx),z-(a[1]+t*dz));
  }
  function insideRoom(x,z,inset){
    const poly=roomPolygon(normRoom(design.room));
    if(!pointInPoly(x,z,poly)) return false;
    if(inset>0){
      for(let i=0;i<poly.length;i++) if(distToSeg(x,z,poly[i],poly[(i+1)%poly.length])<inset-1e-4) return false;
    }
    return true;
  }
  function wallsOf(room){
    const poly=roomPolygon(room),walls=[];
    for(let i=0;i<poly.length;i++){
      const a=poly[i],b=poly[(i+1)%poly.length];
      const dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);
      if(len<0.05) continue;
      const ux=dx/len,uz=dz/len,mx=(a[0]+b[0])/2,mz=(a[1]+b[1])/2;
      let nx=-uz,nz=ux;
      if(!pointInPoly(mx+nx*0.05,mz+nz*0.05,poly)){nx=-nx;nz=-nz}
      let id='nv';
      const horiz=Math.abs(dz)<0.02,vert=Math.abs(dx)<0.02;
      if(horiz&&Math.abs(mz+room.w/2)<0.02) id='n';
      else if(horiz&&Math.abs(mz-room.w/2)<0.02) id='s';
      else if(vert&&Math.abs(mx+room.l/2)<0.02) id='w';
      else if(vert&&Math.abs(mx-room.l/2)<0.02) id='e';
      else if(horiz) id='nh';
      walls.push({id,a,b,len,mx,mz,dx:ux,dz:uz,nx,nz});
    }
    return walls;
  }
  function normalizeDoor(d){
    d=d||{};
    const presets=[720,770,820,870];
    let widthMm=+d.widthMm||820;
    if(!presets.includes(widthMm)) widthMm=Math.max(450,Math.min(2000,Math.round(widthMm)));
    const swing=d.swing==='out'||d.swing==='slider'?d.swing:'in';
    return {id:d.id||uid(),wall:d.wall||'s',offset:+d.offset||0,widthMm,hinge:d.hinge==='right'?'right':'left',swing};
  }
  function normalizeWindow(w){
    w=w||{};
    return {id:w.id||uid(),wall:w.wall||'n',offset:+w.offset||0,widthMm:Math.max(300,Math.min(2400,Math.round(+w.widthMm||900))),heightM:Calc.round(Math.max(0.3,+w.heightM||0.6)),sillM:Calc.round(Math.max(0.2,+w.sillM||1.2))};
  }
  function normalizeDesign(d){
    d.room=normRoom(d.room);
    if(!Array.isArray(d.items)) d.items=[];
    d.doors=(Array.isArray(d.doors)?d.doors:[]).map(normalizeDoor);
    d.windows=(Array.isArray(d.windows)?d.windows:[]).map(normalizeWindow);
    d.stepFree=!!d.stepFree;
    return d;
  }
  function clampOpenings(){
    if(!design) return;
    const room=normRoom(design.room);
    design.room=room;
    const walls=wallsOf(room);
    const fit=op=>{
      const wall=walls.find(w=>w.id===op.wall)||walls.slice().sort((a,b)=>b.len-a.len)[0];
      if(!wall) return;
      op.wall=wall.id;
      const maxW=Math.max(0.45,wall.len-0.08);
      const widthM=Math.min(maxW,Math.max(0.45,(+op.widthMm||800)/1000));
      op.widthMm=Math.round(widthM*1000);
      const half=widthM/2;
      op.offset=Calc.round(Math.min(wall.len-half,Math.max(half,+op.offset||wall.len/2)));
    };
    (design.doors||[]).forEach(fit);
    (design.windows||[]).forEach(w=>{
      fit(w);
      let sill=Math.max(0.2,+w.sillM||1.2), height=Math.max(0.3,+w.heightM||0.6);
      if(sill+height>room.h-0.12) height=Math.max(0.3,room.h-0.12-sill);
      if(sill+height>room.h-0.12) sill=Math.max(0.2,room.h-0.12-height);
      w.sillM=Calc.round(sill);w.heightM=Calc.round(height);
    });
  }
  function doorFrame(door){
    const room=normRoom(design.room);
    const wall=wallsOf(room).find(w=>w.id===door.wall);
    if(!wall) return null;
    const width=Math.min(Math.max(0.45,(+door.widthMm||820)/1000),Math.max(0.45,wall.len-0.08));
    const half=width/2;
    const offset=Math.min(wall.len-half,Math.max(half,+door.offset||wall.len/2));
    const leftDot=(-wall.nz)*wall.dx+wall.nx*wall.dz;
    const side=door.hinge==='right'?-1:1;
    const hingeAlong=offset+side*leftDot*half;
    const latchAlong=offset-side*leftDot*half;
    const closedSign=Math.sign(latchAlong-hingeAlong)||1;
    const swingSign=door.swing==='out'?-1:1;
    return {
      door,wall,width,offset,hingeAlong,latchAlong,
      hx:wall.a[0]+wall.dx*hingeAlong,hz:wall.a[1]+wall.dz*hingeAlong,
      ux:wall.dx,uz:wall.dz,
      closedX:wall.dx*closedSign,closedZ:wall.dz*closedSign,
      swingX:wall.nx*swingSign,swingZ:wall.nz*swingSign,
      height:Math.min(DOOR_H,room.h-0.08)
    };
  }
  function windowFrame(win){
    const room=normRoom(design.room);
    const wall=wallsOf(room).find(w=>w.id===win.wall);
    if(!wall) return null;
    const width=Math.min(Math.max(0.3,(+win.widthMm||900)/1000),Math.max(0.3,wall.len-0.08));
    const half=width/2;
    const offset=Math.min(wall.len-half,Math.max(half,+win.offset||wall.len/2));
    const sill=Math.max(0.2,+win.sillM||1.2);
    const top=Math.min(room.h-0.08,sill+(+win.heightM||0.6));
    return {win,wall,width,offset,lo:offset-half,hi:offset+half,sill,top};
  }
  function inOpening(x,z,f){
    const along=(x-f.wall.a[0])*f.wall.dx+(z-f.wall.a[1])*f.wall.dz;
    const inward=(x-f.wall.a[0])*f.wall.nx+(z-f.wall.a[1])*f.wall.nz;
    const lo=Math.min(f.hingeAlong,f.latchAlong)-0.02, hi=Math.max(f.hingeAlong,f.latchAlong)+0.02;
    return along>=lo&&along<=hi&&inward>=-0.02&&inward<=0.3;
  }
  function inSector(x,z,f){
    if(f.door.swing==='slider') return false;
    const vx=x-f.hx,vz=z-f.hz,dist=Math.hypot(vx,vz);
    if(dist>f.width+0.01||dist<0.01) return false;
    return vx*f.closedX+vz*f.closedZ>=-0.02 && vx*f.swingX+vz*f.swingZ>=-0.02;
  }
  function itemHitsOpening(it){
    if(!design||!it) return false;
    const [fw,fd]=footprint(it);
    const pts=footprintCorners(it).concat([[it.x,it.z]]);
    for(const door of design.doors||[]){
      const f=doorFrame(door);
      if(!f) continue;
      if(pts.some(([x,z])=>inOpening(x,z,f)||inSector(x,z,f))) return true;
      const samples=[];
      const lo=Math.min(f.hingeAlong,f.latchAlong),hi=Math.max(f.hingeAlong,f.latchAlong);
      for(let t=0;t<=1;t+=0.34){
        const along=lo+(hi-lo)*t;
        [0.05,0.18].forEach(inn=>samples.push([f.wall.a[0]+f.ux*along+f.wall.nx*inn,f.wall.a[1]+f.uz*along+f.wall.nz*inn]));
      }
      if(f.door.swing!=='slider'){
        const a0=Math.atan2(f.closedX,f.closedZ), a1=Math.atan2(f.swingX,f.swingZ);
        let delta=a1-a0;
        while(delta>Math.PI) delta-=Math.PI*2;
        while(delta<-Math.PI) delta+=Math.PI*2;
        for(let i=1;i<=4;i++){
          const a=a0+delta*(i/4);
          [0.45,0.9].forEach(k=>samples.push([f.hx+Math.sin(a)*f.width*k,f.hz+Math.cos(a)*f.width*k]));
        }
      }
      if(samples.some(([x,z])=>Math.abs(x-it.x)<fw/2-0.02&&Math.abs(z-it.z)<fd/2-0.02)) return true;
    }
    return false;
  }
  function windowInShower(win){
    const f=windowFrame(win);
    if(!f) return false;
    return (design.items||[]).some(it=>{
      if(it.type!=='shower') return false;
      const [fw,fd]=footprint(it), pad=0.15;
      for(let t=0;t<=1;t+=0.25){
        const along=f.lo+(f.hi-f.lo)*t;
        const x=f.wall.a[0]+f.wall.dx*along+f.wall.nx*0.08;
        const z=f.wall.a[1]+f.wall.dz*along+f.wall.nz*0.08;
        if(Math.abs(x-it.x)<fw/2+pad&&Math.abs(z-it.z)<fd/2+pad) return true;
      }
      return false;
    });
  }
  function setWarn(msg){const el=$('pl-warn');if(el) el.textContent=msg||''}
  function refreshWarnings(){
    if(!design||!$('pl-warn')) return;
    const msgs=[];
    (design.items||[]).forEach(it=>{
      if(itemHitsOpening(it)) msgs.push(`${ITEMS[it.type].name} sits in a door opening or swing. Move it clear.`);
    });
    (design.windows||[]).forEach(w=>{
      if(windowInShower(w)) msgs.push('This window sits in the shower zone. Wet-area glazing needs to be checked with the builder.');
    });
    setWarn([...new Set(msgs)].join(' '));
  }
  function footprintCorners(it){
    const [fw,fd]=footprint(it);
    return [[it.x-fw/2,it.z-fd/2],[it.x+fw/2,it.z-fd/2],[it.x+fw/2,it.z+fd/2],[it.x-fw/2,it.z+fd/2]];
  }
  function setNum(id,value){const el=$(id);if(!el||(!forceNums&&document.activeElement===el)) return;el.value=value}
  function phoneTray(){return window.matchMedia('(max-width:860px)').matches}
  function setTray(open){
    const sheet=$('pl-sheet');
    if(!sheet) return;
    if(!phoneTray()){sheet.hidden=false;return}
    sheet.hidden=!open;
  }
  function disposeObj(obj){
    const seen=new Set();
    obj.traverse(o=>{
      if(o.geometry) o.geometry.dispose();
      const mats=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];
      mats.forEach(m=>{if(seen.has(m)||!m) return;seen.add(m);if(m.userData&&m.userData.shared) return;if(m.map&&!(m.map.userData&&m.map.userData.shared)) m.map.dispose();m.dispose()});
    });
  }
  function tiledMat(key,wm,hm,side){
    const spec=TILES[key]||TILES['white-matte'];
    const real=TILES[key]?key:'white-matte';
    const t=new THREE.CanvasTexture(tileCanvas(real));
    t.wrapS=t.wrapT=THREE.RepeatWrapping;
    const [sx,sy]=spec.size;
    t.repeat.set(Math.max(wm,0.1)/sx,Math.max(hm,0.1)/sy);
    t.anisotropy=4;t.encoding=THREE.sRGBEncoding;
    const surf=tileSurface(real);
    return physicalMat({map:t,side:side==null?THREE.FrontSide:side,roughness:surf.roughness,metalness:surf.metalness,clearcoat:surf.clearcoat||0,clearcoatRoughness:surf.clearcoatRoughness==null?0.3:surf.clearcoatRoughness,envMapIntensity:surf.envMapIntensity==null?0.5:surf.envMapIntensity});
  }
  function contactAo(){
    if(contactAo.tex) return contactAo.tex;
    const c=document.createElement('canvas');
    c.width=c.height=128;
    const g=c.getContext('2d');
    const grd=g.createRadialGradient(64,64,16,64,64,72);
    grd.addColorStop(0,'#ffffff');
    grd.addColorStop(0.62,'#f3f3f3');
    grd.addColorStop(1,'#7d7d7d');
    g.fillStyle=grd;g.fillRect(0,0,128,128);
    const t=new THREE.CanvasTexture(c);
    t.encoding=THREE.LinearEncoding;
    t.userData.shared=true;
    contactAo.tex=t;
    return t;
  }
  function loadStudio(){
    if(!renderer||!THREE.RGBELoader||cheapLook()) return;
    new THREE.RGBELoader().load('assets/env/studio_small_03_1k.hdr',tex=>{
      tex.mapping=THREE.EquirectangularReflectionMapping;
      const pmrem=new THREE.PMREMGenerator(renderer);
      pmrem.compileEquirectangularShader();
      scene.environment=pmrem.fromEquirectangular(tex).texture;
      tex.dispose();
      pmrem.dispose();
      if(renderer.domElement) renderer.domElement.dataset.env='1';
    },undefined,()=>{if(renderer&&renderer.domElement) renderer.domElement.dataset.env='err'});
  }
  function holesOn(wall,roomH){
    const holes=[];
    (design.doors||[]).forEach(d=>{
      if(d.wall!==wall.id) return;
      const f=doorFrame(d);if(!f) return;
      const lo=Math.min(f.hingeAlong,f.latchAlong),hi=Math.max(f.hingeAlong,f.latchAlong);
      holes.push({lo,hi,y0:0,y1:f.height,kind:'door',src:d,frame:f});
    });
    (design.windows||[]).forEach(w=>{
      if(w.wall!==wall.id) return;
      const f=windowFrame(w);if(!f) return;
      holes.push({lo:f.lo,hi:f.hi,y0:f.sill,y1:f.top,kind:'window',src:w,frame:f});
    });
    return holes.filter(h=>h.hi-h.lo>0.05&&h.y1-h.y0>0.05&&h.y1>0&&h.y0<roomH);
  }
  function addWallPiece(group,wall,along0,along1,y0,y1,mat){
    const len=along1-along0,height=y1-y0;
    if(len<0.03||height<0.03) return;
    const mid=(along0+along1)/2;
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(len,height),mat);
    mesh.position.set(wall.a[0]+wall.dx*mid,(y0+y1)/2,wall.a[1]+wall.dz*mid);
    mesh.rotation.y=Math.atan2(wall.nx,wall.nz);
    mesh.receiveShadow=true;
    group.add(mesh);
  }
  function addWallWithHoles(group,wall,roomH){
    const cuts=holesOn(wall,roomH);
    const xs=[0,wall.len];
    cuts.forEach(h=>{xs.push(Math.max(0,h.lo),Math.min(wall.len,h.hi))});
    xs.sort((a,b)=>a-b);
    const uniq=[];
    xs.forEach(x=>{if(!uniq.length||x-uniq[uniq.length-1]>0.015) uniq.push(x)});
    const mat=tiledMat(design.wall,wall.len,roomH);
    for(let i=0;i<uniq.length-1;i++){
      const a=uniq[i],b=uniq[i+1],mid=(a+b)/2;
      const here=cuts.filter(h=>mid>h.lo+0.01&&mid<h.hi-0.01);
      if(!here.length){addWallPiece(group,wall,a,b,0,roomH,mat);continue}
      const ys=[0,roomH];
      here.forEach(h=>ys.push(Math.max(0,h.y0),Math.min(roomH,h.y1)));
      ys.sort((p,q)=>p-q);
      const uy=[];
      ys.forEach(y=>{if(!uy.length||y-uy[uy.length-1]>0.015) uy.push(y)});
      for(let k=0;k<uy.length-1;k++){
        const y0=uy[k],y1=uy[k+1],my=(y0+y1)/2;
        if(here.some(h=>my>h.y0+0.008&&my<h.y1-0.008)) continue;
        addWallPiece(group,wall,a,b,y0,y1,mat);
      }
    }
    cuts.forEach(h=>{
      if(h.kind==='window') addWindowMesh(group,h.frame);
      if(h.kind==='door') addDoorMesh(group,h.frame);
    });
  }
  function addWindowMesh(group,f){
    const len=f.hi-f.lo,height=f.top-f.sill;
    if(len<0.05||height<0.05) return;
    const glassMat=physicalMat({color:0xe4f2f6,metalness:0,roughness:0.04,transmission:0.9,thickness:0.008,ior:1.5,transparent:true,opacity:1,envMapIntensity:1,side:THREE.DoubleSide,depthWrite:false});
    const glass=new THREE.Mesh(new THREE.PlaneGeometry(Math.max(0.05,len-0.06),Math.max(0.05,height-0.06)),glassMat);
    const mid=(f.lo+f.hi)/2;
    glass.position.set(f.wall.a[0]+f.wall.dx*mid+f.wall.nx*0.012,(f.sill+f.top)/2,f.wall.a[1]+f.wall.dz*mid+f.wall.nz*0.012);
    glass.rotation.y=Math.atan2(f.wall.nx,f.wall.nz);
    glass.userData.kind='window-glass';
    group.add(glass);
    const frameMat=new THREE.MeshStandardMaterial({color:0xf7f4ee,roughness:0.45});
    const jamb=(along,y0,y1,span)=>{
      const m=new THREE.Mesh(new THREE.BoxGeometry(0.045,Math.max(0.02,y1-y0),Math.max(0.02,span)),frameMat);
      m.position.set(f.wall.a[0]+f.wall.dx*along+f.wall.nx*0.02,(y0+y1)/2,f.wall.a[1]+f.wall.dz*along+f.wall.nz*0.02);
      m.rotation.y=Math.atan2(f.wall.dx,f.wall.dz);
      m.userData.kind='window-frame';
      group.add(m);
    };
    jamb(f.lo,f.sill,f.top,0.04);
    jamb(f.hi,f.sill,f.top,0.04);
    jamb(mid,f.sill,f.sill+0.04,len);
    jamb(mid,f.top-0.04,f.top,len);
  }
  function addArc(group,hx,hz,radius,a0,delta){
    const segs=16,arr=[];
    for(let i=0;i<segs;i++){
      const a=a0+delta*(i/segs),b=a0+delta*((i+1)/segs);
      arr.push(hx,0.045,hz,hx+Math.sin(a)*radius,0.045,hz+Math.cos(a)*radius,hx+Math.sin(b)*radius,0.045,hz+Math.cos(b)*radius);
    }
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));
    const mesh=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:0x0e7c86,transparent:true,opacity:0.35,side:THREE.DoubleSide,depthWrite:false}));
    mesh.userData.kind='swing';
    group.add(mesh);
  }
  function addDoorMesh(group,f){
    const frameMat=new THREE.MeshStandardMaterial({color:0xf4f1ea,roughness:0.5});
    const leafMat=new THREE.MeshStandardMaterial({color:0xfbf9f6,roughness:0.42});
    const lo=Math.min(f.hingeAlong,f.latchAlong),hi=Math.max(f.hingeAlong,f.latchAlong);
    const jamb=(along,span,y0,y1)=>{
      const m=new THREE.Mesh(new THREE.BoxGeometry(0.05,Math.max(0.02,y1-y0),Math.max(0.02,span)),frameMat);
      m.position.set(f.wall.a[0]+f.ux*along+f.wall.nx*0.025,(y0+y1)/2,f.wall.a[1]+f.uz*along+f.wall.nz*0.025);
      m.rotation.y=Math.atan2(f.ux,f.uz);
      m.castShadow=true;m.userData.kind='door-frame';
      group.add(m);
    };
    jamb(lo,0.045,0,f.height);
    jamb(hi,0.045,0,f.height);
    jamb((lo+hi)/2,f.width,f.height-0.045,f.height);
    if(f.door.swing==='slider'){
      const dir=Math.sign(f.hingeAlong-f.latchAlong)||1;
      const leaf=new THREE.Mesh(new THREE.BoxGeometry(0.04,f.height-0.06,f.width*0.92),leafMat);
      const pocket=f.width*0.55;
      leaf.position.set(f.hx+f.ux*dir*pocket,(f.height-0.06)/2,f.hz+f.uz*dir*pocket);
      leaf.rotation.y=Math.atan2(f.ux,f.uz);
      leaf.castShadow=true;leaf.userData.kind='door-leaf';
      group.add(leaf);
      return;
    }
    const a0=Math.atan2(f.closedX,f.closedZ), a1=Math.atan2(f.swingX,f.swingZ);
    let delta=a1-a0;
    while(delta>Math.PI) delta-=Math.PI*2;
    while(delta<-Math.PI) delta+=Math.PI*2;
    const leaf=new THREE.Mesh(new THREE.BoxGeometry(0.04,f.height-0.08,f.width),leafMat);
    leaf.position.set(0,(f.height-0.08)/2,f.width/2);
    leaf.castShadow=true;
    const pivot=new THREE.Group();
    pivot.position.set(f.hx,0,f.hz);
    pivot.rotation.y=a0+delta*(55/90);
    pivot.add(leaf);
    pivot.userData.kind='door-leaf';
    group.add(pivot);
    addArc(group,f.hx,f.hz,f.width,a0,delta);
  }
  function countKinds(){
    const counts={};
    if(!roomMesh) return counts;
    roomMesh.traverse(o=>{if(o.userData&&o.userData.kind) counts[o.userData.kind]=(counts[o.userData.kind]||0)+1});
    return counts;
  }
  function buildRoom(){
    if(roomMesh){scene.remove(roomMesh);disposeObj(roomMesh);roomMesh=null}
    const room=normRoom(design.room);
    design.room=room;
    const group=new THREE.Group();
    group.userData.kind='room';
    const h=room.h;
    floorRects(room).forEach(rect=>{
      const floor=new THREE.Mesh(new THREE.PlaneGeometry(rect.sx,rect.sz),tiledMat(design.floor,rect.sx,rect.sz));
      floor.rotation.x=-Math.PI/2;
      floor.position.set(rect.x,0.02,rect.z);
      floor.receiveShadow=true;
      const uv=floor.geometry.getAttribute('uv');
      if(uv) floor.geometry.setAttribute('uv2',uv.clone());
      floor.material.aoMap=contactAo();
      floor.material.aoMapIntensity=0.85;
      group.add(floor);
      const ceil=new THREE.Mesh(new THREE.PlaneGeometry(rect.sx,rect.sz),new THREE.MeshStandardMaterial({color:0xf4f1eb,roughness:0.92,side:THREE.BackSide}));
      ceil.rotation.x=-Math.PI/2;
      ceil.position.set(rect.x,h-0.01,rect.z);
      group.add(ceil);
    });
    wallsOf(room).forEach(wall=>addWallWithHoles(group,wall,h));
    roomMesh=group;
    scene.add(group);
    const c=floorCentroid(room);
    const spot=scene.getObjectByName('ceil');
    if(spot){spot.position.set(c.x,h-0.16,c.z);spot.target.position.set(c.x,0,c.z);spot.target.updateMatrixWorld()}
    const key=scene.getObjectByName('key');
    if(key){
      key.position.set(c.x+Math.min(1.8,room.l*0.72),h-0.22,c.z+Math.min(1.6,room.w*0.7));
      key.target.position.set(c.x-0.15,0.12,c.z-0.15);
      key.target.updateMatrixWorld();
      const span=Math.max(room.l,room.w)*0.9+0.8;
      const cam=key.shadow.camera;
      cam.left=-span;cam.right=span;cam.top=span;cam.bottom=-span;
      cam.near=0.05;cam.far=Math.max(8,h+4);
      cam.updateProjectionMatrix();
    }
    const fill=scene.getObjectByName('fill');
    if(fill) fill.position.set(c.x-1.6,h*0.7,c.z-1.2);
    const lamp=scene.getObjectByName('lamp');
    if(lamp) lamp.position.set(c.x,h-0.02,c.z);
    setNum('pl-l',room.l);setNum('pl-w',room.w);setNum('pl-h',room.h);
    if($('pl-shape')&&document.activeElement!==$('pl-shape')) $('pl-shape').value=room.shape;
    if($('pl-shape-more')&&room.shape==='l') $('pl-shape-more').open=true;
    if($('pl-notch')) $('pl-notch').hidden=room.shape!=='l';
    if(room.shape==='l'){setNum('pl-notch-l',room.notchL);setNum('pl-notch-w',room.notchW);if($('pl-notch-corner')&&document.activeElement!==$('pl-notch-corner')) $('pl-notch-corner').value=room.notchCorner}
    const pkgName=(window.BQ&&settings.packages.find(p=>p.id===BQ.quote.packageId)||{}).name||'';
    const loaded=design.preloadStamp&&pkgName?` Loaded with the ${pkgName} products.`:'';
    if($('pl-area')&&document.activeElement&&!$('pl-area').contains(document.activeElement)) $('pl-area').textContent=`Floor area ${designFloorArea().toFixed(2)} m² (synced to quote).${loaded}`;
    if(TILES[design.floor]) $('pl-floor').value=design.floor;
    if(TILES[design.wall]) $('pl-wall').value=design.wall;
    if(METALS[design.metal]) $('pl-metal').value=design.metal;
    if($('pl-stepfree')&&document.activeElement!==$('pl-stepfree')) $('pl-stepfree').checked=!!design.stepFree;
  }

  const M=(c,o={})=>physicalMat(Object.assign({color:c,roughness:0.4,metalness:0,envMapIntensity:0.45},o));
  function box(g,mat,w,h,d,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(Math.max(w,0.01),Math.max(h,0.01),Math.max(d,0.01)),mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;g.add(m);return m}
  function cyl(g,mat,rt,rb,h,x,y,z,seg=20){const m=new THREE.Mesh(new THREE.CylinderGeometry(Math.max(rt,0.005),Math.max(rb,0.005),Math.max(h,0.005),seg),mat);m.position.set(x,y,z);m.castShadow=true;g.add(m);return m}
  function mixer(g,metal,x,y,z){cyl(g,metal,0.022,0.025,0.16,x,y+0.08,z);box(g,metal,0.02,0.02,0.12,x,y+0.15,z+0.06);box(g,metal,0.015,0.05,0.015,x,y+0.19,z-0.01)}
  function makeItem(type){
    const g=new THREE.Group(), spec=ITEMS[type];
    const mt=METALS[design.metal]||METALS.black, metal=M(mt.c,{metalness:mt.m,roughness:mt.r,envMapIntensity:mt.env==null?0.7:mt.env,clearcoat:mt.m>0.95?0.2:0,clearcoatRoughness:0.15}), white=M(0xf7f6f4,{roughness:0.2,clearcoat:0.45,clearcoatRoughness:0.2,envMapIntensity:0.4}), wood=M(design.wood||0xf2f2ef,{roughness:0.58,metalness:0,envMapIntensity:0.28,clearcoat:0.08,clearcoatRoughness:0.55});
    const w=spec.w, d=spec.d, h=spec.h||0.5;
    if(type==='bath'){
      box(g,white,w,h,d,0,h/2,0);
      box(g,M(0xdfe9ee,{roughness:0.1}),Math.max(0.2,w-0.1),0.02,Math.max(0.2,d-0.1),0,h-0.03,0);
      const tx=-w/2+Math.min(0.18,w*0.12);
      cyl(g,metal,0.018,0.018,0.16,tx,h+0.08,-d/2+0.08);
      box(g,metal,0.018,0.018,0.1,tx,h+0.16,-d/2+0.12);
    }
    if(type==='shower'){
      const gh=Math.min(h,(design.room.h||2.4)-0.12);
      const stepFree=!!design.stepFree;
      g.userData.stepFree=stepFree;
      if(stepFree){
        box(g,M(0xeeeeec),w,0.008,d,0,0.006,0);
        const channel=Math.min(0.9,Math.max(0.4,w*0.75));
        box(g,metal,channel,0.012,0.045,0,0.012,-d/2+0.1);
        box(g,metal,w,0.025,0.025,0,gh,-d/2+0.02);
        box(g,metal,0.025,0.025,d,-w/2+0.02,gh,0);
        const cloth=M(0xf3efe6,{roughness:0.92,transparent:true,opacity:0.88});
        box(g,cloth,Math.max(0.2,w-0.08),gh*0.82,0.015,0.04,gh*0.42,d/2-0.03);
        box(g,cloth,0.015,gh*0.82,Math.max(0.2,d*0.72),w/2-0.03,gh*0.42,0.04);
      }else{
        box(g,M(0xeeeeec),w,0.05,d,0,0.025,0);
        const glass=physicalMat({color:0xe7f4f7,metalness:0,roughness:0.04,transmission:0.88,thickness:0.012,ior:1.5,transparent:true,opacity:1,envMapIntensity:1,side:THREE.DoubleSide});
        box(g,glass,w,gh,0.012,0,gh/2,d/2-0.006).castShadow=false;
        const ret=Math.min(d*0.7,0.9);
        box(g,glass,0.012,gh,ret,w/2-0.006,gh/2,d/2-ret/2).castShadow=false;
        box(g,metal,w,0.02,0.02,0,gh,d/2);
        box(g,metal,0.02,gh,0.02,w/2,gh/2,d/2);
      }
      cyl(g,metal,0.09,0.09,0.02,0,gh-0.02,-d/2+Math.min(0.34,d*0.45),24);
      mixer(g,metal,-w/2+0.08,1.05,-d/2+0.02);
    }
    if(type==='vanity'){
      const top=0.85, base=Math.max(0.12, top-h);
      box(g,wood,w,h,d,0,base+h/2,0);
      box(g,M(0xe9e6df,{roughness:0.25}),w+0.02,0.025,d+0.02,0,base+h+0.012,0);
      const br=Math.min(0.22,w*0.22,d*0.42);
      const b=cyl(g,white,br,br*0.8,0.12,0,base+h+0.08,d*0.04,28);b.scale.z=0.75;
      cyl(g,M(0xc9d3d8,{roughness:.3}),br*0.82,br*0.82,0.008,0,base+h+0.145,d*0.04);
      mixer(g,metal,0,base+h+0.03,-d/2+0.06);
    }
    if(type==='toilet'){
      const cisH=Math.min(0.42,h*0.42), cisD=Math.min(0.22,d*0.3);
      box(g,white,Math.min(w+0.02,0.42),cisH,cisD,0,h-cisH/2,-d/2+cisD/2);
      const panH=Math.min(0.44,h*0.5), pr=Math.min(0.2,w*0.48);
      const p=cyl(g,white,pr,pr*0.72,panH,0,panH/2,d*0.05,24);
      p.scale.z=Math.min(1.8,Math.max(1,(d*0.5)/pr));
      const s=cyl(g,white,pr*1.05,pr*1.05,0.028,0,panH+0.02,d*0.05,24);s.scale.z=p.scale.z;
      box(g,metal,0.08,0.012,0.028,0,h-0.015,-d/2+cisD*0.5);
    }
    if(type==='tap'){cyl(g,metal,0.03,0.03,0.02,0,0,-d/2+0.01).rotation.x=Math.PI/2;box(g,metal,0.025,0.025,0.1,0,0,-d/2+0.06);box(g,metal,0.015,0.06,0.015,0,0.05,-d/2+0.03)}
    if(type==='mirror'){
      const depth=Math.max(d||0.03,0.02);
      box(g,metal,w,h,depth,0,h/2,0);
      box(g,M(0xcfdde6,{metalness:0.15,roughness:0.05}),Math.max(0.08,w-0.04),Math.max(0.08,h-0.04),0.008,0,h/2,depth/2+0.004);
    }
    if(type==='grab'){
      box(g,metal,w,0.032,0.032,0,0.02,0);
      box(g,metal,0.032,Math.max(0.2,h),0.032,-w/2+0.02,Math.max(0.2,h)/2,0);
    }
    if(type==='seat'){
      box(g,metal,0.06,0.04,0.08,-w/2+0.02,0.02,0);
      box(g,white,w*0.92,0.035,Math.max(0.32,d*0.9),0.02,0.03,0.02);
      box(g,metal,0.025,0.45,0.025,w*0.28,-0.2,d*0.25);
    }
    if(type==='basin'){
      const bowl=cyl(g,white,Math.min(0.22,w*0.42),Math.min(0.18,w*0.34),Math.max(0.12,h),0,h/2,0.02,28);
      bowl.scale.z=0.8;
      cyl(g,metal,0.018,0.022,0.16,0,-0.06,0.04);
      mixer(g,metal,0,h+0.02,-d*0.2);
    }
    if(type==='rail'){
      if(spec.ring){
        const r=Math.max(0.04,Math.min(w,h)/2);
        const ring=new THREE.Mesh(new THREE.TorusGeometry(r,0.012,10,22),metal);
        ring.castShadow=true;g.add(ring);
        box(g,metal,0.02,0.02,Math.max(d,0.04),0,0,-Math.max(d,0.04)/2);
      }else{
        const span=h||0.6;
        [-w/2+0.03,w/2-0.03].forEach(x=>box(g,metal,0.02,span,0.02,x,span/2,0));
        [span*0.28,span*0.72].forEach(y=>box(g,metal,w,0.016,0.016,0,y,Math.min(d,0.08)));
      }
    }
    return g;
  }
  function footprint(it){const t=ITEMS[it.type];return it.rot%2?[t.d,t.w]:[t.w,t.d]}
  function clampItem(it, opts){
    const room=normRoom(design.room);
    const [fw,fd]=footprint(it), snap=v=>Math.round(v/0.05)*0.05;
    const minX=-room.l/2+fw/2,maxX=room.l/2-fw/2,minZ=-room.w/2+fd/2,maxZ=room.w/2-fd/2;
    it.x=Math.min(maxX,Math.max(minX,snap(Number.isFinite(it.x)?it.x:0)));
    it.z=Math.min(maxZ,Math.max(minZ,snap(Number.isFinite(it.z)?it.z:0)));
    if(fw>room.l) it.x=0;
    if(fd>room.w) it.z=0;
    const poly=roomPolygon(room);
    const fits=()=>footprintCorners(it).every(([x,z])=>{
      const vx=it.x-x,vz=it.z-z,len=Math.hypot(vx,vz)||1;
      return pointInPoly(x+vx/len*0.025,z+vz/len*0.025,poly);
    });
    if(!fits()){
      const ox=it.x,oz=it.z,c=room.notchCorner;
      const ax=(c==='ne'||c==='se')?-1:1, az=(c==='ne'||c==='nw')?1:-1;
      const clampN=(v,a,b)=>Math.min(b,Math.max(a,v));
      let placed=false;
      for(let n=1;n<=30&&!placed;n++){
        const opts=[
          [clampN(ox+ax*0.1*n,minX,maxX), oz],
          [ox, clampN(oz+az*0.1*n,minZ,maxZ)],
          [clampN(ox+ax*0.1*n,minX,maxX), clampN(oz+az*0.1*n,minZ,maxZ)]
        ];
        for(const [x,z] of opts){
          it.x=snap(x);it.z=snap(z);
          if(fits()){placed=true;break}
        }
      }
      if(!placed){it.x=0;it.z=0}
    }
    const beforeX=it.x,beforeZ=it.z;
    if(opts&&opts.magnet===false) {it.x=snap(it.x);it.z=snap(it.z);return}
    wallsOf(room).forEach(wall=>{
      const half=Math.abs(wall.nx)*fw/2+Math.abs(wall.nz)*fd/2;
      const along=(it.x-wall.a[0])*wall.dx+(it.z-wall.a[1])*wall.dz;
      if(along<-0.05||along>wall.len+0.05) return;
      const gap=(it.x-wall.a[0])*wall.nx+(it.z-wall.a[1])*wall.nz-half;
      if(gap>0&&gap<0.15){it.x-=wall.nx*gap;it.z-=wall.nz*gap}
    });
    it.x=snap(it.x);it.z=snap(it.z);
    if(!fits()){it.x=beforeX;it.z=beforeZ}
  }
  function nudgeItem(dx,dz){
    if(!selected) return;
    const x0=selected.x,z0=selected.z;
    selected.x+=dx;selected.z+=dz;
    clampItem(selected,{magnet:false});
    if(itemHitsOpening(selected)){
      selected.x=x0;selected.z=z0;
      setWarn(`${ITEMS[selected.type].name} can't sit in a door opening or swing.`);
    }else refreshWarnings();
    buildItems();
  }
  function disposeGeoms(root){
    const seen=new Set();
    root.traverse(o=>{if(o.geometry&&!seen.has(o.geometry)){seen.add(o.geometry);o.geometry.dispose()}});
  }
  function buildItems(){
    disposeGeoms(itemsGroup);
    itemsGroup.clear();
    design.items.forEach(it=>{const g=makeItem(it.type);g.position.set(it.x,ITEMS[it.type].y,it.z);g.rotation.y=-it.rot*Math.PI/2;if(it.flip) g.scale.x=-1;g.userData.item=it;itemsGroup.add(g)});
    refreshSel();
  }
  function placeSensible(it){
    const room=normRoom(design.room);
    const wallish=it.type==='vanity'||it.type==='basin'||it.type==='mirror'||it.type==='tap'||it.type==='rail'||it.type==='grab';
    const corner=it.type==='shower'||it.type==='seat';
    it.rot=wallish?1:0;
    const [fw,fd]=footprint(it);
    const l=room.l,w=room.w;
    if(corner){it.x=-l/2+fw/2;it.z=-w/2+fd/2}
    else if(it.type==='toilet'||it.type==='bath'){it.x=Math.min(l/2-fw/2,-l/2+fw/2+1.05);it.z=-w/2+fd/2}
    else if(it.type==='rail'||it.type==='grab'){it.x=-l/2+fw/2;it.z=0.15}
    else if(wallish){it.x=l/2-fw/2;it.z=0}
    else{it.x=0;it.z=0}
    clampItem(it);
  }
  function addItem(type){
    snapshot();
    const it={type,x:0,z:0,rot:0,flip:false};
    placeSensible(it);
    if(itemHitsOpening(it)){it.x=0;it.z=0;clampItem(it)}
    design.placedBy='user';design.items.push(it);buildItems();select(it);setTray(false);toast(ITEMS[type].name+' added');
    if(itemHitsOpening(it)) setWarn(`${ITEMS[type].name} sits in a door opening or swing. Move it clear.`);
    else refreshWarnings();
    return it;
  }
  function select(it){selected=it;refreshSel()}
  function refreshSel(){
    const g=itemsGroup.children.find(c=>c.userData.item===selected);
    selHelper.visible=!!g&&!document.body.classList.contains('client')&&!walking;
    if(g) selHelper.setFromObject(g);
    $('pl-sel').textContent=selected?ITEMS[selected.type].name:'none';
    const fabSel=$('pl-fab-sel');
    if(fabSel) fabSel.textContent=selected?ITEMS[selected.type].name+' selected':'Nothing selected';
  }

  const floorPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0),tmp=new THREE.Vector3();
  let pending=null;
  const touchIds=new Set();
  function ndc(e){const r=renderer.domElement.getBoundingClientRect();return new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1)}
  function hitItem(e){
    ray.setFromCamera(ndc(e),camera);
    const hit=ray.intersectObjects(itemsGroup.children,true)[0];
    if(!hit) return null;
    let o=hit.object;
    while(o&&!o.userData.item) o=o.parent;
    return o&&o.userData.item||null;
  }
  function hideMeasure(){const m=$('pl-measure');if(m) m.hidden=true}
  function showMeasure(it){
    const m=$('pl-measure');if(!m||!it) return;
    const room=normRoom(design.room);
    const [fw,fd]=footprint(it);
    const left=(it.x-fw/2)+room.l/2, far=(it.z-fd/2)+room.w/2;
    const fmt=n=>(Math.round(Math.max(0,n)*20)/20).toFixed(2);
    m.textContent=fmt(left)+' m from the left wall · '+fmt(far)+' m from the far wall';
    m.hidden=false;
  }
  function onDown(e){
    if(walking) return;
    touchIds.add(e.pointerId);
    if(touchIds.size>1){pending=null;drag=null;hideMeasure();if(!walking) controls.enabled=true;renderer.domElement.style.touchAction='none';return}
    const it=hitItem(e);
    if(it){
      select(it);
      pending={id:e.pointerId,x:e.clientX,y:e.clientY};
      renderer.domElement.style.touchAction='none';
      try{renderer.domElement.setPointerCapture(e.pointerId)}catch(err){}
      if(e.pointerType!=='touch') controls.enabled=false;
    }else if(e.pointerType!=='touch') select(null);
  }
  function onMove(e){
    if(touchIds.size>1) return;
    if(pending&&e.pointerId===pending.id&&!drag){
      const dx=e.clientX-pending.x, dy=e.clientY-pending.y;
      if(dx*dx+dy*dy<64) return;
      snapshot();
      ray.setFromCamera(ndc(e),camera);
      if(!ray.ray.intersectPlane(floorPlane,tmp)) return;
      drag={id:e.pointerId,dx:selected.x-tmp.x,dz:selected.z-tmp.z,gx:selected.x,gz:selected.z};
      pending=null;
      controls.enabled=false;
    }
    if(!drag||e.pointerId!==drag.id||!selected) return;
    if(e.cancelable) e.preventDefault();
    ray.setFromCamera(ndc(e),camera);
    if(!ray.ray.intersectPlane(floorPlane,tmp)) return;
    selected.x=tmp.x+drag.dx;selected.z=tmp.z+drag.dz;
    clampItem(selected);
    if(itemHitsOpening(selected)){
      selected.x=drag.gx;selected.z=drag.gz;
      setWarn(`${ITEMS[selected.type].name} can't sit in a door opening or swing.`);
    }else{drag.gx=selected.x;drag.gz=selected.z;refreshWarnings();showMeasure(selected)}
    const g=itemsGroup.children.find(c=>c.userData.item===selected);
    if(g){g.position.x=selected.x;g.position.z=selected.z}
    placeFloat();
  }
  function onUp(e){
    touchIds.delete(e.pointerId);
    if(pending&&e.pointerId===pending.id) pending=null;
    if(drag&&(!e||e.pointerId===drag.id)){drag=null;hideMeasure();if(design) design.placedBy='user';if(!walking) controls.enabled=true;refreshWarnings()}
    if(e&&renderer){try{renderer.domElement.releasePointerCapture(e.pointerId)}catch(err){}}
    if(!touchIds.size) renderer.domElement.style.touchAction='pan-y';
  }
  function flipSelected(){
    if(!selected) return;
    snapshot();
    selected.flip=!selected.flip;
    buildItems();
  }
  function duplicateSelected(){
    if(!selected) return;
    snapshot();
    const copy=Object.assign({},selected,{flip:!!selected.flip});
    copy.x+=0.3;
    clampItem(copy);
    if(Math.abs(copy.x-selected.x)<0.05&&Math.abs(copy.z-selected.z)<0.05){copy.z+=0.3;clampItem(copy)}
    design.placedBy='user';
    design.items.push(copy);
    buildItems();
    select(copy);
    toast(ITEMS[copy.type].name+' copied');
  }
  function placeFloat(){
    const bar=$('pl-float');
    if(!bar) return;
    const hide=!selected||walking||document.body.classList.contains('client');
    bar.hidden=hide;
    if(hide||!renderer) return;
    const g=itemsGroup&&itemsGroup.children.find(c=>c.userData.item===selected);
    if(!g){bar.hidden=true;return}
    const stageEl=$('pl-stage');
    const stage=stageEl.getBoundingClientRect();
    bar.style.maxHeight='';
    bar.style.left='8px';
    bar.style.right='8px';
    const bh=bar.offsetHeight||56;
    const overlay=stageEl.querySelector('.pl-overlay');
    let limit=8;
    if(overlay){
      const ob=overlay.getBoundingClientRect();
      if(ob.width>0&&ob.height>0) limit=ob.bottom-stage.top+8;
    }
    let top=Math.max(limit, stage.height-bh-8);
    const mid=stage.height/2;
    if(top<mid && top+bh>mid) top=mid;
    if(top+bh>stage.height-4) top=Math.max(8, stage.height-bh-8);
    bar.style.top=Math.round(top)+'px';
  }
  function suggestLayout(){
    if(!design) return;
    snapshot();
    const pkgId=window.BQ&&BQ.quote&&BQ.quote.packageId;
    let items=pkgId?layoutForPackage(pkgId):[];
    if(!items.length){
      items=['shower','toilet','vanity','mirror'].map(type=>{
        const it={type,x:0,z:0,rot:0,flip:false};
        placeSensible(it);
        return it;
      });
    }
    design.items=items;
    design.placedBy='suggest';
    select(items[0]||null);
    buildItems();
    toast('Layout suggested');
  }
  async function deleteSelected(){
    if(!selected){setWarn('Tap an item first, then Delete.');return}
    const name=ITEMS[selected.type].name;
    if(!await ask('Remove the '+name+'? The rest of the room stays.','Remove')) return;
    if(!selected) return;
    snapshot();
    design.placedBy='user';
    design.items.splice(design.items.indexOf(selected),1);
    select(null);buildItems();
  }
  async function clearAll(){
    if(!design||!design.items.length){setWarn('There are no fixtures to clear.');return}
    if(!await ask('Clear all removes every fixture. Doors and windows stay. This is not Delete.','Clear all')) return;
    snapshot();
    design.placedBy='user';design.items=[];select(null);buildItems();
  }

  const FINISH={black:'matte black',chrome:'polished chrome',copper:'brushed copper',brass:'brushed brass',bronze:'brushed bronze'};
  const FIXTURE_CAT={vanity:['vanity'],toilet:['toilet_suite'],shower:['shower_screen','shower_curtain'],bath:['bath'],mirror:['mirror_cabinet','mirror'],rail:['towel_rail'],tap:['basin_mixer','shower_mixer'],grab:['grab_rail'],seat:['shower_seat'],basin:['wall_basin']};
  let renderState={busy:false,blob:null,dataUrl:'',seed:null};
  let renderForQuote=null;

  function productFor(type,pkg){
    const cats=FIXTURE_CAT[type]||[];
    if(!pkg) return null;
    for(const c of cats){const hit=pkg.items.find(i=>i.category===c);if(hit) return hit}
    return null;
  }
  function tileBit(tile){
    if(!tile) return '';
    const size=String(tile.size_mm||'').replace(/x/ig,'×');
    return `${tile.name} (${tile.code}), ${size} mm, ${(tile.finish||'standard').toLowerCase()} finish`;
  }
  function where(it){
    const nx=design.room.l?it.x/(design.room.l/2):0;
    const nz=design.room.w?it.z/(design.room.w/2):0;
    const side=nx<-0.28?'the left side':nx>0.28?'the right side':'the centre';
    const place=side==='the centre'?`in ${side}`:`on ${side}`;
    if(nz<-0.28) return `${place}, against the far wall`;
    if(nz>0.28) return `${place}, toward the near wall`;
    return `${place}, in the middle of the room`;
  }
  function shapeSentence(){
    const r=normRoom(design.room);
    if(r.shape!=='l') return `Rectangular room ${r.l.toFixed(2)} m long, ${r.w.toFixed(2)} m wide, ${r.h.toFixed(2)} m ceiling.`;
    const corner={nw:'far-left',ne:'far-right',sw:'near-left',se:'near-right'}[r.notchCorner]||'corner';
    return `L-shaped room, overall ${r.l.toFixed(2)} m by ${r.w.toFixed(2)} m, ceiling ${r.h.toFixed(2)} m, with a ${r.notchL.toFixed(2)} m by ${r.notchW.toFixed(2)} m notch in the ${corner} corner. True floor area ${designFloorArea().toFixed(2)} square metres.`;
  }
  function openingSentence(){
    const walls=wallsOf(normRoom(design.room));
    const name=id=>{const w=walls.find(x=>x.id===id);return w?wallLabel(w).toLowerCase():'wall'};
    const bits=[];
    (design.doors||[]).forEach(d=>{
      const how=d.swing==='slider'?'cavity slider':`${d.hinge==='right'?'right':'left'}-hand hinge, swings ${d.swing==='out'?'out':'in'}`;
      bits.push(`a ${d.widthMm} mm door on the ${name(d.wall)}, ${how}`);
    });
    (design.windows||[]).forEach(w=>bits.push(`a window ${w.widthMm} mm wide and ${Number(w.heightM).toFixed(2)} m high on the ${name(w.wall)}, sill at ${Number(w.sillM).toFixed(2)} m`));
    return bits.length?`Openings: ${bits.join('; ')}.`:'';
  }
  function buildRenderPrompt(){
    if(!design) return '';
    const q=BQ.quote;
    const pkg=catalogue&&q?catalogue.packages.find(p=>p.id===q.packageId):null;
    const look=window.LOOKS[design.look];
    const lookName=(pkg&&design.look===pkg.id)?(settings.packages.find(p=>p.id===pkg.id)||pkg).name:(look?look.name:(pkg?pkg.name:'Custom'));
    const finish=FINISH[design.metal]||'mixed metal';
    const {l,w,h}=design.room;
    const floor=pkg&&pkg.tiles.find(t=>t.role==='floor');
    const wall=pkg&&pkg.tiles.find(t=>t.role==='wall');
    const feature=pkg&&pkg.tiles.find(t=>t.role==='feature');
    const light=document.body.classList.contains('client')
      ?'Warm flattering client-presentation light, soft daylight and gentle ceiling spots.'
      :'Soft natural daylight from a side window and warm white recessed ceiling downlights.';
    const parts=[
      'Photorealistic interior photograph of a renovated bathroom, 24mm lens at eye level, realistic grout and metal, no people, no text, no logo.',
      light,
      `${lookName} style.`,
      shapeSentence(),
      openingSentence(),
      floor?`Floor tiles: ${tileBit(floor)}, laid straight.`:(TILES[design.floor]?`Floor: ${TILES[design.floor].name}.`:''),
      wall?`Wall tiles: ${tileBit(wall)}, tiled to about 2.1 m.`:(TILES[design.wall]?`Walls: ${TILES[design.wall].name}.`:''),
      feature?`Feature wall accent, about 2.5 square metres: ${tileBit(feature)}.`:'',
      `Tapware, shower hardware and metal accessories are ${finish}.`,
      design.stepFree?'Step-free shower with no hob, a linear floor channel and a curtain instead of a glass screen.':''
    ];
    const items=design.items||[];
    if(!items.length) parts.push('No fixtures are placed yet. Show the tiled room shell in this finish, uncluttered and ready to furnish.');
    else{
      parts.push('Placed fixtures:');
      items.forEach(it=>{
        const spec=ITEMS[it.type];
        if(!spec) return;
        const product=productFor(it.type,pkg);
        const dims=`about ${Math.round(spec.w*1000)} by ${Math.round((spec.y>0?spec.h:spec.d)*1000)} mm`;
        const named=product?product.name:spec.name;
        const colour=product&&product.colour?product.colour:'';
        let finishBit;
        if(it.type==='shower'&&design.stepFree) finishBit='curtain and linear drain, no glass screen';
        else if(it.type==='tap'||it.type==='rail'||it.type==='shower'||it.type==='grab') finishBit=`${finish} finish`;
        else if(it.type==='seat') finishBit='fold-down seat';
        else if(it.type==='basin') finishBit=`wall-hung basin${colour?', '+colour:''}`;
        else if(it.type==='vanity') finishBit=`${colour?colour+', ':''}with ${finish} tapware`;
        else finishBit=colour;
        const turned=it.rot?`, turned ${it.rot*90} degrees`: '';
        parts.push(`${spec.name}: ${named}, ${dims}${finishBit?', '+finishBit:''}, ${where(it)}${turned}.`);
      });
    }
    let prompt=parts.filter(Boolean).join(' ');
    if(prompt.length>1500) prompt=prompt.slice(0,1497).replace(/\s+\S*$/, '')+'.';
    return prompt;
  }
  function setRenderStatus(msg,kind){
    ['pl-render-status','pl-fab-status'].forEach(id=>{
      const el=$(id);if(!el) return;
      el.textContent=msg||'';
      el.classList.toggle('is-error',kind==='error');
    });
  }
  function paintRenderButton(){
    const b=$('pl-fab-render');
    if(!b) return;
    b.textContent=renderState.busy?'Cancel':(renderState.failed||renderState.dataUrl?'Try again':'Render');
  }
  function setRenderBusy(on){
    $('pl-render').setAttribute('aria-busy',on?'true':'false');
    $('pl-render-loading').hidden=!on;
    $('pl-ai').disabled=on;
    $('pl-ai-card').disabled=on;
    $('pl-ai-again').disabled=on;
    paintRenderButton();
  }
  function updateRenderActions(){
    const has=!!renderState.dataUrl;
    $('pl-ai-again').hidden=true;
    $('pl-ai-save').hidden=!has;
    $('pl-ai-quote').hidden=!has;
    paintRenderButton();
    const onQuote=!!(BQ.quote&&BQ.quote.render&&BQ.quote.render.dataUrl&&BQ.quote.render.seed===renderState.seed);
    $('pl-ai-quote').textContent=onQuote?'Remove from quote':'Add to quote';
  }
  function blobToDataURL(blob){
    return new Promise((resolve,reject)=>{
      const r=new FileReader();
      r.onload=()=>resolve(r.result);
      r.onerror=()=>reject(new Error('Could not read the render. Please try again.'));
      r.readAsDataURL(blob);
    });
  }
  function syncRenderFromQuote(){
    const q=BQ.quote;
    if(!q||renderState.busy) return;
    if(renderForQuote===q.id){updateRenderActions();return}
    renderForQuote=q.id;
    const saved=q.render;
    if(saved&&saved.dataUrl){
      renderState={busy:false,blob:null,dataUrl:saved.dataUrl,seed:saved.seed};
      $('pl-render-img').src=saved.dataUrl;
      $('pl-render-view').hidden=false;
    }else{
      renderState={busy:false,blob:null,dataUrl:'',seed:null};
      $('pl-render-view').hidden=true;
      $('pl-render-img').removeAttribute('src');
    }
    setRenderStatus('','');
    updateRenderActions();
  }
  let renderSlowTimer=null;
  async function runRender(){
    if(renderState.busy){RenderService.cancel();return}
    if(!BQ.quote) return;
    if(typeof setFlow==='function') setFlow('render');
    if(!design) ensureDesign();
    const seed=Math.floor(Math.random()*1e9);
    const prompt=buildRenderPrompt();
    const quoteId=BQ.quote.id;
    renderState.busy=true;
    renderState.failed=false;
    setRenderBusy(true);
    setRenderStatus('Generating with Pollinations. This can take up to a minute. Tap Cancel to stop.','');
    clearTimeout(renderSlowTimer);
    renderSlowTimer=setTimeout(()=>{
      if(!renderState.busy) return;
      setRenderStatus('Still working. It stops after up to a minute if no picture comes back. Tap Cancel to stop.','');
    },15000);
    try{
      const {blob,mediaType}=await RenderService.generate({prompt,seed});
      if(!BQ.quote||BQ.quote.id!==quoteId){renderState.busy=false;renderForQuote=null;syncRenderFromQuote()}
      else{
      const dataUrl=await blobToDataURL(blob);
      renderState={busy:false,failed:false,blob,dataUrl,seed,mediaType,prompt};
      $('pl-render-img').src=dataUrl;
      $('pl-render-view').hidden=false;
      setRenderStatus('Render ready. It is an AI illustration and may not match the layout.','');
      }
    }catch(err){
      renderState.busy=false;
      if(err&&err.code==='cancel'){
        renderState.failed=false;
        setRenderStatus('','');
        clearTimeout(renderSlowTimer);
        setRenderBusy(false);
        updateRenderActions();
        return;
      }
      renderState.failed=true;
      const known=err&&(err.code==='timeout'||err.code==='network'||err.code==='http'||err.code==='type');
      const msg=known&&err.message?err.message:'Pollinations is down or the render failed. Tap Render to try again.';
      setRenderStatus(msg,'error');
    }
    clearTimeout(renderSlowTimer);
    setRenderBusy(false);
    updateRenderActions();
  }
  function saveRender(){
    if(!renderState.dataUrl&&!renderState.blob) return;
    const ext=/png/i.test(renderState.mediaType||'')?'png':'jpg';
    const a=document.createElement('a');
    const url=renderState.blob?URL.createObjectURL(renderState.blob):renderState.dataUrl;
    a.href=url;a.download=`bathroom-render-${renderState.seed||'image'}.${ext}`;
    document.body.appendChild(a);a.click();a.remove();
    if(renderState.blob) setTimeout(()=>URL.revokeObjectURL(url),1500);
  }
  function toggleQuoteRender(){
    const q=BQ.quote;
    if(!q||!renderState.dataUrl) return;
    const same=q.render&&q.render.seed===renderState.seed&&q.render.dataUrl;
    q.render=same?null:{dataUrl:renderState.dataUrl,seed:renderState.seed};
    updateRenderActions();
    setRenderStatus(q.render?'Added to the printed quote.':'Removed from the printed quote.','');
    if(typeof update==='function') update();
  }

  function basePixelRatio(){
    const dpr=window.devicePixelRatio||1;
    const small=Math.min(window.innerWidth,window.innerHeight)<=900;
    return Math.min(small?1.5:2,Math.max(1,dpr));
  }
  function useTouchWalk(){
    return window.matchMedia('(pointer: coarse)').matches||window.innerWidth<=860;
  }
  function eyeHeight(){
    const h=design&&design.room?design.room.h:2.4;
    return Math.min(1.65,Math.max(1.2,h-0.3));
  }
  function blocked(x,z){
    if(!design) return true;
    if(!insideRoom(x,z,PLAYER_R)) return true;
    for(const it of design.items){
      const spec=ITEMS[it.type];if(!spec) continue;
      const [fw,fd]=footprint(it);
      if(Math.abs(x-it.x)<fw/2+PLAYER_R&&Math.abs(z-it.z)<fd/2+PLAYER_R) return true;
    }
    return false;
  }
  function tryMove(nx,nz){
    if(!blocked(nx,nz)){player.x=nx;player.z=nz;return}
    if(!blocked(nx,player.z)){player.x=nx;return}
    if(!blocked(player.x,nz)) player.z=nz;
  }
  function applyWalkCamera(){
    camera.up.set(0,1,0);
    camera.position.set(player.x,eyeHeight(),player.z);
    camera.rotation.order='YXZ';
    camera.rotation.y=player.yaw;
    camera.rotation.x=player.pitch;
    camera.rotation.z=0;
  }
  function placeAtDoor(){
    const {l,w}=design.room;
    const z=w/2-0.45;
    const spots=[0];
    for(let s=0.2;s<l/2;s+=0.2) spots.push(s,-s);
    for(const x of spots){
      if(!blocked(x,z)){player.x=x;player.z=z;player.yaw=0;player.pitch=-0.22;return}
    }
    player.x=0;player.z=0;player.yaw=0;player.pitch=-0.22;
  }
  function setWalkUI(on){
    $('pl-walk').hidden=on;
    $('pl-walk').setAttribute('aria-pressed',on?'true':'false');
    if($('pl-plan')) $('pl-plan').hidden=on;
    $('pl-client').hidden=on;
    $('pl-png').hidden=on;
    $('pl-ai').hidden=on;
    $('pl-walk-exit').hidden=!on;
    $('pl-walk-reset').hidden=!on;
    $('pl-joy').hidden=!on||!useTouchWalk();
    const help=$('pl-walk-help');
    help.hidden=!on;
    help.textContent=on?(useTouchWalk()?'Drag to look. Use the stick to walk.':'Click to look. WASD or arrows to walk. Esc releases the mouse.'):'';
  }
  function enterWalk(){
    if(!window.BQ||!BQ.quote) return;
    if(!inited) init();
    if(!design) ensureDesign();
    if(walking||!design) return;
    savedView={pos:camera.position.clone(),target:controls.target.clone(),fov:camera.fov,tone:renderer.toneMapping,exp:renderer.toneMappingExposure,bg:scene.background.clone()};
    walking=true;
    controls.enabled=false;
    if(drag) drag=null;
    select(null);
    placeAtDoor();
    camera.fov=70;
    camera.updateProjectionMatrix();
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=0.85;
    scene.background=new THREE.Color(0xe6e0d6);
    document.body.classList.add('walking');
    setWalkUI(true);
    applyWalkCamera();
    resize();
  }
  function exitWalk(){
    if(!walking) return;
    walking=false;
    held.w=held.a=held.s=held.d=false;
    joy.on=false;joy.dx=0;joy.dy=0;
    const knob=$('pl-joy-knob');if(knob) knob.style.transform='';
    if(document.pointerLockElement) document.exitPointerLock();
    document.body.classList.remove('walking');
    setWalkUI(false);
    if(savedView){
      camera.position.copy(savedView.pos);
      controls.target.copy(savedView.target);
      camera.fov=savedView.fov;
      camera.updateProjectionMatrix();
      renderer.toneMapping=savedView.tone;
      renderer.toneMappingExposure=savedView.exp;
      scene.background=savedView.bg;
    }
    controls.enabled=true;
    controls.maxPolarAngle=planOn?0.4:Math.PI*0.49;
    controls.update();
    resize();
  }
  function setPlan(on){
    if(!design) return;
    if(on&&walking) exitWalk();
    planOn=!!on;
    if($('pl-plan')) $('pl-plan').setAttribute('aria-pressed',planOn?'true':'false');
    if(!controls) return;
    if(planOn){
      controls.maxPolarAngle=0.4;
      const span=Math.max(design.room.l,design.room.w,2);
      camera.position.set(0,span*1.5,0.01);
      controls.target.set(0,0,0);
    }else{
      controls.maxPolarAngle=Math.PI*0.49;
      camera.position.set(3.2,3.6,4.2);
      controls.target.set(0,0.9,0);
    }
    controls.update();
  }
  function lookHere(){
    if(!walking) return;
    const dx=-player.x,dz=-player.z;
    player.yaw=Math.hypot(dx,dz)<0.15?0:Math.atan2(-dx,-dz);
    player.pitch=-0.22;
    applyWalkCamera();
  }
  function pushOut(){
    if(!blocked(player.x,player.z)) return;
    for(let r=0.05;r<=1.4;r+=0.05){
      for(let a=0;a<12;a++){
        const t=a/12*Math.PI*2,x=player.x+Math.cos(t)*r,z=player.z+Math.sin(t)*r;
        if(!blocked(x,z)){player.x=x;player.z=z;return}
      }
    }
  }
  function stepWalk(dt){
    pushOut();
    let f=0,s=0;
    if(held.w) f+=1;
    if(held.s) f-=1;
    if(held.d) s+=1;
    if(held.a) s-=1;
    if(joy.on){
      const mag=Math.hypot(joy.dx,joy.dy);
      if(mag>0.12){s+=joy.dx;f+=-joy.dy}
    }
    const mag=Math.hypot(f,s);
    if(mag>0){
      f/=mag;s/=mag;
      const yaw=player.yaw,speed=1.2*dt;
      tryMove(player.x+(-Math.sin(yaw)*f+Math.cos(yaw)*s)*speed,player.z+(-Math.cos(yaw)*f-Math.sin(yaw)*s)*speed);
    }
    applyWalkCamera();
    adaptAcc+=dt;adaptN++;
    if(adaptN>=24){
      const avg=adaptAcc/adaptN;adaptAcc=0;adaptN=0;
      if(avg>1/28&&pixelRatio>1){pixelRatio=Math.max(1,Math.round((pixelRatio-0.25)*100)/100);resize()}
    }
  }
  function bindWalkInput(){
    const el=$('pl-joy'),knob=$('pl-joy-knob'),maxR=34;
    function setKnob(dx,dy){
      const dist=Math.hypot(dx,dy)||1,k=Math.min(1,maxR/dist),x=dx*k,y=dy*k;
      knob.style.transform=`translate(${x}px,${y}px)`;
      joy.dx=(dx/dist)*Math.min(dist,maxR)/maxR;joy.dy=(dy/dist)*Math.min(dist,maxR)/maxR;
    }
    el.addEventListener('pointerdown',e=>{
      if(!walking) return;
      joy.on=true;joy.id=e.pointerId;el.setPointerCapture(e.pointerId);
      const r=el.getBoundingClientRect();
      setKnob(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2));
      e.preventDefault();e.stopPropagation();
    });
    el.addEventListener('pointermove',e=>{
      if(!joy.on||e.pointerId!==joy.id) return;
      const r=el.getBoundingClientRect();
      setKnob(e.clientX-(r.left+r.width/2),e.clientY-(r.top+r.height/2));
    });
    function endJoy(e){if(e.pointerId!==joy.id) return;joy.on=false;joy.dx=0;joy.dy=0;joy.id=null;knob.style.transform=''}
    el.addEventListener('pointerup',endJoy);el.addEventListener('pointercancel',endJoy);
    const canvas=renderer.domElement;
    canvas.addEventListener('pointerdown',e=>{
      if(!walking) return;
      if(useTouchWalk()){
        lookPtr.on=true;lookPtr.id=e.pointerId;lookPtr.x=e.clientX;lookPtr.y=e.clientY;
        canvas.setPointerCapture(e.pointerId);
      }else if(document.pointerLockElement!==canvas) canvas.requestPointerLock();
    });
    canvas.addEventListener('pointermove',e=>{
      if(!walking||!lookPtr.on||e.pointerId!==lookPtr.id) return;
      player.yaw-=(e.clientX-lookPtr.x)*0.005;
      player.pitch-=(e.clientY-lookPtr.y)*0.004;
      player.pitch=Math.max(-1.15,Math.min(1.15,player.pitch));
      lookPtr.x=e.clientX;lookPtr.y=e.clientY;
    });
    function endLook(e){if(e.pointerId===lookPtr.id) lookPtr.on=false}
    canvas.addEventListener('pointerup',endLook);canvas.addEventListener('pointercancel',endLook);
    document.addEventListener('mousemove',e=>{
      if(!walking||document.pointerLockElement!==canvas) return;
      player.yaw-=e.movementX*0.0022;
      player.pitch-=e.movementY*0.0022;
      player.pitch=Math.max(-1.15,Math.min(1.15,player.pitch));
    });
    window.addEventListener('keydown',e=>{
      if(!walking) return;
      const tag=e.target&&e.target.tagName;
      if(tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT') return;
      const k=e.key.toLowerCase();
      if(k==='w'||k==='arrowup'){held.w=true;e.preventDefault()}
      else if(k==='a'||k==='arrowleft'){held.a=true;e.preventDefault()}
      else if(k==='s'||k==='arrowdown'){held.s=true;e.preventDefault()}
      else if(k==='d'||k==='arrowright'){held.d=true;e.preventDefault()}
    });
    window.addEventListener('keyup',e=>{
      const k=e.key.toLowerCase();
      if(k==='w'||k==='arrowup') held.w=false;
      else if(k==='a'||k==='arrowleft') held.a=false;
      else if(k==='s'||k==='arrowdown') held.s=false;
      else if(k==='d'||k==='arrowright') held.d=false;
    });
    window.addEventListener('blur',()=>{held.w=held.a=held.s=held.d=false});
  }
  function getWalk(){
    return {walking,x:player.x,z:player.z,yaw:player.yaw,pitch:player.pitch,eye:camera?camera.position.y:0,ratio:renderer?renderer.getPixelRatio():0,fov:camera?camera.fov:0};
  }

  function applyLook(key, opts){
    const L=LOOKS[key];if(!L||!design) return;
    const changing=design.look!==key;
    Object.assign(design,{floor:L.floor,wall:L.wall,metal:L.metal,wood:L.wood,look:key});
    if(changing) design.stepFree=key==='accessible-care';
    sizeFromPackage(key);
    design.items.forEach(clampItem);
    if(inited && !(opts&&opts.silent)){$('pl-look').value=key;buildRoom();buildItems()}
  }
  function wantsBath(){
    return (BQ.quote.picks||[]).some(p=>String(p.id).startsWith('bath_'));
  }
  const FIXTURE_TYPE={vanity:'vanity',toilet_suite:'toilet',shower_screen:'shower',shower_curtain:'shower',mirror:'mirror',mirror_cabinet:'mirror',towel_rail:'rail',basin_mixer:'tap',bath:'bath',wall_basin:'basin',grab_rail:'grab',shower_seat:'seat'};
  function layoutForPackage(pkgId){
    const pkg=(window.BQ&&BQ.catalogue)?BQ.catalogue.packages.find(p=>p.id===pkgId):null;
    if(!pkg||!design) return [];
    const types=[];
    for(const item of pkg.items){
      if(item.optional && !(item.category==='bath' && wantsBath())) continue;
      const type=FIXTURE_TYPE[item.category];
      if(type && !types.includes(type)) types.push(type);
    }
    const {l,w}=design.room;
    const spots={
      shower:{x:-l/2,z:-w/2,rot:0},
      toilet:{x:l*0.15,z:-w/2,rot:0},
      vanity:{x:l/2,z:0,rot:1},
      mirror:{x:l/2,z:0,rot:1},
      tap:{x:l/2,z:0.2,rot:1},
      rail:{x:-l/2,z:0.15,rot:1},
      grab:{x:-l/2,z:0,rot:1},
      seat:{x:-l/2,z:-w/2+0.55,rot:1},
      basin:{x:l/2,z:0.15,rot:1},
      bath:{x:0,z:0,rot:0}
    };
    return types.map(type=>{
      const spot=spots[type]||{x:0,z:0,rot:0};
      const it={type,x:spot.x,z:spot.z,rot:spot.rot};
      clampItem(it);
      return it;
    });
  }
  function applyQuoteRoom(r){
    r=r||{};
    if(!design) return;
    if(r.mode==='l'&&+r.length>0&&+r.width>0){
      design.room.shape='l';
      design.room.l=+r.length;design.room.w=+r.width;
      if(r.notchL!==''&&r.notchL!=null) design.room.notchL=+r.notchL;
      if(r.notchW!==''&&r.notchW!=null) design.room.notchW=+r.notchW;
      if(r.notchCorner) design.room.notchCorner=r.notchCorner;
    }else if(r.mode==='lw'&&+r.length>0&&+r.width>0){
      design.room.shape='rect';
      design.room.l=+r.length;design.room.w=+r.width;
    }else if(+r.area>0&&r.mode!=='l'){
      const w=Math.sqrt(+r.area/1.25);
      design.room.shape='rect';
      design.room.w=Calc.round(Math.max(1,w));
      design.room.l=Calc.round(Math.max(1,+r.area/design.room.w));
    }
    design.room=normRoom(design.room);
    clampOpenings();
  }
  function applyRoomSize(){
    if(!design) return;
    const l=+$('pl-l').value,w=+$('pl-w').value,h=+$('pl-h').value;
    if(!(l>=1&&w>=1&&h>=2)) return;
    design.room.l=l;design.room.w=w;design.room.h=h;
    design.room.shape=$('pl-shape').value==='l'?'l':'rect';
    if(design.room.shape==='l'){
      design.room.notchL=$('pl-notch-l').value;
      design.room.notchW=$('pl-notch-w').value;
      design.room.notchCorner=$('pl-notch-corner').value||'ne';
    }
    design.room=normRoom(design.room);
    clampOpenings();
    design.items.forEach(clampItem);
    buildRoom();buildItems();
    if(!$('pl-openings').contains(document.activeElement)) renderOpenings();
    syncToQuote();
    refreshWarnings();
  }
  function wallOptions(selected){
    return wallsOf(normRoom(design.room)).map(w=>`<option value="${w.id}"${w.id===selected?' selected':''}>${esc(wallLabel(w))} (${w.len.toFixed(2)} m)</option>`).join('');
  }
  function widthOptions(mm){
    const presets=[720,770,820,870];
    const custom=!presets.includes(+mm);
    return presets.map(n=>`<option value="${n}"${+mm===n?' selected':''}>${n} mm</option>`).join('')+`<option value="custom"${custom?' selected':''}>Custom</option>`;
  }
  function renderOpenings(){
    if(!design||!$('pl-openings')) return;
    const doors=(design.doors||[]).map(d=>{
      const custom=![720,770,820,870].includes(+d.widthMm);
      return `<div class="open-card" data-door="${esc(d.id)}"><div class="row"><div><label>Wall<select data-f="wall">${wallOptions(d.wall)}</select></label></div><div><label>Width<select data-f="widthMm">${widthOptions(d.widthMm)}</select></label></div></div><div data-custom ${custom?'':'hidden'}><label>Custom width (mm)<input data-f="customMm" type="number" min="450" max="2000" step="10" value="${esc(d.widthMm)}"></label></div><label>Position along the wall (m)<input data-f="offset" type="number" min="0" step="0.05" value="${esc(d.offset)}"></label><div class="row"><div><label>Hinge<select data-f="hinge"${d.swing==='slider'?' disabled':''}><option value="left"${d.hinge!=='right'?' selected':''}>Left</option><option value="right"${d.hinge==='right'?' selected':''}>Right</option></select></label></div><div><label>Swing<select data-f="swing"><option value="in"${d.swing!=='out'&&d.swing!=='slider'?' selected':''}>Into the room</option><option value="out"${d.swing==='out'?' selected':''}>Out of the room</option><option value="slider"${d.swing==='slider'?' selected':''}>Cavity slider</option></select></label></div></div><button class="btn del sm" type="button" data-del-door="${esc(d.id)}">Remove door</button></div>`;
    }).join('');
    const windows=(design.windows||[]).map(w=>`<div class="open-card" data-window="${esc(w.id)}"><div class="row"><div><label>Wall<select data-f="wall">${wallOptions(w.wall)}</select></label></div><div><label>Width (mm)<input data-f="widthMm" type="number" min="300" max="2400" step="10" value="${esc(w.widthMm)}"></label></div></div><div class="row"><div><label>Height (m)<input data-f="heightM" type="number" min="0.3" max="2" step="0.05" value="${esc(w.heightM)}"></label></div><div><label>Sill height (m)<input data-f="sillM" type="number" min="0.2" max="2" step="0.05" value="${esc(w.sillM)}"></label></div></div><label>Position along the wall (m)<input data-f="offset" type="number" min="0" step="0.05" value="${esc(w.offset)}"></label><button class="btn del sm" type="button" data-del-window="${esc(w.id)}">Remove window</button></div>`).join('');
    $('pl-openings').innerHTML=`<h2 style="margin-top:14px">Doors</h2><p class="hint">Hinge left or right is as you stand inside, looking at the wall. A swing door is 2040 mm high. A cavity slider has no swing arc.</p>${doors||'<p class="hint">No doors yet. Add one and it shows on the plan.</p>'}<button class="btn sec" type="button" id="pl-add-door">Add door</button><h2 style="margin-top:14px">Windows</h2>${windows||'<p class="hint">No windows yet. Add one and it shows on the plan.</p>'}<button class="btn sec" type="button" id="pl-add-window">Add window</button><p id="pl-warn" class="hint" role="status"></p>`;
    refreshWarnings();
  }
  function addDoor(){
    const walls=wallsOf(normRoom(design.room));
    const wall=walls.find(w=>w.id==='s')||walls[0];
    if(!wall) return;
    design.doors=design.doors||[];
    design.doors.push({id:uid(),wall:wall.id,offset:Calc.round(wall.len/2),widthMm:820,hinge:'left',swing:'in'});
    clampOpenings();renderOpenings();buildRoom();refreshWarnings();toast('Door added');
  }
  function addWindow(){
    const walls=wallsOf(normRoom(design.room));
    const wall=walls.find(w=>w.id==='n')||walls[0];
    if(!wall) return;
    design.windows=design.windows||[];
    design.windows.push({id:uid(),wall:wall.id,offset:Calc.round(wall.len/2),widthMm:900,heightM:0.6,sillM:1.2});
    clampOpenings();renderOpenings();buildRoom();refreshWarnings();toast('Window added');
  }
  function onOpeningEdit(e){
    const card=e.target.closest&&e.target.closest('[data-door],[data-window]');
    if(!card||!e.target.dataset||!e.target.dataset.f||!design) return;
    snapshot();
    const item=(card.hasAttribute('data-door')?design.doors:design.windows).find(d=>d.id===(card.dataset.door||card.dataset.window));
    if(!item) return;
    const f=e.target.dataset.f;
    if(f==='widthMm'&&e.target.tagName==='SELECT'){
      const box=card.querySelector('[data-custom]');
      if(e.target.value==='custom'){item.widthMm=+(card.querySelector('[data-f=customMm]')||{}).value||item.widthMm;if(box) box.hidden=false}
      else{item.widthMm=+e.target.value;if(box) box.hidden=true}
    }else if(f==='customMm') item.widthMm=+e.target.value||item.widthMm;
    else if(f==='offset'||f==='heightM'||f==='sillM'||f==='widthMm') item[f]=+e.target.value;
    else item[f]=e.target.value;
    clampOpenings();
    if(f==='swing'){const hinge=card.querySelector('[data-f=hinge]');if(hinge) hinge.disabled=item.swing==='slider'}
    buildRoom();buildItems();refreshWarnings();
  }
  function onOpeningClick(e){
    if(!design) return;
    const hit=e.target.id==='pl-add-door'||e.target.id==='pl-add-window'||e.target.dataset.delDoor||e.target.dataset.delWindow;
    if(hit) snapshot();
    if(e.target.id==='pl-add-door') addDoor();
    else if(e.target.id==='pl-add-window') addWindow();
    else if(e.target.dataset.delDoor){design.doors=design.doors.filter(d=>d.id!==e.target.dataset.delDoor);renderOpenings();buildRoom();refreshWarnings()}
    else if(e.target.dataset.delWindow){design.windows=design.windows.filter(d=>d.id!==e.target.dataset.delWindow);renderOpenings();buildRoom();refreshWarnings()}
  }
  function preloadFromQuote(){
    if(!window.BQ||!BQ.quote) return null;
    ensureDesign();
    applyQuoteRoom(BQ.quote.room||{});
    const q=BQ.quote;
    const pkg=settings.packages.find(p=>p.id===q.packageId);
    if(pkg&&pkg.look) applyLook(pkg.look,{silent:true});
    else sizeFromPackage(q.packageId);
    const stamp=(q.packageId||'')+'|'+(wantsBath()?'bath':'room');
    if(design.placedBy!=='user' && design.preloadStamp!==stamp){
      design.items=layoutForPackage(q.packageId);
      design.preloadStamp=stamp;
    }
    q.design=design;
    return design;
  }
  let renderStartedFor=null;
  function maybeRender(){
    const q=BQ.quote;
    if(!q||renderState.busy) return;
    if(q.render&&q.render.dataUrl) return;
    if(!(q.intake&&q.intake.complete)) return;
    if(renderStartedFor===q.id) return;
    renderStartedFor=q.id;
    runRender();
  }
  function applyPackageLook(){
    if(!window.BQ||!BQ.quote) return;
    const p=settings.packages.find(x=>x.id===BQ.quote.packageId);
    if(!(p&&p.look)) return;
    ensureDesign();
    applyLook(p.look);
    const stamp=(BQ.quote.packageId||'')+'|'+(wantsBath()?'bath':'room');
    if(design.placedBy!=='user' && design.preloadStamp!==stamp){
      design.items=layoutForPackage(BQ.quote.packageId);
      design.preloadStamp=stamp;
      if(inited) buildItems();
    }
  }
  function toggleClient(){
    const on=document.body.classList.toggle('client');$('pl-client').textContent=on?'Client on':'Client';$('pl-client').setAttribute('aria-pressed',on?'true':'false');
    scene.background=new THREE.Color(on?0xf3efe8:0xdfe5ea);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=on?1.12:1.05;
    scene.getObjectByName('ceil').intensity=on?0.9:0.5;scene.traverse(o=>{if(o.material&&o.material.needsUpdate!==undefined)o.material.needsUpdate=true});refreshSel();
    if(on){camera.position.set(design.room.l*0.9,design.room.h*1.25,design.room.w*1.6);controls.target.set(0,0.9,0)}
    setTimeout(resize,30);
  }
  function saveImage(){
    const was=selHelper.visible;selHelper.visible=false;renderer.render(scene,camera);
    const url=renderer.domElement.toDataURL('image/png');selHelper.visible=was;
    const a=document.createElement('a');a.href=url;a.download=`${(BQ.quote.number||'design')}-${(BQ.quote.customer.name||'bathroom').replace(/\W+/g,'-')}.png`;document.body.appendChild(a);a.click();a.remove();return url;
  }
  function ensureDesign(){
    const q=BQ.quote;
    if(!q.design){
      design=defaultDesign();
      const r=q.room||{};
      if(r.mode==='l'&&+r.length>0&&+r.width>0){
        design.room.shape='l';design.room.l=+r.length;design.room.w=+r.width;
        design.room.notchL=r.notchL;design.room.notchW=r.notchW;design.room.notchCorner=r.notchCorner||'ne';
      }else if(r.mode==='lw'&&+r.length>0&&+r.width>0){design.room.l=+r.length;design.room.w=+r.width}
      else if(r.mode==='m2'&&+r.area>0){const w=Math.sqrt(+r.area/1.25);design.room.w=Calc.round(Math.max(1,w));design.room.l=Calc.round(Math.max(1,+r.area/design.room.w))}
      const p=settings.packages.find(p=>p.id===q.packageId), L=LOOKS[p?.look];
      if(L) Object.assign(design,{floor:L.floor,wall:L.wall,metal:L.metal,wood:L.wood,look:p.look});
      design.stepFree=!!(p&&p.look==='accessible-care');
    }else design=q.design;
    design=normalizeDesign(design);
    clampOpenings();
    q.design=design;
  }
  function syncFromQuote(){
    const r=BQ.quote.room||{};
    if((r.mode==='l'||r.mode==='lw')&&+r.length>0&&+r.width>0){applyQuoteRoom(r);design.items.forEach(clampItem)}
  }
  function syncToQuote(){
    if(!design||!BQ.quote) return;
    const r=normRoom(design.room);
    design.room=r;
    const mode=r.shape==='l'?'l':'lw';
    const radio=document.querySelector(`input[name=dimMode][value="${mode}"]`);
    if(radio) radio.checked=true;
    $('q-len').value=r.l;$('q-wid').value=r.w;
    if($('q-notch-l')) $('q-notch-l').value=r.shape==='l'?r.notchL:($('q-notch-l').value||'');
    if($('q-notch-w')) $('q-notch-w').value=r.shape==='l'?r.notchW:($('q-notch-w').value||'');
    if($('q-notch-corner')) $('q-notch-corner').value=r.notchCorner||'ne';
    update();
    const area=Calc.area(BQ.quote.room);
    const pkgName=(settings.packages.find(p=>p.id===BQ.quote.packageId)||{}).name||'';
    const loaded=design.preloadStamp&&pkgName?` Loaded with the ${pkgName} products.`:'';
    $('pl-area').textContent=`Floor area ${area.toFixed(2)} m² (synced to quote).${loaded}`;
  }
  function show(){
    if(!window.BQ||!BQ.quote) return;
    if(walking) exitWalk();
    if(!inited) init();
    preloadFromQuote();
    syncFromQuote();
    design.items.forEach(clampItem);
    syncRenderFromQuote();
    $('pl-look').value=design.look||'';
    buildRoom();buildItems();renderOpenings();
    const room=BQ.quote.room||{};
    if(!(+room.length>0&&+room.width>0)&&(room.mode==='lw'||room.mode==='l'||!room.mode)) syncToQuote();
    setTimeout(resize,0);
  }
  function loadFromQuote(q){design=null;selected=null;if(inited&&$('view-planner').classList.contains('active')) show()}
  function getDesign(){ensureDesign();return design}
  $('pl-plan').onclick=()=>setPlan(!planOn);
  $('pl-walk').onclick=enterWalk;
  $('pl-walk-exit').onclick=exitWalk;
  $('pl-walk-reset').onclick=lookHere;
  $('pl-ai').onclick=runRender;
  $('pl-ai-card').onclick=runRender;
  $('pl-ai-again').onclick=runRender;
  $('pl-ai-save').onclick=saveRender;
  $('pl-ai-quote').onclick=toggleQuoteRender;
  return {show,loadFromQuote,applyPackageLook,preloadFromQuote,getDesign,addItem,select,saveImage,toggleClient,sizeFromPackage,buildRenderPrompt,runRender,enterWalk,exitWalk,lookHere,getWalk,setPlan,_:{get design(){return design},TILES,ITEMS,blocked,get renderer(){return renderer},get room(){return roomMesh},get camera(){return camera},normRoom,roomPolygon,floorRects,designFloorArea,insideRoom,itemHitsOpening,windowInShower,countKinds,doorFrame,walls(){return design?wallsOf(normRoom(design.room)):[]}}};
})();
window.Planner=Planner;
