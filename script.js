// ========================================
// 🎮 ULTIMATE PONG - ENHANCED GAME ENGINE
// ========================================

const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game Configuration
const CONFIG = {
    PADDLE_WIDTH: 12,
    PADDLE_HEIGHT: 100,
    BALL_RADIUS: 8,
    WINNING_SCORE: 7,
    POWER_UP_SIZE: 25
};

// Game State
let gameState = {
    running: false,
    paused: false,
    mode: 'classic',
    hitCount: 0,
    rallyCount: 0,
    maxSpeed: 5,
    startTime: null,
    elapsedTime: 0,
    particles: [],
    powerUps: [],
    activePowerUp: null,
    powerUpTimer: 0,
    controlMode: 'mouse',
    soundEnabled: true,
    particlesEnabled: true,
    theme: 'neon'
};

// Themes
const themes = {
    neon: { player: '#06b6d4', ai: '#ec4899', ball: '#ffffff', particles: '#a855f7' },
    classic: { player: '#ffffff', ai: '#ffffff', ball: '#ffffff', particles: '#888888' },
    sunset: { player: '#f59e0b', ai: '#ef4444', ball: '#fbbf24', particles: '#fb923c' },
    ocean: { player: '#0ea5e9', ai: '#06b6d4', ball: '#67e8f9', particles: '#0284c7' }
};

// Paddles
let playerPaddle = {
    x: 30,
    y: canvas.height / 2 - CONFIG.PADDLE_HEIGHT / 2,
    width: CONFIG.PADDLE_WIDTH,
    height: CONFIG.PADDLE_HEIGHT,
    speed: 10,
    targetY: canvas.height / 2
};

let aiPaddle = {
    x: canvas.width - 30 - CONFIG.PADDLE_WIDTH,
    y: canvas.height / 2 - CONFIG.PADDLE_HEIGHT / 2,
    width: CONFIG.PADDLE_WIDTH,
    height: CONFIG.PADDLE_HEIGHT,
    speed: 5
};

// Ball
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: CONFIG.BALL_RADIUS,
    speedX: 6,
    speedY: 4,
    baseSpeed: 6,
    maxSpeed: 15,
    trail: []
};

// Scores
let playerScore = 0;
let aiScore = 0;

// Difficulties
const difficulties = {
    easy: { speed: 3.5, reactionDelay: 0.5, errorMargin: 50 },
    medium: { speed: 5, reactionDelay: 0.7, errorMargin: 30 },
    hard: { speed: 7, reactionDelay: 0.85, errorMargin: 15 },
    impossible: { speed: 9, reactionDelay: 0.98, errorMargin: 2 }
};

let currentDifficulty = difficulties.medium;

// Achievements
let achievements = [
    { id: 'first_win', name: 'First Victory', desc: 'Win your first game', icon: '🏆', unlocked: false },
    { id: 'perfect_game', name: 'Perfect Game', desc: 'Win without losing a point', icon: '💯', unlocked: false },
    { id: 'speed_demon', name: 'Speed Demon', desc: 'Hit ball at max speed', icon: '⚡', unlocked: false },
    { id: 'rally_master', name: 'Rally Master', desc: 'Achieve 20 hit rally', icon: '🎯', unlocked: false },
    { id: 'impossible_beat', name: 'Impossible!', desc: 'Beat AI on Impossible', icon: '😱', unlocked: false },
    { id: 'survivor', name: 'Survivor', desc: 'Score 15 in Survival mode', icon: '🛡️', unlocked: false },
    { id: 'time_lord', name: 'Time Lord', desc: 'Score 20 in Time Attack', icon: '⏱️', unlocked: false }
];

// Power-ups
const powerUpTypes = [
    { type: 'speedBoost', name: 'Speed Boost', icon: '⚡', color: '#fbbf24', duration: 5000 },
    { type: 'paddleGrow', name: 'Paddle Grow', icon: '📏', color: '#06b6d4', duration: 7000 },
    { type: 'slowMotion', name: 'Slow Motion', icon: '🐌', color: '#a855f7', duration: 6000 }
];

// ========================================
// PARTICLE SYSTEM
// ========================================
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.radius = Math.random() * 3 + 1;
        this.color = color;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.radius *= 0.98;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    isDead() {
        return this.life <= 0;
    }
}

function createParticles(x, y, count, color) {
    if (!gameState.particlesEnabled) return;
    for (let i = 0; i < count; i++) {
        gameState.particles.push(new Particle(x, y, color));
    }
}

