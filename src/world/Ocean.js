import * as THREE from 'three';

export class Ocean {
  constructor(x, z, width, depth) {
    const geo = new THREE.PlaneGeometry(width, depth, 40, 40);
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorShallow: { value: new THREE.Color(0x3fa9c9) },
        colorDeep: { value: new THREE.Color(0x0c3a5c) }
      },
      vertexShader: `
        uniform float time;
        varying float vWave;
        void main() {
          vec3 pos = position;
          float wave = sin(pos.x * 0.15 + time) * 0.25 + cos(pos.y * 0.2 + time * 1.3) * 0.2;
          pos.z += wave;
          vWave = wave;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 colorShallow;
        uniform vec3 colorDeep;
        varying float vWave;
        void main() {
          float t = clamp(vWave * 0.5 + 0.5, 0.0, 1.0);
          gl_FragColor = vec4(mix(colorDeep, colorShallow, t), 0.88);
        }
      `,
      transparent: true
    });
    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.set(x, -0.1, z);
  }

  update(dt) {
    this.material.uniforms.time.value += dt * 0.02;
  }
}
