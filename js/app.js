// Limit Financial Services - Payday Loan App
var FEE_RATE = 0.30; // 30% flat fee

// Theme
function initTheme() {
  var saved = localStorage.getItem('limit-theme');
  if (saved === 'dark') { document.documentElement.setAttribute('data-theme', 'dark'); updateThemeIcons(true); }
  else if (saved === 'light') { document.documentElement.removeAttribute('data-theme'); updateThemeIcons(false); }
  else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) { document.documentElement.setAttribute('data-theme', 'dark'); updateThemeIcons(true); }
  }
}
function toggleTheme() {
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem('limit-theme', 'light'); updateThemeIcons(false); }
  else { document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('limit-theme', 'dark'); updateThemeIcons(true); }
}
function updateThemeIcons(isDark) {
  var sun = document.querySelector('.sun-icon');
  var moon = document.querySelector('.moon-icon');
  if (sun && moon) { sun.classList.toggle('hidden', isDark); moon.classList.toggle('hidden', !isDark); }
}

// Page Navigation
function showPage(pageName) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  var target = document.getElementById('page-' + pageName);
  if (target) target.classList.add('active');
  document.querySelectorAll('.bottom-nav .nav-item[data-page]').forEach(function(item) {
    item.classList.toggle('active', item.getAttribute('data-page') === pageName);
  });
  document.querySelectorAll('.header-center a[data-page]').forEach(function(item) {
    item.classList.toggle('active', item.getAttribute('data-page') === pageName);
  });
  document.querySelectorAll('.drawer-nav-item[data-page]').forEach(function(item) {
    item.classList.toggle('active', item.getAttribute('data-page') === pageName);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (pageName === 'apply') resetForm();
}

// Mobile Drawer
function toggleDrawer() {
  var drawer = document.getElementById('mobileDrawer');
  var overlay = document.getElementById('drawerOverlay');
  var hamburger = document.getElementById('hamburgerBtn');
  var isOpen = drawer.classList.contains('open');
  if (isOpen) {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    drawer.classList.add('open');
    overlay.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

// Calculator
function updateCalc() {
  var amount = parseInt(document.getElementById('amount-slider').value);
  var fee = Math.round(amount * FEE_RATE);
  var total = amount + fee;
  document.getElementById('amount-display').innerHTML = 'R' + amount.toLocaleString('en-ZA');
  document.getElementById('fee-display').textContent = 'R' + fee.toLocaleString('en-ZA');
  document.getElementById('total-display').textContent = 'R' + total.toLocaleString('en-ZA');
  document.getElementById('receive-display').textContent = 'R' + amount.toLocaleString('en-ZA');
  document.getElementById('fee-breakdown').textContent = 'R' + fee.toLocaleString('en-ZA');
  document.getElementById('repay-display').textContent = 'R' + total.toLocaleString('en-ZA');
}

function scrollToCalc() {
  var calc = document.getElementById('calculator');
  if (calc) calc.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Multi-Step Form
var currentStep = 1;
var totalSteps = 4;

function updateProgress() {
  for (var i = 1; i <= totalSteps; i++) {
    var prog = document.getElementById('prog-' + i);
    var label = document.getElementById('label-' + i);
    if (!prog || !label) continue;
    prog.classList.remove('current', 'completed');
    label.classList.remove('active');
    if (i < currentStep) prog.classList.add('completed');
    else if (i === currentStep) { prog.classList.add('current'); label.classList.add('active'); }
  }
}

function nextStep(from) {
  if (from === 1 && !validateStep1()) return;
  if (from === 2 && !validateStep2()) return;
  if (from === 3 && !validateStep3()) return;
  if (from === 3) populateReview();
  document.getElementById('step-' + from).classList.remove('active');
  currentStep = from + 1;
  document.getElementById('step-' + currentStep).classList.add('active');
  updateProgress();
  window.scrollTo({ top: 200, behavior: 'smooth' });
}

function prevStep(from) {
  document.getElementById('step-' + from).classList.remove('active');
  currentStep = from - 1;
  document.getElementById('step-' + currentStep).classList.add('active');
  updateProgress();
  window.scrollTo({ top: 200, behavior: 'smooth' });
}

function resetForm() {
  currentStep = 1;
  document.querySelectorAll('.form-step').forEach(function(s) { s.classList.remove('active'); });
  document.getElementById('step-1').classList.add('active');
  updateProgress();
}

// Validation
function validateStep1() {
  var name = document.getElementById('fullName').value.trim();
  var id = document.getElementById('idNumber').value.trim();
  var phone = document.getElementById('phone').value.trim();
  var email = document.getElementById('email').value.trim();
  var address = document.getElementById('address').value.trim();
  if (!name) { alert('Please enter your full name.'); return false; }
  if (!id || id.length < 10) { alert('Please enter a valid SA ID number (at least 10 digits).'); return false; }
  if (!phone) { alert('Please enter your phone number.'); return false; }
  if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return false; }
  if (!address) { alert('Please enter your physical address.'); return false; }
  return true;
}

function validateStep2() {
  var emp = document.getElementById('employment').value;
  var salary = document.getElementById('salary').value.trim();
  var payday = document.getElementById('payday').value;
  var bank = document.getElementById('bank').value;
  var acc = document.getElementById('accountNum').value.trim();
  if (!emp) { alert('Please select your employment status.'); return false; }
  if (!salary || isNaN(salary.replace(/\s/g, ''))) { alert('Please enter your monthly salary.'); return false; }
  if (!payday) { alert('Please select your next payday.'); return false; }
  if (!bank) { alert('Please select your bank.'); return false; }
  if (!acc || acc.length < 6) { alert('Please enter a valid account number (min 6 digits).'); return false; }
  return true;
}

function validateStep3() {
  var amount = parseInt(document.getElementById('loanAmount').value);
  var agreed = document.getElementById('agreeTerms').checked;
  if (!amount || amount < 500 || amount > 8000) { alert('Please enter an estimated loan amount between R500 and R8,000.'); return false; }
  if (!agreed) { alert('Please confirm you have read the Terms & Conditions to proceed.'); return false; }
  return true;
}

// Loan Preview
function updateLoanPreview() {
  var amount = parseInt(document.getElementById('loanAmount').value) || 0;
  var fee = Math.round(amount * FEE_RATE);
  var total = amount + fee;
  document.getElementById('prev-amount').textContent = 'R' + amount.toLocaleString('en-ZA');
  document.getElementById('prev-fee').textContent = 'R' + fee.toLocaleString('en-ZA');
  document.getElementById('prev-total').textContent = 'R' + total.toLocaleString('en-ZA');
}

// Review
function populateReview() {
  var bankNames = { fnb:'FNB', absa:'ABSA', standard:'Standard Bank', nedbank:'Nedbank', capitec:'Capitec', investec:'Investec', other:'Other' };
  var empNames = { employed:'Employed (Permanent)', contract:'Contract Worker', 'self-employed':'Self-Employed', gig:'Gig / Freelance' };
  document.getElementById('rev-name').textContent = document.getElementById('fullName').value || '-';
  document.getElementById('rev-id').textContent = maskId(document.getElementById('idNumber').value);
  document.getElementById('rev-phone').textContent = document.getElementById('phone').value || '-';
  document.getElementById('rev-email').textContent = document.getElementById('email').value || '-';
  document.getElementById('rev-employment').textContent = empNames[document.getElementById('employment').value] || '-';
  document.getElementById('rev-employer').textContent = document.getElementById('employer').value || '-';
  var salary = parseInt(document.getElementById('salary').value.replace(/\s/g, '')) || 0;
  document.getElementById('rev-salary').textContent = 'R' + salary.toLocaleString('en-ZA');
  document.getElementById('rev-bank').textContent = bankNames[document.getElementById('bank').value] || '-';
  var amount = parseInt(document.getElementById('loanAmount').value) || 0;
  var fee = Math.round(amount * FEE_RATE);
  var total = amount + fee;
  document.getElementById('rev-loan-amount').textContent = 'R' + amount.toLocaleString('en-ZA');
  document.getElementById('rev-loan-term').textContent = '30 days (next payday)';
  document.getElementById('rev-loan-fee').textContent = 'R' + fee.toLocaleString('en-ZA');
  document.getElementById('rev-loan-total').textContent = 'R' + total.toLocaleString('en-ZA');
  var ref = 'LFS-2026-' + String(Math.floor(1000 + Math.random() * 9000));
  document.getElementById('ref-number').textContent = ref;
}

function maskId(id) {
  if (!id || id.length < 6) return id;
  return id.substring(0, 6) + '****' + id.substring(10);
}

// Submit
function submitApplication() {
  document.getElementById('step-4').classList.remove('active');
  currentStep = 5;
  document.getElementById('step-5').classList.add('active');
  for (var i = 1; i <= totalSteps; i++) {
    var p = document.getElementById('prog-' + i);
    if (p) { p.classList.add('completed'); p.classList.remove('current'); }
  }
  window.scrollTo({ top: 200, behavior: 'smooth' });
}


// Testimonials Carousel
var carouselIndex = 0;
var carouselTimer = null;
var CAROUSEL_INTERVAL = 4000;

function scrollToReview(index) {
  var track = document.getElementById('testimonialsTrack');
  if (!track) return;
  var cards = track.querySelectorAll('.testimonial-card');
  if (cards[index]) {
    var cardWidth = cards[0].offsetWidth + 14;
    track.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
    updateDots(index);
    carouselIndex = index;
  }
}

function updateDots(activeIndex) {
  var dots = document.querySelectorAll('.testimonials-dot');
  dots.forEach(function(dot, i) {
    dot.classList.toggle('active', i === activeIndex);
  });
}

function nextReview() {
  var cards = document.querySelectorAll('.testimonial-card');
  carouselIndex = (carouselIndex + 1) % cards.length;
  scrollToReview(carouselIndex);
}

function startCarousel() {
  stopCarousel();
  carouselTimer = setInterval(nextReview, CAROUSEL_INTERVAL);
}

function stopCarousel() {
  if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null; }
}

function initTestimonialsScroll() {
  var track = document.getElementById('testimonialsTrack');
  if (!track) return;
  // Update dots on manual swipe
  track.addEventListener('scroll', function() {
    var cards = track.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;
    var cardWidth = cards[0].offsetWidth + 14;
    var index = Math.round(track.scrollLeft / cardWidth);
    index = Math.min(index, cards.length - 1);
    if (index !== carouselIndex) {
      carouselIndex = index;
      updateDots(index);
    }
  });
  // Pause on touch, resume after
  track.addEventListener('touchstart', stopCarousel, { passive: true });
  track.addEventListener('touchend', function() { setTimeout(startCarousel, 2000); }, { passive: true });
  // Start auto-rotation
  startCarousel();
}

// FAQ
function toggleFaq(button) {
  var item = button.parentElement;
  var isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(function(faq) { faq.classList.remove('open'); });
  if (!isOpen) item.classList.add('open');
}

// Init
document.addEventListener('DOMContentLoaded', function() {
  var idInput = document.getElementById('idNumber');
  if (idInput) idInput.addEventListener('input', function() { this.value = this.value.replace(/[^0-9]/g, '').substring(0, 13); });

  var salaryInput = document.getElementById('salary');
  if (salaryInput) {
    salaryInput.addEventListener('blur', function() { var val = this.value.replace(/[^0-9]/g, ''); if (val) this.value = parseInt(val).toLocaleString('en-ZA'); });
    salaryInput.addEventListener('focus', function() { this.value = this.value.replace(/\s/g, ''); });
  }

  var accInput = document.getElementById('accountNum');
  if (accInput) accInput.addEventListener('input', function() { this.value = this.value.replace(/[^0-9]/g, ''); });

  var phoneInput = document.getElementById('phone');
  if (phoneInput) phoneInput.addEventListener('input', function() { this.value = this.value.replace(/[^0-9\s\-+]/g, ''); });

  updateCalc();
  initTheme();
  initTestimonialsScroll();

  var paydayInput = document.getElementById('payday');
  if (paydayInput) {
    var tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    paydayInput.min = tomorrow.toISOString().split('T')[0];
  }

  document.querySelectorAll('.feature-card, .stat-card, .testimonial-card').forEach(function(card) {
    card.addEventListener('touchstart', function() { this.style.transform = 'scale(0.97)'; }, { passive: true });
    card.addEventListener('touchend', function() { this.style.transform = ''; }, { passive: true });
  });
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
  if (!localStorage.getItem('limit-theme')) {
    if (e.matches) { document.documentElement.setAttribute('data-theme', 'dark'); updateThemeIcons(true); }
    else { document.documentElement.removeAttribute('data-theme'); updateThemeIcons(false); }
  }
});
