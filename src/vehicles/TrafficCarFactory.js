import { TrafficCar } from './TrafficCar.js';
import { PALETTE } from '../config/colors.js';
import { TRAFFIC_CAR_COUNT, TRAFFIC_COLOR_INDICES, generateTrafficRoutes } from '../config/trafficConfig.js';
import { SETTINGS } from '../config/settings.js';
import { pick } from '../utils/RandomUtils.js';

export class TrafficCarFactory {
  static spawnAll(scene, roadsX, roadsZ, half) {
    const routes = generateTrafficRoutes(roadsX, roadsZ, half);
    const cars = [];

    for (let i = 0; i < TRAFFIC_CAR_COUNT; i++) {
      const route = routes[i % routes.length];
      const colorIndex = pick(TRAFFIC_COLOR_INDICES);
      const color = PALETTE.carPalette[colorIndex % PALETTE.carPalette.length];
      const startPos = route.min + Math.random() * (route.max - route.min);
      const x = route.axis === 'z' ? route.fixed + route.lane : startPos;
      const z = route.axis === 'z' ? startPos : route.fixed + route.lane;
      const isAggressive = Math.random() < SETTINGS.traffic.aggressiveDriverChance;
      const car = new TrafficCar(x, z, color, route, isAggressive);
      scene.add(car.group);
      cars.push(car);
    }
    return cars;
  }
}
