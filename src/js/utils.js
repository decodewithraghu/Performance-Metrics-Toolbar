// Utility Functions Module
// Design Pattern: Module Pattern with Pure Functions

const PerformanceUtils = {
  /**
   * Format milliseconds to readable string
   * @param {number} ms - Milliseconds
   * @returns {string} Formatted string (e.g., "1234ms")
   */
  formatMs(ms) {
    if (ms === null || ms === undefined || isNaN(ms)) return '--';
    return `${Math.round(ms)}ms`;
  },

  /**
   * Format bytes to human-readable format
   * @param {number} bytes - Number of bytes
   * @returns {string} Formatted string (e.g., "2.4MB")
   */
  formatBytes(bytes) {
    if (bytes === null || bytes === undefined || isNaN(bytes)) return '--';
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + sizes[i];
  },

  /**
   * Get performance status based on duration
   * @param {number} duration - Duration in milliseconds
   * @returns {object} Status object with color, emoji, and class
   */
  getPerformanceStatus(duration) {
    if (duration < 500) {
      return { 
        status: 'fast', 
        emoji: '🟢', 
        color: '#00ff00', 
        className: 'perf-status-fast' 
      };
    } else if (duration < 1000) {
      return { 
        status: 'medium', 
        emoji: '🟠', 
        color: '#ffaa00', 
        className: 'perf-status-medium' 
      };
    } else {
      return { 
        status: 'slow', 
        emoji: '🔴', 
        color: '#ff4444', 
        className: 'perf-status-slow' 
      };
    }
  },

  /**
   * Sanitize HTML to prevent XSS
   * @param {string} text - Text to sanitize
   * @returns {string} Sanitized text
   */
  sanitizeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Truncate URL for display
   * @param {string} url - Full URL
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated URL
   */
  truncateUrl(url, maxLength = 50) {
    if (!url || url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  },

  /**
   * Get domain from URL
   * @param {string} url - Full URL
   * @returns {string} Domain name
   */
  getDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (e) {
      return url;
    }
  },

  /**
   * Debounce function execution
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function execution
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Calculate time difference
   * @param {number} start - Start timestamp
   * @param {number} end - End timestamp
   * @returns {number} Difference in milliseconds
   */
  getTimeDifference(start, end) {
    if (!start || !end || start > end) return 0;
    return Math.round(end - start);
  },

  /**
   * Check if element is visible
   * @param {HTMLElement} element - DOM element
   * @returns {boolean} True if visible
   */
  isElementVisible(element) {
    if (!element) return false;
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0';
  },

  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  generateId() {
    return `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceUtils;
}
