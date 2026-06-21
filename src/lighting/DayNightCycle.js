import * as THREE from 'three';
import { PALETTE } from '../config/colors.js';
import { SETTINGS } from '../config/settings.js';

export class DayNightCycle {
  constructor(scene, sun, hemi, ambient) {
    this.scene   = scene;
    this.sun     = sun;
    this.hemi    = hemi;
    this.ambient = ambient;
    this.t       = 0;
    this.cycle   = 1; // exposed so SkyDome can read it
    this._dayColor   = new THREE.Color(PALETTE.sky.day);
    this._nightColor = new THREE.Color(PALETTE.sky.night);
    this._fogDay     = new THREE.Color(PALETTE.fogDay);
    this._fogNight   = new THREE.Color(PALETTE.fogNight);
  }

  update(dt) {
    this.t += dt * SETTINGS.dayNight.cycleSpeed;
    this.cycle = (Math.sin(this.t) + 1) / 2;

    // Only set background when SkyDome is NOT present (SkyDome overrides background)
    if (!this._hasSkyDome) {
      const sky = this._dayColor.clone().lerp(this._nightColor, 1 - this.cycle);
      this.scene.background = sky;
    }

    if (this.scene.fog) {
      this.scene.fog.color = this._fogDay.clone().lerp(this._fogNight, 1 - this.cycle);
    }

    this.sun.intensity    = 0.25 + this.cycle * 1.15;
    this.hemi.intensity   = 0.20 + this.cycle * 0.50;
    this.ambient.intensity = 0.12 + this.cycle * 0.25;

    const angle = this.t * 0.3;
    this.sun.position.set(
      Math.cos(angle) * 80,
      60 + Math.sin(angle) * 40,
      Math.sin(angle) * 80
    );

    this.isNight = this.cycle < 0.35;
  }

  /** Call once if a SkyDome is being used so background isn't overwritten. */
  useSkyDome() { this._hasSkyDome = true; }
}
