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
      antialias: !mobile,           // no AA on mobile — huge GPU win
      powerPreference: 'high-performance'
    });

    // Cap pixel ratio: 1 on mobile, 1.5 on desktop (not 2)
    this.renderer.setPixelRatio(mobile ? 1 : Math.min(window.devicePixelRatio, 1.5));

    // PCFShadowMap is ~2× faster than PCFSoftShadowMap
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(PALETTE.sky.day);
    this.scene.fog = new THREE.Fog(PALETTE.fogDay, SETTINGS.world.fogNear, SETTINGS.world.fogFar);

    // Near/far: 0.5–300 is enough for this world, keeps depth buffer precision high
    this.camera = new THREE.PerspectiveCamera(SETTINGS.camera.views.far.fov, 1, 0.5, 350);
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
