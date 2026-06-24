import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';

const RAIN_GEOMETRY = new THREE.CylinderGeometry(0.012, 0.012, 0.5, 3);
const RAIN_COUNT = 900;
const RAIN_RADIUS = 45;
const RAIN_HEIGHT = 30;
const FALL_SPEED = 0.95;

export class RainParticles {
  constructor() {
    this.material = standardMaterial(0xaecbe0, { transparent: true, opacity: 0.35, roughness: 0.2, metalness: 0.1 });
    this.mesh = new THREE.InstancedMesh(RAIN_GEOMETRY, this.material, RAIN_COUNT);
    this.mesh.visible = false;
    this.mesh.frustumCulled = false; // tied to player position every frame; per-instance culling isn't meaningful

    this.drops = [];
    const m = new THREE.Matrix4();
    for (let i = 0; i < RAIN_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * RAIN_RADIUS;
      const drop = {
        x: Math.cos(angle) * r,
        y: Math.random() * RAIN_HEIGHT,
        z: Math.sin(angle) * r
      };
      this.drops.push(drop);
      m.makeTranslation(drop.x, drop.y, drop.z);
      this.mesh.setMatrixAt(i, m);
    }
    this.mesh.instanceMatrix.needsUpdate = true;

    this._tmpMatrix = new THREE.Matrix4();
    this.intensity = 0; // 0 = none, 1 = full storm
  }

  addToScene(scene) {
    scene.add(this.mesh);
  }

  setIntensity(value) {
    this.intensity = Math.max(0, Math.min(1, value));
    this.mesh.visible = this.intensity > 0.02;
    this.material.opacity = 0.1 + this.intensity * 0.35;
  }

  update(dt, viewerX, viewerZ) {
    if (this.intensity <= 0.02) return;
    const speed = FALL_SPEED * (0.6 + this.intensity * 0.6);

    for (let i = 0; i < this.drops.length; i++) {
      const d = this.drops[i];
      d.y -= speed * dt;
      if (d.y < 0) {
        d.y = RAIN_HEIGHT;
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * RAIN_RADIUS;
        d.x = Math.cos(angle) * r;
        d.z = Math.sin(angle) * r;
      }
      this._tmpMatrix.makeTranslation(viewerX + d.x, d.y, viewerZ + d.z);
      this.mesh.setMatrixAt(i, this._tmpMatrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}
