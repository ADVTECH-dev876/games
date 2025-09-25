<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boostape - Racing Game</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            color: #fff;
        }
        
        .game-container {
            position: relative;
            width: 800px;
            height: 600px;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
            border-radius: 10px;
            overflow: hidden;
        }
        
        #gameCanvas {
            background: linear-gradient(to bottom, #0c1445, #1a237e);
            display: block;
        }
        
        .ui-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            pointer-events: none;
        }
        
        .score-container, .boost-container {
            background: rgba(0, 0, 0, 0.6);
            padding: 10px 20px;
            border-radius: 30px;
            backdrop-filter: blur(5px);
            border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .score-value, .boost-value {
            font-size: 24px;
            font-weight: bold;
            color: #ffcc00;
            text-shadow: 0 0 10px rgba(255, 204, 0, 0.7);
        }
        
        .boost-bar {
            height: 10px;
            width: 150px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 5px;
            margin-top: 5px;
            overflow: hidden;
        }
        
        .boost-fill {
            height: 100%;
            width: 100%;
            background: linear-gradient(90deg, #00ff00, #00cc00);
            border-radius: 5px;
            transition: width 0.3s;
        }
        
        .title-screen, .game-over {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: rgba(10, 10, 30, 0.9);
            z-index: 10;
            text-align: center;
        }
        
        .game-over {
            display: none;
        }
        
        h1 {
            font-size: 60px;
            margin-bottom: 20px;
            background: linear-gradient(to right, #ff00cc, #3333ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 20px rgba(255, 0, 204, 0.5);
            letter-spacing: 3px;
        }
        
        h2 {
            font-size: 40px;
            margin-bottom: 30px;
            color: #ffcc00;
        }
        
        .final-score {
            font-size: 30px;
            margin: 20px 0;
            color: #4fc3f7;
        }
        
        .btn {
            background: linear-gradient(45deg, #ff00cc, #3333ff);
            color: white;
            border: none;
            padding: 15px 40px;
            font-size: 20px;
            border-radius: 50px;
            cursor: pointer;
            margin-top: 20px;
            transition: all 0.3s;
            box-shadow: 0 0 20px rgba(255, 0, 204, 0.5);
            font-weight: bold;
            letter-spacing: 1px;
        }
        
        .btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 30px rgba(255, 0, 204, 0.8);
        }
        
        .instructions {
            max-width: 80%;
            margin: 30px auto;
            line-height: 1.6;
            color: #aaa;
            font-size: 18px;
        }
        
        .key {
            display: inline-block;
            background: rgba(0, 0, 0, 0.5);
            padding: 5px 10px;
            border-radius: 5px;
            margin: 0 5px;
            border: 1px solid #555;
        }
        
        .road-lines {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 10px;
            height: 100%;
            background: repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 20px,
                #ffcc00 20px,
                #ffcc00 40px
            );
            z-index: 1;
        }
        
        .car {
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 100px;
            z-index: 5;
        }
        
        .car-body {
            width: 60px;
            height: 80px;
            background: linear-gradient(135deg, #ff0055, #ff5500);
            border-radius: 10px 10px 5px 5px;
            position: relative;
            box-shadow: 0 0 20px rgba(255, 0, 85, 0.7);
        }
        
        .car-top {
            width: 40px;
            height: 30px;
            background: linear-gradient(135deg, #ff0055, #ff5500);
            border-radius: 5px 5px 0 0;
            position: absolute;
            top: -20px;
            left: 10px;
        }
        
        .car-window {
            width: 30px;
            height: 20px;
            background: #a0d2eb;
            border-radius: 3px 3px 0 0;
            position: absolute;
            top: -15px;
            left: 15px;
        }
        
        .wheel {
            width: 20px;
            height: 30px;
            background: #222;
            border-radius: 50%;
            position: absolute;
            bottom: -10px;
        }
        
        .wheel-front {
            left: 5px;
        }
        
        .wheel-back {
            right: 5px;
        }
        
        .boost-effect {
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 30px;
            background: linear-gradient(to top, #00ff00, transparent);
            border-radius: 50%;
            opacity: 0;
            z-index: 4;
        }
        
        .obstacle {
            position: absolute;
            width: 60px;
            height: 80px;
            background: linear-gradient(135deg, #333, #555);
            border-radius: 10px;
            z-index: 3;
        }
        
        .obstacle-truck {
            background: linear-gradient(135deg, #5d4037, #8d6e63);
        }
        
        .obstacle-suv {
            background: linear-gradient(135deg, #2e7d32, #4caf50);
        }
        
        .particles {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
        }
        
        .particle {
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #ffcc00;
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <div class="game-container">
        <canvas id="gameCanvas" width="800" height="600"></canvas>
        
        <div class="ui-overlay">
            <div class="score-container">
                <div>SCORE</div>
                <div class="score-value">0</div>
            </div>
            <div class="boost-container">
                <div>BOOST</div>
                <div class="boost-value">100%</div>
                <div class="boost-bar">
                    <div class="boost-fill"></div>
                </div>
            </div>
        </div>
        
        <div class="title-screen">
            <h1>BOOSTAPE</h1>
            <div class="instructions">
                <p>Use <span class="key">←</span> and <span class="key">→</span> arrow keys to steer</p>
                <p>Press <span class="key">SPACE</span> to activate BOOST (consumes boost meter)</p>
                <p>Avoid obstacles and survive as long as possible!</p>
            </div>
            <button class="btn" id="startBtn">START RACE</button>
        </div>
        
        <div class="game-over">
            <h2>RACE OVER!</h2>
            <div class="final-score">Your Score: <span id="finalScore">0</span></div>
            <button class="btn" id="restartBtn">RACE AGAIN</button>
        </div>
    </div>

    <script>
        // Game variables
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreValue = document.querySelector('.score-value');
        const boostValue = document.querySelector('.boost-value');
        const boostFill = document.querySelector('.boost-fill');
        const startBtn = document.getElementById('startBtn');
        const restartBtn = document.getElementById('restartBtn');
        const titleScreen = document.querySelector('.title-screen');
        const gameOverScreen = document.querySelector('.game-over');
        const finalScore = document.getElementById('finalScore');
        
        // Game state
        let gameRunning = false;
        let score = 0;
        let boost = 100;
        let boostActive = false;
        let boostCooldown = 0;
        let roadSpeed = 5;
        let playerX = canvas.width / 2 - 30;
        let playerY = canvas.height - 120;
        let obstacles = [];
        let particles = [];
        let keys = {};
        let lastTime = 0;
        let roadOffset = 0;
        
        // Car dimensions
        const CAR_WIDTH = 60;
        const CAR_HEIGHT = 100;
        
        // Obstacle types
        const OBSTACLE_TYPES = [
            { color: '#333', height: 80 },
            { color: '#5d4037', height: 100 }, // truck
            { color: '#2e7d32', height: 90 }   // suv
        ];
        
        // Initialize game
        function init() {
            gameRunning = true;
            score = 0;
            boost = 100;
            boostActive = false;
            boostCooldown = 0;
            roadSpeed = 5;
            playerX = canvas.width / 2 - 30;
            obstacles = [];
            particles = [];
            keys = {};
            updateUI();
            titleScreen.style.display = 'none';
            gameOverScreen.style.display = 'none';
        }
        
        // Update UI elements
        function updateUI() {
            scoreValue.textContent = score;
            boostValue.textContent = Math.floor(boost) + '%';
            boostFill.style.width = boost + '%';
            
            if (boost >= 100) {
                boostFill.style.background = 'linear-gradient(90deg, #00ff00, #00cc00)';
            } else if (boost >= 50) {
                boostFill.style.background = 'linear-gradient(90deg, #ffff00, #ffcc00)';
            } else {
                boostFill.style.background = 'linear-gradient(90deg, #ff0000, #cc0000)';
            }
        }
        
        // Create a new obstacle
        function createObstacle() {
            const type = Math.floor(Math.random() * OBSTACLE_TYPES.length);
            const obstacle = {
                x: Math.random() * (canvas.width - 80) + 10,
                y: -100,
                width: 60,
                height: OBSTACLE_TYPES[type].height,
                type: type,
                color: OBSTACLE_TYPES[type].color,
                passed: false
            };
            obstacles.push(obstacle);
        }
        
        // Create boost particles
        function createBoostParticles() {
            for (let i = 0; i < 10; i++) {
                particles.push({
                    x: playerX + CAR_WIDTH / 2 + (Math.random() - 0.5) * 30,
                    y: playerY + CAR_HEIGHT,
                    size: Math.random() * 5 + 2,
                    speedX: (Math.random() - 0.5) * 4,
                    speedY: Math.random() * 3 + 2,
                    life: 30
                });
            }
        }
        
        // Check collision between two rectangles
        function checkCollision(rect1, rect2) {
            return rect1.x < rect2.x + rect2.width &&
                   rect1.x + rect1.width > rect2.x &&
                   rect1.y < rect2.y + rect2.height &&
                   rect1.y + rect1.height > rect2.y;
        }
        
        // Handle game over
        function gameOver() {
            gameRunning = false;
            finalScore.textContent = score;
            gameOverScreen.style.display = 'flex';
        }
        
        // Update game state
        function update(timestamp) {
            if (!gameRunning) return;
            
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;
            
            // Handle input
            if (keys['ArrowLeft'] && playerX > 10) {
                playerX -= 8;
            }
            if (keys['ArrowRight'] && playerX < canvas.width - CAR_WIDTH - 10) {
                playerX += 8;
            }
            
            // Handle boost
            if (keys[' '] && boost > 0 && boostCooldown <= 0) {
                boostActive = true;
                boostCooldown = 10;
                createBoostParticles();
            }
            
            if (boostCooldown > 0) {
                boostCooldown--;
            }
            
            if (boostActive) {
                boost -= 0.8;
                if (boost <= 0) {
                    boostActive = false;
                    boost = 0;
                }
            } else if (boost < 100) {
                boost += 0.2;
            }
            
            // Update road speed based on boost
            roadSpeed = boostActive ? 12 : 5 + score / 500;
            
            // Update road offset for animation
            roadOffset = (roadOffset + roadSpeed) % 40;
            
            // Create obstacles
            if (Math.random() < 0.02) {
                createObstacle();
            }
            
            // Update obstacles
            for (let i = obstacles.length - 1; i >= 0; i--) {
                const obstacle = obstacles[i];
                obstacle.y += roadSpeed;
                
                // Check if obstacle is off screen
                if (obstacle.y > canvas.height) {
                    obstacles.splice(i, 1);
                    continue;
                }
                
                // Check collision
                const playerRect = {
                    x: playerX,
                    y: playerY,
                    width: CAR_WIDTH,
                    height: CAR_HEIGHT
                };
                
                const obstacleRect = {
                    x: obstacle.x,
                    y: obstacle.y,
                    width: obstacle.width,
                    height: obstacle.height
                };
                
                if (checkCollision(playerRect, obstacleRect)) {
                    gameOver();
                    return;
                }
                
                // Update score when passing obstacle
                if (!obstacle.passed && obstacle.y > playerY) {
                    obstacle.passed = true;
                    score += 10;
                }
            }
            
            // Update particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.speedX;
                p.y += p.speedY;
                p.life--;
                
                if (p.life <= 0) {
                    particles.splice(i, 1);
                }
            }
            
            // Increase score over time
            score += Math.floor(roadSpeed / 2);
            
            updateUI();
            draw();
            requestAnimationFrame(update);
        }
        
        // Draw everything
        function draw() {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw road
            ctx.fillStyle = '#222';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw road markings
            ctx.strokeStyle = '#ffcc00';
            ctx.lineWidth = 5;
            ctx.setLineDash([30, 20]);
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, roadOffset);
            ctx.lineTo(canvas.width / 2, canvas.height + roadOffset);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Draw road edges
            ctx.fillStyle = '#555';
            ctx.fillRect(0, 0, 10, canvas.height);
            ctx.fillRect(canvas.width - 10, 0, 10, canvas.height);
            
            // Draw obstacles
            obstacles.forEach(obstacle => {
                ctx.fillStyle = obstacle.color;
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                
                // Draw details based on type
                ctx.fillStyle = '#fff';
                if (obstacle.type === 1) { // truck
                    ctx.fillRect(obstacle.x + 10, obstacle.y + 10, 15, 15);
                    ctx.fillRect(obstacle.x + 35, obstacle.y + 10, 15, 15);
                } else if (obstacle.type === 2) { // suv
                    ctx.fillRect(obstacle.x + 10, obstacle.y + 15, 10, 10);
                    ctx.fillRect(obstacle.x + 40, obstacle.y + 15, 10, 10);
                }
            });
            
            // Draw particles
            particles.forEach(p => {
                ctx.globalAlpha = p.life / 30;
                ctx.fillStyle = '#00ff00';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            });
            
            // Draw player car
            ctx.fillStyle = '#ff0055';
            ctx.fillRect(playerX, playerY, CAR_WIDTH, CAR_HEIGHT - 20);
            
            // Car top
            ctx.fillStyle = '#ff0055';
            ctx.fillRect(playerX + 10, playerY - 20, CAR_WIDTH - 20, 20);
            
            // Car window
            ctx.fillStyle = '#a0d2eb';
            ctx.fillRect(playerX + 15, playerY - 15, CAR_WIDTH - 30, 15);
            
            // Wheels
            ctx.fillStyle = '#222';
            ctx.fillRect(playerX + 5, playerY + CAR_HEIGHT - 30, 15, 20);
            ctx.fillRect(playerX + CAR_WIDTH - 20, playerY + CAR_HEIGHT - 30, 15, 20);
            
            // Draw boost effect if active
            if (boostActive) {
                ctx.globalAlpha = 0.7;
                ctx.fillStyle = '#00ff00';
                ctx.beginPath();
                ctx.moveTo(playerX + 20, playerY + CAR_HEIGHT);
                ctx.lineTo(playerX + 40, playerY + CAR_HEIGHT);
                ctx.lineTo(playerX + 30, playerY + CAR_HEIGHT + 20);
                ctx.closePath();
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }
        
        // Event listeners
        window.addEventListener('keydown', (e) => {
            keys[e.key] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            keys[e.key] = false;
        });
        
        startBtn.addEventListener('click', () => {
            init();
            requestAnimationFrame(update);
        });
        
        restartBtn.addEventListener('click', () => {
            init();
            requestAnimationFrame(update);
        });
        
        // Initial draw
        draw();
    </script>
</body>
</html>
