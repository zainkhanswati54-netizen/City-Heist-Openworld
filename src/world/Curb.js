import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { PALETTE } from '../config/colors.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export class Curb {
  constructor() {
    this.group = new THREE.Group();
    this.material = standardMaterial(PALETTE.curb, { roughness: 0.85 });
  }

  addCurbLine(x, z, length, rotationY = 0) {
    const geo = new THREE.BoxGeometry(0.15, 0.18, length);
    const mesh = new THREE.Mesh(geo, this.material);
    mesh.rotation.y = rotationY;
    mesh.position.set(x, 0.09, z);
    applyShadowCasting(mesh, true, true);
    this.group.add(mesh);
    return mesh;
  }
}
