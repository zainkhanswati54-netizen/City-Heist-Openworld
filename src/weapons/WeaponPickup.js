import * as THREE from 'three';
import { emissiveMaterial } from '../utils/MaterialFactory.js';
import { distance2D } from '../utils/MathUtils.js';

export class WeaponPickup {
  constructor(x, z) {
    this.x = x;
    this.z = z;
    this.collected = false;
    const mat = emissiveMaterial(0xffe24a, 0.6);
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), mat);
    this.mesh.position.set(x, 0.5, z);
  }

  update(dt) {
    this.mesh.rotation.y += 0.03 * dt;
    this.mesh.position.y = 0.5 + Math.sin(Date.now() * 0.003) * 0.1;
  }

  checkCollect(px, pz, radius = 1.4) {
    if (this.collected) return false;
    if (distance2D(px, pz, this.x, this.z) < radius) {
      this.collected = true;
      return true;
    }
    return false;
  }
}
