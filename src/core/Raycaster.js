import * as THREE from 'three';

export class RaycastHelper {
  constructor(camera) {
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
  }

  fromCenter(targets) {
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    return this.raycaster.intersectObjects(targets, true);
  }

  closestPoint(targets) {
    const hits = this.fromCenter(targets);
    return hits.length ? hits[0] : null;
  }
}
