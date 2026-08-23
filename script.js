(() => {
  "use strict";

  let currentScreen = 1;
  let giftOpened = false;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function showScreen(number) {
    const target = document.getElementById(`screen${number}`);
    const screens = $$(".screen");

    if (!target || screens.length === 0) {
      console.error(`[BirthdayCard] Không tìm thấy screen${number}`);
      return false;
    }

    screens.forEach((screen) => {
      screen.classList.remove("active");
    });

    target.classList.add("active");
    currentScreen = number;
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Keep the URL stable for GitHub Pages; no reload and no hash changes.
    return true;
  }

  function bindButton(id, handler) {
    const button = document.getElementById(id);

    if (!button) {
      console.warn(`[BirthdayCard] Không tìm thấy nút #${id}`);
      return;
    }

    // Prevent duplicate listeners if the script is accidentally loaded twice.
    button.onclick = null;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      handler();
    });
  }

  function typeCoverTitle() {
    const lineSmall = $(".cover-line-small");
    const age = $(".cover-age");
    const lineBig = $(".cover-line-big");

    if (!lineSmall || !age || !lineBig) return;

    lineSmall.style.opacity = "0";
    age.style.opacity = "0";
    lineBig.style.opacity = "0";

    const reveal = (el, delay) => {
      window.setTimeout(() => {
        el.style.transition = "opacity .65s ease, transform .65s ease";
        el.style.transform = "translateY(8px)";
        requestAnimationFrame(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        });
      }, delay);
    };

    reveal(lineSmall, 250);
    reveal(age, 850);
    reveal(lineBig, 1250);
  }

  function openGift() {
    if (giftOpened) return;

    giftOpened = true;

    const reveal = $("#giftReveal");
    const nextButton = $("#nextButton3");

    if (reveal) reveal.classList.add("revealed");
    if (nextButton) nextButton.classList.remove("hidden");

    createConfetti(34);

    const cake = $("#cakeButton img");
    if (cake) {
      cake.style.animation = "none";
      requestAnimationFrame(() => {
        cake.animate(
          [
            { transform: "scale(1)" },
            { transform: "scale(1.1) rotate(-3deg)" },
            { transform: "scale(1) rotate(0deg)" }
          ],
          { duration: 520, easing: "cubic-bezier(.17,.89,.32,1.27)" }
        );
      });
    }
  }

  function createConfetti(count = 85) {
    const layer = $("#confettiLayer");
    if (!layer) return;

    const colors = [
      "#ff3b7a", "#ffca28", "#24c6ff", "#59d96f", "#9c6cff",
      "#ff6b3d", "#ffffff", "#ff4fc3", "#00cfa3", "#527bff"
    ];

    // Bright central burst
    for (let i = 0; i < count; i += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece vivid";
      piece.style.background = colors[i % colors.length];
      piece.style.left = "50%";
      piece.style.top = "50%";
      piece.style.width = `${7 + Math.random() * 6}px`;
      piece.style.height = `${10 + Math.random() * 9}px`;
      piece.style.borderRadius = Math.random() > .55 ? "50%" : "2px";
      layer.appendChild(piece);

      const angle = Math.random() * Math.PI * 2;
      const distance = 180 + Math.random() * 520;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 100;
      const rotation = (Math.random() - 0.5) * 1440;

      piece.animate([
        {
          transform: "translate(-50%, -50%) scale(.6) rotate(0deg)",
          opacity: 1
        },
        {
          transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1) rotate(${rotation}deg)`,
          opacity: 1,
          offset: .72
        },
        {
          transform: `translate(calc(-50% + ${dx * 1.08}px), calc(-50% + ${dy + 280}px)) scale(.8) rotate(${rotation + 260}deg)`,
          opacity: 0
        }
      ], {
        duration: 1500 + Math.random() * 1000,
        easing: "cubic-bezier(.12,.7,.17,1)",
        fill: "forwards"
      }).onfinish = () => piece.remove();
    }

    // Secondary rain of colorful confetti
    window.setTimeout(() => {
      for (let i = 0; i < 34; i += 1) {
        const piece = document.createElement("span");
        piece.className = "confetti-piece vivid";
        piece.style.background = colors[(i + 4) % colors.length];
        piece.style.left = `${12 + Math.random() * 76}%`;
        piece.style.top = "-20px";
        piece.style.width = `${6 + Math.random() * 5}px`;
        piece.style.height = `${10 + Math.random() * 8}px`;
        layer.appendChild(piece);

        const x = (Math.random() - .5) * 180;
        const y = 75 + Math.random() * 35;
        const r = 360 + Math.random() * 900;

        piece.animate([
          { transform: "translateY(0) rotate(0deg)", opacity: 1 },
          { transform: `translate(${x}px, ${y}vh) rotate(${r}deg)`, opacity: 0 }
        ], {
          duration: 1900 + Math.random() * 1200,
          easing: "cubic-bezier(.16,.7,.2,1)",
          fill: "forwards"
        }).onfinish = () => piece.remove();
      }
    }, 120);
  }

  async function shareCard() {
    const shareData = {
      title: "Happy 21th Birthday, Mai ♡",
      text: "Một tấm thiệp sinh nhật nhỏ dành cho Mai ♡",
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Đã copy link trang web ♡");
        return;
      }

      showToast("Hãy copy đường dẫn trên trình duyệt để chia sẻ nhé ♡");
    } catch (error) {
      // User cancellation is not an error for this UI.
      if (error && error.name !== "AbortError") {
        console.warn("[BirthdayCard] Share failed:", error);
        showToast("Không thể chia sẻ tự động, nhưng trang vẫn hoạt động ♡");
      }
    }
  }

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }

  function verifyAsset(src) {
    const img = new Image();
    img.onload = () => console.info(`[BirthdayCard] Asset OK: ${src}`);
    img.onerror = () => console.warn(`[BirthdayCard] Asset missing: ${src}`);
    img.src = src;
  }

  function runSelfCheck() {
    const requiredIds = [
      "screen1", "screen2", "screen3", "screen4", "screen5",
      "nextButton1", "nextButton2", "cakeButton",
      "nextButton3", "nextButton4", "shareButton", "restartButton"
    ];

    const missing = requiredIds.filter((id) => !document.getElementById(id));

    if (missing.length) {
      console.error("[BirthdayCard] Thiếu phần tử:", missing.join(", "));
    } else {
      console.info("[BirthdayCard] Self-check OK: 5 screens + buttons found.");
    }

    verifyAsset("./assets/cover1.jpg");
    verifyAsset("./assets/cover2.jpg");
    verifyAsset("./assets/memory.jpg");
  }

  document.addEventListener("DOMContentLoaded", () => {
    // The first screen is intentionally left unchanged visually.
    bindButton("nextButton1", () => showScreen(2));
    bindButton("nextButton2", () => showScreen(3));
    bindButton("cakeButton", openGift);
    bindButton("nextButton3", () => showScreen(4));
    bindButton("nextButton4", () => showScreen(5));
    bindButton("restartButton", () => {
      giftOpened = false;

      const reveal = $("#giftReveal");
      const nextButton = $("#nextButton3");

      if (reveal) reveal.classList.remove("revealed");
      if (nextButton) nextButton.classList.add("hidden");

      showScreen(1);
      typeCoverTitle();
    });
    bindButton("shareButton", shareCard);

    // Initial state.
    showScreen(1);
    typeCoverTitle();

    // Developer-friendly sanity check.
    runSelfCheck();
  });
})();
