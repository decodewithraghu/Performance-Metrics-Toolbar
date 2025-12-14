// Performance Metrics Calculator Module
// Design Pattern: Strategy Pattern + Module Pattern

const MetricsCalculator = {
  /**
   * Calculate all performance metrics
   * @returns {object} Object containing all metrics
   */
  calculateAll() {
    const timing = performance.timing;
    const navigation = performance.getEntriesByType('navigation')[0];
    
    return {
      // Network timing metrics
      dns: this.calculateDNS(timing),
      tcp: this.calculateTCP(timing),
      ssl: this.calculateSSL(timing),
      ttfb: this.calculateTTFB(timing),
      transfer: this.calculateTransfer(timing),
      
      // Page timing metrics
      domReady: this.calculateDOMReady(timing),
      loadTime: this.calculateLoadTime(timing),
      
      // Resource metrics
      resources: this.calculateResources(),
      apiCalls: this.calculateAPICalls(),
      transferred: this.calculateTransferred(),
      
      // Memory metrics (if available)
      memory: this.calculateMemory()
    };
  },

  /**
   * Calculate DNS lookup time
   */
  calculateDNS(timing) {
    return timing.domainLookupEnd - timing.domainLookupStart;
  },

  /**
   * Calculate TCP connection time
   */
  calculateTCP(timing) {
    return timing.connectEnd - timing.connectStart;
  },

  /**
   * Calculate SSL handshake time
   */
  calculateSSL(timing) {
    if (timing.secureConnectionStart > 0) {
      return timing.connectEnd - timing.secureConnectionStart;
    }
    return 0;
  },

  /**
   * Calculate Time to First Byte
   */
  calculateTTFB(timing) {
    return timing.responseStart - timing.requestStart;
  },

  /**
   * Calculate content transfer time
   */
  calculateTransfer(timing) {
    return timing.responseEnd - timing.responseStart;
  },

  /**
   * Calculate DOM Ready time
   */
  calculateDOMReady(timing) {
    return timing.domContentLoadedEventEnd - timing.navigationStart;
  },

  /**
   * Calculate total page load time
   */
  calculateLoadTime(timing) {
    return timing.loadEventEnd - timing.navigationStart;
  },

  /**
   * Calculate total resource count
   */
  calculateResources() {
    const entries = performance.getEntriesByType('resource');
    return entries.length;
  },

  /**
   * Calculate API/XHR call count
   */
  calculateAPICalls() {
    const entries = performance.getEntriesByType('resource');
    return entries.filter(entry => 
      entry.initiatorType === 'xmlhttprequest' || 
      entry.initiatorType === 'fetch'
    ).length;
  },

  /**
   * Calculate total data transferred
   */
  calculateTransferred() {
    const entries = performance.getEntriesByType('resource');
    return entries.reduce((total, entry) => {
      return total + (entry.transferSize || 0);
    }, 0);
  },

  /**
   * Calculate memory usage (Chrome/Edge only)
   */
  calculateMemory() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  },

  /**
   * Get slowest API calls
   * @param {number} limit - Number of calls to return
   * @returns {Array} Array of slowest calls
   */
  getSlowestAPICalls(limit = 5) {
    const entries = performance.getEntriesByType('resource');
    
    const apiCalls = entries
      .filter(entry => 
        entry.initiatorType === 'xmlhttprequest' || 
        entry.initiatorType === 'fetch'
      )
      .map(entry => ({
        name: entry.name,
        duration: entry.duration,
        ttfb: entry.responseStart - entry.requestStart,
        download: entry.responseEnd - entry.responseStart,
        size: entry.transferSize || 0,
        type: entry.initiatorType,
        dns: entry.domainLookupEnd - entry.domainLookupStart,
        tcp: entry.connectEnd - entry.connectStart,
        ssl: entry.secureConnectionStart > 0 
          ? entry.connectEnd - entry.secureConnectionStart 
          : 0,
        startTime: entry.startTime,
        domain: this._extractDomain(entry.name)
      }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, limit);
    
    return apiCalls;
  },

  /**
   * Calculate FPS (Frames Per Second)
   * @param {Function} callback - Callback to receive FPS value
   */
  calculateFPS(callback) {
    let lastTime = performance.now();
    let frames = 0;
    let fps = 0;

    const measureFPS = () => {
      const currentTime = performance.now();
      frames++;

      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
        callback(fps);
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  },

  /**
   * Extract domain from URL
   * @private
   */
  _extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return url;
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MetricsCalculator;
}
