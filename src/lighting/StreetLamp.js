import * as THREE from 'three';

// Warm sodium-vapour street lamp — no shadows (disabled globally).
// Uses MeshBasicMaterial on the bulb so it glows even without lights.
export class StreetLamp {
  constructor(x, z) {
    this.group = new THREE.Group();

    // ── Pole ─────────────────────────────────────────────────────────────
    const poleMat = new THREE.MeshLambertMaterial({ color: 0x282830 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 5.0, 6), poleMat);
    pole.position.y = 2.5;
    this.group.add(pole);

    // ── Arm ──────────────────────────────────────────────────────────────
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.0, 5), poleMat);
    arm.rotation.z = Math.PI / 2.2;
    arm.position.set(0.38, 4.9, 0);
    this.group.add(arm);

    // ── Lamphead housing ─────────────────────────────────────────────────
    const headMat = new THREE.MeshLambertMaterial({ color: 0x1a1a22 });
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, 0.5), headMat);
    head.position.set(0.72, 4.76, 0);
    this.group.add(head);

    // ── Glowing bulb (always visible, no lighting needed) ────────────────
    this._bulbMat = new THREE.MeshBasicMaterial({ color: 0xffddaa });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), this._bulbMat);
    bulb.position.set(0.72, 4.60, 0);
    this.group.add(bulb);

    // ── Point light — warm orange-white sodium colour ─────────────────────
    this._light = new THREE.PointLight(0xffcc88, 0, 16, 1.8);
    this._light.position.set(0.72, 4.55, 0);
    this.group.add(this._light);

    // ── Ground halo (optional: small emissive circle on ground) ──────────
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffbb66, transparent: true, opacity: 0, side: THREE.FrontSide,
      depthWrite: false
    });
    this._haloMesh = new THREE.Mesh(new THREE.CircleGeometry(3.0, 12), haloMat);
    this._haloMesh.rotation.x = -Math.PI / 2;
    this._haloMesh.position.y = 0.05;
    this.group.add(this._haloMesh);
    this._haloMat = haloMat;

    this.group.position.set(x, 0, z);
  }

  setNight(isNight) {
    this._light.intensity     = isNight ? 2.4 : 0;
    this._bulbMat.color.setHex(isNight ? 0xffcc44 : 0x888870);
    this._haloMat.opacity     = isNight ? 0.09 : 0;
  }
}
