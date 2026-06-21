import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { randomVariant } from '../utils/ColorUtils.js';
import { PALETTE } from '../config/colors.js';
import { pick } from '../utils/RandomUtils.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export class Tree {
  constructor(x, z) {
    this.group = new THREE.Group();

    const trunkMat = standardMaterial(PALETTE.treeTrunk, { roughness: 0.95 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.28, 2.2, 7), trunkMat);
    trunk.position.y = 1.1;
    applyShadowCasting(trunk, true, true);
    this.group.add(trunk);

    const leafColor = randomVariant(pick(PALETTE.treeLeaves), 0.05);
    const leafMat = standardMaterial(leafColor, { roughness: 0.9 });
    const clusters = [
      { y: 3.0, r: 1.3 },
      { y: 3.9, r: 1.0 },
      { y: 4.5, r: 0.7 }
    ];
    clusters.forEach(c => {
      const cluster = new THREE.Mesh(new THREE.SphereGeometry(c.r, 7, 6), leafMat);
      cluster.position.set((Math.random() - 0.5) * 0.3, c.y, (Math.random() - 0.5) * 0.3);
      applyShadowCasting(cluster, true, true);
      this.group.add(cluster);
    });

    this.group.position.set(x, 0, z);
    this.group.scale.setScalar(0.85 + Math.random() * 0.4);
  }
}
