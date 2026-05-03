/* ============================================================
   SkillBridge — Complete Script
   APIs: JSearch (Naukri/LinkedIn/Indeed/Internshala)
         Adzuna (Global)
         Remotive (Free, no key, remote tech)
   ============================================================ */

'use strict';

// ── State ──────────────────────────────────────────────────
let activeSource  = 'sample';   // 'jsearch' | 'adzuna' | 'remotive' | 'sample'
let jsearchKey    = '';
let adzunaAppId   = '';
let adzunaAppKey  = '';

// ── Simple Data Option Toggle ──────────────────────────────
function selectDataOption(choice, el) {
  // Deselect all
  document.querySelectorAll('.data-option').forEach(o => o.classList.remove('active'));
  document.getElementById('check-sample').classList.add('hidden');
  document.getElementById('check-live').classList.add('hidden');

  // Select chosen
  el.classList.add('active');
  document.getElementById(`check-${choice}`).classList.remove('hidden');

  // Show/hide live setup
  const setup = document.getElementById('live-setup');
  if (choice === 'live') {
    setup.classList.add('visible');
  } else {
    setup.classList.remove('visible');
  }
}

function confirmDataChoice() {
  const liveActive = document.getElementById('opt-live').classList.contains('active');
  if (liveActive) {
    const key = document.getElementById('jsearch-key').value.trim();
    if (!key) {
      flashNotice('Please paste your RapidAPI key to use live data — or choose "Start Instantly".', 'warn');
      document.getElementById('jsearch-key').focus();
      return;
    }
    saveJSearchKey();
  } else {
    skipApiSetup();
  }
}

// Keep switchApiTab as no-op for backward compat
function switchApiTab() {}

// ── Save JSearch Key ───────────────────────────────────────
function saveJSearchKey() {
  const key = document.getElementById('jsearch-key').value.trim();
  if (!key) { flashNotice('Please paste your RapidAPI key.', 'warn'); return; }
  localStorage.setItem('sb_jsearch_key', key);
  jsearchKey   = key;
  activeSource = 'jsearch';
  updateModeBadge('📡 JSearch Live · Naukri · LinkedIn · Indeed · Internshala');
  flashNotice('✅ JSearch connected! Pulling live jobs from Naukri, LinkedIn & more.', 'success');
  hideApiNotice();
}

// ── Save Adzuna Keys ───────────────────────────────────────
function saveApiKeys() {
  const id  = document.getElementById('api-app-id').value.trim();
  const key = document.getElementById('api-app-key').value.trim();
  if (!id || !key) { flashNotice('Please enter both Adzuna App ID and App Key.', 'warn'); return; }
  localStorage.setItem('sb_app_id',  id);
  localStorage.setItem('sb_app_key', key);
  adzunaAppId  = id;
  adzunaAppKey = key;
  activeSource = 'adzuna';
  updateModeBadge('📡 Adzuna Live · Global Job Data');
  flashNotice('✅ Adzuna connected! Live global job listings enabled.', 'success');
  hideApiNotice();
}

// ── Enable Remotive (free, no key) ─────────────────────────
function enableRemotive() {
  localStorage.setItem('sb_source', 'remotive');
  activeSource = 'remotive';
  updateModeBadge('📡 Remotive Live · Remote Tech Jobs (Free)');
  flashNotice('✅ Remotive enabled! Fetching remote tech jobs — no key needed.', 'success');
  hideApiNotice();
}

function updateModeBadge(text) {
  const badge = document.getElementById('data-mode-badge');
  badge.textContent = text;
  badge.style.background = 'rgba(0,245,160,0.12)';
  badge.style.borderColor = 'rgba(0,245,160,0.35)';
}

