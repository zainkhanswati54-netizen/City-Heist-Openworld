import * as THREE from 'three';
import { pick } from '../utils/RandomUtils.js';

// Neon sign colours (shop fronts, rooftop ads)
const NEON = [0xff2277, 0x22ccff, 0xffcc00, 0x8833ff, 0x33ff99, 0xff6600];

// Warm window light colours (interior light)
const WIN = [0xffe880, 0xffd050, 0xfffae0, 0xfff0b0, 0xaaccff];

export class NightLighting {
  constructor() {
    this._windows = [];  // { mat, baseOpacity }
    this._signs   = [];  // { mat, baseOpacity, flickering }
    this.isNight  = false;
  }

  /**
   * Attach lit-window planes + optional neon sign to a building group.
   * Called once per building during city construction.
   */
  attachToBuilding(group, width, height, depth) {
    const winColor = pick(WIN);

    // ── Front-face window wash ────────────────────────────────────────────
    const frontMat = new THREE.MeshBasicMaterial({
      color: winColor, transparent: true, opacity: 0, side: THREE.FrontSide,
      depthWrite: false
    });
    const front = new THREE.Mesh(
      new THREE.PlaneGeometry(width * 0.84, height * 0.72), frontMat
    );
    front.position.set(0, height * 0.46, depth / 2 + 0.06);
    group.add(front);
    const baseOpacity = 0.52 + Math.random() * 0.30;
    this._windows.push({ mat: frontMat, baseOpacity });

    // ── Side-face window wash (half of buildings) ─────────────────────────
    if (Math.random() > 0.45) {
      const sideMat = new THREE.MeshBasicMaterial({
        color: winColor, transparent: true, opacity: 0, side: THREE.FrontSide,
        depthWrite: false
      });
      const side = new THREE.Mesh(
        new THREE.PlaneGeometry(depth * 0.84, height * 0.72), sideMat
      );
      side.position.set(-(width / 2 + 0.06), height * 0.46, 0);
      side.rotation.y = Math.PI / 2;
      group.add(side);
      this._windows.push({ mat: sideMat, baseOpacity: baseOpacity * 0.65 });
    }

    // ── Neon sign (60 % of buildings) ────────────────────────────────────
    if (Math.random() > 0.40) {
      const neonColor = pick(NEON);
      const neonMat = new THREE.MeshBasicMaterial({
        color: neonColor, transparent: true, opacity: 0,
        depthWrite: false
      });
      const signW = Math.min(width * 0.55, 5.5);
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(signW, 0.9), neonMat);
      sign.position.set(0, Math.min(height * 0.14, 2.8), depth / 2 + 0.12);
      group.add(sign);
      const neonOpacity = 0.85 + Math.random() * 0.70;
      this._signs.push({ mat: neonMat, baseOpacity: neonOpacity, flickering: false });
    }
  }

  setNight(isNight) {
    if (this.isNight === isNight) return;
    this.isNight = isNight;
    this._windows.forEach(w => { w.mat.opacity = isNight ? w.baseOpacity : 0; });
    this._signs.forEach(s => { s.mat.opacity = isNight ? s.baseOpacity : 0; });
  }

  flicker(dt) {
    if (!this.isNight || !this._signs.length) return;
    if (Math.random() < 0.005) {
      const s = this._signs[Math.floor(Math.random() * this._signs.length)];
      if (s.flickering) return;
      s.flickering = true;
      const prev = s.mat.opacity;
      s.mat.opacity = s.baseOpacity * 0.15;
      setTimeout(() => {
        s.mat.opacity = prev;
        s.flickering = false;
      }, 60 + Math.random() * 140);
    }
  }
}
