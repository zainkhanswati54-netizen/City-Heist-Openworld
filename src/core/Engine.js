import * as THREE from 'three';
import { SETTINGS } from '../config/settings.js';
import { PALETTE } from '../config/colors.js';
import { isLikelyMobile } from './PlatformDetect.js';

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    const mobile = isLikelyMobile();

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,          // AA is expensive — always off
      powerPreference: 'high-performance',
      precision: 'mediump'       // medium precision = faster on mobile
    });

    // Aggressive pixel ratio cap: 1 on mobile, 1.25 on desktop max
    this.renderer.setPixelRatio(mobile ? 1 : Math.min(window.devicePixelRatio, 1.25));

    // SHADOWS OFF — the shadow pass alone can cost 5–10ms per frame
    this.renderer.shadowMap.enabled = false;

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping; // NoToneMapping = fastest

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(PALETTE.sky.day);
    this.scene.fog = new THREE.Fog(PALETTE.fogDay, SETTINGS.world.fogNear, SETTINGS.world.fogFar);

    // Tight far plane: nothing visible beyond fog anyway
    this.camera = new THREE.PerspectiveCamera(SETTINGS.camera.views.far.fov, 1, 0.5, 200);
    this.camera.position.set(0, 8, 14);

    this._resizeListeners = [];
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const w = this.canvas.clientWidth  || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this._resizeListeners.forEach(fn => fn(w, h));
  }

  onResize(fn) { this._resizeListeners.push(fn); }

  render() { this.renderer.render(this.scene, this.camera); }
}
