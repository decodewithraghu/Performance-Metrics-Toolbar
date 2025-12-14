# Source Code Structure

## Overview

This directory contains the source code for the Performance Metrics Toolbar extension, organized following software design patterns and best practices.

## Architecture

The codebase follows these design patterns:

### 1. **Module Pattern**
Each file exports a self-contained module with clear responsibilities:
- `config.js` - Configuration management
- `utils.js` - Utility functions
- `metrics-calculator.js` - Performance metric calculations
- `content.js` - Main application logic (orchestrator)

### 2. **Single Responsibility Principle**
Each module has one clear purpose:
- **Config**: Manages all configuration values
- **Utils**: Provides reusable utility functions
- **Metrics Calculator**: Handles all performance calculations
- **Content Script**: Orchestrates UI and user interactions

### 3. **Separation of Concerns**
- **Logic** (`js/`) - All JavaScript code
- **Presentation** (`css/`) - All styling

## File Structure

```
src/
├── js/
│   ├── config.js              # Configuration object pattern
│   ├── utils.js               # Pure utility functions
│   ├── metrics-calculator.js  # Strategy pattern for metrics
│   ├── lifecycle-manager.js   # Lifecycle hooks pattern - NEW!
│   ├── error-reporter.js      # Observer pattern - error reporting - NEW!
│   ├── compatibility-checker.js # Adapter pattern - SPA/PWA checks - NEW!
│   └── content.js             # Main orchestrator (Singleton)
└── css/
    └── toolbar.css            # All styles
```

## Modules

### config.js
**Pattern**: Configuration Object Pattern  
**Purpose**: Centralized configuration management

Contains:
- UI configuration (colors, breakpoints, animations)
- Performance thresholds
- Monitoring settings
- Keyboard shortcuts
- Tab definitions
- Metric configurations

**Usage:**
```javascript
const color = PerformanceConfig.ui.colors.primary;
const threshold = PerformanceConfig.thresholds.fast;
```

### utils.js
**Pattern**: Module Pattern with Pure Functions  
**Purpose**: Reusable utility functions

Provides:
- `formatMs()` - Format milliseconds
- `formatBytes()` - Format bytes to KB/MB/GB
- `getPerformanceStatus()` - Get status based on duration
- `sanitizeHTML()` - Prevent XSS
- `truncateUrl()` - Shorten URLs
- `getDomain()` - Extract domain from URL
- `debounce()` - Debounce function execution
- `throttle()` - Throttle function execution
- And more...

**Usage:**
```javascript
const formatted = PerformanceUtils.formatMs(1234);
const status = PerformanceUtils.getPerformanceStatus(duration);
```

### metrics-calculator.js
**Pattern**: Strategy Pattern + Module Pattern  
**Purpose**: Calculate all performance metrics

Provides:
- `calculateAll()` - Calculate all metrics at once
- Individual metric calculators (DNS, TCP, SSL, TTFB, etc.)
- `getSlowestAPICalls()` - Get slowest API calls
- `calculateFPS()` - Real-time FPS monitoring

**Usage:**
```javascript
const metrics = MetricsCalculator.calculateAll();
const slowest = MetricsCalculator.getSlowestAPICalls(5);
```

### content.js
**Pattern**: Singleton Pattern + Facade Pattern  
**Purpose**: Main application orchestrator

Responsibilities:
- Create and manage toolbar UI
- Handle user interactions
- Coordinate between modules
- Manage state
- Handle SPA navigation
- Keyboard shortcuts

**Usage:**
```javascript
// Automatically instantiated when loaded
```

## Design Patterns Applied

### 1. Configuration Object Pattern
- **File**: `config.js`
- **Benefit**: Single source of truth for all configuration
- **Example**: All colors, thresholds, and settings in one place

### 2. Module Pattern
- **Files**: All modules
- **Benefit**: Encapsulation and namespace management
- **Example**: Each module exposes only necessary functions

