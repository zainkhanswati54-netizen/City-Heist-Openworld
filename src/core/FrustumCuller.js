import * as THREE from 'three';

const _frustum = new THREE.Frustum();
const _projScreenMatrix = new THREE.Matrix4();
const _sphere = new THREE.Sphere();

export class FrustumCuller {
  constructor(camera) {
    this.camera = camera;
    this.lastUpdateFrame = -1;
  }

  updateFrustum() {
    this.camera.updateMatrixWorld();
    _projScreenMatrix.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
    _frustum.setFromProjectionMatrix(_projScreenMatrix);
  }

  // Tests a world position + bounding radius against the current frustum.
  // Cheap sphere test, no need for full mesh bounding boxes for our box/cylinder primitives.
  isVisible(x, y, z, radius) {
    _sphere.center.set(x, y, z);
    _sphere.radius = radius;
    return _frustum.intersectsSphere(_sphere);
  }

  // Convenience helper: cull a list of {mesh, x, z, radius} entries in one pass.
  cullList(entries, defaultRadius = 8) {
    for (const entry of entries) {
      const radius = entry.radius || defaultRadius;
      const y = entry.y ?? 0;
      entry.mesh.visible = this.isVisible(entry.x, y, entry.z, radius);
    }
  }
}
