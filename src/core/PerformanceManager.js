import { ObjectLOD } from '../utils/ObjectLOD.js';
import { isLikelyMobile } from './PlatformDetect.js';
import { FrustumCuller } from './FrustumCuller.js';

export class PerformanceManager {
  constructor(renderer, camera) {
    this.renderer = renderer;
    this.lod = new ObjectLOD();
    this.frustumCuller = camera ? new FrustumCuller(camera) : null;
    this.mobile = isLikelyMobile();
    this.frameTimes = [];
    this.qualityTier = this.mobile ? 'medium' : 'high';
    this._applyTier();
  }

  _applyTier() {
    if (this.qualityTier === 'low') {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = false;
      this.lod = new ObjectLOD(35, 90);
    } else if (this.qualityTier === 'medium') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      this.renderer.shadowMap.enabled = true;
      this.lod = new ObjectLOD(45, 120);
    } else {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.lod = new ObjectLOD(60, 160);
    }
  }

  trackFrame(dt) {
    this.frameTimes.push(dt);
    if (this.frameTimes.length > 60) this.frameTimes.shift();
    if (this.frameTimes.length === 60) {
      const avg = this.frameTimes.reduce((a, b) => a + b, 0) / 60;
      if (avg > 2.2 && this.qualityTier !== 'low') {
        this.qualityTier = this.qualityTier === 'high' ? 'medium' : 'low';
        this._applyTier();
      }
    }
  }

  // Combines distance-based LOD/culling with real camera-frustum visibility.
  // Distance culling catches "too far to matter"; frustum culling catches
  // "close, but behind/beside the camera" — buildings the player walked past, for example.
  applyLOD(items, viewerX, viewerZ) {
    if (this.frustumCuller) this.frustumCuller.updateFrustum();

    items.forEach(item => {
      const distState = this.lod.apply(item.mesh, viewerX, viewerZ, item.x, item.z);
      if (distState === 'culled') return; // already hidden by distance, skip frustum test

      if (this.frustumCuller) {
        const radius = item.radius || Math.max(item.w || 10, item.d || 10);
        const inView = this.frustumCuller.isVisible(item.x, (item.height || 10) / 2, item.z, radius);
        item.mesh.visible = inView;
      }
    });
  }
}
