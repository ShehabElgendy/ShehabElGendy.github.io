// Initialize event listeners when the document is ready
document.addEventListener('DOMContentLoaded', function() {
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

    // Handle portfolio item animations
    const animatePortfolioItems = () => {
        const items = document.querySelectorAll('.portfolio-item');
        
        items.forEach(item => {
            const elementTop = item.getBoundingClientRect().top;
            const elementBottom = item.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                item.classList.add('visible');
            }
        });
    };

    // Add scroll event listener for animations
    window.addEventListener('scroll', animatePortfolioItems);

    // Initialize animations
    animatePortfolioItems();

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