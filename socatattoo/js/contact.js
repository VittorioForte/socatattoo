/**
 * Soca Tattoo — contact.js
 * Handles: navbar scroll, hamburger menu, scroll reveal, active nav,
 *          contact form validation, image upload preview, SweetAlert2 feedback
 */

(function () {
  'use strict';

  // ── Navbar scroll behavior ──
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  });

  // ── Hamburger menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  mobileNav.addEventListener('click', (e) => {
    if (e.target === mobileNav) {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // ── Scroll reveal ──
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Image upload preview ──
  const fileInput = document.getElementById('tattooImage');
  const filePreview = document.getElementById('filePreview');
  const previewImg = document.getElementById('previewImg');
  const fileName = document.getElementById('fileName');
  const fileUploadArea = document.getElementById('fileUploadArea');

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
      filePreview.classList.remove('active');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Archivo muy grande',
        text: 'La imagen no puede superar los 5MB.',
        confirmButtonColor: '#d47484',
        background: '#2a1215',
        color: '#faf2ea',
      });
      fileInput.value = '';
      filePreview.classList.remove('active');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      previewImg.src = ev.target.result;
      fileName.textContent = file.name;
      filePreview.classList.add('active');
    };
    reader.readAsDataURL(file);
  });

  // Drag & drop visual feedback
  fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.style.borderColor = 'var(--rose)';
    fileUploadArea.style.background = 'rgba(212, 116, 132, 0.08)';
  });

  fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.style.borderColor = '';
    fileUploadArea.style.background = '';
  });

  fileUploadArea.addEventListener('drop', () => {
    fileUploadArea.style.borderColor = '';
    fileUploadArea.style.background = '';
  });

  // ── Contact form validation & submission ──
  const form = document.getElementById('contactForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Honeypot check
    const honeypot = form.querySelector('input[name="_honey"]');
    if (honeypot && honeypot.value) return;

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const ideas = document.getElementById('ideas').value.trim();
    const sizeFrom = document.getElementById('sizeFrom').value.trim();
    const sizeTo = document.getElementById('sizeTo').value.trim();

    // Validation
    const errors = [];

    if (!firstName) errors.push('El campo <b>Nombre</b> es obligatorio.');
    if (!lastName) errors.push('El campo <b>Apellido</b> es obligatorio.');
    if (!email) {
      errors.push('El campo <b>Email</b> es obligatorio.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('El <b>Email</b> ingresado no es válido.');
    }
    if (!ideas) errors.push('Describí tu <b>idea de tatuaje</b>.');
    if (!sizeFrom || !sizeTo) {
      errors.push('Indicá el <b>tamaño estimado</b> (desde y hasta en mm).');
    } else if (parseInt(sizeFrom) > parseInt(sizeTo)) {
      errors.push('El tamaño <b>"Desde"</b> no puede ser mayor que <b>"Hasta"</b>.');
    }

    if (errors.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Revisá los campos',
        html: errors.join('<br>'),
        confirmButtonColor: '#d47484',
        background: '#2a1215',
        color: '#faf2ea',
      });
      return;
    }

    // Build mailto body
    const subject = encodeURIComponent(`Consulta de tatuaje — ${firstName} ${lastName}`);
    const body = encodeURIComponent(
      `Nombre: ${firstName} ${lastName}\n` +
      `Email: ${email}\n\n` +
      `Ideas: ${ideas}\n\n` +
      `Tamaño estimado: ${sizeFrom}mm — ${sizeTo}mm\n\n` +
      `(Imagen adjunta enviada aparte si fue cargada)`
    );

    // Open mailto
    window.location.href = `mailto:socatatoomailprueba@gmail.com?subject=${subject}&body=${body}`;

    // Show success modal
    Swal.fire({
      icon: 'success',
      title: '¡Mensaje enviado!',
      text: 'Se abrió tu cliente de correo. Nos contactaremos pronto.',
      confirmButtonColor: '#d47484',
      background: '#2a1215',
      color: '#faf2ea',
    });

    // Reset form
    form.reset();
    filePreview.classList.remove('active');
  });

})();
