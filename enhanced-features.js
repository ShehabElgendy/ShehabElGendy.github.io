// Enhanced portfolio features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all enhanced features
    setTimeout(() => {
        initPortfolioRevealEffects();
        createFloatingSocialBar();
        setupCustomCursor();
        createBackgroundParticles();
        addTestimonialSection();
    }, 500);
});

// 1. Portfolio Image Reveal Effects
function initPortfolioRevealEffects() {
    // Add the necessary styles
    if (!document.getElementById('reveal-effect-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'reveal-effect-styles';
        styleSheet.textContent = `
            .portfolio-item .video-thumbnail {
                position: relative;
                overflow: hidden;
            }
            
            .reveal-mask {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: #0a192f;
                transform-origin: left;
                transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
                z-index: 5;
            }
            
            .reveal-mask.revealed {
                transform: scaleX(0);
            }
            
            .portfolio-item img {
                transform: scale(1.1);
                transition: transform 1.2s cubic-bezier(0.77, 0, 0.175, 1), 
                            filter 0.3s ease;
                filter: grayscale(0);
            }
            
            .portfolio-item.revealed img {
                transform: scale(1);
            }
            
            .portfolio-item:hover img {
                filter: brightness(0.7) contrast(1.1);
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Add reveal masks to portfolio items
    document.querySelectorAll('.portfolio-item .video-thumbnail').forEach((thumbnail, index) => {
        // Only add mask if it doesn't already exist
        if (!thumbnail.querySelector('.reveal-mask')) {
            const revealMask = document.createElement('div');
            revealMask.className = 'reveal-mask';
            revealMask.style.transitionDelay = `${index * 0.1}s`;
            
            // Insert mask before the first child
            thumbnail.insertBefore(revealMask, thumbnail.firstChild);
        }
    });
    
    // Set up intersection observer for reveal animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const portfolioItem = entry.target;
                const mask = portfolioItem.querySelector('.reveal-mask');
                
                // Add a slight delay before revealing
                setTimeout(() => {
                    if (mask) mask.classList.add('revealed');
                    portfolioItem.classList.add('revealed');
                }, 100);
                
                // Unobserve after revealing
                revealObserver.unobserve(portfolioItem);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe all portfolio items
    document.querySelectorAll('.portfolio-item').forEach(item => {
        revealObserver.observe(item);
    });
    
    console.log('Portfolio reveal effects initialized');
}

// 2. Floating Social Media Bar
function createFloatingSocialBar() {
    // Check if it already exists
    if (document.querySelector('.floating-social-bar')) return;
    
    // Create the floating social bar
    const socialBar = document.createElement('div');
    socialBar.className = 'floating-social-bar';
    
    // Add social links (using the same ones from your footer)
    socialBar.innerHTML = `
        <a href="https://github.com/ShehabElgendy" target="_blank" aria-label="GitHub">
            <i class="fab fa-github"></i>
        </a>
        <a href="https://www.linkedin.com/in/shehab-elgendy-69b03a270/" target="_blank" aria-label="LinkedIn">
            <i class="fab fa-linkedin"></i>
        </a>
        <div class="vertical-line"></div>
    `;
    
    // Add to the document
    document.body.appendChild(socialBar);
    
    // Add styles
    if (!document.getElementById('social-bar-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'social-bar-styles';
        styleSheet.textContent = `
            .floating-social-bar {
                position: fixed;
                left: 40px;
                bottom: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                z-index: 10;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            
            .floating-social-bar.visible {
                opacity: 1;
                transform: translateY(0);
            }
            
            .floating-social-bar a {
                margin: 10px 0;
                color: #64ffda;
                font-size: 22px;
                transition: all 0.3s ease;
            }
            
            .floating-social-bar a:hover {
                color: #ffffff;
                transform: translateY(-3px);
            }
            
            .floating-social-bar .vertical-line {
                width: 1px;
                height: 90px;
                background-color: #64ffda;
            }
            
            @media (max-width: 768px) {
                .floating-social-bar {
                    display: none;
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Show social bar after scrolling past the hero section
    function checkSocialBarVisibility() {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;
        
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        const socialBar = document.querySelector('.floating-social-bar');
        
        if (heroBottom < 100) {
            socialBar.classList.add('visible');
        } else {
            socialBar.classList.remove('visible');
        }
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', checkSocialBarVisibility, { passive: true });
    
    // Initial check
    checkSocialBarVisibility();
    
    console.log('Floating social bar initialized');
}

// 3. Custom Mouse Cursor - Disabled as per user request
function setupCustomCursor() {
    // Function kept for compatibility but not doing anything
    console.log('Custom cursor disabled as requested');
}

// 4. Background Particle Effects
function createBackgroundParticles() {
    // Add particle container if it doesn't exist
    const hero = document.querySelector('.hero');
    if (!hero || document.querySelector('.particles-container')) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    
    // Insert before the slideshow background
    const slideshowBg = hero.querySelector('.slideshow-background');
    hero.insertBefore(particlesContainer, slideshowBg);
    
    // Add particle styles
    if (!document.getElementById('particles-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'particles-styles';
        styleSheet.textContent = `
            .particles-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                overflow: hidden;
            }
            
            .particle {
                position: absolute;
                background-color: rgba(100, 255, 218, 0.3);
                border-radius: 50%;
                pointer-events: none;
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Create particles
    const particleCount = 20;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random sizes between 4 and 12 pixels
        const size = Math.random() * 8 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Lower opacity for larger particles
        particle.style.opacity = (1 - size/20).toString();
        
        particlesContainer.appendChild(particle);
        particles.push({
            element: particle,
            x: Math.random() * 100,
            y: Math.random() * 100,
            speedX: Math.random() * 0.05 - 0.025,
            speedY: Math.random() * 0.05 - 0.025,
            size: size
        });
    }
    
    // Animation loop
    function animateParticles() {
        particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Boundaries check and bounce
            if (particle.x < 0) {
                particle.x = 0;
                particle.speedX *= -1;
            } else if (particle.x > 100) {
                particle.x = 100;
                particle.speedX *= -1;
            }
            
            if (particle.y < 0) {
                particle.y = 0;
                particle.speedY *= -1;
            } else if (particle.y > 100) {
                particle.y = 100;
                particle.speedY *= -1;
            }
            
            // Apply position
            particle.element.style.left = `${particle.x}%`;
            particle.element.style.top = `${particle.y}%`;
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    // Start animation
    animateParticles();
    
    console.log('Background particles initialized');
}

// 5. LinkedIn Recommendations Slider
function addTestimonialSection() {
    // Check if recommendations section already exists
    if (document.querySelector('.recommendations')) return;
    
    // Create testimonial data from actual LinkedIn recommendations
    const testimonials = [
        {
            text: "Shehab is an excellent leader with clearly demonstrated skills as a programmer. He took on the difficult challenge of leading our Unity Team to continued success. He had a clear and noticeable impact on team metrics, with constant improvements visible every quarter. Shehab always provided mentorship and pushed others towards constant healthy growth. He has an excellent eye for detail, always pushes for improvements, and always ensures products match technical and visual requirements. I always appreciated Shehab's clear and transparent communication style, and solid dedication to the success of his team and our company as a whole.",
            author: "Remon Ramy",
            title: "Technical Director at Genesis Creations S.A.E"
        },
        {
            text: "I highly recommend shehab as a skilled 3D Unity developer. He has strong expertise in Unity and game development. His problem-solving skills and technical knowledge are impressive. He quickly adapts to new ideas and implements them effectively. Always reliable and motivated, he adds great value to any team. A solid developer with both creativity and discipline.",
            author: "Mohamed Saeed",
            title: "iOS/Computer Graphics Engineer | The Weather Company | Andela | ex IBM"
        },
        {
            text: "Shehab is a very fast learner and a problem solver.",
            author: "Mohamed Khalil Ibrahim",
            title: "3D Character Artist @ Digital-pen"
        }
    ];
    
    // Create testimonial section HTML
    const testimonialSection = document.createElement('section');
    testimonialSection.className = 'testimonials';
    testimonialSection.id = 'testimonials';
    
    testimonialSection.innerHTML = `
        <div class="container">
            <h2 class="section-title">Testimonials</h2>
            <div class="testimonial-slider">
                <div class="testimonial-track">
                    ${testimonials.map((testimonial, index) => `
                        <div class="testimonial-slide" data-index="${index}">
                            <div class="testimonial-content">
                                <div class="quote-icon">
                                    <i class="fas fa-quote-left"></i>
                                </div>
                                <p class="testimonial-text">${testimonial.text}</p>
                                <div class="testimonial-author">
                                    <p class="author-name">${testimonial.author}</p>
                                    <p class="author-title">${testimonial.title}</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="testimonial-navigation">
                    <button class="prev-testimonial" aria-label="Previous testimonial">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="testimonial-dots">
                        ${testimonials.map((_, index) => `
                            <button class="testimonial-dot ${index === 0 ? 'active' : ''}" 
                                    data-index="${index}" aria-label="Go to testimonial ${index + 1}"></button>
                        `).join('')}
                    </div>
                    <button class="next-testimonial" aria-label="Next testimonial">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Insert before the contact section
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
        contactSection.parentNode.insertBefore(testimonialSection, contactSection);
    } else {
        // If contact section doesn't exist, append to body
        document.body.appendChild(testimonialSection);
    }
    
    // Add testimonial styles
    if (!document.getElementById('testimonial-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'testimonial-styles';
        styleSheet.textContent = `
            .testimonials {
                padding: 80px 0;
                background-color: #0a192f;
            }
            
            .testimonial-slider {
                position: relative;
                max-width: 800px;
                margin: 0 auto;
                overflow: hidden;
            }
            
            .testimonial-track {
                display: flex;
                transition: transform 0.6s ease-out;
            }
            
            .testimonial-slide {
                min-width: 100%;
                padding: 0 20px;
                box-sizing: border-box;
                opacity: 0.4;
                transform: scale(0.8);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .testimonial-slide.active {
                opacity: 1;
                transform: scale(1);
            }
            
            .testimonial-content {
                background-color: #112240;
                padding: 40px;
                border-radius: 8px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                position: relative;
            }
            
            .quote-icon {
                font-size: 30px;
                color: #64ffda;
                margin-bottom: 20px;
            }
            
            .testimonial-text {
                font-size: 18px;
                line-height: 1.6;
                margin-bottom: 30px;
                color: #e6f1ff;
            }
            
            .testimonial-author {
                border-top: 1px solid rgba(100, 255, 218, 0.2);
                padding-top: 20px;
            }
            
            .author-name {
                font-size: 18px;
                font-weight: 600;
                color: #64ffda;
                margin-bottom: 5px;
            }
            
            .author-title {
                font-size: 14px;
                color: #8892b0;
                margin-bottom: 5px;
            }
            
            .testimonial-navigation {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 30px;
            }
            
            .prev-testimonial,
            .next-testimonial {
                background: none;
                border: none;
                color: #64ffda;
                font-size: 20px;
                cursor: pointer;
                padding: 10px;
                transition: transform 0.3s ease;
            }
            
            .prev-testimonial:hover,
            .next-testimonial:hover {
                transform: scale(1.2);
            }
            
            .testimonial-dots {
                display: flex;
                justify-content: center;
                margin: 0 20px;
            }
            
            .testimonial-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #233554;
                border: none;
                margin: 0 5px;
                padding: 0;
                cursor: pointer;
                transition: background-color 0.3s ease, transform 0.3s ease;
            }
            
            .testimonial-dot.active {
                background-color: #64ffda;
                transform: scale(1.2);
            }
            
            @media (max-width: 768px) {
                .testimonial-content {
                    padding: 30px 20px;
                }
                
                .testimonial-text {
                    font-size: 16px;
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Initialize testimonial slider
    let currentSlide = 0;
    const totalSlides = testimonials.length;
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    
    // Mark first slide as active
    if (slides.length > 0) {
        slides[0].classList.add('active');
    }
    
    // Function to navigate to a specific slide
    function goToSlide(index) {
        // Validate index
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        // Update current slide
        currentSlide = index;
        
        // Move track with a smooth, professional animation
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update active states
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentSlide);
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }
    
    // Set up event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
    }
    
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            goToSlide(index);
        });
    });
    
    // Auto-rotate slides
    const autoRotate = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 7000); // Longer time since testimonials are lengthy
    
    // Stop auto-rotation when user interacts
    const sliderContainer = document.querySelector('.testimonial-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(autoRotate);
        });
    }
    
    // Make sure testimonials can be properly viewed when scrolling back
    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection) {
        const testimonialObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Reset slides when scrolling back to the section
                    // This ensures animations replay properly
                    setTimeout(() => {
                        track.style.transition = 'none';
                        currentSlide = 0;
                        track.style.transform = 'translateX(0)';
                        
                        slides.forEach((slide, i) => {
                            slide.classList.toggle('active', i === 0);
                        });
                        
                        dots.forEach((dot, i) => {
                            dot.classList.toggle('active', i === 0);
                        });
                        
                        // Re-enable transitions after reset
                        setTimeout(() => {
                            track.style.transition = 'transform 0.5s ease';
                        }, 50);
                    }, 300);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '100px 0px 0px 0px'
        });
        
        testimonialObserver.observe(testimonialsSection);
    }
    
    console.log('Testimonials slider initialized');
}

// Ensure all animations can be detected and replay when scrolling
function setupReplayableAnimations() {
    // To be implemented as needed
}
