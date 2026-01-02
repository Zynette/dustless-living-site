(() => {
  const modal = document.getElementById("termsModal");
  if (!modal) return;

  const closeBtn = modal.querySelector("[data-terms-close]");
  const openLinks = document.querySelectorAll("[data-terms-modal]");
  const focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  const getFocusable = () =>
    Array.from(modal.querySelectorAll(focusableSelector)).filter(
      (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
    );

  const openModal = (trigger) => {
    lastFocused = trigger || document.activeElement;
    modal.classList.add("is-visible");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    const focusables = getFocusable();
    if (focusables.length) {
      focusables[0].focus();
    }
  };

  const closeModal = () => {
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  };

  openLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openModal(link);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => closeModal());
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-visible")) return;
    if (event.key === "Escape") {
      closeModal();
      return;
    }
    if (event.key !== "Tab") return;

    const focusables = getFocusable();
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
