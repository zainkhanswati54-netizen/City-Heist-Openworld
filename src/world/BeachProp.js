import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { pick } from '../utils/RandomUtils.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

const UMBRELLA_COLORS = [0xd83a3a, 0x3a7ad8, 0xe0d83a, 0x3ad88a];

export class BeachProp {
  static umbrella(x, z) {
    const group = new THREE.Group();
    const poleMat = standardMaterial(0xc9c2a8, { roughness: 0.7 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.0, 6), poleMat);
    pole.position.y = 1.0;
    applyShadowCasting(pole, true, false);
    group.add(pole);

    const canopyMat = standardMaterial(pick(UMBRELLA_COLORS), { roughness: 0.6 });
    const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.6, 8), canopyMat);
    canopy.position.y = 2.1;
    applyShadowCasting(canopy, true, false);
    group.add(canopy);

    group.position.set(x, 0, z);
    return group;
  }

  static lounger(x, z, rotationY = 0) {
    const group = new THREE.Group();
    const mat = standardMaterial(0xf0ead0, { roughness: 0.8 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 1.8), mat);
    base.position.y = 0.25;
    applyShadowCasting(base, true, true);
    group.add(base);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.1, 0.7), mat);
    back.position.set(0, 0.45, -0.75);
    back.rotation.x = -0.5;
    applyShadowCasting(back, true, false);
    group.add(back);
    const legMat = standardMaterial(0x8a8270, { roughness: 0.6 });
    [[-0.25, -0.8], [0.25, -0.8], [-0.25, 0.8], [0.25, 0.8]].forEach(([lx, lz]) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.25, 6), legMat);
      leg.position.set(lx, 0.12, lz);
      group.add(leg);
    });
    group.position.set(x, 0, z);
    group.rotation.y = rotationY;
    return group;
  }

  static beachBall(x, z) {
    const group = new THREE.Group();
    const colors = [0xd83a3a, 0xffffff, 0x3a7ad8, 0xe0d83a];
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 10), standardMaterial(pick(colors), { roughness: 0.5 }));
    ball.position.set(x, 0.25, z);
    applyShadowCasting(ball, true, false);
    group.add(ball);
    return group;
  }
}
