import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { Pool } from '../utils/Pool.js';

const DUST_GEOMETRY = new THREE.CircleGeometry(0.18, 6);
const BASE_MATERIAL = standardMaterial(0xc9c2a8, { transparent: true, opacity: 0.35, roughness: 1 });

export class FootstepDust {
  constructor() {
    this.timer = 0;
    this.pool = null;
  }

  _ensurePool(scene) {
    if (this.pool) return;
    this.pool = new Pool(
      () => {
        const mat = BASE_MATERIAL.clone();
        const mesh = new THREE.Mesh(DUST_GEOMETRY, mat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.visible = false;
        scene.add(mesh);
        return { mesh, life: 0 };
      },
      (p) => {
        p.mesh.visible = false;
        p.mesh.scale.setScalar(1);
        p.mesh.material.opacity = 0.35;
        p.life = 0;
      },
      10
    );
  }

  update(dt, scene, x, z, running) {
    this._ensurePool(scene);
    this.timer += dt;
    if (running && this.timer > 8) {
      this.timer = 0;
      const p = this.pool.acquire();
      p.mesh.position.set(x, 0.03, z);
      p.mesh.visible = true;
      p.mesh.scale.setScalar(1);
      p.mesh.material.opacity = 0.35;
      p.life = 25;
    }
    for (let i = this.pool.active.length - 1; i >= 0; i--) {
      const p = this.pool.active[i];
      p.mesh.scale.multiplyScalar(1.03);
      p.mesh.material.opacity *= 0.92;
      p.life -= dt;
      if (p.life <= 0) this.pool.release(p);
    }
  }
}
