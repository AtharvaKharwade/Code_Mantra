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
        window.location.href = 'bed-tracking.html';
      }, 1200);
    }, 1800);
  });
}

// ========== BED TRACKING PAGE ==========
if (document.body.classList.contains('bed-tracking-page')) {

  // Ward configuration — easy to extend for backend later
  const WARDS = [
    { name: 'Ward A — General', totalBeds: 60 },
    { name: 'Ward B — Surgery', totalBeds: 40 },
    { name: 'Ward C — Pediatrics', totalBeds: 30 },
    { name: 'Ward D — Maternity', totalBeds: 25 },
    { name: 'Ward E — ICU', totalBeds: 15 },
    { name: 'Ward F — Emergency', totalBeds: 20 },
  ];

  const totalBedsEl    = document.getElementById('totalBeds');
  const occupiedBedsEl = document.getElementById('occupiedBeds');
  const availableBedsEl = document.getElementById('availableBeds');
  const totalBarEl     = document.getElementById('totalBar');
  const occupiedBarEl  = document.getElementById('occupiedBar');
  const availableBarEl = document.getElementById('availableBar');
  const wardTableBody  = document.getElementById('wardTableBody');
  const barChart       = document.getElementById('barChart');
  const btLiveTime     = document.getElementById('btLiveTime');

  // Hamburger for mobile
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  function randomOccupied(total) {
    // Between 30% and 95% occupancy
    const min = Math.floor(total * 0.3);
    const max = Math.floor(total * 0.95);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getStatusInfo(pct) {
    if (pct >= 80) return { label: 'Critical', cls: 'critical', barColor: 'var(--red)' };
    if (pct >= 60) return { label: 'Warning', cls: 'warning', barColor: 'var(--amber)' };
    return { label: 'Normal', cls: 'normal', barColor: 'var(--green)' };
  }

  function updateBedData() {
    let grandTotal = 0;
    let grandOccupied = 0;
    const wardData = [];

    for (const ward of WARDS) {
      const occupied = randomOccupied(ward.totalBeds);
      const available = ward.totalBeds - occupied;
      const pct = Math.round((occupied / ward.totalBeds) * 100);
      grandTotal += ward.totalBeds;
      grandOccupied += occupied;
      wardData.push({ ...ward, occupied, available, pct });
    }

    const grandAvailable = grandTotal - grandOccupied;
    const grandOccPct = Math.round((grandOccupied / grandTotal) * 100);
    const grandAvailPct = Math.round((grandAvailable / grandTotal) * 100);

    // Update summary cards
    totalBedsEl.textContent = grandTotal;
    occupiedBedsEl.textContent = grandOccupied;
    availableBedsEl.textContent = grandAvailable;

    totalBarEl.style.setProperty('--bar-pct', '100%');
    occupiedBarEl.style.setProperty('--bar-pct', grandOccPct + '%');
    availableBarEl.style.setProperty('--bar-pct', grandAvailPct + '%');

    // Update clock
    const now = new Date();
    btLiveTime.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });

    // Build table rows
    let tbodyHTML = '';
    for (const w of wardData) {
      const status = getStatusInfo(w.pct);
      tbodyHTML += `
        <tr>
          <td class="ward-name">${w.name}</td>
          <td>${w.totalBeds}</td>
          <td>${w.occupied}</td>
          <td><strong>${w.available}</strong></td>
          <td>
            <div class="occupancy-cell">
              <div class="occupancy-bar-bg">
                <div class="occupancy-bar-fg" style="width:${w.pct}%; background:${status.barColor};"></div>
              </div>
              <span class="occupancy-pct" style="color:${status.barColor};">${w.pct}%</span>
            </div>
          </td>
          <td><span class="bt-status-badge ${status.cls}">${status.label}</span></td>
        </tr>`;
    }
    wardTableBody.innerHTML = tbodyHTML;

    // Build bar chart
    let chartHTML = '';
    for (const w of wardData) {
      const status = getStatusInfo(w.pct);
      chartHTML += `
        <div class="bt-bar-row">
          <span class="bt-bar-label">${w.name.split('—')[0].trim()}</span>
          <div class="bt-bar-track">
            <div class="bt-bar-fill-occupied" style="width:${w.pct}%; background:${status.barColor};"></div>
          </div>
          <span class="bt-bar-pct">${w.pct}%</span>
        </div>`;
    }
    barChart.innerHTML = chartHTML;
  }

  // Initial load + every 2 seconds
  updateBedData();
  setInterval(updateBedData, 2000);
}

