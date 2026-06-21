import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { PALETTE } from '../config/colors.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export class Wheel {
  constructor() {
    this.group = new THREE.Group();
    const tireMat = standardMaterial(PALETTE.carTire, { roughness: 0.9, metalness: 0 });
    const hubMat = standardMaterial(0xb8bcc2, { metalness: 0.8, roughness: 0.3 });

    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.24, 14), tireMat);
    tire.rotation.z = Math.PI / 2;
    applyShadowCasting(tire, true, false);
    this.group.add(tire);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.26, 8), hubMat);
    hub.rotation.z = Math.PI / 2;
    this.group.add(hub);

    for (let i = 0; i < 5; i++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.16, 0.03), hubMat);
      const angle = (i / 5) * Math.PI * 2;
      spoke.position.set(0.13, Math.cos(angle) * 0.1, Math.sin(angle) * 0.1);
      spoke.rotation.x = angle;
      this.group.add(spoke);
    }

    this.rotationAxis = tire;
  }

  spin(amount) {
    this.group.rotation.x += amount;
  }
}
