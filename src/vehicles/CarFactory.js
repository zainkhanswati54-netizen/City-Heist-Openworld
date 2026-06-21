import { Car } from './Car.js';
import { PALETTE } from '../config/colors.js';
import { VEHICLE_SPAWNS } from '../config/spawnTables.js';

export class CarFactory {
  static spawnAll(scene) {
    return VEHICLE_SPAWNS.map(spawn => {
      const color = PALETTE.carPalette[spawn.colorIndex % PALETTE.carPalette.length];
      const car = new Car(spawn.x, spawn.z, color);
      scene.add(car.group);
      return car;
    });
  }

  static spawnOne(scene, x, z, colorIndex = 0) {
    const color = PALETTE.carPalette[colorIndex % PALETTE.carPalette.length];
    const car = new Car(x, z, color);
    scene.add(car.group);
    return car;
  }
}