// ========== EQUIPMENT MONITORING PAGE ==========
if (document.body.classList.contains('equipment-page')) {

  // Equipment categories — swap with API calls for backend later
  const EQUIPMENT = [
    { name: 'Ventilators',      icon: '🫁', total: 45 },
    { name: 'Defibrillators',   icon: '⚡', total: 30 },
    { name: 'Patient Monitors', icon: '📟', total: 80 },
    { name: 'Infusion Pumps',   icon: '💉', total: 120 },
    { name: 'X-Ray Machines',   icon: '🔬', total: 12 },
    { name: 'Ultrasound Units', icon: '📡', total: 18 },
    { name: 'Oxygen Cylinders', icon: '🧪', total: 60 },
    { name: 'Surgical Tools',   icon: '🔧', total: 40 },
  ];

  const eqTotalEl       = document.getElementById('eqTotal');
  const eqActiveEl      = document.getElementById('eqActive');
  const eqAvailableEl   = document.getElementById('eqAvailable');
  const eqMaintenanceEl = document.getElementById('eqMaintenance');
  const eqTotalBar      = document.getElementById('eqTotalBar');
  const eqActiveBar     = document.getElementById('eqActiveBar');
  const eqAvailableBar  = document.getElementById('eqAvailableBar');
  const eqMaintenanceBar = document.getElementById('eqMaintenanceBar');
  const eqTableBody     = document.getElementById('eqTableBody');
  const eqBarChart      = document.getElementById('eqBarChart');
  const eqAlertsList    = document.getElementById('eqAlertsList');
  const eqLiveTime      = document.getElementById('eqLiveTime');

  // Hamburger for mobile
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getEqStatus(usagePct) {
    if (usagePct >= 85) return { label: 'Critical', cls: 'critical', barColor: 'var(--red)' };
    if (usagePct >= 60) return { label: 'Moderate', cls: 'warning', barColor: 'var(--amber)' };
    return { label: 'Normal', cls: 'normal', barColor: 'var(--green)' };
  }

  function updateEquipmentData() {
    let grandTotal = 0, grandActive = 0, grandAvailable = 0, grandMaintenance = 0;
    const eqData = [];
    const alerts = [];

    for (const eq of EQUIPMENT) {
      const maintenance = randomBetween(0, Math.floor(eq.total * 0.12));
      const usable = eq.total - maintenance;
      const active = randomBetween(Math.floor(usable * 0.3), Math.floor(usable * 0.9));
      const available = usable - active;
      const usagePct = Math.round((active / eq.total) * 100);

      grandTotal += eq.total;
      grandActive += active;
      grandAvailable += available;
      grandMaintenance += maintenance;

      eqData.push({ ...eq, active, available, maintenance, usagePct });

      // Generate alerts for critical equipment
      if (usagePct >= 85) {
        alerts.push({ type: 'critical', text: `${eq.name} usage at ${usagePct}% — only ${available} available` });
      } else if (maintenance >= 3) {
        alerts.push({ type: 'warning', text: `${eq.name} — ${maintenance} units under maintenance` });
      }
    }

    const activePct = Math.round((grandActive / grandTotal) * 100);
    const availPct = Math.round((grandAvailable / grandTotal) * 100);
    const maintPct = Math.round((grandMaintenance / grandTotal) * 100);

    // Summary cards
    eqTotalEl.textContent = grandTotal;
    eqActiveEl.textContent = grandActive;
    eqAvailableEl.textContent = grandAvailable;
    eqMaintenanceEl.textContent = grandMaintenance;

    eqTotalBar.style.setProperty('--bar-pct', '100%');
    eqActiveBar.style.setProperty('--bar-pct', activePct + '%');
    eqAvailableBar.style.setProperty('--bar-pct', availPct + '%');
    eqMaintenanceBar.style.setProperty('--bar-pct', maintPct + '%');

    // Clock
    const now = new Date();
    eqLiveTime.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });

    // Table
    let tbodyHTML = '';
    for (const e of eqData) {
      const status = getEqStatus(e.usagePct);
      tbodyHTML += `
        <tr>
          <td class="ward-name">${e.icon} ${e.name}</td>
          <td>${e.total}</td>
          <td>${e.active}</td>
          <td><strong>${e.available}</strong></td>
          <td>${e.maintenance}</td>
          <td>
            <div class="occupancy-cell">
              <div class="occupancy-bar-bg">
                <div class="occupancy-bar-fg" style="width:${e.usagePct}%; background:${status.barColor};"></div>
              </div>
              <span class="occupancy-pct" style="color:${status.barColor};">${e.usagePct}%</span>
            </div>
          </td>
          <td><span class="bt-status-badge ${status.cls}">${status.label}</span></td>
        </tr>`;
    }
    eqTableBody.innerHTML = tbodyHTML;

    // Bar chart
    let chartHTML = '';
    for (const e of eqData) {
      const status = getEqStatus(e.usagePct);
      chartHTML += `
        <div class="bt-bar-row">
          <span class="bt-bar-label">${e.name}</span>
          <div class="bt-bar-track">
            <div class="bt-bar-fill-occupied" style="width:${e.usagePct}%; background:${status.barColor};"></div>
          </div>
          <span class="bt-bar-pct">${e.usagePct}%</span>
        </div>`;
    }
    eqBarChart.innerHTML = chartHTML;

    // Alerts
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    let alertHTML = '';
    if (alerts.length === 0) {
      alertHTML = `<div class="eq-alert-item alert-info"><span class="eq-alert-dot"></span>All equipment levels are within safe thresholds.<span class="eq-alert-time">${timeStr}</span></div>`;
    } else {
      for (const a of alerts) {
        const cls = a.type === 'critical' ? 'alert-critical' : 'alert-warning';
        alertHTML += `<div class="eq-alert-item ${cls}"><span class="eq-alert-dot"></span>${a.text}<span class="eq-alert-time">${timeStr}</span></div>`;
      }
    }
    eqAlertsList.innerHTML = alertHTML;
  }

  // Initial load + every 2 seconds
  updateEquipmentData();
  setInterval(updateEquipmentData, 2000);
}

