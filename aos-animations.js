/**
 * AOS (Animate On Scroll) - Custom Implementation
 * Lightweight scroll animation system inspired by the original AOS library
 */

class AOS {
    constructor() {
        this.elements = [];
        this.initialized = false;
        this.options = {
            offset: 120,
            delay: 0,
            duration: 600,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            anchorPlacement: 'top-bottom'
        };
    }

    init(options = {}) {
        if (this.initialized) return;
        
        // Merge options
        this.options = { ...this.options, ...options };
        
        // Find all elements with data-aos attributes
        this.refresh();
        
        // Start observing
        this.startObserver();
        
        this.initialized = true;
        console.log('🎬 AOS initialized with', this.elements.length, 'elements');
    }

    refresh() {
        // Clear existing elements
        this.elements = [];
        
        // Find all elements with data-aos attribute
        const aosElements = document.querySelectorAll('[data-aos]');
        
        aosElements.forEach((element, index) => {
            const animation = element.getAttribute('data-aos');
            const delay = parseInt(element.getAttribute('data-aos-delay')) || 0;
            const duration = parseInt(element.getAttribute('data-aos-duration')) || this.options.duration;
            const offset = parseInt(element.getAttribute('data-aos-offset')) || this.options.offset;
            const once = element.getAttribute('data-aos-once') !== 'false';
            
            this.elements.push({
                element,
                animation,
                delay,
                duration,
                offset,
                once,
                triggered: false
            });
        });
    }

    startObserver() {
        // Use Intersection Observer for better performance
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const element = this.elements.find(el => el.element === entry.target);
                    if (element) {
                        if (entry.isIntersecting) {
                            this.animateElement(element);
                        } else if (!element.once && !element.triggered) {
                            this.resetElement(element);
                        }
                    }
                });
            }, {
                rootMargin: `-${this.options.offset}px 0px`,
                threshold: 0.1
            });

            this.elements.forEach(element => {
                this.observer.observe(element.element);
            });
        } else {
            // Fallback for older browsers
            this.fallbackScrollHandler();
        }
    }

    animateElement(elementData) {
        if (elementData.triggered && elementData.once) return;

        const { element, delay } = elementData;
        
        // Apply animation delay if specified
        if (delay > 0) {
            setTimeout(() => {
                this.applyAnimation(element);
                elementData.triggered = true;
            }, delay);
        } else {
            this.applyAnimation(element);
            elementData.triggered = true;
        }
    }

    applyAnimation(element) {
        element.classList.add('aos-animate');
        
        // Dispatch custom event
        const event = new CustomEvent('aos:in', { detail: element });
        document.dispatchEvent(event);
    }

    resetElement(elementData) {
        const { element } = elementData;
        element.classList.remove('aos-animate');
        elementData.triggered = false;
        
        // Dispatch custom event
        const event = new CustomEvent('aos:out', { detail: element });
        document.dispatchEvent(event);
    }

    fallbackScrollHandler() {
        const handleScroll = () => {
            this.elements.forEach(elementData => {
                if (elementData.triggered && elementData.once) return;

                const { element, offset } = elementData;
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = elementTop <= window.innerHeight - offset;

                if (elementVisible) {
                    this.animateElement(elementData);
                } else if (!elementData.once) {
                    this.resetElement(elementData);
                }
            });
        };

        // Throttle scroll events for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial check
        handleScroll();
    }

    // Public methods for manual control
    refreshHard() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.elements = [];
        this.refresh();
        this.startObserver();
    }

    disable() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.elements.forEach(elementData => {
            elementData.element.classList.remove('aos-animate');
        });
    }

    enable() {
        this.startObserver();
    }
}

// Create global AOS instance
window.AOS = new AOS();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add a small delay to ensure all styles are loaded
    setTimeout(() => {
        window.AOS.init({
            offset: 100,
            duration: 600,
            easing: 'ease-out-cubic',
            delay: 0,
            once: true
        });
    }, 100);
});

// Refresh AOS on window resize
window.addEventListener('resize', () => {
    window.AOS.refreshHard();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AOS;
}