/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
ctx.font = "bold 48px serif";

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText("Text", 100, 100);
}

animate();
