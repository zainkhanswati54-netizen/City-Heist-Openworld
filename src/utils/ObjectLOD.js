import { distance2D } from './MathUtils.js';

export class ObjectLOD {
  constructor(highDetailDistance = 60, cullDistance = 160) {
    this.highDetailDistance = highDetailDistance;
    this.cullDistance = cullDistance;
  }

  apply(mesh, viewerX, viewerZ, objX, objZ) {
    const dist = distance2D(viewerX, viewerZ, objX, objZ);
    if (dist > this.cullDistance) {
      mesh.visible = false;
      return 'culled';
    }
    mesh.visible = true;
    if (dist > this.highDetailDistance) {
      mesh.castShadow = false;
      return 'low';
    }
    mesh.castShadow = true;
    return 'high';
  }
}
