import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { PALETTE } from '../config/colors.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export class Sidewalk {
  constructor() {
    this.group = new THREE.Group();
    this.material = standardMaterial(PALETTE.sidewalk, { roughness: 0.85 });
  }

  addStrip(x, z, width, length, rotationY = 0) {
    const geo = new THREE.PlaneGeometry(width, length, Math.max(1, Math.round(length / 4)), 1);
    const mesh = new THREE.Mesh(geo, this.material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = rotationY;
    mesh.position.set(x, 0.05, z);
    applyShadowCasting(mesh, false, true);
    this.group.add(mesh);

    const lineMat = standardMaterial(PALETTE.curb, { roughness: 0.9 });
    const seamCount = Math.max(1, Math.round(length / 4));
    for (let i = 0; i <= seamCount; i++) {
      const off = -length / 2 + (length / seamCount) * i;
      const seamGeo = new THREE.PlaneGeometry(width, 0.03);
      const seam = new THREE.Mesh(seamGeo, lineMat);
      seam.rotation.x = -Math.PI / 2;
      seam.rotation.z = rotationY;
      const dx = Math.sin(rotationY) * off;
      const dz = Math.cos(rotationY) * off;
      seam.position.set(x + dx, 0.052, z + dz);
      this.group.add(seam);
    }
    return mesh;
  }
}
