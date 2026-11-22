const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------- Theme ---------- */

function applyTheme(theme) {
  root.dataset.theme = theme;
  const otherTheme = theme === "dark" ? "light" : "dark";
  themeButton.setAttribute("aria-label", `Switch to ${otherTheme} theme`);

  // Colour of the browser bar on phones and of the installed app's title bar.
  const browserColour = document.querySelector('meta[name="theme-color"]');
  if (browserColour) {
    browserColour.content = theme === "dark" ? "#0e1c14" : "#1f3d2b";
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    // Storage can be blocked; the theme still applies until the page is closed.
  }
}

// Switches theme. Where the browser supports view transitions, the new colours
// spread out as a circle from `origin` (the theme button when no origin is given).
function toggleTheme(origin) {
  const theme = root.dataset.theme === "dark" ? "light" : "dark";
  const change = () => {
    applyTheme(theme);
    saveTheme(theme);
  };

  if (!document.startViewTransition || prefersReducedMotion()) {
    change();
    return theme;
  }

  const box = themeButton.getBoundingClientRect();
  const x = origin ? origin.x : box.left + box.width / 2 || window.innerWidth / 2;
  const y = origin ? origin.y : box.top + box.height / 2 || 0;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  const transition = document.startViewTransition(change);
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 600, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    })
    .catch(() => {
      // The theme has still changed; only the animation was skipped.
    });
  return theme;
}

function setUpThemeToggle() {
  applyTheme(root.dataset.theme);
  themeButton.addEventListener("click", (event) => {
    // Keyboard presses report 0,0, so they start the circle from the button instead.
    const fromPointer = event.clientX || event.clientY ? { x: event.clientX, y: event.clientY } : null;
    toggleTheme(fromPointer);
  });
}

/* ---------- Navigation ---------- */

function setUpMobileMenu() {
  const button = document.querySelector(".menu-button");
  const nav = document.getElementById(button.getAttribute("aria-controls"));

  const isOpen = () => button.getAttribute("aria-expanded") === "true";
  const setOpen = (open) => {
    button.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  };

  button.addEventListener("click", () => setOpen(!isOpen()));

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });
}

// Marks the navigation link of the section currently in the middle of the screen.
function setUpActiveNav() {
  const links = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
  const sections = links
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);
  const hero = document.getElementById("top");

  if (!("IntersectionObserver" in window) || sections.length === 0) {
    return;
  }

  function markCurrent(id) {
    links.forEach((link) => {
      if (link.getAttribute("href") === `#${id}`) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          markCurrent(entry.target.id);
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  // The hero has no link, so reaching it clears the mark.
  [hero, ...sections].filter(Boolean).forEach((section) => observer.observe(section));
}

/* ---------- Contact form ---------- */

const errorMessages = {
  name: {
    missing: "Enter your name.",
    tooShort: "Enter at least 2 characters.",
  },
  email: {
    missing: "Enter your email address.",
    invalid: "Enter an email address in the format name@example.com.",
  },
  subject: {
    missing: "Enter a subject.",
    tooShort: "Enter at least 3 characters.",
  },
  message: {
    missing: "Enter a message.",
    tooShort: "Write at least 10 characters.",
  },
};

function findError(field) {
  const value = field.value.trim();
  const messages = errorMessages[field.name];

  if (value === "") {
    return messages.missing;
  }
  if (field.minLength > 0 && value.length < field.minLength) {
    return messages.tooShort;
  }
  if (field.type === "email" && field.validity.typeMismatch) {
    return messages.invalid;
  }
  return "";
}

function checkField(field) {
  const error = findError(field);
  document.getElementById(field.getAttribute("aria-describedby")).textContent = error;

  if (error) {
    field.setAttribute("aria-invalid", "true");
  } else {
    field.removeAttribute("aria-invalid");
  }
  return error === "";
}

// GitHub Pages only serves files, so the form cannot send email itself.
// It validates the message and hands it to the visitor's email app instead.
function setUpContactForm() {
  const form = document.querySelector(".contact-form");
  const status = form.querySelector(".form-status");
  const fields = Array.from(form.elements).filter((element) => element.name in errorMessages);

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.hasAttribute("aria-invalid")) {
        checkField(field);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalidFields = fields.filter((field) => !checkField(field));
    if (invalidFields.length > 0) {
      status.textContent = "";
      invalidFields[0].focus();
      return;
    }

    const data = new FormData(form);
    const name = data.get("name").trim();
    const email = data.get("email").trim();
    const message = data.get("message").trim();
    const recipient = form.dataset.recipient;

    const subject = encodeURIComponent(data.get("subject").trim());
    const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

    status.textContent = `Your email app should now open with your message ready to send. If it doesn't, email me directly at ${recipient}.`;
  });
}

