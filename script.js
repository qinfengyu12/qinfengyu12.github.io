// 获取页面元素
const countdownElement = document.getElementById('countdown');
const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');

// 设置画布尺寸
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 获取当前时间
const now = new Date();
// 设置目标时间为次年1月1日0点0分0秒
const targetDate = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);

// 烟花粒子数组
const particles = [];

// 烟花类
function Firework(x, y, hue) {
  this.x = x;
  this.y = y;
  this.hue = hue;
  this.exploded = false;
  this.particles = [];
  this.lifespan = 200;
  this.age = 0;

  this.update = function () {
    if (!this.exploded) {
      this.y -= 4;
      if (this.y < canvas.height / 2) {
        this.explode();
      }
    } else {
      this.age++;
      if (this.age < this.lifespan) {
        for (let i = 0; i < this.particles.length; i++) {
          this.particles[i].update();
        }
      }
    }
  };

  this.explode = function () {
    const numParticles = 100;
    for (let i = 0; i < numParticles; i++) {
      const p = new Particle(this.x, this.y, this.hue);
      this.particles.push(p);
    }
    this.exploded = true;
  };

  this.draw = function () {
    if (!this.exploded) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
      ctx.fill();
    } else {
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].draw();
      }
    }
  };
}

// 粒子类
function Particle(x, y, hue) {
  this.x = x;
  this.y = y;
  this.hue = hue;
  this.vx = (Math.random() - 0.5) * 6;
  this.vy = (Math.random() - 0.5) * 6;
  this.size = Math.random() * 3 + 1;
  this.alpha = 1;

  this.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.01;
  };

  this.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
    ctx.fill();
  };
}

function createFirework() {
  const x = Math.random() * canvas.width;
  const y = canvas.height;
  const hue = Math.random() * 360;
  return new Firework(x, y, hue);
}

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  countdownElement.innerHTML = `距离跨年还有：${days}天 ${hours}小时 ${minutes}分钟 ${seconds}秒`;

  if (diff <= 0) {
    countdownElement.innerHTML = "新年快乐呀！🎉";
    clearInterval(interval);
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 定期创建新烟花
  if (Math.random() < 0.05) {
    const firework = createFirework();
    particles.push(firework);
  }

  // 更新和绘制烟花
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].age >= particles[i].lifespan) {
      particles.splice(i, 1);
    }
  }

  updateCountdown();
}

const interval = setInterval(updateCountdown, 1000);
requestAnimationFrame(animate);
