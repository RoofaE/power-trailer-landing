var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== SCROLL REVEAL ===== */
var revealEls = document.querySelectorAll('.reveal');
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(function (el) { revealObserver.observe(el); });

/* ===== ANIMATED COUNTERS ===== */
var counters = document.querySelectorAll('[data-count]');
var counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
counters.forEach(function (el) { counterObserver.observe(el); });

function animateCounter(el) {
  var target = parseFloat(el.getAttribute('data-count'));
  var decimals = el.getAttribute('data-decimal') ? parseInt(el.getAttribute('data-decimal'), 10) : 0;
  var duration = 1300;
  var start = null;
  function step(timestamp) {
    if (!start) start = timestamp;
    var progress = Math.min((timestamp - start) / duration, 1);
    var value = target * progress;
    el.textContent = decimals ? value.toFixed(decimals) : Math.floor(value);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = decimals ? target.toFixed(decimals) : target;
  }
  requestAnimationFrame(step);
}

/* ===== FLIP CARDS ===== */
document.querySelectorAll('.flip-card').forEach(function (card) {
  card.addEventListener('click', function () { card.classList.toggle('flipped'); });
  card.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('flipped'); }
  });
});

/* ===== SMOOTH SCROLL + REQUEST TYPE TAGGING ===== */
var requestTypeField = document.getElementById('requestTypeField');
document.querySelectorAll('[data-scroll-to]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var targetId = btn.getAttribute('data-scroll-to');
    var target = document.getElementById(targetId);
    var requestType = btn.getAttribute('data-request-type');
    if (requestType && requestTypeField) requestTypeField.value = requestType;
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
document.querySelectorAll('.form-submit-row button').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var requestType = btn.getAttribute('data-request-type');
    if (requestType && requestTypeField) requestTypeField.value = requestType;
  });
});

/* ===== RUNTIME ESTIMATOR TABS ===== */
var runtimeTabs = document.querySelectorAll('.runtime-tab');
var runtimePanels = document.querySelectorAll('.runtime-panel');
runtimeTabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    var target = tab.getAttribute('data-runtime');
    runtimeTabs.forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');
    runtimePanels.forEach(function (panel) {
      panel.classList.toggle('active', panel.getAttribute('data-panel') === target);
    });
  });
});

/* ===== FAQ ACCORDION ===== */
document.querySelectorAll('.faq-question').forEach(function (question) {
  question.addEventListener('click', function () {
    var item = question.closest('.faq-item');
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
    if (!isOpen) item.classList.add('open');
  });
});

/* ===== STICKY MOBILE CTA ===== */
var stickyCta = document.querySelector('.sticky-cta');
var hero = document.querySelector('.hero');
if (stickyCta && hero) {
  var stickyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      stickyCta.classList.toggle('visible', !entry.isIntersecting && window.innerWidth <= 900);
    });
  }, { threshold: 0 });
  stickyObserver.observe(hero);
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) stickyCta.classList.remove('visible');
  });
}

/* ===== SCROLLYTELLING: HOW IT WORKS (the one signature effect) ===== */
var scrollyEl = document.getElementById('scrolly');
var scrollySteps = document.querySelectorAll('.scrolly-step');
var scrollyCounterEl = document.getElementById('scrollyCount');

var ticking = false;

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(function () {
    updateScrolly();
    ticking = false;
  });
}

function updateScrolly() {
  if (!scrollyEl || !scrollySteps.length) return;
  var rect = scrollyEl.getBoundingClientRect();
  var total = scrollyEl.offsetHeight - window.innerHeight;
  var scrolled = -rect.top;
  var progress = total > 0 ? scrolled / total : 0;
  progress = Math.max(0, Math.min(1, progress));

  var stepIndex = Math.min(scrollySteps.length - 1, Math.floor(progress * scrollySteps.length));

  scrollySteps.forEach(function (step, i) {
    step.classList.toggle('active', i === stepIndex);
  });

  if (scrollyCounterEl) scrollyCounterEl.textContent = stepIndex + 1;
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ===== PHONE NUMBER AUTO-FORMATTING ===== */
var phoneInput = document.getElementById('phone');
if (phoneInput) {
  phoneInput.addEventListener('input', function () {
    var digits = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    var formatted = digits;
    if (digits.length > 6) {
      formatted = '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
    } else if (digits.length > 3) {
      formatted = '(' + digits.slice(0, 3) + ') ' + digits.slice(3);
    } else if (digits.length > 0) {
      formatted = '(' + digits;
    }
    phoneInput.value = formatted;
  });
}

/* ===== FORM SUBMISSION: Web3Forms (client-side) + Supabase (server-side) ===== */
var form = document.getElementById('trailerForm');
var statusEl = document.getElementById('formStatus');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  statusEl.textContent = 'Sending...';
  var formData = new FormData(form);
  var object = Object.fromEntries(formData);
  var json = JSON.stringify(object);

  var web3formsRequest = fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: json
  }).then(function (r) { return r.json(); });

  var supabaseRequest = fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: json
  }).then(function (r) { return r.json(); }).catch(function () { return { success: false }; });

  Promise.all([web3formsRequest, supabaseRequest])
    .then(function (results) {
      var web3formsResult = results[0];
      if (web3formsResult.success) {
        statusEl.textContent = "Thanks, we'll be in touch shortly.";
        form.reset();
      } else {
        statusEl.textContent = 'Something went wrong. Please try again.';
      }
    })
    .catch(function () {
      statusEl.textContent = 'Something went wrong. Please try again.';
    });
});