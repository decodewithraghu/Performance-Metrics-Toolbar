// Error Reporter Module
// Design Pattern: Observer Pattern + Singleton Pattern
// Purpose: Capture and report errors to help improve the extension

const ErrorReporter = (function() {
  // Private variables
  let isEnabled = false;
  let errorQueue = [];
  let maxQueueSize = 10;
  let autoPromptEnabled = true; // Auto-prompt user when error occurs
  let lastPromptTime = 0;
  let promptCooldown = 30000; // 30 seconds between prompts
  
  // Author contact configuration
  const config = {
    authorEmail: 'decodewithraghu@github.com',
    githubIssues: 'https://github.com/decodewithraghu/Performance-Metrics-Toolbar/issues/new',
    version: '2.0.0'
  };

  /**
   * Initialize error reporting
   */
  function init() {
    // Global error handler
    window.addEventListener('error', handleGlobalError);
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', handlePromiseRejection);
    
    // Console error override (optional)
    captureConsoleErrors();
    
    console.log('✅ Error Reporter initialized');
  }

  /**
   * Handle global JavaScript errors
   */
  function handleGlobalError(event) {
    const errorData = {
      type: 'error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack || 'No stack trace',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      version: config.version
    };
    
    queueError(errorData);
  }

  /**
   * Handle unhandled promise rejections
   */
  function handlePromiseRejection(event) {
    const errorData = {
      type: 'unhandledrejection',
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack || 'No stack trace',
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      version: config.version
    };
    
    queueError(errorData);
  }

  /**
   * Capture console.error calls
   */
  function captureConsoleErrors() {
    const originalConsoleError = console.error;
    
    console.error = function(...args) {
      // Call original console.error
      originalConsoleError.apply(console, args);
      
      // Only capture errors from our extension
      if (args[0] && String(args[0]).includes('Performance Metrics')) {
        const errorData = {
          type: 'console.error',
          message: args.map(arg => String(arg)).join(' '),
          timestamp: new Date().toISOString(),
          url: window.location.href,
          version: config.version
        };
        
        queueError(errorData);
      }
    };
  }

  /**
   * Queue error for reporting
   */
  function queueError(errorData) {
    errorQueue.push(errorData);
    
    // Limit queue size
    if (errorQueue.length > maxQueueSize) {
      errorQueue.shift();
    }
    
    // Log to console (for development)
    console.warn('🐛 Performance Metrics Toolbar - Error captured:', errorData);
    
    // Auto-prompt user to report error (with cooldown)
    if (autoPromptEnabled) {
      promptUserToReport(errorData);
    }
  }

  /**
   * Prompt user to report the error
   */
  function promptUserToReport(errorData) {
    const now = Date.now();
    
    // Check cooldown to prevent prompt spam
    if (now - lastPromptTime < promptCooldown) {
      console.log('⏳ Error prompt on cooldown, will not show yet');
      return;
    }
    
    lastPromptTime = now;
    
    // Show small notification asking user if they want to report
    showErrorNotification(errorData);
  }

  /**
   * Show non-intrusive error notification
   */
  function showErrorNotification(errorData) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'perf-error-notification';
    notification.innerHTML = `
      <div style="
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: #1a1a1a;
        border: 2px solid #ffaa00;
        border-radius: 8px;
        padding: 16px 20px;
        color: #fff;
        font-family: 'Consolas', monospace;
        font-size: 14px;
        z-index: 2147483645;
        box-shadow: 0 4px 12px rgba(255, 170, 0, 0.4);
        min-width: 320px;
        animation: slideInRight 0.3s ease;
      ">
        <div style="display: flex; align-items: start; gap: 12px;">
          <div style="font-size: 24px;">🐛</div>
          <div style="flex: 1;">
            <div style="color: #ffaa00; font-weight: bold; margin-bottom: 4px;">
              Performance Metrics Error
            </div>
            <div style="color: #aaa; font-size: 12px; margin-bottom: 8px;">
              ${errorData.message.substring(0, 60)}${errorData.message.length > 60 ? '...' : ''}
            </div>
            <div style="color: #888; font-size: 11px; margin-bottom: 12px;">
              Would you like to report this to the author?
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="perf-error-notify-report" style="
                background: #00ff00;
                color: #000;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                font-size: 12px;
              ">Report Error</button>
              <button class="perf-error-notify-later" style="
                background: #333;
                color: #fff;
                border: 1px solid #666;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
              ">Later</button>
              <button class="perf-error-notify-dismiss" style="
                background: transparent;
                color: #888;
                border: none;
                padding: 6px 12px;
                cursor: pointer;
                font-size: 12px;
              ">Dismiss</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add CSS animation
    if (!document.querySelector('#perf-error-notification-styles')) {
      const style = document.createElement('style');
      style.id = 'perf-error-notification-styles';
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Report button - show full modal
    notification.querySelector('.perf-error-notify-report').addEventListener('click', () => {
      removeNotification(notification);
      showReportModal();
    });

    // Later button - remind in 5 minutes
    notification.querySelector('.perf-error-notify-later').addEventListener('click', () => {
      removeNotification(notification);
      console.log('⏰ Error report reminder set for 5 minutes');
      setTimeout(() => {
        if (errorQueue.length > 0) {
          showErrorNotification(errorQueue[errorQueue.length - 1]);
        }
      }, 300000); // 5 minutes
    });

    // Dismiss button - close for this session
    notification.querySelector('.perf-error-notify-dismiss').addEventListener('click', () => {
      removeNotification(notification);
      autoPromptEnabled = false; // Disable auto-prompt for this session
      console.log('❌ Error auto-prompt disabled for this session');
    });

    // Auto-dismiss after 30 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        removeNotification(notification);
      }
    }, 30000);
  }

  /**
   * Remove notification with animation
   */
  function removeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  /**
   * Get all queued errors
   */
  function getErrors() {
    return [...errorQueue];
  }

  /**
   * Clear error queue
   */
  function clearErrors() {
    errorQueue = [];
  }

  /**
   * Show error report modal to user
   */
  function showReportModal() {
    if (errorQueue.length === 0) {
      alert('No errors to report. The extension is working correctly!');
      return;
    }

    const errorSummary = errorQueue.map((err, index) => {
      return `Error ${index + 1}:
  Type: ${err.type}
  Message: ${err.message}
  Time: ${err.timestamp}
  URL: ${err.url}
  
`;
    }).join('\n');

    const modalHTML = `
      <div class="perf-error-modal-backdrop" style="
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
        <div class="perf-error-modal" style="
          background: #000;
          border: 2px solid #ff4444;
          border-radius: 8px;
          padding: 24px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          color: #fff;
          font-family: 'Consolas', monospace;
        ">
          <h2 style="color: #ff4444; margin: 0 0 16px 0;">🐛 Error Report</h2>
          
          <p style="color: #ffff00; margin-bottom: 16px;">
            ${errorQueue.length} error(s) detected. Help improve the extension by reporting this!
          </p>
          
          <div style="
            background: #1a1a1a;
            padding: 12px;
            border: 1px solid #333;
            border-radius: 4px;
            max-height: 300px;
            overflow-y: auto;
            margin-bottom: 16px;
            font-size: 12px;
          ">
            <pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${errorSummary}</pre>
          </div>
          
          <div style="margin-bottom: 16px;">
            <p style="margin: 8px 0; color: #00ff00;">📧 Report via Email:</p>
            <button class="perf-error-email-btn" style="
              background: #00ff00;
              color: #000;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-weight: bold;
              margin-right: 8px;
            ">Copy & Email to Author</button>
            
            <p style="margin: 16px 0 8px 0; color: #00ff00;">🐙 Report via GitHub:</p>
            <button class="perf-error-github-btn" style="
              background: #00ff00;
              color: #000;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-weight: bold;
            ">Open GitHub Issue</button>
          </div>
          
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button class="perf-error-close-btn" style="
              background: #333;
              color: #fff;
              border: 1px solid #666;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
            ">Close</button>
          </div>
        </div>
      </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

    // Email button
    modalContainer.querySelector('.perf-error-email-btn').addEventListener('click', () => {
      const errorText = generateErrorReport();
      navigator.clipboard.writeText(errorText).then(() => {
        alert('Error report copied to clipboard!\n\nPlease email it to: ' + config.authorEmail);
      });
    });

    // GitHub button
    modalContainer.querySelector('.perf-error-github-btn').addEventListener('click', () => {
      const errorText = generateErrorReport();
      const issueTitle = encodeURIComponent('Bug Report: Error in Performance Metrics Toolbar');
      const issueBody = encodeURIComponent(errorText);
      const githubUrl = `${config.githubIssues}?title=${issueTitle}&body=${issueBody}`;
      window.open(githubUrl, '_blank');
    });

    // Close button
    modalContainer.querySelector('.perf-error-close-btn').addEventListener('click', () => {
      document.body.removeChild(modalContainer);
    });

    // Close on backdrop click
    modalContainer.querySelector('.perf-error-modal-backdrop').addEventListener('click', (e) => {
      if (e.target.classList.contains('perf-error-modal-backdrop')) {
        document.body.removeChild(modalContainer);
      }
    });
  }

  /**
   * Generate formatted error report
   */
  function generateErrorReport() {
    const report = `
# Performance Metrics Toolbar - Error Report

**Version**: ${config.version}
**Date**: ${new Date().toISOString()}
**Browser**: ${navigator.userAgent}

## Errors (${errorQueue.length})

${errorQueue.map((err, index) => `
### Error ${index + 1}
- **Type**: ${err.type}
- **Message**: ${err.message}
- **File**: ${err.filename || 'N/A'}
- **Line**: ${err.lineno || 'N/A'}
- **Column**: ${err.colno || 'N/A'}
- **Time**: ${err.timestamp}
- **Page URL**: ${err.url}

**Stack Trace**:
\`\`\`
${err.stack}
\`\`\`
`).join('\n')}

