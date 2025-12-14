# Performance Metrics Toolbar

A powerful browser extension with a **non-intrusive floating button** that expands to show performance metrics on demand. Track real-time metrics with focus on API/XHR performance. **Fully supports Single Page Applications (SPAs)** with automatic route change detection.

## ✨ Key Features

### 🎯 Non-Intrusive Floating Design (v3.0)
- **Floating Button** - Small circular button in bottom-right corner (60px)
- **Expand on Click** - Click 📊 to see full metrics panel
- **Collapse Anytime** - Click again to minimize back to button
- **No Page Obstruction** - Only shows when you need it

### �️ Enterprise-Grade Reliability
- **Graceful Shutdown** - Automatic cleanup prevents memory leaks
- **Error Reporting** - Automatic error notifications + easy bug reporting via email or GitHub (🐛 button)
- **Auto-Prompt Notifications** - Get notified when errors occur with options to report, defer, or dismiss
- **Compatibility Checker** - Verify SPA/PWA compatibility (🔍 button)

### �📊 Smart Tabbed Interface
Metrics are organized into intuitive tabs preventing horizontal scrolling:
- **📊 Overview** - Load time, API calls, FPS, slowest call
- **⏱️ Timing** - DOM Ready, TTFB, Content Transfer
- **🌐 Network** - DNS, TCP, SSL, Data transferred
- **💾 Memory/FPS** - Heap usage, FPS counter

### 🎯 Core Performance Metrics
- **Server-Side Timings**:
  - DNS Lookup Time
  - TCP Connection Time
  - SSL/TLS Handshake Time
  - Time to First Byte (TTFB)
  - Content Transfer Time
  
- **Page Performance**:
  - DOM Ready Time
  - Total Page Load Time
  - Memory Usage (Chrome/Edge only)
  - Real-time FPS Counter

- **Network Analysis**:
  - Total Resource Count
  - API/XHR Call Count
  - Total Data Transferred
  - **Slowest API Call** with color-coded performance indicator

### 🚀 Single Page Application (SPA) Support

