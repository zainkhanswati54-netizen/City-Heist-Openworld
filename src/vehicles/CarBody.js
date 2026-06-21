import * as THREE from 'three';
import { carPaintMaterial, standardMaterial, glassMaterial } from '../utils/MaterialFactory.js';
import { PALETTE } from '../config/colors.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export class CarBody {
  constructor(color) {
    this.group = new THREE.Group();
    const paint = carPaintMaterial(color);
    const chromeMat = standardMaterial(PALETTE.carChrome, { metalness: 0.85, roughness: 0.25 });
    const glass = glassMaterial(PALETTE.carGlass);

    const lower = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.5, 4.0), paint);
    lower.position.y = 0.45;
    applyShadowCasting(lower, true, true);
    this.group.add(lower);

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.55, 2.1), paint);
    cabin.position.set(0, 0.95, -0.15);
    applyShadowCasting(cabin, true, true);
    this.group.add(cabin);

    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 1.9), glass);
    windshield.position.set(0, 0.97, -0.15);
    this.group.add(windshield);

    const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.3, 0.3), chromeMat);
    frontBumper.position.set(0, 0.3, 2.0);
    applyShadowCasting(frontBumper, true, false);
    this.group.add(frontBumper);

    const rearBumper = frontBumper.clone();
    rearBumper.position.set(0, 0.3, -2.0);
    this.group.add(rearBumper);

    [-1, 1].forEach(side => {
      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.15, 0.25), paint);
      mirror.position.set(side * 1.0, 0.95, 0.6);
      applyShadowCasting(mirror, true, false);
      this.group.add(mirror);
    });

    const grille = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 0.05), standardMaterial(0x111111, { roughness: 0.5 }));
    grille.position.set(0, 0.5, 2.02);
    this.group.add(grille);
  }
}