// ========================================
// POWER-UP SYSTEM
// ========================================
class PowerUp {
    constructor(x, y) {
        const typeData = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        this.x = x;
        this.y = y;
        this.size = CONFIG.POWER_UP_SIZE;
        this.type = typeData.type;
        this.icon = typeData.icon;
        this.color = typeData.color;
        this.duration = typeData.duration;
        this.rotation = 0;
        this.pulse = 0;
    }
    update() {
        this.rotation += 0.05;
        this.pulse = Math.sin(Date.now() * 0.005) * 3;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2 + this.pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, this.x, this.y);
        ctx.shadowBlur = 0;
    }
    checkCollision(paddle) {
        return (this.x < paddle.x + paddle.width && this.x + this.size > paddle.x &&
                this.y < paddle.y + paddle.height && this.y + this.size > paddle.y);
    }
}

function spawnPowerUp() {
    if (gameState.mode === 'classic' && Math.random() < 0.3) {
        const x = canvas.width / 2;
        const y = Math.random() * (canvas.height - CONFIG.POWER_UP_SIZE * 2) + CONFIG.POWER_UP_SIZE;
        gameState.powerUps.push(new PowerUp(x, y));
    }
}

function activatePowerUp(powerUp) {
    gameState.activePowerUp = powerUp;
    gameState.powerUpTimer = powerUp.duration;
    if (powerUp.type === 'speedBoost') playerPaddle.speed = 15;
    if (powerUp.type === 'paddleGrow') playerPaddle.height = CONFIG.PADDLE_HEIGHT * 1.5;
    if (powerUp.type === 'slowMotion') { ball.speedX *= 0.5; ball.speedY *= 0.5; }
    updatePowerUpDisplay();
    playSound('powerup');
}

function deactivatePowerUp() {
    if (!gameState.activePowerUp) return;
    if (gameState.activePowerUp.type === 'speedBoost') playerPaddle.speed = 10;
    if (gameState.activePowerUp.type === 'paddleGrow') playerPaddle.height = CONFIG.PADDLE_HEIGHT;
    if (gameState.activePowerUp.type === 'slowMotion') { ball.speedX *= 2; ball.speedY *= 2; }
    gameState.activePowerUp = null;
    gameState.powerUpTimer = 0;
    updatePowerUpDisplay();
}

function updatePowerUpDisplay() {
    const display = document.getElementById('powerUpDisplay');
    if (gameState.activePowerUp) {
        const timeLeft = Math.ceil(gameState.powerUpTimer / 1000);
        const powerUpData = powerUpTypes.find(p => p.type === gameState.activePowerUp.type);
        display.innerHTML = `<div class="text-4xl mb-2">${gameState.activePowerUp.icon}</div>
            <div class="text-sm font-bold text-white">${powerUpData.name}</div>
            <div class="text-xs text-gray-400">${timeLeft}s</div>`;
    } else {
        display.innerHTML = `<div class="text-3xl mb-2">💫</div><div class="text-xs text-gray-400">None Active</div>`;
    }
}

// ========================================
// SOUND EFFECTS
// ========================================
function playSound(type) {
    if (!gameState.soundEnabled) return;
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        if (type === 'hit') { oscillator.frequency.value = 200; gainNode.gain.value = 0.1; }
        if (type === 'score') { oscillator.frequency.value = 440; gainNode.gain.value = 0.2; }
        if (type === 'powerup') { oscillator.frequency.value = 880; gainNode.gain.value = 0.15; }
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {}
}

// ========================================
// CONTROLS
// ========================================
canvas.addEventListener('mousemove', (e) => {
    if (gameState.running && !gameState.paused && gameState.controlMode === 'mouse') {
        const rect = canvas.getBoundingClientRect();
        const scaleY = canvas.height / rect.height;
        playerPaddle.targetY = (e.clientY - rect.top) * scaleY;
    }
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (gameState.running && !gameState.paused && gameState.controlMode === 'touch') {
        const rect = canvas.getBoundingClientRect();
        const scaleY = canvas.height / rect.height;
        const touch = e.touches[0];
        playerPaddle.targetY = (touch.clientY - rect.top) * scaleY;
    }
}, { passive: false });

const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' && gameState.running) { e.preventDefault(); togglePause(); }
    if (e.key === 'Escape' && gameState.running) returnToMenu();
});

document.addEventListener('keyup', (e) => { keys[e.key] = false; });

function updateKeyboardControl() {
    if (gameState.controlMode !== 'keyboard') return;
    if (keys['w'] || keys['W'] || keys['ArrowUp']) playerPaddle.targetY -= playerPaddle.speed;
    if (keys['s'] || keys['S'] || keys['ArrowDown']) playerPaddle.targetY += playerPaddle.speed;
}

