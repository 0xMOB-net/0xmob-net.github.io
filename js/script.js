const cur=document.getElementById('cur'),ring=document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function loop(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();
function toggleMenu(){document.getElementById('mobileMenu').classList.toggle('open');}
function closeMenu(){document.getElementById('mobileMenu').classList.remove('open');}
const revEls=document.querySelectorAll('.reveal');
const revObs=new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{if(e.isIntersecting){setTimeout(()=>e.target.classList.add('visible'),i*60);revObs.unobserve(e.target);}});
},{threshold:.1});
revEls.forEach(el=>revObs.observe(el));
const barObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.skill-fill').forEach(f=>{f.style.width=f.dataset.w+'%';});
      e.target.querySelectorAll('.ctf-cat-fill').forEach(f=>{f.style.width=f.dataset.w+'%';});
      barObs.unobserve(e.target);
    }
  });
},{threshold:.2});
document.querySelectorAll('.skill-card,.ctf-cats').forEach(el=>barObs.observe(el));
function animCount(el){
  const target=+el.dataset.count;
  const dur=1800,step=16;
  let val=0,t=0;
  const ease=p=>p<.5?2*p*p:-1+(4-2*p)*p;
  const iv=setInterval(()=>{
    t+=step;const p=Math.min(t/dur,1);
    val=Math.round(ease(p)*target);
    el.textContent=val.toLocaleString();
    if(p>=1){el.textContent=target.toLocaleString();clearInterval(iv);}
  },step);
}
const cntObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting&&e.target.dataset.count){animCount(e.target);cntObs.unobserve(e.target);}});
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>cntObs.observe(el));
(function(){
  const pts=[
    {x:0,y:25},{x:20,y:100},{x:40,y:250},{x:65,y:550},{x:85,y:700},
    {x:100,y:825},{x:115,y:900},{x:130,y:1010},{x:150,y:1160},{x:165,y:1235},
    {x:180,y:1335},{x:200,y:1460},{x:215,y:1535},{x:235,y:1935},{x:255,y:2110},
    {x:270,y:2230},{x:285,y:2410},{x:300,y:2630},{x:315,y:2750},{x:330,y:2880},
    {x:345,y:2950},{x:360,y:3063},{x:375,y:3160},{x:390,y:3263},{x:405,y:3343},
    {x:420,y:3585},{x:435,y:3839},{x:450,y:3960},{x:462,y:4164},{x:474,y:4260},
    {x:484,y:4456},{x:492,y:4635},{x:498,y:4835},{x:504,y:4983},{x:510,y:5135},
    {x:516,y:5535}
  ];
  const W=520,H=160,PAD=8,maxY=6000;
  function sv(px,py){return{sx:PAD+px/516*(W-2*PAD),sy:H-PAD-(py/maxY)*(H-2*PAD)};}
  let lD='',aD='';
  pts.forEach((p,i)=>{
    const{sx,sy}=sv(p.x,p.y);
    if(i===0){lD+=`M${sx},${sy}`;aD+=`M${sx},${H-PAD} L${sx},${sy}`;}
    else{lD+=` L${sx},${sy}`;aD+=` L${sx},${sy}`;}
  });
  const last=sv(pts[pts.length-1].x,pts[pts.length-1].y);
  aD+=` L${last.sx},${H-PAD} Z`;
  const obs=new IntersectionObserver(entries=>{
    if(!entries[0].isIntersecting)return;
    const lp=document.getElementById('chartLine');
    const ap=document.getElementById('chartArea');
    const dg=document.getElementById('chartDots');
    lp.setAttribute('d',lD);ap.setAttribute('d',aD);
    lp.style.opacity='1';ap.style.opacity='1';
    const len=lp.getTotalLength();
    lp.style.strokeDasharray=len;lp.style.strokeDashoffset=len;
    lp.style.transition='stroke-dashoffset 2s ease';
    setTimeout(()=>lp.style.strokeDashoffset='0',100);
    dg.style.opacity='1';
    [250,700,1335,1935,2750,3585,4260,4983,5535].forEach(score=>{
      const p=pts.find(pt=>pt.y===score);
      if(!p)return;
      const{sx,sy}=sv(p.x,p.y);
      dg.innerHTML+=`<circle cx="${sx}" cy="${sy}" r="3" fill="#00e676" stroke="#030508" stroke-width="1.5"/>
        <text x="${sx}" y="${sy-7}" fill="#00e676" font-size="8" font-family="Share Tech Mono" text-anchor="middle">${score}</text>`;
    });
    obs.disconnect();
  },{threshold:.3});
  obs.observe(document.getElementById('ctfSvg'));
})();
const cForm=document.getElementById('cForm');
const fBtn=document.getElementById('fBtn');
const fTxt=document.getElementById('fTxt');
const fSpin=document.getElementById('fSpin');
const fStatus=document.getElementById('fStatus');
function setLoad(on){fBtn.disabled=on;fTxt.style.display=on?'none':'inline';fSpin.style.display=on?'block':'none';}
function showSt(type,msg){fStatus.className='f-status '+type;fStatus.textContent=msg;setTimeout(()=>{fStatus.className='f-status';},7000);}
function valid(){
  const n=document.getElementById('fn').value.trim();
  const e=document.getElementById('fe').value.trim();
  const s=document.getElementById('fs').value.trim();
  const m=document.getElementById('fm').value.trim();
  if(!n){showSt('err','⚠ Veuillez entrer votre nom.');return false;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)){showSt('err','⚠ Email invalide.');return false;}
  if(!s){showSt('err','⚠ Veuillez entrer un sujet.');return false;}
  if(m.length<10){showSt('err','⚠ Message trop court.');return false;}
  return true;
}
cForm.addEventListener('submit',async ev=>{
  ev.preventDefault();
  if(!valid())return;
  setLoad(true);
  try{
    const res=await fetch('https://api.web3forms.com/submit',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({
        access_key:'7a3fd70b-2a07-445e-b58b-1c8413bc5cda',
        name:document.getElementById('fn').value,
        email:document.getElementById('fe').value,
        company:document.getElementById('fc').value,
        subject:document.getElementById('fs').value,
        message:document.getElementById('fm').value,
      })
    });
    const data=await res.json();
    setLoad(false);
    if(data.success){showSt('ok','✅ Message envoyé ! Je vous réponds sous 24h.');cForm.reset();}
    else{showSt('err','❌ Erreur d\'envoi. Écrivez-moi directement par email.');}
  }catch(err){
    setLoad(false);
    showSt('err','❌ Erreur réseau. Écrivez-moi directement par email.');
  }
});