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
      if (link.hasAttribute("data-open-case")) return; // opens a case study instead of scrolling
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

/* ================= ABOUT SECTION (Section 02) animations ================= */
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll("#about .about-reveal, #about .about-milestone");
  if (!items.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  // Stagger milestones in order; other items use their own --delay from the markup
  document.querySelectorAll("#about .about-milestone").forEach((el, i) => {
    el.style.setProperty("--delay", `${i * 150}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("is-visible");
        // Clear the delay afterwards so hover transitions feel instant
        setTimeout(() => el.style.removeProperty("--delay"), 1200);
        observer.unobserve(el);
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => observer.observe(el));
});

/* About photo: hide a broken image so the "ON" fallback shows instead */
document.addEventListener("DOMContentLoaded", () => {
  const img = document.querySelector(".about-photo img");
  if (!img) return;
  const hide = () => img.classList.add("is-missing");
  img.addEventListener("error", hide);
  if (img.complete && img.naturalWidth === 0) hide();
});

/* ================= PROJECTS SECTION (Section 03) =================

   HOW TO ADD A PROJECT: copy one object in PROJECTS, give it a new unique "id", and fill in only the
   fields you can back up. Empty or missing fields are simply not displayed.

   - repo: the exact public repository URL. Leave it as null if there is no verified repository
     (no GitHub button is shown, and the card says so).
   - screenshot: { src: "assets/projects/your-image.png", alt: "What the image shows" }
     Use real screenshots of your own work only. Leave null to show the "preview not yet available" tile.
   - status: "Completed", "In Progress", "Planned", or "Academic project".
   - categories must match the filter buttons: Systems Analysis, Web Development, Data Analysis, IT Support.
*/
const PROJECTS = [
  {
    id: "fault-reporting",
    title: "Online Fault Reporting System",
    categories: ["Systems Analysis", "Web Development"],
    status: "Academic project",
    statusNote:
      "Final-year university project. The repository is public. The feature list below describes the design scope, not a confirmed list of fully working features.",
    summary:
      "Paper-based fault reporting in university residences can mean delays, miscommunication, and lost forms. This system provides a digital way to submit, track, and manage faults.",
    problem:
      "In university residences, faults were reported using a paper-based process. That process could involve delays, miscommunication, and lost reporting forms.",
    objective: "Develop an online system to improve the reporting and management of residence maintenance faults.",
    approach:
      "I designed the system around the people involved in reporting and resolving faults, a database for fault records, and a status workflow that follows each fault from submission to resolution.",
    contribution:
      "This is an academic project that I developed. I was involved in designing and implementing the application using the technology stack listed below.",
    tools: ["HTML", "CSS", "JavaScript", "PHP", "Laravel", "MySQL"],
    featuresHeading: "Functionality and design areas",
    features: [
      "User authentication and role-based access",
      "Fault submission with descriptions, categories, locations, and optional images",
      "Fault status tracking",
      "Maintenance workflow management",
      "Separate responsibilities for students, residence assistants, maintenance managers, department managers, and workers",
      "Database-backed fault records",
      "Feedback and notifications, where implemented"
    ],
    resultsHeading: "Expected benefits",
    results:
      "The intended benefits are more organised fault records, easier tracking, and better communication between users and maintenance personnel. No measured time savings, deployment, or efficiency improvements are claimed.",
    screenshot: null,
    repo: "https://github.com/Nthula/Online-Fault-Reporting-System",
    repoLabel: "View Source Code on GitHub",
    demo: null,
    docs: null
  },
  {
    id: "superstore-analysis",
    title: "Superstore Market Analysis",
    categories: ["Data Analysis"],
    status: "In Progress",
    statusNote:
      "The dataset is documented in the repository. The analysis itself has not been published yet, so no findings are shown.",
    summary:
      "Exploring the Sample Superstore dataset (9,994 order lines) to find sales and profitability patterns and turn them into business insights.",
    problem:
      "Retail businesses need to understand which products, regions, and customers drive sales, and where profit is being lost. This project practises that kind of analysis on a well-known sample dataset.",
    objective:
      "Explore business data to identify sales and profitability patterns and develop useful business insights.",
    approach:
      "Start by documenting the dataset and its columns, then inspect and clean the data before analysing it.",
    contribution:
      "This is a practical data analysis learning project. So far I have documented the dataset, its structure, and a data dictionary in the repository README, and the repository includes Excel versions of the data.",
    tools: ["Excel"],
    featuresHeading: "Planned analysis areas",
    features: [
      "Sales and profit trends",
      "Performance by product category and sub-category",
      "Regional performance",
      "Customer and order patterns",
      "Data cleaning and preparation",
      "Business recommendations supported by the findings"
    ],
    resultsHeading: "Intended outcomes",
    results:
      "No findings have been published yet. The intended outcome is a clear picture of sales and profitability patterns, with recommendations backed by the data.",
    screenshot: null,
    repo: "https://github.com/Nthula/Superstore-market-analysis",
    repoLabel: "Explore Analysis on GitHub",
    demo: null,
    docs: {
      label: "README: dataset description and data dictionary",
      url: "https://github.com/Nthula/Superstore-market-analysis/blob/main/README.md"
    }
  },
  {
    id: "it-service-desk",
    title: "IT Service Desk System",
    categories: ["IT Support", "Systems Analysis", "Web Development"],
    status: "Planned",
    statusNote:
      "Planned portfolio project. Nothing here is implemented yet, there is no repository, and it has not been deployed anywhere.",
    summary:
      "A proposed system for recording, assigning, prioritising, and tracking IT support tickets, so unresolved incidents and recurring problems are easier to see.",
    problem:
      "Without one place to record support requests, it is hard to see which incidents are unresolved, who is responsible for them, and which technical problems keep coming back.",
    objective:
      "Design and, as implementation progresses, develop a system for recording, assigning, prioritising, and tracking IT support tickets.",
    approach:
      "Plan the system around the service desk workflow: how a ticket is raised, categorised, prioritised, assigned, and resolved. Then define the roles and data needed to support it.",
    contribution:
      "A self-initiated portfolio project to demonstrate service desk and systems analysis thinking. It is at the planning stage.",
    tools: ["Python", "HTML", "CSS", "JavaScript", "Database (to be decided)"],
    toolsNote: "These are potential technologies. The final stack has not been confirmed.",
    featuresHeading: "Proposed features (not yet implemented)",
    features: [
      "Ticket submission",
      "Incident categorisation and priority",
      "Ticket status tracking",
      "Technician assignment",
      "User and technician roles",
      "Search and filtering",
      "Service desk reporting",
      "Dashboard showing ticket volumes and statuses"
    ],
    resultsHeading: "Business and IT value",
    results:
      "A well-designed service desk helps an organisation centralise support requests, monitor unresolved incidents, assign responsibility, and identify recurring technical problems.",
    screenshot: null,
    repo: null,
    demo: null,
    docs: null
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("proj-grid");
  const dialog = document.getElementById("proj-dialog");
  if (!grid || !dialog) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const liveStatus = document.getElementById("proj-status");

  // ---------- Helpers ----------
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = (u) => (typeof u === "string" && u.startsWith("https://") ? u : null);
  const statusClass = (s) =>
    s === "In Progress" ? "proj-status--progress" : s === "Planned" ? "proj-status--planned" : "";
  const GH_ICON =
    '<svg class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>';

  // ---------- Cards ----------
  function previewHtml(p) {
    if (p.screenshot && p.screenshot.src) {
      return `<div class="proj-preview"><img src="${esc(p.screenshot.src)}" alt="${esc(p.screenshot.alt || "")}" loading="lazy" /></div>`;
    }
    return `<div class="proj-preview"><span class="proj-preview-empty">Project preview not yet available</span></div>`;
  }

  function cardHtml(p) {
    const repo = safeUrl(p.repo);
    const tools = (p.tools || []).map((t) => `<li class="tool-badge !px-2.5 !py-1 !text-xs">${esc(t)}</li>`).join("");
    const toolsLabel = p.toolsNote ? '<p class="mb-1.5 text-xs text-muted">Potential technologies</p>' : "";
    const repoBtn = repo
      ? `<a href="${esc(repo)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary px-4 py-2.5 text-sm" aria-label="View ${esc(p.title)} on GitHub (opens in a new tab)">${GH_ICON}View on GitHub</a>`
      : `<span class="text-sm text-muted">Repository not yet available</span>`;

    return `
      ${previewHtml(p)}
      <div class="flex flex-1 flex-col p-6">
        <div class="flex flex-wrap items-center gap-2">
          <span class="proj-status ${statusClass(p.status)}">${esc(p.status)}</span>
          ${p.categories.map((c) => `<span class="text-xs font-medium text-muted">${esc(c)}</span>`).join("")}
        </div>
        <h3 class="mt-3 text-xl font-semibold text-slate-brand">${esc(p.title)}</h3>
        <p class="mt-2 text-sm leading-relaxed text-muted">${esc(p.summary)}</p>
        <div class="mt-4">${toolsLabel}<ul class="flex flex-wrap gap-1.5">${tools}</ul></div>
        <div class="mt-auto flex flex-wrap items-center gap-3 pt-6">
          <button type="button" class="btn btn-outline px-4 py-2.5 text-sm" data-open="${esc(p.id)}" aria-label="View case study: ${esc(p.title)}">View Case Study</button>
          ${repoBtn}
        </div>
      </div>`;
  }

  PROJECTS.forEach((p) => {
    const card = document.createElement("article");
    card.className = "proj-card proj-reveal flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white";
    card.dataset.categories = p.categories.join("|");
    card.innerHTML = cardHtml(p);
    // A missing screenshot file falls back to the placeholder tile
    const img = card.querySelector(".proj-preview img");
    if (img) {
      img.addEventListener("error", () => {
        img.parentElement.innerHTML = '<span class="proj-preview-empty">Project preview not yet available</span>';
      });
    }
    grid.appendChild(card);
  });
  const cards = [...grid.querySelectorAll(".proj-card")];

  // ---------- Filters ----------
  const filterButtons = document.querySelectorAll(".proj-filter");

  function hideCard(card) {
    if (card.hidden) return;
    clearTimeout(card._t);
    if (reduced) { card.hidden = true; return; }
    card.classList.add("is-filtering-out");
    card._t = setTimeout(() => { card.hidden = true; }, 200);
  }
  function showCard(card) {
    clearTimeout(card._t);
    if (!card.hidden && !card.classList.contains("is-filtering-out")) return;
    card.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove("is-filtering-out")));
  }

  function applyFilter(value) {
    let shown = 0;
    cards.forEach((card) => {
      const match = value === "all" || card.dataset.categories.split("|").includes(value);
      if (match) { shown++; showCard(card); } else { hideCard(card); }
    });
    filterButtons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.filter === value)));
    liveStatus.textContent = `Showing ${shown} of ${cards.length} projects`;
  }
  filterButtons.forEach((b) => b.addEventListener("click", () => applyFilter(b.dataset.filter)));

  // ---------- Case study dialog ----------
  const dTitle = document.getElementById("proj-dialog-title");
  const dBody = document.getElementById("proj-dialog-body");

  const para = (t) => (t ? `<p class="mt-2 text-base leading-relaxed text-muted">${esc(t)}</p>` : "");
  // Reuses the teal-bullet list style from the About section (.about-goals)
  const list = (a) =>
    a && a.length ? `<ul class="about-goals mt-2 space-y-2 text-base text-ink">${a.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "";
  const section = (title, inner) =>
    inner ? `<section class="proj-sec"><h3 class="text-base font-semibold text-slate-brand">${esc(title)}</h3>${inner}</section>` : "";

  function caseStudyHtml(p) {
    const repo = safeUrl(p.repo);
    const demo = safeUrl(p.demo);
    const docs = p.docs && safeUrl(p.docs.url) ? p.docs : null;

    const toolsInner = p.tools && p.tools.length
      ? `<ul class="mt-3 flex flex-wrap gap-2">${p.tools.map((t) => `<li class="tool-badge">${esc(t)}</li>`).join("")}</ul>${para(p.toolsNote)}`
      : "";

    const links = [];
    if (repo) links.push(`<a href="${esc(repo)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary px-5 py-2.5 text-sm">${GH_ICON}${esc(p.repoLabel || "View on GitHub")}<span class="sr-only"> (opens in a new tab)</span></a>`);
    if (demo) links.push(`<a href="${esc(demo)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline px-5 py-2.5 text-sm">View live demo<span class="sr-only"> (opens in a new tab)</span></a>`);
    const repoInner =
      (links.length ? `<div class="mt-3 flex flex-wrap gap-3">${links.join("")}</div>` : para("There is no public repository for this project yet.")) +
      (repo ? `<p class="mt-3 break-all text-sm text-muted">${esc(repo)}</p>` : "") +
      (docs ? `<p class="mt-3 text-sm"><a class="text-teal-dark underline underline-offset-4" href="${esc(docs.url)}" target="_blank" rel="noopener noreferrer">${esc(docs.label)}<span class="sr-only"> (opens in a new tab)</span></a></p>` : "");

    return (
      `<div class="proj-sec"><span class="proj-status ${statusClass(p.status)}">${esc(p.status)}</span>${para(p.statusNote)}</div>` +
      section("Problem", para(p.problem)) +
      section("Objective", para(p.objective)) +
      section("Approach", para(p.approach)) +
      section("My Contribution", para(p.contribution)) +
      section("Tools and Technologies", toolsInner) +
      section(p.featuresHeading || "Features", list(p.features)) +
      section(p.resultsHeading || "Results and Learning", para(p.results)) +
      section("Repository and Documentation", repoInner)
    );
  }

  function openCaseStudy(id) {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return;
    dTitle.textContent = p.title;
    dBody.innerHTML = caseStudyHtml(p);
    dBody.scrollTop = 0;
    document.body.classList.add("proj-lock");
    dialog.showModal();
  }

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open]");
    if (btn) openCaseStudy(btn.dataset.open);
  });
  // Links elsewhere on the page (e.g. Skills) can open a case study: <a href="#projects" data-open-case="project-id">
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-open-case]");
    if (!link) return;
    e.preventDefault();
    openCaseStudy(link.dataset.openCase);
  });
  document.getElementById("proj-dialog-close").addEventListener("click", () => dialog.close());
  // Clicking the dimmed backdrop closes the dialog
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => document.body.classList.remove("proj-lock"));

  // ---------- Scroll-triggered entrance ----------
  const revealEls = document.querySelectorAll("#projects .proj-reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const i = cards.indexOf(el);
        if (i >= 0) el.style.setProperty("--delay", `${(i % 3) * 120}ms`);
        el.classList.add("is-visible");
        setTimeout(() => el.style.removeProperty("--delay"), 1200);
        io.unobserve(el);
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
});

