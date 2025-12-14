// Configuration Module - Centralized configuration management
// Design Pattern: Configuration Object Pattern

const PerformanceConfig = {
  // UI Configuration
  ui: {
    colors: {
      background: '#000000',
      primary: '#00ff00',
      secondary: '#ffff00',
      tertiary: '#00ffff',
      warning: '#ffaa00',
      danger: '#ff4444',
      text: '#888888'
    },
    
    breakpoints: {
      mobile: 600,
      tablet: 1024,
      desktop: 1920
    },
    
    animations: {
      duration: 200, // ms
      easing: 'ease'
    },
    
    zIndex: {
      toolbar: 2147483647,
      modal: 2147483646,
      backdrop: 2147483645
    }
  },
  
  // Performance Thresholds
  thresholds: {
    fast: 500,      // < 500ms = fast (green)
    medium: 1000,   // 500-1000ms = medium (orange)
    slow: 1000      // > 1000ms = slow (red)
  },
  
  // Monitoring Configuration
  monitoring: {
    fpsUpdateInterval: 1000,        // Update FPS every 1 second
    urlPollInterval: 1000,          // Check URL changes every 1 second
    metricUpdateDelay: 100,         // Delay after load event
    slowCallsLimit: 5               // Show top 5 slowest calls
  },
  
  // Keyboard Shortcuts
  shortcuts: {
    toggleMinimize: 'Ctrl+Shift+P',
    refresh: 'Ctrl+Shift+R',
    export: 'Ctrl+Shift+E',
    help: 'Ctrl+Shift+?'
  },
  
  // Tab Configuration
  tabs: [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'timing', label: '⏱️ Timing', icon: '⏱️' },
    { id: 'network', label: '🌐 Network', icon: '🌐' },
    { id: 'memory', label: '💾 Memory/FPS', icon: '💾' }
  ],
  
  // Metric Definitions
  metrics: {
    overview: ['loadTime', 'apiCalls', 'resources', 'fps', 'slowestCall'],
    timing: ['domReady', 'ttfb', 'transfer'],
    network: ['dns', 'tcp', 'ssl', 'transferred'],
    memory: ['memory', 'fps']
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceConfig;
}
