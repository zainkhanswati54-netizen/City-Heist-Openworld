export class WeaponSelectorUI {
  constructor(root, onCycle) {
    this.container = document.createElement('div');
    this.container.style.cssText = 'position:absolute;bottom:78px;right:14px;display:flex;gap:6px;pointer-events:auto;font-family:monospace;';
    root.appendChild(this.container);
    this.onCycle = onCycle;
    this.buttons = [];
  }

  render(weaponList, activeIndex) {
    this.container.innerHTML = '';
    this.buttons = [];
    weaponList.forEach((w, idx) => {
      const btn = document.createElement('div');
      const isActive = idx === activeIndex;
      btn.style.cssText = `
        width:34px;height:34px;border-radius:6px;display:flex;align-items:center;justify-content:center;
        font-size:9px;color:${w.unlocked ? '#fff' : '#555'};
        background:${isActive ? 'rgba(0,200,255,0.35)' : 'rgba(0,0,0,0.5)'};
        border:1px solid ${isActive ? '#0ff' : 'rgba(255,255,255,0.2)'};
        cursor:${w.unlocked ? 'pointer' : 'default'};
      `;
      btn.textContent = w.def.name.slice(0, 3).toUpperCase();
      if (w.unlocked) {
        btn.addEventListener('click', () => this.onCycle(w.id));
      }
      this.container.appendChild(btn);
      this.buttons.push(btn);
    });
  }
}