/* ================= SKILLS SECTION (Section 04) ================= */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("skills-grid");
  if (!grid) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const panels = [...grid.querySelectorAll(".skills-panel")];
  const buttons = document.querySelectorAll(".skill-filter");
  const liveStatus = document.getElementById("skills-status");

  // ---------- Filter (a panel can belong to several groups, set in data-groups) ----------
  function hidePanel(p) {
    if (p.hidden) return;
    clearTimeout(p._t);
    if (reduced) { p.hidden = true; return; }
    p.classList.add("is-filtering-out");
    p._t = setTimeout(() => { p.hidden = true; }, 200);
  }
  function showPanel(p) {
    clearTimeout(p._t);
    if (!p.hidden && !p.classList.contains("is-filtering-out")) return;
    p.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => p.classList.remove("is-filtering-out")));
  }
  buttons.forEach((b) =>
    b.addEventListener("click", () => {
      const value = b.dataset.filter;
      let shown = 0;
      panels.forEach((p) => {
        const match = value === "all" || p.dataset.groups.split(" ").includes(value);
        if (match) { shown++; showPanel(p); } else { hidePanel(p); }
      });
      buttons.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      liveStatus.textContent = `Showing ${shown} of ${panels.length} skill groups`;
    })
  );

  // ---------- Scroll-triggered entrance ----------
  const items = document.querySelectorAll("#skills .skills-reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const i = panels.indexOf(el);
        if (i >= 0) el.style.setProperty("--delay", `${(i % 2) * 120}ms`);
        el.classList.add("is-visible");
        setTimeout(() => el.style.removeProperty("--delay"), 1200);
        io.unobserve(el);
      });
    },
    { threshold: 0.1 }
  );
  items.forEach((el) => io.observe(el));
});

