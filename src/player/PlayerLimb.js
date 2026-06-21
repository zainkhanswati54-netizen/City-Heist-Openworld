import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export class PlayerLimb {
  static box(width, height, depth, color) {
    const mat = standardMaterial(color, { roughness: 0.75 });
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat);
    applyShadowCasting(mesh, true, true);
    return mesh;
  }

  static buildBody(skinColor, clothColor, pantsColor) {
    const parts = {};
    parts.head = PlayerLimb.box(0.45, 0.45, 0.45, skinColor);
    parts.head.position.y = 1.35;

    parts.torso = PlayerLimb.box(0.55, 0.85, 0.35, clothColor);
    parts.torso.position.y = 0.75;

    parts.leftArm = PlayerLimb.box(0.18, 0.65, 0.18, clothColor);
    parts.leftArm.position.set(0.38, 0.75, 0);

    parts.rightArm = PlayerLimb.box(0.18, 0.65, 0.18, clothColor);
    parts.rightArm.position.set(-0.38, 0.75, 0);

    parts.leftLeg = PlayerLimb.box(0.22, 0.75, 0.22, pantsColor);
    parts.leftLeg.position.set(0.16, 0.0, 0);

    parts.rightLeg = PlayerLimb.box(0.22, 0.75, 0.22, pantsColor);
    parts.rightLeg.position.set(-0.16, 0.0, 0);

    return parts;
  }
}
