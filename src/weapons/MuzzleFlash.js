import * as THREE from 'three';
import { emissiveMaterial } from '../utils/MaterialFactory.js';
import { PALETTE } from '../config/colors.js';
import { Pool } from '../utils/Pool.js';

const FLASH_GEOMETRY = new THREE.SphereGeometry(0.18, 8, 8);

export class MuzzleFlash {
  constructor() {
    this.mat = emissiveMaterial(PALETTE.muzzleFlash, 3);
    this.scenePool = null;
    this.pool = null;
  }

  _ensurePool(scene) {
    if (this.pool) return;
    this.scenePool = scene;
    this.pool = new Pool(
      () => {
        const mesh = new THREE.Mesh(FLASH_GEOMETRY, this.mat);
        mesh.visible = false;
        mesh.scale.setScalar(1);
        scene.add(mesh);
        return { mesh, life: 0 };
      },
      (f) => {
        f.mesh.visible = false;
        f.mesh.scale.setScalar(1);
        f.life = 0;
      },
      12
    );
  }

  spawn(scene, position) {
    this._ensurePool(scene);
    const f = this.pool.acquire();
    f.mesh.position.copy(position);
    f.mesh.visible = true;
    f.mesh.scale.setScalar(1);
    f.life = 4;
  }

  update(dt) {
    if (!this.pool) return;
    for (let i = this.pool.active.length - 1; i >= 0; i--) {
      const f = this.pool.active[i];
      f.life -= dt;
      f.mesh.scale.multiplyScalar(0.85);
      if (f.life <= 0) this.pool.release(f);
    }
  }
}
