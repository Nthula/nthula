/* ============================================================
   OLORATO NTHULA — HERO SECTION
   Smooth scroll behaviour for CTA buttons
   ============================================================ */
 
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
  const scrollLinks = document.querySelectorAll('[data-scroll]');
 
  scrollLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('data-scroll');
      const target = document.getElementById(targetId);
 
      // If the target section doesn't exist yet on the page (e.g. this file
      // is being previewed on its own), let the link behave normally rather
      // than doing nothing.
      if (!target) return;
 
      event.preventDefault();
 
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
 
      // Move focus for keyboard/screen-reader users once the scroll settles.
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
 
  // Reveal each section as it scrolls into view — one orchestrated
  // moment per section, not a per-card scroll effect.
  const revealSections = document.querySelectorAll('.about, .experience');
 
  revealSections.forEach((section) => {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      section.classList.add('is-visible');
      return;
    }
 
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add('is-visible');
            observer.unobserve(section);
          }
        });
      },
      { threshold: 0.2 }
    );
 
    observer.observe(section);
  });
});
 