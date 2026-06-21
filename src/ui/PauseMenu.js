export class PauseMenu {
  constructor(root, onResume) {
    this.el = document.createElement('div');
    this.el.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.7);display:none;align-items:center;justify-content:center;flex-direction:column;color:#fff;font-family:monospace;z-index:10;pointer-events:auto;cursor:pointer;';
    this.el.innerHTML = `
      <div style="font-size:22px;margin-bottom:12px;">PAUSED</div>
      <div style="font-size:12px;color:#aaa;">Click anywhere to resume</div>`;
    root.appendChild(this.el);
    this.visible = false;
    this.onResume = onResume;
    this.el.addEventListener('click', () => {
      this.hide();
      if (this.onResume) this.onResume();
    });
  }

  show() {
    this.el.style.display = 'flex';
    this.visible = true;
  }

  hide() {
    this.el.style.display = 'none';
    this.visible = false;
  }

  toggle() {
    this.visible ? this.hide() : this.show();
  }
}