/* ================= EXPERIENCE SECTION (Section 05) =================

   HOW TO UPDATE: edit the EXPERIENCE array below. Any field that is empty, null, or [] is simply not
   shown on the page, so nothing unconfirmed appears publicly.

   CURRENT ROLE - fill these in once verified:
   - organisation: the employer's name (currently null, so it is hidden)
   - dates: replace "2026 – Present" with the exact month once checked against your records, e.g. "May 2026 – Present"
   - responsibilities: add only duties you actually perform now. Suggested areas to confirm (do not copy
     any you do not do): hardware and software troubleshooting, end-user technical support, network
     connectivity support, IT equipment and device management, software installation and configuration,
     technical issue documentation, IT asset administration, user account or access support.
   - tools / skills: add only items supported by those confirmed duties.
   - contributions: optional. Each is { problem, action, outcome }. Only add real ones, with no invented figures.
   - link: optional { label, href } to a related project, only if the connection is genuine.
*/
const EXPERIENCE = [
  {
    id: "it-officer",
    current: true,
    title: "IT Officer",
    organisation: null, // PLACEHOLDER: employer name not yet confirmed (hidden until filled in)
    department: null,
    type: "Current role",
    dates: "2026 – Present", // PLACEHOLDER: replace with the verified start month
    duration: null,
    overview:
      "I currently work as an IT Officer, developing practical experience in supporting technology and organisational IT operations.",
    responsibilities: [], // PLACEHOLDER: add confirmed duties, e.g. [{ items: ["Duty one", "Duty two"] }]
    tools: [],
    skills: [],
    contributions: [],
    development:
      "I am continuing to build practical IT experience and a broader understanding of how technology supports organisational operations.",
    link: null
  },
  {
    id: "bob-attachment",
    current: false,
    title: "ICT Industrial Attachment",
    organisation: "Bank of Botswana",
    department: "ICT",
    unit: null, // PLACEHOLDER: official unit name (Collaboration Unit / Mobile Device Management and Collaboration Unit) not yet confirmed
    type: "Industrial attachment",
    dates: null, // PLACEHOLDER: exact start and end dates not provided, so none are shown
    duration: "Two-month industrial attachment, University of Botswana winter semester",
    overview:
      "I completed a two-month industrial attachment in the ICT function at the Bank of Botswana as part of my studies. It gave me supervised exposure to IT support, service delivery, device compliance, telecommunications systems, and technical assistance. This was an attachment, not employment at the Bank.",
    responsibilities: [
      {
        group: "IT troubleshooting and operational support",
        items: [
          "Assisted with troubleshooting network and technical issues to support day-to-day banking operations.",
          "Supported users with relevant technical issues."
        ]
      },
      {
        group: "Device compliance and IT security",
        items: [
          "Performed device compliance checks and supported IT security management using Microsoft Intune, to help ensure devices met organisational policies."
        ]
      },
      {
        group: "Telecommunications systems",
        items: [
          "Assisted with configuring and managing telecommunications systems using the Man3000 Telephone Management System.",
          "Supported users with related telecommunications issues."
        ]
      },
      {
        group: "Technical and event support",
        items: ["Assisted with event setup and technical equipment."]
      }
    ],
    tools: ["Microsoft Intune", "Man3000 Telephone Management System"],
    skills: [
      "IT support and troubleshooting",
      "End-user assistance",
      "Device compliance checking",
      "IT security awareness",
      "Telecommunications system support",
      "Technical communication",
      "Service delivery",
      "Working within an organisational IT environment"
    ],
    contributions: [],
    development: null,
    link: null
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("exp-list");
  if (!list) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const has = (v) => (Array.isArray(v) ? v.length > 0 : Boolean(v));
  const heading = (t) => `<h4 class="mt-6 text-sm font-semibold text-slate-brand">${esc(t)}</h4>`;
  const tags = (arr) => `<ul class="mt-2 flex flex-wrap gap-2">${arr.map((t) => `<li class="skill-tag">${esc(t)}</li>`).join("")}</ul>`;

  function entryHtml(e) {
    const orgLine = [e.organisation, e.department].filter(Boolean).map(esc).join(", ");
    const when = e.dates || e.duration;

    const resp = has(e.responsibilities)
      ? heading("Key responsibilities") +
        e.responsibilities
          .map(
            (g) =>
              (g.group ? `<p class="mt-3 text-sm font-medium text-ink">${esc(g.group)}</p>` : "") +
              `<ul class="exp-bullets ${g.group ? "mt-1.5" : "mt-3"} space-y-1.5 text-sm leading-relaxed text-muted">${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`
          )
          .join("")
      : "";

    const contrib = has(e.contributions)
      ? heading("Contributions") +
        e.contributions
          .map(
            (c) =>
              `<dl class="mt-3 space-y-1 text-sm leading-relaxed text-muted">` +
              [["Problem", c.problem], ["Action", c.action], ["Outcome", c.outcome]]
                .filter(([, v]) => v)
                .map(([k, v]) => `<div><dt class="inline font-medium text-ink">${k}: </dt><dd class="inline">${esc(v)}</dd></div>`)
                .join("") +
              `</dl>`
          )
          .join("")
      : "";

    const link =
      e.link && e.link.href && e.link.label
        ? `<p class="mt-6 text-sm"><a class="text-teal-dark underline decoration-teal-brand/40 underline-offset-4 hover:decoration-teal-dark" href="${esc(e.link.href)}">${esc(e.link.label)}</a></p>`
        : "";

    return `
      <span class="exp-marker" aria-hidden="true"></span>
      <article class="exp-card rounded-xl border border-slate-200 bg-white p-6 sm:p-7">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span class="exp-badge ${e.current ? "exp-badge--current" : ""}">${esc(e.type)}</span>
          ${when ? `<span class="text-sm font-medium text-teal-dark">${esc(when)}</span>` : ""}
        </div>
        <h3 class="mt-3 text-xl font-semibold text-slate-brand">${esc(e.title)}</h3>
        ${orgLine ? `<p class="mt-1 text-base text-ink">${orgLine}</p>` : ""}
        ${e.overview ? `<p class="mt-4 text-sm leading-relaxed text-muted sm:text-base">${esc(e.overview)}</p>` : ""}
        ${resp}
        ${has(e.tools) ? heading("Tools used") + tags(e.tools) : ""}
        ${has(e.skills) ? heading("Skills demonstrated") + tags(e.skills) : ""}
        ${contrib}
        ${e.development ? heading("Professional development") + `<p class="mt-2 text-sm leading-relaxed text-muted">${esc(e.development)}</p>` : ""}
        ${link}
      </article>`;
  }

  // Replace the no-JavaScript fallback with the generated entries
  list.innerHTML = "";
  EXPERIENCE.forEach((e) => {
    const li = document.createElement("li");
    li.className = `exp-item${e.current ? " exp-item--current" : ""}`;
    li.innerHTML = entryHtml(e);
    list.appendChild(li);
  });

  // ---------- Scroll-triggered entrance ----------
  const items = [...document.querySelectorAll("#experience .exp-reveal, #experience .exp-item")];
  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const entries = [...list.querySelectorAll(".exp-item")];
  const io = new IntersectionObserver(
    (obs) => {
      obs.forEach((o) => {
        if (!o.isIntersecting) return;
        const el = o.target;
        const i = entries.indexOf(el);
        if (i >= 0) el.style.setProperty("--delay", `${i * 150}ms`);
        el.classList.add("is-visible");
        setTimeout(() => el.style.removeProperty("--delay"), 1200);
        io.unobserve(el);
      });
    },
    { threshold: 0.1 }
  );
  items.forEach((el) => io.observe(el));
});

