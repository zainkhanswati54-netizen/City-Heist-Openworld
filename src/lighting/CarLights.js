import * as THREE from 'three';
import { emissiveMaterial } from '../utils/MaterialFactory.js';

export class CarLights {
  constructor(carGroup) {
    this.group = new THREE.Group();

    const headMat = emissiveMaterial(0xfff6d8, 1.2);
    const tailMat = emissiveMaterial(0xff2222, 1.0);

    this.headLeft = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.05), headMat);
    this.headLeft.position.set(0.62, 0.55, 1.98);
    this.headRight = this.headLeft.clone();
    this.headRight.position.set(-0.62, 0.55, 1.98);

    this.tailLeft = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.14, 0.05), tailMat);
    this.tailLeft.position.set(0.62, 0.55, -1.98);
    this.tailRight = this.tailLeft.clone();
    this.tailRight.position.set(-0.62, 0.55, -1.98);

    this.group.add(this.headLeft, this.headRight, this.tailLeft, this.tailRight);

    this.spotLeft = new THREE.SpotLight(0xfff6d8, 0, 16, Math.PI / 6, 0.5, 1.2);
    this.spotLeft.position.copy(this.headLeft.position);
    this.spotRight = this.spotLeft.clone();
    this.spotRight.position.copy(this.headRight.position);
    this.group.add(this.spotLeft, this.spotRight);

    this.target = new THREE.Object3D();
    this.target.position.set(0, 0, 8);
    this.group.add(this.target);
    this.spotLeft.target = this.target;
    this.spotRight.target = this.target;

    carGroup.add(this.group);
  }

  setNight(isNight) {
    this.spotLeft.intensity = isNight ? 2.2 : 0;
    this.spotRight.intensity = isNight ? 2.2 : 0;
  }
}
