/* ── Nav scroll shadow ─────────────────────────── */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ── Particle canvas ───────────────────────────── */
(function () {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles, mouse = { x: null, y: null };

  const COLORS = ['#22d3ee', '#a78bfa', '#f472b6'];
  const COUNT  = 80;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    reset() {
      this.x    = rand(0, W);
      this.y    = rand(0, H);
      this.r    = rand(0.8, 2.5);
      this.vx   = rand(-0.3, 0.3);
      this.vy   = rand(-0.3, 0.3);
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = rand(0.3, 0.9);
      this.da   = rand(-0.003, 0.003);
    }
    constructor() { this.reset(); }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha += this.da;
      if (this.alpha < 0.1 || this.alpha > 0.9) this.da *= -1;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;

      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x += dx / dist * 1.5;
          this.y += dy / dist * 1.5;
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
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.save();
          ctx.globalAlpha = (1 - d / 120) * 0.18;
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth   = 0.6;
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

  window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });
  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
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

    let delay = deleting ? 60 : 100;
    if (!deleting && ci > word.length)  { delay = 1800; deleting = true; }
    if (deleting  && ci < 0)            { deleting = false; ci = 0; ri = (ri + 1) % roles.length; delay = 300; }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 800);
})();

/* ── Scroll reveal ─────────────────────────────── */
(function () {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ── Skill bar animation ───────────────────────── */
(function () {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target.querySelector('.skill-bar-fill');
        if (fill) fill.style.width = fill.dataset.pct + '%';
        observer.unobserve(e.target);
      }
    }),
    { threshold: 0.3 }
  );
  document.querySelectorAll('.skill-card').forEach(c => observer.observe(c));
})();

/* ── Active nav link on scroll ─────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--cyan)' : '';
    });
  }, { passive: true });
})();

/* ── Stagger reveal delay ──────────────────────── */
document.querySelectorAll('.skills-grid .skill-card, .projects-grid .project-card')
  .forEach((el, i) => el.style.transitionDelay = `${i * 0.07}s`);
