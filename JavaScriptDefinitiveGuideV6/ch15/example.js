// Example 15-8. Querying the scrollbar positions of a window
function getScrollOffsets(w) {
  w = w || window;
  
  // This works for all browsers except IE versions 8 and before
  if (w.pageXOffset != null) return { x: w.pageXOffset, y: w.pageYOffset };

  // For IE (or any browser) in Standards mode
  var d = w.document;
  if (document.compatMode == 'CSS1Compat') return { x: d.documentElement.scrollLeft, y: d.documentElement.scrollTop };

  // For browsers in Quirks mode
  return { x: d.body.scrollLeft, y: d.body.scrollTop };
}

// Example 15-9. Querying the viewport size of a window
function getViewportSize(w) {
  w = w || window;
  
  // This works for all browsers except IE versions 8 and before
  if (w.innerWidth != null) return { x: w.innerWidth, y: w.innerHeight };

  // For IE (or any browser) in Standards mode
  var d = w.document;
  if (document.compatMode == 'CSS1Compat') return { w: d.documentElement.clientWidth, h: d.documentElement.clientHeight };

  // For browsers in Quirks mode
  return { w: d.body.clientWidth, h: d.body.clientHeight };
}