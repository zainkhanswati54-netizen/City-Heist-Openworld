import * as THREE from 'three';

// ── Vertex shader ────────────────────────────────────────────────────────
const VERT = `
varying vec3 vDir;
void main() {
  vDir = normalize((modelMatrix * vec4(position, 1.0)).xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// ── Fragment shader ───────────────────────────────────────────────────────
const FRAG = `
uniform vec3  topColor;
uniform vec3  horizonColor;
uniform vec3  sunColor;
uniform vec3  sunDir;
varying vec3  vDir;

void main() {
  vec3 d = normalize(vDir);
  float h = clamp(d.y, 0.0, 1.0);

  // Gradient: horizon → zenith
  vec3 sky = mix(horizonColor, topColor, pow(h, 0.55));

  // Sun glow halo
  float sd = dot(d, sunDir);
  float halo = smoothstep(0.980, 0.9980, sd);
  sky = mix(sky, sunColor * 1.2, halo * 0.55);

  // Sun disk
  float disk = smoothstep(0.9988, 0.9994, sd);
  sky = mix(sky, vec3(1.0, 0.97, 0.88), disk);

  gl_FragColor = vec4(sky, 1.0);
}
`;

export class SkyDome {
  constructor(scene) {
    this._mat = new THREE.ShaderMaterial({
      uniforms: {
        topColor:     { value: new THREE.Color(0x0d4fa8) },
        horizonColor: { value: new THREE.Color(0x7ab8e8) },
        sunColor:     { value: new THREE.Color(0xffe880) },
        sunDir:       { value: new THREE.Vector3(0.5, 0.6, 0.5).normalize() }
      },
      vertexShader:   VERT,
      fragmentShader: FRAG,
      side:       THREE.BackSide,
      depthWrite: false
    });

    const dome = new THREE.Mesh(new THREE.SphereGeometry(320, 20, 10), this._mat);
    dome.renderOrder = -1;
    scene.add(dome);

    // Star field (shown at night)
    this._stars = this._buildStars(scene);

    // Remove flat background — sky dome replaces it
    scene.background = null;
  }

  _buildStars(scene) {
    const count = 1800;
    const pos   = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(Math.random());   // full sphere, upper half used
      const r     = 300;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 5;  // always above horizon
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffffff, size: 1.2,
      sizeAttenuation: false,
      transparent: true, opacity: 0
    });
    const stars = new THREE.Points(geo, mat);
    stars.renderOrder = -2;
    scene.add(stars);
    return stars;
  }

  /**
   * @param {THREE.Vector3} sunPos   – world-space sun light position
   * @param {number}         cycle   – 0 = full night, 1 = full day
   */
  update(sunPos, cycle) {
    const u = this._mat.uniforms;

    if (cycle > 0.55) {
      // ── Daytime ────────────────────────────────────────────────────────
      const t = Math.min(1, (cycle - 0.55) / 0.2);
      u.topColor.value.set(0x0d4fa8).lerp(new THREE.Color(0x1565c0), t);
      u.horizonColor.value.set(0x7ab8e8);
      u.sunColor.value.set(0xffe880);
    } else if (cycle > 0.28) {
      // ── Sunrise / Sunset ───────────────────────────────────────────────
      const t = (cycle - 0.28) / 0.27;
      u.topColor.value    .set(0x1a1040).lerp(new THREE.Color(0x0d4fa8), t);
      u.horizonColor.value.set(0xff6010).lerp(new THREE.Color(0x7ab8e8), t);
      u.sunColor.value    .set(0xff8800).lerp(new THREE.Color(0xffe880), t);
    } else {
      // ── Night ──────────────────────────────────────────────────────────
      u.topColor.value.set(0x040410);
      u.horizonColor.value.set(0x080825);
      u.sunColor.value.set(0x112244);   // moon-ish
    }

    // Sun direction
    u.sunDir.value.copy(sunPos).normalize();

    // Stars fade in at night
    const starOpacity = Math.max(0, (0.32 - cycle) / 0.18);
    this._stars.material.opacity = starOpacity;
    this._stars.visible = starOpacity > 0.01;
  }
}
