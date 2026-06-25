/**
 * FÜNF Bildungsbrücke — Modern Interactive Controller
 * Native JS functionality custom-built for the original FUNF layout.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initScrollReveal();
  initFaqAccordion();
  initBookingForm();
  initBackToTop();
  initLevelFolders();
  initAdvisorForm();
  initVideoTestimonials();
});

/**
 * 1. Mobile Navigation
 * - Hamburger menu toggle (open class)
 * - Open/close navigation drawer (nav-open class)
 * - Close menu when navigation link is clicked
 * - Close menu when clicking outside
 */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // A. Navbar Scroll Behavior (adds .scrolled class)
  if (navbar) {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // B. Mobile Hamburger & Drawer Toggle
  if (hamburger && navLinks) {
    const toggleMenu = () => {
      const isOpen = hamburger.classList.toggle('open');
      navLinks.classList.toggle('nav-open');
      hamburger.setAttribute('aria-expanded', String(isOpen));
    };

    const closeMenu = () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('nav-open');
      hamburger.setAttribute('aria-expanded', 'false');
    };

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when navigation link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      const target = e.target;
      const isClickInsideMenu = navLinks.contains(target);
      const isClickOnHamburger = hamburger.contains(target);

      if (!isClickInsideMenu && !isClickOnHamburger && navLinks.classList.contains('nav-open')) {
        closeMenu();
      }
    });
  }
}

/**
 * 2. Statistics Counter Animation
 * - Animate stat numbers from 0 to target value
 * - Trigger once when section becomes visible
 * - Smooth easing animation
 */
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-num');
  if (statNumbers.length === 0) return;

  let animated = false;

  const countUp = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const isDecimal = el.getAttribute('data-decimal') === 'true';
    const duration = 2000; // ms
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutQuad
      const easeProgress = progress * (2 - progress);
      const currentValue = easeProgress * target;

      if (isDecimal) {
        el.textContent = currentValue.toFixed(1);
      } else {
        el.textContent = Math.floor(currentValue).toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCount);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(countUp);
        observer.disconnect();
      }
    });
  }, { threshold: 0.15 });

  const statsContainer = document.querySelector('.hero-stats');
  if (statsContainer) {
    observer.observe(statsContainer);
  } else {
    statNumbers.forEach(num => observer.observe(num));
  }
}

/**
 * 3. Scroll Reveal Animations
 * - Use IntersectionObserver
 * - Trigger animations only when elements enter viewport (adding .animated)
 * - No layout shifts
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('[data-animate]');
  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || '0';
        setTimeout(() => {
          entry.target.classList.add('animated');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * 4. FAQ Accordion
 * - Expand/collapse answers
 * - Only required functionality
 * - Smooth transitions (open/close panels and aria-expanded)
 */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all other FAQ items
      document.querySelectorAll('.faq-item').forEach(otherItem => {
        const otherBtn = otherItem.querySelector('.faq-question');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        
        otherBtn.setAttribute('aria-expanded', 'false');
        otherAnswer.classList.remove('open');
        otherAnswer.style.maxHeight = null;
      });

      // Toggle current item
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        btn.setAttribute('aria-expanded', 'false');
        answer.classList.remove('open');
        answer.style.maxHeight = null;
      }
    });
  });
}

/**
 * 5. Demo Form Validation
 * - Validate required fields
 * - Show inline validation messages
 * - Prevent empty submissions
 */
function initBookingForm() {
  const form = document.getElementById('demoForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const levelInput = document.getElementById('level');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const phoneError = document.getElementById('phone-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset error styling and messages
    nameError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';
    nameInput.classList.remove('error');
    emailInput.classList.remove('error');
    phoneInput.classList.remove('error');

    // Validate Name
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Full Name is required.';
      nameInput.classList.add('error');
      isValid = false;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Email Address is required.';
      emailInput.classList.add('error');
      isValid = false;
    } else if (!emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      emailInput.classList.add('error');
      isValid = false;
    }

    // Validate Phone
    const phonePattern = /^\+?[0-9\s\-]{8,20}$/;
    if (!phoneInput.value.trim()) {
      phoneError.textContent = 'Phone Number is required.';
      phoneInput.classList.add('error');
      isValid = false;
    } else if (!phonePattern.test(phoneInput.value.trim())) {
      phoneError.textContent = 'Please enter a valid phone number.';
      phoneInput.classList.add('error');
      isValid = false;
    }

    if (!isValid) return;

    // Hide Form and show Form Success message (styled using existing css classes)
    form.style.display = 'none';
    
    const formCard = form.closest('.demo-form-card');
    const titleElement = formCard.querySelector('h3');
    if (titleElement) titleElement.style.display = 'none';

    // Insert success message container inside formCard
    const successMsg = document.createElement('div');
    successMsg.className = 'form-success-msg show';
    successMsg.innerHTML = `
      <div class="success-icon" style="color: var(--cyan); font-size: 3rem; margin-bottom: 1rem;">✓</div>
      <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--white);">Demo Class Booked!</h4>
      <p style="font-size: 0.9375rem; color: rgba(255,255,255,0.85); line-height: 1.6;">
        Thank you, <strong>${escapeHTML(nameInput.value.trim())}</strong>. A senior level advisor will reach out to you within 2 hours to confirm your assessment slot.
      </p>
    `;
    formCard.appendChild(successMsg);
  });

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}

