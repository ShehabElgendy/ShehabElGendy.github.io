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

// Advanced visitor tracking system
function setupVisitorTracking() {
    const visitorData = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        screen: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        url: window.location.href,
        referrer: document.referrer || 'Direct visit',
        sessionId: generateSessionId(),
        visitCount: getVisitCount()
    };

    // Get visitor IP and location info
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            visitorData.ip = data.ip;
            visitorData.city = data.city;
            visitorData.region = data.region;
            visitorData.country = data.country_name;
            visitorData.isp = data.org;
            
            logVisitor(visitorData);
        })
        .catch(() => {
            // Fallback if IP service fails
            visitorData.ip = 'Unknown';
            logVisitor(visitorData);
        });
}

function generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function getVisitCount() {
    const count = parseInt(localStorage.getItem('visitCount') || '0') + 1;
    localStorage.setItem('visitCount', count.toString());
    return count;
}

function logVisitor(data) {
    // Store in localStorage
    const visitors = JSON.parse(localStorage.getItem('visitorLog') || '[]');
    visitors.unshift(data); // Add to beginning
    
    // Keep only last 100 visits
    if (visitors.length > 100) {
        visitors.splice(100);
    }
    
    localStorage.setItem('visitorLog', JSON.stringify(visitors));
    
    // Also log to console for immediate viewing
    console.log('🕵️ NEW VISITOR DETECTED:', data);
    
    // Track in Google Analytics too
    gtag('event', 'visitor_tracked', {
        'visitor_country': data.country,
        'visitor_city': data.city,
        'visit_count': data.visitCount
    });
}

// Function to display visitor log
function showVisitorLog() {
    const visitors = JSON.parse(localStorage.getItem('visitorLog') || '[]');
    
    if (visitors.length === 0) {
        console.log('📊 No visitors logged yet');
        return;
    }
    
    console.log(`📊 VISITOR LOG (${visitors.length} total visits):`);
    console.log('='.repeat(80));
    
    visitors.forEach((visitor, index) => {
        const date = new Date(visitor.timestamp);
        console.log(`\n🔍 Visit #${index + 1} | ${date.toLocaleString()}`);
        console.log(`   IP: ${visitor.ip} | Location: ${visitor.city}, ${visitor.country}`);
        console.log(`   Browser: ${getBrowserInfo(visitor.userAgent)}`);
        console.log(`   OS: ${visitor.platform} | Screen: ${visitor.screen}`);
        console.log(`   Language: ${visitor.language} | Timezone: ${visitor.timezone}`);
        console.log(`   ISP: ${visitor.isp}`);
        console.log(`   Referrer: ${visitor.referrer}`);
        console.log(`   Visit Count: ${visitor.visitCount}`);
        console.log(`   Session: ${visitor.sessionId}`);
    });
    
    console.log('\n📈 Quick Stats:');
    const countries = [...new Set(visitors.map(v => v.country))];
    const cities = [...new Set(visitors.map(v => v.city))];
    const browsers = [...new Set(visitors.map(v => getBrowserInfo(v.userAgent)))];
    
    console.log(`   Unique Countries: ${countries.join(', ')}`);
    console.log(`   Unique Cities: ${cities.join(', ')}`);
    console.log(`   Browsers Used: ${browsers.join(', ')}`);
    console.log(`   Total Unique Visitors: ${new Set(visitors.map(v => v.ip)).size}`);
}

function getBrowserInfo(userAgent) {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
}

// Function to clear visitor log
function clearVisitorLog() {
    localStorage.removeItem('visitorLog');
    localStorage.removeItem('visitCount');
    console.log('🗑️ Visitor log cleared');
}

// Real-time visitor counter
function startRealtimeTracking() {
    // Track page interactions
    let interactions = 0;
    
    ['click', 'scroll', 'keydown'].forEach(event => {
        document.addEventListener(event, () => {
            interactions++;
            if (interactions % 10 === 0) {
                console.log(`🔥 User is active! ${interactions} interactions this session`);
            }
        }, { passive: true });
    });
    
    // Track time spent
    let timeSpent = 0;
    setInterval(() => {
        timeSpent += 5;
        if (timeSpent % 60 === 0) {
            console.log(`⏱️ User has been on site for ${timeSpent} seconds`);
        }
    }, 5000);
}

// Export functions for use in main script
window.analyticsTools = {
    setupAnalytics,
    initializeUserCounter,
    setupVisitorTracking,
    showVisitorLog,
    clearVisitorLog,
    startRealtimeTracking
};
