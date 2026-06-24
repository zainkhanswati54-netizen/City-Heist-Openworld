import * as THREE from 'three';

export class LightningFlash {
  constructor(scene, onThunder) {
    this.scene = scene;
    this.onThunder = onThunder;
    this.flashLight = new THREE.PointLight(0xdfe8ff, 0, 200, 1.5);
    this.flashLight.position.set(0, 80, 0);
    scene.add(this.flashLight);
    this.timeSinceLastStrike = 0;
    this.nextStrikeIn = 8 + Math.random() * 12;
    this.flashLife = 0;
  }

  update(dt, stormIntensity, viewerX, viewerZ) {
    this.flashLight.position.x = viewerX;
    this.flashLight.position.z = viewerZ;

    if (this.flashLife > 0) {
      this.flashLife -= dt;
      this.flashLight.intensity = Math.max(0, this.flashLife) * 6;
      if (this.flashLife <= 0) this.flashLight.intensity = 0;
    }

    if (stormIntensity < 0.3) return; // lightning only during a real storm, not light drizzle

    this.timeSinceLastStrike += dt / 60; // dt is in ~frame units (1 = 16.67ms); convert to rough seconds
    if (this.timeSinceLastStrike > this.nextStrikeIn) {
      this.timeSinceLastStrike = 0;
      this.nextStrikeIn = 6 + Math.random() * 14;
      this._strike();
    }
  }

  _strike() {
    this.flashLife = 0.12;
    // Thunder arrives after a delay, simulating distance from the strike.
    const delayMs = 400 + Math.random() * 900;
    setTimeout(() => {
      if (this.onThunder) this.onThunder();
    }, delayMs);
  }
}
