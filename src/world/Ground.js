import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { DISTRICT_LAYOUT, DISTRICT_THEME, DISTRICTS } from '../config/districtConfig.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';

function quadrantMesh(bounds, color) {
  const width = bounds.xMax - bounds.xMin;
  const depth = bounds.zMax - bounds.zMin;
  const cx = (bounds.xMin + bounds.xMax) / 2;
  const cz = (bounds.zMin + bounds.zMax) / 2;
  const geo = new THREE.PlaneGeometry(width, depth, 1, 1);
  const mat = standardMaterial(color, { roughness: 0.95, metalness: 0 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(cx, 0, cz);
  applyShadowCasting(mesh, false, true);
  return mesh;
}

export function createGround() {
  const group = new THREE.Group();
  group.add(quadrantMesh(DISTRICT_LAYOUT.cityBounds, DISTRICT_THEME[DISTRICTS.CITY].groundColor));
  group.add(quadrantMesh(DISTRICT_LAYOUT.suburbBounds, DISTRICT_THEME[DISTRICTS.SUBURBS].groundColor));
  group.add(quadrantMesh(DISTRICT_LAYOUT.mountainBounds, DISTRICT_THEME[DISTRICTS.MOUNTAINS].groundColor));
  // Beach quadrant ground is handled by Beach.js (sand), so it is intentionally not added here.
  return group;
}

