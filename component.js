/**
 * FÜNF Bildungsbrücke — Central Component Loader
 * Dynamically injects Navbar and Footer across all pages.
 */

(function () {
  // 1. Inject Navbar
  const navbarElement = document.querySelector('.navbar');
  if (navbarElement) {
    navbarElement.innerHTML = `
      <div class="nav-container">
        <a href="index.html" class="nav-logo" aria-label="FÜNF Bildungsbrücke Home">
          <img src="images/logo-white.png" alt="FÜNF Bildungsbrücke Logo" class="logo-img" />
        </a>

        <nav class="nav-links" id="navLinks" role="navigation" aria-label="Main Navigation">
          <a href="index.html" class="nav-link" data-page="index.html">Home</a>
          <a href="courses.html" class="nav-link" data-page="courses.html">Courses</a>
          <a href="programs.html" class="nav-link" data-page="programs.html">Programs</a>
          <a href="about.html" class="nav-link" data-page="about.html">About</a>
          <a href="team.html" class="nav-link" data-page="team.html">Team</a>
          <a href="blog.html" class="nav-link" data-page="blog.html">Blog</a>
          <a href="contact.html" class="nav-link" data-page="contact.html">Contact</a>
        </nav>

        <div class="nav-actions">
          <a href="courses.html#advisor-form" class="btn btn-ghost">Free Assessment</a>
          <a href="index.html#demo-form" class="btn btn-primary">Book Consultation</a>
        </div>

        <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    `;

    // A. Dynamic Active Link Handling
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = navbarElement.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const dataPage = link.getAttribute('data-page');
      if (dataPage === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // B. Navbar Scroll Logo Swapping & Scrolled Class
    const logoImg = navbarElement.querySelector('.logo-img');
    const handleScrollLogo = () => {
      if (window.scrollY > 40) {
        navbarElement.classList.add('scrolled');
        if (logoImg) logoImg.src = 'images/logo.png';
      } else {
        navbarElement.classList.remove('scrolled');
        if (logoImg) logoImg.src = 'images/logo-white.png';
      }
    };

    window.addEventListener('scroll', handleScrollLogo, { passive: true });
    handleScrollLogo(); // Run immediately for initial page state
  }

  // 2. Inject Footer
  const footerElement = document.querySelector('.footer');
  if (footerElement) {
    footerElement.innerHTML = `
      <div class="footer-top">
        <div class="footer-container">
          <div class="footer-brand">
            <img src="images/logo-white.png" alt="FÜNF Bildungsbrücke" class="footer-logo" />
            <p>Germany's bridge for Indian learners — premium German language education and comprehensive Germany career
              guidance from certified experts.</p>
            <div class="footer-socials">
              <a href="#" class="fsocial" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" class="fsocial" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" class="fsocial" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75,15.02 15.5,12 9.75,8.98" fill="white" />
                </svg>
              </a>
              <a href="#" class="fsocial" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="#" class="fsocial" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          <div class="footer-links-group">
            <h4>Courses</h4>
            <ul>
              <li><a href="courses.html">A1 Beginner German</a></li>
              <li><a href="courses.html">A2 Elementary German</a></li>
              <li><a href="courses.html">B1 Intermediate German</a></li>
              <li><a href="courses.html">B2 Upper Intermediate</a></li>
              <li><a href="courses.html">C1 Advanced German</a></li>
              <li><a href="courses.html">C2 Mastery German</a></li>
              <li><a href="courses.html">Combo Packages</a></li>
            </ul>
          </div>

          <div class="footer-links-group">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="index.html#faculty">Our Faculty</a></li>
              <li><a href="index.html#success-stories">Success Stories</a></li>
              <li><a href="index.html#goethe">Goethe Preparation</a></li>
              <li><a href="index.html#study-germany">Study in Germany</a></li>
              <li><a href="index.html#faq">FAQs</a></li>
              <li><a href="contact.html">Contact Us</a></li>
              <li><a href="index.html#demo-form">Free Demo Class</a></li>
            </ul>
          </div>

          <div class="footer-contact-newsletter">
            <h4>Get in Touch</h4>
            <address>
              <p>📧 <a href="mailto:hello@funfbildungsbrucke.com">hello@funfbildungsbrucke.com</a></p>
              <p>📞 <a href="tel:+919876543210">+91 98765 43210</a></p>
              <p>💬 <a href="#">WhatsApp Us</a></p>
            </address>

            <div class="newsletter">
              <h4 style="margin-top:1.5rem;">Newsletter</h4>
              <p>Get free German tips, exam updates and study resources.</p>
              <form class="newsletter-form" aria-label="Newsletter subscription">
                <input type="email" placeholder="your@email.com" aria-label="Email for newsletter" required />
                <button type="submit" aria-label="Subscribe">→</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-container">
          <p>© 2026 FÜNF Bildungsbrücke. All rights reserved.</p>
          <div class="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Refund Policy</a>
          </div>
        </div>
      </div>
    `;
  }
})();
