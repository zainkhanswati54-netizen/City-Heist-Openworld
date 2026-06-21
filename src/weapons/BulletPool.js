import * as THREE from 'three';
import { emissiveMaterial } from '../utils/MaterialFactory.js';
import { PALETTE } from '../config/colors.js';
import { SETTINGS } from '../config/settings.js';
import { Pool } from '../utils/Pool.js';

// Shared geometry/material across all pooled bullets — these never change, so building
// them once at module load (instead of per-bullet) avoids redundant GPU buffer uploads.
const BULLET_GEOMETRY = new THREE.SphereGeometry(0.07, 6, 6);
const BULLET_MATERIAL = emissiveMaterial(PALETTE.bulletTracer, 2.2);

export class BulletPool {
  constructor(scene, initialSize = 40) {
    this.scene = scene;
    this.pool = new Pool(
      () => this._create(),
      (b) => this._reset(b),
      initialSize
    );
  }

  _create() {
    const mesh = new THREE.Mesh(BULLET_GEOMETRY, BULLET_MATERIAL);
    mesh.visible = false;
    this.scene.add(mesh); // added once, toggled visible/invisible thereafter — never re-added/removed
    return {
      mesh,
      vel: new THREE.Vector3(),
      life: 0,
      active: false
    };
  }

  _reset(b) {
    b.mesh.visible = false;
    b.active = false;
    b.life = 0;
  }

  spawn(origin, direction) {
    const b = this.pool.acquire();
    b.mesh.position.copy(origin);
    b.mesh.visible = true;
    b.vel.copy(direction).multiplyScalar(SETTINGS.weapons.bulletSpeed);
    b.life = SETTINGS.weapons.bulletLife;
    b.active = true;
    return b;
  }

  step(b, dt) {
    b.mesh.position.addScaledVector(b.vel, dt);
    b.life -= dt;
    if (b.life <= 0) {
      this.pool.release(b);
      return false;
    }
    return true;
  }

  release(b) {
    this.pool.release(b);
  }

  get activeBullets() {
    return this.pool.active;
  }
}
