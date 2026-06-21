import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { randomVariant, shade } from '../utils/ColorUtils.js';

// Only the main body casts shadows — ledges, base trim, roof detail do NOT.
// This cuts shadow casters from ~5 per building to 1, saving ~800 shadow calls
// across the ~197 buildings in the world.
export class Building {
  constructor(x, z, width, height, depth, baseColor) {
    this.group = new THREE.Group();
    const color = randomVariant(baseColor, 0.06);

    const bodyMat = standardMaterial(color, { roughness: 0.82, metalness: 0.06 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), bodyMat);
    body.position.y = height / 2;
    body.castShadow    = true;
    body.receiveShadow = true;
    this.group.add(body);

    // Base trim — receive only, no cast
    const trimMat = standardMaterial(shade(color, -0.25), { roughness: 0.8 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(width + 0.3, 1.0, depth + 0.3), trimMat);
    base.position.y = 0.5;
    base.receiveShadow = true;
    this.group.add(base);

    // Ledges — no shadows at all (not worth the cost)
    const ledgeMat = standardMaterial(shade(color, -0.15), { roughness: 0.8 });
    const ledgeCount = Math.max(1, Math.floor(height / 12));
    for (let i = 1; i <= ledgeCount; i++) {
      const ledge = new THREE.Mesh(new THREE.BoxGeometry(width + 0.2, 0.3, depth + 0.2), ledgeMat);
      ledge.position.y = (height / (ledgeCount + 1)) * i;
      this.group.add(ledge);
    }

    // Roof — no shadow cast
    const roofMat = standardMaterial(shade(color, -0.3), { roughness: 0.9 });
    const roof = new THREE.Mesh(new THREE.BoxGeometry(width * 0.6, 0.6, depth * 0.6), roofMat);
    roof.position.y = height + 0.3;
    roof.receiveShadow = true;
    this.group.add(roof);

    // Optional rooftop tank
    if (Math.random() > 0.5) {
      const tankMat = standardMaterial(0x5a5a55, { metalness: 0.4, roughness: 0.6 });
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.4, 7), tankMat);
      tank.position.set(width * 0.15, height + 1.3, depth * 0.1);
      this.group.add(tank);
    }

    this.group.position.set(x, 0, z);
    this.color = color;
    this.dims  = { width, height, depth, x, z };
  }
}
