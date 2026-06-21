export function isTouchDevice() {
  return ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
}

export function isMobileUserAgent() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isLikelyMobile() {
  return isTouchDevice() && isMobileUserAgent();
}

export function isAndroidWebView() {
  return /Android/i.test(navigator.userAgent) && /wv/i.test(navigator.userAgent);
}