// ========== EMERGENCY ALLOCATION PAGE ==========
if (document.body.classList.contains('emergency-page')) {

  const DEPARTMENTS = [
    { name: 'Emergency Room',    maxStaff: 25, maxBeds: 30, maxEquip: 40 },
    { name: 'Trauma Center',     maxStaff: 18, maxBeds: 15, maxEquip: 30 },
    { name: 'ICU',               maxStaff: 20, maxBeds: 20, maxEquip: 35 },
    { name: 'Cardiac Unit',      maxStaff: 14, maxBeds: 12, maxEquip: 22 },
    { name: 'Burn Unit',         maxStaff: 10, maxBeds: 10, maxEquip: 18 },
    { name: 'Neurology',         maxStaff: 12, maxBeds: 14, maxEquip: 20 },
    { name: 'Pediatric Emergency', maxStaff: 12, maxBeds: 16, maxEquip: 18 },
  ];

  const INCIDENT_TEMPLATES = [
    { type: 'critical', text: 'Multi-vehicle collision — 8 incoming patients, ETA 4 min' },
    { type: 'critical', text: 'Mass casualty event reported — activating Code Orange' },
    { type: 'critical', text: 'Cardiac arrest in ER Bay 3 — crash team dispatched' },
    { type: 'warning', text: 'ICU at 90% capacity — divert non-critical admissions' },
    { type: 'warning', text: 'Blood bank reserves low — O-negative below threshold' },
    { type: 'warning', text: 'Ambulance fleet stretched — 2 units returning' },
    { type: 'warning', text: 'Ventilator shortage in Trauma Center — requesting transfer' },
    { type: 'info', text: 'OT Room 4 cleared and ready for emergency surgery' },
    { type: 'info', text: 'Additional nursing staff arriving for night shift' },
    { type: 'info', text: 'Backup generator test completed — all systems nominal' },
    { type: 'info', text: 'Helicopter medevac on standby at rooftop pad' },
  ];

  const emLiveTime      = document.getElementById('emLiveTime');
  const emLevelBanner   = document.getElementById('emLevelBanner');
  const emLevelIcon     = document.getElementById('emLevelIcon');
  const emLevelValue    = document.getElementById('emLevelValue');
  const emLevelDetail   = document.getElementById('emLevelDetail');
  const emBeds          = document.getElementById('emBeds');
  const emStaff         = document.getElementById('emStaff');
  const emAmbulance     = document.getElementById('emAmbulance');
  const emOT            = document.getElementById('emOT');
  const emBedsBar       = document.getElementById('emBedsBar');
  const emStaffBar      = document.getElementById('emStaffBar');
  const emAmbulanceBar  = document.getElementById('emAmbulanceBar');
  const emOTBar         = document.getElementById('emOTBar');
  const emTableBody     = document.getElementById('emTableBody');
  const emBarChart      = document.getElementById('emBarChart');
  const emIncidentFeed  = document.getElementById('emIncidentFeed');

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getDeptStatus(loadPct) {
    if (loadPct >= 85) return { label: 'Overloaded', cls: 'critical', barColor: 'var(--red)' };
    if (loadPct >= 60) return { label: 'Strained', cls: 'warning', barColor: 'var(--amber)' };
    return { label: 'Ready', cls: 'normal', barColor: 'var(--green)' };
  }

  function getEmergencyLevel(avgLoad) {
    if (avgLoad >= 85) return { level: 'CRITICAL', cls: 'level-critical', icon: '🚨', detail: 'All departments overloaded — mutual aid requested' };
    if (avgLoad >= 70) return { level: 'HIGH', cls: 'level-red', icon: '🔴', detail: 'Multiple departments strained — additional staff called in' };
    if (avgLoad >= 50) return { level: 'ELEVATED', cls: 'level-amber', icon: '🟡', detail: 'Some departments approaching capacity — monitoring closely' };
    return { level: 'NORMAL', cls: 'level-green', icon: '🟢', detail: 'All departments operating within safe capacity' };
  }

  function updateEmergencyData() {
    let totalBedsFree = 0, totalStaff = 0, totalAmbulances = rand(3, 10), totalOT = rand(2, 8);
    const totalAmbMax = 12, totalOTMax = 10;
    const deptData = [];
    let loadSum = 0;

    for (const dept of DEPARTMENTS) {
      const staff = rand(Math.floor(dept.maxStaff * 0.5), dept.maxStaff);
      const bedsFree = rand(1, Math.floor(dept.maxBeds * 0.6));
      const equip = rand(Math.floor(dept.maxEquip * 0.4), dept.maxEquip);
      const bedsOccupied = dept.maxBeds - bedsFree;
      const loadPct = Math.round((bedsOccupied / dept.maxBeds) * 100);

      totalBedsFree += bedsFree;
      totalStaff += staff;
      loadSum += loadPct;

      deptData.push({ ...dept, staff, bedsFree, equip, loadPct });
    }

    const avgLoad = Math.round(loadSum / DEPARTMENTS.length);
    const emLevel = getEmergencyLevel(avgLoad);

    // Clock
    const now = new Date();
    emLiveTime.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });

    // Level banner
    emLevelBanner.className = 'em-level-banner ' + emLevel.cls;
    emLevelIcon.textContent = emLevel.icon;
    emLevelValue.textContent = emLevel.level;
    emLevelDetail.textContent = emLevel.detail;

    // Summary cards
    emBeds.textContent = totalBedsFree;
    emStaff.textContent = totalStaff;
    emAmbulance.textContent = totalAmbulances;
    emOT.textContent = totalOT;

    const maxBeds = DEPARTMENTS.reduce((s, d) => s + d.maxBeds, 0);
    const maxStaff = DEPARTMENTS.reduce((s, d) => s + d.maxStaff, 0);
    emBedsBar.style.setProperty('--bar-pct', Math.round((totalBedsFree / maxBeds) * 100) + '%');
    emStaffBar.style.setProperty('--bar-pct', Math.round((totalStaff / maxStaff) * 100) + '%');
    emAmbulanceBar.style.setProperty('--bar-pct', Math.round((totalAmbulances / totalAmbMax) * 100) + '%');
    emOTBar.style.setProperty('--bar-pct', Math.round((totalOT / totalOTMax) * 100) + '%');

    // Table
    let tbodyHTML = '';
    for (const d of deptData) {
      const status = getDeptStatus(d.loadPct);
      tbodyHTML += `
        <tr>
          <td class="ward-name">${d.name}</td>
          <td>${d.staff} / ${d.maxStaff}</td>
          <td><strong>${d.bedsFree}</strong> / ${d.maxBeds}</td>
          <td>${d.equip} / ${d.maxEquip}</td>
          <td>
            <div class="occupancy-cell">
              <div class="occupancy-bar-bg">
                <div class="occupancy-bar-fg" style="width:${d.loadPct}%; background:${status.barColor};"></div>
              </div>
              <span class="occupancy-pct" style="color:${status.barColor};">${d.loadPct}%</span>
            </div>
          </td>
          <td><span class="bt-status-badge ${status.cls}">${status.label}</span></td>
        </tr>`;
    }
    emTableBody.innerHTML = tbodyHTML;

    // Bar chart
    let chartHTML = '';
    for (const d of deptData) {
      const status = getDeptStatus(d.loadPct);
      chartHTML += `
        <div class="bt-bar-row">
          <span class="bt-bar-label">${d.name}</span>
          <div class="bt-bar-track">
            <div class="bt-bar-fill-occupied" style="width:${d.loadPct}%; background:${status.barColor};"></div>
          </div>
          <span class="bt-bar-pct">${d.loadPct}%</span>
        </div>`;
    }
    emBarChart.innerHTML = chartHTML;

    // Incidents — pick 3-5 random ones
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const count = rand(3, 5);
    const shuffled = INCIDENT_TEMPLATES.sort(() => 0.5 - Math.random()).slice(0, count);
    let incHTML = '';
    for (const inc of shuffled) {
      const cls = inc.type === 'critical' ? 'alert-critical' : inc.type === 'warning' ? 'alert-warning' : 'alert-info';
      incHTML += `<div class="eq-alert-item ${cls}"><span class="eq-alert-dot"></span>${inc.text}<span class="eq-alert-time">${timeStr}</span></div>`;
    }
    emIncidentFeed.innerHTML = incHTML;
  }

  updateEmergencyData();
  setInterval(updateEmergencyData, 2000);
}