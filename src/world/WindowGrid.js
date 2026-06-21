import * as THREE from 'three';
import { emissiveMaterial, standardMaterial } from '../utils/MaterialFactory.js';
import { PALETTE } from '../config/colors.js';

export class WindowGrid {
  constructor() {
    this.litMat = emissiveMaterial(PALETTE.windowLit, 0.9);
    this.darkMat = standardMaterial(PALETTE.windowDark, { roughness: 0.3, metalness: 0.2 });
    this.frameMat = standardMaterial(0x1a1a1a, { roughness: 0.6 });
    this.instances = [];
  }

  applyToFace(buildingGroup, width, height, depth, faceOffset, axis) {
    const floorHeight = 3.4;
    const floors = Math.max(1, Math.floor((height - 1.5) / floorHeight));
    const cols = Math.max(1, Math.floor(width / 2.2));

    for (let f = 1; f <= floors; f++) {
      for (let c = 0; c < cols; c++) {
        const lit = Math.random() > 0.55;
        const mat = lit ? this.litMat : this.darkMat;
        const win = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.5), mat);
        const frame = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.7), this.frameMat);
        const colX = -width / 2 + (width / cols) * c + width / cols / 2;
        const y = f * floorHeight;

        if (axis === 'z') {
          frame.position.set(colX, y, faceOffset);
          win.position.set(colX, y, faceOffset + 0.01);
        } else {
          frame.rotation.y = Math.PI / 2;
          win.rotation.y = Math.PI / 2;
          frame.position.set(faceOffset, y, colX);
          win.position.set(faceOffset + 0.01, y, colX);
        }
        buildingGroup.add(frame);
        buildingGroup.add(win);
        this.instances.push({ mesh: win, lit });
      }
    }
  }

  flickerRandom() {
    if (!this.instances.length) return;
    const idx = Math.floor(Math.random() * this.instances.length);
    const inst = this.instances[idx];
    inst.mesh.material = inst.lit ? this.darkMat : this.litMat;
    inst.lit = !inst.lit;
  }
}
