import * as THREE from 'three';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { randomVariant, shade } from '../utils/ColorUtils.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';
import { pick } from '../utils/RandomUtils.js';

function box(w, h, d, color, opts = {}) {
  const mat = standardMaterial(color, { roughness: 0.85, metalness: 0.05, ...opts });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  applyShadowCasting(mesh, true, true);
  return mesh;
}

// ─── Glass Skyscraper ──────────────────────────────────────────────────────
export function buildSkyscraper(x, z, w, h, d) {
  const group = new THREE.Group();
  const glassColor = pick([0x3a6a9f, 0x3a9f6a, 0x6a3a9f, 0x4a8aaa]);
  const color = randomVariant(glassColor, 0.06);

  const body = box(w, h, d, color, { metalness: 0.3, roughness: 0.3 });
  body.position.y = h / 2;
  group.add(body);

  // Reflective glass strips on each face
  const stripColor = shade(color, 0.3);
  const stripMat = standardMaterial(stripColor, { metalness: 0.6, roughness: 0.2 });
  for (let i = 0; i < 3; i++) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(w * 0.12, h, 0.08), stripMat);
    strip.position.set((i - 1) * (w * 0.3), h / 2, d / 2 + 0.05);
    group.add(strip);
    const stripB = strip.clone();
    stripB.position.z = -(d / 2 + 0.05);
    group.add(stripB);
  }

  // Antenna
  const antMat = standardMaterial(0x888888, { metalness: 0.7 });
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, h * 0.22, 6), antMat);
  ant.position.y = h + h * 0.11;
  group.add(ant);

  // Roof helipad circle
  const padMat = standardMaterial(0x444444, { roughness: 0.9 });
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.3, w * 0.3, 0.15, 16), padMat);
  pad.position.y = h + 0.08;
  group.add(pad);

  group.position.set(x, 0, z);
  return { group, color, dims: { width: w, height: h, depth: d } };
}

// ─── Shop / Store ──────────────────────────────────────────────────────────
export function buildShop(x, z, w, h, d) {
  const group = new THREE.Group();
  const wallColor = pick([0xf0e0c0, 0xe0d0b0, 0xd0e8d0, 0xe8d8d0, 0xc8d8e8]);
  const color = randomVariant(wallColor, 0.05);

  const body = box(w, h, d, color);
  body.position.y = h / 2;
  group.add(body);

  // Coloured awning
  const awningColor = pick([0xcc2222, 0x2255cc, 0x228844, 0xcc8822, 0x884488]);
  const awningMat = standardMaterial(awningColor, { roughness: 0.9 });
  const awning = new THREE.Mesh(new THREE.BoxGeometry(w + 0.5, 0.25, 1.8), awningMat);
  awning.position.set(0, h * 0.65, d / 2 + 0.8);
  awning.rotation.x = -0.25;
  applyShadowCasting(awning, true, false);
  group.add(awning);

  // Shop sign
  const signMat = standardMaterial(shade(awningColor, 0.2), { roughness: 0.8 });
  const sign = new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, 0.6, 0.08), signMat);
  sign.position.set(0, h * 0.75, d / 2 + 0.05);
  group.add(sign);

  // Display window
  const glassMat = standardMaterial(0x88aacc, { metalness: 0.1, roughness: 0.1, transparent: true, opacity: 0.6 });
  const glass = new THREE.Mesh(new THREE.BoxGeometry(w * 0.7, h * 0.45, 0.06), glassMat);
  glass.position.set(0, h * 0.28, d / 2 + 0.04);
  group.add(glass);

  group.position.set(x, 0, z);
  return { group, color, dims: { width: w, height: h, depth: d } };
}

// ─── Warehouse / Industrial ────────────────────────────────────────────────
export function buildWarehouse(x, z, w, h, d) {
  const group = new THREE.Group();
  const color = pick([0x8a8070, 0x7a8890, 0x908070, 0x808080]);
  const baseColor = randomVariant(color, 0.04);

  const body = box(w, h, d, baseColor, { roughness: 0.95 });
  body.position.y = h / 2;
  group.add(body);

  // Corrugated metal horizontal strips
  const stripMat = standardMaterial(shade(baseColor, -0.1), { roughness: 0.9, metalness: 0.15 });
  const stripCount = Math.floor(h / 1.5);
  for (let i = 0; i < stripCount; i++) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, 0.12, d + 0.1), stripMat);
    strip.position.y = 0.75 + i * 1.5;
    group.add(strip);
  }

  // Large loading door
  const doorMat = standardMaterial(0x555560, { roughness: 0.8, metalness: 0.2 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(w * 0.45, h * 0.6, 0.1), doorMat);
  door.position.set(0, h * 0.3, d / 2 + 0.06);
  group.add(door);

  // Rooftop vent/exhaust
  const ventMat = standardMaterial(0x6a6a6a, { metalness: 0.4 });
  for (let i = 0; i < 3; i++) {
    const vent = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.0, 8), ventMat);
    vent.position.set(-w / 3 + i * (w / 3), h + 0.5, 0);
    group.add(vent);
  }

  group.position.set(x, 0, z);
  return { group, color: baseColor, dims: { width: w, height: h, depth: d } };
}

