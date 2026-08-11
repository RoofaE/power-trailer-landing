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

/* ===== RUNTIME CALCULATOR ===== */
var calcData = [
  { category: 'Lighting', items: [
    { name: 'LED Work Light', watts: 30 },
    { name: 'LED String Lights', watts: 50 },
    { name: 'Area Lighting', watts: 100 },
    { name: 'Flood Light', watts: 150 },
    { name: 'Construction Tower Light', watts: 500 }
  ]},
  { category: 'Electronics', items: [
    { name: 'TV', watts: 100 },
    { name: 'Laptop', watts: 60 },
    { name: 'Desktop Computer', watts: 250 },
    { name: 'Security Camera', watts: 15 },
    { name: 'Security System', watts: 40 },
    { name: 'Cell Phone Charger', watts: 10 },
    { name: 'Tablet Charger', watts: 15 },
    { name: 'Starlink Internet', watts: 75 },
    { name: 'WiFi Router', watts: 20 },
    { name: 'Monitor', watts: 30 },
    { name: 'Radio', watts: 20 }
  ]},
  { category: 'Tool Charging', items: [
    { name: 'Battery Charger', watts: 50 },
    { name: 'Power Tool Charger', watts: 100 },
    { name: 'Multiple Tool Chargers', watts: 300 },
    { name: 'E-Bike Charger', watts: 150 },
    { name: 'Drone Charger', watts: 100 }
  ]},
  { category: 'Construction Equipment', items: [
    { name: 'Table Saw', watts: 1800 },
    { name: 'Circular Saw', watts: 1400 },
    { name: 'Mitre Saw', watts: 1800 },
    { name: 'Air Compressor', watts: 1500 },
    { name: 'Grinder', watts: 1200 },
    { name: 'Drill', watts: 600 },
    { name: 'Hammer Drill', watts: 1000 },
    { name: 'Impact Driver', watts: 300 },
    { name: 'Shop Vac', watts: 1200 },
    { name: 'Pressure Washer', watts: 1500 }
  ]},
  { category: 'Welding', warning: true, items: [
    { name: 'Small Inverter Welder', watts: 2500 },
    { name: 'MIG Welder', watts: 3500 },
    { name: 'TIG Welder', watts: 2000 }
  ]},
  { category: 'Water Systems', items: [
    { name: 'Water Pump Small', watts: 300 },
    { name: 'Water Pump Large', watts: 1000 },
    { name: 'Transfer Pump', watts: 500 },
    { name: 'Livestock Water Pump', watts: 800 },
    { name: 'Irrigation Controls', watts: 100 }
  ]},
  { category: 'Office / Site Trailer', items: [
    { name: 'Printer', watts: 500 },
    { name: 'Coffee Maker', watts: 1000 },
    { name: 'Microwave', watts: 1200 },
    { name: 'Mini Fridge', watts: 150 },
    { name: 'Full Fridge', watts: 250 },
    { name: 'Portable Heater Fan', watts: 1500 },
    { name: 'Portable Air Conditioner', watts: 1500 },
    { name: 'Water Cooler', watts: 100 }
  ]},
  { category: 'Agriculture', items: [
    { name: 'Electric Fence Controller', watts: 25 },
    { name: 'Watering System Controller', watts: 50 },
    { name: 'Grain Monitoring Equipment', watts: 150 },
    { name: 'Livestock Monitoring System', watts: 75 },
    { name: 'Remote Cameras', watts: 25 }
  ]},
  { category: 'Security & Remote Monitoring', items: [
    { name: 'Security Cameras (4)', watts: 60 },
    { name: 'Remote Monitoring Station', watts: 100 },
    { name: 'Motion Sensors', watts: 20 },
    { name: 'Communications Equipment', watts: 100 },
    { name: 'Cellular Gateway', watts: 30 }
  ]},
  { category: 'Events & Recreation', items: [
    { name: 'Outdoor Speakers', watts: 150 },
    { name: 'DJ Equipment', watts: 500 },
    { name: 'Sound System', watts: 1000 },
    { name: 'Inflatable Blower', watts: 1200 },
    { name: 'Popcorn Machine', watts: 1200 },
    { name: 'Beverage Cooler', watts: 250 },
    { name: 'Food Truck Support', watts: 1500 }
  ]}
];

