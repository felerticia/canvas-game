/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
ctx.font = "bold 48px serif";

class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = "./enemy.png";
    this.frame = 0;
    this.width = 250;
    this.height = 200;
    this.angle = 0;
    this.scale = Math.random() * 0.7 + 0.3;
    this.x = canvas.width;
    this.y = Math.floor(Math.random() * (canvas.height - this.height));
  }
  update() {
    this.x -= 2;
    this.angle = (this.angle + 3) % 360;
    this.y += Math.sin((this.angle * Math.PI) / 180);
    this.frame = this.frame === 14 ? 0 : this.frame + 1;
  }

  show() {
    ctx.drawImage(
      this.image,
      this.frame * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width * this.scale,
      this.height * this.scale
    );
    ctx.strokeRect(
      this.x,
      this.y,
      this.width * this.scale,
      this.height * this.scale
    );
    ctx.fillText(`${this.y}`, 500, 200);
  }
}
class Hero {
  constructor() {
    this.image = new Image();
    this.image.src = "./hero.png";
    this.width = 200;
    this.height = 156;
    this.x = 50;
    this.y = 100;
    this.frame = 0;
  }
  update() {
    this.frame = this.frame === 14 ? 0 : this.frame + 1;
  }
  move(y) {
    this.y = y - this.height * 0.5;
  }
  show() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.width,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

const hero = new Hero();
const enemy = new Enemy();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  enemy.update();
  enemy.show();

  hero.update();
  hero.show();

  requestAnimationFrame(animate);
}

canvas.addEventListener("mousemove", (e) => {
  hero.move(e.clientY);
});

animate();
