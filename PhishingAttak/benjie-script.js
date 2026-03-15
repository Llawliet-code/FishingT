const CREDENTIALS = { id: 'IT-BENJIE', password: 'admin123' };

const steps = [
    {
        title: 'Lock Account',
        description: 'Prevent further unauthorized access by disabling the compromised account.',
        action: 'Locking account...',
        done: 'Account locked successfully. No further logins permitted.',
        log: [
            '> Sending lock request to authentication server...',
            '> Account ID 8230580 flagged as COMPROMISED',
            '> All login tokens invalidated',
            '> Account status set to: LOCKED',
        ]
    },
    {
        title: 'Force Logout — Terminate All Active Sessions',
        description: 'End all currently active sessions to remove the attacker\'s access immediately.',
        action: 'Terminating sessions...',
        done: 'All active sessions terminated.',
        log: [
            '> Querying active session list for account 8230580...',
            '> Session found: 45.33.32.156 — Foreign Node',
            '> Session found: 112.204.18.91 — Daanbantayan, Cebu',
            '> Sending force-logout signal to all sessions...',
            '> Sessions terminated: 2 of 2',
        ]
    },
    {
        title: 'Reset Credentials — Issue Temporary Secure Password',
        description: 'Invalidate the stolen password and generate a new temporary secure credential.',
        action: 'Resetting credentials...',
        done: 'Credentials reset. Temporary password issued via secure channel.',
        log: [
            '> Invalidating current password hash...',
            '> Generating temporary secure password...',
            '> Temp password: [REDACTED — sent to verified recovery contact]',
            '> Password reset timestamp logged',
            '> User notified via backup contact',
        ]
    },
    {
        title: 'Review Account Activity',
        description: 'Check if grades, enrollment records, or personal data were modified or downloaded.',
        action: 'Auditing account activity...',
        done: 'Audit complete. No record modifications detected. Data intact.',
        log: [
            '> Pulling activity log for account 8230580...',
            '> Checking grade records... No modifications found.',
            '> Checking enrollment records... No modifications found.',
            '> Checking personal data exports... No downloads detected.',
            '> Audit result: CLEAN — Data integrity confirmed.',
        ]
    },
    {
        title: 'Block Phishing Domain — Flag Similar Emails',
        description: 'Remove the phishing domain from the network and update email filters to prevent further attacks.',
        action: 'Blocking domain...',
        done: 'Phishing domain blocked. Email filters updated campus-wide.',
        log: [
            '> Identified phishing domain: fake-campus-verify.net',
            '> Adding domain to network blacklist...',
            '> DNS block applied at campus gateway',
            '> Updating email filter rules...',
            '> Similar phishing patterns flagged in mail server',
            '> Domain blocked. Filters active.',
        ]
    },
];

let currentStep = 0;
let stepRunning = false;

function handleLogin() {
    const id   = document.getElementById('staff-id').value.trim();
    const pass = document.getElementById('staff-pass').value.trim();
    const err  = document.getElementById('login-error');

    if (id === CREDENTIALS.id && pass === CREDENTIALS.password) {
        document.getElementById('login-screen').style.display = 'none';
        const dash = document.getElementById('dashboard-screen');
        dash.style.display = 'flex';
        startDashboard();
    } else {
        err.style.display = 'block';
    }
}

document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.getElementById('login-screen').style.display !== 'none') handleLogin();
});

function handleLogout() {
    document.getElementById('dashboard-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('staff-id').value = '';
    document.getElementById('staff-pass').value = '';
}

function startDashboard() {
    updateClock();
    setInterval(updateClock, 1000);
    renderSteps();
}

function updateClock() {
    document.getElementById('dash-time').textContent = new Date().toLocaleTimeString();
}

function renderSteps() {
    const container = document.getElementById('steps-container');
    container.innerHTML = '';
    steps.forEach((step, i) => {
        const div = document.createElement('div');
        div.className = 'step-card' + (i === 0 ? ' active' : ' locked');
        div.id = `step-${i}`;
        div.innerHTML = `
            <div class="step-header">
                <div class="step-num" id="stepnum-${i}">${i + 1}</div>
                <div class="step-info">
                    <div class="step-title">${step.title}</div>
                    <div class="step-desc">${step.description}</div>
                </div>
                <button class="step-btn" id="stepbtn-${i}" onclick="executeStep(${i})"
                    ${i === 0 ? '' : 'disabled'}>Execute</button>
            </div>
            <div class="step-terminal" id="terminal-${i}" style="display:none;">
                <div class="terminal-lines" id="lines-${i}"></div>
                <div class="step-result" id="result-${i}" style="display:none;"></div>
            </div>
        `;
        container.appendChild(div);
    });
}

async function executeStep(i) {
    if (stepRunning || i !== currentStep) return;
    stepRunning = true;

    const step = steps[i];
    const btn = document.getElementById(`stepbtn-${i}`);
    const terminal = document.getElementById(`terminal-${i}`);
    const linesEl = document.getElementById(`lines-${i}`);
    const resultEl = document.getElementById(`result-${i}`);

    btn.disabled = true;
    btn.textContent = step.action;
    terminal.style.display = 'block';

    // Type out log lines
    for (const line of step.log) {
        await typeLine(linesEl, line);
        await delay(300);
    }

    await delay(400);

    // Show result
    resultEl.textContent = '✔ ' + step.done;
    resultEl.style.display = 'block';

    // Mark step done
    document.getElementById(`step-${i}`).classList.remove('active');
    document.getElementById(`step-${i}`).classList.add('done');
    document.getElementById(`stepnum-${i}`).textContent = '✓';
    btn.textContent = 'Done';

    currentStep++;
    stepRunning = false;

    // Unlock next step
    if (currentStep < steps.length) {
        const nextCard = document.getElementById(`step-${currentStep}`);
        nextCard.classList.remove('locked');
        nextCard.classList.add('active');
        document.getElementById(`stepbtn-${currentStep}`).disabled = false;
        nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        document.getElementById('complete-banner').style.display = 'flex';
        document.getElementById('complete-banner').scrollIntoView({ behavior: 'smooth' });
    }
}

function typeLine(container, text) {
    return new Promise(resolve => {
        const line = document.createElement('div');
        line.className = 'tline';
        container.appendChild(line);
        let i = 0;
        const iv = setInterval(() => {
            line.textContent += text[i++];
            container.scrollTop = container.scrollHeight;
            if (i >= text.length) { clearInterval(iv); resolve(); }
        }, 20);
    });
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
