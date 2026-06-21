import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { randomVariant } from '../utils/ColorUtils.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export class Mountain {
  constructor(x, z, baseRadius, height) {
    this.group = new THREE.Group();
    const rockColor = randomVariant(0x6b6358, 0.08);
    const rockMat = standardMaterial(rockColor, { roughness: 0.95, metalness: 0.02 });

    const peak = new THREE.Mesh(new THREE.ConeGeometry(baseRadius, height, 7), rockMat);
    peak.position.y = height / 2;
    applyShadowCasting(peak, true, true);
    this.group.add(peak);

    // smaller shoulder peaks for a less perfectly-conical silhouette
    const shoulderCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < shoulderCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = baseRadius * (0.5 + Math.random() * 0.3);
      const shHeight = height * (0.4 + Math.random() * 0.3);
      const shoulder = new THREE.Mesh(new THREE.ConeGeometry(baseRadius * 0.5, shHeight, 6), rockMat);
      shoulder.position.set(Math.cos(angle) * dist, shHeight / 2, Math.sin(angle) * dist);
      applyShadowCasting(shoulder, true, true);
      this.group.add(shoulder);
    }

    if (height > 14) {
      const snowMat = standardMaterial(0xf2f4f6, { roughness: 0.9 });
      const cap = new THREE.Mesh(new THREE.ConeGeometry(baseRadius * 0.3, height * 0.25, 7), snowMat);
      cap.position.y = height - (height * 0.25) / 2 + 0.5;
      applyShadowCasting(cap, true, false);
      this.group.add(cap);
    }

    this.group.position.set(x, 0, z);
    this.x = x;
    this.z = z;
    this.radius = baseRadius;
  }
}
