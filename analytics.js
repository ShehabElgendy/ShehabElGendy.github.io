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
        languages: navigator.languages?.join(', ') || navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack || 'not set',
        screen: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio || 1,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        url: window.location.href,
        referrer: document.referrer || 'Direct visit',
        sessionId: generateSessionId(),
        visitCount: getVisitCount(),
        onlineStatus: navigator.onLine ? 'Online' : 'Offline',
        javaEnabled: typeof java !== 'undefined',
        flashEnabled: getFlashVersion(),
        adBlocker: detectAdBlocker(),
        battery: 'detecting...',
        connection: getConnectionInfo(),
        memory: getMemoryInfo(),
        concurrency: navigator.hardwareConcurrency || 'unknown',
        touchSupport: getTouchSupport(),
        webGL: getWebGLInfo(),
        localStorage: isLocalStorageAvailable(),
        sessionStorage: isSessionStorageAvailable(),
        indexedDB: isIndexedDBAvailable()
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
        console.log(`   🌍 IP: ${visitor.ip} | ${visitor.city}, ${visitor.country} | ISP: ${visitor.isp}`);
        console.log(`   💻 Browser: ${getBrowserInfo(visitor.userAgent)} | OS: ${visitor.platform}`);
        console.log(`   📱 Screen: ${visitor.screen} | Viewport: ${visitor.viewport} | Touch: ${visitor.touchSupport}`);
        console.log(`   🌐 Languages: ${visitor.languages} | Timezone: ${visitor.timezone}`);
        console.log(`   🔧 CPU Cores: ${visitor.concurrency} | Memory: ${visitor.memory}`);
        console.log(`   📶 Connection: ${visitor.connection} | Online: ${visitor.onlineStatus}`);
        console.log(`   🎮 WebGL: ${visitor.webGL}`);
        console.log(`   🛡️ AdBlocker: ${visitor.adBlocker} | DoNotTrack: ${visitor.doNotTrack}`);
        console.log(`   💾 Storage: LS(${visitor.localStorage}) SS(${visitor.sessionStorage}) IDB(${visitor.indexedDB})`);
        console.log(`   📊 Referrer: ${visitor.referrer} | Visit #${visitor.visitCount}`);
        console.log(`   🆔 Session: ${visitor.sessionId}`);
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

// Helper functions for advanced visitor data
function getFlashVersion() {
    try {
        return navigator.plugins['Shockwave Flash'] ? 'Enabled' : 'Disabled';
    } catch (e) {
        return 'Unknown';
    }
}

function detectAdBlocker() {
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox';
    testAd.style.position = 'absolute';
    testAd.style.left = '-9999px';
    document.body.appendChild(testAd);
    
    setTimeout(() => {
        const adBlocked = testAd.offsetHeight === 0;
        document.body.removeChild(testAd);
        return adBlocked ? 'Detected' : 'None';
    }, 100);
    
    return 'Testing...';
}

function getConnectionInfo() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        return `${connection.effectiveType || 'unknown'} (${connection.downlink || 'unknown'} Mbps)`;
    }
    return 'Unknown';
}

function getMemoryInfo() {
    if ('memory' in performance) {
        const mem = performance.memory;
        return `${Math.round(mem.usedJSHeapSize / 1048576)}MB used / ${Math.round(mem.totalJSHeapSize / 1048576)}MB total`;
    }
    return 'Unknown';
}

function getTouchSupport() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) ? 'Yes' : 'No';
}

function getWebGLInfo() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
        const renderer = gl.getParameter(gl.RENDERER);
        const vendor = gl.getParameter(gl.VENDOR);
        return `${vendor} ${renderer}`.substring(0, 50);
    }
    return 'Not supported';
}

function isLocalStorageAvailable() {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return 'Available';
    } catch (e) {
        return 'Blocked';
    }
}

function isSessionStorageAvailable() {
    try {
        sessionStorage.setItem('test', 'test');
        sessionStorage.removeItem('test');
        return 'Available';
    } catch (e) {
        return 'Blocked';
    }
}

function isIndexedDBAvailable() {
    return 'indexedDB' in window ? 'Available' : 'Not supported';
}

// Function to clear visitor log
function clearVisitorLog() {
    localStorage.removeItem('visitorLog');
    localStorage.removeItem('visitCount');
    console.log('🗑️ Visitor log cleared');
}

// Real-time visitor counter
function startRealtimeTracking() {
    // Track page interactions (no scrolling)
    let interactions = 0;
    
    ['click', 'keydown'].forEach(event => {
        document.addEventListener(event, () => {
            interactions++;
            if (interactions % 5 === 0) {
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
