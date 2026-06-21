import * as THREE from 'three';
import { emissiveMaterial } from '../utils/MaterialFactory.js';
import { Pool } from '../utils/Pool.js';

const IMPACT_GEOMETRY = new THREE.SphereGeometry(0.04, 4, 4);
const PARTICLES_PER_IMPACT = 5;

export class BulletImpactParticles {
  constructor() {
    this.mat = emissiveMaterial(0xffd27a, 1.5);
    this.pool = null;
  }

  _ensurePool(scene) {
    if (this.pool) return;
    this.pool = new Pool(
      () => {
        const mesh = new THREE.Mesh(IMPACT_GEOMETRY, this.mat);
        mesh.visible = false;
        scene.add(mesh);
        return { mesh, vel: new THREE.Vector3(), life: 0 };
      },
      (p) => {
        p.mesh.visible = false;
        p.life = 0;
      },
      30
    );
  }

  spawn(scene, position) {
    this._ensurePool(scene);
    for (let i = 0; i < PARTICLES_PER_IMPACT; i++) {
      const p = this.pool.acquire();
      p.mesh.position.copy(position);
      p.mesh.visible = true;
      p.vel.set((Math.random() - 0.5), Math.random() * 0.6, (Math.random() - 0.5)).normalize().multiplyScalar(0.08);
      p.life = 18;
    }
  }

  update(dt) {
    if (!this.pool) return;
    for (let i = this.pool.active.length - 1; i >= 0; i--) {
      const p = this.pool.active[i];
      p.mesh.position.addScaledVector(p.vel, dt);
      p.vel.y -= 0.004 * dt;
      p.life -= dt;
      if (p.life <= 0) this.pool.release(p);
    }
  }
}