var calcCategoriesEl = document.getElementById('calcCategories');

if (calcCategoriesEl) {
  var calcHtml = '';
  calcData.forEach(function (cat, catIndex) {
    calcHtml += '<div class="calc-category" data-index="' + catIndex + '">';
    calcHtml += '<button class="calc-category-header" type="button">' + cat.category + '<span class="calc-toggle-icon">+</span></button>';
    calcHtml += '<div class="calc-category-body">';
    cat.items.forEach(function (item, itemIndex) {
      var id = 'calc-' + catIndex + '-' + itemIndex;
      calcHtml += '<div class="calc-item">';
      calcHtml += '<label for="' + id + '"><input type="checkbox" id="' + id + '" data-watts="' + item.watts + '" data-warning="' + (cat.warning ? '1' : '0') + '">' + item.name + '</label>';
      calcHtml += '<span class="calc-watts">' + item.watts + 'W</span>';
      calcHtml += '</div>';
    });
    calcHtml += '</div></div>';
  });
  calcCategoriesEl.innerHTML = calcHtml;

  document.querySelectorAll('.calc-category-header').forEach(function (header) {
    header.addEventListener('click', function () {
      header.closest('.calc-category').classList.toggle('open');
    });
  });

  var calcCheckboxes = document.querySelectorAll('.calc-item input[type="checkbox"]');
  var calcTotalWattsEl = document.getElementById('calcTotalWatts');
  var calcBatteryRuntimeEl = document.getElementById('calcBatteryRuntime');
  var calcSunnyRuntimeEl = document.getElementById('calcSunnyRuntime');
  var calcStatusEl = document.getElementById('calcStatus');
  var calcWarningEl = document.getElementById('calcWarning');
  var calcModeButtons = document.querySelectorAll('.calc-mode');
  var currentDodWh = 5800;

  calcModeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      calcModeButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      currentDodWh = btn.getAttribute('data-mode') === 'maximum' ? 9280 : 5800;
      updateCalculator();
    });
  });

  function updateCalculator() {
    var totalWatts = 0;
    var anyWarning = false;
    calcCheckboxes.forEach(function (cb) {
      if (cb.checked) {
        totalWatts += parseFloat(cb.getAttribute('data-watts'));
        if (cb.getAttribute('data-warning') === '1') anyWarning = true;
      }
    });

    calcTotalWattsEl.textContent = totalWatts;

    if (totalWatts === 0) {
      calcBatteryRuntimeEl.textContent = '\u2014';
      calcSunnyRuntimeEl.textContent = '\u2014';
      calcStatusEl.textContent = 'Select equipment to get started.';
      calcStatusEl.className = 'calc-status';
      calcWarningEl.classList.remove('visible');
      return;
    }

    var batteryHours = currentDodWh / totalWatts;
    calcBatteryRuntimeEl.textContent = batteryHours.toFixed(1) + ' hrs';

    var netLoad = totalWatts - 1500;
    if (netLoad <= 0) {
      calcSunnyRuntimeEl.textContent = 'Indefinite';
    } else {
      var sunnyHours = currentDodWh / netLoad;
      calcSunnyRuntimeEl.textContent = sunnyHours.toFixed(1) + ' hrs';
    }

    var statusText, statusClass;
    if (netLoad <= 0 || batteryHours >= 12) {
      statusText = 'Excellent match for the solar trailer.';
      statusClass = 'status-excellent';
    } else if (batteryHours >= 6) {
      statusText = 'Good match. Monitor usage on cloudy days.';
      statusClass = 'status-good';
    } else {
      statusText = 'Limited runtime for this load. Consider reducing usage or contact Flaman.';
      statusClass = 'status-limited';
    }
    calcStatusEl.textContent = statusText;
    calcStatusEl.className = 'calc-status ' + statusClass;

    calcWarningEl.classList.toggle('visible', anyWarning);
  }

  calcCheckboxes.forEach(function (cb) {
    cb.addEventListener('change', updateCalculator);
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