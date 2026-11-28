const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const header = document.querySelector(".site-header");

// Matches the min-width in css/styles.css where the full navigation bar appears.
const desktopNav = window.matchMedia("(min-width: 1200px)");

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ---------- Theme ---------- */

function applyTheme(theme) {
  root.dataset.theme = theme;
  const otherTheme = theme === "dark" ? "light" : "dark";
  themeButton.setAttribute("aria-label", `Switch to ${otherTheme} theme`);

  // Colour of the browser bar on phones, matched to the header.
  const browserColour = document.querySelector('meta[name="theme-color"]');
  if (browserColour) {
    browserColour.content = theme === "dark" ? "#0f1d15" : "#faf7f1";
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem("theme", theme);
  } catch (error) {
    // Storage can be blocked; the theme still applies until the page is closed.
  }
}

// Switches theme. Where the browser supports view transitions, the colours cross-fade briefly.
function toggleTheme() {
  const theme = root.dataset.theme === "dark" ? "light" : "dark";
  const change = () => {
    applyTheme(theme);
    saveTheme(theme);
  };

  if (!document.startViewTransition || prefersReducedMotion()) {
    change();
    return theme;
  }

  document.startViewTransition(change).ready.catch(() => {
    // The theme has still changed; only the fade was skipped.
  });
  return theme;
}

function setUpThemeToggle() {
  applyTheme(root.dataset.theme);
  themeButton.addEventListener("click", toggleTheme);
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

  button.addEventListener("click", () => {
    const open = !isOpen();
    setOpen(open);
    // The links come before the button in the page, so move focus to them;
    // otherwise the next Tab would skip past the open menu.
    if (open) {
      nav.querySelector("a").focus({ preventScroll: true });
    }
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setOpen(false);
    }
  });

  // A tap or click anywhere outside the header closes the menu.
  document.addEventListener("click", (event) => {
    if (isOpen() && !header.contains(event.target)) {
      setOpen(false);
    }
  });

  // Tabbing out of the header closes the menu, so it never covers the focused element.
  header.addEventListener("focusout", (event) => {
    if (isOpen() && event.relatedTarget && !header.contains(event.relatedTarget)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });

  // Widening the window to the full navigation bar closes the drop-down.
  desktopNav.addEventListener("change", (event) => {
    if (event.matches) {
      setOpen(false);
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

/* ---------- Scrolling: header edge, reading progress and back-to-top button ---------- */

function setUpScrollEffects() {
  const toTop = document.querySelector(".to-top");
  let frame = 0;

  function update() {
    frame = 0;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    header.style.setProperty("--progress", progress.toFixed(4));
    header.classList.toggle("is-scrolled", window.scrollY > 8);
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

/* ---------- Offline support ---------- */

function setUpOfflineSupport() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) {
    return;
  }
  navigator.serviceWorker.register("sw.js").catch(() => {
    // Offline support is optional; the site works normally without it.
  });
}

function showCurrentYear() {
  document.querySelector(".current-year").textContent = new Date().getFullYear();
}

setUpThemeToggle();
setUpMobileMenu();
setUpActiveNav();
setUpContactForm();
setUpScrollEffects();
setUpOfflineSupport();
showCurrentYear();
