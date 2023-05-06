class Obstacle {
  constructor(width, height, image, x, y, speed) {
    this.width = width;
    this.height = height;
    this.image = new Image();
    this.image.src = image
    this.x = x;
    this.y = y;
    this.speed = speed;
  }
  update() {
    this.x += -this.speed
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

const smallCac = '/images/cactus-small.png'
const largeCac = '/images/cactus-large.png'
const bigCac = '/images/cactus-big.png'
const flyingDino = '/images/ezgif.com-gif-maker.gif'

//initate the background image
const bgImage = new Image();
bgImage.src = "./images/bg.png";

// Getting the instructions element
const instrButton = document.getElementById("instructions");
const instrContainer = document.getElementById("instruction-container");

// Getting the canvas element from html
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

// Getting the start/RAAAAWR button and the main men screen, as well as the game canvas
const startButton = document.getElementById("start-game");
const mainMenu = document.getElementById("border");

// Mouseover/mouseout event listeners to make a kind of 'drop down' menu.
instrButton.addEventListener("mouseover", () => {
  instrContainer.style.display = "block";
});
instrButton.addEventListener("mouseout", () => {
  instrContainer.style.display = "none";
});

// Mouseover/mouseout event listeners to make a kind of 'drop down' menu.
instrButton.addEventListener("mouseover", () => {
  instrContainer.style.display = "block";
});
instrButton.addEventListener("mouseout", () => {
  instrContainer.style.display = "none";
});

// START THE GAME BUTTON
startButton.addEventListener("click", () => {
  mainMenu.style.display = "none";
  canvas.style.display = "flex";
});

// Updating the dino image (Creating a running animation)
const dinoLeft = new Image();
dinoLeft.src = "./images/Dino-left.png";

const dinoRight = new Image();
dinoRight.src = "./images/Dino-right.png";

const obstacles = [];
function updateObstacles() {
    for (i = 0; i < obstacles.length; i++) {
        obstacles[i].x += -4;
        obstacles[i].update();
    }
    if (frameCount % 120 === 0 ) {
        const allObstacles = [];
        let flyingObstacle = new Obstacle(100, 100, flyingDino, canvas.width, 150, -1)
        let smallCactus = new Obstacle(25, 42, smallCac, canvas.width, 260, 0)
        let largeCactus = new Obstacle(65, 52, largeCac, canvas.width, 250, 0)
        let bigCactus = new Obstacle(35, 52, bigCac, canvas.width, 250, 0)
        allObstacles.push(bigCactus, largeCactus, smallCactus, flyingObstacle)
        let randomObstacle = Math.floor(Math.random() * allObstacles.length)
        obstacles.push(allObstacles[randomObstacle])
    }
    requestAnimationFrame(updateObstacles);
}

// Dimensions and draw positions of the dinosaur, also defines the Y position of the ground.
let dino = {
  x: 64,
  y: 240,
  width: 64,
  height: 64,
  speedY: 0,
  ground: 240,
  gravity: 0.25,
};

// sets the first image of the dino (with the right leg down) as well as the frameInterval(how fast it's running).
let currentDinoImage = dinoRight;
let frameCount = 0;
const frameInterval = 16;

// creates the background object
let background = {
  img: bgImage,
  x: 0,
  y: 100,
  speedX: -4,
  move: function () {
    this.x += this.speedX;
    if (this.x <= -this.img.width) {
      this.x = 0;
    }
  },
  draw: function () {
    context.drawImage(this.img, this.x, this.y);
    context.drawImage(this.img, this.x + this.img.width, this.y);
  },
};

// Dino jump mechanic.
function dinoJump(e) {
  if (e.code == "Space" && dino.y === dino.ground) {
    dino.speedY = -7.5;
  }
}

//creat a point system and show on canvas
function calculatePoint(){
  let points = 0;
  points = Math.floor(frameCount/8);
  context.font  = "18px sans-serif";
  context.fillStyle = "black";
  context.fillText(`Score: ${points}`, 480, 60);
  return points
}

function updateGame() {
  dino.speedY += dino.gravity;
  dino.y = Math.min(dino.y + dino.speedY, dino.ground);
  background.move();

  context.clearRect(0, 0, canvas.width, canvas.height);
  frameCount++;
  background.draw();

  if (frameCount % frameInterval === 0) {
    if (currentDinoImage === dinoRight) {
      currentDinoImage = dinoLeft;
    } else {
      currentDinoImage = dinoRight;
    }
  }
  context.drawImage(currentDinoImage, dino.x, dino.y, dino.width, dino.height);
  calculatePoint();
  requestAnimationFrame(updateGame);
}

dinoRight.addEventListener("load", () => {
  updateGame();
  updateObstacles();
});

// event listener that waits for the space button to get pressed, causing the dino to jump
document.addEventListener("keydown", dinoJump);