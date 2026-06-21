export const VEHICLE_SPAWNS = [
  { x: 0, z: 6, colorIndex: 0 },
  { x: 12, z: -4, colorIndex: 1 },
  { x: -10, z: 10, colorIndex: 2 },
  { x: 22, z: 18, colorIndex: 3 },
  { x: -18, z: -14, colorIndex: 4 },
  { x: 30, z: -22, colorIndex: 5 }
];

export const POLICE_SPAWNS = [
  { x: 16, z: 16 },
  { x: -16, z: -16 },
  { x: 22, z: -10 },
  { x: -10, z: 22 }
];

export const PEDESTRIAN_SPAWNS = [
  { x: 6, z: 6 }, { x: -6, z: 6 }, { x: 6, z: -6 }, { x: -6, z: -6 },
  { x: 14, z: 0 }, { x: -14, z: 0 }, { x: 0, z: 14 }, { x: 0, z: -14 }
];

export const PICKUP_SPAWNS = [
  { x: 5, z: 5, type: 'ammo' },
  { x: -5, z: 5, type: 'health' },
  { x: 5, z: -5, type: 'ammo' },
  { x: -5, z: -5, type: 'health' },
  { x: 30, z: 0, type: 'ammo' },
  { x: 0, z: 30, type: 'health' },
  { x: -30, z: 0, type: 'ammo' },
  { x: 0, z: -30, type: 'health' }
];

export const STREET_PROP_SPAWNS = [
  { x: 8, z: 0, type: 'lamp' }, { x: -8, z: 0, type: 'lamp' },
  { x: 0, z: 8, type: 'lamp' }, { x: 0, z: -8, type: 'lamp' },
  { x: 10, z: 10, type: 'bench' }, { x: -10, z: -10, type: 'bench' },
  { x: 14, z: -6, type: 'trashcan' }, { x: -14, z: 6, type: 'trashcan' },
  { x: 6, z: 14, type: 'hydrant' }, { x: -6, z: -14, type: 'hydrant' }
];
