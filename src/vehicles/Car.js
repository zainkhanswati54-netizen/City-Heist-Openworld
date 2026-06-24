import * as THREE from 'three';
import { CarBody } from './CarBody.js';
import { Wheel } from './Wheel.js';
import { CarPhysics } from './CarPhysics.js';
import { CarLights } from '../lighting/CarLights.js';
import { ExhaustParticles } from './ExhaustParticles.js';
import { SkidMarks } from './SkidMarks.js';
import { CarDoor } from './CarDoor.js';

const WHEEL_OFFSETS = [
  [-1.0, 0.36, 1.25], [1.0, 0.36, 1.25],
  [-1.0, 0.36, -1.25], [1.0, 0.36, -1.25]
];

export class Car {
  constructor(x, z, color) {
    this.group = new THREE.Group();
    this.body = new CarBody(color);
    this.group.add(this.body.group);

    this.wheels = WHEEL_OFFSETS.map(([wx, wy, wz]) => {
      const wheel = new Wheel();
      wheel.group.position.set(wx, wy, wz);
      this.group.add(wheel.group);
      return wheel;
    });

    this.lights = new CarLights(this.group);
    this.exhaust = new ExhaustParticles(this.group);
    this.skidMarks = new SkidMarks();

    this.driverDoor = new CarDoor(color, 1);
    this.driverDoor.attachTo(this.group);

    this.physics = new CarPhysics();
    this.group.position.set(x, 0.3, z);
    this.inUse = false;
  }

  update(input, collisionCheck, dt, sceneForSkid) {
    const result = this.physics.step(input, collisionCheck, this.group.position.x, this.group.position.z, dt);
    this.group.position.x = result.x;
    this.group.position.z = result.z;
    // The car model's headlights/front face local +Z at rotation.y=0, but physics.angle
    // now represents facing = (-sin(angle), -cos(angle)) [world -Z at angle=0] after the
    // forward-direction sign fix — so the mesh needs a 180° offset to visually point
    // the way it's actually accelerating, otherwise it would appear to drive backward.
    this.group.rotation.y = this.physics.angle + Math.PI;

    const wheelSpin = this.physics.speed * 2.2 * dt;
    this.wheels.forEach(w => w.spin(wheelSpin));
    [this.wheels[0], this.wheels[1]].forEach(w => {
      w.group.rotation.y = THREE.MathUtils.clamp(
        (input.left ? 0.35 : input.right ? -0.35 : 0), -0.4, 0.4
      );
    });

    this.exhaust.update(dt, input.forward || input.backward);

    if (result.collided && sceneForSkid) {
      this.skidMarks.addMark(sceneForSkid, this.group.position.x, this.group.position.z);
    }
  }
}
