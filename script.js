const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));
} else {
  revealElements.forEach(el => el.classList.add("visible"));
}

const projectData = {
  cloud: {
    kicker: "Cloud Infrastructure",
    title: "Multi-zone cloud deployment",
    summary: "A team cloud-computing project using AWS and Google Cloud concepts to deploy virtual machines, secure access, and route traffic across zones.",
    built: "Virtual machines, SSH access, IAM permissions, firewall rules, instance grouping, health checks, and load-balancing configuration.",
    focus: "Cloud networking, access control, availability, troubleshooting, and team coordination.",
    challenge: "Resolving connectivity and health-check failures caused by firewall configuration, missing network tags, and cross-zone setup details.",
    takeaway: "Cloud systems depend on precise alignment between identity, network rules, service health, and deployment architecture."
  },
  python: {
    kicker: "Python & Analytics",
    title: "Library catalog data analysis",
    summary: "An object-oriented Python analysis project built in Google Colab using Pandas and Matplotlib.",
    built: "A structured analysis workflow with data preparation, class-based organization, trend exploration, and multiple visualizations.",
    focus: "Python, OOP, Pandas, data cleaning, visualization, and communicating findings.",
    challenge: "Organizing the dataset and selecting visualizations that accurately represented patterns without adding noise.",
    takeaway: "Strong analysis requires both correct code and clear explanation of what the data actually supports."
  },
  sql: {
    kicker: "Database Design",
    title: "Relational schema and advanced SQL",
    summary: "A database project centered on relational design, normalization, ER diagrams, and PostgreSQL querying.",
    built: "Normalized tables, keys and constraints, ER diagrams, and queries using joins, filters, grouping, aggregates, and subqueries.",
    focus: "PostgreSQL, pgAdmin, relational modeling, integrity, and analytical querying.",
    challenge: "Designing relationships that reduced redundancy while still supporting realistic reporting and business questions.",
    takeaway: "Good database design makes later analysis, security, and application development significantly more reliable."
  },
  siem: {
    kicker: "Security Strategy",
    title: "SIEM platform evaluation",
    summary: "A comparative evaluation of security platforms for a growing security operations environment.",
    built: "A structured comparison covering pricing, scalability, visibility, detection capabilities, operational fit, and implementation considerations.",
    focus: "SIEM/MDR strategy, vendor research, SOC requirements, and decision support.",
    challenge: "Comparing products fairly when feature packaging, pricing structures, and deployment models differ significantly.",
    takeaway: "The strongest platform is not automatically the most expensive one; fit depends on staffing, environment, workflow, and risk priorities."
  }
};

const modal = document.getElementById("project-modal");
const modalCloseButton = modal?.querySelector(".modal-close");
const fields = {
  kicker: document.getElementById("modal-kicker"),
  title: document.getElementById("modal-title"),
  summary: document.getElementById("modal-summary"),
  built: document.getElementById("modal-built"),
  focus: document.getElementById("modal-focus"),
  challenge: document.getElementById("modal-challenge"),
  takeaway: document.getElementById("modal-takeaway")
};

let modalOpener = null;
let recruiterOpener = null;

function syncBodyScroll() {
  const overlayOpen = modal?.classList.contains("open") || recruiterPanel?.classList.contains("open");
  document.body.style.overflow = overlayOpen ? "hidden" : "";
}

document.querySelectorAll(".project-open").forEach(button => {
  button.addEventListener("click", () => {
    const data = projectData[button.dataset.project];
    if (!data || !modal) return;

    Object.keys(fields).forEach(key => {
      if (fields[key]) fields[key].textContent = data[key];
    });

    modalOpener = button;
    modal.hidden = false;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    syncBodyScroll();
    modalCloseButton?.focus();
  });
});

document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));

function closeModal() {
  if (!modal?.classList.contains("open")) return;
  modal.classList.remove("open");
  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");
  syncBodyScroll();
  modalOpener?.focus();
  modalOpener = null;
}

const recruiterPanel = document.querySelector(".recruiter-panel");
const panelBackdrop = document.querySelector(".panel-backdrop");
const panelCloseButton = document.querySelector(".panel-close");

document.querySelectorAll(".recruiter-open").forEach(button => button.addEventListener("click", () => {
  if (!recruiterPanel || !panelBackdrop) return;
  recruiterOpener = button;
  recruiterPanel.hidden = false;
  panelBackdrop.hidden = false;
  recruiterPanel.classList.add("open");
  panelBackdrop.classList.add("open");
  recruiterPanel.setAttribute("aria-hidden", "false");
  syncBodyScroll();
  panelCloseButton?.focus();
}));

function closePanel() {
  if (!recruiterPanel?.classList.contains("open")) return;
  recruiterPanel.classList.remove("open");
  panelBackdrop?.classList.remove("open");
  recruiterPanel.hidden = true;
  if (panelBackdrop) panelBackdrop.hidden = true;
  recruiterPanel.setAttribute("aria-hidden", "true");
  syncBodyScroll();
  recruiterOpener?.focus();
  recruiterOpener = null;
}

panelCloseButton?.addEventListener("click", closePanel);
panelBackdrop?.addEventListener("click", closePanel);

const themeButton = document.querySelector(".theme-toggle");
let savedTheme = null;
try {
  savedTheme = localStorage.getItem("portfolio-theme");
} catch (_) {}

if (savedTheme === "light") document.documentElement.classList.add("light");

function syncThemeButton() {
  if (!themeButton) return;
  const isLight = document.documentElement.classList.contains("light");
  themeButton.setAttribute("aria-pressed", String(isLight));
  themeButton.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
}
syncThemeButton();

themeButton?.addEventListener("click", () => {
  document.documentElement.classList.toggle("light");
  syncThemeButton();
  try {
    localStorage.setItem("portfolio-theme", document.documentElement.classList.contains("light") ? "light" : "dark");
  } catch (_) {}
});

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  if (modal?.classList.contains("open")) closeModal();
  else if (recruiterPanel?.classList.contains("open")) closePanel();
});

document.querySelectorAll(".investigation-toggle").forEach(button => {
  button.addEventListener("click", () => {
    const details = button.nextElementSibling;
    if (!details) return;
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    details.hidden = expanded;
  });
});
