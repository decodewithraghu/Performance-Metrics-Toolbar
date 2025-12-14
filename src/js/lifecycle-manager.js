// Lifecycle Manager Module
// Design Pattern: Lifecycle Hooks Pattern
// Purpose: Graceful initialization, shutdown, and cleanup

const LifecycleManager = (function() {
  // Private state
  let isInitialized = false;
  let isShuttingDown = false;
  let cleanupHandlers = [];
  let eventListeners = [];
  let intervals = [];
  let observers = [];
  
  /**
   * Register a cleanup handler
   */
  function registerCleanup(handler, description = '') {
    cleanupHandlers.push({ handler, description });
  }

  /**
   * Register an event listener for cleanup
   */
  function addEventListener(target, event, handler, options) {
    target.addEventListener(event, handler, options);
    eventListeners.push({ target, event, handler, options });
  }

  /**
   * Register an interval for cleanup
   */
  function registerInterval(intervalId, description = '') {
    intervals.push({ id: intervalId, description });
  }

  /**
   * Register a MutationObserver for cleanup
   */
  function registerObserver(observer, description = '') {
    observers.push({ observer, description });
  }

  /**
   * Initialize lifecycle management
   */
  function init() {
    if (isInitialized) {
      console.warn('⚠️ Lifecycle Manager already initialized');
      return;
    }

    // Listen for page unload/navigation
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);
    
    // Listen for page visibility changes (tab switching)
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Listen for browser extension unload (if available)
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.onSuspend?.addListener(handleSuspend);
    }

    isInitialized = true;
    console.log('✅ Lifecycle Manager initialized');
  }

  /**
   * Handle before unload event
   */
  function handleBeforeUnload(event) {
    console.log('⏳ Page unloading - preparing cleanup...');
    
    // Don't prevent unload, just prepare
    // (Browsers limit what you can do here)
  }

  /**
   * Handle unload event
   */
  function handleUnload(event) {
    console.log('🔄 Page unloading - executing cleanup...');
    cleanup();
  }

  /**
   * Handle visibility change (tab switching, minimizing)
   */
  function handleVisibilityChange() {
    if (document.hidden) {
      console.log('👁️ Page hidden - pausing non-critical operations...');
      // Optionally pause FPS monitoring or other heavy operations
    } else {
      console.log('👁️ Page visible - resuming operations...');
    }
  }

  /**
   * Handle extension suspend (Chrome)
   */
  function handleSuspend() {
    console.log('🛑 Extension suspending - executing cleanup...');
    cleanup();
  }

  /**
   * Perform graceful shutdown and cleanup
   */
  function shutdown() {
    if (isShuttingDown) {
      console.warn('⚠️ Shutdown already in progress');
      return;
    }

    isShuttingDown = true;
    console.log('🛑 Initiating graceful shutdown...');

    cleanup();

    console.log('✅ Graceful shutdown complete');
  }

  /**
   * Execute all cleanup tasks
   */
  function cleanup() {
    let cleanedCount = 0;

    // 1. Run custom cleanup handlers
    console.log(`🧹 Running ${cleanupHandlers.length} cleanup handlers...`);
    cleanupHandlers.forEach(({ handler, description }) => {
      try {
        handler();
        cleanedCount++;
        if (description) {
          console.log(`  ✓ ${description}`);
        }
      } catch (error) {
        console.error(`  ✗ Cleanup handler failed: ${description}`, error);
      }
    });

    // 2. Remove event listeners
    console.log(`🧹 Removing ${eventListeners.length} event listeners...`);
    eventListeners.forEach(({ target, event, handler, options }) => {
      try {
        target.removeEventListener(event, handler, options);
        cleanedCount++;
      } catch (error) {
        console.error(`  ✗ Failed to remove event listener: ${event}`, error);
      }
    });

    // 3. Clear intervals
    console.log(`🧹 Clearing ${intervals.length} intervals...`);
    intervals.forEach(({ id, description }) => {
      try {
        clearInterval(id);
        cleanedCount++;
        if (description) {
          console.log(`  ✓ Cleared: ${description}`);
        }
      } catch (error) {
        console.error(`  ✗ Failed to clear interval: ${description}`, error);
      }
    });

    // 4. Disconnect observers
    console.log(`🧹 Disconnecting ${observers.length} observers...`);
    observers.forEach(({ observer, description }) => {
      try {
        observer.disconnect();
        cleanedCount++;
        if (description) {
          console.log(`  ✓ Disconnected: ${description}`);
        }
      } catch (error) {
        console.error(`  ✗ Failed to disconnect observer: ${description}`, error);
      }
    });

    // 5. Clear performance marks/measures (optional)
    try {
      if (performance.clearMarks) {
        performance.clearMarks();
      }
      if (performance.clearMeasures) {
        performance.clearMeasures();
      }
      cleanedCount++;
    } catch (error) {
      console.error('  ✗ Failed to clear performance marks', error);
    }

    console.log(`✅ Cleanup complete: ${cleanedCount} items cleaned`);

    // Reset state
    cleanupHandlers = [];
    eventListeners = [];
    intervals = [];
    observers = [];
  }

  /**
   * Force immediate cleanup (emergency)
   */
  function forceCleanup() {
    console.warn('⚠️ Force cleanup initiated');
    isShuttingDown = true;
    cleanup();
  }

  /**
   * Get lifecycle status
   */
  function getStatus() {
    return {
      initialized: isInitialized,
      shuttingDown: isShuttingDown,
      cleanupHandlers: cleanupHandlers.length,
      eventListeners: eventListeners.length,
      intervals: intervals.length,
      observers: observers.length
    };
  }

  /**
   * Reset lifecycle manager (for testing)
   */
  function reset() {
    cleanup();
    isInitialized = false;
    isShuttingDown = false;
    console.log('🔄 Lifecycle Manager reset');
  }

  // Public API
  return {
    init,
    shutdown,
    cleanup,
    forceCleanup,
    reset,
    registerCleanup,
    addEventListener,
    registerInterval,
    registerObserver,
    getStatus,
    isInitialized: () => isInitialized,
    isShuttingDown: () => isShuttingDown
  };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LifecycleManager;
}
