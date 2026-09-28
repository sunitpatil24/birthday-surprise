/* ==========================
   PERSONALIZE THIS SECTION
   ========================== */
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


// =========================
// SCREEN NAVIGATION
// =========================

const screens = [...document.querySelectorAll(".screen")];
const progress = document.querySelector(".progress i");

let current = 0;


// Personalize name
document.querySelectorAll("[data-name]").forEach(el => {
  el.textContent = CONFIG.name;
});


// Personalize locations
document.querySelectorAll("[data-from]").forEach(el => {
  el.textContent = CONFIG.from;
});

document.querySelectorAll("[data-to]").forEach(el => {
  el.textContent = CONFIG.to;
});


// Personalize letter signature
const signature = document.querySelector("[data-signature]");

if (signature) {
  signature.textContent = CONFIG.signature;
}


// Personalize final message
const finalMessage = document.querySelector("[data-final-message]");

if (finalMessage) {
  finalMessage.innerHTML = CONFIG.finalMessage;
}


// Personalize surprise
const surprise = document.querySelector("[data-surprise]");

if (surprise) {
  surprise.textContent = CONFIG.surprise;
}


// =========================
// SHOW SCREEN
// =========================

function show(n) {

  current = Math.max(
    0,
    Math.min(screens.length - 1, n)
  );

  screens.forEach((screen, index) => {
    screen.classList.toggle(
      "active",
      index === current
    );
  });


  // Update progress bar
  if (progress) {
    progress.style.width =
      ((current) / (screens.length - 1) * 100) + "%";
  }


  // Start confetti on final screen
  if (current === 6) {
    launchConfetti();
  }
}


// =========================
// NEXT BUTTONS
// =========================

document.querySelectorAll("[data-next]").forEach(button => {

  button.addEventListener("click", () => {
    show(current + 1);
  });

});


// =========================
// RESTART
// =========================

const restart = document.getElementById("restart");

if (restart) {

  restart.addEventListener("click", () => {
    show(0);
  });

}


// =========================
// MOBILE SWIPE
// =========================

let startX = 0;

window.addEventListener(
  "touchstart",
  event => {
    startX = event.changedTouches[0].screenX;
  },
  { passive: true }
);


window.addEventListener(
  "touchend",
  event => {

    const endX = event.changedTouches[0].screenX;
    const dx = endX - startX;

    if (Math.abs(dx) > 70) {

      if (dx < 0) {
        // Swipe left → next
        show(current + 1);
      } else {
        // Swipe right → previous
        show(current - 1);
      }

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

const musicBtn = document.getElementById("musicBtn");
const musicLabel = document.getElementById("musicLabel");


// Music button
if (musicBtn) {

  musicBtn.addEventListener("click", async () => {

    if (playing) {

      audio.pause();

      playing = false;

      musicBtn.textContent = "♪";

      if (musicLabel) {
        musicLabel.textContent = "Our song";
      }

    } else {

      try {

        await audio.play();

        playing = true;

        musicBtn.textContent = "Ⅱ";

        if (musicLabel) {
          musicLabel.textContent = "Playing";
        }

      } catch (error) {

        alert(
          "Add assets/our-song.mp3 to enable the music."
        );

      }

    }

  });

}


// =========================
// START MUSIC AFTER FIRST
// USER INTERACTION
// =========================

const firstNextButton =
  document.querySelector("[data-next]");

if (firstNextButton) {

  firstNextButton.addEventListener(
    "click",
    async () => {

      if (!playing) {

        try {

          await audio.play();

          playing = true;

          if (musicBtn) {
            musicBtn.textContent = "Ⅱ";
          }

          if (musicLabel) {
            musicLabel.textContent = "Playing";
          }

        } catch (error) {
          // Autoplay may still be blocked.
        }

      }

    },
    { once: true }
  );

}


// =========================
// CONFETTI
// =========================

let confettiDone = false;


function launchConfetti() {

  if (confettiDone) {
    return;
  }

  confettiDone = true;


  const canvas = document.getElementById("confetti");

  if (!canvas) {
    return;
  }


  const ctx = canvas.getContext("2d");


  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;


  const pieces = Array.from(
    { length: 150 },
    () => ({
      x:
        window.innerWidth / 2 +
        (Math.random() - 0.5) * 220,

      y:
        window.innerHeight * 0.36,

      vx:
        (Math.random() - 0.5) * 8,

      vy:
        Math.random() * -7 - 2,

      r:
        Math.random() * 5 + 2,

      rot:
        Math.random() * 6
    })
  );


  let frame = 0;


  function draw() {

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    pieces.forEach(piece => {

      piece.x += piece.vx;
      piece.y += piece.vy;

      piece.vy += 0.13;
      piece.rot += 0.08;


      ctx.save();

      ctx.translate(
        piece.x,
        piece.y
      );

      ctx.rotate(
        piece.rot
      );


      ctx.fillStyle =
        `hsl(
          ${330 + Math.random() * 30},
          75%,
          ${60 + Math.random() * 25}%
        )`;


      ctx.fillRect(
        -piece.r,
        -piece.r / 2,
        piece.r * 2,
        piece.r
      );


      ctx.restore();

    });


    if (frame++ < 260) {

      requestAnimationFrame(draw);

    }

  }


  draw();
}
