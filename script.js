// Mark the document as JS-enabled immediately (this file loads in <head>).
// CSS only hides reveal elements when this class exists.
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Header border on scroll ---------- */
  const header = document.getElementById("site-header");
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const iconOpen = document.getElementById("icon-open");
  const iconClose = document.getElementById("icon-close");

  const setMenu = (open) => {
    menu.classList.toggle("hidden", !open);
    iconOpen.classList.toggle("hidden", open);
    iconClose.classList.toggle("hidden", !open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Close when a link is chosen
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));

  // Close with Escape and return focus to the button
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });

  // Close if the window grows to the desktop layout
  window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => {
    if (e.matches) setMenu(false);
  });

  /* ---------- Smooth scrolling for internal links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });

  /* ---------- Reveal animations ---------- */
  const heroItems = document.querySelectorAll(".hero-reveal");
  const cards = document.querySelectorAll(".focus-card");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    [...heroItems, ...cards].forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Hero: fade in and move up on first load
  requestAnimationFrame(() => heroItems.forEach((el) => el.classList.add("is-visible")));

  // Cards: staggered entrance when scrolled into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const index = [...cards].indexOf(card);
        card.style.setProperty("--delay", `${index * 120}ms`);
        card.classList.add("is-visible");
        // Clear the delay afterwards so hover feels instant
        setTimeout(() => card.style.removeProperty("--delay"), 1200);
        observer.unobserve(card);
      });
    },
    { threshold: 0.2 }
  );
  cards.forEach((card) => observer.observe(card));

  // Safety net: never leave hero content hidden if something goes wrong
  setTimeout(() => heroItems.forEach((el) => el.classList.add("is-visible")), 3000);
});