/* ---------- Scrolling: back-to-top button and reading progress ---------- */

function setUpScrollEffects() {
  const toTop = document.querySelector(".to-top");
  const header = document.querySelector(".site-header");
  let frame = 0;

  function update() {
    frame = 0;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    header.style.setProperty("--progress", progress.toFixed(4));
    toTop.hidden = window.scrollY < 700;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", update);
  update();

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    // Move keyboard focus to the top as well, so the next Tab starts from the header.
    document.querySelector(".brand").focus({ preventScroll: true });
  });
}

/* ---------- Scroll reveal: sections and cards fade in as they enter the screen ---------- */

const revealSelector = ".section-head, .card, .more-card, .empty-card";

function setUpReveal() {
  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }
        const element = entry.target;
        observer.unobserve(element);
        element.classList.add("is-visible");

        // Once the entrance has played, drop the classes so hover effects run without a delay.
        const delay = parseInt(element.style.getPropertyValue("--reveal-delay"), 10) || 0;
        setTimeout(() => {
          element.classList.remove("reveal", "is-visible");
          element.style.removeProperty("--reveal-delay");
        }, 800 + delay);
      });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );

  document.querySelectorAll(`main ${revealSelector.split(", ").join(", main ")}`).forEach((element) => {
    if (element.closest(".hero")) {
      return;
    }
    // Cards in the same grid arrive one after another.
    const siblings = Array.from(element.parentElement.children).filter((child) => child.matches(revealSelector));
    const index = Math.max(siblings.indexOf(element), 0);
    element.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 70}ms`);
    element.classList.add("reveal");
    observer.observe(element);
  });
}

/* ---------- Typing effect in the hero ---------- */

function setUpTyping() {
  const line = document.querySelector(".hero-typing");
  const output = line && line.querySelector(".typing-text");
  if (!output) {
    return;
  }

  const phrases = JSON.parse(line.dataset.phrases);

  if (prefersReducedMotion()) {
    line.classList.add("is-static");
    output.textContent = line.dataset.static;
    return;
  }

  let phrase = 0;
  let length = phrases[0].length;
  let deleting = false;

  function tick() {
    const word = phrases[phrase];

    if (!deleting && length === word.length) {
      deleting = true;
      setTimeout(tick, 1800);
      return;
    }
    if (deleting && length === 0) {
      deleting = false;
      phrase = (phrase + 1) % phrases.length;
      setTimeout(tick, 350);
      return;
    }

    length += deleting ? -1 : 1;
    output.textContent = phrases[phrase].slice(0, length);
    setTimeout(tick, deleting ? 35 : 80);
  }

  output.textContent = phrases[0];
  setTimeout(tick, 1800);
}

/* ---------- Spotlight: a purple glow that follows the pointer over cards ---------- */

function setUpSpotlight() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  let current = null;
  let lastEvent = null;
  let frame = 0;

  function clear(card) {
    ["--mx", "--my", "--rx", "--ry"].forEach((name) => card.style.removeProperty(name));
  }

  function update() {
    frame = 0;
    const card = lastEvent.target instanceof Element ? lastEvent.target.closest(".card, .more-card, .empty-card") : null;
    if (current && current !== card) {
      clear(current);
    }
    current = card;
    if (!card) {
      return;
    }
    const box = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${Math.round(lastEvent.clientX - box.left)}px`);
    card.style.setProperty("--my", `${Math.round(lastEvent.clientY - box.top)}px`);

    // Project cards also tilt a little towards the pointer.
    if (card.classList.contains("project") && !prefersReducedMotion()) {
      const across = (lastEvent.clientX - box.left) / box.width - 0.5;
      const down = (lastEvent.clientY - box.top) / box.height - 0.5;
      card.style.setProperty("--ry", `${(across * 6).toFixed(2)}deg`);
      card.style.setProperty("--rx", `${(-down * 6).toFixed(2)}deg`);
    }
  }

  document.addEventListener(
    "pointermove",
    (event) => {
      lastEvent = event;
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
  document.addEventListener("pointerleave", () => {
    if (current) {
      clear(current);
      current = null;
    }
  });
}

/* ---------- Offline support ---------- */

function setUpOfflineSupport() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) {
    return;
  }
  navigator.serviceWorker.register("sw.js").catch(() => {
    // Offline support is optional; the site works normally without it.
  });
}

