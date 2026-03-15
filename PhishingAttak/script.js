// Terminal output messages
const terminalMessages = [
    '[SYSTEM] Initializing phishing attack sequence...',
    '[NETWORK] Establishing connection to target...',
    '[SUCCESS] Target clicked malicious link',
    '[CAPTURE] Intercepting credentials...',
    '[DATABASE] Storing victim data...',
    '[DECRYPT] Password hash cracked',
    '[ACCESS] Full system access granted',
    '[EXFIL] Beginning data extraction...',
    '[COMPLETE] Attack successful - All data compromised',
    '[MONITOR] Tracking user activity...',
    '[SCAN] Searching for sensitive files...',
    '[UPLOAD] Transferring data to server...',
    '[ENCRYPT] Securing connection...',
    '[LOG] Recording keystrokes...',
    '[CAMERA] Accessing webcam feed...',
    '[AUDIO] Monitoring microphone...',
    '[FILES] Indexing documents...',
    '[BROWSER] Extracting saved passwords...',
    '[NETWORK] Mapping local network...',
    '[PERSIST] Installing backdoor...'
];

// Fake victim data
const victimData = {
    name: 'Allan De Jesus',
    email: 'allandejesus@gmail.com',
    password: 'MyP@ssw0rd2023',
    ip: '192.168.1.147',
    location: 'Philippines, Cebu, Daanbantayan',
    device: 'Android 10 - Chrome 120.0'
};

// Update timestamp
function updateTimestamp() {
    const now = new Date();
    document.getElementById('timestamp').textContent = now.toLocaleTimeString();
}

// Add terminal line with typing effect
function addTerminalLine(message) {
    return new Promise(resolve => {
        const output = document.getElementById('terminal-output');
        const line = document.createElement('div');
        line.className = 'terminal-line';
        output.appendChild(line);
        
        let charIndex = 0;
        const typingSpeed = 30;
        
        function typeChar() {
            if (charIndex < message.length) {
                line.textContent += message[charIndex];
                charIndex++;
                setTimeout(typeChar, typingSpeed);
            } else {
                output.scrollTop = output.scrollHeight;
                
                // Keep only last 15 lines
                while (output.children.length > 15) {
                    output.removeChild(output.firstChild);
                }
                
                resolve();
            }
        }
        
        typeChar();
    });
}

// Loop terminal messages continuously
async function loopTerminalMessages() {
    let messageIndex = 0;
    
    while (true) {
        await addTerminalLine(`> ${terminalMessages[messageIndex]}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        messageIndex = (messageIndex + 1) % terminalMessages.length;
    }
}

// Reveal victim data
function revealData(elementId, value, delay) {
    setTimeout(() => {
        const element = document.getElementById(elementId);
        element.textContent = value;
    }, delay);
}

// Animate progress bars
function animateProgress(elementId, delay) {
    setTimeout(() => {
        document.getElementById(elementId).style.width = '100%';
    }, delay);
}

// Main animation sequence
async function runAttackSequence() {
    updateTimestamp();
    setInterval(updateTimestamp, 1000);

    // Reveal victim data progressively
    revealData('victim-name', victimData.name, 2000);
    revealData('victim-email', victimData.email, 2500);
    revealData('victim-password', victimData.password, 3000);
    revealData('victim-ip', victimData.ip, 3500);
    revealData('victim-location', victimData.location, 4000);
    revealData('victim-device', victimData.device, 4500);

    // Animate progress bars
    animateProgress('progress-1', 1500);
    animateProgress('progress-2', 2500);
    animateProgress('progress-3', 3500);
    
    // Start looping terminal messages
    loopTerminalMessages();
}

// Matrix rain effect
function initMatrixRain() {
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/~`';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff00';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 33);
}

// Start when page loads
window.addEventListener('load', () => {
    initMatrixRain();
    runAttackSequence();
});
