const EVENT_DATE = new Date("2027-09-17T00:00:00");

function pad2(n) {
  return String(n).padStart(2, "0");
}

function renderCountdown() {
  const heroEl = document.getElementById("countdown");
  if (!heroEl) return;

  const diffMs = EVENT_DATE - new Date();

  if (diffMs <= 0) {
    heroEl.textContent = "¡Ya estamos en Benidorm! 🏖️";
    return;
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  heroEl.innerHTML = `
    <div class="cd-unit"><span class="cd-num">${days}</span><span class="cd-label">días</span></div>
    <div class="cd-unit"><span class="cd-num">${pad2(hours)}</span><span class="cd-label">h</span></div>
    <div class="cd-unit"><span class="cd-num">${pad2(minutes)}</span><span class="cd-label">min</span></div>
    <div class="cd-unit"><span class="cd-num">${pad2(seconds)}</span><span class="cd-label">seg</span></div>
  `;
}

renderCountdown();
setInterval(renderCountdown, 1000);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

if (hasGsap) {
  gsap.registerPlugin(ScrollTrigger);
}

// ---------- Smooth inertia scroll (Lenis) ----------

let lenis = null;

if (!prefersReducedMotion && typeof window.Lenis !== "undefined") {
  lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });

  lenis.on("scroll", () => {
    if (hasGsap) ScrollTrigger.update();
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (hasGsap) {
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}

// ---------- Scroll progress bar ----------

function initProgressBar() {
  const bar = document.getElementById("progressBar");
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  }

  if (hasGsap) {
    ScrollTrigger.create({ onUpdate: update, onRefresh: update });
  } else {
    window.addEventListener("scroll", update, { passive: true });
  }
  update();
}

// ---------- Staggered reveal per panel ----------

function initReveal() {
  const items = document.querySelectorAll(".reveal-item");

  if (!hasGsap) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  document.querySelectorAll(".panel").forEach((panel) => {
    const panelItems = panel.querySelectorAll(".reveal-item");
    if (!panelItems.length) return;

    gsap.to(panelItems, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.12,
      scrollTrigger: {
        trigger: panel,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
      onStart: () => panelItems.forEach((el) => el.classList.add("is-visible")),
    });
  });
}

// ---------- Floaty parallax ----------

function initParallax() {
  if (!hasGsap) return;

  document.querySelectorAll(".floaty").forEach((el) => {
    const speed = parseFloat(el.dataset.speed || "0.4");
    gsap.to(el, {
      y: () => -window.innerHeight * speed,
      ease: "none",
      scrollTrigger: {
        trigger: el.closest(".panel"),
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}

// ---------- Escenas de fondo (crossfade tipo apple.com/iphone) ----------

function initSceneCrossfade() {
  const scenes = document.querySelectorAll(".scene-img");
  if (!scenes.length) return;

  if (!hasGsap) {
    scenes.forEach((s) => (s.style.opacity = s.classList.contains("scene-img-hero") ? "1" : "0"));
    return;
  }

  scenes.forEach((s) => (s.style.opacity = s.classList.contains("scene-img-hero") ? "1" : "0"));

  document.querySelectorAll(".panel").forEach((panel) => {
    const scene = document.querySelector(`.scene-img[data-scene-for="${panel.id}"]`);
    if (!scene) return;

    ScrollTrigger.create({
      trigger: panel,
      start: "top center",
      end: "bottom center",
      onToggle: (self) => {
        scene.style.opacity = self.isActive ? "1" : "0";
      },
    });
  });
}

// ---------- Confeti ----------

const CONFETTI_COLORS = ["#ffc93c", "#ff5f6d", "#3ddad0", "#7c4dff", "#ff2ea6", "#fff8ec"];
const CONFETTI_EMOJI = ["🎉", "✨", "🎊", "🥳", "🍾"];

function spawnConfettiPiece(originX, originY) {
  const useEmoji = Math.random() < 0.3;
  const piece = document.createElement("span");
  piece.className = "confetti-piece";
  piece.style.left = `${originX + (Math.random() * 320 - 160)}px`;
  piece.style.top = `${originY}px`;
  piece.style.animationDuration = `${1.6 + Math.random() * 1.6}s`;
  piece.style.animationDelay = `${Math.random() * 0.3}s`;

  if (useEmoji) {
    piece.textContent = CONFETTI_EMOJI[Math.floor(Math.random() * CONFETTI_EMOJI.length)];
    piece.style.fontSize = `${1 + Math.random()}rem`;
    piece.style.background = "transparent";
  } else {
    piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.width = `${6 + Math.random() * 6}px`;
    piece.style.height = `${10 + Math.random() * 10}px`;
    piece.style.borderRadius = Math.random() < 0.5 ? "50%" : "2px";
  }

  piece.style.transform = `rotate(${Math.random() * 360}deg)`;
  document.body.appendChild(piece);
  piece.addEventListener("animationend", () => piece.remove());
}

function burstConfetti(originX, originY, count) {
  for (let i = 0; i < count; i++) spawnConfettiPiece(originX, originY);
}

function initConfettiBurst() {
  if (prefersReducedMotion) return;

  const trigger = document.getElementById("rsvpCta");
  if (trigger) {
    trigger.addEventListener("click", () => {
      const rect = trigger.getBoundingClientRect();
      burstConfetti(rect.left + trigger.offsetWidth / 2, rect.top, 70);
    });
  }

  // Ráfaga de bienvenida al cargar, para que la página "reciba" con fiesta.
  window.setTimeout(() => {
    burstConfetti(window.innerWidth * 0.25, -10, 25);
    burstConfetti(window.innerWidth * 0.75, -10, 25);
  }, 500);
}

// ---------- Cartas del tablero: tocar para girar en pantallas táctiles ----------

function initFlipCards() {
  document.querySelectorAll(".flip-card").forEach((card) => {
    const inner = card.querySelector(".flip-card-inner");
    if (!inner) return;

    card.addEventListener("click", () => {
      inner.classList.toggle("is-flipped");
    });
  });
}

initProgressBar();
initReveal();
initParallax();
initSceneCrossfade();
initConfettiBurst();
initFlipCards();