/* ================= CONTACT SECTION (Section 06) ================= */
document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("contact");
  if (!section) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- LinkedIn guard: never show a placeholder link ----------
  const linkedinItem = document.getElementById("contact-linkedin");
  if (linkedinItem) {
    const a = linkedinItem.querySelector("a");
    const real = a && /^https:\/\/(www\.)?linkedin\.com\//.test(a.href) && !a.href.includes("YOUR-PROFILE-HERE");
    if (!real) linkedinItem.hidden = true;
  }

  // ---------- Copy email ----------
  const copyBtn = document.getElementById("copy-email");
  const status = document.getElementById("copy-status");
  const emailText = document.getElementById("contact-email-text");
  let clearTimer;

  function say(message, kind) {
    status.textContent = message;
    status.className = `mt-3 min-h-[1.25rem] text-sm ${kind === "success" ? "is-success" : kind === "error" ? "is-error" : "text-muted"}`;
    clearTimeout(clearTimer);
    clearTimer = setTimeout(() => { status.textContent = ""; status.className = "mt-3 min-h-[1.25rem] text-sm text-muted"; }, 6000);
  }

  // If copying is not possible, highlight the visible address so it can be copied by hand
  function fallback() {
    if (emailText && window.getSelection) {
      const range = document.createRange();
      range.selectNodeContents(emailText);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    say("Couldn't copy automatically. The address is selected above, or use the Email Me button.", "error");
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email;
      if (!navigator.clipboard || !window.isSecureContext) { fallback(); return; }
      try {
        await navigator.clipboard.writeText(email);
        say("Email copied", "success"); // only after the copy has actually succeeded
      } catch (err) {
        fallback();
      }
    });
  }

  // ---------- Scroll-triggered entrance ----------
  const items = section.querySelectorAll(".contact-reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("is-visible");
        setTimeout(() => el.style.removeProperty("--delay"), 1200);
        io.unobserve(el);
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
});