// Portfolio Dynamic Controller for Abhishek Hingmire
(function () {
  'use strict';

  // Load data from localStorage or fallback to DEFAULT_PORTFOLIO_DATA
  function getPortfolioData() {
    const defaults = window.DEFAULT_PORTFOLIO_DATA || {};
    try {
      const stored = localStorage.getItem('portfolio_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return {
            ...defaults,
            ...parsed,
            profile: {
              ...(defaults.profile || {}),
              ...(parsed.profile || {}),
              photo: (parsed.profile && parsed.profile.photo && parsed.profile.photo.trim() !== '') ? parsed.profile.photo : (defaults.profile?.photo || 'profile.jpg'),
              contact: {
                ...(defaults.profile?.contact || {}),
                ...(parsed.profile?.contact || {})
              },
              heroMeta: (Array.isArray(parsed.profile?.heroMeta) && parsed.profile.heroMeta.length > 0)
                ? parsed.profile.heroMeta
                : (defaults.profile?.heroMeta || []),
              aboutText: (Array.isArray(parsed.profile?.aboutText) && parsed.profile.aboutText.length > 0)
                ? parsed.profile.aboutText
                : (defaults.profile?.aboutText || []),
              stats: (Array.isArray(parsed.profile?.stats) && parsed.profile.stats.length > 0)
                ? parsed.profile.stats
                : (defaults.profile?.stats || [])
            },
            projects: (Array.isArray(parsed.projects) && parsed.projects.length > 0) ? parsed.projects : (defaults.projects || []),
            experiences: (Array.isArray(parsed.experiences) && parsed.experiences.length > 0) ? parsed.experiences : (defaults.experiences || []),
            skillCategories: (Array.isArray(parsed.skillCategories) && parsed.skillCategories.length > 0) ? parsed.skillCategories : (defaults.skillCategories || []),
            certifications: (Array.isArray(parsed.certifications) && parsed.certifications.length > 0) ? parsed.certifications : (defaults.certifications || []),
            education: (Array.isArray(parsed.education) && parsed.education.length > 0) ? parsed.education : (defaults.education || []),
            sectionHeadings: {
              ...(defaults.sectionHeadings || {}),
              ...(parsed.sectionHeadings || {})
            },
            customization: {
              ...(defaults.customization || {}),
              ...(parsed.customization || {})
            }
          };
        }
      }
    } catch (e) {
      console.warn('Error loading localStorage data:', e);
    }
    return defaults;
  }

  const data = getPortfolioData();
  let roles = [];

  // 11. Intersection Observer for Scroll Reveals & Smooth Triggers (defined globally for dynamic updates)
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

  function renderPortfolioUI(data) {
    if (!data) return;

    // Update typewriter roles list dynamically
    roles = (data.profile && data.profile.roles && data.profile.roles.length > 0)
      ? data.profile.roles
      : ["Data Analyst", "BFSI Analytics Specialist", "Python & SQL Developer", "Business Intelligence"];

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
    const photoSrc = (data.profile.photo && data.profile.photo.trim() !== '') ? data.profile.photo.trim() : 'profile.jpg';
    if (heroImgEl) heroImgEl.src = photoSrc;
    if (aboutImgEl) aboutImgEl.src = photoSrc;

    if (heroImgWrap) heroImgWrap.style.display = 'flex';
    if (aboutImgWrap) aboutImgWrap.style.display = 'flex';
  }

  const badgeTextEl = document.getElementById('hero-badge-text');
  const aboutBadgeTextEl = document.getElementById('about-badge-text');
  if (data.profile) {
    if (badgeTextEl) badgeTextEl.textContent = data.profile.photoBadge || 'Available for Hire';
    if (aboutBadgeTextEl) aboutBadgeTextEl.textContent = 'BFSI & BI Specialist';
  }

  // 3. Render About Narrative
  const aboutTextContainer = document.getElementById('about-text-container');
  if (aboutTextContainer && data.profile) {
    if (typeof data.profile.aboutBio === 'string' && data.profile.aboutBio.trim() !== '') {
      aboutTextContainer.innerHTML = data.profile.aboutBio.trim();
    } else if (Array.isArray(data.profile.aboutText) && data.profile.aboutText.length > 0) {
      aboutTextContainer.innerHTML = data.profile.aboutText.join('\n\n');
    }
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

  // 6. Render Projects Grid & Interactive Modal System
  const projectsContainer = document.getElementById('projects-grid');
  const projectModalBackdrop = document.getElementById('project-modal-backdrop');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalProjCategory = document.getElementById('modal-proj-category');
  const modalProjTitle = document.getElementById('modal-proj-title');
  const modalProjDesc = document.getElementById('modal-proj-desc');
  const modalProjTools = document.getElementById('modal-proj-tools');
  const modalCarousel = document.getElementById('modal-carousel');
  const carouselActiveImg = document.getElementById('carousel-active-img');
  const carouselPrevBtn = document.getElementById('carousel-prev-btn');
  const carouselNextBtn = document.getElementById('carousel-next-btn');
  const carouselIndicators = document.getElementById('carousel-indicators');
  const modalVideoWrap = document.getElementById('modal-video-wrap');
  const modalYoutubeIframe = document.getElementById('modal-youtube-iframe');
  const modalGithubBtn = document.getElementById('modal-github-btn');
  const modalDemoBtn = document.getElementById('modal-demo-btn');

  let currentProjectScreenshots = [];
  let currentSlideIndex = 0;

  function updateCarouselSlide(idx) {
    if (!currentProjectScreenshots.length) return;
    if (idx < 0) idx = currentProjectScreenshots.length - 1;
    if (idx >= currentProjectScreenshots.length) idx = 0;
    currentSlideIndex = idx;

    if (carouselActiveImg) {
      carouselActiveImg.style.opacity = '0';
      setTimeout(() => {
        carouselActiveImg.src = currentProjectScreenshots[currentSlideIndex];
        carouselActiveImg.style.opacity = '1';
      }, 150);
    }

    if (carouselIndicators) {
      const dots = carouselIndicators.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlideIndex);
      });
    }
  }

  function getYouTubeEmbedUrl(url) {
    if (!url || typeof url !== 'string' || url.trim() === '') return '';
    url = url.trim();
    // Match youtube.com/watch?v=ID or youtu.be/ID or youtube.com/embed/ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube-nocookie.com/embed/${match[2]}?rel=0&autoplay=0`
      : '';
  }

  function openProjectModal(proj) {
    if (!projectModalBackdrop) return;

    modalProjCategory.textContent = proj.category || 'Featured Project';
    modalProjTitle.textContent = proj.title;
    modalProjDesc.innerHTML = proj.description || '';

    // Tools & Stack
    modalProjTools.innerHTML = (proj.tools || [])
      .map((t) => `<span class="tag">${t}</span>`)
      .join('');

    // Screenshots Carousel
    const images = Array.isArray(proj.screenshots) && proj.screenshots.length > 0
      ? proj.screenshots
      : (proj.thumbnail ? [proj.thumbnail] : []);

    currentProjectScreenshots = images;
    currentSlideIndex = 0;

    if (images.length > 0) {
      modalCarousel.style.display = 'block';
      carouselActiveImg.src = images[0];

      // Build indicators
      if (carouselIndicators) {
        carouselIndicators.innerHTML = images
          .map((_, i) => `<span class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`)
          .join('');
        
        carouselIndicators.querySelectorAll('.carousel-dot').forEach((dot) => {
          dot.addEventListener('click', (e) => {
            const dotIdx = parseInt(e.target.dataset.index, 10);
            updateCarouselSlide(dotIdx);
          });
        });
      }

      // Hide arrows if only 1 image
      const showNav = images.length > 1;
      if (carouselPrevBtn) carouselPrevBtn.style.display = showNav ? 'flex' : 'none';
      if (carouselNextBtn) carouselNextBtn.style.display = showNav ? 'flex' : 'none';
    } else {
      modalCarousel.style.display = 'none';
    }

    // YouTube Video Embed (Strict Conditional)
    const ytEmbedUrl = getYouTubeEmbedUrl(proj.youtubeUrl);
    if (ytEmbedUrl && modalVideoWrap && modalYoutubeIframe) {
      modalYoutubeIframe.src = ytEmbedUrl;
      modalVideoWrap.style.display = 'block';
    } else if (modalVideoWrap && modalYoutubeIframe) {
      modalYoutubeIframe.src = '';
      modalVideoWrap.style.display = 'none';
    }

    // Buttons
    if (modalGithubBtn) {
      modalGithubBtn.href = proj.githubUrl || 'https://github.com/abhishekhingmire';
      const span = modalGithubBtn.querySelector('span');
      if (span) span.textContent = 'GitHub ↗';
    }
    if (modalDemoBtn) {
      modalDemoBtn.href = proj.demoUrl || proj.linkUrl || 'https://github.com/abhishekhingmire';
      const span = modalDemoBtn.querySelector('span');
      if (span) span.textContent = 'Live Demo ↗';
    }

    projectModalBackdrop.classList.add('active');
    projectModalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModalBackdrop) return;
    projectModalBackdrop.classList.remove('active');
    projectModalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modalYoutubeIframe) {
      modalYoutubeIframe.src = ''; // stop audio immediately
    }
  }

  if (carouselPrevBtn) {
    carouselPrevBtn.addEventListener('click', () => updateCarouselSlide(currentSlideIndex - 1));
  }
  if (carouselNextBtn) {
    carouselNextBtn.addEventListener('click', () => updateCarouselSlide(currentSlideIndex + 1));
  }
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }
  if (projectModalBackdrop) {
    projectModalBackdrop.addEventListener('click', (e) => {
      if (e.target === projectModalBackdrop) closeProjectModal();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModalBackdrop && projectModalBackdrop.classList.contains('active')) {
      closeProjectModal();
    }
  });

  if (projectsContainer && Array.isArray(data.projects)) {
    projectsContainer.innerHTML = data.projects
      .map((proj, idx) => {
        const thumb = proj.thumbnail || (Array.isArray(proj.screenshots) && proj.screenshots[0]) || 'synaptiqo-thumb.svg';
        const toolsHtml = (proj.tools || [])
          .map((t) => `<span class="proj-tool-tag">${t}</span>`)
          .join('');

        return `
          <div class="proj-card reveal" data-project-id="${proj.id || idx}">
            <div class="proj-thumb-wrap">
              <img src="${thumb}" alt="${proj.title}" class="proj-thumb-img" loading="lazy">
              <div class="proj-thumb-overlay">
                <span class="proj-category-pill">${proj.category || 'Data Analytics'}</span>
              </div>
            </div>
            <div class="proj-body">
              <h3>${proj.title}</h3>
              
              <!-- Skills / Tools / Languages overview badges below title -->
              <div class="proj-tools-overview">
                ${toolsHtml}
              </div>

              <p class="proj-desc-preview">${proj.description}</p>
              
              <div class="proj-cta-row">
                <span>View Full Details &amp; Demo</span>
                <span>→</span>
              </div>
            </div>
          </div>
        `;
      })
      .join('');

    // Attach click listeners to cards to open modal
    projectsContainer.querySelectorAll('.proj-card').forEach((card, i) => {
      card.addEventListener('click', () => {
        const proj = data.projects[i];
        if (proj) openProjectModal(proj);
      });
    });
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

  // 8. Render Section Headings Dynamically
  if (data.sectionHeadings) {
    const headingsMap = [
      { id: 'heading-about', data: data.sectionHeadings.about },
      { id: 'heading-skills', data: data.sectionHeadings.skills },
      { id: 'heading-experience', data: data.sectionHeadings.experience },
      { id: 'heading-projects', data: data.sectionHeadings.projects },
      { id: 'heading-credentials', data: data.sectionHeadings.credentials },
      { id: 'heading-contact', data: data.sectionHeadings.contact },
      { id: 'heading-contact-headline', data: data.sectionHeadings.contactHeadline, isHtml: true }
    ];

    headingsMap.forEach(({ id, data: hData, isHtml }) => {
      const el = document.getElementById(id);
      if (el && hData) {
        if (hData.text) {
          if (isHtml) {
            el.innerHTML = hData.text;
          } else {
            el.textContent = hData.text;
          }
        }
        if (hData.size) {
          el.style.fontSize = hData.size;
        }
      }
    });
  }

  // 9. Render Clean Contact Buttons
  const contactLinksContainer = document.getElementById('contact-links');
  if (contactLinksContainer) {
    const c = (data.profile && data.profile.contact) ? data.profile.contact : {};
    
    const email = (c.email && c.email.trim() !== '') ? c.email.trim() : 'abhishekhingmire2171@gmail.com';
    const emailText = (c.emailLabel && c.emailLabel.trim() !== '') ? c.emailLabel.trim() : email;

    const phone = (c.phone && c.phone.trim() !== '') ? c.phone.trim() : '+91-8623921350';
    const phoneDisplay = (c.phoneDisplay && c.phoneDisplay.trim() !== '') ? c.phoneDisplay.trim() : '+91 86239 21350';
    const phoneText = (c.phoneLabel && c.phoneLabel.trim() !== '') ? c.phoneLabel.trim() : phoneDisplay;

    const linkedin = (c.linkedin && c.linkedin.trim() !== '') ? c.linkedin.trim() : 'https://www.linkedin.com/in/abhishek-hingmire';
    const linkedinText = (c.linkedinLabel && c.linkedinLabel.trim() !== '') ? c.linkedinLabel.trim() : 'LinkedIn ↗';

    const github = (c.github && c.github.trim() !== '') ? c.github.trim() : 'https://github.com/abhishekhingmire';
    const githubText = (c.githubLabel && c.githubLabel.trim() !== '') ? c.githubLabel.trim() : 'GitHub ↗';

    const subject = encodeURIComponent(`Inquiry for ${data.profile?.fullName || 'Abhishek Hingmire'} — Data Analyst`);
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}`;
    const mailtoUrl = `mailto:${email}?subject=${subject}`;

    contactLinksContainer.innerHTML = `
      <a href="${gmailComposeUrl}" id="email-contact-btn" target="_blank" rel="noopener noreferrer" class="contact-pill-btn" title="Open Gmail Compose directly to ${email}">
        ✉️ <span>${emailText}</span>
      </a>

      <a href="tel:${phone}" class="contact-pill-btn" title="Call directly on ${phoneDisplay}">
        📞 <span>${phoneText}</span>
      </a>

      <a href="${linkedin}" target="_blank" rel="noopener noreferrer" class="contact-pill-btn" title="Open LinkedIn Profile">
        💼 <span>${linkedinText}</span>
      </a>

      <a href="${github}" target="_blank" rel="noopener noreferrer" class="contact-pill-btn" title="Open GitHub Profile">
        🚀 <span>${githubText}</span>
      </a>
    `;

    // Smart email click handler for mobile
    const emailBtn = document.getElementById('email-contact-btn');
    if (emailBtn) {
      emailBtn.addEventListener('click', (e) => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
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

  // Dynamic Floating Resume Direct Download Button
  const floatingResumeBtn = document.getElementById('floating-resume-badge');
  const resumeBadgeText = document.getElementById('resume-badge-text');
  if (floatingResumeBtn) {
    const resumeUrl = data.profile?.resumeUrl;
    if (resumeUrl && resumeUrl.trim() !== '') {
      floatingResumeBtn.style.display = 'flex';
      floatingResumeBtn.setAttribute('download', 'Abhishek_Hingmire_Resume.pdf');
      floatingResumeBtn.href = resumeUrl;
      
      if (resumeBadgeText) {
        resumeBadgeText.textContent = data.profile.resumeButtonText || 'Download Resume';
      }

      // Ensure reliable download even for Base64 Data URLs
      floatingResumeBtn.onclick = function (e) {
        if (resumeUrl.startsWith('data:')) {
          e.preventDefault();
          try {
            const arr = resumeUrl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            const blob = new Blob([u8arr], { type: mime });
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'Abhishek_Hingmire_Resume.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
          } catch (err) {
            window.open(resumeUrl, '_blank');
          }
        }
      };
    } else {
      // Automatically hide button if no resume is set in admin
      floatingResumeBtn.style.display = 'none';
    }
  }

  // Re-observe all reveal elements after dynamic DOM updates
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
    io.observe(el);
  });
}

  // Initial UI Render
  renderPortfolioUI(data);

  // 9. Interactive Cursor Glow
  const glow = document.getElementById('glow');
  if (glow) {
    window.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

  // 10. Typewriter Effect

  const typedEl = document.getElementById('typed');
  if (typedEl) {
    let rIdx = 0,
      cIdx = 0,
      deleting = false;

    function typeLoop() {
      const current = roles[rIdx];
      if (!current) {
        rIdx = 0;
        cIdx = 0;
        deleting = false;
        setTimeout(typeLoop, 100);
        return;
      }
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

  // 11. Scroll Reveal elements are dynamically observed inside renderPortfolioUI

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

  // 14. Real-time sync with localStorage when changes happen in Admin (no page reloads)
  window.addEventListener('storage', (e) => {
    if (e.key === 'portfolio_data' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (parsed && typeof parsed === 'object') {
          renderPortfolioUI(parsed);
        }
      } catch (err) {
        console.warn('Storage sync error:', err);
      }
    }
  });

  // 15. Hidden Secret Owner Shortcut (Ctrl+Shift+A or double-click logo)
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
      e.preventDefault();
      window.location.href = 'admin.html';
    }
  });

  const secretLogoEl = document.getElementById('site-logo');
  if (secretLogoEl) {
    secretLogoEl.style.cursor = 'pointer';
    secretLogoEl.addEventListener('dblclick', () => {
      window.location.href = 'admin.html';
    });
  }

  // 16. Firebase Cloud Sync on page load (Auto-update in-place if cloud data is newer)
  if (typeof window.fetchCloudPortfolio === 'function' && window.isFirebaseConfigured && window.isFirebaseConfigured()) {
    window.fetchCloudPortfolio().then((cloudData) => {
      if (cloudData && typeof cloudData === 'object') {
        const currentLocal = localStorage.getItem('portfolio_data');
        const cloudStr = JSON.stringify(cloudData);
        if (currentLocal !== cloudStr) {
          localStorage.setItem('portfolio_data', cloudStr);
          renderPortfolioUI(cloudData); // Render updated cloud data instantly in-place!
        }
      }
    }).catch((err) => {
      console.warn('Cloud sync check:', err);
    });
  }
})();