function skipApiSetup() {
  activeSource = 'sample';
  hideApiNotice();
  flashNotice('Using sample data. Add an API key anytime to get live jobs.', 'info');
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

// ═══════════════════════════════════════════════════════════
//  MULTI-SOURCE JOB FETCHERS
// ═══════════════════════════════════════════════════════════

// ── 1. JSearch (RapidAPI) — Naukri, LinkedIn, Indeed, Internshala, Glassdoor ──
async function fetchJSearchJobs(city, role) {
  const query = `${role || 'developer'} in ${city}`;
  const url   = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=2&date_posted=month`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key':  jsearchKey,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  });

  if (!res.ok) throw new Error(`JSearch error: ${res.status}`);
  const data = await res.json();

  window._adzunaTotalCount = data.data?.length || 0;

  return (data.data || []).map(j => ({
    title:        j.job_title,
    company:      { display_name: j.employer_name },
    location:     { display_name: (j.job_is_remote ? 'Remote' : `${j.job_city || city}, ${j.job_country || ''}`.trim()) },
    salary_min:   j.job_min_salary,
    salary_max:   j.job_max_salary,
    redirect_url: j.job_apply_link,
    description:  j.job_description || '',
    created:      j.job_posted_at_datetime_utc,
    contract_time: j.job_employment_type === 'FULLTIME' ? 'full_time'
                 : j.job_employment_type === 'PARTTIME' ? 'part_time' : '',
    category:     { label: j.job_publisher || '' },
    is_remote:    j.job_is_remote,
  }));
}

// ── 2. Adzuna — broad global coverage ─────────────────────
const COUNTRY_MAP = {
  'mumbai':'in','delhi':'in','bangalore':'in','bengaluru':'in','hyderabad':'in',
  'pune':'in','chennai':'in','kolkata':'in','ahmedabad':'in','jaipur':'in',
  'surat':'in','lucknow':'in','nagpur':'in','indore':'in','bhopal':'in',
  'sonipat':'in','gurugram':'in','noida':'in','gurgaon':'in','chandigarh':'in',
  'coimbatore':'in','kochi':'in','vizag':'in','patna':'in','kanpur':'in',
  'london':'gb','manchester':'gb','edinburgh':'gb','birmingham':'gb','leeds':'gb',
  'bristol':'gb','liverpool':'gb','sheffield':'gb','glasgow':'gb',
  'new york':'us','san francisco':'us','chicago':'us','los angeles':'us',
  'seattle':'us','austin':'us','boston':'us','denver':'us','miami':'us','dallas':'us',
  'toronto':'ca','vancouver':'ca','montreal':'ca','calgary':'ca',
  'sydney':'au','melbourne':'au','brisbane':'au','perth':'au',
  'berlin':'de','munich':'de','frankfurt':'de','hamburg':'de',
  'paris':'fr','dubai':'ae','singapore':'sg','amsterdam':'nl',
};

function guessCountryCode(city) {
  const key = city.toLowerCase().trim();
  for (const [k, v] of Object.entries(COUNTRY_MAP)) {
    if (key.includes(k)) return v;
  }
  return 'gb';
}

async function fetchAdzunaJobs(city, role) {
  const query   = role || 'developer';
  const country = guessCountryCode(city);
  const build   = (page) =>
    `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}` +
    `?app_id=${adzunaAppId}&app_key=${adzunaAppKey}` +
    `&results_per_page=10&what=${encodeURIComponent(query)}&where=${encodeURIComponent(city)}` +
    `&sort_by=relevance&content-type=application/json`;

  const [r1, r2] = await Promise.allSettled([fetch(build(1)), fetch(build(2))]);
  let jobs = [];

  if (r1.status === 'fulfilled' && r1.value.ok) {
    const d = await r1.value.json();
    window._adzunaTotalCount = d.count || 0;
    jobs = jobs.concat(d.results || []);
  } else {
    throw new Error('Adzuna API failed — check your App ID and Key.');
  }
  if (r2.status === 'fulfilled' && r2.value.ok) {
    const d = await r2.value.json();
    jobs = jobs.concat(d.results || []);
  }
  return jobs;
}

// ── 3. Remotive — free, no key, remote tech jobs ───────────
async function fetchRemotiveJobs(role) {
  const category = mapRoleToRemotive(role);
  const url = `https://remotive.com/api/remote-jobs?category=${encodeURIComponent(category)}&limit=20`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Remotive error: ${res.status}`);
  const data = await res.json();

  window._adzunaTotalCount = data.jobs?.length || 0;

  return (data.jobs || []).map(j => ({
    title:        j.title,
    company:      { display_name: j.company_name },
    location:     { display_name: j.candidate_required_location || 'Worldwide Remote' },
    salary_min:   null,
    salary_max:   null,
    redirect_url: j.url,
    description:  j.description || '',
    created:      j.publication_date,
    contract_time: 'full_time',
    category:     { label: j.category || '' },
    is_remote:    true,
  }));
}

