// ========================================// ========================================// Canvas setup

// 🎮 ULTIMATE PONG - ENHANCED GAME

// ========================================// 🎮 ULTIMATE PONG - ENHANCED GAME ENGINEconst canvas = document.getElementById('pongCanvas');



const canvas = document.getElementById('pongCanvas');// ========================================const ctx = canvas.getContext('2d');

const ctx = canvas.getContext('2d');



// Game Configuration

const CONFIG = {// Canvas and Context// Game elements

    PADDLE_WIDTH: 12,

    PADDLE_HEIGHT: 100,const canvas = document.getElementById('pongCanvas');const paddleWidth = 10;

    BALL_RADIUS: 8,

    WINNING_SCORE: 7,const ctx = canvas.getContext('2d');const paddleHeight = 80;

    POWER_UP_SIZE: 25

};const ballSize = 10;



// Game State// Game Constantsconst winningScore = 7;

let gameState = {

    running: false,const PADDLE_WIDTH = 12;

    paused: false,

    mode: 'classic',const PADDLE_HEIGHT = 100;// Game state

    hitCount: 0,

    rallyCount: 0,const BALL_RADIUS = 8;let gameState = {

    maxSpeed: 5,

    startTime: null,const WINNING_SCORE = 7;    running: false,

    elapsedTime: 0,

    particles: [],const POWER_UP_SIZE = 25;    paused: false,

    powerUps: [],

    activePowerUp: null,    winner: null

    powerUpTimer: 0,

    controlMode: 'mouse',// Game State Management};

    soundEnabled: true,

    particlesEnabled: true,const gameState = {

    theme: 'neon'

};    running: false,// Player paddle (left)



// Themes    paused: false,const playerPaddle = {

const themes = {

    neon: { player: '#06b6d4', ai: '#ec4899', ball: '#ffffff', particles: '#a855f7' },    mode: 'classic', // classic, survival, timeattack    x: 20,

    classic: { player: '#ffffff', ai: '#ffffff', ball: '#ffffff', particles: '#888888' },

    sunset: { player: '#f59e0b', ai: '#ef4444', ball: '#fbbf24', particles: '#fb923c' },    winner: null,    y: canvas.height / 2 - paddleHeight / 2,

    ocean: { player: '#0ea5e9', ai: '#06b6d4', ball: '#67e8f9', particles: '#0284c7' }

};    hitCount: 0,    width: paddleWidth,



// Player Paddle    rallyCount: 0,    height: paddleHeight,

let playerPaddle = {

    x: 30,    maxSpeed: 5,    speed: 8,

    y: canvas.height / 2 - CONFIG.PADDLE_HEIGHT / 2,

    width: CONFIG.PADDLE_WIDTH,    startTime: null,    dy: 0

    height: CONFIG.PADDLE_HEIGHT,

    speed: 10,    elapsedTime: 0,};

    targetY: canvas.height / 2

};    particles: [],



// AI Paddle    powerUps: [],// AI paddle (right)

let aiPaddle = {

    x: canvas.width - 30 - CONFIG.PADDLE_WIDTH,    activePowerUp: null,const aiPaddle = {

    y: canvas.height / 2 - CONFIG.PADDLE_HEIGHT / 2,

    width: CONFIG.PADDLE_WIDTH,    powerUpTimer: 0,    x: canvas.width - 20 - paddleWidth,

    height: CONFIG.PADDLE_HEIGHT,

    speed: 5    controlMode: 'mouse', // mouse, keyboard, touch    y: canvas.height / 2 - paddleHeight / 2,

};

    soundEnabled: true,    width: paddleWidth,

// Ball

let ball = {    particlesEnabled: true,    height: paddleHeight,

    x: canvas.width / 2,

    y: canvas.height / 2,    screenShakeEnabled: true,    speed: 4

    radius: CONFIG.BALL_RADIUS,

    speedX: 6,    theme: 'neon'};

    speedY: 4,

    baseSpeed: 6,};

    maxSpeed: 15,

    trail: []// Ball

};

// Themes Configurationconst ball = {

// Scores

let playerScore = 0;const themes = {    x: canvas.width / 2,

let aiScore = 0;

    neon: {    y: canvas.height / 2,

// Difficulties

const difficulties = {        player: '#06b6d4',    radius: ballSize / 2,

    easy: { speed: 3.5, reactionDelay: 0.5, errorMargin: 50 },

    medium: { speed: 5, reactionDelay: 0.7, errorMargin: 30 },        ai: '#ec4899',    speedX: 5,

    hard: { speed: 7, reactionDelay: 0.85, errorMargin: 15 },

    impossible: { speed: 9, reactionDelay: 0.98, errorMargin: 2 }        ball: '#ffffff',    speedY: 5,

};

        particles: '#a855f7',    baseSpeed: 5,

let currentDifficulty = difficulties.medium;

        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)'    maxSpeed: 12

// Achievements

let achievements = [    },};

    { id: 'first_win', name: 'First Victory', desc: 'Win your first game', icon: '🏆', unlocked: false },

    { id: 'perfect_game', name: 'Perfect Game', desc: 'Win without losing a point', icon: '💯', unlocked: false },    classic: {

    { id: 'speed_demon', name: 'Speed Demon', desc: 'Hit ball at max speed', icon: '⚡', unlocked: false },

    { id: 'rally_master', name: 'Rally Master', desc: 'Achieve 20 hit rally', icon: '🎯', unlocked: false },        player: '#ffffff',// Scores

    { id: 'impossible_beat', name: 'Impossible!', desc: 'Beat AI on Impossible', icon: '😱', unlocked: false },

    { id: 'survivor', name: 'Survivor', desc: 'Score 15 in Survival mode', icon: '🛡️', unlocked: false },        ai: '#ffffff',let playerScore = 0;

    { id: 'time_lord', name: 'Time Lord', desc: 'Score 20 in Time Attack', icon: '⏱️', unlocked: false }

];        ball: '#ffffff',let aiScore = 0;



// Power-up Types        particles: '#888888',

