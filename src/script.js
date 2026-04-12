/* ── Nav scroll shadow ─────────────────────────── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Full-page particle canvas ─────────────────── */
(function () {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;
  let mouse = { x: null, y: null };

  const COLORS = ['#22d3ee', '#a78bfa', '#818cf8'];
  const COUNT  = 110;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    reset(fullReset) {
      this.x     = rand(0, W);
      this.y     = fullReset ? rand(0, H) : rand(-50, H + 50);
      this.r     = rand(0.7, 2.2);
      this.vx    = rand(-0.25, 0.25);
      this.vy    = rand(-0.22, 0.22);
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = rand(0.2, 0.75);
      this.da    = rand(-0.002, 0.002);
    }
    constructor() { this.reset(true); }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha += this.da;
      if (this.alpha < 0.08 || this.alpha > 0.75) this.da *= -1;
      if (this.x < -5)  this.x = W + 5;
      if (this.x > W+5) this.x = -5;
      if (this.y < -5)  this.y = H + 5;
      if (this.y > H+5) this.y = -5;

      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          const force = (110 - d) / 110;
          this.x += dx / d * force * 2;
          this.y += dy / d * force * 2;
        }
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function drawConnections() {
    const len = particles.length;
    for (let i = 0; i < len; i++) {
      for (let j = i + 1; j < len; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = dx * dx + dy * dy;
        if (d < 13000) {  // ~114px
          const dist = Math.sqrt(d);
          ctx.save();
          ctx.globalAlpha = (1 - dist / 114) * 0.14;
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); }, { passive: true });
  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
  }, { passive: true });
  document.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  resize();
  initParticles();
  loop();
})();

/* ── Typewriter ────────────────────────────────── */
(function () {
  const roles = [
    'Data Scientist',
    'ML Engineer',
    'Fairness Researcher',
    'Python Developer',
  ];
  const el = document.querySelector('.typed-text');
  if (!el) return;
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const word = roles[ri];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    let delay = deleting ? 55 : 95;
    if (!deleting && ci > word.length)  { delay = 2000; deleting = true; }
    if (deleting  && ci < 0)            { deleting = false; ci = 0; ri = (ri + 1) % roles.length; delay = 350; }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 900);
})();

/* ── Scroll reveal ─────────────────────────────── */
(function () {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.1 }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ── Skill bar animation ───────────────────────── */
(function () {
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target.querySelector('.skill-bar-fill');
        if (fill) fill.style.width = fill.dataset.pct + '%';
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.25 }
  );
  document.querySelectorAll('.skill-card').forEach(c => io.observe(c));
})();

/* ── Active nav highlight on scroll ───────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 130) current = s.id;
    });
    links.forEach(a => {
      const active = a.getAttribute('href') === `#${current}`;
      a.style.color = active ? 'var(--cyan)' : '';
    });
  }, { passive: true });
})();

/* ── Stagger animation delays ──────────────────── */
document.querySelectorAll('.skills-grid .skill-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.06}s`;
});
document.querySelectorAll('.projects-grid .project-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.08}s`;
});
