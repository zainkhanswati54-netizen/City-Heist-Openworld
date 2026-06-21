import * as THREE from 'three';

const cache = new Map();

function key(type, color, opts) {
  return `${type}_${color}_${JSON.stringify(opts)}`;
}

export function standardMaterial(color, opts = {}) {
  const k = key('std', color, opts);
  if (cache.has(k)) return cache.get(k);
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: opts.roughness ?? 0.7,
    metalness: opts.metalness ?? 0.05,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 1,
    transparent: !!opts.transparent,
    opacity: opts.opacity ?? 1
  });
  cache.set(k, mat);
  return mat;
}

export function carPaintMaterial(color) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.25,
    metalness: 0.6,
    envMapIntensity: 1.2
  });
}

export function glassMaterial(color) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.65
  });
}

export function emissiveMaterial(color, intensity = 1.5) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: intensity,
    roughness: 0.4,
    metalness: 0
  });
}

export function asphaltMaterial(color) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.95, metalness: 0.02 });
}
