import * as THREE from 'three';

export function shade(hex, amount) {
  const c = new THREE.Color(hex);
  if (amount >= 0) {
    c.lerp(new THREE.Color(0xffffff), amount);
  } else {
    c.lerp(new THREE.Color(0x000000), -amount);
  }
  return c.getHex();
}

export function mixColors(hexA, hexB, t) {
  const a = new THREE.Color(hexA);
  const b = new THREE.Color(hexB);
  return a.lerp(b, t).getHex();
}

export function randomVariant(baseHex, range = 0.08) {
  return shade(baseHex, (Math.random() * 2 - 1) * range);
}
