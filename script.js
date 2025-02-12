// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Load images
const monkeyImg = new Image();
monkeyImg.src = "./resources/images/monkey.png"; // Monkey character image

const bananaImg = new Image();
bananaImg.src = "./resources/images/banana.png"; // Banana collectible image

// Player (Monkey) object
let player = {
    x: 180,
    y: 500,
    width: 40, 
    height: 40,
    velocityY: 0,
    gravity: 0.4,
    jumpPower: -10,
    speed: 4
};

// Platforms array
let platforms = [
    { x: 150, y: 550, width: 100, height: 10 },
    { x: 50, y: 450, width: 100, height: 10 },
    { x: 200, y: 350, width: 100, height: 10 },
    { x: 100, y: 250, width: 100, height: 10 }
];

// Bananas array
let bananas = [
    { x: 170, y: 520, width: 20, height: 20 },
    { x: 80, y: 420, width: 20, height: 20 },
    { x: 230, y: 320, width: 20, height: 20 },
    { x: 120, y: 220, width: 20, height: 20 }
];

// Score counter
let score = 0;

// Key state tracking
let keys = {};

// Listen for keydown events
document.addEventListener("keydown", (e) => {
    keys[e.code] = true;
});

// Listen for keyup events
document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

// Reset the game when the player falls
function resetGame() {
    player.x = 180;
    player.y = 500;
    player.velocityY = 0;
    score = 0; // Reset score when falling
    bananas = [  // Reset bananas
        { x: 170, y: 520, width: 20, height: 20 },
        { x: 80, y: 420, width: 20, height: 20 },
        { x: 230, y: 320, width: 20, height: 20 },
        { x: 120, y: 220, width: 20, height: 20 }
    ];
}

// Draw player (monkey)
function drawPlayer() {
    ctx.drawImage(monkeyImg, player.x, player.y, player.width, player.height);
}

// Draw platforms
function drawPlatforms() {
    ctx.fillStyle = "black";
    platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));
}

// Draw bananas
function drawBananas() {
    bananas.forEach(banana => {
        ctx.drawImage(bananaImg, banana.x, banana.y, banana.width, banana.height);
    });
}

// Draw score
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
}

// Game update function
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply gravity
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Left and right movement
    if (keys["ArrowLeft"]) {
        player.x -= player.speed;
    }
    if (keys["ArrowRight"]) {
        player.x += player.speed;
    }

    // Prevent going out of bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Jumping logic
    if (keys["Space"]) {
        player.velocityY = player.jumpPower;
    }

    // Collision detection with platforms
    platforms.forEach(p => {
        if (
            player.y + player.height >= p.y &&
            player.y + player.height <= p.y + 10 &&
            player.x + player.width > p.x &&
            player.x < p.x + p.width
        ) {
            player.velocityY = player.jumpPower;
        }
    });

    // Check banana collection
    bananas = bananas.filter(banana => {
        if (
            player.x < banana.x + banana.width &&
            player.x + player.width > banana.x &&
            player.y < banana.y + banana.height &&
            player.y + player.height > banana.y
        ) {
            score += 10; // Increase score
            return false; // Remove collected banana
        }
        return true;
    });

    // If player falls off the screen, reset the game
    if (player.y > canvas.height) {
        resetGame();
    }

    // Draw everything
    drawPlatforms();
    drawBananas();
    drawPlayer();
    drawScore();

    requestAnimationFrame(updateGame);
}

// Start the game once images are loaded
monkeyImg.onload = () => {
    bananaImg.onload = updateGame;
};
