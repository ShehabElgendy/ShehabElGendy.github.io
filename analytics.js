// Analytics helper functions

// Track page views and scroll depth
function setupAnalytics() {
    // Track page views for different sections
    const sections = ['home', 'portfolio', 'skills', 'contact'];
    
    // Initialize scroll depth tracking
    let scrollDepthMarkers = [25, 50, 75, 100];
    let scrollDepthTracked = {};
    
    // Track when visitors view different sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                // Track section view in Google Analytics
                gtag('event', 'section_view', {
                    'section_name': sectionId,
                    'time_on_page': Math.round((new Date() - pageLoadTime) / 1000)
                });
                
                console.log(`Section viewed: ${sectionId}`);
            }
        });
    }, {
        threshold: 0.5 // Element is considered "viewed" when 50% visible
    });
    
    // Observe all main sections
    sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) sectionObserver.observe(element);
    });
    
    // Track scroll depth
    window.addEventListener('scroll', () => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        scrollDepthMarkers.forEach(marker => {
            if (scrollPercent >= marker && !scrollDepthTracked[marker]) {
                // Mark this depth as tracked
                scrollDepthTracked[marker] = true;
                
                // Send event to Google Analytics
                gtag('event', 'scroll_depth', {
                    'depth': marker,
                    'page': window.location.pathname
                });
                
                console.log(`Scroll depth reached: ${marker}%`);
            }
        });
    }, { passive: true });
    
    // Track outbound links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', function(e) {
            // Send event to Google Analytics
            gtag('event', 'outbound_click', {
                'link_url': this.href,
                'link_text': this.textContent.trim()
            });
            console.log(`Outbound link clicked: ${this.href}`);
        });
    });
    
    // Track portfolio interactions
    document.querySelectorAll('.view-project, .portfolio-link').forEach(button => {
        button.addEventListener('click', function(e) {
            const portfolioItem = this.closest('.portfolio-item');
            const projectTitle = portfolioItem ? portfolioItem.querySelector('h4').textContent : 'Unknown Project';
            
            // Send event to Google Analytics
            gtag('event', 'portfolio_interaction', {
                'project_title': projectTitle,
                'interaction_type': this.classList.contains('view-project') ? 'video_view' : 'portfolio_link'
            });
            
            console.log(`Portfolio interaction: ${projectTitle}`);
        });
    });
    
    // Track time spent on page
    const pageLoadTime = new Date();
    let timeOnPageTracked = {};
    const timeMarkers = [30, 60, 120, 300]; // seconds
    
    // Check time spent every second
    setInterval(() => {
        const timeSpent = Math.round((new Date() - pageLoadTime) / 1000);
        
        timeMarkers.forEach(marker => {
            if (timeSpent >= marker && !timeOnPageTracked[marker]) {
                timeOnPageTracked[marker] = true;
                
                // Send event to Google Analytics
                gtag('event', 'time_on_page', {
                    'duration': marker,
                    'page': window.location.pathname
                });
                
                console.log(`Time on page: ${marker} seconds`);
            }
        });
    }, 1000);
}

// Initialize real-time user counter (requires Firebase or similar backend)
function initializeUserCounter() {
    console.log('User counter would be initialized here if Firebase was set up');
    // This is a placeholder - would require backend implementation
}

// Export functions for use in main script
window.analyticsTools = {
    setupAnalytics,
    initializeUserCounter
};
