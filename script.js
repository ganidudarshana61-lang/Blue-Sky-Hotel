/* ==========================================================
   Hotel Blue Sky – script.js (vanilla JS, no dependencies)
   ========================================================== */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '94372224777'; // +94 37 222 4777
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Footer year ---------- */
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Header: scrolled state, back-to-top ---------- */
  var header = $('.site-header');
  var toTop = $('#toTop');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('scrolled', y > 40);
    toTop.classList.toggle('show', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    var first = $('.brand'); if (first) first.focus({ preventScroll: true });
  });

  /* ---------- Mobile menu ---------- */
  function initializeNavigation() {
    var toggle = $('#menuToggle');
    var menu = $('#mainNav');
    var overlay = $('#navOverlay');
    if (!toggle || !menu || !overlay) return;
    var previousBodyOverflow = '';

    function setMenu(open) {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen === open) return;
      if (open) previousBodyOverflow = document.body.style.overflow;
      menu.classList.toggle('is-open', open);
      overlay.classList.toggle('is-visible', open);
      overlay.setAttribute('aria-hidden', String(!open));
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      document.body.style.overflow = open ? 'hidden' : previousBodyOverflow;
    }

    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    overlay.addEventListener('click', function () {
      setMenu(false);
      toggle.focus({ preventScroll: true });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });

    var desktopNav = window.matchMedia('(min-width: 1021px)');
    function closeMenuOnDesktop(m) {
      if (m.matches) setMenu(false);
    }
    if (desktopNav.addEventListener) desktopNav.addEventListener('change', closeMenuOnDesktop);
    else desktopNav.addListener(closeMenuOnDesktop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNavigation, { once: true });
  } else {
    initializeNavigation();
  }

  /* ---------- Active link while scrolling ---------- */
  var links = $$('.nav-menu a[href^="#"]:not(.btn)');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) {
          var on = l.getAttribute('href') === '#' + en.target.id;
          l.classList.toggle('active', on);
          if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { spy.observe(s); });

    /* ---------- Scroll reveal ---------- */
    var rev = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); } });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el) { rev.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Gallery lightbox ---------- */
  var items = $$('.g-item');
  var lb = $('#lightbox');
  var lbImg = $('#lbImg');
  var lbCap = $('#lbCap');
  var current = 0;
  var opener = null;
  var previousBodyOverflow = '';

  function show(i) {
    if (!items.length) return;
    current = (i + items.length) % items.length;
    var it = items[current];
    lbImg.src = it.dataset.full;
    lbImg.alt = it.dataset.alt || '';
    lbCap.textContent = it.dataset.alt || '';
  }
  function openLb(i) {
    if (!items.length) return;
    opener = document.activeElement;
    previousBodyOverflow = document.body.style.overflow;
    show(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.lb-close', lb).focus();
  }
  function closeLb() {
    if (lb.hidden) return;
    lb.hidden = true;
    document.body.style.overflow = previousBodyOverflow;
    if (opener) opener.focus();
  }
  items.forEach(function (it, i) { it.addEventListener('click', function () { openLb(i); }); });
  $('.lb-close', lb).addEventListener('click', closeLb);
  $('.lb-prev', lb).addEventListener('click', function () { show(current - 1); });
  $('.lb-next', lb).addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    else if (e.key === 'Tab') { // keep focus inside the dialog
      var f = $$('button', lb);
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // Swipe support for touch screens
  var startX = null;
  lb.addEventListener('touchstart', function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });

  /* ---------- Booking enquiry form ---------- */
  var form = $('#bookingForm');
  var status = $('#formStatus');
  var f = {
    name: $('#guestName'), phone: $('#phone'), email: $('#email'),
    guests: $('#guests'), checkin: $('#checkin'), checkout: $('#checkout'), requests: $('#requests')
  };

  function iso(d) {
    var m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + m + '-' + day;
  }
  var today = iso(new Date());
  f.checkin.min = today;
  f.checkout.min = today;
  f.checkin.addEventListener('change', function () {
    if (f.checkin.value) {
      var next = new Date(f.checkin.value + 'T00:00:00'); next.setDate(next.getDate() + 1);
      f.checkout.min = iso(next);
    }
  });

  function setError(input, msg) {
    var out = $('#err-' + input.id);
    if (out) out.textContent = msg || '';
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    return !msg;
  }

  function validate() {
    var bad = [];
    function check(input, msg) { if (!setError(input, msg)) bad.push(input); }

    check(f.name, f.name.value.trim().length < 2 ? 'Enter the guest name.' : '');

    var digits = f.phone.value.replace(/\D/g, '');
    check(f.phone, (digits.length < 7 || digits.length > 15 || !/^[+\d\s()-]+$/.test(f.phone.value.trim()))
      ? 'Enter a valid contact number, for example +94 77 123 4567.' : '');

    check(f.email, !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim()) ? 'Enter a valid email address.' : '');

    var g = parseInt(f.guests.value, 10);
    check(f.guests, (isNaN(g) || g < 1 || g > 50) ? 'Enter a number of guests between 1 and 50.' : '');

    var ci = f.checkin.value, co = f.checkout.value;
    check(f.checkin, !ci ? 'Select a check-in date.' : (ci < today ? 'Check-in cannot be in the past.' : ''));
    check(f.checkout, !co ? 'Select a check-out date.' : (ci && co <= ci ? 'Check-out must be after the check-in date.' : ''));

    return bad;
  }

  function fmt(dateStr) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    var bad = validate();
    if (bad.length) {
      bad[0].focus();
      status.textContent = 'Please correct the highlighted fields.';
      return;
    }
    var nights = Math.round((new Date(f.checkout.value) - new Date(f.checkin.value)) / 86400000);
    var lines = [
      'Hello Hotel Blue Sky, I would like to make a booking enquiry.',
      '',
      'Name: ' + f.name.value.trim(),
      'Contact number: ' + f.phone.value.trim(),
      'Email: ' + f.email.value.trim(),
      'Check-in: ' + fmt(f.checkin.value),
      'Check-out: ' + fmt(f.checkout.value) + ' (' + nights + (nights === 1 ? ' night)' : ' nights)'),
      'Guests: ' + f.guests.value
    ];
    var req = f.requests.value.trim();
    if (req) lines.push('Special requests: ' + req);
    lines.push('', 'Please confirm availability and rates. Thank you.');

    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    var win = window.open(url, '_blank', 'noopener');
    status.textContent = win
      ? 'WhatsApp has opened with your enquiry. Send the message to complete it. Your room is not reserved until the hotel confirms.'
      : 'Your browser blocked the new tab. Allow pop-ups for this site and try again.';
  });

  // Clear an error as soon as the guest fixes the field
  Object.keys(f).forEach(function (k) {
    f[k].addEventListener('input', function () { setError(f[k], ''); });
  });

  /* ---------- Pre-fill the special requests from "enquiry" buttons ---------- */
  $$('[data-prefill]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (!f.requests.value.trim()) f.requests.value = a.dataset.prefill + ': ';
    });
  });
})();
