import { Tween } from '../utils/Tween.js';
import { Easing } from '../utils/Easing.js';

export class VehicleEntryAnimation {
  constructor(tweenManager) {
    this.tweenManager = tweenManager;
  }

  playEnter(door, onMidpoint) {
    this.tweenManager.add(new Tween(door.pivot.rotation, 'y', 0, door.openAngle, 14, Easing.easeOutBack));
    setTimeout(() => {
      if (onMidpoint) onMidpoint();
      this.tweenManager.add(new Tween(door.pivot.rotation, 'y', door.openAngle, 0, 16, Easing.easeInOutQuad));
    }, 220);
  }

  playExit(door, onMidpoint) {
    this.tweenManager.add(new Tween(door.pivot.rotation, 'y', 0, door.openAngle, 12, Easing.easeOutBack));
    setTimeout(() => {
      if (onMidpoint) onMidpoint();
      this.tweenManager.add(new Tween(door.pivot.rotation, 'y', door.openAngle, 0, 16, Easing.easeInOutQuad));
    }, 260);
  }
}
