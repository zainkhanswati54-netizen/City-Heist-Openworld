import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export class TrafficSign {
  static stopSign(x, z) {
    const group = new THREE.Group();
    const poleMat = standardMaterial(0x888888, { metalness: 0.5, roughness: 0.5 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 6), poleMat);
    pole.position.y = 1.1;
    applyShadowCasting(pole, true, false);
    group.add(pole);

    const signMat = standardMaterial(0xc0392b, { roughness: 0.45, metalness: 0.1 });
    const sign = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.04, 8), signMat);
    sign.rotation.x = Math.PI / 2;
    sign.position.y = 2.15;
    applyShadowCasting(sign, true, false);
    group.add(sign);

    group.position.set(x, 0, z);
    return group;
  }

  static speedLimit(x, z, value = 30) {
    const group = new THREE.Group();
    const poleMat = standardMaterial(0x999999, { metalness: 0.5, roughness: 0.5 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.4, 6), poleMat);
    pole.position.y = 1.2;
    applyShadowCasting(pole, true, false);
    group.add(pole);

    const signMat = standardMaterial(0xf2f2f2, { roughness: 0.5 });
    const sign = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.03), signMat);
    sign.position.y = 2.4;
    applyShadowCasting(sign, true, false);
    group.add(sign);

    group.position.set(x, 0, z);
    group.userData.speedValue = value;
    return group;
  }
}
