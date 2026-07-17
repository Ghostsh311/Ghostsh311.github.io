/* ============================================================
   GhostShell Network — Main JavaScript
   Particles · typewriter · carousel · counters · easter egg ·
   dark mode · terminal CLI · and more.
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. Custom Cursor
  // ============================================================
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (dot && ring && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .skill-tag, .btn, .service-card, .project-card, .team-card')
      .forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
      });

    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
  }

  // ============================================================
  // 2. Particle Network
  // ============================================================
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      const hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.color = ['#00f5ff', '#ff00e4', '#b3ff00', '#39ff14'][Math.floor(Math.random() * 4)];
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    function initParticles() {
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 120);
      particles = Array.from({ length: count }, () => new Particle());
    }

    function drawConnections() {
      const maxDist = 150;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.4;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    initParticles();
    animateParticles();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resizeCanvas(); initParticles(); }, 200);
    });
  }

  // ============================================================
  // 3. Typewriter
  // ============================================================
  const typewriterLine = document.getElementById('typewriterLine');
  if (typewriterLine) {
    const phrases = [
      'GhostShell Network_',
      'Break Things. Fix Things.',
      'Hack the Planet.',
      'Red Team Ops Active.',
      'Ghosts in the Wire.',
    ];
    let phraseIndex = 0, charIndex = 0, isDeleting = false;

    function typeWriter() {
      const current = phrases[phraseIndex];
      let speed;
      if (!isDeleting) {
        typewriterLine.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(typeWriter, 2000);
          return;
        }
        speed = 80 + Math.random() * 40;
      } else {
        typewriterLine.textContent = current.substring(0, charIndex);
        charIndex--;
        if (charIndex < 0) {
          isDeleting = false;
          charIndex = 0;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typeWriter, 500);
          return;
        }
        speed = 30 + Math.random() * 20;
      }
      setTimeout(typeWriter, speed);
    }
    setTimeout(typeWriter, 600);
  }

  // ============================================================
  // 4. Navbar
  // ============================================================
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('navHamburger');
  const navMenu = document.getElementById('navMenu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================================
  // 5. Scroll Progress
  // ============================================================
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = docHeight > 0 ? (window.scrollY / docHeight) * 100 + '%' : '0%';
    }, { passive: true });
  }

  // ============================================================
  // 6. Scroll to Top
  // ============================================================
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ============================================================
  // 7. Dark / Light Mode
  // ============================================================
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ghostshell-theme', theme);
    if (themeIcon) themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }
  setTheme(localStorage.getItem('ghostshell-theme') || 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ============================================================
  // 8. Reveal Observer
  // ============================================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ============================================================
  // 9. Counters
  // ============================================================
  let countersAnimated = false;
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        document.querySelectorAll('[data-target]').forEach(el => {
          const target = parseInt(el.getAttribute('data-target'));
          const duration = 2000;
          const start = performance.now();
          function update(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (p < 1) requestAnimationFrame(update);
            else el.textContent = target.toLocaleString();
          }
          requestAnimationFrame(update);
        });
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const counterSection = document.querySelector('.about-counters');
  if (counterSection) counterObserver.observe(counterSection);

  // ============================================================
  // 10. Hero Stats
  // ============================================================
  const heroStatsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.hero-stat [data-count]').forEach(el => {
          const target = parseInt(el.getAttribute('data-count'));
          const duration = 2000;
          const start = performance.now();
          function update(now) {
            const p = Math.min((now - start) / duration, 1);
            el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
            if (p < 1) requestAnimationFrame(update);
            else el.textContent = target.toLocaleString();
          }
          requestAnimationFrame(update);
        });
        heroStatsObs.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroStatsObs.observe(heroStats);

  // ============================================================
  // 11. Skill Bars
  // ============================================================
  const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar-fill').forEach(fill => {
          const parent = fill.closest('.skill-bar-item');
          const percentEl = parent.querySelector('.skill-bar-percent');
          fill.style.width = (parseInt(percentEl.getAttribute('data-width')) || 0) + '%';
        });
        skillBarObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const skillBars = document.querySelector('.skills-bars');
  if (skillBars) skillBarObserver.observe(skillBars);

  // ============================================================
  // 12. Testimonial Carousel
  // ============================================================
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testDots');
  const prevBtn = document.getElementById('testPrev');
  const nextBtn = document.getElementById('testNext');

  if (track && dotsContainer) {
    const slides = track.querySelectorAll('.testimonial-slide');
    let currentIndex = 0;
    let autoPlayInterval;

    function updateDots() {
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    }

    function nextSlide() { goToSlide((currentIndex + 1) % slides.length); }
    function prevSlide() { goToSlide((currentIndex - 1 + slides.length) % slides.length); }

    function startAutoPlay() { stopAutoPlay(); autoPlayInterval = setInterval(nextSlide, 5000); }
    function stopAutoPlay() { clearInterval(autoPlayInterval); }

    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoPlay(); });

    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
      let touchStartX = 0;
      carousel.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; stopAutoPlay(); }, { passive: true });
      carousel.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
        startAutoPlay();
      }, { passive: true });
    }

    updateDots();
    startAutoPlay();
  }

  // ============================================================
  // 13. Contact Form
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmit');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      if (submitBtn) submitBtn.classList.add('loading');

      const fields = [
        { id: 'formName', error: 'Name is required' },
        { id: 'formEmail', error: 'Valid email is required', validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
        { id: 'formSubject', error: 'Subject is required' },
        { id: 'formMessage', error: 'Message is required' },
      ];

      fields.forEach(({ id, error, validate }) => {
        const input = document.getElementById(id);
        const group = input.closest('.form-group');
        const errorEl = group.querySelector('.form-error');
        const value = input.value.trim();
        const valid = !validate ? value.length > 0 : validate(value);
        group.classList.toggle('error', !valid);
        errorEl.textContent = valid ? '' : error;
        if (!valid) isValid = false;
      });

      if (submitBtn) setTimeout(() => submitBtn.classList.remove('loading'), 600);

      if (formStatus) {
        if (isValid) {
          formStatus.className = 'form-status success';
          formStatus.textContent = '✓ Encrypted message transmitted. Our team will respond within 24 hours.';
          contactForm.reset();
        } else {
          formStatus.className = 'form-status error';
          formStatus.textContent = '✗ Transmission failed. Please check the fields and try again.';
        }
      }
    });

    contactForm.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => {
        const group = el.closest('.form-group');
        if (group) {
          group.classList.remove('error');
          const errorEl = group.querySelector('.form-error');
          if (errorEl) errorEl.textContent = '';
        }
      });
    });
  }

  // ============================================================
  // 14. PGP Copy
  // ============================================================
  const copyPgpBtn = document.getElementById('copyPgp');
  if (copyPgpBtn) {
    copyPgpBtn.addEventListener('click', () => {
      const keyText = '-----BEGIN PGP PUBLIC KEY BLOCK-----\nxjMEX/T/cRYJKwYBBAHaRw8BAQdAB7iT0eP9cCf8K2p...\n-----END PGP PUBLIC KEY BLOCK-----';
      navigator.clipboard.writeText(keyText).then(copied, () => {
        const ta = document.createElement('textarea');
        ta.value = keyText;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        copied();
      });
      function copied() {
        copyPgpBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => { copyPgpBtn.innerHTML = '<i class="fas fa-copy"></i> Copy'; }, 2000);
      }
    });
  }

  // ============================================================
  // 15. Footer Year
  // ============================================================
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  // ============================================================
  // 16. Status Bar
  // ============================================================
  const statusBarText = document.getElementById('statusBarText');
  if (statusBarText) {
    const startTime = Date.now();
    function updateStatusBar() {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
      const s = String(elapsed % 60).padStart(2, '0');
      statusBarText.textContent = `Session: Active | IP: 10.0.0.${Math.floor(Math.random() * 255)} | Uptime: ${h}:${m}:${s}`;
    }
    updateStatusBar();
    setInterval(updateStatusBar, 1000);
  }

  // ============================================================
  // 17. Hacker Quotes
  // ============================================================
  const quoteEl = document.getElementById('hackerQuote');
  if (quoteEl) {
    const quotes = [
      '"The only secure system is the one that\'s powered off and buried in concrete."',
      '"Hackers are the immune system of the information age."',
      '"There is no patch for human stupidity."',
      '"Encryption works. Properly implemented strong crypto systems are one of the few things you can rely on."',
      '"The quieter you become, the more you can hear."',
      '"In the real world, you can\'t just reboot a system and have it come back up."',
      '"The internet is the first thing humanity has built that it doesn\'t understand."',
      '"Privacy is not secrecy. It\'s the power to control what others know about you."',
      '"Every system has a vulnerability. It\'s just a matter of finding it."',
    ];
    let qIndex = 0;
    setInterval(() => {
      qIndex = (qIndex + 1) % quotes.length;
      quoteEl.style.opacity = '0';
      setTimeout(() => { quoteEl.textContent = quotes[qIndex]; quoteEl.style.opacity = '1'; }, 400);
    }, 8000);
  }

  // ============================================================
  // 18. Easter Egg
  // ============================================================
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) { konamiIndex = 0; triggerEasterEgg(); }
    } else {
      konamiIndex = e.key === 'ArrowUp' ? 1 : 0;
    }
  });

  let ghostTyped = '';
  document.addEventListener('keydown', (e) => {
    if (e.key.length === 1) {
      ghostTyped += e.key.toLowerCase();
      if (ghostTyped.includes('ghost')) { ghostTyped = ''; triggerEasterEgg(); }
      if (ghostTyped.length > 10) ghostTyped = ghostTyped.slice(-5);
    }
  });

  console.log('%c\u{1F47B} GhostShell Network %c\u{1F47B}', 'font-size:24px; color:#00f5ff;', 'font-size:14px; color:#ff00e4;');
  console.log('%cType "ghost" to find the hidden terminal...', 'color:#b3ff00; font-size:12px;');

  function triggerEasterEgg() {
    const overlay = document.getElementById('easterEggOverlay');
    if (!overlay || overlay.classList.contains('active')) return;
    overlay.classList.add('active');
    const easterTyping = document.querySelector('.typing-easter');
    if (easterTyping) {
      const msgs = ['Access granted. Ghost protocol initiated.', 'Welcome back, operator.', 'The ghosts are watching...', 'You found the secret. Well played.'];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      let idx = 0;
      easterTyping.textContent = '';
      function typeMsg() { if (idx < msg.length) { easterTyping.textContent += msg[idx]; idx++; setTimeout(typeMsg, 50); } }
      typeMsg();
    }
    document.getElementById('easterEggClose').addEventListener('click', closeEasterEgg);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeEasterEgg(); });
  }

  function closeEasterEgg() {
    const overlay = document.getElementById('easterEggOverlay');
    if (overlay) overlay.classList.remove('active');
  }

  // ============================================================
  // 19. Parallax
  // ============================================================
  window.addEventListener('scroll', () => {
    const particles = document.querySelector('.hero-canvas');
    if (particles) particles.style.transform = `translateY(${window.scrollY * 0.15}px)`;
  }, { passive: true });

  // ============================================================
  // 20. Status Dot Changes
  // ============================================================
  const statusText = document.getElementById('statusText');
  if (statusText) {
    const statuses = [
      { text: '\u{1F7E2} All systems operational', color: '#39ff14' },
      { text: '\u{1F7E1} Degraded performance', color: '#ff7700' },
      { text: '\u{1F534} Critical alert', color: '#ff3355' },
    ];
    setInterval(() => {
      const r = Math.random();
      const status = r < 0.85 ? statuses[0] : r < 0.95 ? statuses[1] : statuses[2];
      statusText.textContent = status.text;
      const dot = document.querySelector('.status-dot');
      if (dot) { dot.style.background = status.color; dot.style.boxShadow = `0 0 8px ${status.color}`; }
    }, 15000);
  }

  // ============================================================
  // 21. Smooth Scroll
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight : 70;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // 22. Glitch refresh
  // ============================================================
  document.querySelectorAll('[data-glitch]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.animation = 'none';
      void el.offsetHeight;
      el.style.animation = '';
    });
  });

  // ============================================================
  // 23. TERMINAL OVERLAY (Fake CLI)
  // ============================================================
  const terminalToggle = document.getElementById('terminalToggle');
  const terminalOverlay = document.getElementById('terminalOverlay');
  const terminalInput = document.getElementById('terminalInput');
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalBody = document.getElementById('terminalBody');
  const terminalClose = document.getElementById('terminalClose');

  const commands = {
    help: { desc: 'Show this help', fn: () => {
      let out = 'Available commands:\n';
      for (const [cmd, data] of Object.entries(commands)) {
        out += `  ${cmd.padEnd(14)} ${data.desc}\n`;
      }
      return { text: out, className: 'info' };
    }},
    whoami: { desc: 'Display current user', fn: () => ({ text: 'root', className: 'success' }) },
    date: { desc: 'Show current date & time', fn: () => ({ text: new Date().toString(), className: '' }) },
    uptime: { desc: 'Show system uptime', fn: () => {
      const s = Math.floor((Date.now() - performance.now()) / 1000);
      return { text: `up ${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m ${s % 60}s`, className: '' };
    }},
    neofetch: { desc: 'Display system info', fn: () => ({
      text: `OS: GhostShell OS 3.7.1 x86_64\nHost: Phantom Blade Z690\nKernel: 6.8.0-ghost\nShell: /bin/zsh 9.0\nTerminal: GhostTerm v3.7\nCPU: Intel Core i9-13900K (32) @ 5.8GHz\nGPU: NVIDIA RTX 5090\nMemory: 128GB DDR5 @ 7200MHz`,
      className: 'success'
    })},
    'ls': { desc: 'List files', fn: () => ({
      text: 'total 42\ndrwxr-xr-x  2 root  root   4.0K Jan  1 00:00 .\ndrwxr-xr-x  3 root  root   4.0K Jan  1 00:00 ..\n-rw-r--r--  1 root  root   1.2K Jan  1 00:00 exploit.c\n-rw-r--r--  1 root  root   2.1K Jan  1 00:00 payload.elf\n-rw-r--r--  1 root  root     42 Jan  1 00:00 flag.txt\n-rwxr-xr-x  1 root  root   8.4K Jan  1 00:00 ./shell',
      className: 'info'
    })},
    'ls -la': { desc: 'List all files with details', fn: () => commands.ls.fn() },
    'cat flag.txt': { desc: 'Read the flag file', fn: () => ({ text: 'flag{gh0st_1n_th3_w1r3_2026}', className: 'success' }) },
    './exploit': { desc: 'Run the exploit', fn: () => ({
      text: '[+] Compiling payload...\n[+] Bypassing ASLR...\n[+] Escalating privileges...\n[+] Access granted. You are root.\n⚠️  This is a simulation. Real exploits require responsible disclosure.',
      className: 'warning'
    })},
    sudo: { desc: 'Fake sudo', fn: () => ({ text: 'Nice try, but you\'re already root.', className: '' }) },
    clear: { desc: 'Clear terminal', fn: () => ({ text: '__CLEAR__', className: '' }) },
    exit: { desc: 'Close terminal', fn: () => { closeTerminal(); return null; }},
    pwd: { desc: 'Print working directory', fn: () => ({ text: '/root/ghostshell', className: '' })},
    uname: { desc: 'Print system information', fn: () => ({ text: 'GhostShell OS 3.7.1 x86_64', className: '' })},
    echo: { desc: 'Echo text', fn: (args) => ({ text: args || '', className: '' })},
    id: { desc: 'Show user ID', fn: () => ({ text: 'uid=0(root) gid=0(root) groups=0(root)', className: 'success' })},
    ps: { desc: 'Process list', fn: () => ({
      text: 'PID  CMD\n  1  init\n 42  ./ghost_agent\n 99  ./packet_sniffer\n133  ./exploit_dev\n256  ./c2_listener',
      className: 'info'
    })},
    ssh: { desc: 'SSH client', fn: () => ({ text: 'ssh: connect to host ghostshell.net port 22: Connection refused', className: 'error' })},
    ping: { desc: 'Ping a host', fn: () => ({ text: 'PING ghostshell.net (10.0.0.1) 56(84) bytes of data.\n64 bytes from 10.0.0.1: icmp_seq=1 ttl=64 time=0.42ms\n64 bytes from 10.0.0.1: icmp_seq=2 ttl=64 time=0.38ms\n^C\n--- ghostshell.net ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss', className: 'success' })},
    nmap: { desc: 'Port scanner', fn: () => ({ text: 'Starting Nmap 7.95 ( https://nmap.org )\nNmap scan report for ghostshell.net\nPORT     STATE    SERVICE\n22/tcp   filtered SSH\n80/tcp   open     HTTP\n443/tcp  open     HTTPS\n1337/tcp open     WASTE\n4444/tcp open     Metasploit\n8080/tcp open     HTTP-Proxy\n\nNmap done: 1 IP address (1 host up) scanned in 3.42s', className: 'info' })},
    ifconfig: { desc: 'Network interfaces', fn: () => ({ text: 'eth0: flags=8863<UP,BROADCAST,RUNNING,SIMPLEX,MULTICAST>\n  inet 10.0.0.1 netmask 0xffffff00 broadcast 10.0.0.255\n  inet6 fe80::dead:beef:1337 prefixlen 64\nlo0: flags=8863<UP,LOOPBACK,RUNNING,MULTICAST>\n  inet 127.0.0.1 netmask 0xff000000', className: '' })},
    cowsay: { desc: 'Moo', fn: () => ({ text: '  ___________\n< moo >\n  -----------\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||', className: 'lime' })},
  };

  function openTerminal() {
    if (!terminalOverlay) return;
    terminalOverlay.classList.add('active');
    terminalOutput.innerHTML = '';
    addOutputLine('Welcome to GhostShell Terminal v3.7.1', 'info');
    addOutputLine('Type "help" for available commands.', '');
    addOutputLine('⚠️  Authorized personnel only. All activity is logged.', 'warning');
    setTimeout(() => { if (terminalInput) { terminalInput.focus(); }}, 100);
  }

  function closeTerminal() {
    if (terminalOverlay) terminalOverlay.classList.remove('active');
  }

  function addOutputLine(text, className) {
    if (!terminalOutput) return;
    const div = document.createElement('div');
    div.className = 'output-line' + (className ? ' ' + className : '');
    div.innerHTML = text.replace(/\n/g, '<br>');
    terminalOutput.appendChild(div);
    if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function processTerminalCommand(input) {
    const trimmed = input.trim();
    addOutputLine(`<span class="terminal-prompt">root@ghostshell:~$</span> ${trimmed}`, '');

    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    let result = null;

    if (commands[trimmed]) {
      result = commands[trimmed].fn();
    } else if (commands[cmd]) {
      result = commands[cmd].fn(args);
    } else {
      result = { text: `bash: ${cmd}: command not found. Try "help".`, className: 'error' };
    }

    if (result === null) return; // exit was called

    if (result.text === '__CLEAR__') {
      terminalOutput.innerHTML = '';
      return;
    }

    addOutputLine(result.text, result.className || '');
  }

  if (terminalToggle) {
    terminalToggle.addEventListener('click', openTerminal);
  }

  if (terminalClose) {
    terminalClose.addEventListener('click', closeTerminal);
  }

  if (terminalOverlay) {
    terminalOverlay.addEventListener('click', (e) => {
      if (e.target === terminalOverlay) closeTerminal();
    });
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        processTerminalCommand(terminalInput.value);
        terminalInput.value = '';
      }
      if (e.key === 'Escape') {
        closeTerminal();
      }
    });

    // Keep focus when clicking anywhere in the terminal body
    if (terminalBody) {
      terminalBody.addEventListener('click', () => terminalInput.focus());
    }
  }

  // Keyboard shortcut Ctrl+` to open terminal
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '`') {
      e.preventDefault();
      if (terminalOverlay && terminalOverlay.classList.contains('active')) {
        closeTerminal();
      } else {
        openTerminal();
      }
    }
  });

  console.log('%c\u{1F47B} GhostShell Network loaded. Press Ctrl+` to open terminal.', 'color: #00f5ff; font-size: 14px; font-weight: bold;');

});
