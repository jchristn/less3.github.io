(function () {
  const themeToggle = document.querySelector(".theme-toggle");
  const themeMeta = document.querySelector("meta[name='theme-color']");

  function getInitialTheme() {
    try {
      const storedTheme = localStorage.getItem("less3-theme");
      if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
    } catch {
      return document.documentElement.dataset.theme || "light";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#0b1220" : "#ffffff");

    if (themeToggle) {
      const dark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", String(dark));
      themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
      themeToggle.title = dark ? "Light theme" : "Dark theme";
    }
  }

  applyTheme(getInitialTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      try {
        localStorage.setItem("less3-theme", nextTheme);
      } catch {
        // Theme persistence is optional when opened from restricted local contexts.
      }
    });
  }

  const menuButton = document.querySelector(".menu-button");
  const nav = document.getElementById("primary-navigation");

  function closeMenu() {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    nav.classList.remove("primary-nav--open");
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("primary-nav--open", !expanded);
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  async function copyText(text, button) {
    const status = button.parentElement.querySelector(".copy-status");
    let copied = false;

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        copied = false;
      }
    }

    if (!copied) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }
      document.body.removeChild(textarea);
    }

    if (status) {
      status.textContent = copied ? "Copied" : "Copy failed";
      window.setTimeout(() => {
        status.textContent = "";
      }, 2200);
    }
  }

  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.getAttribute("data-copy-target"));
      if (target) copyText(target.textContent || "", button);
    });
  });

  const tabs = Array.from(document.querySelectorAll("[role='tab']"));

  function activateTab(tab, focus) {
    const panelId = tab.getAttribute("data-tab");
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(item.getAttribute("data-tab"));
      if (panel) panel.hidden = !selected;
    });
    if (focus) tab.focus();
    return panelId;
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab, false));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (event.key === "ArrowRight") nextIndex = index + 1;
      if (event.key === "ArrowLeft") nextIndex = index - 1;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      activateTab(tabs[(nextIndex + tabs.length) % tabs.length], true);
    });
  });

  document.querySelectorAll("[data-copy-active-panel]").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = document.querySelector("[role='tab'][aria-selected='true']");
      const panel = selected && document.getElementById(selected.getAttribute("data-tab"));
      const code = panel && panel.querySelector("code");
      if (code) copyText(code.textContent || "", button);
    });
  });
})();
