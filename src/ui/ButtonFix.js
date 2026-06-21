export class ButtonFix {
  constructor(pauseMenu, input) {
    this.pauseMenu = pauseMenu;
    this.input = input;
    this.paused = false;

    document.addEventListener('keydown', e => {
      if (e.code === 'Escape') this.togglePause();
    });
  }

  togglePause() {
    this.paused = !this.paused;
    if (this.paused) {
      this.pauseMenu.show();
      document.exitPointerLock();
    } else {
      this.pauseMenu.hide();
    }
  }

  isPaused() {
    return this.paused;
  }

  forceResume() {
    this.paused = false;
  }

  static ensureInteractive(el) {
    el.style.pointerEvents = 'auto';
  }
}
