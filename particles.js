// Particle animation for hero section
document.addEventListener('DOMContentLoaded', function() {
    // Only run on devices that can handle it (no mobile)
    if (window.innerWidth < 768) return;
    
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    
    // Insert before the first child of hero section
    heroSection.insertBefore(canvas, heroSection.firstChild);
    
    // Set up canvas
    const ctx = canvas.getContext('2d');
    let width = canvas.width = heroSection.offsetWidth;
    let height = canvas.height = heroSection.offsetHeight;
    
    // Mouse position tracking
    let mouseX = width / 2;
    let mouseY = height / 2;
    
    // Track mouse position
    heroSection.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 3 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = '#64ffda';
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        
        update() {
            // Calculate distance to mouse
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Move away from mouse (repel effect)
            if (dist < 80) {
                const forceDirectionX = dx / dist;
                const forceDirectionY = dy / dist;
                const force = (80 - dist) / 80;
                
                this.speedX -= forceDirectionX * force * 0.6;
                this.speedY -= forceDirectionY * force * 0.6;
            }
            
            // Apply speed
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Boundary check
            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
            
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
    
    // Create particles
    const particles = [];
    const particleCount = Math.min(Math.floor(width * height / 8000), 100);
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Draw particles
    function animate() {
        // Resize canvas if needed
        if (canvas.width !== heroSection.offsetWidth || canvas.height !== heroSection.offsetHeight) {
            width = canvas.width = heroSection.offsetWidth;
            height = canvas.height = heroSection.offsetHeight;
        }
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw connections
        ctx.strokeStyle = '#64ffda';
        ctx.lineWidth = 0.3;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.globalAlpha = (100 - dist) / 500;
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
    
    // Start animation
    animate();
    
    // Resize handler
    window.addEventListener('resize', function() {
        width = canvas.width = heroSection.offsetWidth;
        height = canvas.height = heroSection.offsetHeight;
    });
});
