# Performance Metrics Toolbar - Test Cases

## Test Environment Setup

### Prerequisites
- Browser: Chrome/Edge/Firefox/Safari (latest version)
- Extension: Performance Metrics Toolbar installed
- Test Pages: 
  - `test-floating-button.html`
  - Any live website (e.g., github.com, google.com)
  - SPA website (e.g., React/Vue app)

### Test Data
- Screen resolutions to test:
  - Desktop: 1920×1080, 1366×768
  - Tablet: 768×1024
  - Mobile: 375×667, 414×896

---

## Test Cases

### TC-001: Floating Button Initial State
**Priority:** Critical  
**Category:** UI/Display

**Test Steps:**
1. Install/reload the extension
2. Navigate to any webpage
3. Wait for page to load completely

**Expected Results:**
- ✅ Floating button appears in bottom-right corner
- ✅ Button size is 45×45 pixels (desktop)
- ✅ Button is circular (border-radius: 50%)
- ✅ Button displays 📊 icon (centered)
- ✅ Button has green border (#00ff00)
- ✅ Button has subtle glow effect
- ✅ Position: 20px from bottom, 20px from right edge

**Validation:**
```javascript
// In browser console
const toolbar = document.getElementById('perf-metrics-toolbar');
console.log('Has minimized class:', toolbar.classList.contains('perf-toolbar-minimized')); // Should be true
console.log('Width:', toolbar.offsetWidth, 'Height:', toolbar.offsetHeight); // Should be 45×45
console.log('Position:', window.getComputedStyle(toolbar).position); // Should be 'fixed'
```

**Status:** [ ] Pass [ ] Fail

---

### TC-002: Floating Button Hover Effect
**Priority:** Medium  
**Category:** UI/Interaction

**Test Steps:**
1. Ensure floating button is visible (collapsed state)
2. Hover mouse over the button
3. Move mouse away

**Expected Results:**
- ✅ On hover: Button scales up slightly (1.05x)
- ✅ On hover: Glow effect intensifies
- ✅ On hover: Cursor changes to pointer
- ✅ On mouse out: Returns to normal state
- ✅ Transition is smooth (no jank)

**Status:** [ ] Pass [ ] Fail

---

### TC-003: Expand Toolbar Functionality
**Priority:** Critical  
**Category:** Functionality

**Test Steps:**
1. Ensure toolbar is collapsed (only 📊 button visible)
2. Click on the 📊 button
3. Observe the expansion animation

**Expected Results:**
- ✅ Toolbar expands smoothly (0.3s animation)
- ✅ Final width: 550px (or calc(100vw - 40px) on mobile)
- ✅ Rounded corners (12px border-radius)
- ✅ Header becomes visible with title "▸ Performance Metrics"
- ✅ All action buttons visible: 🔄 🔍 🐛 ↓ 📊
- ✅ Tab navigation appears with 4 tabs
- ✅ Metrics content displays in active tab
- ✅ **📊 icon remains visible** (in button group)

**Validation:**
```javascript
const toolbar = document.getElementById('perf-metrics-toolbar');
console.log('Has minimized class:', toolbar.classList.contains('perf-toolbar-minimized')); // Should be false
console.log('Width:', toolbar.offsetWidth); // Should be 550 (or responsive)
const minimizeBtn = toolbar.querySelector('.perf-toolbar-minimize');
console.log('Minimize button visible:', minimizeBtn.offsetParent !== null); // Should be true
console.log('Button text:', minimizeBtn.textContent); // Should be 📊
```

**Status:** [ ] Pass [ ] Fail

---

### TC-004: Collapse Toolbar Functionality
**Priority:** Critical  
**Category:** Functionality

**Test Steps:**
1. Ensure toolbar is expanded
2. Click the 📊 button (in the button group)
3. Observe the collapse animation

**Expected Results:**
- ✅ Toolbar collapses smoothly (0.3s animation)
- ✅ Returns to 45×45px circular button
- ✅ Only 📊 icon visible
- ✅ All other buttons hidden
- ✅ Title hidden
- ✅ Tabs hidden
- ✅ Metrics hidden

**Status:** [ ] Pass [ ] Fail

---

### TC-005: Toggle Button Visibility (Expanded State)
**Priority:** Critical  
**Category:** Regression Test

**Test Steps:**
1. Collapse toolbar (only 📊 button)
2. Click to expand
3. Verify 📊 button is still present
4. Look in the header button group

**Expected Results:**
- ✅ 📊 button appears in button group (rightmost position)
- ✅ Button is clickable
- ✅ Icon is clearly visible
- ✅ Button has same styling as other action buttons
- ✅ Hover effect works

**Validation:**
```javascript
const toolbar = document.getElementById('perf-metrics-toolbar');
const minimizeBtn = toolbar.querySelector('.perf-toolbar-minimize');
console.log('Button exists:', !!minimizeBtn); // Should be true
console.log('Button visible:', minimizeBtn.offsetParent !== null); // Should be true
console.log('Button display:', window.getComputedStyle(minimizeBtn).display); // Should NOT be 'none'
console.log('Icon text:', minimizeBtn.textContent); // Should be 📊
```

**Status:** [ ] Pass [ ] Fail

---

### TC-006: Action Buttons Functionality
**Priority:** High  
**Category:** Functionality

**Test Steps:**
1. Expand toolbar
2. Test each action button:
   - Click 🔄 (Refresh)
   - Click 🔍 (Compatibility)
   - Click 🐛 (Error Report)
   - Click ↓ (Download HAR)
   - Click 📊 (Toggle)

**Expected Results:**
- ✅ **Refresh (🔄):** Metrics update, values recalculate
- ✅ **Compatibility (🔍):** Modal opens showing SPA/PWA compatibility info
- ✅ **Error Report (🐛):** Modal opens with error reporting interface
- ✅ **Download HAR (↓):** HAR file downloads or error message if no data
- ✅ **Toggle (📊):** Toolbar collapses

**Status:** [ ] Pass [ ] Fail

---

### TC-007: Tab Navigation
**Priority:** High  
**Category:** Functionality

**Test Steps:**
1. Expand toolbar
2. Verify 4 tabs are visible:
   - 📊 Overview (active by default)
   - ⏱️ Timing
   - 🌐 Network
   - 💾 Memory/FPS
3. Click each tab
4. Verify content changes

**Expected Results:**
- ✅ Default tab: Overview (yellow border bottom)
- ✅ Clicking tab: Tab becomes active (yellow)
- ✅ Content updates to show relevant metrics
- ✅ Only one tab active at a time
- ✅ Tab hover effect works (green color)

**Validation:**
```javascript
const tabs = document.querySelectorAll('.perf-tab-btn');
console.log('Number of tabs:', tabs.length); // Should be 4
const activeTab = document.querySelector('.perf-tab-btn.active');
console.log('Active tab:', activeTab.textContent); // Should show current tab
```

**Status:** [ ] Pass [ ] Fail

---

### TC-008: Metrics Display - Overview Tab
**Priority:** High  
**Category:** Data Display

**Test Steps:**
1. Expand toolbar
2. Ensure "Overview" tab is active
3. Check all metrics are displayed

**Expected Results:**
- ✅ Load Time: Shows time in seconds (e.g., "2.5s")
- ✅ API Calls: Shows number (e.g., "8")
- ✅ Resources: Shows count (e.g., "42")
- ✅ FPS: Shows frames per second (e.g., "60")
- ✅ Slowest Call: Shows API name and duration
- ✅ All values are numeric and formatted correctly
- ✅ No "NaN" or "undefined" values

**Validation:**
```javascript
console.log('Load Time:', document.getElementById('perf-load-time').textContent);
console.log('API Calls:', document.getElementById('perf-api-calls').textContent);
console.log('Resources:', document.getElementById('perf-resources').textContent);
console.log('FPS:', document.getElementById('perf-fps').textContent);
console.log('Slowest:', document.getElementById('perf-slowest').textContent);
```

**Status:** [ ] Pass [ ] Fail

---

### TC-009: Keyboard Shortcut - Toggle
**Priority:** High  
**Category:** Accessibility

**Test Steps:**
1. Ensure toolbar is visible (collapsed or expanded)
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. Observe toolbar state change

**Expected Results:**
- ✅ If collapsed: Expands
- ✅ If expanded: Collapses
- ✅ Animation is smooth
- ✅ Works from any tab or page element

**Status:** [ ] Pass [ ] Fail

---

### TC-010: Keyboard Shortcut - Refresh
**Priority:** Medium  
**Category:** Accessibility

**Test Steps:**
1. Expand toolbar
2. Note current metric values
3. Press `Ctrl+Shift+R`

**Expected Results:**
- ✅ Metrics refresh/recalculate
- ✅ Values may change based on new performance data
- ✅ No page reload occurs

**Status:** [ ] Pass [ ] Fail

---

### TC-011: Keyboard Shortcut - Export HAR
**Priority:** Medium  
**Category:** Accessibility

**Test Steps:**
1. Navigate to a page with network activity
2. Press `Ctrl+Shift+E`

**Expected Results:**
- ✅ HAR file download initiates
- ✅ File name format: `performance-metrics-[timestamp].har`
- ✅ File contains valid HAR format data

**Status:** [ ] Pass [ ] Fail

---

### TC-012: Responsive Design - Mobile
**Priority:** High  
**Category:** Responsive

**Test Steps:**
1. Open DevTools (F12)
2. Switch to mobile view (375×667)
3. Reload page
4. Test collapse/expand

**Expected Results:**
- ✅ Collapsed button: 40×40px (smaller than desktop)
- ✅ Position: 10px from bottom/right (less margin)
- ✅ Expanded panel: calc(100vw - 20px) width
- ✅ Tabs wrap or scroll horizontally if needed
- ✅ Metrics display in single column
- ✅ Font sizes are readable
- ✅ All functionality works

**Validation:**
```javascript
const toolbar = document.getElementById('perf-metrics-toolbar');
console.log('Mobile width:', toolbar.offsetWidth); // Should fit screen
console.log('Window width:', window.innerWidth);
```

**Status:** [ ] Pass [ ] Fail

---

### TC-013: Z-Index Positioning
**Priority:** High  
**Category:** UI/Display

**Test Steps:**
1. Navigate to a page with fixed/sticky elements
2. Expand toolbar
3. Interact with page elements

**Expected Results:**
- ✅ Toolbar appears above all page content
- ✅ Z-index: 2147483647 (maximum)
- ✅ Doesn't get covered by page modals or overlays
- ✅ Doesn't interfere with page functionality

**Validation:**
```javascript
const toolbar = document.getElementById('perf-metrics-toolbar');
console.log('Z-index:', window.getComputedStyle(toolbar).zIndex); // Should be 2147483647
```

**Status:** [ ] Pass [ ] Fail

---

### TC-014: SPA Navigation Detection
**Priority:** High  
**Category:** Functionality

**Test Steps:**
1. Navigate to a SPA (Single Page App) like GitHub
2. Expand toolbar and note metric values
3. Click a link that triggers SPA navigation (no page reload)
4. Observe toolbar behavior

**Expected Results:**
- ✅ Toolbar detects route change
- ✅ Navigation count increments in title
- ✅ Metrics update automatically after ~1 second
- ✅ API calls reset and recalculate
- ✅ No errors in console

**Status:** [ ] Pass [ ] Fail

---

### TC-015: Error Capture and Reporting
**Priority:** High  
**Category:** Functionality

**Test Steps:**
1. Navigate to `test-error-prompt.html`
2. Click "Trigger Test Error" button
3. Wait for error notification
4. Expand toolbar
5. Click 🐛 button

**Expected Results:**
- ✅ Auto-prompt notification appears (bottom-right)
- ✅ Error captured in error queue
- ✅ Error modal shows captured errors
- ✅ Can copy error report
- ✅ Can open GitHub issue

**Status:** [ ] Pass [ ] Fail

---

### TC-016: Multiple Toolbar Instances
**Priority:** Medium  
**Category:** Edge Case

**Test Steps:**
1. Open website in Tab 1
2. Open same or different website in Tab 2
3. Switch between tabs
4. Interact with toolbar in each tab

**Expected Results:**
- ✅ Each tab has its own toolbar instance
- ✅ Expand/collapse state is independent per tab
- ✅ Metrics are specific to each page
- ✅ No conflicts or errors

**Status:** [ ] Pass [ ] Fail

---

### TC-017: Performance Impact
**Priority:** High  
**Category:** Performance

**Test Steps:**
1. Open DevTools Performance tab
2. Start recording
3. Expand/collapse toolbar 10 times
4. Stop recording
5. Analyze results

**Expected Results:**
- ✅ Animation takes < 300ms per cycle
- ✅ No frame drops (60fps maintained)
- ✅ No memory leaks (heap size stable)
- ✅ CPU usage < 5% during animation
- ✅ No "Long Tasks" warnings

**Status:** [ ] Pass [ ] Fail

---

### TC-018: Button Size Validation
**Priority:** Critical  
**Category:** UI/Display

**Test Steps:**
1. Load page with toolbar
2. Measure button dimensions
3. Compare desktop vs mobile

**Expected Results:**

**Desktop (> 640px):**
- ✅ Collapsed: 45×45px
- ✅ Icon font-size: 22px
- ✅ Border-radius: 50% (perfect circle)

**Mobile (≤ 640px):**
- ✅ Collapsed: 40×40px
- ✅ Icon font-size: 20px
- ✅ Border-radius: 50% (perfect circle)

**Validation:**
```javascript
const toolbar = document.getElementById('perf-metrics-toolbar');
const btn = toolbar.querySelector('.perf-toolbar-minimize');
console.log('Button width:', btn.offsetWidth);
console.log('Button height:', btn.offsetHeight);
console.log('Font size:', window.getComputedStyle(btn).fontSize);
```

**Status:** [ ] Pass [ ] Fail

---

### TC-019: Cross-Browser Compatibility
**Priority:** High  
**Category:** Compatibility

**Test Steps:**
1. Install extension in Chrome
2. Repeat TC-001 through TC-010
3. Install in Firefox
4. Repeat TC-001 through TC-010
5. Install in Edge
6. Repeat TC-001 through TC-010
7. Install in Safari (if available)
8. Repeat TC-001 through TC-010

**Expected Results:**
- ✅ All browsers show same visual appearance
- ✅ All functionality works consistently
- ✅ Animations are smooth in all browsers
- ✅ No console errors specific to any browser

**Browser Test Results:**
- [ ] Chrome: Pass / Fail
- [ ] Firefox: Pass / Fail  
- [ ] Edge: Pass / Fail
- [ ] Safari: Pass / Fail

**Status:** [ ] Pass [ ] Fail

---

### TC-020: Button Container Visibility Fix
**Priority:** Critical  
**Category:** Regression Test

**Test Steps:**
1. Ensure toolbar is collapsed
2. Inspect button HTML structure
3. Expand toolbar
4. Verify button container remains visible

**Expected Results:**
- ✅ Button container `<div>` has `display: flex` always
- ✅ When collapsed: Only 📊 button visible
- ✅ When expanded: All buttons (🔄🔍🐛↓📊) visible
- ✅ 📊 button is rightmost in group
- ✅ No CSS `display: none` on container

**Validation:**
```javascript
const toolbar = document.getElementById('perf-metrics-toolbar');
const btnContainer = toolbar.querySelector('.perf-toolbar-header > div');
console.log('Container display:', window.getComputedStyle(btnContainer).display); // Should be 'flex'
console.log('Container visibility:', btnContainer.offsetParent !== null); // Should be true

const minimizeBtn = btnContainer.querySelector('.perf-toolbar-minimize');
console.log('Minimize btn in container:', btnContainer.contains(minimizeBtn)); // Should be true
console.log('Minimize btn visible:', minimizeBtn.offsetParent !== null); // Should be true
```

**Status:** [ ] Pass [ ] Fail

---

## Test Execution Summary

### Test Run Information
- **Date:** _______________
- **Tester:** _______________
- **Browser:** _______________
- **OS:** _______________
- **Extension Version:** _______________

### Results Summary
- **Total Test Cases:** 20
- **Passed:** _____
- **Failed:** _____
- **Blocked:** _____
- **Not Executed:** _____

### Critical Issues Found
| TC# | Issue Description | Severity | Status |
|-----|------------------|----------|--------|
|     |                  |          |        |

### Notes/Comments
```
Add any additional observations here
```

---

## Automated Test Script

For automated testing, use this console script:

```javascript
// Run in browser console
(function testToolbar() {
  const results = [];
  
  function test(name, condition) {
    const pass = condition();
    results.push({ name, pass });
    console.log(`${pass ? '✅' : '❌'} ${name}`);
  }
  
  const toolbar = document.getElementById('perf-metrics-toolbar');
  
  // TC-001: Initial state
  test('Toolbar exists', () => !!toolbar);
  test('Starts minimized', () => toolbar.classList.contains('perf-toolbar-minimized'));
  test('Button size 45x45', () => {
    const width = toolbar.offsetWidth;
    const height = toolbar.offsetHeight;
    return width === 45 && height === 45;
  });
  
  // TC-003: Expand
  const minimizeBtn = toolbar.querySelector('.perf-toolbar-minimize');
  test('Minimize button exists', () => !!minimizeBtn);
  test('Button has icon', () => minimizeBtn.textContent.includes('📊'));
  
  // Click to expand
  minimizeBtn.click();
  
  setTimeout(() => {
    test('Expands on click', () => !toolbar.classList.contains('perf-toolbar-minimized'));
    test('Width expands', () => toolbar.offsetWidth > 400);
    test('Button still visible', () => minimizeBtn.offsetParent !== null);
    test('Button container visible', () => {
      const container = toolbar.querySelector('.perf-toolbar-header > div');
      return container && window.getComputedStyle(container).display === 'flex';
    });
    
    // TC-007: Tabs
    const tabs = toolbar.querySelectorAll('.perf-tab-btn');
    test('Has 4 tabs', () => tabs.length === 4);
    test('Has active tab', () => !!toolbar.querySelector('.perf-tab-btn.active'));
    
    // TC-008: Metrics
    test('Load time shown', () => {
      const el = document.getElementById('perf-load-time');
      return el && el.textContent !== '--';
    });
    test('FPS shown', () => {
      const el = document.getElementById('perf-fps');
      return el && el.textContent !== '--';
    });
    
    // Summary
    console.log('\n=== TEST SUMMARY ===');
    const passed = results.filter(r => r.pass).length;
    const total = results.length;
    console.log(`Passed: ${passed}/${total}`);
    console.log(`Failed: ${total - passed}/${total}`);
    
    if (passed === total) {
      console.log('🎉 ALL TESTS PASSED!');
    } else {
      console.log('❌ Some tests failed. Review above.');
    }
  }, 500);
})();
```

---

## Regression Test Checklist

After any code changes, verify these critical paths:

- [ ] Floating button appears on page load
- [ ] Button expands on click
- [ ] 📊 icon remains visible when expanded
- [ ] Button collapses on second click
- [ ] All 5 action buttons work
- [ ] Tab switching works
- [ ] Metrics display correctly
- [ ] Keyboard shortcuts work
- [ ] Responsive on mobile
- [ ] No console errors

---

## Bug Report Template

If test fails, use this template:

**Test Case ID:** TC-XXX  
**Test Case Name:** _______________  
**Environment:** Browser, OS, Screen size  
**Steps to Reproduce:**  
1. 
2. 
3. 

**Expected Result:**  
_______________

**Actual Result:**  
_______________

**Screenshots/Console Errors:**  
_______________

**Severity:** Critical / High / Medium / Low  
**Priority:** P1 / P2 / P3
