// Initialize event listeners when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle - improved with logging and forced redraw
    const navMenu = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    
    // Log hamburger element to verify it exists
    console.log('Hamburger element:', hamburger);
    console.log('Nav menu element:', navMenu);

    hamburger.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        console.log('Hamburger clicked');
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        // Force a browser redraw to ensure styles apply
        navMenu.offsetHeight;
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !hamburger.contains(event.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
    
    // Close mobile menu when clicking a nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    // Hero section slideshow
    const slideshowBackground = document.querySelector('.slideshow-background');
    if (slideshowBackground) {
        const images = [
            'images/light-ball-runner.png',
            'images/Digital-Twin.png',
            'images/vr-simulation.png',
            'images/full-portfolio.png'
        ];
        
        let currentIndex = 0;
        
        // Preload all images
        const preloadedImages = images.map(src => {
            const img = new Image();
            img.src = src;
            return img;
        });
        
        // Set initial background
        slideshowBackground.style.backgroundImage = `url('${images[0]}')`;        
        
        function nextSlide() {
            // Get next index with wraparound
            const nextIndex = (currentIndex + 1) % images.length;
            
            // Create temporary div for transition
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.top = '0';
            tempDiv.style.left = '0';
            tempDiv.style.width = '100%';
            tempDiv.style.height = '100%';
            tempDiv.style.backgroundImage = `url('${images[nextIndex]}')`;
            tempDiv.style.backgroundSize = 'cover';
            tempDiv.style.backgroundPosition = 'center';
            tempDiv.style.filter = 'brightness(0.2) blur(3px)';
            tempDiv.style.opacity = '0';
            tempDiv.style.transition = 'opacity 1s ease-in-out';
            tempDiv.style.zIndex = '0';
            
            // Add to DOM right before the slideshow background
            slideshowBackground.parentNode.insertBefore(tempDiv, slideshowBackground);
            
            // Trigger transition
            setTimeout(() => {
                tempDiv.style.opacity = '1';
            }, 50);
            
            // After transition completes
            setTimeout(() => {
                // Update the main background
                slideshowBackground.style.backgroundImage = `url('${images[nextIndex]}')`;
                // Remove the temporary div
                tempDiv.remove();
                // Update current index
                currentIndex = nextIndex;
            }, 1050);
        }
        
        // Change slide every 5 seconds
        setInterval(nextSlide, 5000);
    }
    // Add fade-in class to all section headings
    document.querySelectorAll('section h2').forEach(heading => {
        heading.classList.add('fade-in');
    });
    // Handle smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add active class to navigation links on scroll
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Set up video playback for all 'Watch Demo' or similar buttons
    const videoButtons = document.querySelectorAll('.view-project');
    
    videoButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the video URL from the data attribute
            let videoUrl = this.getAttribute('data-video-url');
            
            if (!videoUrl) {
                console.error('No video URL found for this button');
                return;
            }
            
            console.log("Using video URL:", videoUrl); // Debug to check URL
            
            // Check if it's a Google Drive URL and convert to proper embed format if needed
            if (videoUrl.includes('drive.google.com/file/d/')) {
                // Extract the file ID
                const fileIdMatch = videoUrl.match(/\/d\/([^\/]+)/);
                if (fileIdMatch && fileIdMatch[1]) {
                    const fileId = fileIdMatch[1];
                    // Create the proper embed URL
                    videoUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                    console.log("Converted to Google Drive preview URL:", videoUrl); // Debug
                }
            }
            
            // Only reach here for non-Google Drive videos or other embeds
            // Create the modal with the video
            const videoModal = document.createElement('div');
            videoModal.className = 'video-modal';
            videoModal.style.position = 'fixed';
            videoModal.style.top = '0';
            videoModal.style.left = '0';
            videoModal.style.width = '100%';
            videoModal.style.height = '100%';
            videoModal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
            videoModal.style.display = 'flex';
            videoModal.style.justifyContent = 'center';
            videoModal.style.alignItems = 'center';
            videoModal.style.zIndex = '1000';
            
            // Add the video wrapper and iframe
            videoModal.innerHTML = `
                <div class="video-wrapper" style="position: relative; width: 80%; max-width: 900px; background: #112240; border-radius: 8px; overflow: hidden;">
                    <button class="close-modal" style="position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; background: #64ffda; border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-times" style="color: #0a192f;"></i>
                    </button>
                    <div class="video-container" style="padding-top: 56.25%; position: relative;">
                        <iframe 
                            src="${videoUrl}" 
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                            frameborder="0" 
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen
                        ></iframe>
                    </div>
                </div>
            `;
            
            // Add the modal to the document
            document.body.appendChild(videoModal);
            
            // Prevent scrolling while modal is open
            document.body.style.overflow = 'hidden';
            
            // Add close functionality
            const closeBtn = videoModal.querySelector('.close-modal');
            closeBtn.addEventListener('click', function() {
                videoModal.remove();
                document.body.style.overflow = '';
            });
            
            // Also close when clicking outside the video
            videoModal.addEventListener('click', function(e) {
                if (e.target === videoModal) {
                    videoModal.remove();
                    document.body.style.overflow = '';
                }
            });
            
            // Add keyboard support to close with Escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && document.querySelector('.video-modal')) {
                    videoModal.remove();
                    document.body.style.overflow = '';
                }
            });
        });
    });

    // Lazy loading for images
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    observer.unobserve(img);
                }
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        observer.observe(img);
    });

    // Super enhanced animations with replay functionality
    const setupSuperAnimations = () => {
        // Animation classes to apply - much more comprehensive
        const animations = {
            // Section titles with different animations
            'section h2': 'scale-in',
            '.section-title': 'scale-in',
            
            // Portfolio items with alternating animations
            '.portfolio-item:nth-child(4n+1)': 'slide-in-left',
            '.portfolio-item:nth-child(4n+2)': 'slide-in-right',
            '.portfolio-item:nth-child(4n+3)': 'scale-in',
            '.portfolio-item:nth-child(4n+4)': 'rotate-in',
            
            // Hero section elements
            '.hero h1': 'slide-in-left',
            '.hero p': 'slide-in-right',
            '.hero .cta-button': 'scale-in',
            
            // All other content elements
            '.video-description': 'fade-in',
            '.about-content': 'fade-in',
            '.about-image': 'rotate-in',
            '.skill-card': 'scale-in',
            '.contact-form': 'fade-in',
            '.nav-links li': 'fade-in',
            'footer p': 'fade-in',
            '.social-links a': 'scale-in',
            '.portfolio-grid': 'fade-in',
            '.video-thumbnail': 'scale-in',
            '.portfolio-link': 'scale-in',
            '.view-project': 'scale-in'
        };
        
        // Apply animation classes to elements
        Object.entries(animations).forEach(([selector, animationClass]) => {
            document.querySelectorAll(selector).forEach((element, index) => {
                // Skip if element already has an animation class
                if (!element.classList.contains('fade-in') && 
                    !element.classList.contains('slide-in-left') && 
                    !element.classList.contains('slide-in-right') && 
                    !element.classList.contains('scale-in') && 
                    !element.classList.contains('rotate-in')) {
                    
                    element.classList.add(animationClass);
                    
                    // Add sequential delays for elements of the same type
                    if (index < 5) { // Only apply delays to first 5 elements
                        element.classList.add(`delay-${index + 1}`);
                    }
                }
            });
        });
        
        // Create a simpler Intersection Observer that just toggles classes
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Simply toggle the appear class based on intersection
                if (entry.isIntersecting) {
                    // Element is visible - add appear class immediately
                    entry.target.classList.add('appear');
                } else {
                    // Element is not visible - remove appear class immediately
                    entry.target.classList.remove('appear');
                }
            });
        }, {
            // Use multiple thresholds for smoother detection
            threshold: [0, 0.1, 0.2],
            // Expanded margin to detect elements earlier
            rootMargin: '100px 0px 0px 0px'
        });
        
        // Observe all elements with animation classes
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .rotate-in').forEach(element => {
            observer.observe(element);
        });
        
        // Immediately trigger animations for elements in the viewport on load
        setTimeout(() => {
            document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .rotate-in').forEach(element => {
                const position = element.getBoundingClientRect();
                if (position.top < window.innerHeight && position.bottom >= 0) {
                    element.classList.add('appear');
                }
            });
        }, 300);
    };
    
    // Initialize super animations
    setupSuperAnimations();

    // No need for scroll listener as we're using Intersection Observer

    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to a server
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });
    }
});