const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const velocityInput = document.getElementById('velocity');
const angleInput = document.getElementById('angle');
const gravityInput = document.getElementById('gravity');
const timeOutput = document.getElementById('time');
const maxHeightOutput = document.getElementById('maxHeight');
const distanceOutput = document.getElementById('distance');
const exitButton = document.getElementById('exit');

const exitSound = new Audio('sonido.mp3');
const startSound = new Audio('eleccionfig.mp3');
const pauseSound = new Audio('seleccion.mp3');
const resetSound = new Audio('seleccion.mp3');

canvas.width = 600;
canvas.height = 400;

let animationFrame;
let isRunning = false;
let projectile = {};
let time = 0;

function initializeProjectile() {
  const velocity = parseFloat(velocityInput.value);
  const angle = parseFloat(angleInput.value) * (Math.PI / 180);
  const gravity = parseFloat(gravityInput.value);

  projectile = {
    x: 50,
    y: canvas.height - 50,
    velocityX: velocity * Math.cos(angle),
    velocityY: -velocity * Math.sin(angle),
    gravity: gravity,
    path: [],
  };

  time = 0;
  maxHeightOutput.textContent = "0.0";
  distanceOutput.textContent = "0.0";
}

function updateProjectile() {
  time += 0.02;
  projectile.x += projectile.velocityX * 0.02;
  projectile.velocityY += projectile.gravity * 0.02;
  projectile.y += projectile.velocityY * 0.02;

  projectile.path.push({ x: projectile.x, y: projectile.y });

  if (projectile.y >= canvas.height - 50) {
    projectile.y = canvas.height - 50;
    stopSimulation();
  }

  maxHeightOutput.textContent = Math.max(
    canvas.height - projectile.y,
    parseFloat(maxHeightOutput.textContent)
  ).toFixed(1);

  distanceOutput.textContent = (projectile.x - 50).toFixed(1);
  timeOutput.textContent = time.toFixed(1);
}

function drawProjectile() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "gray";
  ctx.fillRect(20, canvas.height - 50, 30, 30);

  ctx.beginPath();
  projectile.path.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(projectile.x, projectile.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
}

function simulate() {
  if (!isRunning) return;

  updateProjectile();
  drawProjectile();

  animationFrame = requestAnimationFrame(simulate);
}

function startSimulation() {
  if (isRunning) return;

  startSound.play(); // Reproducir el sonido al iniciar
  initializeProjectile();
  isRunning = true;
  startButton.disabled = true;
  pauseButton.disabled = false;
  resetButton.disabled = false;

  simulate();
}

function stopSimulation() {
  isRunning = false;
  cancelAnimationFrame(animationFrame);
  pauseSound.play(); // Reproducir el sonido al pausar
  startButton.disabled = false;
  pauseButton.disabled = true;
}

function resetSimulation() {
  resetSound.play(); // Reproducir el sonido al reiniciar
  stopSimulation();
  projectile = {};
  time = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  timeOutput.textContent = "0.0";
  maxHeightOutput.textContent = "0.0";
  distanceOutput.textContent = "0.0";

  resetButton.disabled = true;
}

exitButton.addEventListener('click', () => {
  exitSound.play(); // Reproducir el sonido al salir

  const confirmExit = window.confirm("¿Estás seguro de que deseas salir?");
  if (confirmExit) {
    window.location.href = 'index.html';
  }
});

startButton.addEventListener('click', startSimulation);
pauseButton.addEventListener('click', stopSimulation);
resetButton.addEventListener('click', resetSimulation);
