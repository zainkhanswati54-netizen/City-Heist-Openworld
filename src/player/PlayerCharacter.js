import * as THREE from 'three';
import { PlayerLimb } from './PlayerLimb.js';
import { PALETTE } from '../config/colors.js';
import { pick } from '../utils/RandomUtils.js';

export class PlayerCharacter {
  constructor() {
    this.group = new THREE.Group();
    const skin = pick(PALETTE.skin);
    this.parts = PlayerLimb.buildBody(skin, 0x2244aa, 0x1a2a4a);
    Object.values(this.parts).forEach(mesh => this.group.add(mesh));
    this.group.position.y = 0.75;
  }
}
