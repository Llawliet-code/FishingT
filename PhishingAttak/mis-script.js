// Staff credentials
const STAFF_CREDENTIALS = { id: 'MIS-ROMEO', password: 'admin123' };

// Victim database
const studentDB = {
    'allandejesus@gmail.com': {
        id: '8230580',
        name: 'Allan De Jesus',
        email: 'allandejesus@gmail.com',
        program: 'BS Information Technology',
        year: '2nd Year',
        status: 'COMPROMISED',
        suspiciousIP: '45.33.32.156',
        suspiciousLocation: 'Unknown — Foreign Node (Unregistered)',
        suspiciousTime: '09:11:43 AM — 3 mins after credentials submitted',
        device: 'Unknown Device / Unrecognized Browser',
        loginLogs: [
            { time: '08:45:12 AM', ip: '112.204.18.91',  location: 'Daanbantayan, Cebu, PH', device: 'Chrome / Windows 10', status: 'normal' },
            { time: '08:50:34 AM', ip: '112.204.18.91',  location: 'Daanbantayan, Cebu, PH', device: 'Chrome / Windows 10', status: 'normal' },
            { time: '09:08:55 AM', ip: '112.204.18.91',  location: 'Daanbantayan, Cebu, PH', device: 'Chrome / Windows 10', status: 'normal' },
            { time: '09:09:02 AM', ip: '112.204.18.91',  location: 'Daanbantayan, Cebu, PH', device: 'Chrome / Windows 10', status: 'failed' },
            { time: '09:11:43 AM', ip: '45.33.32.156',   location: 'Unknown — Foreign Node', device: 'Unknown Device',       status: 'suspicious' },
        ]
    }
};

// Response actions
const responseActions = [
    'Lock account — prevent further unauthorized access',
    'Force logout — terminate all active sessions',
    'Reset credentials — issue temporary secure password',
    'Audit account activity — check for modified records',
    'Block phishing domain from network — flag similar emails',
    'Send campus-wide advisory to all students and faculty',
];

// ── LOGIN ──
function handleLogin() {
    const id   = document.getElementById('staff-id').value.trim();
    const pass = document.getElementById('staff-pass').value.trim();
    const err  = document.getElementById('login-error');

    if (id === STAFF_CREDENTIALS.id && pass === STAFF_CREDENTIALS.password) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard-screen').style.display = 'flex';
        startDashboard();
    } else {
        err.style.display = 'block';
    }
}

// Allow Enter key on login
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        if (document.getElementById('login-screen').style.display !== 'none') handleLogin();
        else checkLogs();
    }
});

function handleLogout() {
    document.getElementById('dashboard-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('staff-id').value = '';
    document.getElementById('staff-pass').value = '';
    document.getElementById('results-area').style.display = 'none';
    document.getElementById('email-input').value = '';
}

// ── DASHBOARD CLOCK ──
function startDashboard() {
    updateClock();
    setInterval(updateClock, 1000);
}

function updateClock() {
    document.getElementById('dash-time').textContent = new Date().toLocaleTimeString();
}

// ── LOG CHECKER ──
function checkLogs() {
    const email = document.getElementById('email-input').value.trim().toLowerCase();
    const errEl = document.getElementById('search-error');
    const student = studentDB[email];

    if (!student) {
        errEl.style.display = 'block';
        document.getElementById('results-area').style.display = 'none';
        return;
    }

    errEl.style.display = 'none';
    populateResults(student);
}

function populateResults(s) {
    // Account info
    document.getElementById('r-id').textContent      = s.id;
    document.getElementById('r-name').textContent    = s.name;
    document.getElementById('r-email').textContent   = s.email;
    document.getElementById('r-program').textContent = s.program;
    document.getElementById('r-year').textContent    = s.year;

    const statusEl = document.getElementById('r-status');
    statusEl.textContent = s.status;
    statusEl.className = s.status === 'COMPROMISED' ? 'text-red' : '';

    // Security alert
    document.getElementById('r-ip').textContent     = s.suspiciousIP;
    document.getElementById('r-loc').textContent    = s.suspiciousLocation;
    document.getElementById('r-time').textContent   = s.suspiciousTime;
    document.getElementById('r-device').textContent = s.device;

    // Login log table
    const tbody = document.getElementById('log-table-body');
    tbody.innerHTML = '';
    s.loginLogs.forEach(log => {
        const tr = document.createElement('tr');
        const badgeClass = log.status === 'normal' ? 'status-normal'
                         : log.status === 'suspicious' ? 'status-suspicious'
                         : 'status-failed';
        const badgeLabel = log.status === 'normal' ? 'Normal'
                         : log.status === 'suspicious' ? '⚠ Suspicious'
                         : 'Failed';
        tr.innerHTML = `
            <td>${log.time}</td>
            <td>${log.ip}</td>
            <td>${log.location}</td>
            <td>${log.device}</td>
            <td><span class="status-badge ${badgeClass}">${badgeLabel}</span></td>
        `;
        tbody.appendChild(tr);
    });

    // Response actions
    const grid = document.getElementById('actions-grid');
    grid.innerHTML = '';
    responseActions.forEach((action, i) => {
        const card = document.createElement('div');
        card.className = 'action-card';
        card.id = `act-${i}`;
        card.innerHTML = `<div class="action-check"></div><span>${action}</span>`;
        grid.appendChild(card);
        // Stagger the checkmarks
        setTimeout(() => {
            card.classList.add('done');
            card.querySelector('.action-check').textContent = '✓';
        }, 800 + i * 1200);
    });

    document.getElementById('results-area').style.display = 'block';
    document.getElementById('results-area').scrollIntoView({ behavior: 'smooth' });
}
