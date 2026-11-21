const root = document.documentElement;

function setUpThemeToggle() {
  const button = document.querySelector(".theme-toggle");

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const otherTheme = theme === "dark" ? "light" : "dark";
    button.setAttribute("aria-label", `Switch to ${otherTheme} theme`);
  }

  applyTheme(root.dataset.theme);

  button.addEventListener("click", () => {
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);

    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      // Storage can be blocked; the theme still applies until the page is closed.
    }
  });
}

function setUpMobileMenu() {
  const button = document.querySelector(".menu-button");
  const nav = document.getElementById(button.getAttribute("aria-controls"));

  const isOpen = () => button.getAttribute("aria-expanded") === "true";
  const setOpen = (open) => button.setAttribute("aria-expanded", String(open));

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

const errorMessages = {
  name: {
    missing: "Enter your name.",
    tooShort: "Enter at least 2 characters.",
  },
  email: {
    missing: "Enter your email address.",
    invalid: "Enter an email address in the format name@example.com.",
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

    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;

    status.textContent = `Your email app should open with the message ready to send. If it doesn't, email ${recipient} directly.`;
  });
}

function showCurrentYear() {
  document.querySelector(".current-year").textContent = new Date().getFullYear();
}

setUpThemeToggle();
setUpMobileMenu();
setUpContactForm();
showCurrentYear();