/* ---------- Animated network behind the hero ---------- */

function setUpHeroCanvas() {
  const canvas = document.querySelector(".hero-canvas");
  const context = canvas && canvas.getContext ? canvas.getContext("2d") : null;
  if (!context) {
    return;
  }

  const hero = canvas.parentElement;
  const still = prefersReducedMotion();
  let width = 0;
  let height = 0;
  let points = [];
  let colour = "139, 92, 246";
  let frame = 0;
  let visible = true;
  let pointer = null;

  function readColour() {
    const match = /^#([0-9a-f]{6})$/i.exec(getComputedStyle(root).getPropertyValue("--highlight").trim());
    if (match) {
      const value = parseInt(match[1], 16);
      colour = `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
    }
  }

  function line(fromX, fromY, toX, toY, alpha) {
    context.strokeStyle = `rgba(${colour}, ${alpha})`;
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1;
    const reach = 130;

    points.forEach((a, index) => {
      for (let next = index + 1; next < points.length; next++) {
        const b = points[next];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < reach) {
          line(a.x, a.y, b.x, b.y, (1 - distance / reach) * 0.35);
        }
      }
      if (pointer) {
        const distance = Math.hypot(a.x - pointer.x, a.y - pointer.y);
        if (distance < 170) {
          line(a.x, a.y, pointer.x, pointer.y, (1 - distance / 170) * 0.55);
        }
      }
      context.fillStyle = `rgba(${colour}, 0.6)`;
      context.beginPath();
      context.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      context.fill();
    });
  }

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    // About one dot per 16,000 square pixels, between 18 and 70 dots.
    const count = Math.round(Math.min(70, Math.max(18, (width * height) / 16000)));
    points = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.4 + 0.8,
    }));
    draw();
  }

  function step() {
    frame = 0;
    points.forEach((point) => {
      point.x += point.vx;
      point.y += point.vy;
      if (point.x < 0 || point.x > width) {
        point.vx *= -1;
      }
      if (point.y < 0 || point.y > height) {
        point.vy *= -1;
      }
    });
    draw();
    start();
  }

  // Animates only while the hero is on screen and the tab is visible, to save battery.
  function start() {
    if (!still && !frame && visible && !document.hidden) {
      frame = requestAnimationFrame(step);
    }
  }

  readColour();
  resize();
  canvas.dataset.state = still ? "still" : "moving";

  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(hero);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    }).observe(hero);
  }
  document.addEventListener("visibilitychange", start);
  new MutationObserver(() => {
    readColour();
    draw();
  }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

  if (!still) {
    hero.addEventListener(
      "pointermove",
      (event) => {
        const box = hero.getBoundingClientRect();
        pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
      },
      { passive: true }
    );
    hero.addEventListener("pointerleave", () => {
      pointer = null;
    });
  }
  start();
}

function showCurrentYear() {
  document.querySelector(".current-year").textContent = new Date().getFullYear();
}

setUpThemeToggle();
setUpMobileMenu();
setUpActiveNav();
setUpContactForm();
setUpScrollEffects();
setUpReveal();
setUpTyping();
setUpSpotlight();
setUpHeroCanvas();
setUpOfflineSupport();
showCurrentYear();
