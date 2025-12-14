// PWA & SPA Compatibility Module
// Design Pattern: Adapter Pattern + Feature Detection
// Purpose: Ensure compatibility with Progressive Web Apps and Single Page Applications

const CompatibilityChecker = (function() {
  // Private state
  let compatibilityReport = null;
  
  /**
   * Check all compatibility aspects
   */
  function checkAll() {
    const report = {
      timestamp: new Date().toISOString(),
      
      // SPA Framework Detection
      spa: {
        isDetected: detectSPAFramework(),
        framework: getFrameworkName(),
        routing: detectRoutingMethod(),
        compatible: true // Always compatible
      },
      
      // PWA Detection
      pwa: {
        isDetected: isPWA(),
        hasServiceWorker: hasServiceWorker(),
        hasManifest: hasManifest(),
        isInstalled: isInstalled(),
        compatible: true // Always compatible
      },
      
      // Browser Compatibility
      browser: {
        name: getBrowserName(),
        performanceAPI: checkPerformanceAPI(),
        observerAPI: checkObserverAPI(),
        historyAPI: checkHistoryAPI(),
        compatible: checkBrowserCompatibility()
      },
      
      // Feature Support
      features: {
        memory: typeof performance.memory !== 'undefined',
        resourceTiming: typeof performance.getEntriesByType === 'function',
        navigationTiming: typeof performance.timing !== 'undefined',
        mutationObserver: typeof MutationObserver !== 'undefined',
        requestAnimationFrame: typeof requestAnimationFrame !== 'undefined'
      },
      
      // Overall Status
      overall: {
        compatible: true,
        warnings: [],
        recommendations: []
      }
    };

    // Analyze and add warnings/recommendations
    analyzeCompatibility(report);
    
    compatibilityReport = report;
    return report;
  }

  /**
   * Detect if running in a SPA
   */
  function detectSPAFramework() {
    // Check for common SPA frameworks
    return !!(
      window.React ||
      window.Vue ||
      window.Angular ||
      window.ng ||
      window.Ember ||
      window.Backbone ||
      window.Svelte ||
      document.querySelector('[data-reactroot]') ||
      document.querySelector('[ng-version]') ||
      document.querySelector('[data-vue-app]')
    );
  }

  /**
   * Get framework name
   */
  function getFrameworkName() {
    if (window.React || document.querySelector('[data-reactroot]')) return 'React';
    if (window.Vue || document.querySelector('[data-vue-app]')) return 'Vue';
    if (window.Angular || window.ng || document.querySelector('[ng-version]')) return 'Angular';
    if (window.Ember) return 'Ember';
    if (window.Backbone) return 'Backbone';
    if (window.Svelte) return 'Svelte';
    return 'Unknown or Vanilla JS';
  }

  /**
   * Detect routing method
   */
  function detectRoutingMethod() {
    const hasHashRouting = window.location.hash.includes('#/');
    const hasHistoryAPI = typeof history.pushState === 'function';
    
    if (hasHashRouting) return 'Hash-based (#/)';
    if (hasHistoryAPI) return 'History API (pushState)';
    return 'Standard navigation';
  }

  /**
   * Check if running as PWA
   */
  function isPWA() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
  }

  /**
   * Check for Service Worker
   */
  function hasServiceWorker() {
    return (
      'serviceWorker' in navigator &&
      navigator.serviceWorker.controller !== null
    );
  }

  /**
   * Check for Web App Manifest
   */
  function hasManifest() {
    const manifestLink = document.querySelector('link[rel="manifest"]');
    return manifestLink !== null;
  }

  /**
   * Check if PWA is installed
   */
  function isInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches;
  }

  /**
   * Get browser name
   */
  function getBrowserName() {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
    return 'Unknown';
  }

  /**
   * Check Performance API support
   */
  function checkPerformanceAPI() {
    return {
      available: typeof performance !== 'undefined',
      timing: typeof performance.timing !== 'undefined',
      navigation: typeof performance.getEntriesByType === 'function',
      resource: typeof performance.getEntriesByType === 'function',
      memory: typeof performance.memory !== 'undefined'
    };
  }

  /**
   * Check Observer API support
   */
  function checkObserverAPI() {
    return {
      mutationObserver: typeof MutationObserver !== 'undefined',
      intersectionObserver: typeof IntersectionObserver !== 'undefined',
      resizeObserver: typeof ResizeObserver !== 'undefined',
      performanceObserver: typeof PerformanceObserver !== 'undefined'
    };
  }

  /**
   * Check History API support
   */
  function checkHistoryAPI() {
    return {
      available: typeof history !== 'undefined',
      pushState: typeof history.pushState === 'function',
      replaceState: typeof history.replaceState === 'function',
      popstate: 'onpopstate' in window
    };
  }

  /**
   * Check overall browser compatibility
   */
  function checkBrowserCompatibility() {
    const required = [
      typeof performance !== 'undefined',
      typeof MutationObserver !== 'undefined',
      typeof history.pushState === 'function',
      typeof requestAnimationFrame !== 'undefined'
    ];
    
    return required.every(check => check === true);
  }

  /**
   * Analyze compatibility and add warnings
   */
  function analyzeCompatibility(report) {
    // Check for missing features
    if (!report.features.memory) {
      report.overall.warnings.push('Memory API not available (Chrome/Edge only)');
    }

    if (!report.features.mutationObserver) {
      report.overall.warnings.push('MutationObserver not available - SPA detection limited');
      report.overall.compatible = false;
    }

    if (!report.features.resourceTiming) {
      report.overall.warnings.push('Resource Timing API not available');
      report.overall.compatible = false;
    }

    // PWA recommendations
    if (report.pwa.isDetected && report.pwa.hasServiceWorker) {
      report.overall.recommendations.push('PWA detected - metrics may be affected by Service Worker caching');
    }

    // SPA recommendations
    if (report.spa.isDetected) {
      report.overall.recommendations.push(`${report.spa.framework} detected - SPA monitoring active`);
    }

    // Browser-specific recommendations
    if (report.browser.name === 'Firefox') {
      report.overall.recommendations.push('Firefox detected - Memory API not available');
    }

    // Overall compatibility
    if (report.overall.warnings.length === 0 && report.overall.compatible) {
      report.overall.status = 'Fully Compatible ✅';
    } else if (report.overall.warnings.length > 0 && report.overall.compatible) {
      report.overall.status = 'Compatible with warnings ⚠️';
    } else {
      report.overall.status = 'Limited compatibility ❌';
    }
  }

  /**
   * Log compatibility report to console
   */
  function logReport() {
    const report = compatibilityReport || checkAll();
    
    console.group('🔍 Performance Metrics Toolbar - Compatibility Report');
    
    console.group('📱 SPA Detection');
    console.log('Detected:', report.spa.isDetected ? '✅' : '❌');
    console.log('Framework:', report.spa.framework);
    console.log('Routing:', report.spa.routing);
    console.groupEnd();
    
    console.group('📦 PWA Detection');
    console.log('Is PWA:', report.pwa.isDetected ? '✅' : '❌');
    console.log('Has Service Worker:', report.pwa.hasServiceWorker ? '✅' : '❌');
    console.log('Has Manifest:', report.pwa.hasManifest ? '✅' : '❌');
    console.log('Installed:', report.pwa.isInstalled ? '✅' : '❌');
    console.groupEnd();
    
    console.group('🌐 Browser');
    console.log('Name:', report.browser.name);
    console.log('Performance API:', report.browser.performanceAPI.available ? '✅' : '❌');
    console.log('Observer API:', report.browser.observerAPI.mutationObserver ? '✅' : '❌');
    console.log('History API:', report.browser.historyAPI.available ? '✅' : '❌');
    console.groupEnd();
    
    console.group('⚙️ Feature Support');
    Object.entries(report.features).forEach(([feature, supported]) => {
      console.log(`${feature}:`, supported ? '✅' : '❌');
    });
    console.groupEnd();
    
    console.group('📊 Overall Status');
    console.log('Status:', report.overall.status);
    if (report.overall.warnings.length > 0) {
      console.warn('Warnings:', report.overall.warnings);
    }
    if (report.overall.recommendations.length > 0) {
      console.info('Recommendations:', report.overall.recommendations);
    }
    console.groupEnd();
    
    console.groupEnd();
  }

  /**
   * Get current report
   */
  function getReport() {
    return compatibilityReport || checkAll();
  }

  /**
   * Show compatibility modal to user
   */
  function showModal() {
    const report = getReport();
    
    const modalHTML = `
      <div class="perf-compat-modal-backdrop" style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 2147483646;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div class="perf-compat-modal" style="
          background: #000;
          border: 2px solid #00ff00;
          border-radius: 8px;
          padding: 24px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          color: #fff;
          font-family: 'Consolas', monospace;
        ">
          <h2 style="color: #00ff00; margin: 0 0 16px 0;">🔍 Compatibility Report</h2>
          
          <div style="margin-bottom: 16px;">
            <h3 style="color: #ffff00; margin: 8px 0;">Status: ${report.overall.status}</h3>
          </div>
          
          <div style="background: #1a1a1a; padding: 12px; border: 1px solid #333; border-radius: 4px; margin-bottom: 12px;">
            <h4 style="color: #00ffff; margin: 0 0 8px 0;">📱 SPA Detection</h4>
            <p style="margin: 4px 0;">Framework: ${report.spa.framework}</p>
            <p style="margin: 4px 0;">Routing: ${report.spa.routing}</p>
            <p style="margin: 4px 0;">Compatible: ${report.spa.compatible ? '✅ Yes' : '❌ No'}</p>
          </div>
          
          <div style="background: #1a1a1a; padding: 12px; border: 1px solid #333; border-radius: 4px; margin-bottom: 12px;">
            <h4 style="color: #00ffff; margin: 0 0 8px 0;">📦 PWA Detection</h4>
            <p style="margin: 4px 0;">Is PWA: ${report.pwa.isDetected ? '✅ Yes' : '❌ No'}</p>
            <p style="margin: 4px 0;">Service Worker: ${report.pwa.hasServiceWorker ? '✅ Active' : '❌ None'}</p>
            <p style="margin: 4px 0;">Manifest: ${report.pwa.hasManifest ? '✅ Present' : '❌ Missing'}</p>
            <p style="margin: 4px 0;">Installed: ${report.pwa.isInstalled ? '✅ Yes' : '❌ No'}</p>
          </div>
          
          <div style="background: #1a1a1a; padding: 12px; border: 1px solid #333; border-radius: 4px; margin-bottom: 12px;">
            <h4 style="color: #00ffff; margin: 0 0 8px 0;">🌐 Browser: ${report.browser.name}</h4>
            <p style="margin: 4px 0;">Performance API: ${report.browser.performanceAPI.available ? '✅' : '❌'}</p>
            <p style="margin: 4px 0;">Observer API: ${report.browser.observerAPI.mutationObserver ? '✅' : '❌'}</p>
            <p style="margin: 4px 0;">History API: ${report.browser.historyAPI.available ? '✅' : '❌'}</p>
          </div>
          
          ${report.overall.warnings.length > 0 ? `
          <div style="background: #331100; padding: 12px; border: 1px solid #ff4444; border-radius: 4px; margin-bottom: 12px;">
            <h4 style="color: #ff4444; margin: 0 0 8px 0;">⚠️ Warnings</h4>
            ${report.overall.warnings.map(w => `<p style="margin: 4px 0;">• ${w}</p>`).join('')}
          </div>
          ` : ''}
          
          ${report.overall.recommendations.length > 0 ? `
          <div style="background: #001133; padding: 12px; border: 1px solid #00ffff; border-radius: 4px; margin-bottom: 16px;">
            <h4 style="color: #00ffff; margin: 0 0 8px 0;">💡 Recommendations</h4>
            ${report.overall.recommendations.map(r => `<p style="margin: 4px 0;">• ${r}</p>`).join('')}
          </div>
          ` : ''}
          
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button class="perf-compat-close-btn" style="
              background: #00ff00;
              color: #000;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-weight: bold;
            ">Close</button>
          </div>
        </div>
      </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

    // Close button
    modalContainer.querySelector('.perf-compat-close-btn').addEventListener('click', () => {
      document.body.removeChild(modalContainer);
    });

    // Close on backdrop click
    modalContainer.querySelector('.perf-compat-modal-backdrop').addEventListener('click', (e) => {
      if (e.target.classList.contains('perf-compat-modal-backdrop')) {
        document.body.removeChild(modalContainer);
      }
    });
  }

  // Public API
  return {
    checkAll,
    getReport,
    logReport,
    showModal,
    detectSPAFramework,
    isPWA,
    hasServiceWorker
  };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CompatibilityChecker;
}
