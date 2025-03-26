/**
 * Feature4X Project Website Script
 * Handles UI interactions, scroll behaviors, and dynamic content
 */

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const desktopNavLinks = document.querySelectorAll('#desktop-nav a');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-sidebar a');
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileNavSidebar = document.getElementById('mobile-nav-sidebar');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  const copyBibtexBtn = document.getElementById('copy-bibtex');
  
  // Add highlight-text class to all em tags
  document.querySelectorAll('em').forEach(el => {
    if (!el.classList.contains('highlight-text')) {
      el.classList.add('highlight-text');
    }
  });
  
  // Desktop navigation smooth scrolling
  if (desktopNavLinks) {
    desktopNavLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offset = 80; // Consider fixed navigation height
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Initialize active navigation item
    setActiveNavItem();
    window.addEventListener('scroll', debounce(setActiveNavItem, 100));
  }
  
  // Mobile navigation functionality
  if (mobileNavToggle && mobileNavSidebar && mobileNavOverlay) {
    // Toggle mobile sidebar
    mobileNavToggle.addEventListener('click', function() {
      mobileNavSidebar.classList.toggle('active');
      mobileNavOverlay.classList.toggle('active');
      
      // Toggle icon
      const icon = this.querySelector('i');
      if (icon) {
        if (mobileNavSidebar.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
      
      // Prevent body scrolling when menu is open
      if (mobileNavSidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Close sidebar when clicking overlay
    mobileNavOverlay.addEventListener('click', function() {
      mobileNavSidebar.classList.remove('active');
      mobileNavOverlay.classList.remove('active');
      document.body.style.overflow = '';
      
      const icon = mobileNavToggle.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
    
    // Mobile navigation smooth scrolling
    if (mobileNavLinks) {
      mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            const offset = 20;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
            
            // Close mobile navigation
            mobileNavSidebar.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            const icon = mobileNavToggle.querySelector('i');
            if (icon) {
              icon.classList.remove('fa-times');
              icon.classList.add('fa-bars');
            }
          }
        });
      });
    }
    
    // Close mobile menu on screen resize if viewport becomes desktop size
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 769 && mobileNavSidebar.classList.contains('active')) {
        mobileNavSidebar.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        const icon = mobileNavToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  }
  
  // BibTeX copy functionality
  if (copyBibtexBtn) {
    copyBibtexBtn.addEventListener('click', function() {
      const bibtexContent = document.getElementById('bibtex-content');
      if (!bibtexContent) return;
      
      navigator.clipboard.writeText(bibtexContent.textContent).then(function() {
        // Change button text
        const originalText = copyBibtexBtn.innerHTML;
        copyBibtexBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        // Add effect
        copyBibtexBtn.classList.add('copy-button-success');
        
        // Restore original state after 2 seconds
        setTimeout(function() {
          copyBibtexBtn.innerHTML = originalText;
          copyBibtexBtn.classList.remove('copy-button-success');
        }, 2000);
      }).catch(function(err) {
        console.error('Could not copy text: ', err);
        // Copy failed
        copyBibtexBtn.innerHTML = '<i class="fas fa-times"></i> Failed!';
        copyBibtexBtn.classList.add('copy-button-error');
        
        // Restore original state after 2 seconds
        setTimeout(function() {
          copyBibtexBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
          copyBibtexBtn.classList.remove('copy-button-error');
        }, 2000);
      });
    });
    
    // Add hover effects to copy button
    copyBibtexBtn.addEventListener('mouseover', function() {
      this.style.transform = "translateY(-2px)";
      this.style.boxShadow = "0 4px 10px rgba(106, 17, 203, 0.3)";
    });
    
    copyBibtexBtn.addEventListener('mouseout', function() {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "none";
    });
  }
  
  // Scroll to top button
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    scrollToTopBtn.addEventListener("mouseover", function() {
      this.classList.add('scroll-top-button-hover');
    });
    
    scrollToTopBtn.addEventListener("mouseout", function() {
      this.classList.remove('scroll-top-button-hover');
    });
  }
  
  // Initialize page state
  window.addEventListener('scroll', debounce(function() {
    scrollFunction();
    updateReadingProgress();
    setActiveNavItem();
  }, 10));
  
  // Image lightbox functionality
  initializeLightbox();
  
  // Run initial functions
  scrollFunction();
  updateReadingProgress();
  setActiveNavItem();
  
  // Add escape key listener to close mobile nav and lightbox
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      // Close mobile nav if open
      if (mobileNavSidebar && mobileNavSidebar.classList.contains('active')) {
        mobileNavSidebar.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        const icon = mobileNavToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
      
      // Close lightbox if open
      const lightbox = document.getElementById('lightbox');
      if (lightbox && lightbox.style.display === 'flex') {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
      }
    }
  });
});

