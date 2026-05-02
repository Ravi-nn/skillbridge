/* ============================================================
   SkillBridge — Complete Script (All 3 Weeks)
   Week 1 : UI & sample data logic
   Week 2 : Real Adzuna API integration
   Week 3 : Roadmap, share, deploy-ready
   ============================================================ */

'use strict';

// ── State ──────────────────────────────────────────────────
let usingRealApi = false;
let adzunaAppId  = '';
let adzunaAppKey = '';

// ── API Key Management ─────────────────────────────────────
function saveApiKeys() {
  const id  = document.getElementById('api-app-id').value.trim();
  const key = document.getElementById('api-app-key').value.trim();

  if (!id || !key) {
    flashNotice('Please enter both App ID and App Key.', 'warn');
    return;
  }

  localStorage.setItem('sb_app_id',  id);
  localStorage.setItem('sb_app_key', key);
  adzunaAppId  = id;
  adzunaAppKey = key;
  usingRealApi = true;

  document.getElementById('data-mode-badge').textContent = '📡 Live Job Data Enabled ✓';
  document.getElementById('data-mode-badge').style.background = 'rgba(0,245,160,0.12)';
  flashNotice('API keys saved! Live job data is now active.', 'success');
  hideApiNotice();
}

function skipApiSetup() {
  usingRealApi = false;
  hideApiNotice();
  flashNotice('Using sample data. You can add API keys anytime.', 'info');
}

function hideApiNotice() {
  const el = document.getElementById('api-notice');
  el.style.transition = 'opacity .4s';
  el.style.opacity = '0';
  setTimeout(() => { el.style.display = 'none'; }, 400);
}

// ── In-Demand Skills Database ──────────────────────────────
const SKILL_DB = {
  'web developer': [
    'javascript','react','html','css','git','typescript',
    'nodejs','rest api','tailwind','figma','responsive design',
    'vue','nextjs','github','mongodb','sql'
  ],
  'data analyst': [
    'python','sql','excel','power bi','tableau','statistics',
    'pandas','data visualization','machine learning','r',
    'google sheets','bigquery','communication'
  ],
  'ui ux designer': [
    'figma','photoshop','adobe xd','wireframing','user research',
    'prototyping','typography','color theory','sketch','zeplin',
    'illustrator','css','html'
  ],
  'digital marketing': [
    'seo','google analytics','facebook ads','content writing',
    'email marketing','canva','social media','copywriting',
    'google ads','wordpress','instagram','youtube'
  ],
  'project manager': [
    'communication','jira','agile','scrum','trello','excel',
    'leadership','risk management','notion','ms project',
    'stakeholder management','budgeting'
  ],
  'software engineer': [
    'javascript','python','git','sql','react','nodejs',
    'docker','aws','typescript','rest api','agile','java',
    'system design','algorithms','data structures'
  ],
  'general': [
    'javascript','react','html','css','python','sql','git',
    'excel','communication','figma','typescript','nodejs',
    'rest api','photoshop','tailwind','github','mongodb',
    'power bi','agile','google analytics'
  ]
};

