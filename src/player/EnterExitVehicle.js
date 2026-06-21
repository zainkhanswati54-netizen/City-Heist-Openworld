import { distance2D } from '../utils/MathUtils.js';

export class EnterExitVehicle {
  constructor(playerGroup, cars) {
    this.playerGroup = playerGroup;
    this.cars = cars;
    this.inCar = false;
    this.currentCar = null;
  }

  nearestCar(maxDist = 4) {
    let nearest = null;
    let bestDist = maxDist;
    for (const car of this.cars) {
      const d = distance2D(this.playerGroup.position.x, this.playerGroup.position.z, car.group.position.x, car.group.position.z);
      if (d < bestDist) {
        bestDist = d;
        nearest = car;
      }
    }
    return nearest;
  }

  tryToggle() {
    if (this.inCar) {
      this.playerGroup.position.set(
        this.currentCar.group.position.x + 2,
        0,
        this.currentCar.group.position.z
      );
      this.currentCar.inUse = false;
      this.currentCar = null;
      this.inCar = false;
      this.playerGroup.visible = true;
      return { entered: false };
    }

    const car = this.nearestCar();
    if (car) {
      this.currentCar = car;
      car.inUse = true;
      this.inCar = true;
      this.playerGroup.visible = false;
      return { entered: true, car };
    }
    return { entered: false, noCarNearby: true };
  }
}
