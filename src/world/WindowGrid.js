import * as THREE from 'three';
import { emissiveMaterial, standardMaterial } from '../utils/MaterialFactory.js';
import { PALETTE } from '../config/colors.js';

const WINDOW_GEOMETRY = new THREE.PlaneGeometry(1.1, 1.5);
const FRAME_GEOMETRY = new THREE.PlaneGeometry(1.3, 1.7);

// Hard cap on total window instances across the whole city. Real building counts can
// exceed this in extreme cases; if so we simply stop adding windows to further buildings
// rather than let the InstancedMesh capacity grow unbounded — a building's silhouette and
// general window pattern still reads correctly without every single floor lit individually.
const MAX_INSTANCES = 12000;

export class WindowGrid {
  constructor() {
    this.litMat = emissiveMaterial(PALETTE.windowLit, 0.9);
    this.darkMat = standardMaterial(PALETTE.windowDark, { roughness: 0.3, metalness: 0.2 });
    this.frameMat = standardMaterial(0x1a1a1a, { roughness: 0.6 });

    // Two InstancedMeshes for windows (lit / dark) so flicker can still toggle a window's
    // appearance by moving its matrix between them, while keeping draw calls at just 3
    // total (litWindows + darkWindows + frames) instead of thousands of individual meshes.
    this.litMesh = new THREE.InstancedMesh(WINDOW_GEOMETRY, this.litMat, MAX_INSTANCES);
    this.darkMesh = new THREE.InstancedMesh(WINDOW_GEOMETRY, this.darkMat, MAX_INSTANCES);
    this.frameMesh = new THREE.InstancedMesh(FRAME_GEOMETRY, this.frameMat, MAX_INSTANCES);
    this.litMesh.count = 0;
    this.darkMesh.count = 0;
    this.frameMesh.count = 0;
    this.litMesh.frustumCulled = false; // whole-city instanced mesh; per-instance culling isn't meaningful here
    this.darkMesh.frustumCulled = false;
    this.frameMesh.frustumCulled = false;

    this._addedToScene = false;
    this.instances = []; // { lit, matrix, slotInLit, slotInDark } bookkeeping for flicker

    this._tmpMatrix = new THREE.Matrix4();
    this._tmpQuat = new THREE.Quaternion();
    this._tmpPos = new THREE.Vector3();
    this._tmpScale = new THREE.Vector3(1, 1, 1);
  }

  // Call once after CityBuilder constructs this WindowGrid, so the three InstancedMeshes
  // exist as actual scene objects (previously, windows were added as children of each
  // building's group instead — now they're global, world-positioned instances).
  addToScene(scene) {
    if (this._addedToScene) return;
    scene.add(this.litMesh, this.darkMesh, this.frameMesh);
    this._addedToScene = true;
  }

  applyToFace(buildingGroup, width, height, depth, faceOffset, axis) {
    const floorHeight = 3.4;
    const floors = Math.max(1, Math.floor((height - 1.5) / floorHeight));
    const cols = Math.max(1, Math.floor(width / 2.2));

    // buildingGroup carries world position via its own transform; since these are now
    // global instances (not children of the building group), we need the building's
    // world position/rotation baked into each instance's matrix directly.
    const basePos = buildingGroup.position;
    const baseRotY = buildingGroup.rotation.y;

    for (let f = 1; f <= floors; f++) {
      for (let c = 0; c < cols; c++) {
        if (this.instances.length >= MAX_INSTANCES) return; // hit the global cap, stop here

        const lit = Math.random() > 0.55;
        const colX = -width / 2 + (width / cols) * c + width / cols / 2;
        const y = f * floorHeight;

        let localX, localZ, rotY;
        if (axis === 'z') {
          localX = colX; localZ = faceOffset; rotY = baseRotY;
        } else {
          localX = faceOffset; localZ = colX; rotY = baseRotY + Math.PI / 2;
        }

        // Rotate the local offset by the building's world rotation, then add world position.
        const worldX = basePos.x + localX * Math.cos(baseRotY) + localZ * Math.sin(baseRotY);
        const worldZ = basePos.z - localX * Math.sin(baseRotY) + localZ * Math.cos(baseRotY);
        const worldY = basePos.y + y;

        const frameSlot = this.frameMesh.count;
        this._tmpQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotY);
        this._tmpPos.set(worldX, worldY, worldZ);
        this._tmpMatrix.compose(this._tmpPos, this._tmpQuat, this._tmpScale);
        this.frameMesh.setMatrixAt(frameSlot, this._tmpMatrix);
        this.frameMesh.count++;

        this._tmpPos.set(worldX + Math.sin(rotY) * 0.01, worldY, worldZ + Math.cos(rotY) * 0.01);
        this._tmpMatrix.compose(this._tmpPos, this._tmpQuat, this._tmpScale);

        const record = { lit, matrix: this._tmpMatrix.clone(), litSlot: -1, darkSlot: -1 };
        if (lit) {
          record.litSlot = this.litMesh.count;
          this.litMesh.setMatrixAt(record.litSlot, record.matrix);
          this.litMesh.count++;
        } else {
          record.darkSlot = this.darkMesh.count;
          this.darkMesh.setMatrixAt(record.darkSlot, record.matrix);
          this.darkMesh.count++;
        }
        this.instances.push(record);
      }
    }

    this.litMesh.instanceMatrix.needsUpdate = true;
    this.darkMesh.instanceMatrix.needsUpdate = true;
    this.frameMesh.instanceMatrix.needsUpdate = true;
  }

  flickerRandom() {
    if (!this.instances.length) return;
    const idx = Math.floor(Math.random() * this.instances.length);
    const inst = this.instances[idx];

    // Move this instance's matrix from its current mesh (lit or dark) to the other one,
    // by appending to the target mesh and swapping the *last* instance of the source mesh
    // into the freed slot (standard swap-remove, since InstancedMesh has no "remove" API).
    if (inst.lit) {
      this._swapRemove(this.litMesh, inst.litSlot);
      inst.darkSlot = this.darkMesh.count;
      this.darkMesh.setMatrixAt(inst.darkSlot, inst.matrix);
      this.darkMesh.count++;
      inst.litSlot = -1;
    } else {
      this._swapRemove(this.darkMesh, inst.darkSlot);
      inst.litSlot = this.litMesh.count;
      this.litMesh.setMatrixAt(inst.litSlot, inst.matrix);
      this.litMesh.count++;
      inst.darkSlot = -1;
    }
    inst.lit = !inst.lit;
    this.litMesh.instanceMatrix.needsUpdate = true;
    this.darkMesh.instanceMatrix.needsUpdate = true;
  }

  _swapRemove(mesh, slot) {
    const lastIdx = mesh.count - 1;
    if (slot !== lastIdx) {
      const lastMatrix = new THREE.Matrix4();
      mesh.getMatrixAt(lastIdx, lastMatrix);
      mesh.setMatrixAt(slot, lastMatrix);
      // Find the instance record that was pointing at lastIdx and repoint it to slot,
      // so future flickers/removals of that instance still hit the right slot.
      const movedRecord = this.instances.find(r =>
        (mesh === this.litMesh && r.litSlot === lastIdx) ||
        (mesh === this.darkMesh && r.darkSlot === lastIdx)
      );
      if (movedRecord) {
        if (mesh === this.litMesh) movedRecord.litSlot = slot;
        else movedRecord.darkSlot = slot;
      }
    }
    mesh.count--;
  }
}
