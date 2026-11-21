// Loaded in <head> without defer so the theme is set before the page is drawn,
// which avoids a flash of the wrong colours on reload.
(function () {
  let theme = null;

  try {
    theme = localStorage.getItem("theme");
  } catch (error) {
    // Storage can be blocked by privacy settings; fall back to the system preference.
  }

  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  document.documentElement.dataset.theme = theme;
})();
