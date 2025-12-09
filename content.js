// Performance Metrics Toolbar - Content Script

class PerformanceToolbar {
  constructor() {
    this.toolbar = null;
    this.isDragging = false;
    this.currentX = 0;
    this.currentY = 0;
    this.initialX = 0;
    this.initialY = 0;
    this.xOffset = 0;
    this.yOffset = 0;
    this.isMinimized = false;
    this.slowCalls = [];
    this.lastUrl = location.href;
    this.observer = null;
    this.navigationCount = 0;
    
    this.init();
  }

  init() {
    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.createToolbar());
    } else {
      this.createToolbar();
    }
    
    // Update metrics when page load completes
    window.addEventListener('load', () => {
      setTimeout(() => this.updateMetrics(), 100);
    });
    
    // Monitor for SPA navigation changes
    this.setupSPAMonitoring();
  }

  setupSPAMonitoring() {
    // Monitor History API (pushState, replaceState, popstate)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    const self = this;
    
    history.pushState = function() {
      originalPushState.apply(this, arguments);
      self.onRouteChange();
    };
    
    history.replaceState = function() {
      originalReplaceState.apply(this, arguments);
      self.onRouteChange();
    };
    
    window.addEventListener('popstate', () => {
      this.onRouteChange();
    });
    
    // Monitor hash changes
    window.addEventListener('hashchange', () => {
      this.onRouteChange();
    });
    
    // Fallback: Poll for URL changes (for frameworks that don't use standard APIs)
    setInterval(() => {
      if (location.href !== this.lastUrl) {
        this.lastUrl = location.href;
        this.onRouteChange();
      }
    }, 500);
    
    // Monitor DOM changes that might indicate navigation
    this.observer = new MutationObserver(() => {
      if (location.href !== this.lastUrl) {
        this.lastUrl = location.href;
        this.onRouteChange();
      }
    });
    
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  onRouteChange() {
    this.navigationCount++;
    console.log(`🔄 SPA Navigation detected (#${this.navigationCount}): ${location.href}`);
    
    // Clear existing performance entries for the new navigation
    if (performance.clearResourceTimings) {
      performance.clearResourceTimings();
    }
    
    // Update metrics after a short delay to allow API calls to complete
    setTimeout(() => {
      this.updateMetrics();
      this.updateToolbarTitle();
    }, 1000);
    
    // Update again after more time for lazy-loaded content
    setTimeout(() => {
      this.updateMetrics();
    }, 3000);
  }

  updateToolbarTitle() {
    const titleElement = this.toolbar.querySelector('.perf-toolbar-title');
    if (titleElement) {
      titleElement.textContent = `▸ Performance Metrics (Nav: ${this.navigationCount})`;
    }
  }

  createToolbar() {
    // Create toolbar container
    this.toolbar = document.createElement('div');
    this.toolbar.id = 'perf-metrics-toolbar';
    this.toolbar.className = 'perf-toolbar';
    
    // Create header with drag handle and minimize button
    const header = document.createElement('div');
    header.className = 'perf-toolbar-header';
    header.innerHTML = `
      <span class="perf-toolbar-title">▸ Performance Metrics</span>
      <div style="display: flex; gap: 8px; align-items: center;">
        <button class="perf-toolbar-refresh" title="Refresh Metrics">↻</button>
        <button class="perf-toolbar-download" title="Download HAR File">↓ HAR</button>
        <button class="perf-toolbar-minimize" title="Minimize">−</button>
      </div>
    `;
    
    // Create metrics container
    const metricsContainer = document.createElement('div');
    metricsContainer.className = 'perf-toolbar-metrics';
    metricsContainer.innerHTML = `
      <div class="perf-metric">
        <span class="perf-metric-label">DNS:</span>
        <span class="perf-metric-value" id="perf-dns">--</span>
      </div>
      <div class="perf-metric">
        <span class="perf-metric-label">TCP:</span>
        <span class="perf-metric-value" id="perf-tcp">--</span>
      </div>
      <div class="perf-metric">
        <span class="perf-metric-label">SSL:</span>
        <span class="perf-metric-value" id="perf-ssl">--</span>
      </div>
      <div class="perf-metric">
        <span class="perf-metric-label">TTFB:</span>
        <span class="perf-metric-value" id="perf-ttfb">--</span>
      </div>
      <div class="perf-metric">
        <span class="perf-metric-label">Transfer:</span>
        <span class="perf-metric-value" id="perf-transfer">--</span>
      </div>
      <div class="perf-metric">
        <span class="perf-metric-label">DOM Ready:</span>
        <span class="perf-metric-value" id="perf-dom-ready">--</span>
      </div>
      <div class="perf-metric">
        <span class="perf-metric-label">Load Time:</span>
        <span class="perf-metric-value" id="perf-load-time">--</span>
      </div>
      <div class="perf-metric">
        <span class="perf-metric-label">API Calls:</span>
        <span class="perf-metric-value" id="perf-api-calls">--</span>
      </div>
      <div class="perf-metric">
        <span class="perf-metric-label">Transferred:</span>
        <span class="perf-metric-value" id="perf-size">--</span>
      </div>
      <div class="perf-metric">
        <span class="perf-metric-label">Resources:</span>
        <span class="perf-metric-value" id="perf-resources">--</span>
      </div>
      <div class="perf-metric">
        <span class="perf-metric-label">Memory:</span>
        <span class="perf-metric-value" id="perf-memory">--</span>
      </div>
      <div class="perf-metric">
        <span class="perf-metric-label">FPS:</span>
        <span class="perf-metric-value" id="perf-fps">--</span>
      </div>
      <div class="perf-metric" style="flex: 1; min-width: 300px; cursor: pointer;" id="slowest-call-container" title="Click for details">
        <span class="perf-metric-label">Slowest Call:</span>
        <span class="perf-metric-value" id="perf-slowest" style="min-width: auto; max-width: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">--</span>
      </div>
    `;
    
    this.toolbar.appendChild(header);
    this.toolbar.appendChild(metricsContainer);
    document.body.appendChild(this.toolbar);
    
    // Set up event listeners
    this.setupEventListeners(header);
    
    // Initial metrics update
    this.updateMetrics();
    
    // Update FPS continuously
    this.startFPSMonitoring();
  }

  setupEventListeners(header) {
    // Drag functionality
    header.addEventListener('mousedown', (e) => this.dragStart(e));
    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('mouseup', () => this.dragEnd());
    
    // Minimize/maximize functionality
    const minimizeBtn = this.toolbar.querySelector('.perf-toolbar-minimize');
    minimizeBtn.addEventListener('click', () => this.toggleMinimize());
    
    // Refresh functionality
    const refreshBtn = this.toolbar.querySelector('.perf-toolbar-refresh');
    refreshBtn.addEventListener('click', () => {
      console.log('🔄 Manual refresh triggered');
      this.updateMetrics();
    });
    
    // Download HAR functionality
    const downloadBtn = this.toolbar.querySelector('.perf-toolbar-download');
    downloadBtn.addEventListener('click', () => this.downloadHAR());
    
    // Refresh metrics on double-click
    this.toolbar.addEventListener('dblclick', (e) => {
      if (!e.target.classList.contains('perf-toolbar-minimize') && 
          !e.target.classList.contains('perf-toolbar-download') &&
          !e.target.classList.contains('perf-toolbar-refresh')) {
        this.updateMetrics();
      }
    });
    
    // Click handler for slowest call details
    const slowestContainer = document.getElementById('slowest-call-container');
    if (slowestContainer) {
      slowestContainer.addEventListener('click', () => this.showSlowCallsModal());
    }
  }

  dragStart(e) {
    if (e.target.classList.contains('perf-toolbar-minimize')) return;
    
    this.initialX = e.clientX - this.xOffset;
    this.initialY = e.clientY - this.yOffset;
    this.isDragging = true;
    this.toolbar.style.cursor = 'grabbing';
  }

  drag(e) {
    if (this.isDragging) {
      e.preventDefault();
      this.currentX = e.clientX - this.initialX;
      this.currentY = e.clientY - this.initialY;
      this.xOffset = this.currentX;
      this.yOffset = this.currentY;
      
      this.toolbar.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;
    }
  }

  dragEnd() {
    this.isDragging = false;
    this.toolbar.style.cursor = 'grab';
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    const metricsContainer = this.toolbar.querySelector('.perf-toolbar-metrics');
    const minimizeBtn = this.toolbar.querySelector('.perf-toolbar-minimize');
    
    if (this.isMinimized) {
      metricsContainer.style.display = 'none';
      metricsContainer.style.padding = '0';
      metricsContainer.style.height = '0';
      minimizeBtn.textContent = '+';
      minimizeBtn.title = 'Maximize';
    } else {
      metricsContainer.style.display = 'flex';
      metricsContainer.style.padding = '10px 20px';
      metricsContainer.style.height = 'auto';
      minimizeBtn.textContent = '−';
      minimizeBtn.title = 'Minimize';
    }
  }

  updateMetrics() {
    const timing = performance.timing;
    const navigation = performance.getEntriesByType('navigation')[0];
    
    // For SPAs, DNS/TCP/SSL might be 0 after first load
    // DNS Lookup Time
    const dnsTime = timing.domainLookupEnd - timing.domainLookupStart;
    document.getElementById('perf-dns').textContent = 
      dnsTime >= 0 ? `${dnsTime}ms` : 'N/A';
    
    // TCP Connection Time
    const tcpTime = timing.connectEnd - timing.connectStart;
    document.getElementById('perf-tcp').textContent = 
      tcpTime >= 0 ? `${tcpTime}ms` : 'N/A';
    
    // SSL/TLS Time
    const sslTime = timing.secureConnectionStart > 0 
      ? timing.connectEnd - timing.secureConnectionStart 
      : 0;
    document.getElementById('perf-ssl').textContent = 
      sslTime > 0 ? `${sslTime}ms` : 'N/A';
    
    // Time to First Byte (TTFB)
    const ttfb = timing.responseStart - timing.requestStart;
    document.getElementById('perf-ttfb').textContent = 
      ttfb > 0 ? `${ttfb}ms` : 'N/A';
    
    // Content Transfer Time
    const transferTime = timing.responseEnd - timing.responseStart;
    document.getElementById('perf-transfer').textContent = 
      transferTime > 0 ? `${transferTime}ms` : 'N/A';
    
    // Load Time
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    document.getElementById('perf-load-time').textContent = 
      loadTime > 0 ? `${loadTime}ms` : 'Loading...';
    
    // DOM Ready Time
    const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
    document.getElementById('perf-dom-ready').textContent = 
      domReady > 0 ? `${domReady}ms` : 'Loading...';
    
    // Resources and API Calls
    const resources = performance.getEntriesByType('resource');
    const apiCalls = resources.filter(r => 
      r.initiatorType === 'fetch' || 
      r.initiatorType === 'xmlhttprequest' ||
      (r.name.includes('/api/') || r.name.includes('.json'))
    );
    
    document.getElementById('perf-resources').textContent = resources.length;
    document.getElementById('perf-api-calls').textContent = apiCalls.length;
    
    // Find slowest XHR/fetch calls only (top 5)
    const callsWithDuration = apiCalls.map(r => ({
      name: r.name,
      duration: r.responseEnd - r.requestStart,
      size: r.transferSize || 0,
      type: r.initiatorType,
      ttfb: r.responseStart - r.requestStart,
      dns: r.domainLookupEnd - r.domainLookupStart,
      tcp: r.connectEnd - r.connectStart,
      ssl: r.secureConnectionStart > 0 ? r.connectEnd - r.secureConnectionStart : 0,
      download: r.responseEnd - r.responseStart
    })).sort((a, b) => b.duration - a.duration);
    
    this.slowCalls = callsWithDuration.slice(0, 5);
    
    // Display slowest call
    if (this.slowCalls.length > 0) {
      const slowest = this.slowCalls[0];
      const urlParts = slowest.name.split('/');
      const fileName = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || 'unknown';
      const displayName = fileName.length > 40 ? fileName.substring(0, 37) + '...' : fileName;
      
      const slowestEl = document.getElementById('perf-slowest');
      slowestEl.textContent = `${displayName} (${slowest.duration.toFixed(0)}ms)`;
      
      // Color code based on duration
      if (slowest.duration > 1000) {
        slowestEl.style.color = '#ff4444'; // Red for >1s
      } else if (slowest.duration > 500) {
        slowestEl.style.color = '#ffaa00'; // Orange for >500ms
      } else {
        slowestEl.style.color = '#00ff00'; // Green
      }
    } else {
      document.getElementById('perf-slowest').textContent = 'N/A';
    }
    
    // Total Transfer Size
    let totalSize = 0;
    if (navigation && navigation.transferSize) {
      totalSize = navigation.transferSize;
      resources.forEach(r => {
        if (r.transferSize) totalSize += r.transferSize;
      });
    }
    const sizeInKB = (totalSize / 1024).toFixed(1);
    document.getElementById('perf-size').textContent = 
      totalSize > 0 ? `${sizeInKB}KB` : 'N/A';
    
    // Memory (if available)
    if (performance.memory) {
      const memoryUsed = (performance.memory.usedJSHeapSize / 1048576).toFixed(1);
      document.getElementById('perf-memory').textContent = `${memoryUsed}MB`;
    } else {
      document.getElementById('perf-memory').textContent = 'N/A';
    }
    
    // Log API call details to console for debugging
    if (apiCalls.length > 0) {
      console.group('🔍 API Calls Performance Details');
      apiCalls.forEach((call, index) => {
        const duration = call.responseEnd - call.requestStart;
        console.log(`${index + 1}. ${call.name}`);
        console.log(`   Duration: ${duration.toFixed(2)}ms`);
        console.log(`   Size: ${(call.transferSize / 1024).toFixed(2)}KB`);
        console.log(`   Type: ${call.initiatorType}`);
      });
      console.groupEnd();
    }
  }

  startFPSMonitoring() {
    let lastTime = performance.now();
    let frames = 0;
    
    const countFrame = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        document.getElementById('perf-fps').textContent = fps;
        
        // Color code based on FPS
        const fpsElement = document.getElementById('perf-fps');
        if (fps >= 50) {
          fpsElement.style.color = '#4ade80';
        } else if (fps >= 30) {
          fpsElement.style.color = '#fbbf24';
        } else {
          fpsElement.style.color = '#f87171';
        }
        
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(countFrame);
    };
    
    requestAnimationFrame(countFrame);
  }

  showSlowCallsModal() {
    if (this.slowCalls.length === 0) {
      console.log('No slow calls to display');
      return;
    }
    
    // Create modal backdrop
    const modal = document.createElement('div');
    modal.id = 'perf-slow-calls-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.9);
      z-index: 2147483646;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      padding: 20px;
    `;
    
    // Create modal content
    const content = document.createElement('div');
    content.style.cssText = `
      background: #000000;
      border: 2px solid #00ff00;
      max-width: 900px;
      max-height: 80vh;
      overflow-y: auto;
      padding: 20px;
      color: #00ff00;
    `;
    
    let html = '<div style="margin-bottom: 20px; border-bottom: 2px solid #00ff00; padding-bottom: 10px;">';
    html += '<h2 style="color: #ffff00; margin: 0 0 10px 0; font-size: 18px;">⚠ TOP 5 SLOWEST XHR/API CALLS</h2>';
    html += '<button id="close-modal" style="background: #ff0000; color: #fff; border: 1px solid #fff; padding: 5px 15px; cursor: pointer; float: right; font-family: monospace;">CLOSE [ESC]</button>';
    html += '</div>';
    
    this.slowCalls.forEach((call, index) => {
      const urlParts = call.name.split('/');
      const fileName = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
      const domain = new URL(call.name).hostname;
      
      let color = '#00ff00';
      if (call.duration > 1000) color = '#ff4444';
      else if (call.duration > 500) color = '#ffaa00';
      
      html += `
        <div style="margin-bottom: 20px; padding: 15px; background: #0a0a0a; border-left: 4px solid ${color};">
          <div style="color: #ffff00; font-weight: bold; margin-bottom: 8px; font-size: 14px;">
            #${index + 1} - ${fileName}
          </div>
          <div style="color: #888; font-size: 12px; margin-bottom: 10px; word-break: break-all;">
            ${call.name}
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; font-size: 13px;">
            <div><span style="color: #ffff00;">Total:</span> <span style="color: ${color}; font-weight: bold;">${call.duration.toFixed(2)}ms</span></div>
            <div><span style="color: #ffff00;">TTFB:</span> ${call.ttfb.toFixed(2)}ms</div>
            <div><span style="color: #ffff00;">Download:</span> ${call.download.toFixed(2)}ms</div>
            <div><span style="color: #ffff00;">Size:</span> ${(call.size / 1024).toFixed(2)}KB</div>
            <div><span style="color: #ffff00;">DNS:</span> ${call.dns.toFixed(2)}ms</div>
            <div><span style="color: #ffff00;">TCP:</span> ${call.tcp.toFixed(2)}ms</div>
            <div><span style="color: #ffff00;">SSL:</span> ${call.ssl > 0 ? call.ssl.toFixed(2) + 'ms' : 'N/A'}</div>
            <div><span style="color: #ffff00;">Type:</span> ${call.type}</div>
            <div><span style="color: #ffff00;">Domain:</span> ${domain}</div>
          </div>
        </div>
      `;
    });
    
    content.innerHTML = html;
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Close handlers
    const closeModal = () => {
      if (document.getElementById('perf-slow-calls-modal')) {
        document.body.removeChild(modal);
      }
    };
    
    document.getElementById('close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    });
  }

  downloadHAR() {
    const harData = this.generateHAR();
    const harJSON = JSON.stringify(harData, null, 2);
    const blob = new Blob([harJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const pageName = document.title.replace(/[^a-z0-9]/gi, '_').substring(0, 30) || 'page';
    link.download = `${pageName}_${timestamp}.har`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ HAR file downloaded successfully');
  }

  generateHAR() {
    const timing = performance.timing;
    const navigation = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');
    
    // Filter to only XHR and fetch calls
    const xhrCalls = resources.filter(r => 
      r.initiatorType === 'fetch' || 
      r.initiatorType === 'xmlhttprequest' ||
      (r.name.includes('/api/') || r.name.includes('.json'))
    );
    
    const entries = [];
    
    // Add only XHR/fetch resource entries
    xhrCalls.forEach(resource => {
      const entry = {
        startedDateTime: new Date(timing.navigationStart + resource.startTime).toISOString(),
        time: resource.duration,
        request: {
          method: 'GET',
          url: resource.name,
          httpVersion: 'HTTP/1.1',
          headers: [],
          queryString: this.parseQueryString(resource.name),
          cookies: [],
          headersSize: -1,
          bodySize: -1
        },
        response: {
          status: 200,
          statusText: 'OK',
          httpVersion: 'HTTP/1.1',
          headers: [],
          cookies: [],
          content: {
            size: resource.transferSize || 0,
            mimeType: this.getMimeType(resource.name, resource.initiatorType)
          },
          redirectURL: '',
          headersSize: -1,
          bodySize: resource.transferSize || 0
        },
        cache: {},
        timings: {
          blocked: -1,
          dns: resource.domainLookupEnd - resource.domainLookupStart,
          connect: resource.connectEnd - resource.connectStart,
          send: 0,
          wait: resource.responseStart - resource.requestStart,
          receive: resource.responseEnd - resource.responseStart,
          ssl: resource.secureConnectionStart > 0 ? resource.connectEnd - resource.secureConnectionStart : -1
        },
        serverIPAddress: '',
        connection: '',
        _initiatorType: resource.initiatorType,
        _priority: 'High'
      };
      
      entries.push(entry);
    });
    
    // Create HAR structure
    const har = {
      log: {
        version: '1.2',
        creator: {
          name: 'Performance Metrics Toolbar',
          version: '1.0.0'
        },
        browser: {
          name: navigator.userAgent.split('/')[0],
          version: navigator.userAgent
        },
        pages: [{
          startedDateTime: new Date(timing.navigationStart).toISOString(),
          id: 'page_1',
          title: document.title,
          pageTimings: {
            onContentLoad: timing.domContentLoadedEventEnd - timing.navigationStart,
            onLoad: timing.loadEventEnd - timing.navigationStart
          },
          _meta: {
            url: window.location.href,
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            tcp: timing.connectEnd - timing.connectStart,
            ssl: timing.secureConnectionStart > 0 ? timing.connectEnd - timing.secureConnectionStart : 0,
            ttfb: timing.responseStart - timing.requestStart,
            transfer: timing.responseEnd - timing.responseStart,
            domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
            loadTime: timing.loadEventEnd - timing.navigationStart,
            totalXHRCalls: xhrCalls.length,
            totalSize: entries.reduce((sum, e) => sum + (e.response.content.size || 0), 0)
          }
        }],
        entries: entries
      }
    };
    
    return har;
  }

  parseQueryString(url) {
    try {
      const urlObj = new URL(url);
      const params = [];
      urlObj.searchParams.forEach((value, name) => {
        params.push({ name, value });
      });
      return params;
    } catch {
      return [];
    }
  }

  getMimeType(url, initiatorType) {
    const extension = url.split('.').pop().split('?')[0].toLowerCase();
    const mimeTypes = {
      'js': 'application/javascript',
      'css': 'text/css',
      'html': 'text/html',
      'json': 'application/json',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'woff': 'font/woff',
      'woff2': 'font/woff2',
      'ttf': 'font/ttf',
      'xml': 'application/xml'
    };
    
    return mimeTypes[extension] || 'application/octet-stream';
  }
}

// Initialize the toolbar
new PerformanceToolbar();
