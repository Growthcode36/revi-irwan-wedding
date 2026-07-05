'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ============ GUEST NAME FROM URL ============ */
  const params = new URLSearchParams(window.location.search);
  const guest = params.get('to');
  if (guest) {
    document.getElementById('guestName').textContent = decodeURIComponent(guest).replace(/\+/g, ' ');
  }

  /* ============ LOADER ============ */
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('loader').classList.add('hidden'), 500);
  });

  /* ============ ELEMENTS ============ */
  const cover = document.getElementById('cover');
  const openBtn = document.getElementById('openInvitation');
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const floatingNav = document.getElementById('floatingNav');

  let invitationOpened = false;

  /* ============ OPEN INVITATION ============ */
  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (invitationOpened) return;
    invitationOpened = true;

    cover.classList.add('hidden');
    document.body.style.overflow = 'auto';
    floatingNav.classList.add('visible');
    musicToggle.classList.add('visible');

    bgMusic.play().then(() => {
      musicToggle.classList.add('playing');
    }).catch((err) => {
      console.warn('Musik gagal diputar otomatis (autoplay diblokir browser):', err.message);
    });

    triggerFadeIn();

    // Delay supaya klik tombol "Buka Undangan" ini sendiri
    // tidak langsung memicu listener yang menghentikan autoscroll
    setTimeout(() => {
      startAutoScroll();
      attachInteractionListeners();
    }, 500);
  });

  document.body.style.overflow = 'hidden';

  /* ============ MUSIC TOGGLE ============ */
  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => musicToggle.classList.add('playing'))
        .catch((err) => console.warn('Gagal memutar musik:', err.message));
    } else {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
    }
  });

  /* ============ PROGRESS BAR ============ */
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = percent + '%';
  });

  /* ============ ACTIVE NAV ON SCROLL ============ */
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => {
          item.classList.toggle('active', item.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(section => navObserver.observe(section));

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      stopAutoScroll();
      const target = document.getElementById(item.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ============ FADE-IN ANIMATION (IntersectionObserver) ============ */
  function triggerFadeIn() {
    const fadeEls = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    fadeEls.forEach(el => fadeObserver.observe(el));
  }

  /* ============ COUNTDOWN TIMER ============ */
  const weddingDate = new Date('2026-07-17T10:00:00+07:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const diff = weddingDate - now;

    const els = {
      d: document.getElementById('cd-days'),
      h: document.getElementById('cd-hours'),
      m: document.getElementById('cd-minutes'),
      s: document.getElementById('cd-seconds'),
    };

    if (diff <= 0) {
      els.d.textContent = '00'; els.h.textContent = '00';
      els.m.textContent = '00'; els.s.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    els.d.textContent = String(days).padStart(2, '0');
    els.h.textContent = String(hours).padStart(2, '0');
    els.m.textContent = String(minutes).padStart(2, '0');
    els.s.textContent = String(seconds).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ============ COPY GIFT NUMBER (Clipboard API modern, tanpa execCommand) ============ */
  const copyBtn = document.getElementById('copyGift');
  const copyLabel = document.getElementById('copyLabel');
  const giftNumber = document.getElementById('giftNumber');

  copyBtn.addEventListener('click', async () => {
    const number = giftNumber.textContent.replace(/\s/g, '');
    try {
      await navigator.clipboard.writeText(number);
      copyBtn.classList.add('copied');
      copyLabel.textContent = 'Tersalin!';
    } catch (err) {
      console.warn('Gagal menyalin otomatis, silakan salin manual:', number);
      copyLabel.textContent = 'Gagal, salin manual';
    }
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyLabel.textContent = 'Salin Nomor Rekening';
    }, 2000);
  });

  /* ============ RSVP WHATSAPP LINK ============ */
  const rsvpBtn = document.getElementById('rsvpBtn');
  const waNumber = '6281234567890';
  const guestForMsg = guest ? decodeURIComponent(guest).replace(/\+/g, ' ') : 'Tamu Undangan';
  const waMessage = `Assalamualaikum, saya ${guestForMsg} ingin mengonfirmasi kehadiran pada acara pernikahan Revi & Irwan. Terima kasih.`;
  rsvpBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  /* ============ WISH FORM (localStorage) ============ */
  const wishForm = document.getElementById('wishForm');
  const wishList = document.getElementById('wishList');
  const STORAGE_KEY = 'revi_irwan_wishes';

  function getWishes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveWishes(wishes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderWishes() {
    const wishes = getWishes();
    if (wishes.length === 0) {
      wishList.innerHTML = '<p class="wish-empty">Jadilah yang pertama memberikan ucapan &amp; doa 💐</p>';
      return;
    }
    wishList.innerHTML = wishes.slice().reverse().map(w => `
      <div class="wish-item">
        <p class="wish-item-name">${escapeHTML(w.name)}</p>
        <p class="wish-item-msg">${escapeHTML(w.message)}</p>
        <p class="wish-item-time">${w.time}</p>
      </div>
    `).join('');
  }

  wishForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('wishName');
    const msgInput = document.getElementById('wishMessage');
    const name = nameInput.value.trim();
    const message = msgInput.value.trim();
    if (!name || !message) return;

    const wishes = getWishes();
    wishes.push({
      name,
      message,
      time: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    });
    saveWishes(wishes);
    renderWishes();
    wishForm.reset();
  });

  renderWishes();

  /* ============ AUTO-SCROLL BETWEEN SECTIONS ============ */
  let autoScrollTimer = null;
  let autoScrollIndex = 0;
  const scrollSections = ['home', 'mempelai', 'countdown', 'acara', 'gift', 'rsvp', 'ucapan'];
  let userInteracted = false;

  function startAutoScroll() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (autoScrollTimer) clearInterval(autoScrollTimer);
    autoScrollTimer = setInterval(() => {
      if (userInteracted) {
        clearInterval(autoScrollTimer);
        return;
      }
      autoScrollIndex = (autoScrollIndex + 1) % scrollSections.length;
      const target = document.getElementById(scrollSections[autoScrollIndex]);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }, 4000);
  }

  function stopAutoScroll() {
    userInteracted = true;
    if (autoScrollTimer) clearInterval(autoScrollTimer);
  }

  function attachInteractionListeners() {
    ['wheel', 'touchstart', 'mousedown', 'keydown'].forEach(evt => {
      window.addEventListener(evt, stopAutoScroll, { once: true, passive: true });
    });
  }

  /* ============ SERVICE WORKER REGISTRATION ============ */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => { /* silent fail */ });
    });
  }

});
