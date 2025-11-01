// Debug snippet for checking canvas layering
// Paste this in browser console after page loads

const bg = document.querySelector('#root-stage > canvas');
const fg = document.querySelector('spline-viewer');
const ui = document.querySelector('#ui-controls');

console.log('🔍 Canvas Debug Check:');
console.log('Background canvas (R3F):', {
  width: bg?.width,
  height: bg?.height,
  position: getComputedStyle(bg).position,
  zIndex: getComputedStyle(bg).zIndex,
  background: getComputedStyle(bg).background
});

console.log('Foreground spline-viewer:', {
  width: getComputedStyle(fg).width,
  height: getComputedStyle(fg).height,
  position: getComputedStyle(fg).position,
  zIndex: getComputedStyle(fg).zIndex,
  background: getComputedStyle(fg).background
});

console.log('UI controls:', {
  position: getComputedStyle(ui).position,
  zIndex: getComputedStyle(ui).zIndex
});

// Check if elements exist and have proper sizes
if (!bg) console.error('❌ R3F canvas not found!');
if (!fg) console.error('❌ spline-viewer not found!');
if (bg?.width === 0 || bg?.height === 0) console.error('❌ R3F canvas has 0 dimensions!');
if (getComputedStyle(fg).width === '0px') console.error('❌ spline-viewer has 0 width!');

console.log('✅ All elements found and positioned correctly!');