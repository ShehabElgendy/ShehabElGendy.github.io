# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a static portfolio website for Shehab ElGendy built with vanilla HTML, CSS, and JavaScript. The site showcases game development projects, skills, and contact information using modern glassmorphism design.

### Core Structure
- **Single Page Application**: All content is in `index.html` with section-based navigation
- **Vanilla JavaScript Architecture**: No frameworks - uses ES6+ features with modular script loading
- **Static Deployment**: Hosted on GitHub Pages with manual cache busting

### File Organization
```
├── index.html              # Main portfolio page with all sections
├── style.css              # Primary stylesheet with CSS custom properties
├── script.js              # Core functionality and navigation
├── modern-enhancements.js  # UI/UX enhancements and animations
├── particles.js           # Particle animation effects
├── enhanced-animations.js  # Advanced animation systems
├── enhanced-features.js    # Additional interactive features  
├── analytics.js           # Google Analytics integration
├── aos-animations.js      # AOS (Animate On Scroll) library integration
└── images/                # Project screenshots and assets
```

### Script Loading Order (Important)
Scripts must load in this specific order to avoid dependency issues:
1. `aos-animations.js` - AOS library setup
2. `modern-enhancements.js` - Core UI enhancements
3. `analytics.js` - Analytics tracking
4. `script.js` - Main functionality
5. `particles.js` - Particle effects
6. `enhanced-animations.js` - Advanced animations
7. `enhanced-features.js` - Additional features

## Development Commands

**No build system exists** - this is a pure static site. Changes are made directly to source files.

### Local Development
- Open `index.html` directly in browser OR
- Use a simple HTTP server: `python -m http.server 8000` or `npx http-server`

### Cache Busting
- Manual versioning system using query parameters (e.g., `?v=2025010701`)
- Update version numbers in `index.html` when modifying CSS/JS files
- Current version pattern: `YYYYMMDDHH` format

## Design System

### CSS Architecture
- **CSS Custom Properties**: All design tokens defined in `:root` selector in `style.css`
- **Glassmorphism Theme**: Semi-transparent elements with backdrop blur effects
- **Mobile-First**: Responsive design using CSS Grid and Flexbox
- **Animation System**: CSS transitions with consistent cubic-bezier timing

### Key Design Tokens (in `style.css`)
- Primary: `#00d9ff` (cyan)
- Secondary: `#8b5cf6` (purple) 
- Accent: `#f59e0b` (amber)
- Glass effects use `backdrop-filter: blur()` with transparency

### JavaScript Architecture
- **Event-driven**: Uses event delegation and modern event listeners
- **Performance optimized**: Lazy loading, efficient scroll handlers
- **Mobile considerations**: Touch events, responsive behavior
- **No jQuery or frameworks**: Pure vanilla JS with ES6+ syntax

## Content Management

### Adding New Projects
1. Add project image to `images/` directory
2. Update portfolio section in `index.html` following existing structure
3. Include video URLs (Google Drive embeds) and external links
4. Test responsive layout across devices

### Updating Styles
1. Modify CSS custom properties in `:root` for global changes
2. Follow existing glassmorphism patterns
3. Maintain consistent animation timing (0.3s cubic-bezier(0.4, 0, 0.2, 1))

### Performance Considerations
- Large image files exist (2.2MB, 1.6MB, 1.2MB, 1MB) - optimization needed
- No minification currently implemented
- Google Analytics tracking ID: G-95G4Y8NTMR

## Key Technical Details

### External Dependencies
- Google Fonts (Inter font family)
- Font Awesome 6.0.0 for icons
- LightGallery.js for media viewing
- Technology icons from cdnjs.cloudflare.com and cdn.jsdelivr.net

### Browser Support
- Modern browsers with CSS Grid, Flexbox, and backdrop-filter support
- ES6+ JavaScript features used throughout
- No IE support due to modern CSS features

### Analytics Integration
- Google Analytics 4 with custom event tracking
- Events tracked: project views, external link clicks, navigation

## Development Notes

- **Read `style.css` first** to understand the design system before making style changes
- **Check existing JavaScript files** before adding new functionality to avoid duplication
- **Follow glassmorphism patterns** when adding new UI elements
- **Test mobile responsive design** - the site is heavily used on mobile devices
- **Use semantic HTML** and maintain accessibility considerations
- **Cache bust appropriately** by updating version numbers in HTML when modifying assets

## Known Technical Debt

1. **Image Optimization**: Large PNG files impact loading performance
2. **No Build Process**: Manual cache busting and no minification
3. **No Automated Testing**: No linting or testing setup currently
4. **Performance**: Could benefit from lazy loading improvements and WebP image format