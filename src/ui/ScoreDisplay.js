export class ScoreDisplay {
  constructor(root) {
    this.el = document.createElement('div');
    this.el.style.cssText = 'position:absolute;top:12px;right:16px;color:#fff;font-size:13px;font-family:monospace;';
    root.appendChild(this.el);
    this.set(0);
  }

  set(score) {
    this.el.textContent = 'SCORE: ' + score;
  }
}
