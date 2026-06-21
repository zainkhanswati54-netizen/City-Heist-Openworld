import * as THREE from 'three';
import { emissiveMaterial } from '../utils/MaterialFactory.js';
import { PALETTE } from '../config/colors.js';

export class RoadMarkings {
  constructor() {
    this.group = new THREE.Group();
    this.lineMat = emissiveMaterial(PALETTE.roadLine, 0.25);
  }

  addDashedLine(x, z, length, rotationY = 0, dashLen = 2, gapLen = 1.5) {
    const totalUnit = dashLen + gapLen;
    const count = Math.floor(length / totalUnit);
    for (let i = 0; i < count; i++) {
      const offset = -length / 2 + i * totalUnit + dashLen / 2;
      const geo = new THREE.PlaneGeometry(0.18, dashLen);
      const mesh = new THREE.Mesh(geo, this.lineMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.z = rotationY;
      const dx = Math.sin(rotationY) * offset;
      const dz = Math.cos(rotationY) * offset;
      mesh.position.set(x + dx, 0.02, z + dz);
      this.group.add(mesh);
    }
  }

  addEdgeLines(x, z, roadWidth, length, rotationY = 0) {
    [-1, 1].forEach(side => {
      const geo = new THREE.PlaneGeometry(0.12, length);
      const mesh = new THREE.Mesh(geo, this.lineMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.z = rotationY;
      const offset = side * (roadWidth / 2 - 0.3);
      const dx = Math.cos(rotationY) * offset;
      const dz = -Math.sin(rotationY) * offset;
      mesh.position.set(x + dx, 0.02, z + dz);
      this.group.add(mesh);
    });
  }
}
