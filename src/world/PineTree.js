import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { randomVariant } from '../utils/ColorUtils.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export class PineTree {
  constructor(x, z) {
    this.group = new THREE.Group();

    const trunkMat = standardMaterial(0x5a4530, { roughness: 0.9 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 1.2, 6), trunkMat);
    trunk.position.y = 0.6;
    applyShadowCasting(trunk, true, true);
    this.group.add(trunk);

    const leafColor = randomVariant(0x2f5a3a, 0.06);
    const leafMat = standardMaterial(leafColor, { roughness: 0.85 });
    const tiers = 4;
    for (let i = 0; i < tiers; i++) {
      const tierHeight = 1.4;
      const tierRadius = 1.1 - i * 0.22;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(tierRadius, tierHeight, 8), leafMat);
      cone.position.y = 1.2 + i * 1.05;
      applyShadowCasting(cone, true, true);
      this.group.add(cone);
    }

    this.group.position.set(x, 0, z);
    this.group.scale.setScalar(0.8 + Math.random() * 0.5);
  }
}
