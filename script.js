/* =============================================
   EL CABALLERO BARBERÍA — SCRIPT.JS
   ============================================= */

// ─── NAVBAR: cambio al hacer scroll ───────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ─── HAMBURGER MENU (móvil) ────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('abierto');
  // Animación de hamburger → X
  const spans = hamburger.querySelectorAll('span');
  hamburger.classList.toggle('activo');
  if (hamburger.classList.contains('activo')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Cerrar menú al hacer click en un enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('abierto');
    hamburger.classList.remove('activo');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

// ─── CONTADOR ANIMADO (Stats) ───────────────────────
function animarContadores() {
  const contadores = document.querySelectorAll('.stat-num');

  contadores.forEach(contador => {
    const objetivo = parseInt(contador.getAttribute('data-target'));
    const duracion = 2000; // ms
    const paso     = Math.ceil(objetivo / (duracion / 16));
    let actual     = 0;

    const timer = setInterval(() => {
      actual += paso;
      if (actual >= objetivo) {
        actual = objetivo;
        clearInterval(timer);
      }
      contador.textContent = actual.toLocaleString('es-MX');
    }, 16);
  });
}

// Observer para disparar el contador cuando sea visible
const statsBanner = document.querySelector('.stats-banner');
let contadorActivado = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !contadorActivado) {
      contadorActivado = true;
      animarContadores();
    }
  });
}, { threshold: 0.3 });

if (statsBanner) {
  statsObserver.observe(statsBanner);
}

// ─── SLIDER DE TESTIMONIOS ─────────────────────────
const testimonios = document.querySelectorAll('.testimonio');
const dotsContainer = document.getElementById('sliderDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let testimonioActual = 0;
let intervaloSlider;

// Crear dots
testimonios.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');
  dot.setAttribute('aria-label', `Testimonio ${i + 1}`);
  dot.addEventListener('click', () => {
    irATestimonio(i);
    resetIntervalo();
  });
  dotsContainer.appendChild(dot);
});

function mostrarTestimonio(index) {
  testimonios.forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));

  testimonios[index].classList.add('active');
  document.querySelectorAll('.dot')[index].classList.add('active');
}

function irATestimonio(index) {
  testimonioActual = (index + testimonios.length) % testimonios.length;
  mostrarTestimonio(testimonioActual);
}

function siguiente() {
  irATestimonio(testimonioActual + 1);
}

function anterior() {
  irATestimonio(testimonioActual - 1);
}

function resetIntervalo() {
  clearInterval(intervaloSlider);
  intervaloSlider = setInterval(siguiente, 5000);
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => { anterior(); resetIntervalo(); });
  nextBtn.addEventListener('click', () => { siguiente(); resetIntervalo(); });
}

// Auto-play
intervaloSlider = setInterval(siguiente, 5000);

// ─── MODAL DE RESERVA ──────────────────────────────
const modalOverlay = document.getElementById('modalOverlay');
const reservaForm  = document.getElementById('reservaForm');
const modalSuccess = document.getElementById('modalSuccess');

function abrirModal() {
  modalOverlay.classList.add('activo');
  document.body.style.overflow = 'hidden';
  // Resetear estado
  reservaForm.classList.remove('hidden');
  modalSuccess.classList.remove('visible');
  reservaForm.reset();
}

function cerrarModal() {
  modalOverlay.classList.remove('activo');
  document.body.style.overflow = '';
}

function cerrarModalFuera(e) {
  if (e.target === modalOverlay) {
    cerrarModal();
  }
}

// Cerrar con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarModal();
});

// Submit del formulario
if (reservaForm) {
  reservaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simular envío con loading
    const btn = reservaForm.querySelector('button[type="submit"]');
    btn.textContent = 'Enviando...';
    btn.disabled = true;

    setTimeout(() => {
      reservaForm.classList.add('hidden');
      modalSuccess.classList.add('visible');
    }, 1500);
  });
}

// ─── ANIMACIONES DE SCROLL (Intersection Observer) ─
const elementosAnimados = document.querySelectorAll(
  '.servicio-card, .barbero-card, .galeria-item, .info-item'
);

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Delay escalonado
      const delay = (entry.target.dataset.delay || 0);
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, delay);
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

elementosAnimados.forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  el.dataset.delay    = (i % 3) * 120; // escalonar por columna
  animObserver.observe(el);
});

// ─── SCROLL SUAVE PARA ANCLAS ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80; // altura del navbar
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── ACTIVE LINK según sección visible ─────────────
const secciones  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('activo'));
      const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('activo');
    }
  });
}, { threshold: 0.4 });

secciones.forEach(sec => activeObserver.observe(sec));

// ─── EFECTO PARALLAX SUAVE en el HERO ──────────────
const heroBg = document.querySelector('.hero-bg');

if (heroBg) {
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    if (scrollY < window.innerHeight) {
      heroBg.style.transform = `scale(1) translateY(${scrollY * 0.3}px)`;
    }
  }, { passive: true });
}

// ─── MINI TOAST al pasar el cursor sobre servicios ─
document.querySelectorAll('.servicio-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.cursor = 'pointer';
  });

  card.addEventListener('click', function() {
    abrirModal();
    // Pre-seleccionar el servicio en el modal
    const servicio = this.querySelector('h3').textContent;
    const select   = document.querySelector('.modal-form select');
    if (select) {
      Array.from(select.options).forEach(opt => {
        if (opt.text.startsWith(servicio)) {
          select.value = opt.value;
        }
      });
    }
  });
});

// ─── CONSOLE EASTER EGG ────────────────────────────
console.log(`
 ✦ ─────────────────────────────────── ✦
      EL CABALLERO BARBERÍA
      El Arte del Corte · CDMX · 1998
 ✦ ─────────────────────────────────── ✦
`);
