import * as THREE from 'three';

export function roundedBoxGeometry(width, height, depth, radius = 0.08, segments = 2) {
  const geo = new THREE.BoxGeometry(width, height, depth, segments, segments, segments);
  const pos = geo.attributes.position;
  const hw = width / 2, hh = height / 2, hd = depth / 2;
  for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const fx = Math.sign(x) * Math.min(Math.abs(x), hw - radius);
    const fy = Math.sign(y) * Math.min(Math.abs(y), hh - radius);
    const fz = Math.sign(z) * Math.min(Math.abs(z), hd - radius);
    x = fx + Math.sign(x) * radius * (Math.abs(x) > hw - radius ? 1 : 0);
    y = fy + Math.sign(y) * radius * (Math.abs(y) > hh - radius ? 1 : 0);
    z = fz + Math.sign(z) * radius * (Math.abs(z) > hd - radius ? 1 : 0);
    pos.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();
  return geo;
}

export function bevelPlaneGeometry(width, height) {
  return new THREE.PlaneGeometry(width, height, 1, 1);
}

export function ringStripGeometry(radius, tube, segments = 16) {
  return new THREE.TorusGeometry(radius, tube, 6, segments);
}
