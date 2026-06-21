export class HealthBar {
  constructor(root) {
    this.container = document.createElement('div');
    this.container.style.cssText = 'position:absolute;bottom:64px;left:16px;font-family:monospace;display:flex;align-items:center;gap:8px;';
    this.container.innerHTML = `
      <div style="width:38px;height:38px;border-radius:50%;background:radial-gradient(circle,#2a3a4a,#10161e);
                  border:2px solid rgba(255,255,255,0.4);display:flex;align-items:center;justify-content:center;
                  font-size:18px;box-shadow:0 0 8px rgba(0,0,0,0.5);">🧍</div>
      <div>
        <div style="color:#ddd;font-size:10px;letter-spacing:1px;margin-bottom:3px;text-shadow:0 1px 2px #000;">HEALTH</div>
        <div style="display:flex;gap:2px;">
          ${Array.from({ length: 10 }).map((_, i) => `<div class="hp-seg" data-i="${i}" style="width:13px;height:11px;background:#3a3a3a;border-radius:2px;border:1px solid rgba(0,0,0,0.4);"></div>`).join('')}
        </div>
      </div>`;
    root.appendChild(this.container);
    this.segments = Array.from(this.container.querySelectorAll('.hp-seg'));
  }

  set(hp, maxHp) {
    const pct = Math.max(0, hp / maxHp);
    const filledCount = Math.round(pct * this.segments.length);
    const color = pct > 0.5 ? '#4ad24a' : pct > 0.25 ? '#e0c23c' : '#e04a3c';
    this.segments.forEach((seg, i) => {
      seg.style.background = i < filledCount ? color : '#3a3a3a';
      seg.style.boxShadow = i < filledCount ? `0 0 4px ${color}` : 'none';
    });
  }
}
