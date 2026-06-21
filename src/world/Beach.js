import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export class Beach {
  constructor(bounds) {
    this.group = new THREE.Group();
    const width = bounds.xMax - bounds.xMin;
    const depth = bounds.zMax - bounds.zMin;
    const cx = (bounds.xMin + bounds.xMax) / 2;
    const cz = (bounds.zMin + bounds.zMax) / 2;

    const sandMat = standardMaterial(0xe0cf9a, { roughness: 0.95, metalness: 0 });
    const sand = new THREE.Mesh(new THREE.PlaneGeometry(width, depth, 24, 24), sandMat);
    sand.rotation.x = -Math.PI / 2;
    sand.position.set(cx, 0.02, cz);
    applyShadowCasting(sand, false, true);

    // subtle dune undulation
    const posAttr = sand.geometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      posAttr.setZ(i, Math.sin(y * 0.05) * 0.15 + Math.random() * 0.05);
    }
    sand.geometry.computeVertexNormals();

    this.group.add(sand);
    this.bounds = bounds;
  }
}
