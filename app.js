// Portfolio Dynamic Controller for Abhishek Hingmire
(function () {
  'use strict';

  // Load data from localStorage or fallback to DEFAULT_PORTFOLIO_DATA
  function getPortfolioData() {
    try {
      const stored = localStorage.getItem('portfolio_data');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error loading localStorage data:', e);
    }
    return window.DEFAULT_PORTFOLIO_DATA || {};
  }

  const data = getPortfolioData();

  // Apply custom accent colors if defined
  if (data.customization) {
    if (data.customization.accentColor) {
      document.documentElement.style.setProperty('--champagne', data.customization.accentColor);
    }
    if (data.customization.accentTeal) {
      document.documentElement.style.setProperty('--teal', data.customization.accentTeal);
    }
  }

  // 1. Render Navigation & Logo
  const logoEl = document.getElementById('site-logo');
  if (logoEl && data.profile) {
    logoEl.innerHTML = `&lt;<span>${data.profile.firstName || 'Abhishek'}</span>/&gt;`;
  }

  // 2. Render Hero
  const eyebrowEl = document.getElementById('hero-eyebrow');
  if (eyebrowEl && data.profile) {
    eyebrowEl.textContent = data.profile.eyebrow || 'Mumbai, India — Available Immediately';
  }

  const nameEl = document.getElementById('hero-name');
  if (nameEl && data.profile) {
    nameEl.innerHTML = `${data.profile.firstName || 'Abhishek'}<br><em>${data.profile.lastName || 'Hingmire'}</em>`;
  }

  const heroMetaEl = document.getElementById('hero-meta');
  if (heroMetaEl && data.profile && Array.isArray(data.profile.heroMeta)) {
    heroMetaEl.innerHTML = data.profile.heroMeta
      .map(
        (item) => `
        <div>
          <strong>${item.title}</strong>
          ${item.subtitle}
        </div>
      `
      )
      .join('');
  }

  // Hero & About Profile Photos & Badges
  const heroImgEl = document.getElementById('hero-profile-img');
  const aboutImgEl = document.getElementById('about-profile-img');
  const heroImgWrap = document.querySelector('.hero-image-wrap');
  const aboutImgWrap = document.querySelector('.about-image-wrap');

  if (data.profile) {
    const photoSrc = data.profile.photo || 'profile.jpg';
    if (heroImgEl) heroImgEl.src = photoSrc;
    if (aboutImgEl) aboutImgEl.src = photoSrc;

    if (!data.profile.photo) {
      if (heroImgWrap) heroImgWrap.style.display = 'none';
      if (aboutImgWrap) aboutImgWrap.style.display = 'none';
    } else {
      if (heroImgWrap) heroImgWrap.style.display = 'flex';
      if (aboutImgWrap) aboutImgWrap.style.display = 'flex';
    }
  }

  const badgeTextEl = document.getElementById('hero-badge-text');
  const aboutBadgeTextEl = document.getElementById('about-badge-text');
  if (data.profile) {
    if (badgeTextEl) badgeTextEl.textContent = data.profile.photoBadge || 'Available for Hire';
    if (aboutBadgeTextEl) aboutBadgeTextEl.textContent = 'BFSI & BI Specialist';
  }

  // 3. Render About Text & Stats
  const aboutTextContainer = document.getElementById('about-text-container');
  if (aboutTextContainer && data.profile && Array.isArray(data.profile.aboutText)) {
    aboutTextContainer.innerHTML = data.profile.aboutText
      .map((p) => `<p>${p}</p>`)
      .join('');
  }

  const aboutStatsContainer = document.getElementById('about-stats-container');
  if (aboutStatsContainer && data.profile && Array.isArray(data.profile.stats)) {
    aboutStatsContainer.innerHTML = data.profile.stats
      .map(
        (st) => `
        <div class="stat-card">
          <div class="num">${st.num}</div>
          <div class="label">${st.label}</div>
        </div>
      `
      )
      .join('');
  }

  // 4. Render Skills Marquee & Categorized Cards
  const marqueeContainer = document.getElementById('skills-marquee');
  if (marqueeContainer && Array.isArray(data.marqueeSkills)) {
    const listHtml = data.marqueeSkills.map((s) => `<span>${s}</span>`).join('');
    // Duplicate to form seamless infinite loop
    marqueeContainer.innerHTML = listHtml + listHtml;
  }

  const skillCatsContainer = document.getElementById('skill-categories-container');
  if (skillCatsContainer && Array.isArray(data.skillCategories)) {
    skillCatsContainer.innerHTML = data.skillCategories
      .map(
        (cat) => `
        <div class="skill-category-card">
          <div class="skill-cat-title">${cat.category}</div>
          <div class="skill-tags">
            ${cat.skills.map((s) => `<span class="tag">${s}</span>`).join('')}
          </div>
        </div>
      `
      )
      .join('');
  }

  // 5. Render Experience Timeline
  const timelineContainer = document.getElementById('experience-timeline');
  if (timelineContainer && Array.isArray(data.experiences)) {
    timelineContainer.innerHTML = data.experiences
      .map(
        (exp) => `
        <div class="t-item">
          <div class="t-date">${exp.date} · ${exp.location || 'India'}</div>
          <h3>${exp.role}</h3>
          <div class="t-company">${exp.company} — ${exp.tagline || ''}</div>
          <ul>
            ${exp.bullets.map((b) => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      `
      )
      .join('');
  }

  // 6. Render Projects Grid
  const projectsContainer = document.getElementById('projects-grid');
  if (projectsContainer && Array.isArray(data.projects)) {
    projectsContainer.innerHTML = data.projects
      .map(
        (proj, idx) => `
        <div class="proj-card reveal">
          <div>
            <div class="proj-index">Project 0${idx + 1} — ${proj.category || 'Featured'}</div>
            <h3>${proj.title}</h3>
            <p>${proj.description}</p>
          </div>
          <div>
            <div class="proj-tags">
              ${(proj.tools || []).map((t) => `<span>${t}</span>`).join('')}
            </div>
            <a class="proj-link" href="${proj.linkUrl || '#'}" target="_blank" rel="noopener noreferrer">
              ${proj.linkText || 'Explore project →'}
            </a>
          </div>
        </div>
      `
      )
      .join('');
  }

  // 7. Render Education & Certifications
  const credCertsContainer = document.getElementById('cred-certs-list');
  if (credCertsContainer && Array.isArray(data.certifications)) {
    credCertsContainer.innerHTML = data.certifications
      .map(
        (c) => `
        <div class="cred-item">
          <div class="cred-title">${c.name}</div>
          <div class="cred-meta">
            <span class="issuer">${c.issuer}</span>
            <span>${c.date}</span>
          </div>
        </div>
      `
      )
      .join('');
  }

  const credEduContainer = document.getElementById('cred-edu-list');
  if (credEduContainer && Array.isArray(data.education)) {
    credEduContainer.innerHTML = data.education
      .map(
        (e) => `
        <div class="cred-item">
          <div class="cred-title">${e.degree}</div>
          <div class="cred-meta">
            <span class="issuer">${e.institution}</span>
            <span>${e.period}</span>
          </div>
          ${e.details ? `<p style="font-size:0.9rem; color:var(--muted); margin-top:6px;">${e.details}</p>` : ''}
        </div>
      `
      )
      .join('');
  }

  // 8. Render Contact Section & Footer
  const contactLinksContainer = document.getElementById('contact-links');
  if (contactLinksContainer && data.profile && data.profile.contact) {
    const c = data.profile.contact;
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(c.email)}&su=${encodeURIComponent('Inquiry for Abhishek Hingmire — Data Analyst')}`;
    const mailtoUrl = `mailto:${c.email}?subject=${encodeURIComponent('Inquiry for Abhishek Hingmire — Data Analyst')}`;

    contactLinksContainer.innerHTML = `
      <a href="${gmailComposeUrl}" id="email-link" target="_blank" rel="noopener noreferrer" title="Open in Gmail with prefilled recipient">
        ✉ ${c.email}
      </a>
      <a href="tel:${c.phone}" title="Call directly">
        📞 ${c.phoneDisplay || c.phone}
      </a>
      <a href="${c.linkedin}" target="_blank" rel="noopener noreferrer">
        LinkedIn ↗
      </a>
      <a href="${c.github}" target="_blank" rel="noopener noreferrer">
        GitHub ↗
      </a>
    `;

    // Smart email handler for mobile & desktop
    const emailLink = document.getElementById('email-link');
    if (emailLink) {
      emailLink.addEventListener('click', (e) => {
        // Detect if mobile device
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
          // On mobile, try mailto scheme which prompts Gmail App / Default Email App with TO prefilled
          window.location.href = mailtoUrl;
          e.preventDefault();
        }
      });
    }
  }

  const footerCopyright = document.getElementById('footer-copyright');
  if (footerCopyright && data.profile) {
    footerCopyright.textContent = `© ${new Date().getFullYear()} ${data.profile.fullName || 'Abhishek Hingmire'}`;
  }

  // 9. Interactive Cursor Glow
  const glow = document.getElementById('glow');
  if (glow) {
    window.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  // 10. Typewriter Effect
  const roles = (data.profile && data.profile.roles && data.profile.roles.length > 0)
    ? data.profile.roles
    : ["Data Analyst", "BFSI Analytics Specialist", "Python & SQL Developer", "Business Intelligence"];

  const typedEl = document.getElementById('typed');
  if (typedEl) {
    let rIdx = 0,
      cIdx = 0,
      deleting = false;

    function typeLoop() {
      const current = roles[rIdx];
      if (!deleting) {
        typedEl.textContent = current.slice(0, cIdx + 1);
        cIdx++;
        if (cIdx === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1500);
          return;
        }
      } else {
        typedEl.textContent = current.slice(0, cIdx - 1);
        cIdx--;
        if (cIdx === 0) {
          deleting = false;
          rIdx = (rIdx + 1) % roles.length;
        }
      }
      setTimeout(typeLoop, deleting ? 45 : 90);
    }
    typeLoop();
  }

  // 11. Intersection Observer for Scroll Reveals & Smooth Triggers
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach((el) => io.observe(el));

  // 11b. Subtle 3D Card Tilt on Mousemove for Profile Image Frames
  document.querySelectorAll('.hero-img-frame').forEach((frame) => {
    frame.addEventListener('mousemove', (e) => {
      const rect = frame.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 12;
      const rotateY = (x / rect.width) * 12;
      frame.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px) scale(1.01)`;
    });
    frame.addEventListener('mouseleave', () => {
      frame.style.transform = '';
    });
  });

  // 12. Particle Mesh Canvas in Hero
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];

    function resize() {
      w = canvas.width = canvas.offsetParent ? canvas.parentElement.offsetWidth : window.innerWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    }

    function initParticles() {
      particles = [];
      const count = Math.min(65, Math.floor(w / 22));
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.6 + 0.4
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(201, 166, 100, 0.45)';
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i],
            b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.strokeStyle = `rgba(201, 166, 100, ${0.11 * (1 - d / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });

    resize();
    initParticles();
    draw();

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      canvas.style.display = 'none';
    }
  }

  // 13. Mobile Menu Navigation
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      navToggle.textContent = mobileMenu.classList.contains('active') ? '✕' : '☰';
    });
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navToggle.textContent = '☰';
      });
    });
  }

  // 14. Real-time sync with localStorage when changes happen in Admin
  window.addEventListener('storage', (e) => {
    if (e.key === 'portfolio_data') {
      window.location.reload();
    }
  });

  // 15. Hidden Secret Owner Shortcut (Ctrl+Shift+A or double-click logo)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.location.href = 'admin.html';
    }
  });

  if (logoEl) {
    logoEl.style.cursor = 'pointer';
    logoEl.addEventListener('dblclick', () => {
      window.location.href = 'admin.html';
    });
  }
})();