function mapRoleToRemotive(role) {
  const map = {
    'web developer':     'software-dev',
    'software engineer': 'software-dev',
    'data analyst':      'data',
    'ui ux designer':    'design',
    'digital marketing': 'marketing',
    'project manager':   'management-finance',
  };
  return map[role] || 'software-dev';
}

// Smart skill extraction — counts how many jobs mention each skill (frequency)
function extractSkillsFromJobs(jobs, roleKey) {
  // Build one big lowercased string from all job text
  const texts = jobs.map(j =>
    [(j.title || ''), (j.description || ''), (j.category?.label || '')].join(' ').toLowerCase()
  );

  // Use role-specific skills + general skills as our candidate pool
  const candidates = [
    ...new Set([
      ...(SKILL_DB[roleKey] || []),
      ...SKILL_DB['general'],
    ])
  ];

  // Count frequency of each skill across all job listings
  const scored = candidates.map(skill => {
    const count = texts.filter(t => t.includes(skill)).length;
    return { skill, count };
  });

  // Sort by frequency — most demanded skills first
  scored.sort((a, b) => b.count - a.count);

  // Return only skills that appear in at least 1 job
  return scored.filter(s => s.count > 0).map(s => s.skill);
}

// Format salary nicely from Adzuna data
function formatSalary(job) {
  const min = job.salary_min;
  const max = job.salary_max;
  if (!min && !max) return 'Salary not listed';
  if (min && max) {
    const fMin = min >= 1000 ? `${Math.round(min / 1000)}k` : min;
    const fMax = max >= 1000 ? `${Math.round(max / 1000)}k` : max;
    return `$${fMin} – $${fMax}/yr`;
  }
  if (min) return `From $${Math.round(min / 1000)}k/yr`;
  return `Up to $${Math.round(max / 1000)}k/yr`;
}

// Get readable posted date from Adzuna's created field
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d    = new Date(dateStr);
  const now  = new Date();
  const days = Math.floor((now - d) / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7)  return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// ── Main Analyze Function ──────────────────────────────────
