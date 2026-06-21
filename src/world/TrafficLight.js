import * as THREE from 'three';
import { standardMaterial, emissiveMaterial } from '../utils/MaterialFactory.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export class TrafficLight {
  constructor(x, z) {
    this.group = new THREE.Group();
    const poleMat = standardMaterial(0x2a2a2a, { metalness: 0.6, roughness: 0.4 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 3.4, 8), poleMat);
    pole.position.y = 1.7;
    applyShadowCasting(pole, true, true);
    this.group.add(pole);

    const boxMat = standardMaterial(0x1a1a1a, { roughness: 0.6 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.25), boxMat);
    box.position.y = 3.5;
    applyShadowCasting(box, true, false);
    this.group.add(box);

    this.redMat = emissiveMaterial(0xff2222, 0.2);
    this.yellowMat = emissiveMaterial(0xffcc22, 0.2);
    this.greenMat = emissiveMaterial(0x33dd55, 0.2);

    this.red = new THREE.Mesh(new THREE.CircleGeometry(0.1, 10), this.redMat);
    this.red.position.set(0, 3.75, 0.13);
    this.yellow = new THREE.Mesh(new THREE.CircleGeometry(0.1, 10), this.yellowMat);
    this.yellow.position.set(0, 3.5, 0.13);
    this.green = new THREE.Mesh(new THREE.CircleGeometry(0.1, 10), this.greenMat);
    this.green.position.set(0, 3.25, 0.13);
    this.group.add(this.red, this.yellow, this.green);

    this.group.position.set(x, 0, z);
    this.state = 0;
    this.timer = 0;
  }

  update(dt) {
    this.timer += dt;
    if (this.timer > 120) {
      this.timer = 0;
      this.state = (this.state + 1) % 3;
      this.redMat.emissiveIntensity = this.state === 0 ? 2.2 : 0.15;
      this.yellowMat.emissiveIntensity = this.state === 1 ? 2.2 : 0.15;
      this.greenMat.emissiveIntensity = this.state === 2 ? 2.2 : 0.15;
    }
  }
}
