// Admin CMS Management Logic
(function () {
  'use strict';

  let currentData = {};

  function loadData() {
    try {
      const stored = localStorage.getItem('portfolio_data');
      if (stored) {
        currentData = JSON.parse(stored);
        return;
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
    // Deep clone default data
    currentData = JSON.parse(JSON.stringify(window.DEFAULT_PORTFOLIO_DATA || {}));
  }

  function saveData(showFeedback = true) {
    try {
      localStorage.setItem('portfolio_data', JSON.stringify(currentData));
      if (showFeedback) {
        showToast('✓ All changes saved successfully! Live portfolio updated.');
      }
    } catch (e) {
      console.error('Error saving data:', e);
      alert('Could not save changes to local storage.');
    }
  }

  function showToast(message) {
    const toast = document.getElementById('admin-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // --- TAB NAVIGATION ---
  const tabBtns = document.querySelectorAll('.nav-tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabPanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // --- POPULATE FORMS ---
  function populateForms() {
    if (!currentData.profile) currentData.profile = {};

    // 1. Profile & Hero
    document.getElementById('input-fullName').value = currentData.profile.fullName || '';
    document.getElementById('input-firstName').value = currentData.profile.firstName || '';
    document.getElementById('input-lastName').value = currentData.profile.lastName || '';
    document.getElementById('input-eyebrow').value = currentData.profile.eyebrow || '';
    document.getElementById('input-photo').value = currentData.profile.photo || '';
    document.getElementById('input-photoBadge').value = currentData.profile.photoBadge || '';
    document.getElementById('input-roles').value = (currentData.profile.roles || []).join('\n');

    // Hero Meta (3 items)
    const meta = currentData.profile.heroMeta || [];
    document.getElementById('input-meta1-title').value = meta[0]?.title || '';
    document.getElementById('input-meta1-sub').value = meta[0]?.subtitle || '';
    document.getElementById('input-meta2-title').value = meta[1]?.title || '';
    document.getElementById('input-meta2-sub').value = meta[1]?.subtitle || '';
    document.getElementById('input-meta3-title').value = meta[2]?.title || '';
    document.getElementById('input-meta3-sub').value = meta[2]?.subtitle || '';

    // 2. About & Stats
    const aboutParas = currentData.profile.aboutText || [];
    document.getElementById('input-about-p1').value = aboutParas[0] || '';
    document.getElementById('input-about-p2').value = aboutParas[1] || '';
    document.getElementById('input-about-p3').value = aboutParas[2] || '';

    const stats = currentData.profile.stats || [];
    document.getElementById('input-stat1-num').value = stats[0]?.num || '';
    document.getElementById('input-stat1-lbl').value = stats[0]?.label || '';
    document.getElementById('input-stat2-num').value = stats[1]?.num || '';
    document.getElementById('input-stat2-lbl').value = stats[1]?.label || '';
    document.getElementById('input-stat3-num').value = stats[2]?.num || '';
    document.getElementById('input-stat3-lbl').value = stats[2]?.label || '';

    // 3. Skills
    document.getElementById('input-marquee-skills').value = (currentData.marqueeSkills || []).join(', ');
    renderSkillCategoriesList();

    // 4. Experiences
    renderExperiencesList();

    // 5. Projects
    renderProjectsList();

    // 6. Credentials & Education
    renderCertsList();
    renderEduList();

    // 7. Contact
    const contact = currentData.profile.contact || {};
    document.getElementById('input-email').value = contact.email || '';
    document.getElementById('input-phone').value = contact.phone || '';
    document.getElementById('input-phoneDisplay').value = contact.phoneDisplay || '';
    document.getElementById('input-location').value = contact.location || '';
    document.getElementById('input-linkedin').value = contact.linkedin || '';
    document.getElementById('input-github').value = contact.github || '';

    // 8. Customization & Theme
    const cust = currentData.customization || {};
    document.getElementById('input-accent-color').value = cust.accentColor || '#c9a664';
    document.getElementById('input-accent-teal').value = cust.accentTeal || '#4fd1c5';
    document.getElementById('input-admin-pin').value = cust.adminPin || '1234';
  }

  // --- SKILL CATEGORIES REPEATER ---
  function renderSkillCategoriesList() {
    const container = document.getElementById('skill-cats-container');
    if (!container) return;
    container.innerHTML = '';

    (currentData.skillCategories || []).forEach((cat, idx) => {
      const card = document.createElement('div');
      card.className = 'card-item';
      card.innerHTML = `
        <div class="card-item-header">
          <span class="card-item-title">${cat.category || 'Skill Category'}</span>
          <button type="button" class="btn btn-danger btn-sm" data-action="delete-cat" data-index="${idx}">Delete</button>
        </div>
        <div class="form-group">
          <label>Category Title</label>
          <input type="text" class="cat-title-input" data-index="${idx}" value="${cat.category || ''}" placeholder="e.g. Querying & Programming">
        </div>
        <div class="form-group">
          <label>Skills List (comma-separated)</label>
          <input type="text" class="cat-skills-input" data-index="${idx}" value="${(cat.skills || []).join(', ')}" placeholder="SQL, Python, etc.">
        </div>
      `;
      container.appendChild(card);
    });

    // Event listeners
    container.querySelectorAll('.cat-title-input').forEach((input) => {
      input.addEventListener('input', (e) => {
        const i = e.target.dataset.index;
        currentData.skillCategories[i].category = e.target.value;
      });
    });

    container.querySelectorAll('.cat-skills-input').forEach((input) => {
      input.addEventListener('input', (e) => {
        const i = e.target.dataset.index;
        currentData.skillCategories[i].skills = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
      });
    });

    container.querySelectorAll('[data-action="delete-cat"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const i = parseInt(e.target.dataset.index, 10);
        currentData.skillCategories.splice(i, 1);
        renderSkillCategoriesList();
      });
    });
  }

  const addCatBtn = document.getElementById('btn-add-skill-cat');
  if (addCatBtn) {
    addCatBtn.addEventListener('click', () => {
      if (!currentData.skillCategories) currentData.skillCategories = [];
      currentData.skillCategories.push({
        category: 'New Category',
        skills: ['Skill 1', 'Skill 2']
      });
      renderSkillCategoriesList();
    });
  }

  // --- EXPERIENCES REPEATER ---
  function renderExperiencesList() {
    const container = document.getElementById('experiences-container');
    if (!container) return;
    container.innerHTML = '';

    (currentData.experiences || []).forEach((exp, idx) => {
      const card = document.createElement('div');
      card.className = 'card-item';
      card.innerHTML = `
        <div class="card-item-header">
          <span class="card-item-title">${exp.role || 'Experience Item'} (${exp.company || ''})</span>
          <button type="button" class="btn btn-danger btn-sm" data-action="delete-exp" data-index="${idx}">Delete Role</button>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Job Title / Role</label>
            <input type="text" class="exp-role" data-index="${idx}" value="${exp.role || ''}">
          </div>
          <div class="form-group">
            <label>Company Name</label>
            <input type="text" class="exp-company" data-index="${idx}" value="${exp.company || ''}">
          </div>
          <div class="form-group">
            <label>Duration / Dates</label>
            <input type="text" class="exp-date" data-index="${idx}" value="${exp.date || ''}" placeholder="Nov 2024 – Present">
          </div>
          <div class="form-group">
            <label>Location</label>
            <input type="text" class="exp-location" data-index="${idx}" value="${exp.location || ''}" placeholder="Pune, India">
          </div>
          <div class="form-group full-width">
            <label>Tagline / Team Description</label>
            <input type="text" class="exp-tagline" data-index="${idx}" value="${exp.tagline || ''}" placeholder="Client Support & Financial Data Operations">
          </div>
          <div class="form-group full-width">
            <label>Bullet Points / Achievements (One per line)</label>
            <textarea class="exp-bullets" data-index="${idx}" rows="4">${(exp.bullets || []).join('\n')}</textarea>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    // Bind inputs
    container.querySelectorAll('.exp-role').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.experiences[e.target.dataset.index].role = e.target.value;
      });
    });
    container.querySelectorAll('.exp-company').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.experiences[e.target.dataset.index].company = e.target.value;
      });
    });
    container.querySelectorAll('.exp-date').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.experiences[e.target.dataset.index].date = e.target.value;
      });
    });
    container.querySelectorAll('.exp-location').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.experiences[e.target.dataset.index].location = e.target.value;
      });
    });
    container.querySelectorAll('.exp-tagline').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.experiences[e.target.dataset.index].tagline = e.target.value;
      });
    });
    container.querySelectorAll('.exp-bullets').forEach((textarea) => {
      textarea.addEventListener('input', (e) => {
        currentData.experiences[e.target.dataset.index].bullets = e.target.value
          .split('\n')
          .map((b) => b.trim())
          .filter(Boolean);
      });
    });
    container.querySelectorAll('[data-action="delete-exp"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const i = parseInt(e.target.dataset.index, 10);
        currentData.experiences.splice(i, 1);
        renderExperiencesList();
      });
    });
  }

  const addExpBtn = document.getElementById('btn-add-experience');
  if (addExpBtn) {
    addExpBtn.addEventListener('click', () => {
      if (!currentData.experiences) currentData.experiences = [];
      currentData.experiences.unshift({
        id: 'exp-' + Date.now(),
        role: 'Data Analyst',
        company: 'Company Name',
        location: 'Location',
        tagline: 'Analytics Team',
        date: '2024 – Present',
        bullets: ['Key responsibility or achievement here.', 'Automated reporting pipeline.']
      });
      renderExperiencesList();
    });
  }

  // --- PROJECTS REPEATER ---
  function renderProjectsList() {
    const container = document.getElementById('projects-container');
    if (!container) return;
    container.innerHTML = '';

    (currentData.projects || []).forEach((proj, idx) => {
      const card = document.createElement('div');
      card.className = 'card-item';
      card.innerHTML = `
        <div class="card-item-header">
          <span class="card-item-title">${proj.title || 'Project'}</span>
          <button type="button" class="btn btn-danger btn-sm" data-action="delete-proj" data-index="${idx}">Delete Project</button>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Project Title</label>
            <input type="text" class="proj-title" data-index="${idx}" value="${proj.title || ''}">
          </div>
          <div class="form-group">
            <label>Category / Domain</label>
            <input type="text" class="proj-cat" data-index="${idx}" value="${proj.category || ''}" placeholder="Full Stack & AI Data Pipeline">
          </div>
          <div class="form-group full-width">
            <label>Project Description</label>
            <textarea class="proj-desc" data-index="${idx}" rows="3">${proj.description || ''}</textarea>
          </div>
          <div class="form-group full-width">
            <label>Tools & Technologies (Comma-separated)</label>
            <input type="text" class="proj-tools" data-index="${idx}" value="${(proj.tools || []).join(', ')}" placeholder="Python, FastAPI, PostgreSQL, Power BI">
          </div>
          <div class="form-group">
            <label>Link Button Label</label>
            <input type="text" class="proj-linktext" data-index="${idx}" value="${proj.linkText || 'View project →'}">
          </div>
          <div class="form-group">
            <label>Link URL</label>
            <input type="url" class="proj-linkurl" data-index="${idx}" value="${proj.linkUrl || '#'}">
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.proj-title').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.projects[e.target.dataset.index].title = e.target.value;
      });
    });
    container.querySelectorAll('.proj-cat').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.projects[e.target.dataset.index].category = e.target.value;
      });
    });
    container.querySelectorAll('.proj-desc').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.projects[e.target.dataset.index].description = e.target.value;
      });
    });
    container.querySelectorAll('.proj-tools').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.projects[e.target.dataset.index].tools = e.target.value
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      });
    });
    container.querySelectorAll('.proj-linktext').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.projects[e.target.dataset.index].linkText = e.target.value;
      });
    });
    container.querySelectorAll('.proj-linkurl').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.projects[e.target.dataset.index].linkUrl = e.target.value;
      });
    });
    container.querySelectorAll('[data-action="delete-proj"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const i = parseInt(e.target.dataset.index, 10);
        currentData.projects.splice(i, 1);
        renderProjectsList();
      });
    });
  }

  const addProjBtn = document.getElementById('btn-add-project');
  if (addProjBtn) {
    addProjBtn.addEventListener('click', () => {
      if (!currentData.projects) currentData.projects = [];
      currentData.projects.push({
        id: 'proj-' + Date.now(),
        title: 'New Analytics Project',
        category: 'Business Intelligence',
        description: 'Description of key objectives, ETL methodology, insights generated, and business value delivered.',
        tools: ['Python', 'SQL', 'Power BI'],
        linkText: 'View project details →',
        linkUrl: 'https://github.com/abhishekhingmire'
      });
      renderProjectsList();
    });
  }

  // --- CERTIFICATIONS REPEATER ---
  function renderCertsList() {
    const container = document.getElementById('certs-container');
    if (!container) return;
    container.innerHTML = '';

    (currentData.certifications || []).forEach((c, idx) => {
      const card = document.createElement('div');
      card.className = 'card-item';
      card.innerHTML = `
        <div class="card-item-header">
          <span class="card-item-title">${c.name || 'Certification'}</span>
          <button type="button" class="btn btn-danger btn-sm" data-action="delete-cert" data-index="${idx}">Delete</button>
        </div>
        <div class="form-grid">
          <div class="form-group full-width">
            <label>Certification Name</label>
            <input type="text" class="cert-name" data-index="${idx}" value="${c.name || ''}">
          </div>
          <div class="form-group">
            <label>Issuing Organization</label>
            <input type="text" class="cert-issuer" data-index="${idx}" value="${c.issuer || ''}">
          </div>
          <div class="form-group">
            <label>Year / Status</label>
            <input type="text" class="cert-date" data-index="${idx}" value="${c.date || ''}">
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.cert-name').forEach((inp) => {
      inp.addEventListener('input', (e) => {
        currentData.certifications[e.target.dataset.index].name = e.target.value;
      });
    });
    container.querySelectorAll('.cert-issuer').forEach((inp) => {
      inp.addEventListener('input', (e) => {
        currentData.certifications[e.target.dataset.index].issuer = e.target.value;
      });
    });
    container.querySelectorAll('.cert-date').forEach((inp) => {
      inp.addEventListener('input', (e) => {
        currentData.certifications[e.target.dataset.index].date = e.target.value;
      });
    });
    container.querySelectorAll('[data-action="delete-cert"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        currentData.certifications.splice(parseInt(e.target.dataset.index, 10), 1);
        renderCertsList();
      });
    });
  }

  const addCertBtn = document.getElementById('btn-add-cert');
  if (addCertBtn) {
    addCertBtn.addEventListener('click', () => {
      if (!currentData.certifications) currentData.certifications = [];
      currentData.certifications.push({
        name: 'New Certification Title',
        issuer: 'Issuing Body',
        date: 'Verified'
      });
      renderCertsList();
    });
  }

  // --- EDUCATION REPEATER ---
  function renderEduList() {
    const container = document.getElementById('edu-container');
    if (!container) return;
    container.innerHTML = '';

    (currentData.education || []).forEach((e, idx) => {
      const card = document.createElement('div');
      card.className = 'card-item';
      card.innerHTML = `
        <div class="card-item-header">
          <span class="card-item-title">${e.degree || 'Degree / Course'}</span>
          <button type="button" class="btn btn-danger btn-sm" data-action="delete-edu" data-index="${idx}">Delete</button>
        </div>
        <div class="form-grid">
          <div class="form-group full-width">
            <label>Degree / Certification</label>
            <input type="text" class="edu-degree" data-index="${idx}" value="${e.degree || ''}">
          </div>
          <div class="form-group">
            <label>Institution / University</label>
            <input type="text" class="edu-inst" data-index="${idx}" value="${e.institution || ''}">
          </div>
          <div class="form-group">
            <label>Graduation Year / Period</label>
            <input type="text" class="edu-period" data-index="${idx}" value="${e.period || ''}">
          </div>
          <div class="form-group full-width">
            <label>Coursework / Key Highlights</label>
            <textarea class="edu-details" data-index="${idx}" rows="2">${e.details || ''}</textarea>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.edu-degree').forEach((inp) => {
      inp.addEventListener('input', (ev) => {
        currentData.education[ev.target.dataset.index].degree = ev.target.value;
      });
    });
    container.querySelectorAll('.edu-inst').forEach((inp) => {
      inp.addEventListener('input', (ev) => {
        currentData.education[ev.target.dataset.index].institution = ev.target.value;
      });
    });
    container.querySelectorAll('.edu-period').forEach((inp) => {
      inp.addEventListener('input', (ev) => {
        currentData.education[ev.target.dataset.index].period = ev.target.value;
      });
    });
    container.querySelectorAll('.edu-details').forEach((inp) => {
      inp.addEventListener('input', (ev) => {
        currentData.education[ev.target.dataset.index].details = ev.target.value;
      });
    });
    container.querySelectorAll('[data-action="delete-edu"]').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        currentData.education.splice(parseInt(ev.target.dataset.index, 10), 1);
        renderEduList();
      });
    });
  }

  const addEduBtn = document.getElementById('btn-add-edu');
  if (addEduBtn) {
    addEduBtn.addEventListener('click', () => {
      if (!currentData.education) currentData.education = [];
      currentData.education.push({
        degree: 'Bachelor Degree',
        institution: 'University Name',
        period: '2020 – 2023',
        details: 'Key coursework details...'
      });
      renderEduList();
    });
  }

  // --- COLLECT TOP-LEVEL FORM VALUES BEFORE SAVE ---
  function collectFormValues() {
    // Profile
    currentData.profile.fullName = document.getElementById('input-fullName').value;
    currentData.profile.firstName = document.getElementById('input-firstName').value;
    currentData.profile.lastName = document.getElementById('input-lastName').value;
    currentData.profile.eyebrow = document.getElementById('input-eyebrow').value;
    currentData.profile.photo = document.getElementById('input-photo').value;
    currentData.profile.photoBadge = document.getElementById('input-photoBadge').value;
    currentData.profile.roles = document
      .getElementById('input-roles')
      .value.split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    currentData.profile.heroMeta = [
      {
        title: document.getElementById('input-meta1-title').value,
        subtitle: document.getElementById('input-meta1-sub').value
      },
      {
        title: document.getElementById('input-meta2-title').value,
        subtitle: document.getElementById('input-meta2-sub').value
      },
      {
        title: document.getElementById('input-meta3-title').value,
        subtitle: document.getElementById('input-meta3-sub').value
      }
    ];

    // About
    currentData.profile.aboutText = [
      document.getElementById('input-about-p1').value,
      document.getElementById('input-about-p2').value,
      document.getElementById('input-about-p3').value
    ].filter(Boolean);

    currentData.profile.stats = [
      {
        num: document.getElementById('input-stat1-num').value,
        label: document.getElementById('input-stat1-lbl').value
      },
      {
        num: document.getElementById('input-stat2-num').value,
        label: document.getElementById('input-stat2-lbl').value
      },
      {
        num: document.getElementById('input-stat3-num').value,
        label: document.getElementById('input-stat3-lbl').value
      }
    ];

    // Skills Marquee
    currentData.marqueeSkills = document
      .getElementById('input-marquee-skills')
      .value.split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Contact
    if (!currentData.profile.contact) currentData.profile.contact = {};
    currentData.profile.contact.email = document.getElementById('input-email').value;
    currentData.profile.contact.phone = document.getElementById('input-phone').value;
    currentData.profile.contact.phoneDisplay = document.getElementById('input-phoneDisplay').value;
    currentData.profile.contact.location = document.getElementById('input-location').value;
    currentData.profile.contact.linkedin = document.getElementById('input-linkedin').value;
    currentData.profile.contact.github = document.getElementById('input-github').value;

    // Customization
    if (!currentData.customization) currentData.customization = {};
    currentData.customization.accentColor = document.getElementById('input-accent-color').value;
    currentData.customization.accentTeal = document.getElementById('input-accent-teal').value;
    currentData.customization.adminPin = document.getElementById('input-admin-pin').value || '1234';
  }

  // --- SAVE BUTTONS ---
  const saveAllBtn = document.getElementById('btn-save-all');
  if (saveAllBtn) {
    saveAllBtn.addEventListener('click', () => {
      collectFormValues();
      saveData(true);
    });
  }

  // --- EXPORT JSON ---
  const exportBtn = document.getElementById('btn-export-json');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      collectFormValues();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `abhishek_portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('✓ Portfolio backup JSON downloaded successfully!');
    });
  }

  // --- IMPORT JSON ---
  const importFileInput = document.getElementById('input-import-file');
  if (importFileInput) {
    importFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (ev) {
        try {
          const parsed = JSON.parse(ev.target.result);
          if (parsed && parsed.profile) {
            currentData = parsed;
            saveData(false);
            populateForms();
            showToast('✓ Portfolio data imported successfully!');
          } else {
            alert('Invalid backup file structure.');
          }
        } catch (err) {
          alert('Could not parse JSON file: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
  }

  // --- RESET TO DEFAULT ---
  const resetBtn = document.getElementById('btn-reset-default');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all portfolio data back to the original resume details? Any custom changes will be overwritten.')) {
        localStorage.removeItem('portfolio_data');
        loadData();
        populateForms();
        saveData(false);
        showToast('✓ Portfolio successfully reset to default resume data!');
      }
    });
  }

  // --- PHOTO FILE UPLOAD HANDLER ---
  const photoFileInput = document.getElementById('input-photo-file');
  if (photoFileInput) {
    photoFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (ev) {
        document.getElementById('input-photo').value = ev.target.result;
        currentData.profile.photo = ev.target.result;
        showToast('✓ Photo loaded! Click "Save All Changes" to publish.');
      };
      reader.readAsDataURL(file);
    });
  }

  // --- SECURITY PIN AUTHENTICATION ---
  function initPinAuth() {
    const lockOverlay = document.getElementById('admin-lock-overlay');
    const unlockBtn = document.getElementById('btn-unlock-admin');
    const pinInput = document.getElementById('input-pin-attempt');
    const errorMsg = document.getElementById('pin-error-msg');
    const modal = document.querySelector('.admin-lock-modal');

    if (!lockOverlay || !unlockBtn || !pinInput) return;

    if (sessionStorage.getItem('admin_session_auth') === 'true') {
      lockOverlay.classList.add('unlocked');
      return;
    }

    function attemptUnlock() {
      const entered = pinInput.value.trim();
      const validPin = (currentData.customization && currentData.customization.adminPin) ? currentData.customization.adminPin : '1234';

      if (entered === validPin) {
        sessionStorage.setItem('admin_session_auth', 'true');
        lockOverlay.classList.add('unlocked');
        if (errorMsg) errorMsg.style.display = 'none';
      } else {
        if (errorMsg) errorMsg.style.display = 'block';
        if (modal) {
          modal.classList.remove('shake');
          void modal.offsetWidth; // trigger reflow
          modal.classList.add('shake');
        }
        pinInput.value = '';
        pinInput.focus();
      }
    }

    unlockBtn.addEventListener('click', attemptUnlock);
    pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') attemptUnlock();
    });
  }

  // Initialize
  loadData();
  populateForms();
  initPinAuth();
})();
