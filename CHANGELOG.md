# Changelog

All notable changes to the Performance Metrics Toolbar will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2025-12-14

### 🎉 Major UI/UX Redesign - Floating Button

#### Added
- **Non-intrusive floating button design** - Replaces full-width bottom toolbar
  - Collapsed state: 45×45px circular button (40px on mobile)
  - Positioned in bottom-right corner (20px from edges)
  - Smooth expand/collapse animations (0.3s)
  - Click to expand → see all metrics
  - Click again to collapse → back to button
  
- **Auto-prompt error notification system**
  - Automatically notifies users when errors occur
  - Non-intrusive slide-in notification (bottom-right)
  - Three user options: Report Error, Later (5 min), Dismiss
  - Smart 30-second cooldown prevents notification spam
  - User control: Enable/disable via API
  
- **Enhanced button visibility fix**
  - Toggle button (📊) now remains visible in both states
  - Button container always displays (flexbox)
  - All action buttons accessible when expanded
  
- **Comprehensive test suite**
  - 20 detailed manual test cases (docs/TEST_CASES.md)
  - Automated test page (test-automated.html)
  - Console-based validation script
  - Test execution templates and bug reporting
  
- **Project structure reorganization**
  - Moved source files to `src/js/` and `src/css/`
  - Moved all documentation to `docs/` folder
  - Created modular architecture with 6 core modules
  - Applied 8 design patterns (Module, Strategy, Singleton, etc.)
  
- **New modules**
  - `lifecycle-manager.js` - Graceful shutdown and cleanup
  - `error-reporter.js` - Error capture and reporting
  - `compatibility-checker.js` - SPA/PWA detection and verification
  - `config.js` - Centralized configuration
  - `utils.js` - Reusable utility functions
  - `metrics-calculator.js` - Performance calculations

- **New documentation**
  - `FLOATING_BUTTON_DESIGN.md` - Complete design specifications
  - `UI_UX_REDESIGN_SUMMARY.md` - Technical implementation details
  - `AUTO_PROMPT_TESTING.md` - Error notification testing guide
  - `AUTO_PROMPT_IMPLEMENTATION_SUMMARY.md` - Feature documentation
  - `TEST_CASES.md` - QA test suite
  - `PROJECT_STRUCTURE.md` - Architecture overview
  - `NEW_FEATURES.md` - Enterprise features documentation

- **Test pages**
  - `test-floating-button.html` - Visual demo and testing
  - `test-error-prompt.html` - Error reporting testing
  - `test-automated.html` - Automated test runner

#### Changed
- **Toolbar positioning** - From full-width bottom bar to floating button
- **Default state** - Now starts collapsed (minimized)
- **Button size** - Reduced from 60px to 45px (more subtle)
- **Responsive breakpoints** - 40px on mobile (<640px)
- **Toggle button icon** - Changed from "−" to "📊" (chart emoji)
- **Animation timing** - Improved to 0.3s cubic-bezier for smoother transitions

#### Fixed
- **Toggle button visibility** - 📊 icon now stays visible when expanded
- **Button container display** - Always shows flex layout
- **Minimize functionality** - Properly toggles between states
- **Mobile responsiveness** - Correctly adapts to smaller screens
- **Button sizing** - Consistent across all states and devices

#### Improved
- **Screen space usage** - 95% reduction when collapsed (45px vs full width)
- **User control** - Expand/collapse on demand instead of always visible
- **Visual hierarchy** - Less overwhelming, more focused
- **Accessibility** - Large click target (45px), keyboard shortcuts maintained
- **Performance** - GPU-accelerated animations, no layout reflow

### Technical Details

#### Files Modified
- `src/css/toolbar.css` - Floating button styles, responsive design
- `src/js/content.js` - Start minimized, button container fix
- `manifest.json` - Version bump to 3.0.0
- `README.md` - Updated description and features

#### Files Created
- `docs/` folder with 12 documentation files
- `src/js/` folder with 7 JavaScript modules
- `src/css/` folder with toolbar.css
- 3 test HTML pages

#### Breaking Changes
- Toolbar no longer spans full width by default
- Starts in collapsed state (user must click to expand)
- Visual appearance significantly different

#### Migration Guide
No action needed - existing users will see new floating button design on next extension reload.

---

## [2.0.0] - Previous Version

### Added
- Tabbed interface (Overview, Timing, Network, Memory/FPS)
- Modal redesign for API call details
- SPA (Single Page Application) support
- Responsive design improvements

### Changed
- Organized metrics into 4 tabs
- Improved modal with table layout
- Better mobile support

---

## [1.0.0] - Initial Release

### Added
- Performance metrics toolbar
- Real-time FPS monitoring
- API call tracking
- Network timing metrics
- Memory usage display
- HAR file export
- Keyboard shortcuts

---

## Version History Summary

- **v3.0.0** - Floating button UI/UX redesign + auto-prompt errors + test suite
- **v2.0.0** - Tabbed interface + SPA support
- **v1.0.0** - Initial release with basic metrics

[3.0.0]: https://github.com/decodewithraghu/Performance-Metrics-Toolbar/releases/tag/v3.0.0
