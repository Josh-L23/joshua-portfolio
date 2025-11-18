// ========================================
// Luxe Dark Portfolio - Interactive Elements
// ========================================

// Function to initialize everything
function initializePortfolio() {
  if (window.portfolioInitialized) {
    console.log('Portfolio already initialized');
    return;
  }
  window.portfolioInitialized = true;
  console.log('Initializing portfolio...');
  // Initialize smooth scroll with Lenis
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

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

  // Smooth cursor animation
  function animateCursor() {
    // Outer cursor
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    // Inner dot
    dotX += (mouseX - dotX) * 0.5;
    dotY += (mouseY - dotY) * 0.5;
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
      
      if (distance < 100) {
        const translateX = distX * 0.3;
        const translateY = distY * 0.3;
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
  const scrollThreshold = 300; // When to trigger the morph
  
  // Debug: Check if elements exist
  console.log('Header found:', !!header);
  console.log('Floating nav found:', !!floatingNav);
  console.log('Floating links found:', floatingLinks.length);

  // Update active link based on scroll position
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
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

  // Handle scroll with both Lenis and regular scroll
  function handleScroll() {
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
  if (typeof lenis !== 'undefined' && lenis.on) {
    lenis.on('scroll', ({ scroll }) => {
      handleScroll();
    });
  }
  
  // Also add regular scroll listener as fallback
  window.addEventListener('scroll', handleScroll);
  
  // Initial check
  handleScroll();
  
  // Manual test: Add keyboard shortcut to toggle floating nav (press 'T' to test)
  document.addEventListener('keydown', (e) => {
    if (e.key === 't' || e.key === 'T') {
      console.log('Testing floating nav toggle');
      floatingNav.classList.toggle('visible');
      header.classList.toggle('fade-out');
    }
  });

  // Add liquid ripple effect on hover
  floatingLinks.forEach(link => {
    link.addEventListener('mouseenter', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'liquid-ripple';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
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
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;
        
        const rotateX = percentY * 10;
        const rotateY = percentX * -10;
        
        gsap.to(element, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      });
      
      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: 'power2.out'
        });
      });
    });
    
    // Optional: Add manual control on click
    let isPaused = false;
    projectsContainer.addEventListener('click', () => {
      isPaused = !isPaused;
      track.style.animationPlayState = isPaused ? 'paused' : 'running';
    });
    
    console.log('Infinite auto-scroll initialized for projects');
  } else {
    console.warn('Projects container not found');
  }

  // ========================================
  // GSAP Animations
  // ========================================

  gsap.registerPlugin(ScrollTrigger);

  // Parallax for sections
  gsap.utils.toArray('.section').forEach(section => {
    const content = section.querySelector('.section-header');
    if (content) {
      gsap.fromTo(content, 
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1
          }
        }
      );
    }
  });

  // Service cards stagger animation
  gsap.fromTo('.service-card',
    { y: 100, opacity: 0, scale: 0.9 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1.2,
      stagger: {
        amount: 0.8,
        from: "random"
      },
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 70%'
      }
    }
  );

  // Project cards horizontal reveal
  gsap.fromTo('.project',
    { scale: 0.8, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.projects',
        start: 'left 80%',
        horizontal: true
      }
    }
  );

  // Experience cards stagger animation
  gsap.fromTo('.experience-card',
    { scale: 0, opacity: 0, rotation: -180 },
    {
      scale: 1,
      opacity: 1,
      rotation: 0,
      duration: 1.2,
      stagger: {
        amount: 0.8,
        from: "center"
      },
      ease: 'back.out(1.2)',
      scrollTrigger: {
        trigger: '.experience-grid',
        start: 'top 70%'
      }
    }
  );

  // Skills animation
  gsap.fromTo('.skills li',
    { scale: 0.8, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.skills',
        start: 'top 80%'
      }
    }
  );

  // Text reveal animation for all section headers
  gsap.utils.toArray('.section-header h2').forEach(heading => {
    gsap.fromTo(heading,
      { 
        clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
        opacity: 0
      },
      {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        opacity: 1,
        duration: 1.5,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: heading,
          start: 'top 80%'
        }
      }
    );
  });

  // ========================================
  // Three.js Background
  // ========================================

  const canvas = document.getElementById('bg-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create particle field
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 1000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 10;
    positions[i + 2] = (Math.random() - 0.5) * 10;
    
    // Gold tinted particles
    colors[i] = 0.831; // R
    colors[i + 1] = 0.686; // G
    colors[i + 2] = 0.216; // B
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.6
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  camera.position.z = 3;

  // Mouse parallax
  let mouseXRatio = 0;
  let mouseYRatio = 0;

  document.addEventListener('mousemove', (e) => {
    mouseXRatio = (e.clientX / window.innerWidth) - 0.5;
    mouseYRatio = (e.clientY / window.innerHeight) - 0.5;
  });

  // Animation loop
  const clock = new THREE.Clock();

  function animate() {
    const elapsedTime = clock.getElapsedTime();

    // Rotate particles
    particles.rotation.y = elapsedTime * 0.05;
    particles.rotation.x = elapsedTime * 0.03;

    // Mouse parallax
    camera.position.x = mouseXRatio * 0.5;
    camera.position.y = -mouseYRatio * 0.5;
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

  // ========================================
  // Form Handling
  // ========================================

  const form = document.getElementById('contactForm');
  const submitButton = form.querySelector('button[type="submit"]');

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
      }, 3000);
    }, 2000);
  });

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
          { scale: 0.98, opacity: 0.8 },
          { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }
        );
        
        lenis.scrollTo(target, {
          offset: -100,
          duration: 1.5
        });
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
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;
      
      const rotateX = percentY * 10;
      const rotateY = percentX * -10;
      
      gsap.to(element, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    });
    
    element.addEventListener('mouseleave', () => {
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
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
      const speed = element.dataset.parallaxSpeed || 0.5;
      const x = (clientX - centerX) * speed;
      const y = (clientY - centerY) * speed;
      
      gsap.to(element, {
        x: x,
        y: y,
        duration: 1,
        ease: 'power2.out'
      });
    });
  });

  // ========================================
  // Set Current Year
  // ========================================

  document.getElementById('year').textContent = new Date().getFullYear();
  
  // ========================================
  // Remove loading state
  // ========================================
  
  // Remove loading class after a short delay to ensure everything is rendered
  setTimeout(() => {
    document.body.classList.remove('loading');
    console.log('Loading complete, site ready');
  }, 500);
}

// Wait for all scripts to load
window.addEventListener('load', () => {
  console.log('Window loaded, checking for libraries...');
  
  // Check if required libraries are loaded
  if (typeof Lenis === 'undefined') {
    console.error('Lenis not loaded!');
  }
  if (typeof gsap === 'undefined') {
    console.error('GSAP not loaded!');
  }
  if (typeof THREE === 'undefined') {
    console.error('Three.js not loaded!');
  }
  
  // Initialize after a small delay to ensure everything is ready
  setTimeout(() => {
    initializePortfolio();
  }, 100);
});

// Also try DOMContentLoaded as a fallback
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded');
  // If window.load hasn't fired after 2 seconds, initialize anyway
  setTimeout(() => {
    if (!window.portfolioInitialized) {
      console.log('Fallback initialization');
      window.portfolioInitialized = true;
      initializePortfolio();
    }
  }, 2000);
});