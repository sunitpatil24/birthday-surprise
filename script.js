/* =========================
   PERSONALIZE THIS SECTION
   ========================= */
const CONFIG = {
  name: "Happy Birthday, My Love",
  from: "My heart",
  to: "Your heart",

  // Use YYYY-MM-DDTHH:MM:SS in the birthday person's local time.
  // Example: "2027-05-14T00:00:00"
  birthday: "2026-09-28T00:00:00",

  signature: "Forever yours ❤️",
  finalMessage: "No matter how many miles are between us,<br>my heart is always with you.",
  surprise: "“I love you more than all the miles between us.”",

  // Optional: put your own MP3 at assets/our-song.mp3
  music: "our-song.mp3"
};
/* ========================= */

const screens=[...document.querySelectorAll(".screen")];
const progress=document.querySelector(".progress i");
let current=0;

document.querySelectorAll("[data-name]").forEach(el=>el.textContent=CONFIG.name);
document.querySelectorAll("[data-from]").forEach(el=>el.textContent=CONFIG.from);
document.querySelectorAll("[data-to]").forEach(el=>el.textContent=CONFIG.to);
document.querySelector("[data-signature]").textContent=CONFIG.signature;
document.querySelector("[data-final-message]").innerHTML=CONFIG.finalMessage;
document.querySelector("[data-surprise]").textContent=CONFIG.surprise;

function show(n){
  current=Math.max(0,Math.min(screens.length-1,n));
  screens.forEach((s,i)=>s.classList.toggle("active",i===current));
  progress.style.width=((current)/(screens.length-1)*100)+"%";
  if(current===6) launchConfetti();
}
document.querySelectorAll("[data-next]").forEach(b=>b.addEventListener("click",()=>show(current+1)));
document.getElementById("restart").addEventListener("click",()=>show(0));

let startX=0;
window.addEventListener("touchstart",e=>startX=e.changedTouches[0].screenX,{passive:true});
window.addEventListener("touchend",e=>{
  const dx=e.changedTouches[0].screenX-startX;
  if(Math.abs(dx)>70) show(current+(dx<0?1:-1));
},{passive:true});

const birthday=new Date(CONFIG.birthday);
function tick(){
  const diff=Math.max(0,birthday-new Date());
  const d=Math.floor(diff/86400000);
  const h=Math.floor(diff/3600000)%24;
  const m=Math.floor(diff/60000)%60;
  const s=Math.floor(diff/1000)%60;
  document.getElementById("days").textContent=String(d).padStart(2,"0");
  document.getElementById("hours").textContent=String(h).padStart(2,"0");
  document.getElementById("mins").textContent=String(m).padStart(2,"0");
  document.getElementById("secs").textContent=String(s).padStart(2,"0");
}
tick(); setInterval(tick,1000);

const audio=new Audio(CONFIG.music);
audio.loop=true; audio.volume=.45;
let playing=false;
document.getElementById("musicBtn").addEventListener("click",async()=>{
  if(playing){audio.pause();playing=false;document.getElementById("musicBtn").textContent="♪";document.getElementById("musicLabel").textContent="Our song"}
  else{try{await audio.play();playing=true;document.getElementById("musicBtn").textContent="Ⅱ";document.getElementById("musicLabel").textContent="Playing"}catch(e){alert("Add assets/our-song.mp3 to enable the music.");}}
});
// Browsers generally block autoplay. First user click starts it.
document.querySelector("[data-next]").addEventListener("click",async()=>{
  if(!playing){try{await audio.play();playing=true;document.getElementById("musicBtn").textContent="Ⅱ";document.getElementById("musicLabel").textContent="Playing"}catch(e){}}
},{once:true});

let confettiDone=false;
function launchConfetti(){
  if(confettiDone)return; confettiDone=true;
  const canvas=document.getElementById("confetti"),ctx=canvas.getContext("2d");
  canvas.width=innerWidth;canvas.height=innerHeight;
  const pieces=Array.from({length:150},()=>({
    x:innerWidth/2+(Math.random()-.5)*220,y:innerHeight*.36,
    vx:(Math.random()-.5)*8,vy:Math.random()*-7-2,
    r:Math.random()*5+2,rot:Math.random()*6
  }));
  let frame=0;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.vy+=.13;p.rot+=.08;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
      ctx.fillStyle=`hsl(${330+Math.random()*30},75%,${60+Math.random()*25}%)`;
      ctx.fillRect(-p.r,-p.r/2,p.r*2,p.r);ctx.restore();
    });
    if(frame++<260)requestAnimationFrame(draw);
  }
  draw();
}
