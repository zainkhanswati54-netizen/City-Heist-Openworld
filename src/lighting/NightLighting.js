import * as THREE from 'three';
import { emissiveMaterial } from '../utils/MaterialFactory.js';
import { pick } from '../utils/RandomUtils.js';

const NEON_COLORS = [0xff3b8d, 0x3bd0ff, 0xffd23b, 0x7a3bff, 0x3bff8d];

export class NightLighting {
  constructor() {
    this.signs = [];
    this.isNight = false;
  }

  attachToBuilding(buildingGroup, width, height, depth) {
    if (Math.random() > 0.45) return;
    const color = pick(NEON_COLORS);
    const mat = emissiveMaterial(color, 0.1);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.6, 1.0), mat);
    sign.position.set(0, height * 0.4, depth / 2 + 0.1);
    buildingGroup.add(sign);
    this.signs.push({ mesh: sign, mat, baseIntensity: 2.0 + Math.random() * 1.5, flickering: false });
  }

  setNight(isNight) {
    if (this.isNight === isNight) return;
    this.isNight = isNight;
    this.signs.forEach(s => {
      s.mat.emissiveIntensity = isNight ? s.baseIntensity : 0.05;
    });
  }

  flicker(dt) {
    if (!this.isNight) return;
    if (Math.random() < 0.003 && this.signs.length) {
      const s = pick(this.signs);
      if (s.flickering) return;
      s.flickering = true;
      s.mat.emissiveIntensity = s.baseIntensity * 0.3;
      setTimeout(() => {
        s.mat.emissiveIntensity = s.baseIntensity;
        s.flickering = false;
      }, 90);
    }
  }
}