/**
 * Helper function to debounce frequent events
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * Initialize image lightbox functionality
 */
function initializeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const images = document.querySelectorAll('.img-container img');
  
  if (!lightbox || !lightboxImage || !lightboxCaption || !lightboxClose) return;
  
  let currentScale = 1;
  let startX, startY, moveX, moveY;
  let translateX = 0, translateY = 0;
  
  // Reset image position and scale
  function resetImagePosition() {
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    updateImageTransform();
  }
  
  // Update image transform
  function updateImageTransform() {
    lightboxImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
  }
  
  // Open preview
  images.forEach(img => {
    img.addEventListener('click', function() {
      lightboxImage.src = this.src;
      lightboxCaption.textContent = this.alt || 'Image Preview';
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      
      // Reset zoom and position
      resetImagePosition();
    });
  });
  
  // Close preview
  lightboxClose.addEventListener('click', function() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  });
  
  // Close preview when clicking background
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
  
  // Double-click to zoom
  lightboxImage.addEventListener('dblclick', function(e) {
    e.preventDefault();
    
    if (currentScale === 1) {
      currentScale = 2;
    } else {
      resetImagePosition();
    }
    
    updateImageTransform();
  });
  
  // Touch events - pinch zoom and drag
  lightboxImage.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      // Two finger touch - prepare for scaling
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      this.dataset.initialDistance = distance;
      this.dataset.initialScale = currentScale;
    } else if (e.touches.length === 1) {
      // Single finger touch - prepare for dragging
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
    }
  });
  
  lightboxImage.addEventListener('touchmove', function(e) {
    e.preventDefault();
    
    if (e.touches.length === 2) {
      // Two finger move - scaling
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const initialDistance = parseFloat(this.dataset.initialDistance);
      const initialScale = parseFloat(this.dataset.initialScale);
      
      if (initialDistance && initialScale) {
        currentScale = initialScale * (distance / initialDistance);
        currentScale = Math.min(Math.max(1, currentScale), 4); // Limit scale range
        
        updateImageTransform();
      }
    } else if (e.touches.length === 1 && currentScale > 1) {
      // Single finger move - dragging (only when zoomed in)
      moveX = e.touches[0].clientX - startX;
      moveY = e.touches[0].clientY - startY;
      
      // Limit drag range
      const maxX = (currentScale - 1) * lightboxImage.width / 2;
      const maxY = (currentScale - 1) * lightboxImage.height / 2;
      
      translateX = Math.min(Math.max(moveX, -maxX), maxX);
      translateY = Math.min(Math.max(moveY, -maxY), maxY);
      
      updateImageTransform();
    }
  });
  
  // Add touchend event for cleanup
  lightboxImage.addEventListener('touchend', function() {
    delete this.dataset.initialDistance;
    delete this.dataset.initialScale;
  });
}

/**
 * Set active navigation item based on scroll position
 */
function setActiveNavItem() {
  // Update desktop nav
  const desktopNavLinks = document.querySelectorAll('#desktop-nav a');
  if (desktopNavLinks && desktopNavLinks.length > 0) {
    desktopNavLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    const scrollPos = window.scrollY + 100;
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.querySelector('.section-anchor')?.id;
      
      if(sectionId && scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        document.querySelector(`#desktop-nav a[href="#${sectionId}"]`)?.classList.add('active');
        
        // Also update mobile nav if it exists
        document.querySelector(`.mobile-nav-sidebar a[href="#${sectionId}"]`)?.classList.add('active');
      }
    });
  }
  
  // Update mobile nav
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-sidebar a');
  if (mobileNavLinks && mobileNavLinks.length > 0) {
    mobileNavLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    const scrollPos = window.scrollY + 50;
    
    document.querySelectorAll('section').forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.querySelector('.section-anchor')?.id;
      
      if(sectionId && scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        document.querySelector(`.mobile-nav-sidebar a[href="#${sectionId}"]`)?.classList.add('active');
      }
    });
  }
}

/**
 * Update scroll-to-top button visibility
 */
function scrollFunction() {
  const scrollToTopBtn = document.getElementById("scroll-to-top");
  if (!scrollToTopBtn) return;
  
  if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
    scrollToTopBtn.style.display = "block";
    setTimeout(() => {
      scrollToTopBtn.style.opacity = "1";
    }, 50);
  } else {
    scrollToTopBtn.style.opacity = "0";
    setTimeout(() => {
      if (document.body.scrollTop <= 500 && document.documentElement.scrollTop <= 500) {
        scrollToTopBtn.style.display = "none";
      }
    }, 300);
  }
}

/**
 * Update reading progress indicator
 */
function updateReadingProgress() {
  const progressBar = document.getElementById("reading-progress");
  if (!progressBar) return;
  
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrolled = window.scrollY / documentHeight * 100;
  progressBar.style.width = scrolled + "%";
} 