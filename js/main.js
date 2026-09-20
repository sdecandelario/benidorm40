const EVENT_DATE = new Date("2027-09-17T00:00:00");

function renderCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;

  const now = new Date();
  const diffMs = EVENT_DATE - now;

  if (diffMs <= 0) {
    el.textContent = "¡Ya estamos en Benidorm! 🏖️";
    return;
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  el.textContent = `Faltan ${days} días`;
}

renderCountdown();
setInterval(renderCountdown, 1000 * 60 * 60);
