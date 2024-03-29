/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
ctx.font = "bold 48px serif";

class BG {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.image = new Image();
    this.width = 2123;
    this.image.src = "./sky.jpg";
  }
  update() {
    if (this.x < -2140) this.x = 0;
    else this.x -= 3;
  }
  show() {
    ctx.drawImage(this.image, this.x, 0);
  }
}

class Enemy {
  constructor() {
    this.image = new Image();
    this.image.src = "./enemy.png";
    this.frame = 0;
    this.width = 250;
    this.height = 200;
    this.angle = Math.random() * 180;
    this.scale = Math.random() * 0.7 + 0.3;
    this.x = canvas.width;
    this.y = Math.floor(Math.random() * (canvas.height - this.height));
    this.removable = false;
  }
  remove() {
    this.removable = true;
  }
  update() {
    this.x -= 2;
    this.angle = (this.angle + 3) % 360;
    this.y += Math.sin((this.angle * Math.PI) / 180);
    this.frame = this.frame === 14 ? 0 : this.frame + 1;
    if (this.x + this.width * this.scale < 0) this.remove();
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
    enemies.forEach((enemy) => {
      if (
        !(
          enemy.x + enemy.width < this.x ||
          enemy.x > this.x + this.width ||
          enemy.y + enemy.height < this.y ||
          enemy.y > this.y + this.height
        )
      ) {
        gameOver = true;
        return;
      }
    });
    this.frame = this.frame === 14 ? 0 : this.frame + 1;
  }
  getHeroLipPos() {
    return {
      x: this.x + this.width,
      y: this.y + this.height * 0.5,
    };
  }
  move(y) {
    this.y = y - this.height * 0.5;
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
      this.width,
      this.height
    );
  }
}
class Bullet {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
    this.xSpeed = 7;
    this.ySpeed = 1;
    this.image = new Image();
    this.image.src = "./bullet.png";
    this.removable = false;
    this.blasting = false;
    this.frame = 0;
    this.frameSizeX = 300;
    this.frameSizeY = 288;
  }
  hit() {
    enemies.forEach((enemy) => {
      if (
        !(
          enemy.x + enemy.width < this.x ||
          enemy.x > this.x + this.width ||
          enemy.y + enemy.height < this.y ||
          enemy.y > this.y + this.height
        )
      ) {
        this.blasting = true;
        enemy.remove();
        score++;
        return;
      }
    });
  }
  update() {
    if (!this.blasting) {
      this.xSpeed *= 0.997;
      this.ySpeed *= 1.01;
      this.x += 10;
      this.y += 0.5;
      if (this.x > canvas.width) this.removable = true;
    } else {
      this.frame++;
    }
  }
  show() {
    if (!this.blasting) {
      ctx.drawImage(
        this.image,
        100,
        100,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } else {
      ctx.drawImage(
        this.image,
        this.frameSizeX * this.frame,
        0,
        this.frameSizeX,
        this.frameSizeY,
        this.x,
        this.y,
        this.frameSizeX,
        this.frameSizeY
      );
      if (this.frame > 10) this.removable = true;
    }
  }
}

const hero = new Hero();
const bg = new BG();

let enemies = [];
let bullets = [];

let gameFrame = 0;
let newEnemyFrequency = 120;
let score = 0;
let gameOver = false;

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bg.update();
  bg.show();
  
  ctx.fillText(score, 100, 100);

  gameFrame = Math.floor((gameFrame + 1) % newEnemyFrequency);
  if (gameFrame === 1) {
    enemies.push(new Enemy());
  }

  bullets = bullets.filter((e) => !e.removable);

  bullets.forEach((bullet) => {
    bullet.update();
    bullet.hit(enemies);
    bullet.show();
  });

  enemies = enemies.filter((e) => !e.removable);

  enemies.forEach((enemy) => {
    enemy.update();
    enemy.show();
  });

  hero.update();
  hero.show();

  if (!gameOver) requestAnimationFrame(animate);
  else {
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.clearRect(
      canvas.width / 4,
      canvas.height / 10,
      canvas.width / 2,
      canvas.height / 5
    );
    ctx.fillStyle = "black";
    ctx.strokeRect(
      canvas.width / 4,
      canvas.height / 10,
      canvas.width / 2,
      canvas.height / 5
    );
    ctx.fillText("Game Over", canvas.width / 2, 50 + canvas.height / 7);
    ctx.fillText("Score: " + score, canvas.width / 2, 150 + canvas.height / 7);
  }
}

canvas.addEventListener("mousemove", (e) => {
  hero.move(e.clientY);
});
canvas.addEventListener("mouseup", () => {
  bullets.push(new Bullet(hero.getHeroLipPos()));
});

animate();
