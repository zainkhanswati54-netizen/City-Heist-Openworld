import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export class StreetProp {
  static bench(x, z) {
    const group = new THREE.Group();
    const woodMat = standardMaterial(0x6b4a30, { roughness: 0.85 });
    const metalMat = standardMaterial(0x2a2a2a, { metalness: 0.6, roughness: 0.4 });

    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.5), woodMat);
    seat.position.y = 0.45;
    applyShadowCasting(seat, true, true);
    group.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 0.06), woodMat);
    back.position.set(0, 0.7, -0.22);
    applyShadowCasting(back, true, false);
    group.add(back);

    [-0.65, 0.65].forEach(lx => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.5), metalMat);
      leg.position.set(lx, 0.22, 0);
      applyShadowCasting(leg, true, false);
      group.add(leg);
    });

    group.position.set(x, 0, z);
    return group;
  }

  static trashcan(x, z) {
    const group = new THREE.Group();
    const mat = standardMaterial(0x3a4a3a, { metalness: 0.3, roughness: 0.7 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.7, 10), mat);
    body.position.y = 0.35;
    applyShadowCasting(body, true, true);
    group.add(body);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.05, 10), mat);
    lid.position.y = 0.72;
    group.add(lid);
    group.position.set(x, 0, z);
    return group;
  }

  static hydrant(x, z) {
    const group = new THREE.Group();
    const mat = standardMaterial(0xb02a2a, { roughness: 0.5, metalness: 0.2 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.6, 8), mat);
    body.position.y = 0.3;
    applyShadowCasting(body, true, true);
    group.add(body);
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), mat);
    cap.position.y = 0.62;
    group.add(cap);
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.22, 6), mat);
    nozzle.rotation.z = Math.PI / 2;
    nozzle.position.set(0.22, 0.35, 0);
    group.add(nozzle);
    group.position.set(x, 0, z);
    return group;
  }
}
