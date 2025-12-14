# Auto-Prompt Error Notification - Testing Guide

## Overview
This guide explains how to test the automatic error notification feature that prompts users to report errors when they occur.

## What is Auto-Prompt?

When an error occurs on a webpage (JavaScript error, promise rejection, etc.), the Performance Metrics Toolbar automatically displays a **non-intrusive notification** in the bottom-right corner, asking the user if they want to report the error to the extension author.

## Key Features
- ✅ **Automatic detection** - Captures all JavaScript errors and promise rejections
- ✅ **Smart cooldown** - 30-second cooldown prevents notification spam
- ✅ **User control** - Three options: Report, Later (5 min reminder), Dismiss (disable)
- ✅ **Non-intrusive** - Appears bottom-right, auto-dismisses after 30 seconds
- ✅ **Smooth animations** - Slides in/out gracefully

---

## Testing Instructions

### Prerequisites
1. Install the Performance Metrics Toolbar extension
2. Open the test page: `test-error-prompt.html`
3. Open browser DevTools console (F12)

### Test 1: Basic Notification

**Steps:**
1. Click "Trigger Test Error" button
2. Wait 1-2 seconds
3. **Expected:** Notification slides in from bottom-right with orange border
4. **Expected:** Notification shows:
   - Error message preview
   - Three buttons: "Report Error", "Later", "Dismiss"
5. **Expected:** Notification auto-dismisses after 30 seconds

