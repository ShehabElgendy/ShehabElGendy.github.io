// Simple skill bar animations script
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to initialize
    setTimeout(() => {
        enhanceSkillBars();
    }, 500);
});

function enhanceSkillBars() {
    // Store timeouts to properly clear them for replay animations
    const animationTimeouts = new Map();
    
    // Add minimal style for animation
    if (!document.getElementById('skill-bar-animations')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'skill-bar-animations';
        styleSheet.textContent = `
            .skill-progress .progress {
                transition: width 0.8s ease-out;
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Enhance skill progress bars
    document.querySelectorAll('.skill-progress .progress').forEach((progress, index) => {
        // Generate unique ID if not present
        const parentEl = progress.closest('.skill-progress');
        if (parentEl && !parentEl.id) {
            parentEl.id = `skill-progress-${index}`;
        }
        
        const originalWidth = progress.style.width;
        // Reset width to 0 initially
        progress.style.width = '0%';
        
        // Function to animate progress
        const animateProgress = () => {
            progress.style.width = '0%';
            setTimeout(() => {
                progress.style.width = originalWidth;
            }, 100);
        }
        
        // Set up observer for this specific element
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const targetId = entry.target.id;
                
                if (entry.isIntersecting) {
                    // Clear any existing timeouts for this element
                    if (animationTimeouts.has(targetId)) {
                        clearTimeout(animationTimeouts.get(targetId));
                    }
                    
                    // Create new timeout
                    const timeout = setTimeout(() => {
                        animateProgress();
                    }, 100);
                    
                    // Store the timeout
                    animationTimeouts.set(targetId, timeout);
                } else {
                    // Clear any existing timeouts for this element
                    if (animationTimeouts.has(targetId)) {
                        clearTimeout(animationTimeouts.get(targetId));
                    }
                    
                    // Reset progress bar
                    progress.style.width = '0%';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '100px 0px 0px 0px'
        });
        
        if (parentEl) {
            progressObserver.observe(parentEl);
        }
    });
    
    console.log('Skill bar animations initialized');
}
