import * as THREE from 'three';
import { PALETTE } from '../config/colors.js';
import { SETTINGS } from '../config/settings.js';

export class DayNightCycle {
  constructor(scene, sun, hemi, ambient) {
    this.scene = scene;
    this.sun = sun;
    this.hemi = hemi;
    this.ambient = ambient;
    this.t = 0;
    this._dayColor = new THREE.Color(PALETTE.sky.day);
    this._nightColor = new THREE.Color(PALETTE.sky.night);
    this._fogDay = new THREE.Color(PALETTE.fogDay);
    this._fogNight = new THREE.Color(PALETTE.fogNight);
  }

  update(dt) {
    this.t += dt * SETTINGS.dayNight.cycleSpeed;
    const cycle = (Math.sin(this.t) + 1) / 2;

    const sky = this._dayColor.clone().lerp(this._nightColor, 1 - cycle);
    this.scene.background = sky;
    if (this.scene.fog) {
      this.scene.fog.color = this._fogDay.clone().lerp(this._fogNight, 1 - cycle);
    }

    this.sun.intensity = 0.25 + cycle * 1.15;
    this.hemi.intensity = 0.2 + cycle * 0.5;
    this.ambient.intensity = 0.12 + cycle * 0.25;

    const angle = this.t * 0.3;
    this.sun.position.set(Math.cos(angle) * 80, 60 + Math.sin(angle) * 40, Math.sin(angle) * 80);

    this.isNight = cycle < 0.35;
  }
}
