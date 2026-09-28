/* =========================
   PERSONALIZE THIS SECTION
   ========================= */
const CONFIG = {
  name: "My Love",
  from: "My heart",
  to: "Your heart",

  signature: "Forever yours ❤️",
  finalMessage: "No matter how many miles are between us,<br>my heart is always with you.",
  surprise: "“I love you more than all the miles between us.”",

  // Optional: put your own MP3 at assets/our-song.mp3
  music: "assets/our-song.mp3"
};
/* ========================= */


const screens = [...document.querySelectorAll(".screen")];
const progress = document.querySelector(".progress i");
let current = 0;


// Personalize content
document.querySelectorAll("[data-name]").forEach(el => {
  el.textContent = CONFIG.name;
});

document.querySelectorAll("[data-from]").forEach(el => {
  el.textContent = CONFIG.from;
});

document.querySelectorAll("[data-to]").forEach(el => {
  el.textContent = CONFIG.to;
});

document.querySelector("[data-signature]").textContent = CONFIG.signature;

document.querySelector("[data-final-message]").innerHTML =
  CONFIG.finalMessage;

document.querySelector("[data-surprise]").textContent =
  CONFIG.surprise;


// Screen navigation
function show(n) {
  current = Math.max(0, Math.min(screens.length - 1, n));

  screens.forEach((screen, index) => {
    screen.classList.toggle("active", index === current);
  });

  progress.style.width =
    ((current) / (screens.length - 1) * 100) + "%";

  if (current === 6) {
    launchConfetti();
  }
}


// Next buttons
document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => {
    show(current + 1);
  });
});


// Restart button
document.getElementById("restart").addEventListener("click", () => {
  show(0);
});


// Swipe navigation on mobile
let startX = 0;

window.addEventListener(
  "touchstart",
  e => {
    startX = e.changedTouches[0].screenX;
  },
  { passive: true }
);

window.addEventListener(
  "touchend",
  e => {
    const dx = e.changedTouches[0].screenX - startX;

    if (Math.abs(dx) > 70) {
      show(current + (dx < 0 ? 1 : -1));
    }
  },
  { passive: true }
);


// =========================
// MUSIC
// =========================

const audio = new Audio(CONFIG.music);

audio.loop = true;
audio.volume = 0.45;

let playing = false;

document.getElementById("musicBtn").addEventListener("click", async () => {

  if (playing) {

    audio.pause();
    playing = false;

    document.getElementById("musicBtn").textContent = "♪";
    document.getElementById("musicLabel").textContent = "Our song";

  } else {

    try {

      await audio.play();

      playing = true;

      document.getElementById("musicBtn").textContent = "Ⅱ";
      document.getElementById("musicLabel").textContent = "Playing";

    } catch (e) {

      alert("Add assets/our-song.mp3 to enable the music.");

    }
  }
});


// Browsers generally block autoplay.
// First user click starts the music.
document.querySelector("[data-next]").addEventListener(
  "click",
  async () => {

    if (!playing) {

      try {

        await audio.play();

        playing = true;

        document.getElementById("musicBtn").textContent = "Ⅱ";
        document.getElementById("musicLabel").textContent = "Playing";

      } catch (e) {}

    }
  },
  { once: true }
);


// =========================
// CONFETTI
// =========================

let confettiDone = false;

function launchConfetti() {

  if (confettiDone) return;

  confettiDone = true;

  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const pieces = Array.from({ length: 150 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 220,
    y: innerHeight * 0.36,
    vx: (Math.random() - 0.5) * 8,
    vy: Math.random() * -7 - 2,
    r: Math.random() * 5 + 2,
    rot: Math.random() * 6
  }));

  let frame = 0;

  function draw() {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    pieces.forEach(p => {

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.13;
      p.rot += 0.08;

      ctx.save();

      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);

      ctx.fillStyle =
        `hsl(${330 + Math.random() * 30},75%,${60 + Math.random() * 25}%)`;

      ctx.fillRect(
        -p.r,
        -p.r / 2,
        p.r * 2,
        p.r
      );

      ctx.restore();

    });

    if (frame++ < 260) {
      requestAnimationFrame(draw);
    }
  }

  draw();
}
