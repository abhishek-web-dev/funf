/**
 * FÜNF Bildungsbrücke — Modern Interactive Controller
 * Native JS functionality custom-built for the original FUNF layout.
 */

document.addEventListener('DOMContentLoaded', () => {
  const safeInit = (name, fn) => {
    try {
      fn();
    } catch (e) {
      console.warn(`[FÜNF JS Warning] Failed to initialize ${name}:`, e.message);
    }
  };

  safeInit('Navbar', initNavbar);
  safeInit('Counters', initCounters);
  safeInit('ScrollReveal', initScrollReveal);
  safeInit('FaqAccordion', initFaqAccordion);
  safeInit('BookingForm', initBookingForm);
  safeInit('BackToTop', initBackToTop);
  safeInit('LevelFolders', initLevelFolders);
  safeInit('AdvisorForm', initAdvisorForm);
  safeInit('VideoTestimonials', initVideoTestimonials);
  safeInit('SyllabusModal', initSyllabusModal);
  safeInit('CourseSelection', initCourseSelection);
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
  const formsConfig = [
    {
      formId: 'demoForm',
      nameId: 'name',
      emailId: 'email',
      phoneId: 'phone',
      levelId: 'level',
      nameErrorId: 'name-error',
      emailErrorId: 'email-error',
      phoneErrorId: 'phone-error'
    },
    {
      formId: 'heroDemoForm',
      nameId: 'hero-name',
      emailId: 'hero-email',
      phoneId: 'hero-phone',
      levelId: 'hero-level',
      nameErrorId: 'hero-name-error',
      emailErrorId: 'hero-email-error',
      phoneErrorId: 'hero-phone-error'
    }
  ];

  formsConfig.forEach(cfg => {
    const form = document.getElementById(cfg.formId);
    if (!form) return;

    const nameInput = document.getElementById(cfg.nameId);
    const emailInput = document.getElementById(cfg.emailId);
    const phoneInput = document.getElementById(cfg.phoneId);
    const levelInput = document.getElementById(cfg.levelId);

    const nameError = document.getElementById(cfg.nameErrorId);
    const emailError = document.getElementById(cfg.emailErrorId);
    const phoneError = document.getElementById(cfg.phoneErrorId);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset error styling and messages
      if (nameError) nameError.textContent = '';
      if (emailError) emailError.textContent = '';
      if (phoneError) phoneError.textContent = '';
      if (nameInput) nameInput.classList.remove('error');
      if (emailInput) emailInput.classList.remove('error');
      if (phoneInput) phoneInput.classList.remove('error');

      // Validate Name
      if (nameInput && !nameInput.value.trim()) {
        if (nameError) nameError.textContent = 'Full Name is required.';
        nameInput.classList.add('error');
        isValid = false;
      }

      // Validate Email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput && !emailInput.value.trim()) {
        if (emailError) emailError.textContent = 'Email Address is required.';
        emailInput.classList.add('error');
        isValid = false;
      } else if (emailInput && !emailPattern.test(emailInput.value.trim())) {
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
        emailInput.classList.add('error');
        isValid = false;
      }

      // Validate Phone
      const phonePattern = /^\+?[0-9\s\-]{8,20}$/;
      if (phoneInput && !phoneInput.value.trim()) {
        if (phoneError) phoneError.textContent = 'Phone Number is required.';
        phoneInput.classList.add('error');
        isValid = false;
      } else if (phoneInput && !phonePattern.test(phoneInput.value.trim())) {
        if (phoneError) phoneError.textContent = 'Please enter a valid phone number.';
        phoneInput.classList.add('error');
        isValid = false;
      }

      if (!isValid) return;

      // Hide Form and show Form Success message (styled using existing css classes)
      form.style.display = 'none';
      
      const formCard = form.closest('.demo-form-card') || form.closest('.hero-form-card');
      const titleElement = formCard.querySelector('h3') || formCard.querySelector('.form-card-header');
      if (titleElement) titleElement.style.display = 'none';

      // Insert success message container inside formCard
      const isHeroForm = form.id === 'heroDemoForm';
      const textColor = isHeroForm ? 'var(--text-body)' : 'rgba(255,255,255,0.85)';
      const titleColor = isHeroForm ? 'var(--text-primary)' : 'var(--white)';

      const successMsg = document.createElement('div');
      successMsg.className = 'form-success-msg show';
      successMsg.style.textAlign = 'center';
      successMsg.style.padding = '1.5rem 0';
      successMsg.innerHTML = `
        <div class="success-icon" style="color: var(--cyan); font-size: 3rem; margin-bottom: 1rem;">✓</div>
        <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: ${titleColor};">Demo Class Booked!</h4>
        <p style="font-size: 0.9375rem; color: ${textColor}; line-height: 1.6;">
          Thank you, <strong>${escapeHTML(nameInput.value.trim())}</strong>. A senior level advisor will reach out to you within 2 hours to confirm your assessment slot.
        </p>
      `;
      formCard.appendChild(successMsg);
    });
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

      // Show target panel and scroll to it
      const targetPanel = document.getElementById(`panel-${target}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

/**
 * 10. Syllabus Data and Modal Controller
 */
const syllabusData = {
  a1: {
    title: "German A1 Course Syllabus (Beginner)",
    subtitle: "Complete foundation course mapping to Goethe-Zertifikat A1 requirements.",
    ctaText: "Enroll in A1 Beginner Course",
    content: `
      <h4>1. Core Communication Skills</h4>
      <ul>
        <li>Introduce yourself, friends, and family members.</li>
        <li>Spell names, state phone numbers, and use German cardinal/ordinal numbers.</li>
        <li>Ask for and give directions, and inquire about prices or times.</li>
        <li>Write basic emails, text messages, and fill out standard registry forms.</li>
      </ul>
      <h4>2. Grammar Focus</h4>
      <ul>
        <li>Verb conjugation in Present Tense (Präsens) for regular/irregular verbs.</li>
        <li>Sentence structure: Main clauses (Hauptsatz) and question forms (W-Fragen, Ja/Nein Fragen).</li>
        <li>Cases: Nominative and Accusative declensions.</li>
        <li>Definite, indefinite, and negative articles (der/die/das, ein/eine, kein/keine).</li>
      </ul>
      <h4>3. Main Vocabulary Themes</h4>
      <ul>
        <li>Greetings, family, occupations, food & beverages, hobbies, and shopping.</li>
      </ul>
      <h4>4. Course Books & Materials</h4>
      <ul>
        <li>Netzwerk neu A1 (Kursbuch + Arbeitsbuch) + Hueber intensive trainer.</li>
      </ul>
    `
  },
  a2: {
    title: "German A2 Course Syllabus (Elementary)",
    subtitle: "Elevate your fluency to standard everyday situations and basic routines.",
    ctaText: "Enroll in A2 Elementary Course",
    content: `
      <h4>1. Core Communication Skills</h4>
      <ul>
        <li>Describe past activities, routines, and personal background.</li>
        <li>Conduct basic shopping transactions and make appointments in German.</li>
        <li>Understand simple advertisements, travel notices, and restaurant menus.</li>
        <li>Write routine notes, letters, and emails regarding work or housing.</li>
      </ul>
      <h4>2. Grammar Focus</h4>
      <ul>
        <li>Past tense of helper verbs (haben/sein) and modal verbs (Präteritum).</li>
        <li>Perfect tense (Perfekt) for active daily speech patterns.</li>
        <li>The Dative case (Dativ) and dative personal pronouns.</li>
        <li>Prepositions: Accusative, Dative, and two-way prepositions (Wechselpräpositionen).</li>
      </ul>
      <h4>3. Main Vocabulary Themes</h4>
      <ul>
        <li>Living spaces, daily routines, health & body, media & technology, and holidays.</li>
      </ul>
      <h4>4. Course Books & Materials</h4>
      <ul>
        <li>Netzwerk neu A2 (Kursbuch + Arbeitsbuch) + Goethe A2 practice papers.</li>
      </ul>
    `
  },
  b1: {
    title: "German B1 Course Syllabus (Intermediate)",
    subtitle: "The crucial visa and workplace entry level. Independent language usage.",
    ctaText: "Enroll in B1 Intermediate Course",
    content: `
      <h4>1. Core Communication Skills</h4>
      <ul>
        <li>Handle most travel, school, and work situations in German-speaking countries.</li>
        <li>Express hopes, dreams, goals, and provide reasoning for personal choices.</li>
        <li>Deliver short structured oral presentations on familiar abstract topics.</li>
        <li>Write comprehensive reviews, formal complaints, and motivational letters.</li>
      </ul>
      <h4>2. Grammar Focus</h4>
      <ul>
        <li>Subordinate clauses (dass, weil, wenn, obwohl, damit clauses).</li>
        <li>Passive Voice (Passiv) in present and simple past.</li>
        <li>Relative clauses and relative pronouns (Relativsätze).</li>
        <li>Subjunctive II (Konjunktiv II) for polite requests and hypothetical scenarios.</li>
      </ul>
      <h4>3. Main Vocabulary Themes</h4>
      <ul>
        <li>Workplace environment, environment & climate, relationships, history, and education systems.</li>
      </ul>
      <h4>4. Course Books & Materials</h4>
      <ul>
        <li>Aspekte Neu B1 plus / Studio d B1 + FÜNF Exam-Simulator suite.</li>
      </ul>
    `
  },
  b2: {
    title: "German B2 Course Syllabus (Upper-Intermediate)",
    subtitle: "Professional readiness, nursing license pathway, and business operations.",
    ctaText: "Enroll in B2 Upper-Int. Course",
    content: `
      <h4>1. Core Communication Skills</h4>
      <ul>
        <li>Follow complex technical discussions in your field of engineering or IT.</li>
        <li>Speak fluently and spontaneously with native German speakers without strain.</li>
        <li>Draft clear, well-structured text on a wide range of subjects.</li>
        <li>Compare advantages and disadvantages of different proposals or arguments.</li>
      </ul>
      <h4>2. Grammar Focus</h4>
      <ul>
        <li>Noun-verb combinations (Nomen-Verb-Verbindungen).</li>
        <li>Alternative passive structures (sein + zu + Infinitiv, -bar/-lich suffixes).</li>
        <li>Advanced connectors (nicht nur... sondern auch, je... desto).</li>
        <li>Subjunctive I (Konjunktiv I) for indirect speech.</li>
      </ul>
      <h4>3. Main Vocabulary Themes</h4>
      <ul>
        <li>Technical workflows, medical terms (for nurses), business presentations, and politics.</li>
      </ul>
      <h4>4. Course Books & Materials</h4>
      <ul>
        <li>Aspekte Neu B2 / Erkundungen B2 + Medical German modules (for nurses).</li>
      </ul>
    `
  },
  c1: {
    title: "German C1 Course Syllabus (Advanced)",
    subtitle: "Academic and executive level. Deep comprehension of advanced texts.",
    ctaText: "Enroll in C1 Advanced Course",
    content: `
      <h4>1. Core Communication Skills</h4>
      <ul>
        <li>Understand a wide range of demanding, longer texts, and recognize implicit meaning.</li>
        <li>Express ideas fluently and spontaneously without much obvious searching for expressions.</li>
        <li>Use language flexibly and effectively for social, academic and professional purposes.</li>
        <li>Produce clear, well-structured, detailed text on complex subjects.</li>
      </ul>
      <h4>2. Grammar Focus</h4>
      <ul>
        <li>Subjective modal verbs (Vermutungen).</li>
        <li>Extended noun attributes (Erweiterte Partizipialattribute).</li>
        <li>Sentence-connecting adverbs and nominal style versus verbal style.</li>
        <li>Advanced particles and stylistic nuances.</li>
      </ul>
      <h4>3. Main Vocabulary Themes</h4>
      <ul>
        <li>Higher education, philosophy, science & research, globalization, and corporate culture.</li>
      </ul>
      <h4>4. Course Books & Materials</h4>
      <ul>
        <li>Erkundungen C1 / Hueber C1 Textbooks + TestDaF mock simulators.</li>
      </ul>
    `
  },
  c2: {
    title: "German C2 Course Syllabus (Mastery)",
    subtitle: "Bilingual competence. Near-native precision and complete integration.",
    ctaText: "Enroll in C2 Mastery Course",
    content: `
      <h4>1. Core Communication Skills</h4>
      <ul>
        <li>Understand with ease virtually everything heard or read in German.</li>
        <li>Summarize information from different spoken and written sources.</li>
        <li>Reconstruct arguments and accounts in a coherent, polished presentation.</li>
        <li>Express yourself spontaneously, very fluently and precisely, differentiating finer shades of meaning.</li>
      </ul>
      <h4>2. Grammar Focus</h4>
      <ul>
        <li>Complete mastery of all syntactic patterns in German.</li>
        <li>Creative and rhetorical styling structures.</li>
        <li>Advanced text cohesion, idioms, and stylistic variations.</li>
        <li>High-level editorial translation structures.</li>
      </ul>
      <h4>3. Main Vocabulary Themes</h4>
      <ul>
        <li>Literature, legal documentation, political debate, linguistic research, and diplomacy.</li>
      </ul>
      <h4>4. Course Books & Materials</h4>
      <ul>
        <li>Hueber C2 books, literature extracts, and personalized executive materials.</li>
      </ul>
    `
  }
};

function initSyllabusModal() {
  const modal = document.getElementById('syllabusModal');
  const closeBtn = document.getElementById('closeSyllabusModalBtn');
  const backdrop = modal ? modal.querySelector('.syllabus-modal-backdrop') : null;
  const syllabusButtons = document.querySelectorAll('.view-syllabus-btn');
  
  if (!modal || syllabusButtons.length === 0) return;

  const modalTitle = document.getElementById('syllabus-modal-title');
  const modalSubtitle = document.getElementById('syllabus-modal-subtitle');
  const modalBody = document.getElementById('syllabusModalBody');
  const modalCTA = document.getElementById('syllabusModalCTA');

  // Open Modal function
  const openModal = (level) => {
    const data = syllabusData[level];
    if (!data) return;

    if (modalTitle) modalTitle.textContent = data.title;
    if (modalSubtitle) modalSubtitle.textContent = data.subtitle;
    if (modalBody) modalBody.innerHTML = data.content;
    
    if (modalCTA) {
      modalCTA.textContent = data.ctaText;
      modalCTA.setAttribute('href', '#advisor-form');
      modalCTA.setAttribute('data-target-level', level); // Store level for pre-select logic
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  // Close Modal function
  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Add click listeners to level syllabus buttons
  syllabusButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const level = btn.getAttribute('data-level');
      if (level) openModal(level);
    });
  });

  // Wire close actions
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // Close on Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Clicking CTA inside modal should close modal and auto-select
  if (modalCTA) {
    modalCTA.addEventListener('click', () => {
      const level = modalCTA.getAttribute('data-target-level');
      closeModal();
      if (level) {
        // Run select logic after a short delay so modal animation completes
        setTimeout(() => {
          selectTargetPathway(level);
        }, 300);
      }
    });
  }
}

/**
 * 11. Form Pre-selection & Scroll-to Linker
 */
function initCourseSelection() {
  const enrollButtons = document.querySelectorAll('.enroll-course-btn');
  if (enrollButtons.length === 0) return;

  enrollButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const level = btn.getAttribute('data-level');
      if (level) {
        selectTargetPathway(level);
      }
    });
  });
}

function selectTargetPathway(level) {
  const selectEl = document.getElementById('adv-pathway');
  if (!selectEl) return;

  const mapping = {
    'a1': 'spousal',
    'a2': 'a2-conversational',
    'b1': 'ausbildung',
    'b2': 'nurse',
    'c1': 'student',
    'c2': 'c2-mastery'
  };

  const targetValue = mapping[level.toLowerCase()];
  if (targetValue) {
    selectEl.value = targetValue;
    
    // Smooth scroll to advisor form
    const formSection = document.getElementById('advisor-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Highlight the selection dropdown
    selectEl.classList.add('pulse-highlight');
    
    // Add micro-feedback text
    let feedback = document.getElementById('pathway-feedback-msg');
    if (!feedback) {
      feedback = document.createElement('span');
      feedback.id = 'pathway-feedback-msg';
      feedback.style.display = 'block';
      feedback.style.fontSize = '0.8rem';
      feedback.style.fontWeight = '600';
      feedback.style.color = 'var(--warm-gold)';
      feedback.style.marginTop = '0.5rem';
      selectEl.parentNode.appendChild(feedback);
    }
    
    feedback.textContent = `✓ Pre-selected option automatically based on your ${level.toUpperCase()} Course interest!`;

    // Remove the highlight animation after 2.5 seconds
    setTimeout(() => {
      selectEl.classList.remove('pulse-highlight');
    }, 2500);
  }
}
