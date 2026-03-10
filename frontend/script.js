/* =============================================
   HOSPITAL RESOURCE TRACKER — script.js
   ============================================= */

// ========== INDEX PAGE ==========
if (!document.body.classList.contains('login-page')) {

  // ---------- STICKY NAVBAR ----------
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  // ---------- HAMBURGER MENU ----------
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close menu on nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ---------- LIVE CLOCK ----------
  const timeEl = document.getElementById('liveTime');
  function updateTime() {
    const now = new Date();
    timeEl.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
  }
  updateTime();
  setInterval(updateTime, 1000);

  // ---------- SCROLL REVEAL ----------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        entry.target.style.opacity = '1';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.feature-card, .step').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.animationPlayState = 'paused';
    el.style.setProperty('--delay', i * 80);
    observer.observe(el);
  });

  // ---------- SMOOTH ACTIVE NAV LINK ----------
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  // Add active link styles inline (avoids needing extra CSS)
  const activeStyle = document.createElement('style');
  activeStyle.textContent = `.nav-links a.active:not(.nav-login-btn) { color: var(--blue-main); background: var(--blue-pale); }`;
  document.head.appendChild(activeStyle);
}

// ========== LOGIN PAGE ==========
if (document.body.classList.contains('login-page')) {

  // ---------- ROLE TABS ----------
  document.querySelectorAll('.role-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('staffId').placeholder =
        tab.dataset.role === 'admin' ? 'Admin username or email' :
        tab.dataset.role === 'nurse' ? 'e.g. NR-10234 or email' :
        'e.g. DR-20451 or email';
    });
  });

  // ---------- TOGGLE PASSWORD VISIBILITY ----------
  const pwInput  = document.getElementById('password');
  const togglePw = document.getElementById('togglePw');
  const eyeIcon  = document.getElementById('eyeIcon');
  togglePw.addEventListener('click', () => {
    const visible = pwInput.type === 'text';
    pwInput.type = visible ? 'password' : 'text';
    eyeIcon.innerHTML = visible
      ? `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7"/>`
      : `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>`;
  });

  // ---------- FORM SUBMIT ----------
  const form       = document.getElementById('loginForm');
  const loginBtn   = document.getElementById('loginBtn');
  const errorMsg   = document.getElementById('errorMsg');
  const errorText  = document.getElementById('errorText');
  const successMsg = document.getElementById('successMsg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorMsg.classList.remove('show');
    successMsg.classList.remove('show');

    const id = document.getElementById('staffId').value.trim();
    const pw = document.getElementById('password').value;

    if (!id || !pw) {
      errorText.textContent = 'Please fill in all fields.';
      errorMsg.classList.add('show');
      return;
    }
    if (pw.length < 6) {
      errorText.textContent = 'Password must be at least 6 characters.';
      errorMsg.classList.add('show');
      return;
    }

    // Simulate login
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;

    setTimeout(() => {
      loginBtn.classList.remove('loading');
      loginBtn.disabled = false;
      successMsg.classList.add('show');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
    }, 1800);
  });
}