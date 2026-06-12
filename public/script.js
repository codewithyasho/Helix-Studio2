/* ============================================
   HELIX STUDIOS — Main JavaScript
   Navigation, Scroll Animations, Form, Counters
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Preloader ----------
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 600);
  });
  // Fallback: hide preloader after 3s even if load event was missed
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 3000);

  // ---------- Navbar Scroll Effect ----------
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  const handleNavScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = currentScrollY;
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ---------- Active Nav Link on Scroll ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinksDesktop = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const navLinksMobile = document.querySelectorAll('.nav-mobile-overlay a');

  const updateActiveLink = () => {
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinksDesktop.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
        navLinksMobile.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ---------- Mobile Navigation ----------
  const hamburger = document.getElementById('navHamburger');
  const mobileOverlay = document.getElementById('navMobileOverlay');

  const toggleMobileNav = () => {
    hamburger.classList.toggle('active');
    mobileOverlay.classList.toggle('open');
    document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggleMobileNav);

  // Close mobile nav on link click
  mobileOverlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ---------- Smooth Scroll for All Internal Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---------- Scroll Reveal Animations (IntersectionObserver) ----------
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Optionally unobserve after revealing
          // revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- Counter Animation ----------
  const counterElements = document.querySelectorAll('.hero-stat-number[data-count]');
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;
    countersAnimated = true;

    counterElements.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const originalText = counter.textContent;
      // Detect suffix (e.g., M+, %, +)
      const suffix = originalText.replace(/[0-9]/g, '');
      const duration = 2000;
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        counter.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );
    statsObserver.observe(statsSection);
  }

  // ---------- Contact Form Handling ----------
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get values
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const phone = document.getElementById('contactPhone').value.trim() || 'Not provided';
      
      const serviceSelect = document.getElementById('contactService');
      const service = serviceSelect.options[serviceSelect.selectedIndex].text;
      
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !message) return;

      submitBtn.textContent = 'Redirecting to WhatsApp...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      const waNumber = '917972932416';
      const waMessage = `*New Lead from Helix Studio Website!* \n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Service:* ${service}\n\n*Message:*\n${message}`;
      const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

      setTimeout(() => {
        // Open WhatsApp in a new tab
        window.open(waLink, '_blank');
        
        // Reset form button state and show success message
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.innerHTML = 'Send Message <span class="btn-icon">→</span>';
        
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
      }, 800);
    });
  }

  // ---------- Parallax Glow Orbs on Mouse Move (Desktop only) ----------
  if (window.innerWidth > 768) {
    const orbs = document.querySelectorAll('.glow-orb');
    let mouseX = 0;
    let mouseY = 0;
    let orbX = 0;
    let orbY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    const animateOrbs = () => {
      orbX += (mouseX - orbX) * 0.02;
      orbY += (mouseY - orbY) * 0.02;

      orbs.forEach((orb, i) => {
        const factor = (i + 1) * 15;
        orb.style.transform = `translate(${orbX * factor}px, ${orbY * factor}px)`;
      });

      requestAnimationFrame(animateOrbs);
    };

    animateOrbs();
  }

  // ---------- Feature Card Tilt Effect on Touch/Hover (Mobile-friendly) ----------
  const featureCards = document.querySelectorAll('.feature-card, .process-step');

  featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'all 0.1s ease-out';
    });

    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth < 768) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'all 0.5s ease-out';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // ---------- Typing Effect for Hero Badge ----------
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) {
    const texts = ['Creative Agency', 'Content Studio', 'Growth Partner'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const badgePulse = heroBadge.querySelector('.badge-pulse');

    const typeEffect = () => {
      const current = texts[textIndex];

      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      // Preserve the pulse span
      heroBadge.innerHTML = '';
      if (badgePulse) heroBadge.appendChild(badgePulse.cloneNode(true));
      heroBadge.appendChild(document.createTextNode(current.substring(0, charIndex)));

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIndex === current.length) {
        speed = 2500; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        speed = 300;
      }

      setTimeout(typeEffect, speed);
    };

    // Start typing effect after initial animation
    setTimeout(typeEffect, 2500);
  }

  // ---------- Dynamic Jelly Cursor ----------
  const jellyCursor = document.querySelector('.jelly-cursor');
  const jellyText = document.querySelector('.jelly-cursor-text');
  
  if (jellyCursor && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    const animateJellyCursor = () => {
      let distX = mouseX - cursorX;
      let distY = mouseY - cursorY;
      
      cursorX += distX * 0.25;
      cursorY += distY * 0.25;
      
      // Calculate speed for jelly stretch effect
      let speed = Math.sqrt(distX * distX + distY * distY);
      let stretch = Math.min(speed * 0.003, 0.4); 
      let scaleX = 1 + stretch;
      let scaleY = 1 - (stretch * 0.5);
      
      // Angle of movement
      let angle = Math.atan2(distY, distX) * 180 / Math.PI;
      
      jellyCursor.style.transform = `translate(calc(${cursorX}px - 50%), calc(${cursorY}px - 50%)) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
      
      // Keep text upright and un-scaled
      if (jellyText) {
         jellyText.style.transform = `scale(${1/scaleX}, ${1/scaleY}) rotate(${-angle}deg)`;
      }
      
      requestAnimationFrame(animateJellyCursor);
    };
    animateJellyCursor();
    
    // Hover Effects
    const standardClickables = document.querySelectorAll('a, button, input, textarea, select');
    const videoCards = document.querySelectorAll('.reel-card');
    
    standardClickables.forEach(el => {
      el.addEventListener('mouseenter', () => jellyCursor.classList.add('hover-link'));
      el.addEventListener('mouseleave', () => jellyCursor.classList.remove('hover-link'));
    });
    
    videoCards.forEach(el => {
      el.addEventListener('mouseenter', () => {
        jellyCursor.classList.add('hover-video');
        if (jellyText) jellyText.textContent = 'PLAY';
      });
      el.addEventListener('mouseleave', () => {
        jellyCursor.classList.remove('hover-video');
        if (jellyText) jellyText.textContent = '';
      });
    });
  }

  // ---------- Cinematic Spectrum Scroll Animation ----------
  const spectrumTrack = document.querySelector('.spectrum-sticky-track');
  const spectrumPhases = document.querySelectorAll('.spectrum-phase');

  if (spectrumTrack && spectrumPhases.length > 0) {
    const handleSpectrumScroll = () => {

      const rect = spectrumTrack.getBoundingClientRect();
      const trackHeight = rect.height;
      const viewHeight = window.innerHeight;
      
      // Calculate how far we've scrolled inside the track
      // progress = 0 when track starts entering the sticky stage, 1 when it finishes scrolling past
      const scrolled = -rect.top;
      const scrollRange = trackHeight - viewHeight;
      let progress = scrolled / scrollRange;
      progress = Math.max(0, Math.min(1, progress));

      // 3 phases
      // Phase 1: 0.00 to 0.35
      // Phase 2: 0.35 to 0.70
      // Phase 3: 0.70 to 1.00
      let activeIndex = 0;
      if (progress > 0.35 && progress <= 0.70) {
        activeIndex = 1;
      } else if (progress > 0.70) {
        activeIndex = 2;
      }

      spectrumPhases.forEach((phase, index) => {
        phase.classList.remove('active', 'exit-up', 'enter-down');
        
        if (index === activeIndex) {
          phase.classList.add('active');
        } else if (index < activeIndex) {
          // It is an older phase, exit upward
          phase.classList.add('exit-up');
        } else {
          // It is a future phase, wait below
          phase.classList.add('enter-down');
        }
      });
    };

    window.addEventListener('scroll', handleSpectrumScroll, { passive: true });
    window.addEventListener('resize', handleSpectrumScroll, { passive: true });
    
    // Initial call to set active phase
    handleSpectrumScroll();
  }

});

// ---------- Reels Carousel ----------
function scrollReels(direction) {
  const carousel = document.getElementById('reelsCarousel');
  if (carousel) {
    const scrollAmount = carousel.clientWidth * 0.8;
    carousel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
  }
}

function togglePlay(card) {
  const video = card.querySelector('video');
  const allCards = document.querySelectorAll('.reel-card');
  
  if (video.paused) {
    // Pause other videos
    allCards.forEach(c => {
      if (c !== card) {
        const v = c.querySelector('video');
        if (v) {
          v.pause();
          c.classList.remove('playing');
        }
      }
    });
    
    video.play();
    card.classList.add('playing');
  } else {
    video.pause();
    card.classList.remove('playing');
  }
}
