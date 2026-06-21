export class ControlsHint {
  constructor(root) {
    this.el = document.createElement('div');
    this.el.style.cssText = 'position:absolute;top:12px;left:12px;color:rgba(255,255,255,0.55);font-size:10px;line-height:1.7;font-family:monospace;';
    root.appendChild(this.el);
    this.setMode(false);
  }

  setMode(inVehicle) {
    this.el.innerHTML = inVehicle
      ? 'WASD - drive<br>SPACE - handbrake<br>E - exit vehicle'
      : 'WASD - move<br>SHIFT - run<br>E - enter vehicle<br>SPACE - shoot<br>Click - lock mouse';
  }
}
