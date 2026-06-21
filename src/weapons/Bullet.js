import * as THREE from 'three';
import { emissiveMaterial } from '../utils/MaterialFactory.js';
import { PALETTE } from '../config/colors.js';
import { SETTINGS } from '../config/settings.js';

export class Bullet {
  static createMesh() {
    const geo = new THREE.SphereGeometry(0.07, 6, 6);
    const mat = emissiveMaterial(PALETTE.bulletTracer, 2.2);
    return new THREE.Mesh(geo, mat);
  }

  static spawn(scene, origin, direction) {
    const mesh = Bullet.createMesh();
    mesh.position.copy(origin);
    scene.add(mesh);
    return {
      mesh,
      vel: direction.clone().multiplyScalar(SETTINGS.weapons.bulletSpeed),
      life: SETTINGS.weapons.bulletLife
    };
  }

  static step(bullet, dt) {
    bullet.mesh.position.addScaledVector(bullet.vel, dt);
    bullet.life -= dt;
    return bullet.life > 0;
  }
}
