import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { randomVariant } from '../utils/ColorUtils.js';
import { PALETTE } from '../config/colors.js';
import { pick } from '../utils/RandomUtils.js';

// Trees deliberately do NOT cast shadows — they are numerous (~180+) and
// the shadow contribution is barely visible.  Removing castShadow from
// trees alone eliminates ~700 shadow-caster calls per frame.
export class Tree {
  constructor(x, z) {
    this.group = new THREE.Group();

    const trunkMat = standardMaterial(PALETTE.treeTrunk, { roughness: 0.95 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.28, 2.2, 6), trunkMat);
    trunk.position.y = 1.1;
    trunk.receiveShadow = true;
    this.group.add(trunk);

    const leafColor = randomVariant(pick(PALETTE.treeLeaves), 0.06);
    const leafMat = standardMaterial(leafColor, { roughness: 0.9 });

    const clusters = [
      { y: 3.0, r: 1.3 },
      { y: 3.9, r: 1.0 },
      { y: 4.5, r: 0.65 }
    ];
    clusters.forEach(c => {
      const cluster = new THREE.Mesh(new THREE.SphereGeometry(c.r, 6, 5), leafMat);
      cluster.position.set((Math.random() - 0.5) * 0.3, c.y, (Math.random() - 0.5) * 0.3);
      cluster.receiveShadow = true;
      this.group.add(cluster);
    });

    this.group.position.set(x, 0, z);
    this.group.scale.setScalar(0.85 + Math.random() * 0.4);
  }
}
