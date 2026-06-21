import * as THREE from 'three';

export function createAmbientLights() {
  const hemi = new THREE.HemisphereLight(0xcfe8ff, 0x35402c, 0.55);
  const ambient = new THREE.AmbientLight(0xffffff, 0.25);
  return { hemi, ambient };
}
