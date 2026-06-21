export class CarController {
  constructor(input) {
    this.input = input;
  }

  getControlState() {
    return {
      forward: this.input.isDown('forward'),
      backward: this.input.isDown('backward'),
      left: this.input.isDown('left'),
      right: this.input.isDown('right'),
      handbrake: this.input.isDown('handbrake')
    };
  }
}
