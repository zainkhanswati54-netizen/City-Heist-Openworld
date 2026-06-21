import * as THREE from 'three';

export function createSunLight() {
  const sun = new THREE.DirectionalLight(0xfff2d8, 1.3);
  sun.position.set(60, 90, 40);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 260;
  sun.shadow.camera.left = -110;
  sun.shadow.camera.right = 110;
  sun.shadow.camera.top = 110;
  sun.shadow.camera.bottom = -110;
  sun.shadow.bias = -0.0015;
  sun.shadow.normalBias = 0.02;
  return sun;
}
