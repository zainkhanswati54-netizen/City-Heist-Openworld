import { SETTINGS } from './settings.js';
import { DISTRICT_LAYOUT } from './districtConfig.js';

const { blockSize, worldHalf } = SETTINGS.world;

export function generateCityLayout() {
  const blocks = [];
  const roadsX = [];
  const roadsZ = [];

  // Roads span the whole world for connectivity between districts.
  const roadSpacing = blockSize;
  for (let i = -worldHalf / roadSpacing; i <= worldHalf / roadSpacing; i++) {
    roadsX.push(i * roadSpacing);
    roadsZ.push(i * roadSpacing);
  }

  // Dense building blocks are only generated within the city quadrant bounds.
  const { cityBounds } = DISTRICT_LAYOUT;
  let seed = 0;
  for (let x = cityBounds.xMin + blockSize / 2; x < cityBounds.xMax; x += blockSize) {
    for (let z = cityBounds.zMin + blockSize / 2; z < cityBounds.zMax; z += blockSize) {
      seed++;
      const isPark = (seed % 7 === 0);
      blocks.push({
        id: `block_${x}_${z}`,
        x,
        z,
        size: blockSize - 10,
        type: isPark ? 'park' : 'buildings',
        seed
      });
    }
  }

  return { blocks, roadsX, roadsZ, half: worldHalf, blockSize };
}

