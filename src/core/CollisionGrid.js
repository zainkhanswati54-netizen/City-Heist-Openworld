export class CollisionGrid {
  constructor(cellSize = 10) {
    this.cellSize = cellSize;
    this.cells = new Map();
  }

  _key(x, z) {
    const cx = Math.floor(x / this.cellSize);
    const cz = Math.floor(z / this.cellSize);
    return `${cx}_${cz}`;
  }

  insert(entry) {
    const k = this._key(entry.x, entry.z);
    if (!this.cells.has(k)) this.cells.set(k, []);
    this.cells.get(k).push(entry);
  }

  queryNearby(x, z, radiusCells = 1) {
    const results = [];
    const cx = Math.floor(x / this.cellSize);
    const cz = Math.floor(z / this.cellSize);
    for (let dx = -radiusCells; dx <= radiusCells; dx++) {
      for (let dz = -radiusCells; dz <= radiusCells; dz++) {
        const k = `${cx + dx}_${cz + dz}`;
        if (this.cells.has(k)) results.push(...this.cells.get(k));
      }
    }
    return results;
  }

  clear() {
    this.cells.clear();
  }
}
