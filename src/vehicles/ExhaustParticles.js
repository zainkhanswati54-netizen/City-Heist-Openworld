import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { Pool } from '../utils/Pool.js';

const EXHAUST_GEOMETRY = new THREE.SphereGeometry(0.1, 6, 6);
const BASE_MATERIAL = standardMaterial(0xaaaaaa, { roughness: 1, transparent: true, opacity: 0.4 });

export class ExhaustParticles {
  constructor(carGroup) {
    this.carGroup = carGroup;
    this.timer = 0;
    this.pool = null;
    this._worldPos = new THREE.Vector3();
    this._rearOffset = new THREE.Vector3();
  }

  _ensurePool() {
    if (this.pool) return;
    const scene = this.carGroup.parent;
    this.pool = new Pool(
      () => {
        // Each pooled puff needs its own material instance (cloned once, at creation —
        // not per-emit) since opacity fades independently per particle.
        const mat = BASE_MATERIAL.clone();
        const mesh = new THREE.Mesh(EXHAUST_GEOMETRY, mat);
        mesh.visible = false;
        scene.add(mesh);
        return { mesh, life: 0 };
      },
      (p) => {
        p.mesh.visible = false;
        p.mesh.scale.setScalar(1);
        p.mesh.material.opacity = 0.4;
        p.life = 0;
      },
      8
    );
  }

  update(dt, emitting) {
    this._ensurePool();
    this.timer += dt;
    if (emitting && this.timer > 6) {
      this.timer = 0;
      const p = this.pool.acquire();
      this.carGroup.getWorldPosition(this._worldPos);
      this._rearOffset.set(0, 0.3, -2.1).applyQuaternion(this.carGroup.quaternion);
      p.mesh.position.copy(this._worldPos).add(this._rearOffset);
      p.mesh.visible = true;
      p.mesh.scale.setScalar(1);
      p.mesh.material.opacity = 0.4;
      p.life = 40;
    }

    for (let i = this.pool.active.length - 1; i >= 0; i--) {
      const p = this.pool.active[i];
      p.mesh.position.y += 0.01 * dt;
      p.mesh.scale.multiplyScalar(1.02);
      p.mesh.material.opacity *= 0.95;
      p.life -= dt;
      if (p.life <= 0) this.pool.release(p);
    }
  }
}
