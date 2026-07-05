/* =========================================================
   REVI & IRWAN — WEDDING INVITATION
   Vanilla JS — no frameworks
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------
     CONFIG
     --------------------------------------------------- */
  var CONFIG = {
    eventDate: '2026-07-17T10:00:00+07:00',
    whatsappNumber: '6281234567890',
    bankAccount: '1234 5678 9012',
    autoScrollIntervalMs: 6000,
    autoScrollPauseAfterInteractionMs: 15000
  };

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------
     GUEST NAME FROM URL (?to=Nama%20Tamu)
     --------------------------------------------------- */
  function initGuestName() {
    var params = new URLSearchParams(window.location.search);
    var guest = params.get('to');
    var el = document.getElementById('guestName');
    if (el && guest && guest.trim().length) {
      el.textContent = decodeURIComponent(guest.trim());
    }
  }

  /* ---------------------------------------------------
     LOADER
     --------------------------------------------------- */
  function initLoader() {
    var loader = document.getElementById('loader');
    if (!loader) return;
    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('is-hidden');
      }, 600);
    });
    // fallback in case load event already fired
    setTimeout(function () {
      loader.classList.add('is-hidden');
    }, 2500);
  }

  /* ---------------------------------------------------
     PROGRESS BAR
     --------------------------------------------------- */
  function initProgressBar() {
    var bar = document.getElementById('progressBar');
    if (!bar) return;
    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------------------------------------------------
     COUNTDOWN
     --------------------------------------------------- */
  function initCountdown() {
    var target = new Date(CONFIG.eventDate).getTime();
    var elDays = document.getElementById('cd-days');
    var elHours = document.getElementById('cd-hours');
    var elMinutes = document.getElementById('cd-minutes');
    var elSeconds = document.getElementById('cd-seconds');
    if (!elDays) return;

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      var now = Date.now();
      var diff = target - now;
      if (diff <= 0) {
        elDays.textContent = '00';
        elHours.textContent = '00';
        elMinutes.textContent = '00';
        elSeconds.textContent = '00';
        return;
      }
      var days = Math.floor(diff / (1000 * 60 * 60 * 24));
      var hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      var minutes = Math.floor((diff / (1000 * 60)) % 60);
      var seconds = Math.floor((diff / 1000) % 60);

      elDays.textContent = pad(days);
      elHours.textContent = pad(hours);
      elMinutes.textContent = pad(minutes);
      elSeconds.textContent = pad(seconds);
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ---------------------------------------------------
     REVEAL ON SCROLL (IntersectionObserver)
     --------------------------------------------------- */
  function initRevealAnimations() {
    var revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------------------------------------------
     FLOATING NAV — smooth scroll + active state
     --------------------------------------------------- */
  function initFloatingNav() {
    var nav = document.getElementById('floatingNav');
    if (!nav) return;
    var links = nav.querySelectorAll('.floating-nav__link');
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute('data-nav');
      var section = document.getElementById(id);
      if (section) sections.push({ id: id, el: section, link: link });

      link.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = link.getAttribute('href').slice(1);
        var targetEl = document.getElementById(targetId);
        if (targetEl) {
          stopAutoScroll();
          targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      });
    });

    function updateActive() {
      var scrollPos = window.scrollY + window.innerHeight * 0.35;
      var current = sections[0];
      sections.forEach(function (s) {
        if (s.el.offsetTop <= scrollPos) current = s;
      });
      links.forEach(function (l) { l.classList.remove('is-active'); });
      if (current) current.link.classList.add('is-active');
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  /* ---------------------------------------------------
     MUSIC TOGGLE
     --------------------------------------------------- */
  function initMusic() {
    var toggle = document.getElementById('musicToggle');
    var audio = document.getElementById('bgMusic');
    var iconPlay = document.getElementById('iconPlay');
    var iconPause = document.getElementById('iconPause');
    if (!toggle || !audio) return;

    function setPlayingUI(isPlaying) {
      iconPlay.hidden = isPlaying;
      iconPause.hidden = !isPlaying;
      toggle.setAttribute('aria-pressed', String(isPlaying));
    }

    toggle.addEventListener('click', function () {
      if (audio.paused) {
        audio.play().then(function () {
          setPlayingUI(true);
        }).catch(function () {
          // Autoplay/playback blocked or file missing — silently ignore.
          setPlayingUI(false);
        });
      } else {
        audio.pause();
        setPlayingUI(false);
      }
    });

    window.__tryAutoplayMusic = function () {
      audio.play().then(function () {
        setPlayingUI(true);
      }).catch(function () {
        setPlayingUI(false);
      });
    };
  }

  /* ---------------------------------------------------
     COVER — open invitation
     --------------------------------------------------- */
  function initCover() {
    var openBtn = document.getElementById('openBtn');
    var cover = document.getElementById('cover');
    var main = document.getElementById('mainContent');
    if (!openBtn || !cover || !main) return;

    openBtn.addEventListener('click', function () {
      cover.style.transition = 'opacity 0.6s ease, visibility 0.6s ease';
      cover.style.opacity = '0';
      cover.style.visibility = 'hidden';

      main.hidden = false;
      document.body.style.overflow = '';

      if (typeof window.__tryAutoplayMusic === 'function') {
        window.__tryAutoplayMusic();
      }

      setTimeout(function () {
        cover.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'auto' });
        initRevealAnimations();
        startAutoScroll();
      }, 650);
    });
  }

  /* ---------------------------------------------------
     GIFT — copy account number
     --------------------------------------------------- */
  function initCopyRek() {
    var btn = document.getElementById('copyRek');
    var msg = document.getElementById('copiedMsg');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var text = CONFIG.bankAccount;
      var done = function () {
        if (msg) {
          msg.hidden = false;
          setTimeout(function () { msg.hidden = true; }, 2500);
        }
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () {
          fallbackCopy(text, done);
        });
      } else {
        fallbackCopy(text, done);
      }
    });
  }

  function fallbackCopy(text, cb) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand('copy'); } catch (e) { /* no-op */ }
    document.body.removeChild(textarea);
    cb();
  }

  /* ---------------------------------------------------
     RSVP — WhatsApp link with prefilled message
     --------------------------------------------------- */
  function initWhatsApp() {
    var btn = document.getElementById('whatsappBtn');
    if (!btn) return;
    var params = new URLSearchParams(window.location.search);
    var guest = params.get('to');
    var name = guest ? decodeURIComponent(guest.trim()) : 'Tamu Undangan';

    var message = 'Assalamu\'alaikum, saya ' + name +
      '. Izinkan saya mengonfirmasi kehadiran pada acara pernikahan Revi & Irwan. Terima kasih.';

    var url = 'https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message);
    btn.setAttribute('href', url);
  }

  /* ---------------------------------------------------
     UCAPAN — form + localStorage
     --------------------------------------------------- */
  function initWishForm() {
    var form = document.getElementById('wishForm');
    var list = document.getElementById('wishList');
    var STORAGE_KEY = 'revi-irwan-wishes';
    if (!form || !list) return;

    function loadWishes() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    function saveWishes(wishes) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
      } catch (e) { /* storage unavailable — ignore */ }
    }

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    function renderWishes() {
      var wishes = loadWishes();
      list.innerHTML = '';
      if (!wishes.length) {
        var empty = document.createElement('li');
        empty.className = 'wish-list__empty';
        empty.textContent = 'Jadilah yang pertama mengirimkan ucapan dan doa.';
        list.appendChild(empty);
        return;
      }
      wishes.slice().reverse().forEach(function (wish) {
        var li = document.createElement('li');
        li.className = 'wish-list__item';
        li.innerHTML =
          '<span class="wish-list__name">' + escapeHtml(wish.name) + '</span>' +
          '<p class="wish-list__message">' + escapeHtml(wish.message) + '</p>';
        list.appendChild(li);
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameInput = document.getElementById('wishName');
      var messageInput = document.getElementById('wishMessage');
      var name = nameInput.value.trim();
      var message = messageInput.value.trim();
      if (!name || !message) return;

      var wishes = loadWishes();
      wishes.push({ name: name, message: message, ts: Date.now() });
      saveWishes(wishes);
      renderWishes();
      form.reset();
    });

    renderWishes();
  }

  /* ---------------------------------------------------
     AUTO-SCROLL BETWEEN SECTIONS
     Stops when user scrolls or touches manually.
     --------------------------------------------------- */
  var autoScrollTimer = null;
  var resumeTimer = null;
  var userInteracted = false;

  function getAllSections() {
    return Array.prototype.slice.call(document.querySelectorAll('#mainContent .section, #mainContent .footer'));
  }

  function startAutoScroll() {
    if (prefersReducedMotion) return;
    stopAutoScrollTimerOnly();
    // Reset here: the click on "Buka Undangan" itself fires a pointerdown
    // that would otherwise be mistaken for a manual scroll interaction.
    userInteracted = false;
    autoScrollTimer = setInterval(function () {
      if (userInteracted) return;
      var sections = getAllSections();
      var scrollPos = window.scrollY + 10;
      var next = sections.find(function (s) { return s.offsetTop > scrollPos; });
      if (next) {
        next.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        stopAutoScrollTimerOnly();
      }
    }, CONFIG.autoScrollIntervalMs);
  }

  function stopAutoScrollTimerOnly() {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
  }

  function stopAutoScroll() {
    userInteracted = true;
    stopAutoScrollTimerOnly();
    if (resumeTimer) clearTimeout(resumeTimer);
    // Auto-scroll permanently stops after manual interaction;
    // it only exists to gently guide first-time viewing.
  }

  function initAutoScrollInteractionListeners() {
    var stopEvents = ['wheel', 'touchstart', 'touchmove', 'pointerdown'];
    stopEvents.forEach(function (evt) {
      window.addEventListener(evt, function () {
        userInteracted = true;
        stopAutoScrollTimerOnly();
      }, { passive: true, once: false });
    });
  }

  /* ---------------------------------------------------
     SERVICE WORKER REGISTRATION
     --------------------------------------------------- */
  function initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () {
          /* registration failed — non-critical, ignore */
        });
      });
    }
  }

  /* ---------------------------------------------------
     INIT
     --------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initGuestName();
    initLoader();
    initProgressBar();
    initCountdown();
    initFloatingNav();
    initMusic();
    initCover();
    initCopyRek();
    initWhatsApp();
    initWishForm();
    initAutoScrollInteractionListeners();
    initServiceWorker();

    // Reveal animations for elements visible before opening (cover section)
    document.querySelectorAll('.cover .reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  });
})();
