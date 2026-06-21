export class Minimap {
  constructor(root) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 110;
    this.canvas.height = 110;
    this.canvas.style.cssText = 'position:absolute;bottom:10px;right:10px;border:1px solid rgba(0,255,255,0.3);border-radius:4px;background:rgba(0,0,0,0.7);';
    root.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.scale = 110 / 220;
  }

  render(worldHalf, playerPos, cars, npcs, buildings) {
    const ctx = this.ctx;
    const cx = 55, cz = 55;
    const s = 110 / (worldHalf * 2);
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, 110, 110);

    ctx.fillStyle = '#445';
    ctx.fillRect(cx - 1.5, 0, 3, 110);
    ctx.fillRect(0, cz - 1.5, 110, 3);

    ctx.fillStyle = '#667';
    buildings.forEach(b => {
      ctx.fillRect(cx + b.x * s - (b.w * s) / 2, cz + b.z * s - (b.d * s) / 2, b.w * s, b.d * s);
    });

    ctx.fillStyle = '#f80';
    cars.forEach(c => {
      ctx.fillRect(cx + c.group.position.x * s - 2, cz + c.group.position.z * s - 2, 4, 4);
    });

    ctx.fillStyle = '#f33';
    npcs.forEach(n => {
      ctx.fillRect(cx + n.group.position.x * s - 1.5, cz + n.group.position.z * s - 1.5, 3, 3);
    });

    ctx.fillStyle = '#0ff';
    ctx.fillRect(cx + playerPos.x * s - 2.5, cz + playerPos.z * s - 2.5, 5, 5);
  }
}
