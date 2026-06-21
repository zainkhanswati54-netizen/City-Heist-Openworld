export const DISTRICTS = {
  CITY: 'city',
  BEACH: 'beach',
  MOUNTAINS: 'mountains',
  SUBURBS: 'suburbs'
};

// Quadrants of the map, centered on (0,0). City is the largest/dominant district.
// x+ / z+ = city (largest quadrant, extends further than the others)
// x+ / z- = beach
// x- / z+ = mountains
// x- / z- = suburbs (smaller transition district)
export const DISTRICT_LAYOUT = {
  cityBounds: { xMin: -40, xMax: 400, zMin: -40, zMax: 400 },
  beachBounds: { xMin: -40, xMax: 400, zMin: -400, zMax: -40 },
  mountainBounds: { xMin: -400, xMax: -40, zMin: -40, zMax: 400 },
  suburbBounds: { xMin: -400, xMax: -40, zMin: -400, zMax: -40 }
};

export function getDistrictAt(x, z) {
  const { cityBounds, beachBounds, mountainBounds, suburbBounds } = DISTRICT_LAYOUT;
  if (x >= cityBounds.xMin && z >= cityBounds.zMin) return DISTRICTS.CITY;
  if (x >= beachBounds.xMin && z < beachBounds.zMax) return DISTRICTS.BEACH;
  if (x < mountainBounds.xMax && z >= mountainBounds.zMin) return DISTRICTS.MOUNTAINS;
  return DISTRICTS.SUBURBS;
}

export const DISTRICT_THEME = {
  [DISTRICTS.CITY]: {
    groundColor: 0x3a6b3a,
    buildingDensity: 1.0,
    lampDensity: 1.0,
    nightGlow: true
  },
  [DISTRICTS.BEACH]: {
    groundColor: 0xd8c79a,
    buildingDensity: 0.15,
    lampDensity: 0.3,
    nightGlow: false
  },
  [DISTRICTS.MOUNTAINS]: {
    groundColor: 0x5a6b4a,
    buildingDensity: 0.05,
    lampDensity: 0.1,
    nightGlow: false
  },
  [DISTRICTS.SUBURBS]: {
    groundColor: 0x4a7a45,
    buildingDensity: 0.35,
    lampDensity: 0.5,
    nightGlow: false
  }
};
