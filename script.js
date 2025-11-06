document.addEventListener('DOMContentLoaded',()=>{
  const burger = document.getElementById('hamburger');
  const nav = document.getElementById('primary-nav');
  
  if(burger && nav){
    burger.addEventListener('click', (e)=>{
      e.stopPropagation();
      nav.classList.toggle('open');
      const expanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!expanded));
    });

    // Close menu when clicking anywhere outside
    document.addEventListener('click', (e) => {
      if(!nav.contains(e.target) && !burger.contains(e.target)) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking on a link
    nav.addEventListener('click', (e) => {
      if(e.target.tagName === 'A') {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }
});

// ===== SCROLL ANIMATIONS =====
const fadeElements = document.querySelectorAll('.fade-in');

const fadeInOnScroll = () => {
  fadeElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementBottom = element.getBoundingClientRect().bottom;
    const elementVisible = 150;
    
    // Add visible when entering viewport, remove when completely gone
    if (elementTop < window.innerHeight - elementVisible && elementBottom > 0) {
      element.classList.add('visible');
    } else if (elementBottom < 0 || elementTop > window.innerHeight) {
      element.classList.remove('visible');
    }
  });
};

// Run on load and scroll
window.addEventListener('load', fadeInOnScroll);
window.addEventListener('scroll', fadeInOnScroll);

// Loading Spinner
window.addEventListener('load', function() {
  const spinner = document.getElementById('loading-spinner');
  setTimeout(() => {
    spinner.classList.add('hidden');
  }, 1000); // Shows for 1 second
});

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    backToTopButton.classList.add('show');
  } else {
    backToTopButton.classList.remove('show');
  }
});

backToTopButton.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Animated Statistics Counter
function animateCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        stat.textContent = Math.ceil(current) + (stat.getAttribute('data-target') === '98' ? '%' : '+');
        requestAnimationFrame(updateCounter);
      } else {
        stat.textContent = target + (stat.getAttribute('data-target') === '98' ? '%' : '+');
        stat.classList.add('animated');
      }
    };
    
    updateCounter();
  });
}

// Intersection Observer to trigger animation when visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

// Observe stats section
const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  statsObserver.observe(statsSection);
}




// Individual Portfolio Sliders
function initPortfolioSliders() {
  const sliders = document.querySelectorAll('.small-slider');
  
  sliders.forEach(slider => {
    const slides = slider.querySelectorAll('.portfolio-slide');
    const dots = slider.querySelectorAll('.dot');
    const prevArrow = slider.querySelector('.prev-arrow');
    const nextArrow = slider.querySelector('.next-arrow');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(n) {
      // Hide all slides
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      // Calculate new slide index
      currentSlide = (n + slides.length) % slides.length;
      
      // Show new slide and activate dot
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
      
      // Update arrow states
      updateArrowStates();
    }

    function nextSlide() {
      showSlide(currentSlide + 1);
    }

    function prevSlide() {
      showSlide(currentSlide - 1);
    }

    function updateArrowStates() {
      // For 2-slide sliders, we can disable arrows if needed
      // But for better UX, we'll keep them enabled and loop
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, 4000); // 4 seconds
    }

    function stopAutoSlide() {
      clearInterval(autoSlideInterval);
    }

    // Event listeners for arrows
    nextArrow.addEventListener('click', () => {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    });

    prevArrow.addEventListener('click', () => {
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    });

    // Event listeners for dots
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopAutoSlide();
        showSlide(index);
        startAutoSlide();
      });
    });

    // Start auto-sliding
    startAutoSlide();

    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
    
    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoSlide();
    });
    
    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoSlide();
    });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - next slide
          nextSlide();
        } else {
          // Swipe right - previous slide
          prevSlide();
        }
      }
    }
  });
}

// Initialize all portfolio sliders
document.addEventListener('DOMContentLoaded', initPortfolioSliders);


// Testimonials Slider
function initTestimonialsSlider() {
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  const prevTestimonial = document.querySelector('.prev-testimonial');
  const nextTestimonial = document.querySelector('.next-testimonial');
  let currentTestimonial = 0;
  let testimonialInterval;

  function showTestimonial(n) {
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    
    currentTestimonial = (n + testimonialSlides.length) % testimonialSlides.length;
    
    testimonialSlides[currentTestimonial].classList.add('active');
    testimonialDots[currentTestimonial].classList.add('active');
  }

  function nextTestimonialSlide() {
    showTestimonial(currentTestimonial + 1);
  }

  function prevTestimonialSlide() {
    showTestimonial(currentTestimonial - 1);
  }

  function startTestimonialAutoSlide() {
    testimonialInterval = setInterval(nextTestimonialSlide, 5000);
  }

  function stopTestimonialAutoSlide() {
    clearInterval(testimonialInterval);
  }

  nextTestimonial.addEventListener('click', () => {
    stopTestimonialAutoSlide();
    nextTestimonialSlide();
    startTestimonialAutoSlide();
  });

  prevTestimonial.addEventListener('click', () => {
    stopTestimonialAutoSlide();
    prevTestimonialSlide();
    startTestimonialAutoSlide();
  });

  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopTestimonialAutoSlide();
      showTestimonial(index);
      startTestimonialAutoSlide();
    });
  });

  startTestimonialAutoSlide();

  const testimonialSlider = document.querySelector('.testimonials-slider');
  testimonialSlider.addEventListener('mouseenter', stopTestimonialAutoSlide);
  testimonialSlider.addEventListener('mouseleave', startTestimonialAutoSlide);
}

document.addEventListener('DOMContentLoaded', initTestimonialsSlider);