### 3. Strategy Pattern
- **File**: `metrics-calculator.js`
- **Benefit**: Different strategies for calculating different metrics
- **Example**: Each metric has its own calculation strategy

### 4. Singleton Pattern
- **File**: `content.js` (PerformanceToolbar class)
- **Benefit**: Only one toolbar instance per page
- **Example**: Single instance manages all functionality

### 5. Facade Pattern
- **File**: `content.js`
- **Benefit**: Simple interface to complex subsystems
- **Example**: PerformanceToolbar coordinates multiple modules

### 6. Pure Functions
- **File**: `utils.js`
- **Benefit**: Predictable, testable, no side effects
- **Example**: All utility functions are pure

## Code Organization Benefits

### 1. **Maintainability**
- Each module has a single responsibility
- Easy to find and fix issues
- Clear separation of concerns

### 2. **Reusability**
- Utility functions can be reused anywhere
- Metric calculations are independent
- Configuration is centralized

### 3. **Testability**
- Pure functions are easy to test
- Each module can be tested independently
- Mock data can be injected easily

### 4. **Scalability**
- Easy to add new metrics
- Simple to add new UI features
- Configuration-driven behavior

### 5. **Readability**
- Clear file structure
- Descriptive function names
- Well-documented code

## Extension Points

### Adding New Metrics
1. Add metric definition to `config.js`
2. Add calculation logic to `metrics-calculator.js`
3. Update UI in `content.js`
4. Add styling in `toolbar.css`

### Adding New Tabs
1. Add tab configuration to `config.js`
2. Create HTML structure in `content.js`
3. Add tab content styles in `toolbar.css`
4. Add metric display logic

### Customizing Thresholds
1. Update thresholds in `config.js`
2. Changes automatically apply everywhere

### Adding Utilities
1. Add pure function to `utils.js`
2. Use anywhere in the codebase

## Best Practices

### 1. **Keep Functions Pure**
```javascript
// Good: Pure function
function formatMs(ms) {
  return `${Math.round(ms)}ms`;
}

// Bad: Side effects
function formatMs(ms) {
  console.log(ms); // Side effect
  return `${Math.round(ms)}ms`;
}
```

### 2. **Use Configuration**
```javascript
// Good: Use config
const color = PerformanceConfig.ui.colors.primary;

// Bad: Hardcoded value
const color = '#00ff00';
```

### 3. **Separate Concerns**
```javascript
// Good: Logic separate from UI
const metrics = MetricsCalculator.calculateAll();
displayMetrics(metrics);

// Bad: Mixed concerns
function calculateAndDisplay() {
  const dns = performance.timing.domainLookupEnd - performance.timing.domainLookupStart;
  document.getElementById('dns').textContent = dns;
}
```

### 4. **Use Meaningful Names**
```javascript
// Good: Descriptive
function getSlowestAPICalls(limit) { }

// Bad: Unclear
function getSlowStuff(n) { }
```

## Future Enhancements

### Planned Improvements
1. **Event System**: Implement pub/sub pattern for better decoupling
2. **State Management**: Add centralized state management
3. **Plugin System**: Allow custom metrics via plugins
4. **Data Persistence**: Save settings to localStorage
5. **Testing**: Add unit tests for each module

### Module Extensions
- `storage.js` - localStorage management
- `event-bus.js` - Event pub/sub system
- `state-manager.js` - Centralized state
- `plugin-loader.js` - Dynamic plugin system

## Contributing

When adding code:
1. Follow existing patterns
2. Keep functions small and focused
3. Add JSDoc comments
4. Update this README
5. Ensure backward compatibility

## References

- [Module Pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript)
- [Singleton Pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#singletonpatternjavascript)
- [Strategy Pattern](https://refactoring.guru/design-patterns/strategy)
- [Clean Code Principles](https://github.com/ryanmcdermott/clean-code-javascript)
