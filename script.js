// Canvas setup
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game elements
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 10;
const winningScore = 7;

// Game state
let gameState = {
    running: false,
    paused: false,
    winner: null
};

// Player paddle (left)
const playerPaddle = {
    x: 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 8,
    dy: 0
};

// AI paddle (right)
const aiPaddle = {
    x: canvas.width - 20 - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    speed: 4
};

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballSize / 2,
    speedX: 5,
    speedY: 5,
    baseSpeed: 5,
    maxSpeed: 12
};

// Scores
let playerScore = 0;
let aiScore = 0;

// Difficulty settings
const difficulties = {
    easy: { speed: 3, reactionDelay: 0.6, errorMargin: 40 },
    medium: { speed: 4.5, reactionDelay: 0.75, errorMargin: 25 },
    hard: { speed: 6, reactionDelay: 0.85, errorMargin: 10 },
    impossible: { speed: 8, reactionDelay: 0.95, errorMargin: 0 }
};

let currentDifficulty = difficulties.medium;

// Event listeners
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);
document.getElementById('difficulty').addEventListener('change', changeDifficulty);

canvas.addEventListener('mousemove', (e) => {
    if (gameState.running) {
        const rect = canvas.getBoundingClientRect();
        const scaleY = canvas.height / rect.height;
        playerPaddle.y = (e.clientY - rect.top) * scaleY - playerPaddle.height / 2;
        
        // Keep paddle within bounds
        if (playerPaddle.y < 0) playerPaddle.y = 0;
        if (playerPaddle.y + playerPaddle.height > canvas.height) {
            playerPaddle.y = canvas.height - playerPaddle.height;
        }
    }
});

function changeDifficulty(e) {
    const difficulty = e.target.value;
    currentDifficulty = difficulties[difficulty];
    aiPaddle.speed = currentDifficulty.speed;
}

function startGame() {
    document.getElementById('gameOverlay').classList.add('hidden');
    gameState.running = true;
    gameState.winner = null;
    resetBall();
    gameLoop();
}

function restartGame() {
    playerScore = 0;
    aiScore = 0;
    updateScoreboard();
    startGame();
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    
    // Random direction
    const angle = (Math.random() * Math.PI / 2) - Math.PI / 4; // -45 to 45 degrees
    const direction = Math.random() > 0.5 ? 1 : -1;
    
    ball.speedX = Math.cos(angle) * ball.baseSpeed * direction;
    ball.speedY = Math.sin(angle) * ball.baseSpeed;
}

function updateScoreboard() {
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('aiScore').textContent = aiScore;
}

function checkWinner() {
    if (playerScore >= winningScore) {
        gameState.winner = 'player';
        endGame('🎉 You Win!', 'Congratulations! You defeated the AI!');
        return true;
    } else if (aiScore >= winningScore) {
        gameState.winner = 'ai';
        endGame('😢 AI Wins!', 'Better luck next time! Try again?');
        return true;
    }
    return false;
}

function endGame(title, message) {
    gameState.running = false;
    document.getElementById('overlayTitle').textContent = title;
    document.getElementById('overlayMessage').textContent = message;
    document.getElementById('startButton').classList.add('hidden');
    document.getElementById('restartButton').classList.remove('hidden');
    document.getElementById('gameOverlay').classList.remove('hidden');
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawNet() {
    const netWidth = 2;
    const netHeight = 10;
    const gap = 15;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < canvas.height; i += netHeight + gap) {
        ctx.fillRect(canvas.width / 2 - netWidth / 2, i, netWidth, netHeight);
    }
}