// ========================================
// GAME LOGIC
// ========================================
function updatePaddles() {
    const smoothing = 0.3;
    playerPaddle.y += (playerPaddle.targetY - playerPaddle.y - playerPaddle.height / 2) * smoothing;
    playerPaddle.y = Math.max(0, Math.min(canvas.height - playerPaddle.height, playerPaddle.y));
    updateAI();
}

function updateAI() {
    const targetY = ball.y + (Math.random() - 0.5) * currentDifficulty.errorMargin;
    const paddleCenter = aiPaddle.y + aiPaddle.height / 2;
    if (ball.speedX > 0 && Math.random() < currentDifficulty.reactionDelay) {
        if (paddleCenter < targetY - 15) aiPaddle.y += aiPaddle.speed;
        else if (paddleCenter > targetY + 15) aiPaddle.y -= aiPaddle.speed;
    }
    aiPaddle.y = Math.max(0, Math.min(canvas.height - aiPaddle.height, aiPaddle.y));
}

function updateBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    if (gameState.particlesEnabled) {
        ball.trail.push({ x: ball.x, y: ball.y });
        if (ball.trail.length > 15) ball.trail.shift();
    }
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY = -ball.speedY;
        createParticles(ball.x, ball.y, 10, themes[gameState.theme].particles);
        playSound('hit');
    }
    if (checkPaddleCollision(ball, playerPaddle)) handlePaddleHit(playerPaddle, 1);
    if (checkPaddleCollision(ball, aiPaddle)) handlePaddleHit(aiPaddle, -1);
    if (ball.x - ball.radius < 0) handleScore('ai');
    else if (ball.x + ball.radius > canvas.width) handleScore('player');
}

function checkPaddleCollision(ball, paddle) {
    return (ball.x - ball.radius < paddle.x + paddle.width && ball.x + ball.radius > paddle.x &&
            ball.y > paddle.y && ball.y < paddle.y + paddle.height);
}

function handlePaddleHit(paddle, direction) {
    const hitPos = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
    const angle = hitPos * Math.PI / 3;
    const currentSpeed = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);
    const newSpeed = Math.min(currentSpeed + 0.3, ball.maxSpeed);
    ball.speedX = Math.cos(angle) * newSpeed * direction;
    ball.speedY = Math.sin(angle) * newSpeed;
    ball.x = direction > 0 ? paddle.x + paddle.width + ball.radius : paddle.x - ball.radius;
    gameState.hitCount++;
    gameState.rallyCount++;
    gameState.maxSpeed = Math.max(gameState.maxSpeed, newSpeed);
    updateStats();
    createParticles(ball.x, ball.y, 15, themes[gameState.theme].particles);
    playSound('hit');
    if (gameState.hitCount % 10 === 0) spawnPowerUp();
    if (gameState.rallyCount >= 20) unlockAchievement('rally_master');
    if (newSpeed >= ball.maxSpeed - 0.1) unlockAchievement('speed_demon');
}

function handleScore(scorer) {
    if (scorer === 'player') playerScore++;
    else { aiScore++; gameState.rallyCount = 0; }
    updateScoreboard();
    playSound('score');
    createParticles(ball.x, ball.y, 30, scorer === 'player' ? '#06b6d4' : '#ec4899');
    if (gameState.mode === 'survival' && scorer === 'ai') {
        endGame('💀 Game Over!', `You survived ${playerScore} rounds!`);
        return;
    }
    if (!checkWinner()) resetBall();
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.trail = [];
    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6;
    const direction = Math.random() > 0.5 ? 1 : -1;
    ball.speedX = Math.cos(angle) * ball.baseSpeed * direction;
    ball.speedY = Math.sin(angle) * ball.baseSpeed;
}

function checkWinner() {
    if (gameState.mode === 'classic' && playerScore >= CONFIG.WINNING_SCORE) {
        endGame('🎉 VICTORY!', `You defeated the AI ${playerScore}-${aiScore}!`);
        checkEndGameAchievements(true);
        return true;
    } else if (gameState.mode === 'classic' && aiScore >= CONFIG.WINNING_SCORE) {
        endGame('💔 DEFEAT', `AI wins ${aiScore}-${playerScore}. Try again!`);
        checkEndGameAchievements(false);
        return true;
    }
    return false;
}

function checkEndGameAchievements(playerWon) {
    if (playerWon) {
        unlockAchievement('first_win');
        if (aiScore === 0) unlockAchievement('perfect_game');
        if (document.getElementById('difficulty').value === 'impossible') unlockAchievement('impossible_beat');
    }
    if (gameState.mode === 'survival' && playerScore >= 15) unlockAchievement('survivor');
}

