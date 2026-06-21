export class SceneManager {
  constructor(scene) {
    this.scene = scene;
    this.updatables = [];
  }

  add(object3D, updatable = null) {
    this.scene.add(object3D);
    if (updatable) this.updatables.push(updatable);
    return object3D;
  }

  remove(object3D, updatable = null) {
    this.scene.remove(object3D);
    if (updatable) {
      const idx = this.updatables.indexOf(updatable);
      if (idx >= 0) this.updatables.splice(idx, 1);
    }
  }

  registerUpdatable(updatable) {
    this.updatables.push(updatable);
  }

  update(dt) {
    for (const u of this.updatables) {
      if (u.update) u.update(dt);
    }
  }
}
