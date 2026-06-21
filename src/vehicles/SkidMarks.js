import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';

export class SkidMarks {
  constructor() {
    this.mat = standardMaterial(0x111111, { roughness: 1, transparent: true, opacity: 0.35 });
    this.marks = [];
    this.maxMarks = 60;
  }

  addMark(scene, x, z) {
    const geo = new THREE.PlaneGeometry(0.3, 0.6);
    const mesh = new THREE.Mesh(geo, this.mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.018, z);
    scene.add(mesh);
    this.marks.push(mesh);
    if (this.marks.length > this.maxMarks) {
      const old = this.marks.shift();
      scene.remove(old);
    }
  }
}
