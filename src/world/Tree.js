import * as THREE from 'three';
import { randomVariant } from '../utils/ColorUtils.js';
import { PALETTE } from '../config/colors.js';
import { pick } from '../utils/RandomUtils.js';

// TWO draw calls per tree: 1 trunk cylinder + 1 cone for leaves.
// No shadows, no extra clusters.  Previously 4+ meshes with shadows.
const _trunkMat = new THREE.MeshLambertMaterial({ color: 0x5a3a1a });
const _leafMats  = [0x2d6a30, 0x3a7a3e, 0x256028, 0x1e5225].map(
  c => new THREE.MeshLambertMaterial({ color: c })
);

export class Tree {
  constructor(x, z) {
    this.group = new THREE.Group();

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2.4, 5), _trunkMat);
    trunk.position.y = 1.2;
    this.group.add(trunk);

    const leafMat = _leafMats[Math.floor(Math.random() * _leafMats.length)];
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3.8, 6), leafMat);
    cone.position.y = 4.5;
    this.group.add(cone);

    this.group.position.set(x, 0, z);
    this.group.scale.setScalar(0.8 + Math.random() * 0.4);
  }
}
