import * as THREE from 'three';
import { NPC } from './NPC.js';
import { NPCAnimator } from './NPCAnimator.js';
import { NPCAI } from './NPCAI.js';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { PALETTE } from '../config/colors.js';
import { pick } from '../utils/RandomUtils.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export class PoliceNPC extends NPC {
  constructor(x, z) {
    super(x, z, pick(PALETTE.skin), PALETTE.policeUniform, 0x16223f);

    const hatMat = standardMaterial(0x0c1730, { roughness: 0.6 });
    const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.22, 10), hatMat);
    hat.position.y = 1.62;
    applyShadowCasting(hat, true, false);
    this.group.add(hat);

    const badgeMat = standardMaterial(0xd8c24a, { metalness: 0.7, roughness: 0.3, emissive: 0x222200 });
    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.02), badgeMat);
    badge.position.set(0.15, 0.95, 0.18);
    this.group.add(badge);

    this.animator = new NPCAnimator(this.parts);
    this.ai = new NPCAI();
  }
}
