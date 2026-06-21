import * as THREE from 'three';
import { carPaintMaterial } from '../utils/MaterialFactory.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export class CarDoor {
  constructor(color, side = 1) {
    this.pivot = new THREE.Group();
    const paint = carPaintMaterial(color);

    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 1.3), paint);
    panel.position.set(0, 0, 0.65);
    applyShadowCasting(panel, true, true);
    this.pivot.add(panel);

    this.pivot.position.set(side * 1.0, 0.65, 0.1);
    this.side = side;
    this.isOpen = false;
  }

  attachTo(carGroup) {
    carGroup.add(this.pivot);
  }

  get openAngle() {
    return this.side > 0 ? -Math.PI / 2.2 : Math.PI / 2.2;
  }
}
