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
    // Initialize lifecycle manager
    if (typeof LifecycleManager !== 'undefined') {
      LifecycleManager.init();
      LifecycleManager.registerCleanup(() => this.cleanup(), 'Performance Toolbar Cleanup');
    }
    
    // Initialize error reporter
    if (typeof ErrorReporter !== 'undefined') {
      ErrorReporter.init();
    }
    
    // Check compatibility
    if (typeof CompatibilityChecker !== 'undefined') {
      const report = CompatibilityChecker.checkAll();
      CompatibilityChecker.logReport();
    }
    
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
    
    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();
  }

  cleanup() {
    console.log('🧹 Cleaning up Performance Toolbar...');
    
    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    
    // Remove toolbar from DOM
    if (this.toolbar && this.toolbar.parentNode) {
      this.toolbar.parentNode.removeChild(this.toolbar);
      this.toolbar = null;
    }
    
    console.log('✅ Performance Toolbar cleanup complete');
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+P: Toggle minimize
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        this.toggleMinimize();
      }
      // Ctrl+Shift+R: Refresh metrics
      else if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        console.log('🔄 Manual refresh triggered via keyboard');
        this.updateMetrics();
      }
      // Ctrl+Shift+E: Export HAR
      else if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        this.downloadHAR();
      }
      // Ctrl+Shift+?: Show help
      else if (e.ctrlKey && e.shiftKey && e.key === '?') {
        e.preventDefault();
        console.log('📖 Performance Metrics Toolbar - Keyboard Shortcuts:');
        console.log('  Ctrl+Shift+P: Toggle minimize');
        console.log('  Ctrl+Shift+R: Refresh metrics');
        console.log('  Ctrl+Shift+E: Export HAR file');
        console.log('  Ctrl+Shift+?: Show this help');
      }
    });
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
    // Create toolbar container (start minimized)
    this.toolbar = document.createElement('div');
    this.toolbar.id = 'perf-metrics-toolbar';
    this.toolbar.className = 'perf-toolbar perf-toolbar-minimized';
    
    // Create header with toggle button
    const header = document.createElement('div');
    header.className = 'perf-toolbar-header';
    header.innerHTML = `
      <span class="perf-toolbar-title">▸ Performance Metrics</span>
      <div style="display: flex; gap: 8px; align-items: center;">
        <button class="perf-toolbar-refresh" title="Refresh metrics (Ctrl+Shift+R)" aria-label="Refresh">↻</button>
        <button class="perf-toolbar-compat" title="Check Compatibility (SPA/PWA)" aria-label="Compatibility">🔍</button>
        <button class="perf-toolbar-report" title="Report Error to Author" aria-label="Report Error">🐛</button>
        <button class="perf-toolbar-download" title="Download HAR file (Ctrl+Shift+E)" aria-label="Download HAR">↓</button>
        <button class="perf-toolbar-minimize" title="Toggle toolbar (Ctrl+Shift+P)" aria-label="Toggle">📊</button>
      </div>
    `;
    
    // Create metrics tabs
    const metricsTabs = document.createElement('div');
    metricsTabs.className = 'perf-metrics-tabs';
    metricsTabs.innerHTML = `
      <button class="perf-tab-btn active" data-tab="overview">📊 Overview</button>
      <button class="perf-tab-btn" data-tab="timing">⏱️ Timing</button>
      <button class="perf-tab-btn" data-tab="network">🌐 Network</button>
      <button class="perf-tab-btn" data-tab="memory">💾 Memory/FPS</button>
    `;
    
    // Create metrics container with grouped content
    const metricsContainer = document.createElement('div');
    metricsContainer.className = 'perf-toolbar-metrics';
    metricsContainer.innerHTML = `
      <!-- Overview Tab -->
      <div class="perf-metrics-tab active" data-tab="overview">
        <div class="perf-metric-primary">
          <span class="perf-metric-label">Load Time:</span>
          <span class="perf-metric-value-large" id="perf-load-time">--</span>
        </div>
        <div class="perf-metrics-row">
          <div class="perf-metric">
            <span class="perf-metric-label">API Calls:</span>
            <span class="perf-metric-value" id="perf-api-calls">--</span>
          </div>
          <div class="perf-metric">
            <span class="perf-metric-label">Resources:</span>
            <span class="perf-metric-value" id="perf-resources">--</span>
          </div>
          <div class="perf-metric">
            <span class="perf-metric-label">FPS:</span>
            <span class="perf-metric-value" id="perf-fps">--</span>
          </div>
        </div>
        <div class="perf-metric-slowest" id="slowest-call-container">
          <span class="perf-metric-label">Slowest Call:</span>
          <span class="perf-metric-value" id="perf-slowest">--</span>
        </div>
      </div>
      
      <!-- Timing Tab -->
      <div class="perf-metrics-tab" data-tab="timing">
        <div class="perf-metrics-grid">
          <div class="perf-metric">
            <span class="perf-metric-label">DOM Ready:</span>
            <span class="perf-metric-value" id="perf-dom-ready">--</span>
          </div>
          <div class="perf-metric">
            <span class="perf-metric-label">TTFB:</span>
            <span class="perf-metric-value" id="perf-ttfb">--</span>
          </div>
          <div class="perf-metric">
            <span class="perf-metric-label">Transfer:</span>
            <span class="perf-metric-value" id="perf-transfer">--</span>
          </div>
        </div>
      </div>
      
      <!-- Network Tab -->
      <div class="perf-metrics-tab" data-tab="network">
        <div class="perf-metrics-grid">
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
            <span class="perf-metric-label">Transferred:</span>
            <span class="perf-metric-value" id="perf-size">--</span>
          </div>
        </div>
      </div>
      
      <!-- Memory/FPS Tab -->
      <div class="perf-metrics-tab" data-tab="memory">
        <div class="perf-metrics-grid">
          <div class="perf-metric">
            <span class="perf-metric-label">Memory:</span>
            <span class="perf-metric-value" id="perf-memory">--</span>
          </div>
          <div class="perf-metric">
            <span class="perf-metric-label">FPS:</span>
            <span class="perf-metric-value" id="perf-fps-tab">--</span>
          </div>
        </div>
      </div>
    `;
    
    this.toolbar.appendChild(header);
    this.toolbar.appendChild(metricsTabs);
    this.toolbar.appendChild(metricsContainer);
    document.body.appendChild(this.toolbar);
    
    // Set up event listeners
    const tabButtons = this.toolbar.querySelectorAll('.perf-tab-btn');
    this.setupEventListeners(header, tabButtons);
    
    // Initial metrics update
    this.updateMetrics();
    
    // Update FPS continuously
    this.startFPSMonitoring();
  }

  setupTabListeners(tabButtons) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabName = btn.getAttribute('data-tab');
        this.switchTab(tabName);
      });
    });
  }

  switchTab(tabName) {
    const tabButtons = this.toolbar.querySelectorAll('.perf-tab-btn');
    const tabContents = this.toolbar.querySelectorAll('.perf-metrics-tab');
    
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName));
    tabContents.forEach(tab => tab.classList.toggle('active', tab.getAttribute('data-tab') === tabName));
  }

  setupEventListeners(header, tabButtons) {
    // Drag functionality
    header.addEventListener('mousedown', (e) => this.dragStart(e));
    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('mouseup', () => this.dragEnd());
    
    // Tab switching
    if (tabButtons) {
      this.setupTabListeners(tabButtons);
    }
    
    // Minimize/maximize functionality
    const minimizeBtn = this.toolbar.querySelector('.perf-toolbar-minimize');
    minimizeBtn.addEventListener('click', () => this.toggleMinimize());
    
    // Refresh functionality
    const refreshBtn = this.toolbar.querySelector('.perf-toolbar-refresh');
    refreshBtn.addEventListener('click', () => {
      console.log('🔄 Manual refresh triggered');
      this.updateMetrics();
    });
    
    // Compatibility check functionality
    const compatBtn = this.toolbar.querySelector('.perf-toolbar-compat');
    if (compatBtn) {
      compatBtn.addEventListener('click', () => {
        if (typeof CompatibilityChecker !== 'undefined') {
          CompatibilityChecker.showModal();
        }
      });
    }
    
    // Error reporting functionality
    const reportBtn = this.toolbar.querySelector('.perf-toolbar-report');
    if (reportBtn) {
      reportBtn.addEventListener('click', () => {
        if (typeof ErrorReporter !== 'undefined') {
          ErrorReporter.showReportModal();
        }
      });
    }
    
    // Download HAR functionality
    const downloadBtn = this.toolbar.querySelector('.perf-toolbar-download');
    downloadBtn.addEventListener('click', () => this.downloadHAR());
    
    // Refresh metrics on double-click
    this.toolbar.addEventListener('dblclick', (e) => {
      if (!e.target.classList.contains('perf-toolbar-minimize') && 
          !e.target.classList.contains('perf-toolbar-download') &&
          !e.target.classList.contains('perf-toolbar-refresh') &&
          !e.target.classList.contains('perf-toolbar-compat') &&
          !e.target.classList.contains('perf-toolbar-report') &&
          !e.target.classList.contains('perf-tab-btn')) {
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
    const toolbar = this.toolbar;
    const minimizeBtn = toolbar.querySelector('.perf-toolbar-minimize');
    
    if (this.isMinimized) {
      toolbar.classList.add('perf-toolbar-minimized');
      minimizeBtn.textContent = '+';
      minimizeBtn.title = 'Maximize';
    } else {
      toolbar.classList.remove('perf-toolbar-minimized');
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
        const fpsElement = document.getElementById('perf-fps');
        const fpsTabElement = document.getElementById('perf-fps-tab');
        
        if (fpsElement) fpsElement.textContent = fps;
        if (fpsTabElement) fpsTabElement.textContent = fps;
        
        // Color code based on FPS
        let fpsColor = '#4ade80'; // Green
        if (fps < 30) {
          fpsColor = '#f87171'; // Red
        } else if (fps < 50) {
          fpsColor = '#fbbf24'; // Yellow
        }
        
        if (fpsElement) fpsElement.style.color = fpsColor;
        if (fpsTabElement) fpsTabElement.style.color = fpsColor;
        
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
    modal.className = 'perf-modal-backdrop';
    
    // Create modal dialog
    const dialog = document.createElement('div');
    dialog.className = 'perf-modal-dialog';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'perf-modal-header';
    header.innerHTML = `
      <h2 class="perf-modal-title">⚠️ Top 5 Slowest API Calls</h2>
      <button class="perf-modal-close" id="close-modal" title="Close [ESC]">✕</button>
    `;
    
    // Create content
    const content = document.createElement('div');
    content.className = 'perf-modal-content';
    
    let tableHtml = `
      <table class="perf-modal-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Endpoint</th>
            <th>Duration</th>
            <th>TTFB</th>
            <th>Download</th>
            <th>Size</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    this.slowCalls.forEach((call, index) => {
      const urlParts = call.name.split('/');
      const fileName = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
      const shortName = fileName.length > 35 ? fileName.substring(0, 32) + '...' : fileName;
      
      let statusClass = 'perf-table-status-good';
      if (call.duration > 1000) statusClass = 'perf-table-status-slow';
      else if (call.duration > 500) statusClass = 'perf-table-status-medium';
      
      tableHtml += `
        <tr class="perf-table-row ${statusClass}" data-call-index="${index}">
          <td class="perf-table-number">#${index + 1}</td>
          <td class="perf-table-endpoint" title="${call.name}">${shortName}</td>
          <td class="perf-table-duration"><span class="perf-badge">${call.duration.toFixed(0)}ms</span></td>
          <td class="perf-table-metric">${call.ttfb.toFixed(0)}ms</td>
          <td class="perf-table-metric">${call.download.toFixed(0)}ms</td>
          <td class="perf-table-metric">${(call.size / 1024).toFixed(1)}KB</td>
          <td class="perf-table-type">${call.type}</td>
        </tr>
      `;
    });
    
    tableHtml += `
        </tbody>
      </table>
    `;
    
    content.innerHTML = tableHtml;
    
    // Add click listeners for detailed view
    content.querySelectorAll('.perf-table-row').forEach(row => {
      row.addEventListener('click', (e) => {
        const index = parseInt(row.getAttribute('data-call-index'));
        this.showCallDetails(this.slowCalls[index], index + 1);
      });
    });
    
    // Create footer
    const footer = document.createElement('div');
    footer.className = 'perf-modal-footer';
    footer.innerHTML = `
      <p class="perf-modal-hint">Click a row for detailed analysis • Press ESC to close</p>
    `;
    
    dialog.appendChild(header);
    dialog.appendChild(content);
    dialog.appendChild(footer);
    modal.appendChild(dialog);
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

  showCallDetails(call, index) {
    const urlParts = call.name.split('/');
    const fileName = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
    const domain = new URL(call.name).hostname;
    
    // Close existing details modal if open
    const existingDetails = document.getElementById('perf-call-details-modal');
    if (existingDetails) {
      existingDetails.remove();
    }
    
    // Create details modal
    const detailsModal = document.createElement('div');
    detailsModal.id = 'perf-call-details-modal';
    detailsModal.className = 'perf-modal-backdrop';
    
    const dialog = document.createElement('div');
    dialog.className = 'perf-modal-dialog perf-modal-details-dialog';
    
    let statusIcon = '🟢';
    let statusText = 'Good';
    if (call.duration > 1000) {
      statusIcon = '🔴';
      statusText = 'Slow';
    } else if (call.duration > 500) {
      statusIcon = '🟠';
      statusText = 'Medium';
    }
    
    const header = document.createElement('div');
    header.className = 'perf-modal-header';
    header.innerHTML = `
      <h2 class="perf-modal-title">${statusIcon} Call #${index} Details</h2>
      <button class="perf-modal-close" id="close-details" title="Close [ESC]">✕</button>
    `;
    
    const content = document.createElement('div');
    content.className = 'perf-modal-content perf-details-content';
    content.innerHTML = `
      <div class="perf-details-header">
        <div class="perf-details-title">${fileName}</div>
        <div class="perf-details-domain">${domain}</div>
      </div>
      
      <div class="perf-details-url">
        <span class="perf-details-label">Full URL:</span>
        <span class="perf-details-value">${call.name}</span>
      </div>
      
      <div class="perf-details-status">
        <span class="perf-details-status-badge" style="color: ${statusIcon === '🔴' ? '#ff4444' : statusIcon === '🟠' ? '#ffaa00' : '#00ff00'};">
          ${statusIcon} ${statusText} (${call.duration.toFixed(2)}ms)
        </span>
      </div>
      
      <div class="perf-details-grid">
        <div class="perf-details-group">
          <div class="perf-details-group-title">Timing Breakdown</div>
          <div class="perf-details-item">
            <span class="perf-details-label">Total Duration:</span>
            <span class="perf-details-value perf-value-large">${call.duration.toFixed(2)}ms</span>
          </div>
          <div class="perf-details-item">
            <span class="perf-details-label">TTFB (Server):</span>
            <span class="perf-details-value">${call.ttfb.toFixed(2)}ms</span>
          </div>
          <div class="perf-details-item">
            <span class="perf-details-label">Download:</span>
            <span class="perf-details-value">${call.download.toFixed(2)}ms</span>
          </div>
        </div>
        
        <div class="perf-details-group">
          <div class="perf-details-group-title">Connection Metrics</div>
          <div class="perf-details-item">
            <span class="perf-details-label">DNS:</span>
            <span class="perf-details-value">${call.dns.toFixed(2)}ms</span>
          </div>
          <div class="perf-details-item">
            <span class="perf-details-label">TCP:</span>
            <span class="perf-details-value">${call.tcp.toFixed(2)}ms</span>
          </div>
          <div class="perf-details-item">
            <span class="perf-details-label">SSL/TLS:</span>
            <span class="perf-details-value">${call.ssl > 0 ? call.ssl.toFixed(2) + 'ms' : 'N/A'}</span>
          </div>
        </div>
        
        <div class="perf-details-group">
          <div class="perf-details-group-title">Data & Type</div>
          <div class="perf-details-item">
            <span class="perf-details-label">Transfer Size:</span>
            <span class="perf-details-value">${(call.size / 1024).toFixed(2)}KB</span>
          </div>
          <div class="perf-details-item">
            <span class="perf-details-label">Request Type:</span>
            <span class="perf-details-value">${call.type}</span>
          </div>
        </div>
      </div>
    `;
    
    dialog.appendChild(header);
    dialog.appendChild(content);
    detailsModal.appendChild(dialog);
    document.body.appendChild(detailsModal);
    
    const closeDetails = () => {
      if (document.getElementById('perf-call-details-modal')) {
        document.body.removeChild(detailsModal);
      }
    };
    
    document.getElementById('close-details').addEventListener('click', closeDetails);
    detailsModal.addEventListener('click', (e) => {
      if (e.target === detailsModal) closeDetails();
    });
    
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeDetails();
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
