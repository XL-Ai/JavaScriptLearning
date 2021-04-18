// Example 17-1. Invoking functions when the document is ready
var whenReady = (function() {
  var funcs = [];
  var ready = false;

  function handler(e) {
    if (ready) return;

    if (e.type === 'readystatechange' && document.readyState !== 'complete') return;

    for (var i = 0 ; i < funcs.length ; i++) {
      funcs[i].call(document);
    }

    ready = true;
    funcs = null;
  }

  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', handler, false);
    document.addEventListener('readystatechange', handler, false);
    window.addEventListener('load', handler, false);
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', handler);
    window.attachEvent('onload', handler);
  }

  return function whenReady(f) {
    if (ready) f.call(document);
    else funcs.push(f);
  }
})();

// Example 17-2. Dragging document elements
function drag(elementToDrag, event) {
  var scroll = getScrollOffsets();
  var startX = event.clientX + scroll.x;
  var startY = event.clientY + scroll.y;

  var origX = elementToDrag.offsetLeft;
  var origY = elementToDrag.offsetTop;

  var deltaX = startX - origX;
  var deltaY = startY - origY;

  function moveHandler(e) {
    if (!e) e = window.event;

    var scroll = getScrollOffsets();
    elementToDrag.style.left = (e.clientX + scroll.x - deltaX) + 'px';
    elementToDrag.style.top = (e.clientY + scroll.y - deltaY) + 'px';

    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  }

  function upHandler(e) {
    if (!e) e = window.event;

    if (document.removeEventListener) {
      document.removeEventListener('mouseup', upHandler, true);
      document.removeEventListener('mousemove', moveHandler, true);
    } else if (document.detachEvent) {
      elementToDrag.detachEvent('onlosecapture', upHandler);
      elementToDrag.detachEvent('onmouseup', upHandler);
      elementToDrag.detachEvent('onmousemove', moveHandler);
      elementToDrag.releaseCapture();
    }

    if (e.stopPropagation) {
      e.stopPropagation();
    } else {
      e.cancelBubble = true;
    }
  }

  if (document.addEventListener) {
    document.addEventListener('mousemove', moveHandler, true);
    document.addEventListener('mouseup', upHandler, true);
  } else if (document.attachEvent) {
    elementToDrag.setCapture();
    elementToDrag.attachEvent('onmousemove', moveHandler);
    elementToDrag.attachEvent('onmouseup', upHandler);
    elementToDrag.attachEvent('onlosecapture', upHandler);
  }

  if (e.stopPropagation) {
    e.stopPropagation();
  } else {
    e.cancelBubble = true;
  }

  if (e.preventDefault) {
    e.preventDefault();
  } else {
    e.returnValue = false;
  }
}