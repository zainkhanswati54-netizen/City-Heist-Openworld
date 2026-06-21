export class MobileLayout {
  static applyIfNeeded(root, isMobile) {
    if (!isMobile) return;
    const style = document.createElement('style');
    style.textContent = `
      #${root.id} { font-size: 90%; }
      #${root.id} *[style*="font-size:13px"] { font-size: 11px !important; }
    `;
    document.head.appendChild(style);
    root.classList.add('mobile-hud');
  }

  static isSmallScreen() {
    return Math.min(window.innerWidth, window.innerHeight) < 480;
  }
}