// ── Free Learning Resources ────────────────────────────────
const RESOURCES = {
  'javascript':       { label: 'JavaScript Full Course',       url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', time: '300 hrs' },
  'react':            { label: 'React — Official Docs',        url: 'https://react.dev/learn', time: '40 hrs' },
  'html':             { label: 'HTML — MDN Web Docs',          url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', time: '20 hrs' },
  'css':              { label: 'CSS — The Odin Project',       url: 'https://www.theodinproject.com/', time: '30 hrs' },
  'python':           { label: 'Python — CS50P (Free)',        url: 'https://cs50.harvard.edu/python/2022/', time: '50 hrs' },
  'git':              { label: 'Git — GitHub Skills',          url: 'https://skills.github.com/', time: '5 hrs' },
  'nodejs':           { label: 'Node.js — Full Course (YT)',   url: 'https://www.youtube.com/watch?v=f2EqECiTBL8', time: '8 hrs' },
  'sql':              { label: 'SQL — Mode Analytics',         url: 'https://mode.com/sql-tutorial/', time: '10 hrs' },
  'figma':            { label: 'Figma — Official Course',      url: 'https://www.figma.com/resources/learn-design/', time: '15 hrs' },
  'typescript':       { label: 'TypeScript — Official Docs',   url: 'https://www.typescriptlang.org/docs/', time: '20 hrs' },
  'tailwind':         { label: 'Tailwind CSS — Official Docs', url: 'https://tailwindcss.com/docs/', time: '5 hrs' },
  'rest api':         { label: 'REST APIs — Postman Learning', url: 'https://learning.postman.com/', time: '8 hrs' },
  'mongodb':          { label: 'MongoDB — MongoDB University', url: 'https://learn.mongodb.com/', time: '12 hrs' },
  'github':           { label: 'GitHub — GitHub Skills',       url: 'https://skills.github.com/', time: '5 hrs' },
  'responsive design':{ label: 'Responsive Design — Scrimba', url: 'https://scrimba.com/learn/responsive', time: '8 hrs' },
  'vue':              { label: 'Vue.js — Official Docs',       url: 'https://vuejs.org/guide/introduction.html', time: '20 hrs' },
  'nextjs':           { label: 'Next.js — Official Docs',      url: 'https://nextjs.org/learn', time: '15 hrs' },
  'photoshop':        { label: 'Photoshop — Adobe Learn',      url: 'https://www.adobe.com/learn/photoshop', time: '20 hrs' },
  'excel':            { label: 'Excel — Microsoft Learn',      url: 'https://support.microsoft.com/en-us/office/excel-video-training-9bc05390-e94c-46af-a5b3-d7c22f6990bb', time: '10 hrs' },
  'power bi':         { label: 'Power BI — Microsoft Learn',   url: 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi', time: '12 hrs' },
  'python':           { label: 'Python — CS50P Harvard',       url: 'https://cs50.harvard.edu/python/', time: '50 hrs' },
  'pandas':           { label: 'Pandas — Kaggle Learn',        url: 'https://www.kaggle.com/learn/pandas', time: '4 hrs' },
  'tableau':          { label: 'Tableau — Tableau Public',     url: 'https://public.tableau.com/en-us/s/resources', time: '10 hrs' },
  'agile':            { label: 'Agile — Atlassian Guide',      url: 'https://www.atlassian.com/agile', time: '5 hrs' },
  'docker':           { label: 'Docker — Play with Docker',    url: 'https://labs.play-with-docker.com/', time: '8 hrs' },
  'seo':              { label: 'SEO — Google Fundamentals',    url: 'https://learndigital.withgoogle.com/digitalgarage/', time: '10 hrs' },
  'google analytics': { label: 'Analytics — Google Skillshop', url: 'https://skillshop.google.com/', time: '8 hrs' },
  'canva':            { label: 'Canva — Canva Design School',  url: 'https://www.canva.com/designschool/', time: '5 hrs' },
  'communication':    { label: 'Communication — Coursera',     url: 'https://www.coursera.org/courses?query=communication+skills', time: '10 hrs' },
};

const FALLBACK_RESOURCE = (skill) => ({
  label: `Learn ${cap(skill)} — freeCodeCamp Search`,
  url:   `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(skill)}`,
  time:  'Varies'
});

// ── Adzuna API ─────────────────────────────────────────────
async function fetchAdzunaJobs(city, role) {
  const query   = role || 'developer';
  const country = guessCountryCode(city);
  const url     = `https://api.adzuna.com/v1/api/jobs/${country}/search/1` +
    `?app_id=${adzunaAppId}&app_key=${adzunaAppKey}` +
    `&results_per_page=10&what=${encodeURIComponent(query)}&where=${encodeURIComponent(city)}` +
    `&content-type=application/json`;

  const res  = await fetch(url);
  if (!res.ok) throw new Error(`Adzuna API error: ${res.status}`);
  const data = await res.json();
  return data.results || [];
}

function guessCountryCode(city) {
  const map = {
    'london':'gb','manchester':'gb','edinburgh':'gb','birmingham':'gb',
    'new york':'us','san francisco':'us','chicago':'us','los angeles':'us','seattle':'us',
    'mumbai':'in','delhi':'in','bangalore':'in','hyderabad':'in','pune':'in','chennai':'in',
    'toronto':'ca','vancouver':'ca','montreal':'ca',
    'sydney':'au','melbourne':'au','brisbane':'au',
    'berlin':'de','munich':'de','frankfurt':'de',
    'paris':'fr','lyon':'fr',
    'dubai':'ae','abu dhabi':'ae',
    'singapore':'sg',
  };
  const key = city.toLowerCase();
  for (const [k,v] of Object.entries(map)) {
    if (key.includes(k)) return v;
  }
  return 'us'; // fallback
}

function extractSkillsFromJobs(jobs) {
  const allText = jobs.map(j => (
    (j.title || '') + ' ' + (j.description || '') + ' ' + (j.category?.label || '')
  ).toLowerCase()).join(' ');

  const allSkills = SKILL_DB['general'];
  return allSkills.filter(skill => allText.includes(skill.toLowerCase()));
}

// ── Main Analyze Function ──────────────────────────────────
async function analyzeSkills() {
  const cityInput   = document.getElementById('city').value.trim();
  const skillsInput = document.getElementById('skills').value.trim();
  const roleSelect  = document.getElementById('job-role').value;

  if (!cityInput)   { shakeInput('city');   return; }
  if (!skillsInput) { shakeInput('skills'); return; }

  // Parse user skills
  const userSkills = skillsInput.toLowerCase()
    .split(',').map(s => s.trim()).filter(Boolean);

  // Switch to loading view
  showLoading();

  // Animate loading steps
  await animateStep('ls1', 800);
  await animateStep('ls2', 900);

  let jobs         = [];
  let demandSkills = [];

  try {
    if (usingRealApi) {
      jobs         = await fetchAdzunaJobs(cityInput, roleSelect);
      demandSkills = extractSkillsFromJobs(jobs);
      if (!demandSkills.length) {
        demandSkills = SKILL_DB[roleSelect || 'general'];
      }
    } else {
      // Simulate a delay for sample data
      await delay(600);
      demandSkills = SKILL_DB[roleSelect || 'general'];
      jobs         = getSampleJobs(cityInput, roleSelect);
    }
  } catch (err) {
    console.warn('API fetch failed, falling back to sample data:', err);
    demandSkills = SKILL_DB[roleSelect || 'general'];
    jobs         = getSampleJobs(cityInput, roleSelect);
    usingRealApi = false;
  }

  await animateStep('ls3', 700);
  await animateStep('ls4', 600);

  // Compare skills
  const matched = demandSkills.filter(skill =>
    userSkills.some(u => u.includes(skill) || skill.includes(u))
  );
  const missing = demandSkills.filter(skill =>
    !userSkills.some(u => u.includes(skill) || skill.includes(u))
  ).slice(0, 7);

  const score = calcScore(matched.length, demandSkills.length);

  await delay(400);
  hideLoading();
  renderResults({ city: cityInput, role: roleSelect, userSkills, matched, missing, score, jobs, demandSkills });
}

// ── Render Results ─────────────────────────────────────────
function renderResults({ city, role, userSkills, matched, missing, score, jobs }) {

  // City label
  const roleLabel = role ? ` · ${cap(role)}` : '';
  document.getElementById('results-city').textContent =
    `📍 ${cap(city)}${roleLabel}`;

  // Score ring animation
  const ring = document.getElementById('score-fill-ring');
  const circumference = 314;
  ring.style.strokeDashoffset = circumference;

  // Inject SVG gradient
  injectScoreGradient(ring.closest('svg'));

  setTimeout(() => {
    ring.style.strokeDashoffset = circumference - (circumference * score / 100);
  }, 200);

  // Animate score number
  animateNumber('score-num', 0, score, 1200);

  // Breakdown numbers
  document.getElementById('b-have').textContent    = matched.length;
  document.getElementById('b-missing').textContent = missing.length;
  document.getElementById('b-jobs').textContent    = usingRealApi ? jobs.length : '20+';

  // Score description
  let desc = '';
  if (score < 30)      desc = '🌱 You\'re just starting — every expert was once a beginner!';
  else if (score < 50) desc = '🔥 Good foundation! A few more skills will make you competitive.';
  else if (score < 70) desc = '🚀 Solid profile! You\'re already attractive to many employers.';
  else if (score < 90) desc = '⚡ Excellent! You\'re highly competitive in the job market.';
  else                 desc = '🏆 Outstanding! You have all the in-demand skills employers want.';
  document.getElementById('score-desc').textContent = desc;

  // Tags — have
  const tagsHave = document.getElementById('tags-have');
  tagsHave.innerHTML = '';
  (matched.length ? matched : userSkills.slice(0, 8)).forEach(skill => {
    tagsHave.innerHTML += `<span class="tag tag-have">${cap(skill)}</span>`;
  });
  if (!matched.length) {
    tagsHave.innerHTML = `<span style="color:var(--muted);font-size:.85rem">None matched yet — add more skills below!</span>`;
  }

  // Tags — missing
  const tagsMissing = document.getElementById('tags-missing');
  tagsMissing.innerHTML = '';
  missing.forEach(skill => {
    tagsMissing.innerHTML += `<span class="tag tag-missing">${cap(skill)}</span>`;
  });

  // Roadmap
  const roadmapEl = document.getElementById('roadmap-cards');
  roadmapEl.innerHTML = '';
  missing.slice(0, 5).forEach((skill, i) => {
    const res = RESOURCES[skill] || FALLBACK_RESOURCE(skill);
    roadmapEl.innerHTML += `
      <div class="roadmap-item">
        <div class="roadmap-num">${String(i + 1).padStart(2,'0')}</div>
        <div class="roadmap-info">
          <div class="roadmap-skill">${cap(skill)}</div>
          <div class="roadmap-desc">⏱ Estimated time: ${res.time}</div>
        </div>
        <a class="roadmap-link" href="${res.url}" target="_blank" rel="noopener">
          Start Learning →
        </a>
      </div>`;
  });
  if (!missing.length) {
    roadmapEl.innerHTML = `<p style="color:var(--accent);font-weight:700">🎉 You already have all the key skills! Time to apply.</p>`;
  }

  // Jobs
  const jobsList = document.getElementById('jobs-list');
  jobsList.innerHTML = '';
  const displayJobs = jobs.slice(0, 5);
  displayJobs.forEach(job => {
    const initial = (job.company?.display_name || job.company || 'Co').charAt(0).toUpperCase();
    const salary  = job.salary_min
      ? `$${Math.round(job.salary_min / 1000)}k–$${Math.round(job.salary_max / 1000)}k/yr`
      : 'Salary not listed';
    const href    = job.redirect_url || job.url || '#';
    const title   = job.title || job.role || 'Software Developer';
    const company = job.company?.display_name || job.company || 'Tech Company';
    const location= job.location?.display_name || job.location || cap(city);

    jobsList.innerHTML += `
      <a class="job-card" href="${href}" target="_blank" rel="noopener">
        <div class="job-co">${initial}</div>
        <div class="job-info">
          <div class="job-title">${title}</div>
          <div class="job-meta">${company} · ${location}</div>
        </div>
        <div class="job-salary">${salary}</div>
      </a>`;
  });

  // More jobs button
  const moreBtn = document.getElementById('btn-more-jobs');
  const roleQ   = role ? encodeURIComponent(role) : 'developer';
  const cityQ   = encodeURIComponent(city);
  moreBtn.href  = `https://www.adzuna.com/search?q=${roleQ}&w=${cityQ}`;

  // Show results
  document.getElementById('results').classList.add('visible');
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// ── Sample Jobs (Week 1 fallback) ──────────────────────────
function getSampleJobs(city, role) {
  const roleLabel = role || 'Web Developer';
  return [
    { title: `Junior ${cap(roleLabel)}`,       company: 'TechStartup Co',    location: cap(city), salary_min: 45000,  salary_max: 65000,  url: `https://www.adzuna.com/search?q=${encodeURIComponent(roleLabel)}&w=${encodeURIComponent(city)}` },
    { title: `${cap(roleLabel)} — Remote`,      company: 'Digital Agency',    location: 'Remote',  salary_min: 55000,  salary_max: 80000,  url: `https://www.adzuna.com/search?q=${encodeURIComponent(roleLabel)}&w=${encodeURIComponent(city)}` },
    { title: `Mid-Level ${cap(roleLabel)}`,     company: 'Fintech Corp',      location: cap(city), salary_min: 70000,  salary_max: 95000,  url: `https://www.adzuna.com/search?q=${encodeURIComponent(roleLabel)}&w=${encodeURIComponent(city)}` },
    { title: `${cap(roleLabel)} Intern`,        company: 'SaaS Platform',     location: cap(city), salary_min: 25000,  salary_max: 35000,  url: `https://www.adzuna.com/search?q=${encodeURIComponent(roleLabel)}&w=${encodeURIComponent(city)}` },
    { title: `Senior ${cap(roleLabel)}`,        company: 'Enterprise Solutions', location: cap(city), salary_min: 90000, salary_max: 130000, url: `https://www.adzuna.com/search?q=${encodeURIComponent(roleLabel)}&w=${encodeURIComponent(city)}` },
  ];
}

// ── Share Report ───────────────────────────────────────────
function shareResult() {
  const score = document.getElementById('score-num').textContent;
  const city  = document.getElementById('results-city').textContent;
  const text  = `I just analyzed my skills with SkillBridge!\n\nJob Readiness Score: ${score}%\n${city}\n\nFind your skill gap for free 👇\n${window.location.href}`;

  if (navigator.share) {
    navigator.share({ title: 'SkillBridge Report', text, url: window.location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => {
      flashNotice('Report copied to clipboard! Share it on LinkedIn 🎉', 'success');
    });
  }
}

// ── Reset ──────────────────────────────────────────────────
function resetForm() {
  document.getElementById('city').value   = '';
  document.getElementById('skills').value = '';
  document.getElementById('job-role').selectedIndex = 0;
  document.getElementById('results').classList.remove('visible');
  document.getElementById('finder').style.display = 'flex';
  document.getElementById('finder').scrollIntoView({ behavior: 'smooth' });
}

// ── Loading Helpers ────────────────────────────────────────
function showLoading() {
  document.getElementById('finder').style.display        = 'none';
  document.getElementById('loading-section').classList.add('visible');
  document.getElementById('results').classList.remove('visible');
  document.getElementById('loading-section').scrollIntoView({ behavior: 'smooth' });
  ['ls1','ls2','ls3','ls4'].forEach(id => {
    document.getElementById(id).className = 'lstep';
  });
}

function hideLoading() {
  document.getElementById('loading-section').classList.remove('visible');
}

async function animateStep(id, ms) {
  const el = document.getElementById(id);
  el.classList.add('active');
  await delay(ms);
  el.classList.remove('active');
  el.classList.add('done');
}

// ── Utilities ──────────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function cap(str) {
  if (!str) return '';
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

function calcScore(matched, total) {
  if (!total) return 10;
  const raw = Math.round((matched / total) * 100);
  return Math.min(99, Math.max(5, raw));
}

function shakeInput(id) {
  const el = document.getElementById(id);
  el.style.borderColor = '#FF6B6B';
  el.style.animation   = 'shake .5s ease';
  el.focus();
  setTimeout(() => { el.style.borderColor = ''; el.style.animation = ''; }, 600);
}

function animateNumber(id, from, to, duration) {
  const el   = document.getElementById(id);
  const start = performance.now();
  function step(now) {
    const t    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(from + (to - from) * ease);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function injectScoreGradient(svg) {
  if (svg.querySelector('#scoreGrad')) return;
  const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
  defs.innerHTML = `
    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#00F5A0"/>
      <stop offset="100%" stop-color="#00C9FF"/>
    </linearGradient>`;
  svg.prepend(defs);
}

function flashNotice(msg, type) {
  const existing = document.getElementById('sb-flash');
  if (existing) existing.remove();

  const colors = { success: '#00F5A0', warn: '#FF9F43', info: '#00C9FF' };
  const div = document.createElement('div');
  div.id = 'sb-flash';
  div.textContent = msg;
  Object.assign(div.style, {
    position:     'fixed',
    bottom:       '28px',
    left:         '50%',
    transform:    'translateX(-50%)',
    background:   '#10101A',
    border:       `1px solid ${colors[type] || colors.info}`,
    color:        colors[type] || colors.info,
    padding:      '14px 28px',
    borderRadius: '50px',
    fontWeight:   '700',
    fontSize:     '0.88rem',
    zIndex:       '999',
    boxShadow:    '0 12px 40px rgba(0,0,0,.5)',
    animation:    'fadeUp .35s ease',
    maxWidth:     '90vw',
    textAlign:    'center',
  });
  document.body.appendChild(div);
  setTimeout(() => { div.style.opacity = '0'; div.style.transition = 'opacity .4s'; }, 3000);
  setTimeout(() => div.remove(), 3500);
}

// ── Shake animation ────────────────────────────────────────
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX( 8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX( 5px); }
  }
`;
document.head.appendChild(shakeStyle);

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Restore saved API keys
  const savedId  = localStorage.getItem('sb_app_id');
  const savedKey = localStorage.getItem('sb_app_key');
  if (savedId && savedKey) {
    adzunaAppId  = savedId;
    adzunaAppKey = savedKey;
    usingRealApi = true;
    document.getElementById('api-app-id').value  = savedId;
    document.getElementById('api-app-key').value = savedKey;
    document.getElementById('data-mode-badge').textContent = '📡 Live Job Data Enabled ✓';
    document.getElementById('data-mode-badge').style.background = 'rgba(0,245,160,0.12)';
    hideApiNotice();
  }

  // Enter key shortcuts
  document.getElementById('city').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('job-role').focus();
  });
  document.getElementById('skills').addEventListener('keydown', e => {
    if (e.key === 'Enter') analyzeSkills();
  });
});