async function analyzeSkills() {
  const cityInput   = document.getElementById('city').value.trim();
  const skillsInput = document.getElementById('skills').value.trim();
  const roleSelect  = document.getElementById('job-role').value;
  const roleKey     = roleSelect || 'general';

  if (!cityInput)   { shakeInput('city');   return; }
  if (!skillsInput) { shakeInput('skills'); return; }

  // Parse user skills — clean and deduplicate
  const userSkills = [...new Set(
    skillsInput.toLowerCase().split(',').map(s => s.trim()).filter(Boolean)
  )];

  showLoading();
  window._adzunaTotalCount = 0;

  await animateStep('ls1', 900);

  let jobs         = [];
  let demandSkills = [];
  let apiWorked    = false;

  // ── Multi-source API dispatch ──────────────────────────────
  try {
    await animateStep('ls2', 300);

    if (activeSource === 'jsearch') {
      jobs      = await fetchJSearchJobs(cityInput, roleSelect);
      apiWorked = true;
      flashNotice(`✅ ${jobs.length} jobs fetched via JSearch (Naukri, LinkedIn, Indeed)!`, 'success');

    } else if (activeSource === 'adzuna') {
      jobs      = await fetchAdzunaJobs(cityInput, roleSelect);
      apiWorked = true;
      flashNotice(`✅ ${jobs.length} jobs fetched from Adzuna!`, 'success');

    } else if (activeSource === 'remotive') {
      jobs      = await fetchRemotiveJobs(roleSelect);
      apiWorked = true;
      flashNotice(`✅ ${jobs.length} remote jobs fetched from Remotive!`, 'success');

    } else {
      // Sample data
      await delay(700);
      jobs = getSampleJobs(cityInput, roleKey);
    }

    if (apiWorked) {
      demandSkills = extractSkillsFromJobs(jobs, roleKey);
      if (demandSkills.length < 5) {
        demandSkills = [...new Set([...demandSkills, ...SKILL_DB[roleKey]])];
      }
    } else {
      demandSkills = SKILL_DB[roleKey];
    }

  } catch (err) {
    console.warn('API fetch failed:', err.message);
    flashNotice(`⚠️ API error — using sample data. ${err.message}`, 'warn');
    await animateStep('ls2', 400);
    jobs         = getSampleJobs(cityInput, roleKey);
    demandSkills = SKILL_DB[roleKey];
    apiWorked    = false;
  }

  await animateStep('ls3', 700);
  await animateStep('ls4', 500);

  // Match user skills against demand — flexible partial matching
  const matched = demandSkills.filter(skill =>
    userSkills.some(u =>
      u === skill ||
      u.includes(skill) ||
      skill.includes(u) ||
      levenshtein(u, skill) <= 1   // catch typos like "Recat" → "React"
    )
  );

  const missing = demandSkills.filter(skill =>
    !userSkills.some(u =>
      u === skill || u.includes(skill) || skill.includes(u) || levenshtein(u, skill) <= 1
    )
  ).slice(0, 8);

  const score = calcScore(matched.length, demandSkills.length);

  await delay(300);
  hideLoading();
  renderResults({ city: cityInput, role: roleSelect, roleKey, userSkills, matched, missing, score, jobs, demandSkills, apiWorked });
}

// ── Levenshtein distance — catch small typos ───────────────
function levenshtein(a, b) {
  if (Math.abs(a.length - b.length) > 3) return 99;
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0)
  );
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[a.length][b.length];
}