function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, '#1a1a2e');
    
    // Draw net
    drawNet();
    
    // Draw paddles with gradient
    const playerGradient = ctx.createLinearGradient(
        playerPaddle.x, 0, playerPaddle.x + playerPaddle.width, 0
    );
    playerGradient.addColorStop(0, '#00ff88');
    playerGradient.addColorStop(1, '#00cc6a');
    ctx.fillStyle = playerGradient;
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    
    const aiGradient = ctx.createLinearGradient(
        aiPaddle.x, 0, aiPaddle.x + aiPaddle.width, 0
    );
    aiGradient.addColorStop(0, '#ff0066');
    aiGradient.addColorStop(1, '#cc0052');
    ctx.fillStyle = aiGradient;
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
    
    // Draw ball with glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffffff';
    drawCircle(ball.x, ball.y, ball.radius, '#ffffff');
    ctx.shadowBlur = 0;
}

function updateAI() {
    // AI prediction with difficulty-based reaction
    const targetY = ball.y + (Math.random() - 0.5) * currentDifficulty.errorMargin;
    const paddleCenter = aiPaddle.y + aiPaddle.height / 2;
    
    // Only react if ball is moving towards AI and within reaction threshold
    if (ball.speedX > 0 && Math.random() < currentDifficulty.reactionDelay) {
        if (paddleCenter < targetY - 10) {
            aiPaddle.y += aiPaddle.speed;
        } else if (paddleCenter > targetY + 10) {
            aiPaddle.y -= aiPaddle.speed;
        }
    }
    
    // Keep AI paddle within bounds
    if (aiPaddle.y < 0) aiPaddle.y = 0;
    if (aiPaddle.y + aiPaddle.height > canvas.height) {
        aiPaddle.y = canvas.height - aiPaddle.height;
    }
}

function updateBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    
    // Wall collision (top and bottom)
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.speedY = -ball.speedY;
    }
    
    // Paddle collision detection
    // Player paddle
    if (ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
        ball.x + ball.radius > playerPaddle.x &&
        ball.y > playerPaddle.y &&
        ball.y < playerPaddle.y + playerPaddle.height) {
        
        // Calculate hit position (-1 to 1)
        const hitPos = (ball.y - (playerPaddle.y + playerPaddle.height / 2)) / (playerPaddle.height / 2);
        
        // Change angle based on where it hit the paddle
        const angle = hitPos * Math.PI / 4; // Max 45 degrees
        
        const speed = Math.min(
            Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY) + 0.5,
            ball.maxSpeed
        );
        
        ball.speedX = Math.cos(angle) * speed;
        ball.speedY = Math.sin(angle) * speed;
        
        // Ensure ball moves right
        ball.speedX = Math.abs(ball.speedX);
        ball.x = playerPaddle.x + playerPaddle.width + ball.radius;
    }
    
    // AI paddle
    if (ball.x + ball.radius > aiPaddle.x &&
        ball.x - ball.radius < aiPaddle.x + aiPaddle.width &&
        ball.y > aiPaddle.y &&
        ball.y < aiPaddle.y + aiPaddle.height) {
        
        const hitPos = (ball.y - (aiPaddle.y + aiPaddle.height / 2)) / (aiPaddle.height / 2);
        const angle = hitPos * Math.PI / 4;
        
        const speed = Math.min(
            Math.sqrt(ball.speedX * ball.speedX + ball.speedY * ball.speedY) + 0.5,
            ball.maxSpeed
        );
        
        ball.speedX = Math.cos(angle) * speed;
        ball.speedY = Math.sin(angle) * speed;
        
        // Ensure ball moves left
        ball.speedX = -Math.abs(ball.speedX);
        ball.x = aiPaddle.x - ball.radius;
    }
    
    // Scoring
    if (ball.x - ball.radius < 0) {
        aiScore++;
        updateScoreboard();
        if (!checkWinner()) {
            resetBall();
        }
    } else if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        updateScoreboard();
        if (!checkWinner()) {
            resetBall();
        }
    }
}

function gameLoop() {
    if (!gameState.running) return;
    
    updateAI();
    updateBall();
    draw();
    
    requestAnimationFrame(gameLoop);
}

// Initial draw
draw();