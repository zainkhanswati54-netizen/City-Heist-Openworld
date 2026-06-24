import { DISTRICT_LAYOUT } from './districtConfig.js';

export const TRAFFIC_CAR_COUNT = 14;  // was 32 — fewer moving parts per frame

export const TRAFFIC_COLOR_INDICES = [0, 1, 2, 3, 4, 5];

export function generateTrafficRoutes(roadsX, roadsZ, half) {
  const routes = [];
  const mountainXMax = DISTRICT_LAYOUT.mountainBounds.xMax;

  roadsX.forEach(x => {
    if (x < mountainXMax - 10) return;
    routes.push({ axis: 'z', fixed: x, min: -half, max: half, lane:  2.6 });
    routes.push({ axis: 'z', fixed: x, min: -half, max: half, lane: -2.6 });
  });
  roadsZ.forEach(z => {
    routes.push({ axis: 'x', fixed: z, min: mountainXMax - 10, max: half, lane:  2.6 });
    routes.push({ axis: 'x', fixed: z, min: mountainXMax - 10, max: half, lane: -2.6 });
  });
  return routes;
}