/**
 * 6. Smooth Scroll Back to Top
 */
function initBackToTop() {
  const backTopBtn = document.getElementById('backTop');
  if (!backTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backTopBtn.classList.add('visible');
    } else {
      backTopBtn.classList.remove('visible');
    }
  });

  backTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 7. CEFR Level Folders Tab Selector
 */
function initLevelFolders() {
  const tabButtons = document.querySelectorAll('.folder-tab-btn');
  if (tabButtons.length === 0) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (!target) return;

      // Reset all buttons
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      // Set current active button
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Hide all panels
      document.querySelectorAll('.folder-panel-content').forEach(panel => {
        panel.classList.remove('active');
      });

      // Show target panel
      const targetPanel = document.getElementById(`panel-${target}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/**
 * 8. Germany Advisor Consultation Form Validation
 */
function initAdvisorForm() {
  const form = document.getElementById('advisorForm');
  if (!form) return;

  const nameInput = document.getElementById('adv-name');
  const emailInput = document.getElementById('adv-email');
  const phoneInput = document.getElementById('adv-phone');
  const pathwayInput = document.getElementById('adv-pathway');

  const nameError = document.getElementById('adv-name-error');
  const emailError = document.getElementById('adv-email-error');
  const phoneError = document.getElementById('adv-phone-error');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset error messages and styles
    nameError.textContent = '';
    emailError.textContent = '';
    phoneError.textContent = '';
    nameInput.classList.remove('error');
    emailInput.classList.remove('error');
    phoneInput.classList.remove('error');

    // Name check
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Full Name is required.';
      nameInput.classList.add('error');
      isValid = false;
    }

    // Email check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Email Address is required.';
      emailInput.classList.add('error');
      isValid = false;
    } else if (!emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      emailInput.classList.add('error');
      isValid = false;
    }

    // Phone check
    const phonePattern = /^\+?[0-9\s\-]{8,20}$/;
    if (!phoneInput.value.trim()) {
      phoneError.textContent = 'Phone Number is required.';
      phoneInput.classList.add('error');
      isValid = false;
    } else if (!phonePattern.test(phoneInput.value.trim())) {
      phoneError.textContent = 'Please enter a valid phone number.';
      phoneInput.classList.add('error');
      isValid = false;
    }

    if (!isValid) return;

    // Transition form to success
    form.style.display = 'none';

    const cardContainer = form.closest('.form-wrapper-card');
    const headerTitle = cardContainer.querySelector('h3');
    if (headerTitle) headerTitle.style.display = 'none';

    // Insert feedback message
    const successBox = document.createElement('div');
    successBox.className = 'form-success-box';
    successBox.style.textAlign = 'center';
    successBox.style.padding = '1.5rem 0';
    successBox.innerHTML = `
      <div class="success-check-mark" style="color: var(--cyan); font-size: 3rem; margin-bottom: 1rem;">✓</div>
      <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--navy);">Pathway Session Booked!</h4>
      <p style="font-size: 0.95rem; color: var(--text-body); line-height: 1.6;">
        Thank you, <strong>${escapeHTML(nameInput.value.trim())}</strong>. A FÜNF Germany Pathway Advisor has received your details and will call/message you within 2 hours to confirm your personalized level assessment.
      </p>
    `;
    cardContainer.appendChild(successBox);
  });

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}

/**
 * 9. Interactive Video Testimonials Modal
 * - Open modal, load custom details (name, level, photo) from data-attributes
 * - Simulate actual timeline progress (0 to 30s) with ticking counter and timeline bar
 * - Escape key, close button, and background clicking close handlers
 */
function initVideoTestimonials() {
  const thumbnails = document.querySelectorAll('.testimonial-video-thumbnail');
  const modal = document.getElementById('videoModal');
  if (!modal || thumbnails.length === 0) return;

  const posterImg = document.getElementById('modalVideoPoster');
  const centerPlayBtn = document.getElementById('playerCenterPlayBtn');
  const footerPlayBtn = document.getElementById('playerPlayPauseBtn');
  const playIcon = document.getElementById('playIconSvg');
  const pauseIcon = document.getElementById('pauseIconSvg');
  const progressBar = document.getElementById('playerProgressBar');
  const currentTimeTxt = document.getElementById('playerCurrentTime');
  const levelBadge = document.getElementById('modalStudentLevel');
  const studentNameTxt = document.getElementById('modalStudentName');
  const studentRoleTxt = document.getElementById('modalStudentRole');
  const studentQuoteTxt = document.getElementById('modalStudentQuote');
  const closeBtn = document.getElementById('closeModalBtn');
  const backdrop = modal.querySelector('.video-modal-backdrop');
  const progressContainer = document.getElementById('playerProgressContainer');

  let isPlaying = false;
  let currentTime = 0;
  const duration = 30; // 30 seconds duration
  let playInterval = null;

  // Open Modal on thumbnail click
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const name = thumb.getAttribute('data-student-name');
      const role = thumb.getAttribute('data-student-role');
      const level = thumb.getAttribute('data-student-level');
      const quote = thumb.getAttribute('data-student-quote');
      const src = thumb.getAttribute('data-video-src');

      // Populate data
      if (studentNameTxt) studentNameTxt.textContent = name;
      if (studentRoleTxt) studentRoleTxt.textContent = role;
      if (levelBadge) levelBadge.textContent = level;
      if (studentQuoteTxt) studentQuoteTxt.textContent = `"${quote}"`;
      if (posterImg && src) posterImg.src = src;

      // Open Modal
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      resetPlayer();
    });
  });

  // Close Modal functions
  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    pausePlayer();
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Close on Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Play/Pause Action Toggle
  const togglePlay = () => {
    if (isPlaying) {
      pausePlayer();
    } else {
      startPlayer();
    }
  };

  if (centerPlayBtn) centerPlayBtn.addEventListener('click', togglePlay);
  if (footerPlayBtn) footerPlayBtn.addEventListener('click', togglePlay);

  // Allow clicking on progress timeline container to scrub simulated video
  if (progressContainer) {
    progressContainer.addEventListener('click', (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = Math.max(0, Math.min(1, clickX / width));
      currentTime = percentage * duration;
      updateTimeDisplay();
      if (isPlaying) {
        // If playing, keep playing from new time
        clearInterval(playInterval);
        playInterval = setInterval(tickPlayback, 100);
      }
    });
  }

  function startPlayer() {
    isPlaying = true;
    if (playIcon) playIcon.classList.add('d-none');
    if (pauseIcon) pauseIcon.classList.remove('d-none');
    if (centerPlayBtn) centerPlayBtn.style.opacity = '0';
    if (centerPlayBtn) centerPlayBtn.style.pointerEvents = 'none';

    clearInterval(playInterval);
    playInterval = setInterval(tickPlayback, 100);
  }

  function pausePlayer() {
    isPlaying = false;
    if (playIcon) playIcon.classList.remove('d-none');
    if (pauseIcon) pauseIcon.classList.add('d-none');
    if (centerPlayBtn) {
      centerPlayBtn.style.opacity = '1';
      centerPlayBtn.style.pointerEvents = 'auto';
    }

    clearInterval(playInterval);
  }

  function resetPlayer() {
    pausePlayer();
    currentTime = 0;
    updateTimeDisplay();
  }

  function tickPlayback() {
    currentTime += 0.1;
    if (currentTime >= duration) {
      currentTime = duration;
      resetPlayer();
    } else {
      updateTimeDisplay();
    }
  }

  function updateTimeDisplay() {
    const progressPercent = (currentTime / duration) * 100;
    if (progressBar) progressBar.style.width = progressPercent + '%';

    const seconds = Math.floor(currentTime);
    const displaySec = seconds < 10 ? '0' + seconds : seconds;
    if (currentTimeTxt) currentTimeTxt.textContent = `0:${displaySec}`;
  }
}
