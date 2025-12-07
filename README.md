# Performance Metrics Toolbar

A powerful browser extension that displays a terminal-style performance bar at the bottom of every webpage, tracking real-time metrics with a focus on API/XHR performance analysis.

## Features

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

### 🔍 Advanced Features

- **Interactive Slowest Call Analysis**: Click the "Slowest Call" metric to view detailed breakdown of the top 5 slowest XHR/API calls including:
  - Full URL and domain
  - Total duration (color-coded: 🟢 <500ms, 🟠 >500ms, 🔴 >1000ms)
  - Time to First Byte (TTFB)
  - Download time
  - Transfer size
  - DNS, TCP, and SSL timings
  - Request type

- **HAR File Export**: Download complete network performance data for XHR/API calls only
  - Click the "↓ HAR" button in the toolbar
  - Import into Chrome DevTools, WebPageTest, or other performance tools
  - Perfect for sharing performance data or archiving snapshots

- **Terminal-Style UI**:
  - Black background with yellow/green text for maximum readability
  - Monospace font (Consolas/Monaco)
  - Full-width bottom bar design
  - Minimizable to save screen space

### 🎨 User Experience
- **Always Visible**: Fixed at bottom of screen
- **Non-intrusive**: Doesn't interfere with page interactions
- **Minimizable**: Collapse to just the header with + button
- **Auto-updating**: FPS updates continuously, metrics refresh on page events
- **Double-click to refresh**: Manually refresh all metrics anytime

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

1. Once installed, visit any webpage
2. The performance toolbar will automatically appear as a **terminal-style bar at the bottom** of the page
3. **View metrics** at a glance with yellow labels and green values
4. **Minimize/Maximize** by clicking the − / + button in the top-right
5. **Refresh metrics** by double-clicking anywhere on the toolbar
6. **Click "Slowest Call"** to see detailed breakdown of top 5 slowest XHR/API calls
7. **Click "↓ HAR"** to download a HAR file with all XHR/API performance data
8. **Monitor FPS** in real-time with color-coded performance (green ≥50fps, yellow ≥30fps, red <30fps)

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

### images
<img width="1269" height="75" alt="image" src="https://github.com/user-attachments/assets/7a875476-69c5-4252-9d2d-67ad58935dfa" />


## Credits

Built with:
- JavaScript Performance API
- HAR (HTTP Archive) format specification
- Browser extension Manifest V3

---

**Monitor, analyze, and optimize your web performance!** ⚡🖥️

