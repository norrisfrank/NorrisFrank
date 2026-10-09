const fs = require('fs');

const baseHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>{{TITLE}} | Norris Frank</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<style>
:root {
  --bg: #0c0c0c; --ink: #f0f0f0; --ink-dim: rgba(240, 240, 240, 0.6); --ink-faint: rgba(240, 240, 240, 0.15);
  --sans: 'Geist', system-ui, -apple-system, sans-serif; --mono: 'Geist Mono', monospace; --accent: #e2e2e2;
}
[data-theme="light"] {
  --bg: #F4F1E8; --ink: #111111; --ink-dim: rgba(17, 17, 17, 0.6); --ink-faint: rgba(17, 17, 17, 0.15); --accent: #222222;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
* { font-family: var(--sans); }
html, body { margin: 0; padding: 0; background: var(--bg); color: var(--ink); overflow-x: hidden; scroll-behavior: smooth; transition: background 0.3s ease, color 0.3s ease; }

.back-btn { position: fixed; top: 30px; left: 24px; z-index: 60; display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: var(--bg); border: 1px solid var(--ink-faint); color: var(--ink); text-decoration: none; font-size: 20px; transition: all 0.3s ease; backdrop-filter: blur(8px); }
.back-btn:hover { background: var(--ink); color: var(--bg); }
@media(min-width: 768px) { .back-btn { left: 40px; top: 40px; } }

.burger-wrapper { position: fixed; top: 16px; right: 0; z-index: 50; display: flex; justify-content: flex-end; align-items: center; gap: 16px; }
@media (min-width: 768px) { .burger-wrapper { top: 27px; } }
.burger-wrapper .inner { padding-right: 20px; display: flex; align-items: center; gap: 16px; }
@media (min-width: 768px) { .burger-wrapper .inner { padding-right: 40px; } }
.theme-toggle { background: var(--bg); border: 1px solid var(--ink-faint); color: var(--ink); width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
.theme-toggle:hover { background: var(--ink); color: var(--bg); }
.burger-btn { width: 59px; height: 59px; border-radius: 50%; border: 1px solid var(--ink-faint); cursor: pointer; display: flex; flex-direction: column; gap: 4px; align-items: center; justify-content: center; background: var(--bg); transition: background 0.4s ease, border-color 0.4s ease; }
.burger-btn:hover { background: var(--ink-faint); border-color: var(--ink-dim); }
.burger-btn .bar { display: block; width: 24px; height: 2px; background: var(--ink); transition: all 0.3s ease; }
.burger-btn.open { background: var(--ink); border-color: var(--ink); }
.burger-btn.open .bar { background: var(--bg); }
.burger-btn.open .bar:first-child { transform: rotate(45deg) translate(2px, 2px); }
.burger-btn.open .bar:last-child { transform: rotate(-45deg) translate(2px, -2px); }
.menu-panel { position: fixed; z-index: 49; left: 8px; right: 8px; border-radius: 20px; background: var(--bg); padding: 90px 32px 32px 32px; display: flex; flex-direction: column; justify-content: space-between; transition: top 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease; top: -600px; opacity: 0; pointer-events: none; border: 1px solid var(--ink-faint); box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
@media (min-width: 768px) { .menu-panel { left: auto; right: 7px; width: 420px; padding: 60px; } }
.menu-panel.open { top: 0; opacity: 1; pointer-events: auto; }
@media (min-width: 768px) { .menu-panel.open { top: 7px; } }
.menu-panel nav { display: flex; flex-direction: column; gap: 12px; }
.menu-panel nav a { color: var(--ink); font-size: 32px; font-weight: 500; text-decoration: none; line-height: 130%; transition: opacity 0.3s ease; font-family: var(--sans); }
.menu-panel nav a:hover { opacity: 0.6; }
.menu-contact { display: flex; flex-direction: column; gap: 20px; margin-top: 40px; }
.menu-email { color: var(--ink-dim); font-size: 16px; text-decoration: none; transition: color 0.3s ease; font-family: var(--mono); }
.menu-email:hover { color: var(--ink); }
.menu-socials { display: flex; flex-direction: column; gap: 12px; }
.menu-socials a { color: var(--ink-dim); font-size: 14px; text-decoration: underline; font-family: var(--mono); text-underline-offset: 4px; transition: color 0.3s ease; }
.menu-socials a:hover { color: var(--ink); }

.project-hero { width: 100%; position: relative; background: var(--bg); display:flex; justify-content:center; align-items:center; padding-top:100px; }
.project-hero img { width: 100%; max-width: 1400px; height: auto; max-height: 80vh; object-fit: contain; }

.project-content { display: grid; grid-template-columns: 1fr; gap: 40px; padding: 60px 24px; max-width: 1600px; margin: 0 auto; }
@media(min-width: 900px) { .project-content { grid-template-columns: 1.2fr 1fr; gap: 80px; padding: 120px 80px; } }
.project-details h1 { font-size: clamp(40px, 6vw, 72px); letter-spacing: -0.02em; margin-bottom: 24px; line-height: 1.1; }
.project-meta { font-family: var(--mono); font-size: 13px; color: var(--ink-dim); margin-bottom: 32px; display: flex; flex-direction: column; gap: 8px; }
.project-desc { font-size: 17px; line-height: 1.8; font-weight: 300; margin-bottom: 40px; color: var(--ink); }
.project-links { display: flex; gap: 16px; }
.project-links a { display: inline-block; padding: 12px 24px; border: 1px solid var(--ink-faint); border-radius: 4px; color: var(--ink); text-decoration: none; font-family: var(--mono); font-size: 13px; transition: background 0.3s, border-color 0.3s; }
.project-links a:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); }

.project-side-images { display: grid; grid-template-columns: 1fr; gap: 40px; }
.project-side-img { aspect-ratio: 16/9; overflow: hidden; border-radius: 8px; border: 1px solid var(--ink-faint); display: flex; justify-content: center; align-items: center; background: var(--ink-faint); cursor: zoom-in; }
.expandable-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.project-side-img:hover .expandable-img { transform: scale(1.04); }

.modal { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 10000; display: flex; justify-content: center; align-items: center; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; padding: 40px; }
.modal.active { opacity: 1; pointer-events: auto; }
.modal img { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 4px; }
.modal-close { position: absolute; top: 30px; right: 40px; background: none; border: none; color: #fff; font-size: 40px; cursor: pointer; font-family: var(--sans); line-height: 1; transition: opacity 0.3s; }
.modal-close:hover { opacity: 0.7; }
</style>
</head>
<body>

<a href="projects.html" class="back-btn">&larr;</a>

<div class="burger-wrapper">
  <div class="inner">
    <button class="theme-toggle" id="theme-btn" aria-label="Toggle Theme">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
    </button>
    <button class="burger-btn" id="burger-btn" aria-label="Open menu">
      <span class="bar"></span>
      <span class="bar"></span>
    </button>
  </div>
</div>
<div class="menu-panel" id="menu-panel">
  <nav>
    <a href="index.html">Home</a>
    <a href="projects.html">Projects</a>
    <a href="art.html">Art</a>
  </nav>
  <div class="menu-contact">
    <div class="menu-socials">
      <a href="Norris Frank Prf CV.pdf" target="_blank" download>Download CV (PDF)</a>
      <a href="https://github.com/norrisfrank" target="_blank">GitHub Profile</a>
    </div>
    <div style="margin-top:24px;">
      <a href="mailto:norrisfrankmeyo@gmail.com" class="menu-email">norrisfrankmeyo@gmail.com</a><br/>
      <a href="tel:+254757494163" class="menu-email" style="display:inline-block; margin-top:8px;">+254 757 494 163</a>
    </div>
  </div>
</div>

<div class="project-hero">
  <img src="{{IMG1}}" alt="{{TITLE}}" />
</div>

<div class="project-content">
  <div class="project-details">
    <h1>{{TITLE}}</h1>
    <div class="project-meta">
      <span>{{META1}}</span>
      <span>{{META2}}</span>
    </div>
    <div class="project-desc">{{DESC}}</div>
    <div class="project-links">
      <a href="{{LIVE}}" target="_blank">Live Site</a>
      {{GITHUB_BTN}}
    </div>
  </div>
  <div class="project-side-images">
    {{SIDE_IMAGES}}
  </div>
</div>

<div class="modal" id="image-modal" onclick="closeModal(event)">
  <button class="modal-close" onclick="closeModal(event)">&times;</button>
  <img src="" id="modal-img" alt="Expanded view" onclick="event.stopPropagation()"/>
</div>

<script>
  const burgerBtn = document.getElementById('burger-btn');
  const menuPanel = document.getElementById('menu-panel');
  let menuOpen = false;
  burgerBtn.addEventListener('click', function() {
    menuOpen = !menuOpen;
    if (menuOpen) { burgerBtn.classList.add('open'); menuPanel.classList.add('open'); }
    else { burgerBtn.classList.remove('open'); menuPanel.classList.remove('open'); }
  });

  const themeBtn = document.getElementById('theme-btn');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  }
  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'light') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      themeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      themeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    }
  });

  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  function openModal(src) {
    if (!src) return;
    modalImg.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(e) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { modalImg.src = ''; }, 300);
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
</script>
</body>
</html>`;

const projects = [
  {
    id: "norryghosty",
    title: "NORRY GHOSTY // OSINT",
    meta1: "Security & OSINT Tooling",
    meta2: "Stack: Python, Node.js, OSINT APIs",
    desc: "<p>A specialized open-source intelligence platform engineered to aggregate, parse, and visualize public records and domain registries securely. Built for deep investigations, the system relies on extensive data querying covering WHOIS lookups, historical DNS records, and subdomain enumeration. The architecture securely pipes intelligence data through a Node.js intermediary layer, ensuring the payload remains untampered before hitting the client. I implemented mechanisms to handle and circumvent strict rate limits dynamically, optimizing the intelligence gathering flow. Visually, the data is mapped and filtered to provide investigators with an intuitive, interconnected view of digital footprints without exposing the backend to injection vulnerabilities.</p>",
    live: "https://norry-ghosty-2-0.onrender.com/",
    github: true,
    img1: "Screenshots/norryghosty1.png",
    img2: "Screenshots/norryghosty2.png",
    img3: "Screenshots/norryghosty3.png"
  },
  {
    id: "pressdpretty",
    title: "Press'dPretty",
    meta1: "E-commerce & Custom Product Platform",
    meta2: "Stack: Node.js/Express, PostgreSQL, HTML/CSS",
    desc: "<p>A fully integrated storefront architecture built from scratch for browsing and purchasing custom press-on nail collections. The most complex aspect of this build was engineering the state management for customized sizing profiles and shopping carts natively. The PostgreSQL database schema was deeply normalized to handle infinite variations in nail sizes, collections, and custom bespoke orders without creating data redundancy. I developed a robust REST API in Express.js that securely handles customer session data and profiles, preparing the architecture for seamless third-party payment gateway integration like M-Pesa or Stripe. The user interface was rigorously tested and crafted with a mobile-first CSS architecture prioritizing conversions and fluid user experiences.</p>",
    live: "https://pressdpretty.onrender.com",
    github: true,
    img1: "Screenshots/Pressdpretty1.png",
    img2: "Screenshots/Pressdpretty2.png",
    img3: "Screenshots/Pressdpretty3.png"
  },
  {
    id: "sneko",
    title: "Sneko",
    meta1: "AI-Powered Game & Neural Network System",
    meta2: "Stack: JavaScript, TensorFlow.js, Deep Q-Learning",
    desc: "<p>An ambitious project intersecting game development and artificial intelligence, built entirely in JavaScript. I engineered the game loop and mechanics, integrating TensorFlow.js directly into the browser to run deep Q-learning inference locally. This allowed the AI to maintain 60 FPS gameplay without costly server roundtrips. I spent weeks tuning the state vectors and reward functions—assigning positive weights for eating food and heavy penalties for wall collisions. Beyond just gameplay, I developed a sophisticated real-time telemetry dashboard alongside the canvas. This dashboard graphs epsilon decay, loss metrics, and real-time neural activations, providing an transparent look into the machine learning training process.</p>",
    live: "https://sneko-rdgh.onrender.com/",
    github: true,
    img1: "Screenshots/sneko1.png",
    img2: "Screenshots/sneko2.png",
    img3: "Screenshots/sneko3.png"
  },
  {
    id: "qrstudio",
    title: "QR Studio",
    meta1: "Dynamic QR Generation Platform",
    meta2: "Stack: Node.js, Express.js, PostgreSQL",
    desc: "<p>A high-performance utility platform for dynamic SVG and PNG rendering based on complex user payloads. The backend engine securely encodes various data types—including raw URLs, WiFi configurations, and VCards—into error-corrected matrices (supporting L, M, Q, and H tolerance levels). To ensure instantaneous delivery during high traffic, I implemented an aggressive caching mechanism within the Node.js server that serves frequently generated codes directly from memory without triggering re-renders. The PostgreSQL database acts as the source of truth, meticulously tracking scan counts, creation histories, and user configurations, tied together via a clean Express router.</p>",
    live: "https://qr-studio-eqqa.onrender.com/",
    github: true,
    img1: "Screenshots/QR1.png",
    img2: "Screenshots/QR2.png",
    img3: "Screenshots/QR3.png"
  },
  {
    id: "oldportfolio",
    title: "Old Portfolio",
    meta1: "Personal Technical Showcase",
    meta2: "Stack: Node.js, Express.js, React, Tailwind CSS",
    desc: "<p>My previous technical showcase that marked a significant transition in my tech stack, moving from static HTML setups to a fully reactive component architecture using React. The frontend utilizes a Tailwind CSS utility-first approach that allowed for rapid prototyping and highly consistent design systems. Behind the scenes, the Express backend functions as a headless CMS, independently delivering case study JSON data and dynamically rendering project pages. This project was also my testing ground for CI/CD integrations, featuring a fully automated deployment pipeline using GitHub Actions that triggers builds and live deployments to Render instantaneously upon merging into the main branch.</p>",
    live: "https://portfolio-backend-92a8.onrender.com/",
    github: true,
    img1: "Screenshots/Old Portfolio1.png",
    img2: "Screenshots/old portfolio2.png",
    img3: "Screenshots/old portfolio3.png"
  },
  {
    id: "titancargo",
    title: "Titan Cargo",
    meta1: "Logistics & Cargo Management API",
    meta2: "Stack: Node.js, Express, PostgreSQL",
    desc: "<p>An enterprise-grade logistics platform engineered to solve the complex algorithms of shipment tracking and cargo distribution. The core database schema handles multi-layered relationships between waypoints, shipments, dispatchers, and drivers. Security was paramount, leading me to implement a rigorous JWT authentication flow with strict Role-Based Access Control (RBAC)—ensuring that drivers can only update the statuses of their specifically assigned cargo. I focused heavily on real-time state synchronization and comprehensive input validation to prevent injection attacks on tracking endpoints, ensuring that cargo data remains immutable and transparent for corporate clients.</p>",
    live: "https://titan-backend-igvr.onrender.com/",
    github: true,
    img1: "Screenshots/titan1.png",
    img2: "Screenshots/titan2.png",
    img3: "Screenshots/titan3.png"
  },
  {
    id: "g2travel",
    title: "G2 Travel",
    meta1: "Upcoming Traveling & Tours Site",
    meta2: "Stack: Fullstack Web App",
    desc: "<p>A comprehensive upcoming platform designed for booking tours, exploring destinations, and managing travel itineraries. The backend architecture is heavily focused on the complexities of calendar management—specifically preventing double-bookings and managing overlapping availabilities across different timezones. I am currently integrating a specialized search engine for destination discovery and mapping complex relational tables between user itineraries and dynamically priced tour packages.</p>",
    live: "#",
    github: false,
    img1: "Screenshots/G2 Travel.png"
  },
  {
    id: "liquorcom",
    title: "LiquorCom",
    meta1: "Upcoming E-commerce Platform",
    meta2: "Stack: Fullstack Web App",
    desc: "<p>An e-commerce platform specifically tailored for online liquor sales. The primary engineering focus here is regulatory compliance and robust security. I am currently building specialized age-gate middleware that verifies user credentials before permitting access to restricted routes. The backend is being designed to handle real-time inventory management, ensuring atomic database transactions during high-traffic flash sales so that stock levels remain strictly accurate and no race conditions occur during checkout.</p>",
    live: "#",
    github: false,
    img1: "Screenshots/LiquorCom.png"
  },
  {
    id: "grsurveyors",
    title: "GR Surveyors",
    meta1: "Upcoming Enterprise Booking System",
    meta2: "Stack: HTML/CSS, JS, Node.js",
    desc: "<p>An enterprise-facing platform for scheduling and managing specialized risk surveys and asset valuation audits across East and Southern Africa. This project requires complex, multi-step form handling and strict SLA tracking algorithms. I am structuring a secure, NDA-compliant data pipeline for corporate clients, complemented by a dashboard system that allows lead surveyors to manage, assign, and review risk surveys remotely across diverse African regions.</p>",
    live: "#",
    github: false,
    img1: "Screenshots/GR Surveyors.png"
  }
];

projects.forEach(p => {
  let html = baseHtml
    .replace(/\{\{TITLE\}\}/g, p.title)
    .replace(/\{\{META1\}\}/g, p.meta1)
    .replace(/\{\{META2\}\}/g, p.meta2)
    .replace(/\{\{DESC\}\}/g, p.desc)
    .replace(/\{\{LIVE\}\}/g, p.live)
    .replace(/\{\{IMG1\}\}/g, p.img1);
    
  if (p.github) {
    html = html.replace('{{GITHUB_BTN}}', '<a href="https://github.com/norrisfrank" target="_blank">GitHub</a>');
  } else {
    html = html.replace('{{GITHUB_BTN}}', '');
  }
  
  let sideImages = '';
  if (p.img2) {
    sideImages += `<div class="project-side-img" onclick="openModal('${p.img2}')"><img src="${p.img2}" class="expandable-img"/></div>`;
  }
  if (p.img3) {
    sideImages += `<div class="project-side-img" onclick="openModal('${p.img3}')"><img src="${p.img3}" class="expandable-img"/></div>`;
  }
  html = html.replace('{{SIDE_IMAGES}}', sideImages);
  
  fs.writeFileSync(`project-${p.id}.html`, html, 'utf-8');
});
console.log('Project pages generated.');
