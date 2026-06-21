import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { shade } from '../utils/ColorUtils.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

export function addFacadeDetails(buildingGroup, width, height, depth, color) {
  const pilasterMat = standardMaterial(shade(color, -0.1), { roughness: 0.85 });
  const pilasterCount = Math.max(2, Math.floor(width / 3));
  for (let i = 0; i <= pilasterCount; i++) {
    const px = -width / 2 + (width / pilasterCount) * i;
    const pilaster = new THREE.Mesh(new THREE.BoxGeometry(0.15, height, 0.1), pilasterMat);
    pilaster.position.set(px, height / 2, depth / 2 + 0.05);
    applyShadowCasting(pilaster, true, false);
    buildingGroup.add(pilaster);
  }

  const awningMat = standardMaterial(0x7a2e2e, { roughness: 0.7 });
  const awning = new THREE.Mesh(new THREE.BoxGeometry(width * 0.5, 0.15, 1.0), awningMat);
  awning.position.set(0, 2.3, depth / 2 + 0.5);
  awning.rotation.x = -0.15;
  applyShadowCasting(awning, true, false);
  buildingGroup.add(awning);

  const corniceMat = standardMaterial(shade(color, -0.35), { roughness: 0.8 });
  const cornice = new THREE.Mesh(new THREE.BoxGeometry(width + 0.5, 0.4, depth + 0.5), corniceMat);
  cornice.position.y = height;
  applyShadowCasting(cornice, true, false);
  buildingGroup.add(cornice);
}
