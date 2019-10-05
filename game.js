function reset() {
  location.reload();
}

let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
ctx.font = "30px Arial";

canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let score = 0;
let craftX = 100;
let craftY = 100;
let keysDown = {};
let elapsedTime = 0;
let startTime = Date.now();
let aimX = canvas.width / 2;
let aimY = canvas.height / 2;
const SECONDS_PER_ROUND = 30;
let fxReady, fxImage, shouldShowFX;
let bgReady, aimReady, craftReady, craft1Ready;
let bgImage, aimImage, craftImage, craft1Image;

let lst = [
  "images/Ship01.png",
  "images/Ship02.png",
  "images/Ship03.png",
  "images/Ship04.png",
  "images/Ship05.png",
  "images/Ship06.png"
];
let item = lst[Math.floor(Math.random() * lst.length)];

// let user submit username
function submitName() {
  let userInputName = document.getElementById("nameInput").value;

  let player = document.getElementById("playerName");
  player.innerHTML = `G'day, ${userInputName || "Obi Wan Kenobi"}!`
  document.getElementById("highScore").innerHTML = `Highest Score: ${
    getAppState().currentHighScore}`;
  document.getElementById("currentUser").innerHTML = `Captain: ${userInputName|| "Obi Wan Kenobi"}`
  closeForm("myForm");
}

// close form after submission
function closeForm(element) {
  document.getElementById(element).style.display = "none";
}

// submit button
let submitButton = document.getElementById("submitBtn");
submitButton.addEventListener("click", submitName);

function setupGame() {
  loadImages();
  setupKeyboardListeners();
}

// Get Old Session Object of create a new if this is a new user

function getOldSession() {
  let GetCurrentSession = localStorage.getItem("PreviousSession")
  if (GetCurrentSession == null) {
    CurrentSession = {
      isGameOver: false,
      Top1: {
        user: "Garfield", score: 1
      },
      highScopes: []
    }
    localStorage.setItem("PreviousSession", JSON.stringify(CurrentSession))
  } else {
    CurrentSession = JSON.parse(GetCurrentSession)
    CurrentSession.isGameOver = false;
  }
}

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function() {
    bgReady = true;
  };
  bgImage.src = "images/backgroundsky.png";
  aimImage = new Image();
  aimImage.onload = function() {
    aimReady = true;
  };
  aimImage.src = "images/aim_V3.png";

  craftImage = new Image();
  craftImage.onload = function() {
    craftReady = true;
  };
  
  craftImage.src = item;
  
  fxImage = new Image();
  fxImage.onload = function() {
    fxReady = true;
  };

  fxImage.src = "images/FX.png";

  gameOverImage = new Image();
  gameOverImage.onload = function() {
    gameOverImageReady = true;
  };

  gameOverImage.src = "images/message_gameover.png";
}

function getAppState() {
  return (
    JSON.parse(localStorage.getItem("appState")) || {
      gameHistory: [],
      currentHighScore: 0,
      currentUser: document.getElementById("currentUser") || "Obi Wan Kenobi"
    }
  );
}

function save(appState) {
  return localStorage.setItem("appState", JSON.stringify(appState));
}

function setupKeyboardListeners() {
  addEventListener(
    "keydown",
    function(key) {
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function(key) {
      delete keysDown[key.keyCode];
    },
    false
  );
}

function updateMonterPos() {
  craftX = Math.floor(Math.random() * 400 - 10 + 1) + 10;
  craftY = Math.floor(Math.random() * 400 - 10 + 1) + 10;
}

function move() {
  if (38 in keysDown) {
    aimY -= 5;
  }
  if (40 in keysDown) {
    aimY += 5;
  }
  if (37 in keysDown) {
    aimX -= 5;
  }
  if (39 in keysDown) {
    aimX += 5;
  }
}

function wrapAround() {
  if (aimX <= 0) {
    aimX = canvas.width - 10;
  }

  if (aimX >= canvas.width) {
    aimX = 0;
  }

  if (aimY <= 0) {
    aimY = canvas.height - 10;
  }

  if (aimY >= canvas.height) {
    aimY = 0;
  }
}

function checkIfTargetedCraft() {
  const spacecraftTargeted =
    aimX <= craftX + 32 &&
    craftX <= aimX + 32 &&
    aimY <= craftY + 32 &&
    craftY <= aimY + 32;
  if (spacecraftTargeted) {
    score += 1;
    shootFX();
    
    craftImage.src = lst[Math.floor(Math.random() * lst.length)];

    const appState = getAppState();
    const newHighScore = appState.currentHighScore < score;


    if (newHighScore) {
      appState.currentHighScore = score;
      save(appState);
      document.getElementById("highScore").innerHTML = `Highest Score: ${score}`;
    }
    document.getElementById("score").innerHTML = `Scores: ${score}`;

    let userInputName = document.getElementById("nameInput").value;
    let currentUser = appState.currentUser = userInputName;
    save(appState);
    document.getElementById("currentUser").innerHTML = `Captain: ${currentUser || "Obi Wan Kenobi"}`;
  }
}

let update = function() {
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  if(ela)
  move();
  wrapAround();
  checkIfTargetedCraft();
};

function shootFX() {
  showExplosion()
  moveSpaceCraft()
}

function showExplosion() {
  explosionXY = {
    x: craftX,
    y: craftY
  }
  shouldShowFX = true
  setTimeout(() => shouldShowFX = false, 100)
}

function moveSpaceCraft() {
  craftX = Math.floor(Math.random() * canvas.width - 10);
  craftY = Math.floor(Math.random() * canvas.height - 10);
}

function hitCraft() {
  craftImage = fxImage;
}

let render = function() {
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px 'Turret Road'";

  if (!isGameOver) {
    if (bgReady) {
      ctx.drawImage(bgImage, 0, 0);
    }
    if (aimReady) {
      ctx.drawImage(aimImage, aimX, aimY);
    }
    if (craftReady) {
      ctx.drawImage(craftImage, craftX, craftY);
    }

    if (shouldShowFX) {
      console.log('shouldShowFX', shouldShowFX)
      ctx.drawImage(fxImage, explosionXY.x, explosionXY.y);
    }

    document.getElementById("seconds").innerHTML = `Timer: ${SECONDS_PER_ROUND -
      elapsedTime}`;
  } else {
    ctx.drawImage(gameOverImage, 300, 300);
    isGameOver = true;
  }
};

let main = function() {
  update();
  render();

  if (!isGameOver) {
    requestAnimationFrame(main);
  }
};

let w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

setupGame();
main();