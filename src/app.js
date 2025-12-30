// ========================================
// Luxe Dark Portfolio - Interactive Elements
// ========================================

// Configuration Constants
const CONFIG = {
  // Cursor animation
  CURSOR_SMOOTHING_OUTER: 0.15,
  CURSOR_SMOOTHING_INNER: 0.5,
  
  // Magnetic effect
  MAGNETIC_DISTANCE_THRESHOLD: 100,
  MAGNETIC_TRANSLATE_MULTIPLIER: 0.3,
  
  // Scroll
  SCROLL_THRESHOLD: 300,
  SCROLL_OFFSET: 200,
  SCROLL_DURATION: 1.5,
  SCROLL_OFFSET_ANCHOR: -100,
  
  // Lenis smooth scroll
  LENIS_DURATION: 1.2,
  LENIS_MOUSE_MULTIPLIER: 1,
  LENIS_TOUCH_MULTIPLIER: 2,
  
  // Tilt effect
  TILT_ROTATION_MULTIPLIER: 10,
  TILT_ANIMATION_DURATION: 0.5,
  TILT_PERSPECTIVE: 1000,
  
  // GSAP animations
  ANIMATION_DURATION_SHORT: 0.6,
  ANIMATION_DURATION_MEDIUM: 1,
  ANIMATION_DURATION_LONG: 1.2,
  ANIMATION_DURATION_EXTRA_LONG: 1.5,
  ANIMATION_STAGGER_AMOUNT: 0.8,
  ANIMATION_STAGGER_DELAY: 0.1,
  ANIMATION_STAGGER_PROJECT: 0.2,
  
  // Three.js particles
  PARTICLE_COUNT: 1000,
  PARTICLE_SPREAD: 10,
  PARTICLE_SIZE: 0.02,
  PARTICLE_OPACITY: 0.6,
  PARTICLE_ROTATION_SPEED_Y: 0.05,
  PARTICLE_ROTATION_SPEED_X: 0.03,
  CAMERA_DISTANCE: 3,
  CAMERA_PARALLAX_MULTIPLIER: 0.5,
  
  // Form submission
  FORM_SUBMIT_DELAY: 2000,
  FORM_SUCCESS_DISPLAY_TIME: 3000,
  
  // Initialization delays
  INIT_DELAY_SHORT: 100,
  INIT_DELAY_MEDIUM: 500,
  INIT_DELAY_LONG: 2000,
  
  // Scroll trigger positions
  SCROLL_TRIGGER_START_TOP: 'top 80%',
  SCROLL_TRIGGER_START_70: 'top 70%',
  SCROLL_TRIGGER_END: 'top 20%',
  SCROLL_TRIGGER_LEFT: 'left 80%',
  
  // Animation easing
  EASING_POWER2: 'power2.out',
  EASING_POWER3: 'power3.out',
  EASING_POWER4: 'power4.out',
  EASING_BACK: 'back.out(1.2)',
  EASING_BACK_STRONG: 'back.out(1.7)',
  
  // Scale values
  SCALE_SMALL: 0.8,
  SCALE_NORMAL: 0.9,
  SCALE_LARGE: 0.98,
  SCALE_FULL: 1,
  
  // Opacity values
  OPACITY_HIDDEN: 0,
  OPACITY_VISIBLE: 1,
  OPACITY_SEMI: 0.8,
  
  // Rotation values
  ROTATION_START: -180,
  ROTATION_END: 0,
  
  // Liquid ripple
  RIPPLE_REMOVE_DELAY: 600
};

/**
 * Initialize 3D tilt effect on an element
 * @param {HTMLElement} element - The element to apply tilt effect to
 */
function initTiltEffect(element) {
  element.addEventListener('mousemove', (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;
    
    const rotateX = percentY * CONFIG.TILT_ROTATION_MULTIPLIER;
    const rotateY = percentX * -CONFIG.TILT_ROTATION_MULTIPLIER;
    
    gsap.to(element, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: CONFIG.TILT_ANIMATION_DURATION,
      ease: CONFIG.EASING_POWER2,
      transformPerspective: CONFIG.TILT_PERSPECTIVE
    });
  });
  
  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      rotateX: CONFIG.ROTATION_END,
      rotateY: CONFIG.ROTATION_END,
      duration: CONFIG.TILT_ANIMATION_DURATION,
      ease: CONFIG.EASING_POWER2
    });
  });
}

/**
 * Main initialization function for the portfolio
 * Initializes all interactive elements, animations, and effects
 * @returns {void}
 */
