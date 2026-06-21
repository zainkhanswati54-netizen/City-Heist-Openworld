import * as THREE from 'three';
import { SETTINGS } from '../config/settings.js';

export class PlayerCamera {
  constructor(camera, input) {
    this.camera = camera;
    this.input = input;
    this.yaw = 0;
    this.pitch = 0;
    this.viewName = 'far';
  }

  toggleView() {
    this.viewName = this.viewName === 'far' ? 'close' : 'far';
    const view = SETTINGS.camera.views[this.viewName];
    this.camera.fov = view.fov;
    this.camera.updateProjectionMatrix();
    return this.viewName;
  }

  updateLook() {
    if (!this.input.locked) return this.yaw;
    this.yaw -= this.input.mouseDX * 0.0022;
    this.pitch = Math.max(-0.45, Math.min(0.45, this.pitch - this.input.mouseDY * 0.0022));
    return this.yaw;
  }

  follow(target) {
    const view = SETTINGS.camera.views[this.viewName];
    const offset = new THREE.Vector3(
      -Math.sin(this.yaw) * Math.cos(this.pitch) * view.distance,
      view.height + Math.sin(this.pitch) * 5,
      -Math.cos(this.yaw) * Math.cos(this.pitch) * view.distance
    );
    const desired = target.clone().add(offset);
    this.camera.position.lerp(desired, SETTINGS.camera.lerp);
    this.camera.lookAt(target.clone().add(new THREE.Vector3(0, 1.4, 0)));
  }
}