// ========================================
// RENDERING
// ========================================
function draw() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    if (gameState.particlesEnabled && ball.trail.length > 0) {
        for (let i = 0; i < ball.trail.length; i++) {
            const alpha = i / ball.trail.length * 0.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(ball.trail[i].x, ball.trail[i].y, ball.radius * 0.7, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    drawPaddle(playerPaddle, themes[gameState.theme].player);
    drawPaddle(aiPaddle, themes[gameState.theme].ai);
    ctx.shadowBlur = 20;
    ctx.shadowColor = themes[gameState.theme].ball;
    ctx.fillStyle = themes[gameState.theme].ball;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    gameState.particles.forEach(particle => particle.draw());
    gameState.powerUps.forEach(powerUp => powerUp.draw());
}

function drawPaddle(paddle, color) {
    const gradient = ctx.createLinearGradient(paddle.x, 0, paddle.x + paddle.width, 0);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, color + '80');
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.fillStyle = gradient;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowBlur = 0;
}

// ========================================
// GAME LOOP
// ========================================
function gameLoop() {
    if (!gameState.running || gameState.paused) return;
    updateKeyboardControl();
    updatePaddles();
    updateBall();
    gameState.particles = gameState.particles.filter(p => { p.update(); return !p.isDead(); });
    gameState.powerUps.forEach((powerUp, index) => {
        powerUp.update();
        if (powerUp.checkCollision(playerPaddle)) {
            activatePowerUp(powerUp);
            gameState.powerUps.splice(index, 1);
        }
        if (powerUp.x < 0 || powerUp.x > canvas.width) gameState.powerUps.splice(index, 1);
    });
    if (gameState.activePowerUp) {
        gameState.powerUpTimer -= 16.67;
        if (gameState.powerUpTimer <= 0) deactivatePowerUp();
    }
    gameState.elapsedTime = Date.now() - gameState.startTime;
    updateGameTime();
    if (gameState.mode === 'timeattack' && gameState.elapsedTime >= 60000) {
        endGame('⏱️ Time Up!', `Final Score: ${playerScore}`);
        if (playerScore >= 20) unlockAchievement('time_lord');
        return;
    }
    draw();
    requestAnimationFrame(gameLoop);
}

// ========================================
// UI UPDATES
// ========================================
function updateScoreboard() {
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('aiScore').textContent = aiScore;
}

function updateStats() {
    document.getElementById('hitCount').textContent = gameState.hitCount;
    document.getElementById('maxSpeed').textContent = gameState.maxSpeed.toFixed(1);
    document.getElementById('rallyCount').textContent = gameState.rallyCount;
}

function updateGameTime() {
    const seconds = Math.floor(gameState.elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('gameTime').textContent = 
        `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ========================================
// GAME CONTROLS
// ========================================
function startGame() {
    document.getElementById('gameOverlay').classList.add('hidden');
    gameState.running = true;
    gameState.paused = false;
    gameState.hitCount = 0;
    gameState.rallyCount = 0;
    gameState.startTime = Date.now();
    gameState.elapsedTime = 0;
    gameState.particles = [];
    gameState.powerUps = [];
    resetBall();
    updateStats();
    gameLoop();
}

function restartGame() {
    playerScore = 0;
    aiScore = 0;
    updateScoreboard();
    startGame();
}

function togglePause() {
    gameState.paused = !gameState.paused;
    const pauseOverlay = document.getElementById('pauseOverlay');
    if (gameState.paused) pauseOverlay.classList.remove('hidden');
    else { pauseOverlay.classList.add('hidden'); gameLoop(); }
}

function returnToMenu() {
    gameState.running = false;
    gameState.paused = false;
    document.getElementById('pauseOverlay').classList.add('hidden');
    document.getElementById('gameOverlay').classList.remove('hidden');
    document.getElementById('startButton').classList.remove('hidden');
    document.getElementById('restartButton').classList.add('hidden');
    document.getElementById('overlayTitle').textContent = 'Ultimate Pong';
    document.getElementById('overlayMessage').textContent = 'Ready to play?';
}

function endGame(title, message) {
    gameState.running = false;
    document.getElementById('overlayTitle').textContent = title;
    document.getElementById('overlayMessage').textContent = message;
    document.getElementById('startButton').classList.add('hidden');
    document.getElementById('restartButton').classList.remove('hidden');
    document.getElementById('gameOverlay').classList.remove('hidden');
    saveToLeaderboard();
}

// ========================================
// ACHIEVEMENTS & LEADERBOARD
// ========================================
function unlockAchievement(id) {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
        saveAchievements();
    }
}

function saveAchievements() {
    localStorage.setItem('pong_achievements', JSON.stringify(achievements));
}

function loadAchievements() {
    const saved = localStorage.getItem('pong_achievements');
    if (saved) {
        const loaded = JSON.parse(saved);
        loaded.forEach(saved => {
            const achievement = achievements.find(a => a.id === saved.id);
            if (achievement) achievement.unlocked = saved.unlocked;
        });
    }
}

function renderAchievements() {
    const list = document.getElementById('achievementsList');
    list.innerHTML = achievements.map(ach => `
        <div class="setting-item ${ach.unlocked ? 'bg-green-900/20' : 'bg-gray-800/50'}">
            <div class="flex items-center gap-3">
                <span class="text-3xl">${ach.icon}</span>
                <div class="flex-1">
                    <h4 class="font-bold text-white">${ach.name}</h4>
                    <p class="text-sm text-gray-400">${ach.desc}</p>
                </div>
                ${ach.unlocked ? '<span class="text-green-400">✓</span>' : '<span class="text-gray-600">🔒</span>'}
            </div>
        </div>
    `).join('');
}

function saveToLeaderboard() {
    const entry = { score: playerScore, mode: gameState.mode, difficulty: document.getElementById('difficulty').value, date: new Date().toISOString() };
    let leaderboard = JSON.parse(localStorage.getItem('pong_leaderboard') || '[]');
    leaderboard.push(entry);
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem('pong_leaderboard', JSON.stringify(leaderboard));
}

function renderLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('pong_leaderboard') || '[]');
    const list = document.getElementById('leaderboardList');
    if (leaderboard.length === 0) {
        list.innerHTML = '<p class="text-center text-gray-400">No scores yet. Be the first!</p>';
        return;
    }
    list.innerHTML = leaderboard.map((entry, index) => `
        <div class="setting-item flex items-center justify-between">
            <div class="flex items-center gap-3">
                <span class="text-2xl font-bold ${index < 3 ? 'text-yellow-400' : 'text-gray-400'}">#${index + 1}</span>
                <div>
                    <p class="font-bold text-white">Score: ${entry.score}</p>
                    <p class="text-xs text-gray-400">${entry.mode} • ${entry.difficulty}</p>
                </div>
            </div>
            <span class="text-xs text-gray-500">${new Date(entry.date).toLocaleDateString()}</span>
        </div>
    `).join('');
}

// ========================================
// EVENT LISTENERS
// ========================================
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);
document.getElementById('resumeButton').addEventListener('click', togglePause);
document.getElementById('difficulty').addEventListener('change', (e) => {
    currentDifficulty = difficulties[e.target.value];
    aiPaddle.speed = currentDifficulty.speed;
});
document.getElementById('controlMode').addEventListener('change', (e) => {
    gameState.controlMode = e.target.value;
});
document.querySelectorAll('.game-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.game-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameState.mode = btn.dataset.mode;
    });
});
document.getElementById('settingsBtn').addEventListener('click', () => {
    document.getElementById('settingsModal').classList.remove('hidden');
});
document.getElementById('soundToggle').addEventListener('click', () => {
    gameState.soundEnabled = !gameState.soundEnabled;
    document.getElementById('soundOnIcon').classList.toggle('hidden');
    document.getElementById('soundOffIcon').classList.toggle('hidden');
});
document.getElementById('soundEffectsToggle').addEventListener('change', (e) => {
    gameState.soundEnabled = e.target.checked;
});
document.getElementById('particlesToggle').addEventListener('change', (e) => {
    gameState.particlesEnabled = e.target.checked;
});
document.getElementById('themeSelect').addEventListener('change', (e) => {
    gameState.theme = e.target.value;
});
document.getElementById('achievementsBtn').addEventListener('click', () => {
    renderAchievements();
    document.getElementById('achievementsModal').classList.remove('hidden');
});
document.getElementById('leaderboardBtn').addEventListener('click', () => {
    renderLeaderboard();
    document.getElementById('leaderboardModal').classList.remove('hidden');
});
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById(btn.dataset.modal).classList.add('hidden');
    });
});
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });
});

// ========================================
// INITIALIZATION
// ========================================
function init() {
    loadAchievements();
    updateScoreboard();
    updateStats();
    updatePowerUpDisplay();
    draw();
    document.getElementById('overlayTitle').textContent = 'ULTIMATE PONG';
    document.getElementById('overlayMessage').textContent = 'Choose your difficulty and click Start!';
}

init();
console.log('🎮 Ultimate Pong Loaded Successfully!');