function initializePortfolio() {
  if (window.portfolioInitialized) {
    return;
  }
  window.portfolioInitialized = true;
  // Initialize smooth scroll with Lenis
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
    duration: CONFIG.LENIS_DURATION,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: CONFIG.LENIS_MOUSE_MULTIPLIER,
    smoothTouch: false,
    touchMultiplier: CONFIG.LENIS_TOUCH_MULTIPLIER,
    infinite: false,
    });
    
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ========================================
  // Custom Cursor
  // ========================================
  
  const cursor = document.createElement('div');
  const cursorDot = document.createElement('div');
  cursor.className = 'cursor';
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursor);
  document.body.appendChild(cursorDot);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let dotX = 0;
  let dotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  /**
   * Animates the custom cursor with smooth interpolation
   * @returns {void}
   */
  function animateCursor() {
    // Outer cursor
    cursorX += (mouseX - cursorX) * CONFIG.CURSOR_SMOOTHING_OUTER;
    cursorY += (mouseY - cursorY) * CONFIG.CURSOR_SMOOTHING_OUTER;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    // Inner dot
    dotX += (mouseX - dotX) * CONFIG.CURSOR_SMOOTHING_INNER;
    dotY += (mouseY - dotY) * CONFIG.CURSOR_SMOOTHING_INNER;
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor hover effects
  const hoverElements = document.querySelectorAll('a, button, .magnetic');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorDot.style.opacity = '1';
  });

  // ========================================
  // Magnetic Buttons
  // ========================================

  const magneticElements = document.querySelectorAll('.magnetic');
  
  magneticElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    el.addEventListener('mousemove', (e) => {
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      
      if (distance < CONFIG.MAGNETIC_DISTANCE_THRESHOLD) {
        const translateX = distX * CONFIG.MAGNETIC_TRANSLATE_MULTIPLIER;
        const translateY = distY * CONFIG.MAGNETIC_TRANSLATE_MULTIPLIER;
        el.style.transform = `translate(${translateX}px, ${translateY}px)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });

  // ========================================
  // Header Morph to Floating Glass Nav
  // ========================================

  const header = document.querySelector('.site-header');
  const floatingNav = document.querySelector('.floating-nav');
  const floatingLinks = document.querySelectorAll('.floating-links a');
  
  let lastScrollY = 0;
  const scrollThreshold = CONFIG.SCROLL_THRESHOLD;

  /**
   * Updates the active navigation link based on current scroll position
   * @returns {void}
   */
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - CONFIG.SCROLL_OFFSET;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        floatingLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /**
   * Handles scroll events to morph header into floating navigation
   * @returns {void}
   */
  function handleScroll() {
    if (!header || !floatingNav) {
      return; // Skip if elements not available
    }
    
    const scroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Handle header morph
    if (scroll > scrollThreshold) {
      // Fade out main header, show floating nav
      header.classList.add('fade-out');
      floatingNav.classList.add('visible');
    } else {
      // Show main header, hide floating nav
      header.classList.remove('fade-out');
      floatingNav.classList.remove('visible');
    }

    // Update active link
    updateActiveLink();
    
    lastScrollY = scroll;
  }

  // Try to use Lenis if available, fallback to window scroll
  if (lenis && lenis.on) {
    lenis.on('scroll', ({ scroll }) => {
      handleScroll();
    });
  }
  
  // Also add regular scroll listener as fallback
  window.addEventListener('scroll', handleScroll);
  
  // Initial check
  handleScroll();

  // Add liquid ripple effect on hover
  floatingLinks.forEach(link => {
    link.addEventListener('mouseenter', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'liquid-ripple';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), CONFIG.RIPPLE_REMOVE_DELAY);
    });
  });

  // ========================================
  // Infinite Auto-Scrolling Gallery
  // ========================================

  const projectsContainer = document.querySelector('.projects');
  
  if (projectsContainer) {
    // Clone all project cards for infinite scroll
    const projects = projectsContainer.querySelectorAll('.project');
    const projectsArray = Array.from(projects);
    
    // Create a wrapper div for the scrolling track
    const track = document.createElement('div');
    track.className = 'projects-track';
    
    // Move original projects to track
    projectsArray.forEach(project => {
      track.appendChild(project.cloneNode(true));
    });
    
    // Clone projects again for seamless loop
    projectsArray.forEach(project => {
      const clone = project.cloneNode(true);
      track.appendChild(clone);
    });
    
    // Clear container and add track
    projectsContainer.innerHTML = '';
    projectsContainer.appendChild(track);
    
    // Re-initialize tilt effect on cloned cards
    const allCards = track.querySelectorAll('[data-tilt]');
    allCards.forEach(element => {
      initTiltEffect(element);
    });
    
    // Optional: Add manual control on click
    let isPaused = false;
    projectsContainer.addEventListener('click', () => {
      isPaused = !isPaused;
      track.style.animationPlayState = isPaused ? 'paused' : 'running';
    });
  }

  // ========================================
  // GSAP Animations
  // ========================================

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  
  // Parallax for sections
  gsap.utils.toArray('.section').forEach(section => {
    const content = section.querySelector('.section-header');
    if (content) {
      gsap.fromTo(content, 
        { y: 100, opacity: CONFIG.OPACITY_HIDDEN },
        {
          y: CONFIG.ROTATION_END,
          opacity: CONFIG.OPACITY_VISIBLE,
          duration: CONFIG.ANIMATION_DURATION_EXTRA_LONG,
          ease: CONFIG.EASING_POWER3,
          scrollTrigger: {
            trigger: section,
            start: CONFIG.SCROLL_TRIGGER_START_TOP,
            end: CONFIG.SCROLL_TRIGGER_END,
            scrub: CONFIG.LENIS_MOUSE_MULTIPLIER
          }
        }
      );
    }
  });

  // Service cards stagger animation
  gsap.fromTo('.service-card',
    { y: 100, opacity: CONFIG.OPACITY_HIDDEN, scale: CONFIG.SCALE_NORMAL },
    {
      y: CONFIG.ROTATION_END,
      opacity: CONFIG.OPACITY_VISIBLE,
      scale: CONFIG.SCALE_FULL,
      duration: CONFIG.ANIMATION_DURATION_LONG,
      stagger: {
        amount: CONFIG.ANIMATION_STAGGER_AMOUNT,
        from: "random"
      },
      ease: CONFIG.EASING_POWER3,
      scrollTrigger: {
        trigger: '.services-grid',
        start: CONFIG.SCROLL_TRIGGER_START_70
      }
    }
  );

  // Project cards horizontal reveal
  gsap.fromTo('.project',
    { scale: CONFIG.SCALE_SMALL, opacity: CONFIG.OPACITY_HIDDEN },
    {
      scale: CONFIG.SCALE_FULL,
      opacity: CONFIG.OPACITY_VISIBLE,
      duration: CONFIG.ANIMATION_DURATION_MEDIUM,
      stagger: CONFIG.ANIMATION_STAGGER_PROJECT,
      ease: CONFIG.EASING_POWER3,
      scrollTrigger: {
        trigger: '.projects',
        start: CONFIG.SCROLL_TRIGGER_LEFT,
        horizontal: true
      }
    }
  );

  // Experience cards stagger animation
  gsap.fromTo('.experience-card',
    { scale: CONFIG.ROTATION_END, opacity: CONFIG.OPACITY_HIDDEN, rotation: CONFIG.ROTATION_START },
    {
      scale: CONFIG.SCALE_FULL,
      opacity: CONFIG.OPACITY_VISIBLE,
      rotation: CONFIG.ROTATION_END,
      duration: CONFIG.ANIMATION_DURATION_LONG,
      stagger: {
        amount: CONFIG.ANIMATION_STAGGER_AMOUNT,
        from: "center"
      },
      ease: CONFIG.EASING_BACK,
      scrollTrigger: {
        trigger: '.experience-grid',
        start: CONFIG.SCROLL_TRIGGER_START_70
      }
    }
  );

  // Skills animation
  gsap.fromTo('.skills li',
    { scale: CONFIG.SCALE_SMALL, opacity: CONFIG.OPACITY_HIDDEN },
    {
      scale: CONFIG.SCALE_FULL,
      opacity: CONFIG.OPACITY_VISIBLE,
      duration: CONFIG.ANIMATION_DURATION_SHORT,
      stagger: CONFIG.ANIMATION_STAGGER_DELAY,
      ease: CONFIG.EASING_BACK_STRONG,
      scrollTrigger: {
        trigger: '.skills',
        start: CONFIG.SCROLL_TRIGGER_START_TOP
      }
    }
  );

  // Text reveal animation for all section headers
  gsap.utils.toArray('.section-header h2').forEach(heading => {
    gsap.fromTo(heading,
      { 
        clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        opacity: CONFIG.OPACITY_HIDDEN
      },
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        opacity: CONFIG.OPACITY_VISIBLE,
        duration: CONFIG.ANIMATION_DURATION_EXTRA_LONG,
        ease: CONFIG.EASING_POWER4,
        scrollTrigger: {
          trigger: heading,
          start: CONFIG.SCROLL_TRIGGER_START_TOP
        }
      }
    );
  });
  }

  // ========================================
  // Three.js Background
  // ========================================

  const canvas = document.getElementById('bg-canvas');
  if (canvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create particle field
  const particlesGeometry = new THREE.BufferGeometry();
  const count = CONFIG.PARTICLE_COUNT;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * CONFIG.PARTICLE_SPREAD;
    positions[i + 1] = (Math.random() - 0.5) * CONFIG.PARTICLE_SPREAD;
    positions[i + 2] = (Math.random() - 0.5) * CONFIG.PARTICLE_SPREAD;
    
    // Gold tinted particles
    colors[i] = 0.831; // R
    colors[i + 1] = 0.686; // G
    colors[i + 2] = 0.216; // B
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: CONFIG.PARTICLE_SIZE,
    sizeAttenuation: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: CONFIG.PARTICLE_OPACITY
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  camera.position.z = CONFIG.CAMERA_DISTANCE;

  // Mouse parallax
  let mouseXRatio = 0;
  let mouseYRatio = 0;

  document.addEventListener('mousemove', (e) => {
    mouseXRatio = (e.clientX / window.innerWidth) - 0.5;
    mouseYRatio = (e.clientY / window.innerHeight) - 0.5;
  });

  // Animation loop
  const clock = new THREE.Clock();

  /**
   * Three.js animation loop for particle system
   * @returns {void}
   */
  function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate particles
    particles.rotation.y = elapsedTime * CONFIG.PARTICLE_ROTATION_SPEED_Y;
    particles.rotation.x = elapsedTime * CONFIG.PARTICLE_ROTATION_SPEED_X;

    // Mouse parallax
    camera.position.x = mouseXRatio * CONFIG.CAMERA_PARALLAX_MULTIPLIER;
    camera.position.y = -mouseYRatio * CONFIG.CAMERA_PARALLAX_MULTIPLIER;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

    // Handle resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // ========================================
  // Form Handling
  // ========================================

  const form = document.getElementById('contactForm');
  if (form) {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Add loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate form submission
    setTimeout(() => {
      submitButton.textContent = 'Message sent!';
      form.reset();
      
      setTimeout(() => {
        submitButton.textContent = 'Send message';
        submitButton.disabled = false;
      }, CONFIG.FORM_SUCCESS_DISPLAY_TIME);
    }, CONFIG.FORM_SUBMIT_DELAY);
      });
    }
  }

  // ========================================
  // Smooth Anchor Links
  // ========================================

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        // Add a subtle scale animation to the target section
        gsap.fromTo(target, 
          { scale: CONFIG.SCALE_LARGE, opacity: CONFIG.OPACITY_SEMI },
          { scale: CONFIG.SCALE_FULL, opacity: CONFIG.OPACITY_VISIBLE, duration: CONFIG.ANIMATION_DURATION_MEDIUM, ease: CONFIG.EASING_POWER2 }
        );
        
        if (lenis) {
          lenis.scrollTo(target, {
            offset: CONFIG.SCROLL_OFFSET_ANCHOR,
            duration: CONFIG.ANIMATION_DURATION_EXTRA_LONG
          });
        }
      }
    });
  });

  // ========================================
  // Text Split Animation
  // ========================================

  const splitTextElements = document.querySelectorAll('[data-split-text]');
  
  splitTextElements.forEach(element => {
    // Skip if element contains accent class children (preserve them)
    if (element.querySelector('.accent')) {
      return;
    }
    const text = element.textContent;
    element.innerHTML = text
      .split('')
      .map(char => `<span>${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('');
  });

  // ========================================
  // 3D Tilt Effect
  // ========================================

  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach(element => {
    initTiltEffect(element);
  });

  // ========================================
  // Parallax Effects
  // ========================================

  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    parallaxElements.forEach(element => {
      const speed = element.dataset.parallaxSpeed || CONFIG.CAMERA_PARALLAX_MULTIPLIER;
      const x = (clientX - centerX) * speed;
      const y = (clientY - centerY) * speed;
      
      gsap.to(element, {
        x: x,
        y: y,
        duration: CONFIG.ANIMATION_DURATION_MEDIUM,
        ease: CONFIG.EASING_POWER2
      });
    });
  });

  // ========================================
  // Set Current Year
  // ========================================

  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // ========================================
  // Remove loading state
  // ========================================
  
  // Remove loading class after a short delay to ensure everything is rendered
  setTimeout(() => {
    document.body.classList.remove('loading');
  }, CONFIG.INIT_DELAY_MEDIUM);
}

// Wait for all scripts to load
window.addEventListener('load', () => {
  // Initialize after a small delay to ensure everything is ready
  setTimeout(() => {
    initializePortfolio();
  }, CONFIG.INIT_DELAY_SHORT);
});

// Also try DOMContentLoaded as a fallback
document.addEventListener('DOMContentLoaded', () => {
  // If window.load hasn't fired after delay, initialize anyway
  setTimeout(() => {
    if (!window.portfolioInitialized) {
      window.portfolioInitialized = true;
      initializePortfolio();
    }
  }, CONFIG.INIT_DELAY_LONG);
});