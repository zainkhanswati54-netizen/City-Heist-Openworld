import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { PALETTE } from '../config/colors.js';

export class Intersection {
  constructor() {
    this.group = new THREE.Group();
    this.crosswalkMat = standardMaterial(0xd8d4c8, { roughness: 0.8 });
  }

  addCrosswalk(x, z, size, rotationY = 0) {
    const stripeCount = 6;
    const stripeWidth = size / (stripeCount * 2 - 1);
    for (let i = 0; i < stripeCount; i++) {
      const offset = -size / 2 + i * stripeWidth * 2 + stripeWidth / 2;
      const geo = new THREE.PlaneGeometry(stripeWidth, size * 0.7);
      const mesh = new THREE.Mesh(geo, this.crosswalkMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.z = rotationY;
      const dx = Math.cos(rotationY) * offset;
      const dz = -Math.sin(rotationY) * offset;
      mesh.position.set(x + dx, 0.025, z + dz);
      this.group.add(mesh);
    }
  }
}
