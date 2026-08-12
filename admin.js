// Admin CMS Management Logic
(function () {
  'use strict';

  let currentData = {};

  function loadData() {
    const defaults = JSON.parse(JSON.stringify(window.DEFAULT_PORTFOLIO_DATA || {}));
    try {
      const stored = localStorage.getItem('portfolio_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          currentData = {
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
          return;
        }
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
    currentData = defaults;
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

    // Resume Management
    const resumeUrl = currentData.profile.resumeUrl || '';
    document.getElementById('input-resume-url').value = resumeUrl;
    document.getElementById('input-resume-label').value = currentData.profile.resumeButtonText || 'Download Resume';
    updateResumeStatus(resumeUrl);

    // Hero Meta (3 items)
    const meta = currentData.profile.heroMeta || [];
    document.getElementById('input-meta1-title').value = meta[0]?.title || '';
    document.getElementById('input-meta1-sub').value = meta[0]?.subtitle || '';
    document.getElementById('input-meta2-title').value = meta[1]?.title || '';
    document.getElementById('input-meta2-sub').value = meta[1]?.subtitle || '';
    document.getElementById('input-meta3-title').value = meta[2]?.title || '';
    document.getElementById('input-meta3-sub').value = meta[2]?.subtitle || '';

    // 2. About Narrative
    const bioVal = currentData.profile.aboutBio || (Array.isArray(currentData.profile.aboutText) ? currentData.profile.aboutText.join('\n\n') : '');
    const bioInput = document.getElementById('input-about-bio');
    if (bioInput) bioInput.value = bioVal;

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
    document.getElementById('input-email').value = contact.email || 'abhishekhingmire2171@gmail.com';
    document.getElementById('input-emailLabel').value = contact.emailLabel || contact.email || 'abhishekhingmire2171@gmail.com';
    document.getElementById('input-phone').value = contact.phone || '+91-8623921350';
    document.getElementById('input-phoneLabel').value = contact.phoneLabel || contact.phoneDisplay || '+91 86239 21350';
    document.getElementById('input-phoneDisplay').value = contact.phoneDisplay || '+91 86239 21350';
    document.getElementById('input-location').value = contact.location || 'Mumbai, India';
    document.getElementById('input-linkedin').value = contact.linkedin || 'https://www.linkedin.com/in/abhishek-hingmire';
    document.getElementById('input-linkedinLabel').value = contact.linkedinLabel || 'LinkedIn ↗';
    document.getElementById('input-github').value = contact.github || 'https://github.com/abhishekhingmire';
    document.getElementById('input-githubLabel').value = contact.githubLabel || 'GitHub ↗';

    // 8. Section Headings & Typography
    const headings = currentData.sectionHeadings || {};
    if (document.getElementById('input-heading-about-text')) {
      document.getElementById('input-heading-about-text').value = headings.about?.text || 'About Me';
      document.getElementById('input-heading-about-size').value = headings.about?.size || '2.5rem';
      document.getElementById('input-heading-skills-text').value = headings.skills?.text || 'Skills & Core Stack';
      document.getElementById('input-heading-skills-size').value = headings.skills?.size || '2.5rem';
      document.getElementById('input-heading-exp-text').value = headings.experience?.text || 'Experience';
      document.getElementById('input-heading-exp-size').value = headings.experience?.size || '2.5rem';
      document.getElementById('input-heading-proj-text').value = headings.projects?.text || 'Selected Work & Projects';
      document.getElementById('input-heading-proj-size').value = headings.projects?.size || '2.5rem';
      document.getElementById('input-heading-edu-text').value = headings.credentials?.text || 'Education & Credentials';
      document.getElementById('input-heading-edu-size').value = headings.credentials?.size || '2.5rem';
      document.getElementById('input-heading-contact-text').value = headings.contact?.text || 'Contact';
      document.getElementById('input-heading-contact-size').value = headings.contact?.size || '2.5rem';
      document.getElementById('input-heading-contactheadline-text').value = headings.contactHeadline?.text || "Let's turn complex data into <em>actionable insights.</em>";
      document.getElementById('input-heading-contactheadline-size').value = headings.contactHeadline?.size || "clamp(2.2rem, 5.5vw, 4.2rem)";
    }

    // 9. Customization & Theme
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
      const screenshotsArr = Array.isArray(proj.screenshots) ? proj.screenshots : (proj.thumbnail ? [proj.thumbnail] : []);
      const screenshotsStr = screenshotsArr.join(', ');

      const ssChipsHtml = screenshotsArr
        .map(
          (ss, sIdx) => `
        <div class="ss-thumb-chip">
          <img src="${ss}" alt="Screenshot ${sIdx + 1}" />
          <button type="button" class="ss-del-btn" data-action="delete-ss" data-proj-index="${idx}" data-ss-index="${sIdx}" title="Remove screenshot">✖</button>
        </div>
      `
        )
        .join('');

      card.innerHTML = `
        <div class="card-item-header">
          <span class="card-item-title">${proj.title || 'Project'}</span>
          <button type="button" class="btn btn-danger btn-sm" data-action="delete-proj" data-index="${idx}">Delete Project</button>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label>Project Title / Name</label>
            <input type="text" class="proj-title" data-index="${idx}" value="${proj.title || ''}" placeholder="e.g. Synaptiqo Platform">
          </div>
          <div class="form-group">
            <label>Category / Domain</label>
            <input type="text" class="proj-cat" data-index="${idx}" value="${proj.category || ''}" placeholder="Full Stack & AI Data Pipeline">
          </div>

          <div class="form-group full-width">
            <label>Skills / Tools / Languages Used (Comma-separated — Visible on Project Card & Modal)</label>
            <input type="text" class="proj-tools" data-index="${idx}" value="${(proj.tools || []).join(', ')}" placeholder="Python, SQL, Power BI, DAX, PostgreSQL, Docker">
            <span class="help-text">These appear as stylish tags on the project card overview and in the project details view.</span>
          </div>

          <div class="form-group">
            <label>Main Thumbnail URL / Path</label>
            <input type="text" class="proj-thumb" data-index="${idx}" value="${proj.thumbnail || ''}" placeholder="synaptiqo-thumb.svg or image URL">
          </div>

          <div class="form-group">
            <label>Upload Single Thumbnail Image</label>
            <input type="file" class="proj-thumb-file" data-index="${idx}" accept="image/*">
            <span class="help-text">Select image file to set as main card cover.</span>
          </div>

          <div class="form-group full-width">
            <label>📤 Upload Multiple Screenshots (Direct Multi-File Selection)</label>
            <input type="file" multiple class="proj-multi-ss-files" data-index="${idx}" accept="image/*">
            <span class="help-text">Hold Ctrl / Shift to select multiple image files directly from your computer!</span>
            
            ${screenshotsArr.length > 0 ? `
              <div style="margin-top:12px;">
                <div style="font-size:12px; font-family:var(--font-mono); color:var(--champagne); margin-bottom:6px;">Current Screenshots Gallery (${screenshotsArr.length}):</div>
                <div class="ss-gallery-wrap">
                  ${ssChipsHtml}
                </div>
              </div>
            ` : ''}
          </div>

          <div class="form-group full-width">
            <label>Additional Screenshots Paths (Manual Comma-separated Edit)</label>
            <textarea class="proj-screenshots" data-index="${idx}" rows="2" placeholder="synaptiqo-thumb.svg, https://...">${screenshotsStr}</textarea>
          </div>

          <div class="form-group full-width">
            <label>🎥 YouTube Video Presentation Link (Optional)</label>
            <input type="url" class="proj-youtube" data-index="${idx}" value="${proj.youtubeUrl || ''}" placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/...">
            <span class="help-text">Paste YouTube link to embed a playable video in project details. If left blank, no video will appear.</span>
          </div>

          <div class="form-group full-width">
            <label>Detailed Project Description</label>
            <textarea class="proj-desc" data-index="${idx}" rows="4" placeholder="Explain the problem statement, pipeline architecture, data validation, and business results...">${proj.description || ''}</textarea>
          </div>

          <div class="form-group">
            <label>GitHub Repository URL</label>
            <input type="url" class="proj-github" data-index="${idx}" value="${proj.githubUrl || proj.linkUrl || 'https://github.com/abhishekhingmire'}">
          </div>

          <div class="form-group">
            <label>Live Demo / Case Study URL</label>
            <input type="url" class="proj-demo" data-index="${idx}" value="${proj.demoUrl || proj.linkUrl || 'https://github.com/abhishekhingmire'}">
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    // Event Bindings
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
    container.querySelectorAll('.proj-tools').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.projects[e.target.dataset.index].tools = e.target.value
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      });
    });
    container.querySelectorAll('.proj-thumb').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.projects[e.target.dataset.index].thumbnail = e.target.value;
      });
    });
    container.querySelectorAll('.proj-thumb-file').forEach((input) => {
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const i = e.target.dataset.index;
        const reader = new FileReader();
        reader.onload = function (ev) {
          currentData.projects[i].thumbnail = ev.target.result;
          if (!Array.isArray(currentData.projects[i].screenshots)) {
            currentData.projects[i].screenshots = [];
          }
          if (currentData.projects[i].screenshots.length === 0) {
            currentData.projects[i].screenshots.push(ev.target.result);
          } else {
            currentData.projects[i].screenshots[0] = ev.target.result;
          }
          renderProjectsList();
          showToast('✓ Project thumbnail uploaded! Click "Save All Changes" to publish.');
        };
        reader.readAsDataURL(file);
      });
    });

    // Direct Multiple Screenshots File Upload Handler
    container.querySelectorAll('.proj-multi-ss-files').forEach((input) => {
      input.addEventListener('change', (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        const projIdx = parseInt(e.target.dataset.index, 10);
        if (!Array.isArray(currentData.projects[projIdx].screenshots)) {
          currentData.projects[projIdx].screenshots = [];
        }

        const readPromises = files.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target.result);
            reader.readAsDataURL(file);
          });
        });

        Promise.all(readPromises).then((results) => {
          results.forEach((dataUrl) => {
            currentData.projects[projIdx].screenshots.push(dataUrl);
          });
          // Also set thumbnail if empty
          if (!currentData.projects[projIdx].thumbnail && results[0]) {
            currentData.projects[projIdx].thumbnail = results[0];
          }
          renderProjectsList();
          showToast(`✓ ${results.length} screenshots uploaded! Click "Save All Changes" to publish.`);
        });
      });
    });

    // Delete single screenshot chip
    container.querySelectorAll('[data-action="delete-ss"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const pIdx = parseInt(e.target.dataset.projIndex, 10);
        const sIdx = parseInt(e.target.dataset.ssIndex, 10);
        if (Array.isArray(currentData.projects[pIdx]?.screenshots)) {
          currentData.projects[pIdx].screenshots.splice(sIdx, 1);
          renderProjectsList();
          showToast('Screenshot removed.');
        }
      });
    });

    container.querySelectorAll('.proj-screenshots').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.projects[e.target.dataset.index].screenshots = e.target.value
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      });
    });
    container.querySelectorAll('.proj-youtube').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.projects[e.target.dataset.index].youtubeUrl = e.target.value.trim();
      });
    });
    container.querySelectorAll('.proj-desc').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.projects[e.target.dataset.index].description = e.target.value;
      });
    });
    container.querySelectorAll('.proj-github').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.projects[e.target.dataset.index].githubUrl = e.target.value;
      });
    });
    container.querySelectorAll('.proj-demo').forEach((input) => {
      input.addEventListener('input', (e) => {
        currentData.projects[e.target.dataset.index].demoUrl = e.target.value;
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
        category: 'Business Intelligence & Python',
        thumbnail: 'synaptiqo-thumb.svg',
        screenshots: ['synaptiqo-thumb.svg'],
        description: 'Detailed description of the project pipeline, dataset insights, and business outcomes.',
        tools: ['Python', 'SQL', 'Power BI'],
        youtubeUrl: '',
        githubUrl: 'https://github.com/abhishekhingmire',
        demoUrl: 'https://github.com/abhishekhingmire'
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
    if (!currentData.profile) currentData.profile = {};

    // Profile
    const fullNameVal = document.getElementById('input-fullName')?.value?.trim();
    if (fullNameVal) currentData.profile.fullName = fullNameVal;

    const firstNameVal = document.getElementById('input-firstName')?.value?.trim();
    if (firstNameVal) currentData.profile.firstName = firstNameVal;

    const lastNameVal = document.getElementById('input-lastName')?.value?.trim();
    if (lastNameVal) currentData.profile.lastName = lastNameVal;

    const eyebrowVal = document.getElementById('input-eyebrow')?.value?.trim();
    if (eyebrowVal) currentData.profile.eyebrow = eyebrowVal;

    // Preserve photo: never let photo become empty or lost!
    const photoVal = document.getElementById('input-photo')?.value?.trim();
    if (photoVal) {
      currentData.profile.photo = photoVal;
    } else if (!currentData.profile.photo) {
      currentData.profile.photo = 'profile.jpg';
    }

    const photoBadgeVal = document.getElementById('input-photoBadge')?.value?.trim();
    if (photoBadgeVal) currentData.profile.photoBadge = photoBadgeVal;

    const resumeUrlVal = document.getElementById('input-resume-url')?.value?.trim();
    if (resumeUrlVal !== undefined) currentData.profile.resumeUrl = resumeUrlVal;

    const resumeLabelVal = document.getElementById('input-resume-label')?.value?.trim();
    if (resumeLabelVal) currentData.profile.resumeButtonText = resumeLabelVal;

    const rolesVal = document.getElementById('input-roles')?.value?.trim();
    if (rolesVal) {
      const rolesArr = rolesVal.split('\n').map((r) => r.trim()).filter(Boolean);
      if (rolesArr.length > 0) currentData.profile.roles = rolesArr;
    }

    // Hero Meta (preserve if untouched)
    const m1Title = document.getElementById('input-meta1-title')?.value?.trim();
    const m1Sub = document.getElementById('input-meta1-sub')?.value?.trim();
    const m2Title = document.getElementById('input-meta2-title')?.value?.trim();
    const m2Sub = document.getElementById('input-meta2-sub')?.value?.trim();
    const m3Title = document.getElementById('input-meta3-title')?.value?.trim();
    const m3Sub = document.getElementById('input-meta3-sub')?.value?.trim();

    if (m1Title || m2Title || m3Title) {
      currentData.profile.heroMeta = [
        {
          title: m1Title || currentData.profile.heroMeta?.[0]?.title || '3+ Years Exp',
          subtitle: m1Sub || currentData.profile.heroMeta?.[0]?.subtitle || 'BFSI & Financial Data Operations'
        },
        {
          title: m2Title || currentData.profile.heroMeta?.[1]?.title || 'SG Analytics',
          subtitle: m2Sub || currentData.profile.heroMeta?.[1]?.subtitle || 'Associate Analyst (BFSI/Fintech)'
        },
        {
          title: m3Title || currentData.profile.heroMeta?.[2]?.title || 'Python & Power BI',
          subtitle: m3Sub || currentData.profile.heroMeta?.[2]?.subtitle || 'Automated Reporting & ETL Pipelines'
        }
      ];
    }

    // About Narrative Bio (Preserve exact formatting & spacing)
    const bioInput = document.getElementById('input-about-bio')?.value;
    if (bioInput !== undefined) {
      currentData.profile.aboutBio = bioInput;
      currentData.profile.aboutText = bioInput.split('\n\n').map((p) => p.trim()).filter(Boolean);
    }

    // Skills Marquee
    const marqueeInput = document.getElementById('input-marquee-skills')?.value?.trim();
    if (marqueeInput) {
      const skillsArr = marqueeInput.split(',').map((s) => s.trim()).filter(Boolean);
      if (skillsArr.length > 0) currentData.marqueeSkills = skillsArr;
    }

    // Contact
    if (!currentData.profile.contact) currentData.profile.contact = {};
    currentData.profile.contact.email = document.getElementById('input-email')?.value?.trim() || currentData.profile.contact.email || 'abhishekhingmire2171@gmail.com';
    currentData.profile.contact.emailLabel = document.getElementById('input-emailLabel')?.value?.trim() || currentData.profile.contact.emailLabel || currentData.profile.contact.email;
    currentData.profile.contact.phone = document.getElementById('input-phone')?.value?.trim() || currentData.profile.contact.phone || '+91-8623921350';
    currentData.profile.contact.phoneLabel = document.getElementById('input-phoneLabel')?.value?.trim() || currentData.profile.contact.phoneLabel || '+91 86239 21350';
    currentData.profile.contact.phoneDisplay = document.getElementById('input-phoneDisplay')?.value?.trim() || currentData.profile.contact.phoneDisplay || '+91 86239 21350';
    currentData.profile.contact.location = document.getElementById('input-location')?.value?.trim() || currentData.profile.contact.location || 'Mumbai, India';
    currentData.profile.contact.linkedin = document.getElementById('input-linkedin')?.value?.trim() || currentData.profile.contact.linkedin || 'https://www.linkedin.com/in/abhishek-hingmire';
    currentData.profile.contact.linkedinLabel = document.getElementById('input-linkedinLabel')?.value?.trim() || currentData.profile.contact.linkedinLabel || 'LinkedIn ↗';
    currentData.profile.contact.github = document.getElementById('input-github')?.value?.trim() || currentData.profile.contact.github || 'https://github.com/abhishekhingmire';
    currentData.profile.contact.githubLabel = document.getElementById('input-githubLabel')?.value?.trim() || currentData.profile.contact.githubLabel || 'GitHub ↗';

    // Section Headings & Typography
    if (document.getElementById('input-heading-about-text')) {
      currentData.sectionHeadings = {
        about: {
          text: document.getElementById('input-heading-about-text').value.trim() || currentData.sectionHeadings?.about?.text || 'About Me',
          size: document.getElementById('input-heading-about-size').value.trim() || currentData.sectionHeadings?.about?.size || '2.5rem'
        },
        skills: {
          text: document.getElementById('input-heading-skills-text').value.trim() || currentData.sectionHeadings?.skills?.text || 'Skills & Core Stack',
          size: document.getElementById('input-heading-skills-size').value.trim() || currentData.sectionHeadings?.skills?.size || '2.5rem'
        },
        experience: {
          text: document.getElementById('input-heading-exp-text').value.trim() || currentData.sectionHeadings?.experience?.text || 'Experience',
          size: document.getElementById('input-heading-exp-size').value.trim() || currentData.sectionHeadings?.experience?.size || '2.5rem'
        },
        projects: {
          text: document.getElementById('input-heading-proj-text').value.trim() || currentData.sectionHeadings?.projects?.text || 'Selected Work & Projects',
          size: document.getElementById('input-heading-proj-size').value.trim() || currentData.sectionHeadings?.projects?.size || '2.5rem'
        },
        credentials: {
          text: document.getElementById('input-heading-edu-text').value.trim() || currentData.sectionHeadings?.credentials?.text || 'Education & Credentials',
          size: document.getElementById('input-heading-edu-size').value.trim() || currentData.sectionHeadings?.credentials?.size || '2.5rem'
        },
        contact: {
          text: document.getElementById('input-heading-contact-text').value.trim() || currentData.sectionHeadings?.contact?.text || 'Contact',
          size: document.getElementById('input-heading-contact-size').value.trim() || currentData.sectionHeadings?.contact?.size || '2.5rem'
        },
        contactHeadline: {
          text: document.getElementById('input-heading-contactheadline-text').value.trim() || currentData.sectionHeadings?.contactHeadline?.text || "Let's turn complex data into <em>actionable insights.</em>",
          size: document.getElementById('input-heading-contactheadline-size').value.trim() || currentData.sectionHeadings?.contactHeadline?.size || "clamp(2.2rem, 5.5vw, 4.2rem)"
        }
      };
    }

    // Customization
    if (!currentData.customization) currentData.customization = {};
    const accentCol = document.getElementById('input-accent-color')?.value;
    if (accentCol) currentData.customization.accentColor = accentCol;

    const accentTeal = document.getElementById('input-accent-teal')?.value;
    if (accentTeal) currentData.customization.accentTeal = accentTeal;

    const adminPinVal = document.getElementById('input-admin-pin')?.value?.trim();
    if (adminPinVal) {
      currentData.customization.adminPin = adminPinVal;
    } else if (!currentData.customization.adminPin) {
      currentData.customization.adminPin = '2171';
    }
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

  // --- RESUME STATUS & EVENT HANDLERS ---
  function updateResumeStatus(url) {
    const badge = document.getElementById('resume-status-badge');
    if (!badge) return;
    if (url && url.trim() !== '') {
      badge.textContent = '● Resume Active (Button Visible)';
      badge.style.color = 'var(--success)';
    } else {
      badge.textContent = '○ No Resume (Button Hidden)';
      badge.style.color = 'var(--muted)';
    }
  }

  const resumeUrlInput = document.getElementById('input-resume-url');
  if (resumeUrlInput) {
    resumeUrlInput.addEventListener('input', (e) => {
      updateResumeStatus(e.target.value.trim());
    });
  }

  const removeResumeBtn = document.getElementById('btn-remove-resume');
  if (removeResumeBtn) {
    removeResumeBtn.addEventListener('click', () => {
      if (document.getElementById('input-resume-url')) {
        document.getElementById('input-resume-url').value = '';
      }
      currentData.profile.resumeUrl = '';
      updateResumeStatus('');
      showToast('✓ Resume cleared! Click "Save All Changes" to publish.');
    });
  }

  const resumeFileInput = document.getElementById('input-resume-file');
  if (resumeFileInput) {
    resumeFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (ev) {
        document.getElementById('input-resume-url').value = ev.target.result;
        currentData.profile.resumeUrl = ev.target.result;
        updateResumeStatus(ev.target.result);
        showToast('✓ Resume PDF loaded! Click "Save All Changes" to publish.');
      };
      reader.readAsDataURL(file);
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
      const validPin = (currentData.customization && currentData.customization.adminPin) ? currentData.customization.adminPin : '2171';

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
