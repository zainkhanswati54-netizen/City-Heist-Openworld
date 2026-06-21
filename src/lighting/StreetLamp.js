import * as THREE from 'three';
import { standardMaterial, emissiveMaterial } from '../utils/MaterialFactory.js';
import { PALETTE } from '../config/colors.js';

export class StreetLamp {
  constructor(x, z) {
    this.group = new THREE.Group();

    const poleMat = standardMaterial(0x2a2a2e, { metalness: 0.6, roughness: 0.4 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 4.2, 8), poleMat);
    pole.position.y = 2.1;
    pole.castShadow = true;
    this.group.add(pole);

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6), poleMat);
    arm.rotation.z = Math.PI / 2.4;
    arm.position.set(0.3, 4.05, 0);
    this.group.add(arm);

    const bulbMat = emissiveMaterial(PALETTE.lampGlowDay, 0.6);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), bulbMat);
    bulb.position.set(0.6, 3.95, 0);
    this.group.add(bulb);
    this.bulbMat = bulbMat;

    this.light = new THREE.PointLight(PALETTE.lampGlowNight, 0, 9, 2);
    this.light.position.set(0.6, 3.9, 0);
    this.group.add(this.light);

    this.group.position.set(x, 0, z);
  }

  setNight(isNight) {
    this.light.intensity = isNight ? 1.4 : 0;
    this.bulbMat.emissiveIntensity = isNight ? 1.8 : 0.3;
  }
}