**Validation:**
- ✅ Notification appears within 2 seconds
- ✅ Notification is positioned bottom-right (80px from bottom, 20px from right)
- ✅ Notification has orange border (#ffaa00)
- ✅ Notification slides in smoothly (slideInRight animation)
- ✅ Auto-dismisses after 30 seconds

---

### Test 2: Cooldown System

**Purpose:** Verify that multiple errors don't spam the user with notifications

**Steps:**
1. Click "Trigger Multiple Errors" button
2. Script will trigger 5 errors in quick succession (500ms apart)
3. **Expected:** Only ONE notification appears
4. Wait 30 seconds
5. Click "Trigger Test Error" again
6. **Expected:** New notification appears

**Validation:**
- ✅ Only one notification appears despite 5 errors
- ✅ Subsequent errors are queued but don't trigger new notifications
- ✅ After 30 seconds, new errors can trigger notifications again
- ✅ Check console for: "Auto-prompt on cooldown. Next prompt available in X seconds."

---

### Test 3: Button Functionality

#### Test 3A: "Report Error" Button
**Steps:**
1. Trigger an error
2. Click "Report Error" button in notification
3. **Expected:** Full error report modal opens
4. **Expected:** Modal shows all captured errors
5. **Expected:** Can copy report or open GitHub issue

**Validation:**
- ✅ Modal opens immediately
- ✅ Error details are accurate (message, stack trace, timestamp)
- ✅ System information is correct (browser, screen size, etc.)
- ✅ "Copy Report" button works
- ✅ "Open GitHub Issue" button works

#### Test 3B: "Later" Button
**Steps:**
1. Trigger an error
2. Click "Later" button
3. **Expected:** Notification slides out
4. Wait 5 minutes
5. **Expected:** Notification reappears automatically

**Validation:**
- ✅ Notification dismisses smoothly
- ✅ Console shows: "User chose to be reminded later (5 minutes)"
- ✅ Notification reappears after 5 minutes
- ✅ Can test by temporarily changing `5 * 60 * 1000` to `10 * 1000` (10 seconds) in code

#### Test 3C: "Dismiss" Button
**Steps:**
1. Trigger an error
2. Click "Dismiss" button
3. **Expected:** Notification slides out
4. Trigger more errors
5. **Expected:** No more notifications appear (disabled for session)
6. Check status
7. **Expected:** Auto-prompt status shows `enabled: false`

**Validation:**
- ✅ Notification dismisses smoothly
- ✅ Console shows: "User dismissed auto-prompt notifications for this session"
- ✅ Subsequent errors don't trigger notifications
- ✅ Errors are still captured (check via 🐛 button)
- ✅ `ErrorReporter.getAutoPromptStatus().enabled` returns `false`

---

### Test 4: Promise Rejections

**Purpose:** Verify that async errors (unhandled promise rejections) also trigger notifications

**Steps:**
1. Click "Trigger Promise Rejection" button
2. **Expected:** Notification appears
3. Check error message
4. **Expected:** Shows "Unhandled promise rejection"

**Validation:**
- ✅ Notification appears for promise rejections
- ✅ Error type is correctly identified
- ✅ Stack trace is captured

---

### Test 5: Different Error Types

**Purpose:** Test various JavaScript error types

**Steps:**
1. Click "Trigger TypeError" button
2. **Expected:** Notification appears
3. Check error message
4. **Expected:** Shows "Cannot read property 'property' of null" (or similar)

**Test other error types in console:**
```javascript
// ReferenceError
undefinedVariable.property;

// SyntaxError (runtime)
eval('function {');

// RangeError
new Array(-1);
```

**Validation:**
- ✅ All error types trigger notifications
- ✅ Error details are accurate
- ✅ Stack traces are complete

---

### Test 6: Enable/Disable Controls

**Purpose:** Verify programmatic control of auto-prompt

**Steps:**
1. Click "Check Status" button
2. **Expected:** Shows current auto-prompt status
3. Click "Disable Auto-Prompt" button
4. **Expected:** Status changes to "❌ Disabled"
5. Trigger errors
6. **Expected:** No notifications appear
7. Click "Enable Auto-Prompt" button
8. **Expected:** Status changes to "✅ Enabled"
9. Trigger error
10. **Expected:** Notification appears

**Validation:**
- ✅ Status display is accurate
- ✅ Enable/disable works immediately
- ✅ When disabled, errors are still captured (check 🐛 button)
- ✅ When re-enabled, notifications work again

---

### Test 7: Multi-Tab/Multi-Window

**Purpose:** Verify notification behavior across multiple tabs

**Steps:**
1. Open test page in Tab A
2. Open same page in Tab B
3. Trigger error in Tab A
4. **Expected:** Notification appears in Tab A only
5. Switch to Tab B
6. Trigger error in Tab B
7. **Expected:** Notification appears in Tab B

**Validation:**
- ✅ Notifications are tab-specific
- ✅ Cooldown is per-tab (each tab has independent cooldown)
- ✅ Dismiss in one tab doesn't affect other tabs

---

### Test 8: Responsive Design

**Purpose:** Verify notification works on different screen sizes

**Steps:**
1. Test on desktop (1920x1080)
2. **Expected:** Notification bottom-right, doesn't overlap toolbar
3. Resize browser to tablet (768px width)
4. **Expected:** Notification still visible, responsive
5. Resize to mobile (375px width)
6. **Expected:** Notification adapts, still accessible

**Validation:**
- ✅ Notification always visible (never cut off)
- ✅ Buttons remain clickable on small screens
- ✅ Text remains readable (no overflow)
- ✅ Z-index correct (below toolbar/modal, above page content)

---

### Test 9: Notification Positioning

**Purpose:** Verify notification doesn't interfere with toolbar

**Steps:**
1. Ensure toolbar is visible at bottom
2. Trigger error
3. **Expected:** Notification appears 80px from bottom (above toolbar)
4. Minimize toolbar
5. **Expected:** Notification still visible, not overlapping minimized toolbar

**Validation:**
- ✅ Notification at `bottom: 80px` (above toolbar)
- ✅ Notification at `right: 20px` (20px margin from edge)
- ✅ Z-index: 2147483645 (toolbar is 2147483647)
- ✅ Never overlaps toolbar (minimized or expanded)

---

### Test 10: Performance Impact

**Purpose:** Verify auto-prompt doesn't impact page performance

**Steps:**
1. Open Performance DevTools tab
2. Start recording
3. Trigger 10 errors rapidly
4. Stop recording
5. Analyze performance impact

**Validation:**
- ✅ Notification rendering takes < 16ms (60fps)
- ✅ No jank or frame drops
- ✅ Cooldown system prevents excessive work
- ✅ CSS animations are GPU-accelerated

---

## Console Commands for Testing

Use these commands in browser console:

```javascript
// Check auto-prompt status
ErrorReporter.getAutoPromptStatus();

// Expected output:
// {
//   enabled: true,
//   lastPromptTime: 1234567890,
//   promptCooldown: 30000,
//   nextPromptAvailable: 1234567890
// }

// Disable auto-prompt
ErrorReporter.setAutoPrompt(false);

// Enable auto-prompt
ErrorReporter.setAutoPrompt(true);

// Check if error reporter is initialized
ErrorReporter.isEnabled();

// Get all captured errors
ErrorReporter.getErrors();

// Clear error queue
ErrorReporter.clearErrors();

// Trigger test error
ErrorReporter.testError();

// Manual trigger notification (for development)
// Note: This is internal and not exposed in public API
// But you can trigger real errors to test
throw new Error('Test error for notification');
```

---

## Expected Notification HTML Structure

```html
<div class="perf-error-notification" 
     style="position: fixed; bottom: 80px; right: 20px; 
            background: #1a1a1a; color: white; 
            padding: 15px 20px; border-radius: 8px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.3); 
            border: 2px solid #ffaa00; 
            min-width: 320px; max-width: 400px; 
            z-index: 2147483645; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <div style="display: flex; align-items: flex-start; gap: 12px;">
    <div style="font-size: 24px;">⚠️</div>
    <div style="flex: 1;">
      <div style="font-weight: bold; margin-bottom: 8px;">
        An error occurred
      </div>
      <div style="font-size: 13px; color: #ccc; margin-bottom: 12px;">
        [Error message preview]
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="report-btn">Report Error</button>
        <button class="later-btn">Later</button>
        <button class="dismiss-btn">Dismiss</button>
      </div>
    </div>
  </div>
</div>
```

---

## Common Issues & Troubleshooting

### Issue 1: Notification doesn't appear
**Possible causes:**
- Extension not loaded
- Auto-prompt disabled
- Cooldown active (wait 30 seconds)
- Error not captured (check console for extension errors)

**Solution:**
```javascript
// Check status
ErrorReporter.getAutoPromptStatus();

// Enable if disabled
ErrorReporter.setAutoPrompt(true);

// Check if error reporter is initialized
ErrorReporter.isEnabled(); // Should return true
```

### Issue 2: Notification appears multiple times
**Possible cause:** Cooldown not working

**Solution:**
- Check console for cooldown messages
- Verify `lastPromptTime` is being updated
- Ensure errors are at least 30 seconds apart

### Issue 3: Buttons don't work
**Possible cause:** Event listeners not attached

**Solution:**
- Check browser console for errors
- Verify `showReportModal()` is available
- Check if notification element exists in DOM

### Issue 4: Notification overlaps toolbar
**Possible cause:** Z-index or positioning issue

**Solution:**
- Notification should be at `z-index: 2147483645`
- Toolbar should be at `z-index: 2147483647`
- Notification should be at `bottom: 80px` (above toolbar)

---

## Success Criteria

All tests should pass with these criteria:

✅ **Functionality**
- Notifications appear automatically when errors occur
- Only one notification per 30 seconds (cooldown works)
- All three buttons work correctly (Report, Later, Dismiss)
- "Later" reminds after 5 minutes
- "Dismiss" disables for session
- Errors are still captured even when auto-prompt is disabled

✅ **UX**
- Notifications are non-intrusive
- Smooth slide-in/out animations
- Auto-dismiss after 30 seconds
- Responsive on all screen sizes
- Never overlaps toolbar or important UI

✅ **Performance**
- No noticeable performance impact
- Renders in < 16ms
- No memory leaks
- Cooldown prevents excessive notifications

✅ **Reliability**
- Captures all error types (errors, promise rejections, TypeErrors, etc.)
- Works across multiple tabs independently
- Survives page navigation (SPA support)
- Error queue persists (max 10 errors)

---

## Reporting Issues

If you find issues during testing:

1. Describe the test case
2. Expected behavior
3. Actual behavior
4. Browser and version
5. Console errors (if any)
6. Screenshots/recordings

Report via:
- GitHub: Open issue at [repository URL]
- Email: Use the 🐛 button to generate error report

---

## Next Steps

After testing:
1. ✅ Verify all 10 test cases pass
2. ✅ Test on multiple browsers (Chrome, Firefox, Edge, Safari)
3. ✅ Test on different screen sizes (desktop, tablet, mobile)
4. ✅ Test on various websites (SPAs, PWAs, standard sites)
5. ✅ Collect user feedback
6. ✅ Update documentation based on findings
7. ✅ Consider adding user preferences (localStorage for persistent disable)

---

## Developer Notes

### Key Implementation Details

**Auto-Prompt Variables:**
```javascript
let autoPromptEnabled = true;  // Global toggle
let lastPromptTime = 0;        // Unix timestamp
let promptCooldown = 30000;    // 30 seconds in ms
```

**Notification Timing:**
- Cooldown: 30 seconds between prompts
- "Later" reminder: 5 minutes
- Auto-dismiss: 30 seconds
- Slide animation: 0.3 seconds

**Z-Index Hierarchy:**
- Page content: 0-1000
- Notification: 2147483645
- Toolbar: 2147483647
- Modals: 2147483647

**CSS Animations:**
- `slideInRight`: translateX(400px) → translateX(0)
- `slideOutRight`: translateX(0) → translateX(400px)
- Duration: 0.3s
- Easing: ease-in-out

### Future Enhancements
- [ ] Add localStorage persistence for "Dismiss" (cross-session)
- [ ] Add user preferences UI (settings button)
- [ ] Add visual indicator on 🐛 button (badge with error count)
- [ ] Add sound notification (optional, toggle)
- [ ] Add keyboard shortcuts (Esc to dismiss, Enter to report)
- [ ] Add different notification styles for error severity
- [ ] Add notification history/log
- [ ] Add telemetry (track notification interactions)
