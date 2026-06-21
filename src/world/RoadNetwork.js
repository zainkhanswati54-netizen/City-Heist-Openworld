import * as THREE from 'three';
import { asphaltMaterial } from '../utils/MaterialFactory.js';
import { PALETTE } from '../config/colors.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export class RoadNetwork {
  constructor() {
    this.group = new THREE.Group();
    this.material = asphaltMaterial(PALETTE.road);
  }

  addRoad(x, z, width, length, rotationY = 0) {
    const geo = new THREE.PlaneGeometry(width, length);
    const mesh = new THREE.Mesh(geo, this.material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = rotationY;
    mesh.position.set(x, 0.015, z);
    applyShadowCasting(mesh, false, true);
    this.group.add(mesh);
    return mesh;
  }
}