const powerUpTypes = [

    { type: 'speedBoost', name: 'Speed Boost', icon: '⚡', color: '#fbbf24', duration: 5000 },        background: '#000000'// Difficulty settings

    { type: 'paddleGrow', name: 'Paddle Grow', icon: '📏', color: '#06b6d4', duration: 7000 },

    { type: 'slowMotion', name: 'Slow Motion', icon: '🐌', color: '#a855f7', duration: 6000 }    },const difficulties = {

];

    sunset: {    easy: { speed: 3, reactionDelay: 0.6, errorMargin: 40 },

// Particle System

class Particle {        player: '#f59e0b',    medium: { speed: 4.5, reactionDelay: 0.75, errorMargin: 25 },

    constructor(x, y, color) {

        this.x = x;        ai: '#ef4444',    hard: { speed: 6, reactionDelay: 0.85, errorMargin: 10 },

        this.y = y;

        this.vx = (Math.random() - 0.5) * 4;        ball: '#fbbf24',    impossible: { speed: 8, reactionDelay: 0.95, errorMargin: 0 }

        this.vy = (Math.random() - 0.5) * 4;

        this.radius = Math.random() * 3 + 1;        particles: '#fb923c',};

        this.color = color;

        this.life = 1;        background: 'linear-gradient(135deg, #7c2d12 0%, #1e1b4b 100%)'

        this.decay = Math.random() * 0.02 + 0.01;

    }    },let currentDifficulty = difficulties.medium;



    update() {    ocean: {

        this.x += this.vx;

        this.y += this.vy;        player: '#0ea5e9',// Event listeners

        this.life -= this.decay;

        this.radius *= 0.98;        ai: '#06b6d4',document.getElementById('startButton').addEventListener('click', startGame);

    }

        ball: '#67e8f9',document.getElementById('restartButton').addEventListener('click', restartGame);

    draw() {

        ctx.save();        particles: '#0284c7',document.getElementById('difficulty').addEventListener('change', changeDifficulty);

        ctx.globalAlpha = this.life;

        ctx.fillStyle = this.color;        background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 100%)'

        ctx.beginPath();

        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);    }canvas.addEventListener('mousemove', (e) => {

        ctx.fill();

        ctx.restore();};    if (gameState.running) {

    }

        const rect = canvas.getBoundingClientRect();

    isDead() {

        return this.life <= 0;// Player Paddle        const scaleY = canvas.height / rect.height;

    }

}const playerPaddle = {        playerPaddle.y = (e.clientY - rect.top) * scaleY - playerPaddle.height / 2;



function createParticles(x, y, count, color) {    x: 30,        

    if (!gameState.particlesEnabled) return;

    for (let i = 0; i < count; i++) {    y: canvas.height / 2 - PADDLE_HEIGHT / 2,        // Keep paddle within bounds

        gameState.particles.push(new Particle(x, y, color));

    }    width: PADDLE_WIDTH,        if (playerPaddle.y < 0) playerPaddle.y = 0;

}

    height: PADDLE_HEIGHT,        if (playerPaddle.y + playerPaddle.height > canvas.height) {

// Power-Up Class

class PowerUp {    speed: 10,            playerPaddle.y = canvas.height - playerPaddle.height;

    constructor(x, y) {

        const typeData = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];    dy: 0,        }

        this.x = x;

        this.y = y;    targetY: canvas.height / 2    }

        this.size = CONFIG.POWER_UP_SIZE;

        this.type = typeData.type;};});

        this.icon = typeData.icon;

        this.color = typeData.color;

        this.duration = typeData.duration;

        this.rotation = 0;// AI Paddlefunction changeDifficulty(e) {

        this.pulse = 0;

    }const aiPaddle = {    const difficulty = e.target.value;



    update() {    x: canvas.width - 30 - PADDLE_WIDTH,    currentDifficulty = difficulties[difficulty];

        this.rotation += 0.05;

        this.pulse = Math.sin(Date.now() * 0.005) * 3;    y: canvas.height / 2 - PADDLE_HEIGHT / 2,    aiPaddle.speed = currentDifficulty.speed;

    }

    width: PADDLE_WIDTH,}

    draw() {

        ctx.save();    height: PADDLE_HEIGHT,

        ctx.translate(this.x, this.y);

        ctx.rotate(this.rotation);    speed: 5function startGame() {

        

        ctx.shadowBlur = 20;};    document.getElementById('gameOverlay').classList.add('hidden');

        ctx.shadowColor = this.color;

        ctx.fillStyle = this.color;    gameState.running = true;

        ctx.globalAlpha = 0.3;

        ctx.beginPath();// Ball    gameState.winner = null;

        ctx.arc(0, 0, this.size / 2 + this.pulse, 0, Math.PI * 2);

        ctx.fill();const ball = {    resetBall();

        

        ctx.globalAlpha = 1;    x: canvas.width / 2,    gameLoop();

        ctx.restore();

            y: canvas.height / 2,}

        ctx.font = `${this.size}px Arial`;

        ctx.textAlign = 'center';    radius: BALL_RADIUS,

        ctx.textBaseline = 'middle';

        ctx.fillText(this.icon, this.x, this.y);    speedX: 6,function restartGame() {

        ctx.shadowBlur = 0;

    }    speedY: 4,    playerScore = 0;



    checkCollision(paddle) {    baseSpeed: 6,    aiScore = 0;

        return (

            this.x < paddle.x + paddle.width &&    maxSpeed: 15,    updateScoreboard();

            this.x + this.size > paddle.x &&

            this.y < paddle.y + paddle.height &&    trail: []    startGame();

            this.y + this.size > paddle.y

        );};}

    }

}



function spawnPowerUp() {// Scoresfunction resetBall() {

    if (gameState.mode === 'classic' && Math.random() < 0.3) {

        const x = canvas.width / 2;let playerScore = 0;    ball.x = canvas.width / 2;

        const y = Math.random() * (canvas.height - CONFIG.POWER_UP_SIZE * 2) + CONFIG.POWER_UP_SIZE;

        gameState.powerUps.push(new PowerUp(x, y));let aiScore = 0;    ball.y = canvas.height / 2;

    }

}    



function activatePowerUp(powerUp) {// Difficulty Settings    // Random direction

    gameState.activePowerUp = powerUp;

    gameState.powerUpTimer = powerUp.duration;const difficulties = {    const angle = (Math.random() * Math.PI / 2) - Math.PI / 4; // -45 to 45 degrees

    

    switch (powerUp.type) {    easy: { speed: 3.5, reactionDelay: 0.5, errorMargin: 50 },    const direction = Math.random() > 0.5 ? 1 : -1;

        case 'speedBoost':

            playerPaddle.speed = 15;    medium: { speed: 5, reactionDelay: 0.7, errorMargin: 30 },    

            break;

        case 'paddleGrow':    hard: { speed: 7, reactionDelay: 0.85, errorMargin: 15 },    ball.speedX = Math.cos(angle) * ball.baseSpeed * direction;

            playerPaddle.height = CONFIG.PADDLE_HEIGHT * 1.5;

            break;    impossible: { speed: 9, reactionDelay: 0.98, errorMargin: 2 }    ball.speedY = Math.sin(angle) * ball.baseSpeed;

        case 'slowMotion':

            ball.speedX *= 0.5;};}

            ball.speedY *= 0.5;

            break;

    }

    let currentDifficulty = difficulties.medium;function updateScoreboard() {

    updatePowerUpDisplay();

    playSound('powerup');    document.getElementById('playerScore').textContent = playerScore;

}

// Achievements System    document.getElementById('aiScore').textContent = aiScore;