The extension **automatically detects and monitors** route changes in SPAs built with:
- React Router
- Vue Router
- Angular Router
- Any framework using History API
- Hash-based routing (#/path)

**How it works:**
- Monitors `pushState`, `replaceState`, and `popstate` events
- Detects hash changes (`hashchange` events)
- Polls for URL changes (fallback for custom routing)
- Observes DOM mutations to catch navigation changes
- Updates metrics automatically on each route change
- Shows navigation counter in toolbar title (e.g., "Nav: 3")

**Supported Frameworks:**
- ✅ React (React Router)
- ✅ Vue (Vue Router)
- ✅ Angular (Angular Router)
- ✅ Ember, Svelte, Backbone
- ✅ Any framework using History API or hash routing

### 📦 Progressive Web App (PWA) Compatible

Full support for Progressive Web Apps:
- Detects Service Workers
- Works in standalone mode
- Monitors installed PWAs
- Accounts for caching effects
- Click **🔍** button to check compatibility

### 🔍 Professional Modal Interface

**List View Table** - See all slow API calls at a glance
- Sortable table with: Endpoint, Duration, TTFB, Download, Size, Type
- Color-coded status indicators (🟢 fast, 🟠 medium, 🔴 slow)
- Hover effects for better usability
- Click any row for detailed analysis

**Detailed View** - Deep dive into individual API calls
- Performance classification with visual indicators
- Timing breakdown (Total, TTFB, Download)
- Connection metrics (DNS, TCP, SSL)
- Full URL and domain information
- Organized in grouped sections for clarity

### ⌨️ Keyboard Shortcuts
- `Ctrl+Shift+P` - Toggle minimize
- `Ctrl+Shift+R` - Refresh metrics
- `Ctrl+Shift+E` - Export HAR file
- `Ctrl+Shift+?` - Show keyboard help

### 🎨 Professional UI/UX
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Color-Coded Metrics** - Visual hierarchy with category-based colors
- **Smooth Animations** - Fade transitions and hover effects
- **Accessibility** - Aria labels, keyboard navigation, better contrast
- **Dark Mode** - Eye-friendly terminal aesthetic
- **Tooltips** - Helpful descriptions on hover

### 🎨 Terminal-Style UI
- Black background with yellow/green text for maximum readability
- Monospace font (Consolas/Monaco)
- Professional bottom bar design
- Minimizable to save screen space
- Mobile-optimized layout at top of page

### 🎨 User Experience
- **Always Visible**: Fixed at bottom of screen (top on mobile)
- **Non-intrusive**: Doesn't interfere with page interactions
- **Minimizable**: Collapse to just the header with − button
- **Auto-updating**: FPS updates continuously, metrics refresh on page events and SPA navigations
- **Manual refresh**: Click the ↻ button, double-click toolbar, or press Ctrl+Shift+R
- **SPA-aware**: Automatically updates on route changes

## Installation

### Chrome/Edge/Brave

1. Clone or download this repository
2. Open your browser and navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`

3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked"
5. Select the `perfMetrics` folder
6. The extension is now installed!

### Firefox

1. Clone or download this repository
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the `perfMetrics` folder
5. The extension is now installed!

> Note: Firefox installation is temporary and will be removed when you close the browser. For permanent installation, you'll need to package and sign the extension.

## Usage

1. Once installed, visit any webpage (including SPAs like React, Vue, or Angular apps)
2. The performance toolbar will automatically appear as a **terminal-style bar at the bottom** of the page
3. **View metrics** at a glance with yellow labels and green values
4. **Minimize/Maximize** by clicking the − / + button in the top-right
5. **Refresh metrics** by clicking the ↻ button or double-clicking anywhere on the toolbar
6. **Navigate in SPAs**: Metrics update automatically when you navigate between routes
7. **Click "Slowest Call"** to see detailed breakdown of top 5 slowest XHR/API calls
8. **Click "↓ HAR"** to download a HAR file with all XHR/API performance data
9. **Monitor FPS** in real-time with color-coded performance (green ≥50fps, yellow ≥30fps, red <30fps)
10. **Track navigations**: The toolbar title shows how many route changes have occurred (e.g., "Nav: 3")

## Metrics Explained

### Server-Side Metrics
- **DNS**: Time spent resolving the domain name
- **TCP**: Time to establish TCP connection
- **SSL**: SSL/TLS handshake time (HTTPS only)
- **TTFB**: Time to First Byte - server response time
- **Transfer**: Time to download the response content

### Page Metrics
- **DOM Ready**: Time until DOM content is fully loaded and parsed
- **Load Time**: Total time from navigation start to page load complete
- **API Calls**: Number of XHR/fetch requests detected
- **Transferred**: Total data transferred across all resources
- **Resources**: Total number of resources loaded (images, scripts, CSS, etc.)
- **Memory**: JavaScript heap memory usage (Chrome/Edge only)
- **FPS**: Current frames per second

### Slowest Call
- **Displays**: The slowest XHR/API call with duration
- **Color-coded**: Red (>1s), Orange (>500ms), Green (<500ms)
- **Clickable**: Opens detailed modal with top 5 slowest calls

- ### how to show up in the browser
<img width="1271" height="101" alt="2025-12-06 21_59_37-" src="https://github.com/user-attachments/assets/c5abb68b-6ede-4911-88f2-45edc8b5789b" />


## Files Structure

```
perfMetrics/
├── manifest.json       # Extension configuration (Manifest V3)
├── content.js          # Main logic for performance tracking and UI
├── toolbar.css         # Terminal-style styling for the bottom bar
├── create-icons.html   # Helper tool to generate extension icons
└── README.md          # This file
```

## Key Features Breakdown

### HAR File Export
The extension generates industry-standard HTTP Archive (HAR) files containing:
- **XHR/Fetch calls only** (filters out images, CSS, fonts, etc.)
- Complete timing breakdown per request
- Request/response metadata
- Query parameters
- Transfer sizes
- Perfect for performance analysis and debugging

### Slowest Call Modal
- Displays top 5 slowest API/XHR calls
- Shows complete timing breakdown (DNS, TCP, SSL, TTFB, Download)
- Color-coded by performance
- Filterable by URL pattern
- Close with ESC key or click outside

### Console Logging
All API calls are automatically logged to the browser console with:
- Request URL
- Duration
- Transfer size
- Request type

## Browser Compatibility

- ✅ Chrome (v88+)
- ✅ Edge (v88+)
- ✅ Brave
- ✅ Opera
- ⚠️ Firefox (requires minor manifest adjustments for permanent install)
- ⚠️ Safari (requires conversion to Safari extension format)

## Privacy

This extension:
- ✅ Does NOT collect any data
- ✅ Does NOT make external network requests
- ✅ Does NOT track your browsing
- ✅ Runs entirely locally on your machine
- ✅ Only reads performance metrics from the browser's Performance API
- ✅ HAR files are generated and downloaded locally - never sent anywhere

## Customization

You can customize the toolbar appearance by editing `toolbar.css`:
- **Colors**: Change terminal colors (currently black bg, yellow labels, green values)
- **Fonts**: Modify monospace font family
- **Size**: Adjust padding, font sizes, or gap spacing
- **Position**: Already optimized for bottom bar, but adjustable

Example customizations:
```css
/* Change to blue theme */
.perf-toolbar {
  background: #001a33;
  border-top: 2px solid #0099ff;
}

.perf-metric-label {
  color: #66ccff;
}

.perf-metric-value {
  color: #0099ff;
}
```

## Development

To modify the extension:

1. Make your changes to the source files
2. Go to your browser's extensions page (`chrome://extensions/`)
3. Click the refresh icon on the extension card
4. Reload any open tabs to see your changes

### Adding New Metrics

Edit `content.js` to add new metrics:
1. Add HTML for the metric in `createToolbar()` method
2. Calculate the metric in `updateMetrics()` method
3. Update the element using `document.getElementById()`

### Modifying HAR Export

The `generateHAR()` method filters and exports network data. Modify the filter in:
```javascript
const xhrCalls = resources.filter(r => 
  r.initiatorType === 'fetch' || 
  r.initiatorType === 'xmlhttprequest'
);
```

## Use Cases

- 🔍 **API Performance Debugging**: Identify slow backend endpoints
- 📊 **Performance Monitoring**: Track page metrics during development
- 🚀 **Optimization**: Find bottlenecks in DNS, SSL, or server response times
- 📁 **Documentation**: Export HAR files for bug reports or team sharing
- 🎯 **Client Demos**: Show performance improvements to stakeholders
- 🧪 **Testing**: Monitor performance across different environments

## Troubleshooting

**Toolbar not appearing?**
- Check if the extension is enabled in `chrome://extensions/`
- Refresh the page after installing
- Check browser console for errors

**Metrics showing "N/A"?**
- Some metrics require HTTPS (like SSL time)
- Memory API is only available in Chrome/Edge
- Wait for page to fully load

**HAR file empty?**
- Only XHR/fetch calls are included
- Some sites may not make API calls
- Check browser console for logged API calls

## Keyboard Shortcuts

- **ESC**: Close slowest calls modal
- **Double-click toolbar**: Refresh all metrics

## License

MIT License - feel free to use and modify as needed!

## Support

If you encounter any issues or have suggestions, please open an issue on the GitHub repository.

## Changelog

### Version 1.0.0
- ✅ Terminal-style UI with black background and yellow/green text
- ✅ Server-side timing metrics (DNS, TCP, SSL, TTFB, Transfer)
- ✅ XHR/API call tracking and counting
- ✅ Slowest call display with color-coded performance
- ✅ Interactive modal showing top 5 slowest calls
- ✅ HAR file export (XHR/API calls only)
- ✅ Real-time FPS monitoring
- ✅ Memory usage tracking
- ✅ Total data transferred tracking
- ✅ Console logging of API calls
- ✅ Minimizable toolbar
- ✅ Full-width bottom bar design

## 📚 Documentation

### Project Structure
See **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** for complete architecture details, design patterns, and code organization.

### Detailed Documentation
For detailed information, see the [docs](docs/) folder:
- **[INDEX.md](docs/INDEX.md)** - Complete documentation index and navigation
- **[CHANGELOG.md](docs/CHANGELOG.md)** - Version history and changes
- **[IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[UI_UX_IMPROVEMENTS.md](docs/UI_UX_IMPROVEMENTS.md)** - UI/UX analysis and recommendations
- **[VISUAL_PREVIEW.md](docs/VISUAL_PREVIEW.md)** - Visual mockups and design system

### Source Code
See **[src/README.md](src/README.md)** for module architecture and design patterns applied.

## Credits

Built with:
- JavaScript Performance API
- HAR (HTTP Archive) format specification
- Browser extension Manifest V3

---

**Monitor, analyze, and optimize your web performance!** ⚡🖥️



