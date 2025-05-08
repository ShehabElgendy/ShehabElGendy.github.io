// Initialize lightGallery
lightGallery(document.querySelector('.video-grid'), {
    selector: '.video-item',
    videojs: true,
    youtube: {
        enablejsapi: true,
        modestbranding: true,
        showinfo: false,
        rel: false
    },
    vimeo: {
        byline: false,
        portrait: false,
        title: false
    },
    plugins: [lgVideo]
});

// Smooth scrolling for navigation links
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

// Video showcase functionality
const videoItems = document.querySelectorAll('.video-item');
videoItems.forEach(item => {
    const playIcon = item.querySelector('.play-icon');
    const videoThumbnail = item.querySelector('.video-thumbnail img');
    const videoId = item.getAttribute('data-video-id');
    const videoType = item.getAttribute('data-video-type') || 'youtube';

    playIcon.addEventListener('click', () => {
        // Create video element
        const videoElement = document.createElement('div');
        videoElement.className = 'video-player';
        
        if (videoType === 'youtube') {
            videoElement.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&showinfo=0&rel=0"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            `;
        } else if (videoType === 'google-drive') {
            videoElement.innerHTML = `
                <iframe 
                    src="https://drive.google.com/file/d/${videoId}/preview"
                    frameborder="0"
                    allow="autoplay"
                    allowfullscreen
                ></iframe>
            `;
        }

        // Add video player to the DOM
        item.appendChild(videoElement);
        
        // Remove play icon and thumbnail
        playIcon.style.display = 'none';
        videoThumbnail.style.display = 'none';

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'close-video';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        closeButton.addEventListener('click', () => {
            videoElement.remove();
            closeButton.remove();
            playIcon.style.display = 'flex';
            videoThumbnail.style.display = 'block';
        });

        item.appendChild(closeButton);
    });
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

// Initialize scroll animations
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight * 0.7 && elementBottom > 0) {
            element.classList.add('visible');
        }
    });
};

// Add scroll event listener for animations
window.addEventListener('scroll', animateOnScroll);

// Initial animations
animateOnScroll();

// Video modal functionality
const videoModal = document.createElement('div');
videoModal.className = 'video-modal';
videoModal.innerHTML = `
    <div class="video-wrapper">
        <button class="close-modal"><i class="fas fa-times"></i></button>
        <div class="video-container">
            <iframe src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    </div>
`;
document.body.appendChild(videoModal);

// Handle video playback
const handleVideoPlayback = () => {
    const videoButtons = document.querySelectorAll('.view-project');
    
    videoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get video URL
            const videoUrl = button.getAttribute('data-video-url');
            
            if (!videoUrl) {
                console.error('No video URL found');
                return;
            }

            // Show modal
            videoModal.classList.add('active');

            // Update iframe source
            const iframe = videoModal.querySelector('iframe');
            iframe.src = videoUrl;

            // Close modal functionality
            const closeBtn = videoModal.querySelector('.close-modal');
            const closeModal = () => {
                iframe.src = '';
                videoModal.classList.remove('active');
                document.body.style.overflow = '';
            };

            closeBtn.addEventListener('click', closeModal);
            videoModal.addEventListener('click', (e) => {
                if (e.target === videoModal) closeModal();
            });

            // Prevent scrolling
            document.body.style.overflow = 'hidden';

            // Add keyboard support
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                }
            });

            // Restore scrolling when closed
            videoModal.addEventListener('transitionend', () => {
                if (!videoModal.classList.contains('active')) {
                    document.body.style.overflow = '';
                }
            });
        });
    });
};

// Initialize video playback
document.addEventListener('DOMContentLoaded', handleVideoPlayback);

// Add event listener for hash changes
window.addEventListener('hashchange', function() {
    const hash = window.location.hash;
    if (hash.startsWith('#video-')) {
        const videoId = hash.replace('#video-', '');
        const button = document.querySelector(`[data-video-id="${videoId}"]`);
        if (button) {
            button.click();
        }
    }
    });
});

// Add animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.portfolio-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight * 0.7 && elementBottom > 0) {
            element.classList.add('animate');
        }
    });
};

// Add scroll event listener for animations
window.addEventListener('scroll', animateOnScroll);

// Initial animations
animateOnScroll();

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

// Intersection Observer for lazy loading
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.src = entry.target.dataset.src;
            observer.unobserve(entry.target);
        }
    });
});

// Observe all images with data-src attribute
document.querySelectorAll('img[data-src]').forEach(img => {
    observer.observe(img);
});

// Add scroll event listener for animations
window.addEventListener('scroll', () => {
    animatePortfolioItems();
});

// Initial animations
animatePortfolioItems();
