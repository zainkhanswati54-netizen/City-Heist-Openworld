import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { SETTINGS } from '../config/settings.js';

export class NPCHealthBar {
  constructor(npcGroup) {
    this.group = new THREE.Group();
    this.bgMat = standardMaterial(0x222222, { roughness: 1 });
    this.fillMat = standardMaterial(0xdd3333, { roughness: 0.6, emissive: 0x440000 });

    this.bg = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.08), this.bgMat);
    this.fill = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.06), this.fillMat);
    this.fill.position.z = 0.001;

    this.group.add(this.bg, this.fill);
    this.group.position.y = 1.9;
    npcGroup.add(this.group);
    this.maxHp = SETTINGS.npc.maxHealth;
  }

  setHealth(hp) {
    const ratio = Math.max(0, hp / this.maxHp);
    this.fill.scale.x = ratio;
    this.fill.position.x = -(1 - ratio) * 0.34;
  }

  faceCamera(camera) {
    this.group.quaternion.copy(camera.quaternion);
  }
}