// ── Render Results ─────────────────────────────────────────
function renderResults({ city, role, roleKey, userSkills, matched, missing, score, jobs, demandSkills, apiWorked }) {

  // Live timestamp
  const now = new Date();
  const tsEl = document.getElementById('results-timestamp');
  if (tsEl) tsEl.textContent = `🕐 Analyzed: ${now.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' })} at ${now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}`;

  // Header
  const roleLabel = role ? ` · ${cap(role)}` : '';
  const sourceLabel = activeSource === 'jsearch'   ? 'JSearch · Naukri/LinkedIn/Indeed'
                   : activeSource === 'adzuna'    ? 'Adzuna'
                   : activeSource === 'remotive'  ? 'Remotive · Remote'
                   : 'Sample Data';
  const dataLabel = apiWorked
    ? ` · ${jobs.length} jobs · ${sourceLabel}`
    : ` · Sample Data`;
  document.getElementById('results-city').textContent =
    `📍 ${cap(city)}${roleLabel}${dataLabel}`;

  // Score ring
  const ring = document.getElementById('score-fill-ring');
  ring.style.strokeDashoffset = 314;
  injectScoreGradient(ring.closest('svg'));
  setTimeout(() => {
    ring.style.strokeDashoffset = 314 - (314 * score / 100);
  }, 200);

  animateNumber('score-num', 0, score, 1300);

  // Breakdown
  document.getElementById('b-have').textContent    = matched.length;
  document.getElementById('b-missing').textContent = missing.length;
  document.getElementById('b-jobs').textContent    = apiWorked
    ? (window._adzunaTotalCount || jobs.length)
    : '20+';

  // Score message
  const descs = [
    [30,  '🌱 You\'re just starting out — every expert was once a beginner. Keep going!'],
    [50,  '🔥 Good foundation! A few more skills will make you highly competitive.'],
    [70,  '🚀 Solid profile! You\'re already attractive to many employers.'],
    [90,  '⚡ Excellent! You\'re highly competitive in the current job market.'],
    [101, '🏆 Outstanding! You match almost everything employers are looking for.'],
  ];
  document.getElementById('score-desc').textContent =
    descs.find(([threshold]) => score < threshold)[1];

  // Skills you have
  const tagsHave = document.getElementById('tags-have');
  tagsHave.innerHTML = '';
  const showHave = matched.length ? matched : userSkills.slice(0, 8);
  showHave.forEach(skill => {
    tagsHave.innerHTML += `<span class="tag tag-have">${cap(skill)}</span>`;
  });
  if (!matched.length) {
    tagsHave.innerHTML = `<span style="color:var(--muted);font-size:.85rem">No matches found — try adding more specific skills!</span>`;
  }

  // Skills to learn — show demand count badge if real API
  const tagsMissing = document.getElementById('tags-missing');
  tagsMissing.innerHTML = '';
  missing.forEach(skill => {
    tagsMissing.innerHTML += `<span class="tag tag-missing">${cap(skill)}</span>`;
  });

  // Roadmap — with demand level indicator
  const roadmapEl = document.getElementById('roadmap-cards');
  roadmapEl.innerHTML = '';
  if (!missing.length) {
    roadmapEl.innerHTML = `<p style="color:var(--accent);font-weight:700;font-size:1rem">🎉 You already have all key in-demand skills! Start applying now.</p>`;
  } else {
    missing.slice(0, 6).forEach((skill, i) => {
      const res    = RESOURCES[skill] || FALLBACK_RESOURCE(skill);
      const urgent = i < 2 ? '🔥 High Demand' : i < 4 ? '📈 In Demand' : '📚 Good to Know';
      roadmapEl.innerHTML += `
        <div class="roadmap-item">
          <div class="roadmap-num">${String(i + 1).padStart(2, '0')}</div>
          <div class="roadmap-info">
            <div class="roadmap-skill">${cap(skill)}</div>
            <div class="roadmap-desc">${urgent} &nbsp;·&nbsp; ⏱ ~${res.time}</div>
          </div>
          <a class="roadmap-link" href="${res.url}" target="_blank" rel="noopener">
            Start Free →
          </a>
        </div>`;
    });
  }

  // Store all jobs globally for filtering / load more
  window._allJobs     = jobs;
  window._jobCity     = city;
  window._jobRole     = role || 'developer';
  window._jobsShowing = 6;
  window._activeFilter = 'all';

  // Jobs count badge
  const srcIcon = activeSource === 'jsearch'  ? '🇮🇳'
               : activeSource === 'remotive' ? '💻'
               : '🌍';
  document.getElementById('jobs-count-badge').textContent = apiWorked
    ? `${srcIcon} Live · ${jobs.length} listings`
    : `📋 Sample · ${jobs.length} listings`;

  // Render initial 6 jobs
  renderJobCards(jobs.slice(0, 6));

  // Load more button — show if more than 6
  const loadMoreBtn = document.getElementById('btn-load-more');
  loadMoreBtn.style.display = jobs.length > 6 ? 'block' : 'none';

  // More jobs link
  const moreBtn = document.getElementById('btn-more-jobs');
  const roleQ   = role ? encodeURIComponent(role) : 'developer';
  const cityQ   = encodeURIComponent(city);
  moreBtn.href  = `https://www.adzuna.com/search?q=${roleQ}&w=${cityQ}`;

  // Show results
  document.getElementById('results').classList.add('visible');
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// ── Job Cards Renderer ─────────────────────────────────────
function renderJobCards(jobs) {
  const jobsList = document.getElementById('jobs-list');
  jobsList.innerHTML = '';

  if (!jobs.length) {
    jobsList.innerHTML = `
      <div class="jobs-empty">
        <span>🔍</span>
        No jobs found for this filter. Try "All Jobs" or a different role.
      </div>`;
    return;
  }

  jobs.forEach(job => {
    const companyName  = job.company?.display_name || job.company || 'Company';
    const initial      = companyName.charAt(0).toUpperCase();
    const title        = job.title || 'Developer';
    const location     = job.location?.display_name || job.location || 'Your City';
    const href         = job.redirect_url || job.url || '#';
    const salary       = formatSalary(job);
    const posted       = formatDate(job.created);
    const category     = job.category?.label || '';
    const contractType = job.contract_time === 'full_time' ? '🕐 Full-time'
                       : job.contract_time === 'part_time' ? '⏰ Part-time'
                       : job.contract_type === 'permanent' ? '📋 Permanent'
                       : '💼 Contract';

    jobsList.innerHTML += `
      <a class="job-card" href="${href}" target="_blank" rel="noopener">
        <div class="job-co">${initial}</div>
        <div class="job-info">
          <div class="job-title">${title}</div>
          <div class="job-meta">${companyName} · ${location}</div>
          <div class="job-tags-row">
            <span class="job-pill">${contractType}</span>
            ${category ? `<span class="job-pill">${category}</span>` : ''}
            ${posted   ? `<span class="job-pill">🕐 ${posted}</span>`  : ''}
          </div>
        </div>
        <div class="job-right">
          <div class="job-salary">${salary}</div>
          <div class="job-apply">Apply →</div>
        </div>
      </a>`;
  });
}

// ── Filter Jobs ────────────────────────────────────────────
function filterJobs(filter, btn) {
  // Update active button
  document.querySelectorAll('.jf-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  window._activeFilter  = filter;
  window._jobsShowing   = 6;

  const filtered = applyFilter(window._allJobs || [], filter);
  renderJobCards(filtered.slice(0, 6));

  // Load more button
  const loadMoreBtn = document.getElementById('btn-load-more');
  loadMoreBtn.style.display = filtered.length > 6 ? 'block' : 'none';
}

function applyFilter(jobs, filter) {
  if (filter === 'all')       return jobs;
  if (filter === 'full_time') return jobs.filter(j => j.contract_time === 'full_time');
  if (filter === 'part_time') return jobs.filter(j => j.contract_time === 'part_time');
  if (filter === 'remote')    return jobs.filter(j =>
    (j.location?.display_name || j.location || '').toLowerCase().includes('remote') ||
    (j.title || '').toLowerCase().includes('remote')
  );
  if (filter === 'salary')    return jobs.filter(j => j.salary_min || j.salary_max);
  return jobs;
}

// ── Load More Jobs ─────────────────────────────────────────
function loadMoreJobs() {
  window._jobsShowing = (window._jobsShowing || 6) + 6;
  const filtered = applyFilter(window._allJobs || [], window._activeFilter || 'all');
  renderJobCards(filtered.slice(0, window._jobsShowing));

  const loadMoreBtn = document.getElementById('btn-load-more');
  loadMoreBtn.style.display = filtered.length > window._jobsShowing ? 'block' : 'none';
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
  // Restore saved API source & keys
  const savedJSearch  = localStorage.getItem('sb_jsearch_key');
  const savedAdzId    = localStorage.getItem('sb_app_id');
  const savedAdzKey   = localStorage.getItem('sb_app_key');
  const savedRemotive = localStorage.getItem('sb_source') === 'remotive';

  if (savedJSearch) {
    jsearchKey   = savedJSearch;
    activeSource = 'jsearch';
    document.getElementById('jsearch-key').value = savedJSearch;
    updateModeBadge('📡 JSearch Live · Naukri · LinkedIn · Indeed · Internshala');
    hideApiNotice();
  } else if (savedAdzId && savedAdzKey) {
    adzunaAppId  = savedAdzId;
    adzunaAppKey = savedAdzKey;
    activeSource = 'adzuna';
    document.getElementById('api-app-id').value  = savedAdzId;
    document.getElementById('api-app-key').value = savedAdzKey;
    updateModeBadge('📡 Adzuna Live · Global Job Data');
    hideApiNotice();
  } else if (savedRemotive) {
    activeSource = 'remotive';
    updateModeBadge('📡 Remotive Live · Remote Tech Jobs (Free)');
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

/* ============================================================
   TESTIMONIALS SLIDER
   Auto-scroll · Drag · Dot Navigation
   ============================================================ */

(function () {
  let current     = 0;
  let total       = 0;
  let autoTimer   = null;
  let isDragging  = false;
  let startX      = 0;
  let dragOffset  = 0;
  const INTERVAL  = 4000;

  function initSlider() {
    const track  = document.getElementById('ttrack');
    const dots   = document.querySelectorAll('.tdot');
    if (!track) return;

    total = track.children.length;

    // Calculate card width + gap dynamically
    function getSlideWidth() {
      const card = track.children[0];
      if (!card) return 360;
      const style = window.getComputedStyle(card);
      return card.offsetWidth + parseInt(style.marginRight || 0) + 20; // 20 = gap
    }

    function goTo(index) {
      const wrap = document.querySelector('.testimonials-track-wrap');
      const visibleCount = Math.max(1, Math.floor(wrap.offsetWidth / getSlideWidth()));
      const maxIndex     = Math.max(0, total - visibleCount);
      current = Math.min(Math.max(index, 0), maxIndex);

      track.style.transform = `translateX(-${current * getSlideWidth()}px)`;

      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    // Expose globally for inline onclick
    window.goToSlide = goTo;
    window.nextSlide = () => { goTo(current + 1 >= total ? 0 : current + 1); restartAuto(); };
    window.prevSlide = () => { goTo(current - 1 < 0 ? total - 1 : current - 1); restartAuto(); };

    // Auto-scroll
    function startAuto() {
      autoTimer = setInterval(() => {
        goTo(current + 1 >= total ? 0 : current + 1);
      }, INTERVAL);
    }
    function restartAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    // Drag support (mouse + touch)
    const wrap = document.querySelector('.testimonials-track-wrap');

    wrap.addEventListener('mousedown', e => {
      isDragging = true; startX = e.clientX; dragOffset = 0;
      track.style.transition = 'none';
      clearInterval(autoTimer);
    });
    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      dragOffset = e.clientX - startX;
      track.style.transform = `translateX(${-current * getSlideWidth() + dragOffset}px)`;
    });
    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      if (dragOffset < -80)       goTo(current + 1);
      else if (dragOffset > 80)   goTo(current - 1);
      else                        goTo(current);
      restartAuto();
    });

    // Touch
    wrap.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX; dragOffset = 0;
      track.style.transition = 'none';
      clearInterval(autoTimer);
    }, { passive: true });
    wrap.addEventListener('touchmove', e => {
      dragOffset = e.touches[0].clientX - startX;
      track.style.transform = `translateX(${-current * getSlideWidth() + dragOffset}px)`;
    }, { passive: true });
    wrap.addEventListener('touchend', () => {
      track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      if (dragOffset < -60)      goTo(current + 1);
      else if (dragOffset > 60)  goTo(current - 1);
      else                       goTo(current);
      restartAuto();
    });

    // Pause on hover
    wrap.addEventListener('mouseenter', () => clearInterval(autoTimer));
    wrap.addEventListener('mouseleave', restartAuto);

    goTo(0);
    startAuto();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlider);
  } else {
    initSlider();
  }
})();
