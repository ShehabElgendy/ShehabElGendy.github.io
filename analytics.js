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
    const visitors = JSON.parse(localStorage.getItem('uniqueVisitors') || '{}');
    const visitorKey = data.ip || data.userAgent.substring(0, 50); // Use IP as primary identifier
    
    if (visitors[visitorKey]) {
        // Existing visitor - update visit count and last visit
        visitors[visitorKey].visitCount++;
        visitors[visitorKey].lastVisit = data.timestamp;
        visitors[visitorKey].sessions.push({
            timestamp: data.timestamp,
            sessionId: data.sessionId,
            viewport: data.viewport,
            referrer: data.referrer
        });
        
        console.log(`🔄 RETURNING VISITOR: ${data.ip} (${data.city}) - Visit #${visitors[visitorKey].visitCount}`);
    } else {
        // New unique visitor
        visitors[visitorKey] = {
            firstVisit: data.timestamp,
            lastVisit: data.timestamp,
            visitCount: 1,
            ip: data.ip,
            city: data.city,
            country: data.country,
            isp: data.isp,
            browser: getBrowserInfo(data.userAgent),
            platform: data.platform,
            screen: data.screen,
            languages: data.languages,
            timezone: data.timezone,
            touchSupport: data.touchSupport,
            webGL: data.webGL,
            concurrency: data.concurrency,
            memory: data.memory,
            connection: data.connection,
            adBlocker: data.adBlocker,
            sessions: [{
                timestamp: data.timestamp,
                sessionId: data.sessionId,
                viewport: data.viewport,
                referrer: data.referrer
            }]
        };
        
        console.log('🕵️ NEW UNIQUE VISITOR:', data);
    }
    
    // Keep only last 500 unique visitors
    const visitorKeys = Object.keys(visitors);
    if (visitorKeys.length > 500) {
        // Remove oldest visitors
        const oldestKeys = visitorKeys
            .sort((a, b) => new Date(visitors[a].lastVisit) - new Date(visitors[b].lastVisit))
            .slice(0, visitorKeys.length - 500);
        oldestKeys.forEach(key => delete visitors[key]);
    }
    
    localStorage.setItem('uniqueVisitors', JSON.stringify(visitors));
    
    // Track in Google Analytics
    gtag('event', 'visitor_tracked', {
        'visitor_country': data.country,
        'visitor_city': data.city,
        'visit_count': visitors[visitorKey].visitCount,
        'visitor_type': visitors[visitorKey].visitCount === 1 ? 'new' : 'returning'
    });
}

// Function to display visitor log
function showVisitorLog() {
    const visitors = JSON.parse(localStorage.getItem('uniqueVisitors') || '{}');
    const visitorKeys = Object.keys(visitors);
    
    if (visitorKeys.length === 0) {
        console.log('📊 No visitors logged yet');
        return;
    }
    
    // Sort by last visit (most recent first)
    const sortedVisitors = visitorKeys.sort((a, b) => 
        new Date(visitors[b].lastVisit) - new Date(visitors[a].lastVisit)
    );
    
    console.log(`📊 UNIQUE VISITORS LOG (${visitorKeys.length} unique visitors):`);
    console.log('='.repeat(80));
    
    sortedVisitors.forEach((key, index) => {
        const visitor = visitors[key];
        const firstVisit = new Date(visitor.firstVisit);
        const lastVisit = new Date(visitor.lastVisit);
        const totalSessions = visitor.sessions.length;
        
        console.log(`\n👤 Visitor #${index + 1} | ${visitor.visitCount} visits | Last: ${lastVisit.toLocaleString()}`);
        console.log(`   🌍 IP: ${visitor.ip} | ${visitor.city}, ${visitor.country} | ISP: ${visitor.isp}`);
        console.log(`   💻 Browser: ${visitor.browser} | OS: ${visitor.platform} | Screen: ${visitor.screen}`);
        console.log(`   🌐 Languages: ${visitor.languages} | Timezone: ${visitor.timezone}`);
        console.log(`   🔧 CPU: ${visitor.concurrency} cores | Memory: ${visitor.memory} | Touch: ${visitor.touchSupport}`);
        console.log(`   📶 Connection: ${visitor.connection} | AdBlock: ${visitor.adBlocker}`);
        console.log(`   🎮 WebGL: ${visitor.webGL}`);
        console.log(`   📅 First Visit: ${firstVisit.toLocaleString()}`);
        
        if (totalSessions > 1) {
            console.log(`   🔄 Recent Sessions:`);
            visitor.sessions.slice(-3).forEach((session, i) => {
                const sessionDate = new Date(session.timestamp);
                console.log(`      ${i + 1}. ${sessionDate.toLocaleString()} | ${session.referrer}`);
            });
        }
    });
    
    console.log('\n📈 Quick Stats:');
    const totalVisits = Object.values(visitors).reduce((sum, v) => sum + v.visitCount, 0);
    const countries = [...new Set(Object.values(visitors).map(v => v.country))];
    const cities = [...new Set(Object.values(visitors).map(v => v.city))];
    const browsers = [...new Set(Object.values(visitors).map(v => v.browser))];
    const returningVisitors = Object.values(visitors).filter(v => v.visitCount > 1).length;
    
    console.log(`   Total Unique Visitors: ${visitorKeys.length}`);
    console.log(`   Total Page Views: ${totalVisits}`);
    console.log(`   Returning Visitors: ${returningVisitors} (${Math.round(returningVisitors/visitorKeys.length*100)}%)`);
    console.log(`   Countries: ${countries.join(', ')}`);
    console.log(`   Cities: ${cities.join(', ')}`);
    console.log(`   Browsers: ${browsers.join(', ')}`);
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
    localStorage.removeItem('uniqueVisitors');
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