function deactivatePowerUp() {

    if (!gameState.activePowerUp) return;const achievements = [}

    

    switch (gameState.activePowerUp.type) {    { id: 'first_win', name: 'First Victory', desc: 'Win your first game', icon: '🏆', unlocked: false },

        case 'speedBoost':

            playerPaddle.speed = 10;    { id: 'perfect_game', name: 'Perfect Game', desc: 'Win without losing a point', icon: '💯', unlocked: false },function checkWinner() {

            break;

        case 'paddleGrow':    { id: 'comeback', name: 'Comeback King', desc: 'Win after being down 5-0', icon: '👑', unlocked: false },    if (playerScore >= winningScore) {

            playerPaddle.height = CONFIG.PADDLE_HEIGHT;

            break;    { id: 'speed_demon', name: 'Speed Demon', desc: 'Hit ball at max speed', icon: '⚡', unlocked: false },        gameState.winner = 'player';

        case 'slowMotion':

            ball.speedX *= 2;    { id: 'rally_master', name: 'Rally Master', desc: 'Achieve 20 hit rally', icon: '🎯', unlocked: false },        endGame('🎉 You Win!', 'Congratulations! You defeated the AI!');

            ball.speedY *= 2;

            break;    { id: 'impossible_beat', name: 'Impossible!', desc: 'Beat AI on Impossible', icon: '😱', unlocked: false },        return true;

    }

        { id: 'survivor', name: 'Survivor', desc: 'Score 15 in Survival mode', icon: '🛡️', unlocked: false },    } else if (aiScore >= winningScore) {

    gameState.activePowerUp = null;

    gameState.powerUpTimer = 0;    { id: 'time_lord', name: 'Time Lord', desc: 'Score 20 in Time Attack', icon: '⏱️', unlocked: false }        gameState.winner = 'ai';

    updatePowerUpDisplay();

}];        endGame('😢 AI Wins!', 'Better luck next time! Try again?');



function updatePowerUpDisplay() {        return true;

    const display = document.getElementById('powerUpDisplay');

    if (gameState.activePowerUp) {// Power-ups Types    }

        const timeLeft = Math.ceil(gameState.powerUpTimer / 1000);

        const powerUpData = powerUpTypes.find(p => p.type === gameState.activePowerUp.type);const powerUpTypes = [    return false;

        display.innerHTML = `

            <div class="text-4xl mb-2">${gameState.activePowerUp.icon}</div>    { type: 'speedBoost', name: 'Speed Boost', icon: '⚡', color: '#fbbf24', duration: 5000 },}

            <div class="text-sm font-bold text-white">${powerUpData.name}</div>

            <div class="text-xs text-gray-400">${timeLeft}s</div>    { type: 'paddleGrow', name: 'Paddle Grow', icon: '📏', color: '#06b6d4', duration: 7000 },

        `;

    } else {    { type: 'slowMotion', name: 'Slow Motion', icon: '🐌', color: '#a855f7', duration: 6000 },function endGame(title, message) {

        display.innerHTML = `

            <div class="text-3xl mb-2">💫</div>    { type: 'multiball', name: 'Multi Ball', icon: '⚽', color: '#ec4899', duration: 8000 }    gameState.running = false;

            <div class="text-xs text-gray-400">None Active</div>

        `;];    document.getElementById('overlayTitle').textContent = title;

    }

}    document.getElementById('overlayMessage').textContent = message;



// Sound Effects// ========================================    document.getElementById('startButton').classList.add('hidden');

function playSound(type) {

    if (!gameState.soundEnabled) return;// 🎨 PARTICLE SYSTEM    document.getElementById('restartButton').classList.remove('hidden');

    

    try {// ========================================    document.getElementById('gameOverlay').classList.remove('hidden');

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        const oscillator = audioContext.createOscillator();}

        const gainNode = audioContext.createGain();

        class Particle {

        oscillator.connect(gainNode);

        gainNode.connect(audioContext.destination);    constructor(x, y, color) {function drawRect(x, y, width, height, color) {

        

        switch (type) {        this.x = x;    ctx.fillStyle = color;

            case 'hit':

                oscillator.frequency.value = 200;        this.y = y;    ctx.fillRect(x, y, width, height);

                gainNode.gain.value = 0.1;

                oscillator.start();        this.vx = (Math.random() - 0.5) * 4;}

                oscillator.stop(audioContext.currentTime + 0.1);

                break;        this.vy = (Math.random() - 0.5) * 4;

            case 'score':

                oscillator.frequency.value = 440;        this.radius = Math.random() * 3 + 1;function drawCircle(x, y, radius, color) {

                gainNode.gain.value = 0.2;

                oscillator.start();        this.color = color;    ctx.fillStyle = color;

                oscillator.stop(audioContext.currentTime + 0.2);

                break;        this.life = 1;    ctx.beginPath();

            case 'powerup':

                oscillator.frequency.value = 880;        this.decay = Math.random() * 0.02 + 0.01;    ctx.arc(x, y, radius, 0, Math.PI * 2);

                gainNode.gain.value = 0.15;

                oscillator.start();    }    ctx.fill();

                oscillator.stop(audioContext.currentTime + 0.15);

                break;}

        }

    } catch (e) {    update() {

        console.log('Audio not supported');

    }        this.x += this.vx;function drawNet() {

}

        this.y += this.vy;    const netWidth = 2;

// Controls

canvas.addEventListener('mousemove', (e) => {        this.life -= this.decay;    const netHeight = 10;

    if (gameState.running && !gameState.paused && gameState.controlMode === 'mouse') {

        const rect = canvas.getBoundingClientRect();        this.radius *= 0.98;    const gap = 15;

        const scaleY = canvas.height / rect.height;

        playerPaddle.targetY = (e.clientY - rect.top) * scaleY;    }    

    }

});    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';



canvas.addEventListener('touchmove', (e) => {    draw() {    for (let i = 0; i < canvas.height; i += netHeight + gap) {

    e.preventDefault();

    if (gameState.running && !gameState.paused && gameState.controlMode === 'touch') {        ctx.save();        ctx.fillRect(canvas.width / 2 - netWidth / 2, i, netWidth, netHeight);

        const rect = canvas.getBoundingClientRect();

        const scaleY = canvas.height / rect.height;        ctx.globalAlpha = this.life;    }

        const touch = e.touches[0];

        playerPaddle.targetY = (touch.clientY - rect.top) * scaleY;        ctx.fillStyle = this.color;}

    }

}, { passive: false });        ctx.beginPath();



const keys = {};        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);function draw() {

document.addEventListener('keydown', (e) => {

    keys[e.key] = true;        ctx.fill();    // Clear canvas

    

    if (e.key === ' ' && gameState.running) {        ctx.restore();    drawRect(0, 0, canvas.width, canvas.height, '#1a1a2e');

        e.preventDefault();

        togglePause();    }    

    }

        // Draw net

    if (e.key === 'Escape' && gameState.running) {

        returnToMenu();    isDead() {    drawNet();

    }

});        return this.life <= 0;    



document.addEventListener('keyup', (e) => {    }    // Draw paddles with gradient

    keys[e.key] = false;

});}    const playerGradient = ctx.createLinearGradient(



function updateKeyboardControl() {        playerPaddle.x, 0, playerPaddle.x + playerPaddle.width, 0

    if (gameState.controlMode !== 'keyboard') return;

    function createParticles(x, y, count, color) {    );

    if (keys['w'] || keys['W'] || keys['ArrowUp']) {

        playerPaddle.targetY -= playerPaddle.speed;    if (!gameState.particlesEnabled) return;    playerGradient.addColorStop(0, '#00ff88');

    }

    if (keys['s'] || keys['S'] || keys['ArrowDown']) {    for (let i = 0; i < count; i++) {    playerGradient.addColorStop(1, '#00cc6a');

        playerPaddle.targetY += playerPaddle.speed;

    }        gameState.particles.push(new Particle(x, y, color));    ctx.fillStyle = playerGradient;

}

    }    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);

// Game Logic

function updatePaddles() {}    

    const smoothing = 0.3;

    playerPaddle.y += (playerPaddle.targetY - playerPaddle.y - playerPaddle.height / 2) * smoothing;    const aiGradient = ctx.createLinearGradient(

    playerPaddle.y = Math.max(0, Math.min(canvas.height - playerPaddle.height, playerPaddle.y));

    // ========================================        aiPaddle.x, 0, aiPaddle.x + aiPaddle.width, 0

    updateAI();

}// 🎯 POWER-UP SYSTEM    );



function updateAI() {// ========================================    aiGradient.addColorStop(0, '#ff0066');

    const targetY = ball.y + (Math.random() - 0.5) * currentDifficulty.errorMargin;

    const paddleCenter = aiPaddle.y + aiPaddle.height / 2;    aiGradient.addColorStop(1, '#cc0052');

    

    if (ball.speedX > 0 && Math.random() < currentDifficulty.reactionDelay) {class PowerUp {    ctx.fillStyle = aiGradient;

        if (paddleCenter < targetY - 15) {

            aiPaddle.y += aiPaddle.speed;    constructor(x, y) {    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

        } else if (paddleCenter > targetY + 15) {

            aiPaddle.y -= aiPaddle.speed;        const typeData = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];    

        }

    }        this.x = x;    // Draw ball with glow effect

    

    aiPaddle.y = Math.max(0, Math.min(canvas.height - aiPaddle.height, aiPaddle.y));        this.y = y;    ctx.shadowBlur = 15;

}

        this.size = POWER_UP_SIZE;    ctx.shadowColor = '#ffffff';

function updateBall() {

    ball.x += ball.speedX;        this.type = typeData.type;    drawCircle(ball.x, ball.y, ball.radius, '#ffffff');

    ball.y += ball.speedY;

            this.icon = typeData.icon;    ctx.shadowBlur = 0;

    if (gameState.particlesEnabled) {

        ball.trail.push({ x: ball.x, y: ball.y });        this.color = typeData.color;}

        if (ball.trail.length > 15) ball.trail.shift();

    }        this.duration = typeData.duration;

    

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {        this.rotation = 0;function updateAI() {

        ball.speedY = -ball.speedY;

        createParticles(ball.x, ball.y, 10, themes[gameState.theme].particles);        this.pulse = 0;    // AI prediction with difficulty-based reaction

        playSound('hit');

    }    }    const targetY = ball.y + (Math.random() - 0.5) * currentDifficulty.errorMargin;

    

    if (checkPaddleCollision(ball, playerPaddle)) {    const paddleCenter = aiPaddle.y + aiPaddle.height / 2;

        handlePaddleHit(playerPaddle, 1);

    }    update() {    

    

    if (checkPaddleCollision(ball, aiPaddle)) {        this.rotation += 0.05;    // Only react if ball is moving towards AI and within reaction threshold

        handlePaddleHit(aiPaddle, -1);

    }        this.pulse = Math.sin(Date.now() * 0.005) * 3;    if (ball.speedX > 0 && Math.random() < currentDifficulty.reactionDelay) {

    

    if (ball.x - ball.radius < 0) {    }        if (paddleCenter < targetY - 10) {

        handleScore('ai');

    } else if (ball.x + ball.radius > canvas.width) {            aiPaddle.y += aiPaddle.speed;

        handleScore('player');

    }    draw() {        } else if (paddleCenter > targetY + 10) {

}

        ctx.save();            aiPaddle.y -= aiPaddle.speed;

function checkPaddleCollision(ball, paddle) {

    return (        ctx.translate(this.x, this.y);        }

        ball.x - ball.radius < paddle.x + paddle.width &&

        ball.x + ball.radius > paddle.x &&        ctx.rotate(this.rotation);    }

        ball.y > paddle.y &&

        ball.y < paddle.y + paddle.height            

    );

}        // Glow effect    // Keep AI paddle within bounds



function handlePaddleHit(paddle, direction) {        ctx.shadowBlur = 20;    if (aiPaddle.y < 0) aiPaddle.y = 0;

    const hitPos = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);

    const angle = hitPos * Math.PI / 3;        ctx.shadowColor = this.color;    if (aiPaddle.y + aiPaddle.height > canvas.height) {

    

    const currentSpeed = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);                aiPaddle.y = canvas.height - aiPaddle.height;

    const newSpeed = Math.min(currentSpeed + 0.3, ball.maxSpeed);

            // Background circle    }

    ball.speedX = Math.cos(angle) * newSpeed * direction;

    ball.speedY = Math.sin(angle) * newSpeed;        ctx.fillStyle = this.color;}

    

    ball.x = direction > 0 ? paddle.x + paddle.width + ball.radius : paddle.x - ball.radius;        ctx.globalAlpha = 0.3;

    

    gameState.hitCount++;        ctx.beginPath();function updateBall() {

    gameState.rallyCount++;

    gameState.maxSpeed = Math.max(gameState.maxSpeed, newSpeed);        ctx.arc(0, 0, this.size / 2 + this.pulse, 0, Math.PI * 2);    ball.x += ball.speedX;

    

    updateStats();        ctx.fill();    ball.y += ball.speedY;

    createParticles(ball.x, ball.y, 15, themes[gameState.theme].particles);

    playSound('hit');            

    

    if (gameState.hitCount % 10 === 0) {        ctx.globalAlpha = 1;    // Wall collision (top and bottom)

        spawnPowerUp();

    }        ctx.restore();    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {

    

    if (gameState.rallyCount >= 20) {                ball.speedY = -ball.speedY;

        unlockAchievement('rally_master');

    }        // Icon    }

    if (newSpeed >= ball.maxSpeed - 0.1) {

        unlockAchievement('speed_demon');        ctx.font = `${this.size}px Arial`;    

    }

}        ctx.textAlign = 'center';    // Paddle collision detection



function handleScore(scorer) {        ctx.textBaseline = 'middle';    // Player paddle

    if (scorer === 'player') {

        playerScore++;        ctx.fillText(this.icon, this.x, this.y);    if (ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&

    } else {

        aiScore++;        ctx.shadowBlur = 0;        ball.x + ball.radius > playerPaddle.x &&

        gameState.rallyCount = 0;

    }    }        ball.y > playerPaddle.y &&

    

    updateScoreboard();        ball.y < playerPaddle.y + playerPaddle.height) {

    playSound('score');

    createParticles(ball.x, ball.y, 30, scorer === 'player' ? '#06b6d4' : '#ec4899');    checkCollision(paddle) {        

    

    if (gameState.mode === 'survival' && scorer === 'ai') {        return (        // Calculate hit position (-1 to 1)

        endGame('💀 Game Over!', `You survived ${playerScore} rounds!`);

        return;            this.x < paddle.x + paddle.width &&        const hitPos = (ball.y - (playerPaddle.y + playerPaddle.height / 2)) / (playerPaddle.height / 2);

    }

                this.x + this.size > paddle.x &&        

    if (!checkWinner()) {

        resetBall();            this.y < paddle.y + paddle.height &&        // Change angle based on where it hit the paddle

    }

}            this.y + this.size > paddle.y        const angle = hitPos * Math.PI / 4; // Max 45 degrees



function resetBall() {        );        

    ball.x = canvas.width / 2;

    ball.y = canvas.height / 2;    }        const speed = Math.min(

    ball.trail = [];

    }            Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY) + 0.5,

    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6;

    const direction = Math.random() > 0.5 ? 1 : -1;            ball.maxSpeed

    

    ball.speedX = Math.cos(angle) * ball.baseSpeed * direction;function spawnPowerUp() {        );

    ball.speedY = Math.sin(angle) * ball.baseSpeed;

}    if (gameState.mode === 'classic' && Math.random() < 0.3) {        



function checkWinner() {        const x = canvas.width / 2;        ball.speedX = Math.cos(angle) * speed;

    if (gameState.mode === 'classic' && playerScore >= CONFIG.WINNING_SCORE) {

        endGame('🎉 VICTORY!', `You defeated the AI ${playerScore}-${aiScore}!`);        const y = Math.random() * (canvas.height - POWER_UP_SIZE * 2) + POWER_UP_SIZE;        ball.speedY = Math.sin(angle) * speed;

        checkEndGameAchievements(true);

        return true;        gameState.powerUps.push(new PowerUp(x, y));        

    } else if (gameState.mode === 'classic' && aiScore >= CONFIG.WINNING_SCORE) {

        endGame('💔 DEFEAT', `AI wins ${aiScore}-${playerScore}. Try again!`);    }        // Ensure ball moves right

        checkEndGameAchievements(false);

        return true;}        ball.speedX = Math.abs(ball.speedX);

    }

    return false;        ball.x = playerPaddle.x + playerPaddle.width + ball.radius;

}

