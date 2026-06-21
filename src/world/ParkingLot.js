import * as THREE from 'three';
import { asphaltMaterial, emissiveMaterial } from '../utils/MaterialFactory.js';
import { PALETTE } from '../config/colors.js';

export class ParkingLot {
  constructor(x, z, width, depth) {
    this.group = new THREE.Group();
    const mat = asphaltMaterial(0x35353a);
    const lot = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), mat);
    lot.rotation.x = -Math.PI / 2;
    lot.position.set(x, 0.012, z);
    lot.receiveShadow = true;
    this.group.add(lot);

    const lineMat = emissiveMaterial(PALETTE.roadLine, 0.15);
    const stalls = Math.floor(width / 2.6);
    for (let i = 0; i < stalls; i++) {
      const lx = x - width / 2 + i * 2.6 + 1.3;
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.08, depth * 0.8), lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(lx, 0.02, z);
      this.group.add(line);
    }
  }
}
