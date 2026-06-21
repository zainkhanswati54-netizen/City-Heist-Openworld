import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export class PalmTree {
  constructor(x, z) {
    this.group = new THREE.Group();

    const trunkMat = standardMaterial(0x9a7a4a, { roughness: 0.85 });
    const trunkCurveSegments = 5;
    let lastPos = new THREE.Vector3(0, 0, 0);
    let lean = (Math.random() - 0.5) * 0.3;
    for (let i = 0; i < trunkCurveSegments; i++) {
      const segH = 0.9;
      const seg = new THREE.Mesh(new THREE.CylinderGeometry(0.16 - i * 0.015, 0.18 - i * 0.015, segH, 6), trunkMat);
      seg.position.set(lastPos.x + Math.sin(lean * i) * 0.15, lastPos.y + segH / 2, lastPos.z);
      seg.rotation.z = lean * 0.4;
      applyShadowCasting(seg, true, true);
      this.group.add(seg);
      lastPos = new THREE.Vector3(seg.position.x + Math.sin(lean * i) * 0.15, lastPos.y + segH, lastPos.z);
    }

    const leafMat = standardMaterial(0x3a8f3a, { roughness: 0.8 });
    const frondCount = 6;
    for (let i = 0; i < frondCount; i++) {
      const angle = (i / frondCount) * Math.PI * 2;
      const frond = new THREE.Mesh(new THREE.ConeGeometry(0.25, 2.2, 4), leafMat);
      frond.position.set(lastPos.x, lastPos.y, lastPos.z);
      frond.rotation.z = Math.PI / 2.3;
      frond.rotation.y = angle;
      frond.position.x += Math.cos(angle) * 0.8;
      frond.position.z += Math.sin(angle) * 0.8;
      applyShadowCasting(frond, true, false);
      this.group.add(frond);
    }

    this.group.position.set(x, 0, z);
    this.group.scale.setScalar(0.9 + Math.random() * 0.3);
  }
}
