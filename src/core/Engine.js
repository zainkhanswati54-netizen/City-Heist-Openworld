import * as THREE from 'three';
import { SETTINGS } from '../config/settings.js';
import { PALETTE } from '../config/colors.js';

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(PALETTE.sky.day);
    this.scene.fog = new THREE.Fog(PALETTE.fogDay, SETTINGS.world.fogNear, SETTINGS.world.fogFar);

    this.camera = new THREE.PerspectiveCamera(SETTINGS.camera.views.far.fov, 1, 0.1, 700);
    this.camera.position.set(0, 8, 14);

    this._resizeListeners = [];
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this._resizeListeners.forEach(fn => fn(w, h));
  }

  onResize(fn) {
    this._resizeListeners.push(fn);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