## System Information
- **User Agent**: ${navigator.userAgent}
- **Screen**: ${window.screen.width}x${window.screen.height}
- **Viewport**: ${window.innerWidth}x${window.innerHeight}
- **Language**: ${navigator.language}
- **Online**: ${navigator.onLine}

---
*Please describe what you were doing when the error occurred*
`;

    return report;
  }

  /**
   * Test error reporting (for development)
   */
  function testError() {
    try {
      throw new Error('Test error from Performance Metrics Toolbar');
    } catch (e) {
      console.error('Test error:', e);
    }
  }

  /**
   * Enable/disable auto-prompt notifications
   */
  function setAutoPrompt(enabled) {
    autoPromptEnabled = enabled;
    if (!enabled) {
      // Remove any existing notification
      const existingNotification = document.querySelector('.perf-error-notification');
      if (existingNotification) {
        removeNotification(existingNotification);
      }
    }
  }

  /**
   * Get auto-prompt status
   */
  function getAutoPromptStatus() {
    return {
      enabled: autoPromptEnabled,
      lastPromptTime,
      promptCooldown,
      nextPromptAvailable: lastPromptTime + promptCooldown
    };
  }

  // Public API
  return {
    init,
    getErrors,
    clearErrors,
    showReportModal,
    testError,
    isEnabled: () => isEnabled,
    enable: () => { isEnabled = true; },
    disable: () => { isEnabled = false; },
    setAutoPrompt,
    getAutoPromptStatus
  };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorReporter;
}
