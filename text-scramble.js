// Text scramble effect for hero heading
document.addEventListener('DOMContentLoaded', function() {
    const heroHeading = document.querySelector('.hero h1');
    if (!heroHeading) return;
    
    // Save original text
    const originalText = heroHeading.textContent;
    
    // Characters to use for scrambling
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = chars;
            this.update = this.update.bind(this);
        }
        
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        
        update() {
            let output = '';
            let complete = 0;
            
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char" style="color: #64ffda;">${char}</span>`;
                } else {
                    output += from;
                }
            }
            
            this.el.innerHTML = output;
            
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }
    
    // Initialize the text scramble and display original text
    const textScramble = new TextScramble(heroHeading);
    
    // Trigger the effect when the hero is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Wait a moment to ensure the page is ready
                setTimeout(() => {
                    textScramble.setText(originalText).then(() => {
                        // Done scrambling
                    });
                }, 500);
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(heroHeading);
});
