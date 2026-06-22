import * as THREE from 'three';
import { randomVariant } from '../utils/ColorUtils.js';

// ONE draw call per building — single BoxGeometry, single material.
// Previously 5–6 meshes per building (985+ draw calls for 197 buildings).
// Now 197 draw calls total — a 5× reduction in building draw calls alone.
export class Building {
  constructor(x, z, width, height, depth, baseColor) {
    this.group = new THREE.Group();
    const color = randomVariant(baseColor, 0.06);

    const mat = new THREE.MeshLambertMaterial({ color });  // Lambert = no specular = fast
    const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat);
    body.position.y = height / 2;
    // No shadows — shadow pass disabled globally
    this.group.add(body);

    this.group.position.set(x, 0, z);
    this.color = color;
    this.dims  = { width, height, depth, x, z };
  }
}
