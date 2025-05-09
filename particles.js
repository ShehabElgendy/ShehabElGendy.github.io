// Particle animation for the entire website - enhanced version with more particles
document.addEventListener('DOMContentLoaded', function() {
    // Only run on devices that can handle it (no mobile)
    if (window.innerWidth < 768) return;
    
    // First, create a dedicated container for particles that will sit at the root level
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particles-js';
    particleContainer.style.position = 'fixed';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.pointerEvents = 'none';
    particleContainer.style.zIndex = '1'; // Needs to be above background but below content
    
    // Make sure you preserve your existing background
    const existingBackground = document.querySelector('.slideshow-background');
    let backgroundImage = '';
    if (existingBackground) {
        backgroundImage = window.getComputedStyle(existingBackground).backgroundImage;
    }
    
    // Insert the particles container at the beginning of the body
    // This is critical - it must be one of the first children
    document.body.insertBefore(particleContainer, document.body.firstChild);
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block'; // Ensure it's displayed as block
    
    // Add the canvas to the particle container
    particleContainer.appendChild(canvas);
    
    // Add CSS directly to ensure it's applied properly
    const style = document.createElement('style');
    style.textContent = `
        #particles-js {
            pointer-events: none;
            z-index: 1;
        }
        .hero-content, .portfolio-grid, .skills-grid, .contact-content, footer {
            position: relative;
            z-index: 2;
        }
        /* Don't override navbar - it has its own z-index in CSS */
        .navbar {
            position: fixed !important;
            z-index: 9999 !important;
        }
        .hero::before, .hero::after {
            z-index: 0;
        }
        .slideshow-background {
            z-index: 0;
        }
    `;
    document.head.appendChild(style);
    
    // Set up canvas
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Mouse position tracking
    let mouseX = width / 2;
    let mouseY = height / 2;
    
    // Track mouse position globally
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Particle class with improved rendering
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = '#64ffda';
            this.alpha = Math.random() * 0.4 + 0.1; // Increased alpha to ensure visibility
        }
        
        update() {
            // Calculate distance to mouse
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Move away from mouse (repel effect)
            if (dist < 100) {
                const forceDirectionX = dx / dist;
                const forceDirectionY = dy / dist;
                const force = (100 - dist) / 100;
                
                this.speedX -= forceDirectionX * force * 0.3;
                this.speedY -= forceDirectionY * force * 0.3;
            }
            
            // Apply speed
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Boundary check with wrap-around
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
            
            // Damping
            this.speedX *= 0.98;
            this.speedY *= 0.98;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    // Create particles - significantly increased count
    const particles = [];
    // Increased density for more particles across the screen
    const particleDensity = 0.00012; // Doubled from previous value
    // Increased maximum count while still maintaining performance
    const particleCount = Math.min(Math.floor(width * height * particleDensity), 300); // Increased from 180 to 300
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Connection distance based on screen size
    const connectionDistance = Math.min(width, height) * 0.12; // Same as before
    
    // Draw particles
    function animate() {
        // Resize canvas if needed
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw connections
        ctx.strokeStyle = '#64ffda';
        ctx.lineWidth = 0.4; // Slightly thicker lines for better visibility
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distSq = dx * dx + dy * dy;
                
                if (distSq < connectionDistance * connectionDistance) {
                    const dist = Math.sqrt(distSq);
                    ctx.beginPath();
                    ctx.globalAlpha = (connectionDistance - dist) / (connectionDistance * 3.5);
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    // Add a small delay to ensure all other elements are loaded and styled
    setTimeout(function() {
        // Start animation
        animate();
    }, 100);
    
    // Resize handler with performance optimization
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            
            // Recalculate particle count on resize to ensure proper density
            const newParticleCount = Math.min(Math.floor(width * height * particleDensity), 300);
            
            // Add or remove particles as needed
            if (newParticleCount > particles.length) {
                // Add more particles
                for (let i = particles.length; i < newParticleCount; i++) {
                    particles.push(new Particle());
                }
            } else if (newParticleCount < particles.length) {
                // Remove excess particles
                particles.splice(newParticleCount);
            }
        }, 250);
    });
    
    // Ensure visibility checks
    const checkVisibility = setInterval(function() {
        const container = document.getElementById('particles-js');
        if (container && window.getComputedStyle(container).display === 'none') {
            container.style.display = 'block';
            console.log('Particles container was hidden, making visible again');
        }
    }, 2000);
    
    // Clear interval after 10 seconds to avoid continuous checking
    setTimeout(function() {
        clearInterval(checkVisibility);
    }, 10000);
});