function activatePowerUp(powerUp) {    }

function checkEndGameAchievements(playerWon) {

    if (playerWon) {    gameState.activePowerUp = powerUp;    

        unlockAchievement('first_win');

        if (aiScore === 0) {    gameState.powerUpTimer = powerUp.duration;    // AI paddle

            unlockAchievement('perfect_game');

        }        if (ball.x + ball.radius > aiPaddle.x &&

        if (document.getElementById('difficulty').value === 'impossible') {

            unlockAchievement('impossible_beat');    switch (powerUp.type) {        ball.x - ball.radius < aiPaddle.x + aiPaddle.width &&

        }

    }        case 'speedBoost':        ball.y > aiPaddle.y &&

    

    if (gameState.mode === 'survival' && playerScore >= 15) {            playerPaddle.speed = 15;        ball.y < aiPaddle.y + aiPaddle.height) {

        unlockAchievement('survivor');

    }            break;        

}

        case 'paddleGrow':        const hitPos = (ball.y - (aiPaddle.y + aiPaddle.height / 2)) / (aiPaddle.height / 2);

// Rendering

function draw() {            playerPaddle.height = PADDLE_HEIGHT * 1.5;        const angle = hitPos * Math.PI / 4;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

    gradient.addColorStop(0, '#0f172a');            break;        

    gradient.addColorStop(1, '#1e1b4b');

    ctx.fillStyle = gradient;        case 'slowMotion':        const speed = Math.min(

    ctx.fillRect(0, 0, canvas.width, canvas.height);

                ball.speedX *= 0.5;            Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY) + 0.5,

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';

    ctx.lineWidth = 2;            ball.speedY *= 0.5;            ball.maxSpeed

    ctx.setLineDash([10, 10]);

    ctx.beginPath();            break;        );

    ctx.moveTo(canvas.width / 2, 0);

    ctx.lineTo(canvas.width / 2, canvas.height);    }        

    ctx.stroke();

    ctx.setLineDash([]);            ball.speedX = Math.cos(angle) * speed;

    

    if (gameState.particlesEnabled && ball.trail.length > 0) {    updatePowerUpDisplay();        ball.speedY = Math.sin(angle) * speed;

        for (let i = 0; i < ball.trail.length; i++) {

            const alpha = i / ball.trail.length * 0.5;    playSound('powerup');        

            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

            ctx.beginPath();}        // Ensure ball moves left

            ctx.arc(ball.trail[i].x, ball.trail[i].y, ball.radius * 0.7, 0, Math.PI * 2);

            ctx.fill();        ball.speedX = -Math.abs(ball.speedX);

        }

    }function deactivatePowerUp() {        ball.x = aiPaddle.x - ball.radius;

    

    drawPaddle(playerPaddle, themes[gameState.theme].player);    if (!gameState.activePowerUp) return;    }

    drawPaddle(aiPaddle, themes[gameState.theme].ai);

            

    ctx.shadowBlur = 20;

    ctx.shadowColor = themes[gameState.theme].ball;    switch (gameState.activePowerUp.type) {    // Scoring

    ctx.fillStyle = themes[gameState.theme].ball;

    ctx.beginPath();        case 'speedBoost':    if (ball.x - ball.radius < 0) {

    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

    ctx.fill();            playerPaddle.speed = 10;        aiScore++;

    ctx.shadowBlur = 0;

                break;        updateScoreboard();

    gameState.particles.forEach(particle => particle.draw());

    gameState.powerUps.forEach(powerUp => powerUp.draw());        case 'paddleGrow':        if (!checkWinner()) {

}

            playerPaddle.height = PADDLE_HEIGHT;            resetBall();

function drawPaddle(paddle, color) {

    const gradient = ctx.createLinearGradient(paddle.x, 0, paddle.x + paddle.width, 0);            break;        }

    gradient.addColorStop(0, color);

    gradient.addColorStop(1, color + '80');        case 'slowMotion':    } else if (ball.x + ball.radius > canvas.width) {

    

    ctx.shadowBlur = 15;            ball.speedX *= 2;        playerScore++;

    ctx.shadowColor = color;

    ctx.fillStyle = gradient;            ball.speedY *= 2;        updateScoreboard();

    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.shadowBlur = 0;            break;        if (!checkWinner()) {

}

    }            resetBall();

// Game Loop

function gameLoop() {            }

    if (!gameState.running || gameState.paused) return;

        gameState.activePowerUp = null;    }

    updateKeyboardControl();

    updatePaddles();    gameState.powerUpTimer = 0;}

    updateBall();

        updatePowerUpDisplay();

    gameState.particles = gameState.particles.filter(p => {

        p.update();}function gameLoop() {

        return !p.isDead();

    });    if (!gameState.running) return;

    

    gameState.powerUps.forEach((powerUp, index) => {function updatePowerUpDisplay() {    

        powerUp.update();

            const display = document.getElementById('powerUpDisplay');    updateAI();

        if (powerUp.checkCollision(playerPaddle)) {

            activatePowerUp(powerUp);    if (gameState.activePowerUp) {    updateBall();

            gameState.powerUps.splice(index, 1);

        }        const timeLeft = Math.ceil(gameState.powerUpTimer / 1000);    draw();

        

        if (powerUp.x < 0 || powerUp.x > canvas.width) {        display.innerHTML = `    

            gameState.powerUps.splice(index, 1);

        }            <div class="text-4xl mb-2">${gameState.activePowerUp.icon}</div>    requestAnimationFrame(gameLoop);

    });

                <div class="text-sm font-bold text-white">${powerUpTypes.find(p => p.type === gameState.activePowerUp.type).name}</div>}

    if (gameState.activePowerUp) {

        gameState.powerUpTimer -= 16.67;            <div class="text-xs text-gray-400">${timeLeft}s</div>

        if (gameState.powerUpTimer <= 0) {

            deactivatePowerUp();        `;// Initial draw

        }

    }    } else {draw();

            display.innerHTML = `

    gameState.elapsedTime = Date.now() - gameState.startTime;            <div class="text-3xl mb-2">💫</div>

    updateGameTime();            <div class="text-xs text-gray-400">None Active</div>

            `;

    if (gameState.mode === 'timeattack' && gameState.elapsedTime >= 60000) {    }

        endGame('⏱️ Time Up!', `Final Score: ${playerScore}`);}

        if (playerScore >= 20) {

            unlockAchievement('time_lord');// ========================================

        }// 🎵 SOUND EFFECTS (Simulated)

        return;// ========================================

    }

    function playSound(type) {

    draw();    if (!gameState.soundEnabled) return;

    requestAnimationFrame(gameLoop);    

}    try {

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// UI Updates        const oscillator = audioContext.createOscillator();

function updateScoreboard() {        const gainNode = audioContext.createGain();

    document.getElementById('playerScore').textContent = playerScore;        

    document.getElementById('aiScore').textContent = aiScore;        oscillator.connect(gainNode);

}        gainNode.connect(audioContext.destination);

        

function updateStats() {        switch (type) {

    document.getElementById('hitCount').textContent = gameState.hitCount;            case 'hit':

    document.getElementById('maxSpeed').textContent = gameState.maxSpeed.toFixed(1);                oscillator.frequency.value = 200;

    document.getElementById('rallyCount').textContent = gameState.rallyCount;                gainNode.gain.value = 0.1;

}                oscillator.start();

                oscillator.stop(audioContext.currentTime + 0.1);

function updateGameTime() {                break;

    const seconds = Math.floor(gameState.elapsedTime / 1000);            case 'score':

    const minutes = Math.floor(seconds / 60);                oscillator.frequency.value = 440;

    const secs = seconds % 60;                gainNode.gain.value = 0.2;

    document.getElementById('gameTime').textContent =                 oscillator.start();

        `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;                oscillator.stop(audioContext.currentTime + 0.2);

}                break;

            case 'powerup':

// Game Controls                oscillator.frequency.value = 880;

function startGame() {                gainNode.gain.value = 0.15;

    document.getElementById('gameOverlay').classList.add('hidden');                oscillator.start();

    gameState.running = true;                oscillator.stop(audioContext.currentTime + 0.15);

    gameState.paused = false;                break;

    gameState.hitCount = 0;        }

    gameState.rallyCount = 0;    } catch (e) {

    gameState.startTime = Date.now();        console.log('Audio not supported');

    gameState.elapsedTime = 0;    }

    gameState.particles = [];}

    gameState.powerUps = [];

    // ========================================

    resetBall();// 🎮 GAME CONTROLS

    updateStats();// ========================================

    gameLoop();

}// Mouse Control

canvas.addEventListener('mousemove', (e) => {

function restartGame() {    if (gameState.running && !gameState.paused && gameState.controlMode === 'mouse') {

    playerScore = 0;        const rect = canvas.getBoundingClientRect();

    aiScore = 0;        const scaleY = canvas.height / rect.height;

    updateScoreboard();        playerPaddle.targetY = (e.clientY - rect.top) * scaleY;

    startGame();    }

}});



function togglePause() {// Touch Control

    gameState.paused = !gameState.paused;canvas.addEventListener('touchmove', (e) => {

    const pauseOverlay = document.getElementById('pauseOverlay');    e.preventDefault();

        if (gameState.running && !gameState.paused && gameState.controlMode === 'touch') {

    if (gameState.paused) {        const rect = canvas.getBoundingClientRect();

        pauseOverlay.classList.remove('hidden');        const scaleY = canvas.height / rect.height;

    } else {        const touch = e.touches[0];

        pauseOverlay.classList.add('hidden');        playerPaddle.targetY = (touch.clientY - rect.top) * scaleY;

        gameLoop();    }

    }}, { passive: false });

}

// Keyboard Control

function returnToMenu() {const keys = {};

    gameState.running = false;document.addEventListener('keydown', (e) => {

    gameState.paused = false;    keys[e.key] = true;

    document.getElementById('pauseOverlay').classList.add('hidden');    

    document.getElementById('gameOverlay').classList.remove('hidden');    // Pause on SPACE

    document.getElementById('startButton').classList.remove('hidden');    if (e.key === ' ' && gameState.running) {

    document.getElementById('restartButton').classList.add('hidden');        e.preventDefault();

    document.getElementById('overlayTitle').textContent = 'Ultimate Pong';        togglePause();

    document.getElementById('overlayMessage').textContent = 'Ready to play?';    }

}    

    // ESC to menu

function endGame(title, message) {    if (e.key === 'Escape' && gameState.running) {

    gameState.running = false;        returnToMenu();

    document.getElementById('overlayTitle').textContent = title;    }

    document.getElementById('overlayMessage').textContent = message;});

    document.getElementById('startButton').classList.add('hidden');

    document.getElementById('restartButton').classList.remove('hidden');document.addEventListener('keyup', (e) => {

    document.getElementById('gameOverlay').classList.remove('hidden');    keys[e.key] = false;

    });

    saveToLeaderboard();

}function updateKeyboardControl() {

    if (gameState.controlMode !== 'keyboard') return;

// Achievements    

function unlockAchievement(id) {    if (keys['w'] || keys['W'] || keys['ArrowUp']) {

    const achievement = achievements.find(a => a.id === id);        playerPaddle.targetY -= playerPaddle.speed;

    if (achievement && !achievement.unlocked) {    }

        achievement.unlocked = true;    if (keys['s'] || keys['S'] || keys['ArrowDown']) {

        console.log(`🏆 Achievement Unlocked: ${achievement.name}`);        playerPaddle.targetY += playerPaddle.speed;

        saveAchievements();    }

    }}

}

// ========================================

function saveAchievements() {// 🎯 GAME LOGIC

    localStorage.setItem('pong_achievements', JSON.stringify(achievements));// ========================================

}

function updatePaddles() {

function loadAchievements() {    // Smooth paddle movement

    const saved = localStorage.getItem('pong_achievements');    const smoothing = 0.3;

    if (saved) {    playerPaddle.y += (playerPaddle.targetY - playerPaddle.y - playerPaddle.height / 2) * smoothing;

        const loaded = JSON.parse(saved);    

        loaded.forEach(saved => {    // Keep paddles in bounds

            const achievement = achievements.find(a => a.id === saved.id);    playerPaddle.y = Math.max(0, Math.min(canvas.height - playerPaddle.height, playerPaddle.y));

            if (achievement) achievement.unlocked = saved.unlocked;    

        });    // AI Movement

    }    updateAI();

}}



function renderAchievements() {function updateAI() {

    const list = document.getElementById('achievementsList');    const targetY = ball.y + (Math.random() - 0.5) * currentDifficulty.errorMargin;

    list.innerHTML = achievements.map(ach => `    const paddleCenter = aiPaddle.y + aiPaddle.height / 2;

        <div class="setting-item ${ach.unlocked ? 'bg-green-900/20' : 'bg-gray-800/50'}">    

            <div class="flex items-center gap-3">    if (ball.speedX > 0 && Math.random() < currentDifficulty.reactionDelay) {

                <span class="text-3xl">${ach.icon}</span>        if (paddleCenter < targetY - 15) {

                <div class="flex-1">            aiPaddle.y += aiPaddle.speed;

                    <h4 class="font-bold text-white">${ach.name}</h4>        } else if (paddleCenter > targetY + 15) {

                    <p class="text-sm text-gray-400">${ach.desc}</p>            aiPaddle.y -= aiPaddle.speed;

                </div>        }

                ${ach.unlocked ? '<span class="text-green-400">✓</span>' : '<span class="text-gray-600">🔒</span>'}    }

            </div>    

        </div>    aiPaddle.y = Math.max(0, Math.min(canvas.height - aiPaddle.height, aiPaddle.y));

    `).join('');}

}

function updateBall() {

// Leaderboard    // Move ball

function saveToLeaderboard() {    ball.x += ball.speedX;

    const entry = {    ball.y += ball.speedY;

        score: playerScore,    

        mode: gameState.mode,    // Add trail

        difficulty: document.getElementById('difficulty').value,    if (gameState.particlesEnabled) {

        date: new Date().toISOString()        ball.trail.push({ x: ball.x, y: ball.y });

    };        if (ball.trail.length > 15) ball.trail.shift();

        }

    let leaderboard = JSON.parse(localStorage.getItem('pong_leaderboard') || '[]');    

    leaderboard.push(entry);    // Wall collision

    leaderboard.sort((a, b) => b.score - a.score);    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {

    leaderboard = leaderboard.slice(0, 10);        ball.speedY = -ball.speedY;

            createParticles(ball.x, ball.y, 10, themes[gameState.theme].particles);

    localStorage.setItem('pong_leaderboard', JSON.stringify(leaderboard));        playSound('hit');

}    }

    

function renderLeaderboard() {    // Player paddle collision

    const leaderboard = JSON.parse(localStorage.getItem('pong_leaderboard') || '[]');    if (checkPaddleCollision(ball, playerPaddle)) {

    const list = document.getElementById('leaderboardList');        handlePaddleHit(playerPaddle, 1);

        }

    if (leaderboard.length === 0) {    

        list.innerHTML = '<p class="text-center text-gray-400">No scores yet. Be the first!</p>';    // AI paddle collision

        return;    if (checkPaddleCollision(ball, aiPaddle)) {

    }        handlePaddleHit(aiPaddle, -1);

        }

    list.innerHTML = leaderboard.map((entry, index) => `    

        <div class="setting-item flex items-center justify-between">    // Scoring

            <div class="flex items-center gap-3">    if (ball.x - ball.radius < 0) {

                <span class="text-2xl font-bold ${index < 3 ? 'text-yellow-400' : 'text-gray-400'}">#${index + 1}</span>        handleScore('ai');

                <div>    } else if (ball.x + ball.radius > canvas.width) {

                    <p class="font-bold text-white">Score: ${entry.score}</p>        handleScore('player');

                    <p class="text-xs text-gray-400">${entry.mode} • ${entry.difficulty}</p>    }

                </div>}

            </div>

            <span class="text-xs text-gray-500">${new Date(entry.date).toLocaleDateString()}</span>function checkPaddleCollision(ball, paddle) {

        </div>    return (

    `).join('');        ball.x - ball.radius < paddle.x + paddle.width &&

}        ball.x + ball.radius > paddle.x &&

        ball.y > paddle.y &&

// Event Listeners        ball.y < paddle.y + paddle.height

document.getElementById('startButton').addEventListener('click', startGame);    );

document.getElementById('restartButton').addEventListener('click', restartGame);}

document.getElementById('resumeButton').addEventListener('click', togglePause);

function handlePaddleHit(paddle, direction) {

document.getElementById('difficulty').addEventListener('change', (e) => {    const hitPos = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);

    currentDifficulty = difficulties[e.target.value];    const angle = hitPos * Math.PI / 3; // Max 60 degrees

    aiPaddle.speed = currentDifficulty.speed;    

});    const currentSpeed = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);

    const newSpeed = Math.min(currentSpeed + 0.3, ball.maxSpeed);

document.getElementById('controlMode').addEventListener('change', (e) => {    

    gameState.controlMode = e.target.value;    ball.speedX = Math.cos(angle) * newSpeed * direction;

});    ball.speedY = Math.sin(angle) * newSpeed;

    

document.querySelectorAll('.game-mode-btn').forEach(btn => {    // Ensure ball moves away from paddle

    btn.addEventListener('click', () => {    ball.x = direction > 0 ? paddle.x + paddle.width + ball.radius : paddle.x - ball.radius;

        document.querySelectorAll('.game-mode-btn').forEach(b => b.classList.remove('active'));    

        btn.classList.add('active');    // Update stats

        gameState.mode = btn.dataset.mode;    gameState.hitCount++;

    });    gameState.rallyCount++;

});    gameState.maxSpeed = Math.max(gameState.maxSpeed, newSpeed);

    

document.getElementById('settingsBtn').addEventListener('click', () => {    updateStats();

    document.getElementById('settingsModal').classList.remove('hidden');    createParticles(ball.x, ball.y, 15, themes[gameState.theme].particles);

});    playSound('hit');

    

document.getElementById('soundToggle').addEventListener('click', () => {    // Spawn power-up occasionally

    gameState.soundEnabled = !gameState.soundEnabled;    if (gameState.hitCount % 10 === 0) {

    document.getElementById('soundOnIcon').classList.toggle('hidden');        spawnPowerUp();

    document.getElementById('soundOffIcon').classList.toggle('hidden');    }

});    

    // Check achievements

document.getElementById('soundEffectsToggle').addEventListener('change', (e) => {    if (gameState.rallyCount >= 20) {

    gameState.soundEnabled = e.target.checked;        unlockAchievement('rally_master');

});    }

    if (newSpeed >= ball.maxSpeed - 0.1) {

document.getElementById('particlesToggle').addEventListener('change', (e) => {        unlockAchievement('speed_demon');

    gameState.particlesEnabled = e.target.checked;    }

});}



document.getElementById('themeSelect').addEventListener('change', (e) => {function handleScore(scorer) {

    gameState.theme = e.target.value;    if (scorer === 'player') {

});        playerScore++;

    } else {

document.getElementById('achievementsBtn').addEventListener('click', () => {        aiScore++;

    renderAchievements();        gameState.rallyCount = 0;

    document.getElementById('achievementsModal').classList.remove('hidden');    }

});    

    updateScoreboard();

document.getElementById('leaderboardBtn').addEventListener('click', () => {    playSound('score');

    renderLeaderboard();    createParticles(ball.x, ball.y, 30, scorer === 'player' ? '#06b6d4' : '#ec4899');

    document.getElementById('leaderboardModal').classList.remove('hidden');    

});    // Check game modes

    if (gameState.mode === 'survival' && scorer === 'ai') {

document.querySelectorAll('.modal-close').forEach(btn => {        endGame('💀 Game Over!', `You survived ${playerScore} rounds!`);

    btn.addEventListener('click', () => {        return;

        document.getElementById(btn.dataset.modal).classList.add('hidden');    }

    });    

});    if (!checkWinner()) {

        resetBall();

document.querySelectorAll('.modal').forEach(modal => {    }

    modal.addEventListener('click', (e) => {}

        if (e.target === modal) {

            modal.classList.add('hidden');function resetBall() {

        }    ball.x = canvas.width / 2;

    });    ball.y = canvas.height / 2;

});    ball.trail = [];

    

// Initialization    const angle = (Math.random() * Math.PI / 3) - Math.PI / 6;

function init() {    const direction = Math.random() > 0.5 ? 1 : -1;

    loadAchievements();    

    updateScoreboard();    ball.speedX = Math.cos(angle) * ball.baseSpeed * direction;

    updateStats();    ball.speedY = Math.sin(angle) * ball.baseSpeed;

    updatePowerUpDisplay();}

    draw();

    function checkWinner() {

    document.getElementById('overlayTitle').textContent = 'ULTIMATE PONG';    if (gameState.mode === 'classic' && playerScore >= WINNING_SCORE) {

    document.getElementById('overlayMessage').textContent = 'Choose your difficulty and click Start!';        endGame('🎉 VICTORY!', `You defeated the AI ${playerScore}-${aiScore}!`);

}        checkEndGameAchievements(true);

        return true;

init();    } else if (gameState.mode === 'classic' && aiScore >= WINNING_SCORE) {

        endGame('💔 DEFEAT', `AI wins ${aiScore}-${playerScore}. Try again!`);
        checkEndGameAchievements(false);
        return true;
    }
    return false;
}

function checkEndGameAchievements(playerWon) {
    if (playerWon) {
        unlockAchievement('first_win');
        if (aiScore === 0) {
            unlockAchievement('perfect_game');
        }
        if (document.getElementById('difficulty').value === 'impossible') {
            unlockAchievement('impossible_beat');
        }
    }
    
    if (gameState.mode === 'survival' && playerScore >= 15) {
        unlockAchievement('survivor');
    }
}

// ========================================
// 🎨 RENDERING
// ========================================

function draw() {
    // Clear canvas with gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw ball trail
    if (gameState.particlesEnabled && ball.trail.length > 0) {
        for (let i = 0; i < ball.trail.length; i++) {
            const alpha = i / ball.trail.length * 0.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(ball.trail[i].x, ball.trail[i].y, ball.radius * 0.7, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Draw paddles
    drawPaddle(playerPaddle, themes[gameState.theme].player);
    drawPaddle(aiPaddle, themes[gameState.theme].ai);
    
    // Draw ball
    ctx.shadowBlur = 20;
    ctx.shadowColor = themes[gameState.theme].ball;
    ctx.fillStyle = themes[gameState.theme].ball;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Draw particles
    gameState.particles.forEach(particle => particle.draw());
    
    // Draw power-ups
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
// 🔄 GAME LOOP
// ========================================

function gameLoop() {
    if (!gameState.running || gameState.paused) return;
    
    updateKeyboardControl();
    updatePaddles();
    updateBall();
    
    // Update particles
    gameState.particles = gameState.particles.filter(p => {
        p.update();
        return !p.isDead();
    });
    
    // Update power-ups
    gameState.powerUps.forEach((powerUp, index) => {
        powerUp.update();
        
        // Check collision with player paddle
        if (powerUp.checkCollision(playerPaddle)) {
            activatePowerUp(powerUp);
            gameState.powerUps.splice(index, 1);
        }
        
        // Remove if off screen
        if (powerUp.x < 0 || powerUp.x > canvas.width) {
            gameState.powerUps.splice(index, 1);
        }
    });
    
    // Update power-up timer
    if (gameState.activePowerUp) {
        gameState.powerUpTimer -= 16.67; // Assuming 60fps
        if (gameState.powerUpTimer <= 0) {
            deactivatePowerUp();
        }
    }
    
    // Update time
    gameState.elapsedTime = Date.now() - gameState.startTime;
    updateGameTime();
    
    // Time Attack mode check
    if (gameState.mode === 'timeattack' && gameState.elapsedTime >= 60000) {
        endGame('⏱️ Time Up!', `Final Score: ${playerScore}`);
        if (playerScore >= 20) {
            unlockAchievement('time_lord');
        }
        return;
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}

// ========================================
// 📊 UI UPDATES
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
// 🎮 GAME CONTROLS
// ========================================

function startGame() {
    document.getElementById('gameOverlay').classList.add('hidden');
    gameState.running = true;
    gameState.paused = false;
    gameState.winner = null;
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
    
    if (gameState.paused) {
        pauseOverlay.classList.remove('hidden');
    } else {
        pauseOverlay.classList.add('hidden');
        gameLoop();
    }
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
// 🏆 ACHIEVEMENTS & LEADERBOARD
// ========================================

function unlockAchievement(id) {
    const achievement = achievements.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        showAchievementNotification(achievement);
        saveAchievements();
    }
}

function showAchievementNotification(achievement) {
    // Simple notification (can be enhanced with a proper toast library)
    console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
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
    const entry = {
        score: playerScore,
        mode: gameState.mode,
        difficulty: document.getElementById('difficulty').value,
        date: new Date().toISOString()
    };
    
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
// 📱 EVENT LISTENERS
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

// Game mode buttons
document.querySelectorAll('.game-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.game-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameState.mode = btn.dataset.mode;
    });
});

// Settings
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

document.getElementById('screenShakeToggle').addEventListener('change', (e) => {
    gameState.screenShakeEnabled = e.target.checked;
});

document.getElementById('themeSelect').addEventListener('change', (e) => {
    gameState.theme = e.target.value;
});

// Achievements
document.getElementById('achievementsBtn').addEventListener('click', () => {
    renderAchievements();
    document.getElementById('achievementsModal').classList.remove('hidden');
});

// Leaderboard
document.getElementById('leaderboardBtn').addEventListener('click', () => {
    renderLeaderboard();
    document.getElementById('leaderboardModal').classList.remove('hidden');
});

// Modal close buttons
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById(btn.dataset.modal).classList.add('hidden');
    });
});

// Close modals on outside click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});

// ========================================
// 🚀 INITIALIZATION
// ========================================

function init() {
    loadAchievements();
    updateScoreboard();
    updateStats();
    updatePowerUpDisplay();
    draw();
    
    // Show initial overlay
    document.getElementById('overlayTitle').textContent = 'ULTIMATE PONG';
    document.getElementById('overlayMessage').textContent = 'Choose your difficulty and click Start!';
}

// Start the game
init();