// ─── House / Residential ───────────────────────────────────────────────────
export function buildHouse(x, z, w, h, d) {
  const group = new THREE.Group();
  const wallColor = pick([0xf5dfc0, 0xf0e8d0, 0xe8f0d8, 0xd8e8f0, 0xf0d8e8]);
  const color = randomVariant(wallColor, 0.06);

  const body = box(w, h, d, color);
  body.position.y = h / 2;
  group.add(body);

  // Pitched roof
  const roofColor = pick([0x883322, 0x553311, 0x334455, 0x444422]);
  const roofMat = standardMaterial(roofColor, { roughness: 0.9 });
  const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w, d) * 0.76, h * 0.6, 4), roofMat);
  roof.position.y = h + h * 0.3;
  roof.rotation.y = Math.PI / 4;
  applyShadowCasting(roof, true, true);
  group.add(roof);

  // Front door
  const doorMat = standardMaterial(0x5a3a1a, { roughness: 0.8 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.5, 0.08), doorMat);
  door.position.set(0, 0.75, d / 2 + 0.05);
  group.add(door);

  // Windows
  const winMat = standardMaterial(0x88b8cc, { metalness: 0.1, roughness: 0.2 });
  const winL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.06), winMat);
  winL.position.set(w * 0.3, h * 0.55, d / 2 + 0.04);
  const winR = winL.clone();
  winR.position.x = -w * 0.3;
  group.add(winL, winR);

  // Chimney
  if (Math.random() > 0.5) {
    const chimMat = standardMaterial(0x883333, { roughness: 0.9 });
    const chim = new THREE.Mesh(new THREE.BoxGeometry(0.5, h * 0.7, 0.5), chimMat);
    chim.position.set(w * 0.25, h + h * 0.35, d * 0.1);
    group.add(chim);
  }

  group.position.set(x, 0, z);
  return { group, color, dims: { width: w, height: h, depth: d } };
}

// ─── Modern Office Block ───────────────────────────────────────────────────
export function buildOffice(x, z, w, h, d) {
  const group = new THREE.Group();
  const color = randomVariant(pick([0x9ab0c0, 0xb0a090, 0xa0b0a0, 0xa09ab0]), 0.05);

  const body = box(w, h, d, color, { roughness: 0.7, metalness: 0.1 });
  body.position.y = h / 2;
  group.add(body);

  // Stepped setbacks on top
  const step1 = box(w * 0.75, h * 0.25, d * 0.75, shade(color, -0.1));
  step1.position.y = h + h * 0.125;
  group.add(step1);

  const step2 = box(w * 0.45, h * 0.15, d * 0.45, shade(color, -0.2));
  step2.position.y = h + h * 0.25 + h * 0.075;
  group.add(step2);

  // AC units on roof
  const acMat = standardMaterial(0x888888, { metalness: 0.3, roughness: 0.7 });
  for (let i = 0; i < 4; i++) {
    const ac = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.9), acMat);
    const angle = (i / 4) * Math.PI * 2;
    ac.position.set(Math.cos(angle) * (w * 0.3), h + 0.35, Math.sin(angle) * (d * 0.3));
    group.add(ac);
  }

  // Base trim
  const trimMat = standardMaterial(shade(color, -0.25), { roughness: 0.8 });
  const trim = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 1.2, d + 0.4), trimMat);
  trim.position.y = 0.6;
  applyShadowCasting(trim, true, true);
  group.add(trim);

  group.position.set(x, 0, z);
  return { group, color, dims: { width: w, height: h, depth: d } };
}

// ─── Gas Station ───────────────────────────────────────────────────────────
export function buildGasStation(x, z) {
  const group = new THREE.Group();
  const w = 10, h = 3, d = 8;

  // Main building
  const body = box(w, h, d, 0xf0f0f0);
  body.position.y = h / 2;
  group.add(body);

  // Canopy over pumps
  const canopyMat = standardMaterial(0xdd3333, { roughness: 0.8 });
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(14, 0.3, 10), canopyMat);
  canopy.position.set(0, 4.5, 3);
  applyShadowCasting(canopy, true, false);
  group.add(canopy);

  // Canopy supports
  const pillarMat = standardMaterial(0x888888, { metalness: 0.4 });
  for (let px of [-5, 5]) {
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 4.5, 8), pillarMat);
    pillar.position.set(px, 2.25, 3);
    group.add(pillar);
  }

  // Fuel pumps
  const pumpMat = standardMaterial(0x2266aa, { roughness: 0.7 });
  for (let px of [-3, 0, 3]) {
    const pump = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.6, 0.4), pumpMat);
    pump.position.set(px, 0.8, 4);
    group.add(pump);
  }

  // Sign pole
  const poleMat = standardMaterial(0x666666, { metalness: 0.5 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 6, 8), poleMat);
  pole.position.set(-w / 2 + 1.5, 3, -d / 2 + 1);
  group.add(pole);
  const signMat = standardMaterial(0xff4400, { roughness: 0.7 });
  const sign = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.0, 0.15), signMat);
  sign.position.set(-w / 2 + 1.5, 6.5, -d / 2 + 1);
  group.add(sign);

  group.position.set(x, 0, z);
  return { group, color: 0xf0f0f0, dims: { width: 14, height: h, depth: 10 } };
}

// ─── Factory function — pick a building variant by type ───────────────────
export function buildVariant(type, x, z, w, h, d) {
  switch (type) {
    case 'skyscraper': return buildSkyscraper(x, z, w, h, d);
    case 'shop':       return buildShop(x, z, w, h * 0.4, d);
    case 'warehouse':  return buildWarehouse(x, z, w, h * 0.5, d);
    case 'house':      return buildHouse(x, z, w, Math.max(4, h * 0.35), d);
    case 'office':     return buildOffice(x, z, w, h, d);
    case 'gasstation': return buildGasStation(x, z);
    default:           return null;
  }
}

export const BUILDING_TYPES = ['skyscraper', 'shop', 'warehouse', 'house', 'office', 'gasstation'];
