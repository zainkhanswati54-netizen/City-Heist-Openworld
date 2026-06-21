import * as THREE from 'three';
import { DISTRICT_LAYOUT, DISTRICT_THEME, getDistrictAt, DISTRICTS } from '../config/districtConfig.js';
import { Beach } from './Beach.js';
import { Ocean } from './Ocean.js';
import { PalmTree } from './PalmTree.js';
import { BeachProp } from './BeachProp.js';
import { Mountain } from './Mountain.js';
import { PineTree } from './PineTree.js';
import { Building } from './Building.js';
import { addFacadeDetails } from './BuildingFacade.js';
import { standardMaterial } from '../utils/MaterialFactory.js';
import { randInt, chance, pick } from '../utils/RandomUtils.js';
import { applyShadowCasting } from '../lighting/ShadowConfig.js';
import { PALETTE } from '../config/colors.js';

export class DistrictManager {
  constructor(scene, windowGrid) {
    this.scene = scene;
    this.windowGrid = windowGrid;
    this.mountains = [];
    this.suburbBuildings = [];
    this.oceans = [];
    this.beachProps = [];
  }

  buildBeach() {
    const bounds = DISTRICT_LAYOUT.beachBounds;
    const beach = new Beach(bounds);
    this.scene.add(beach.group);

    const ocean = new Ocean(
      (bounds.xMin + bounds.xMax) / 2,
      bounds.zMin - 30,
      (bounds.xMax - bounds.xMin) + 80,
      120
    );
    this.scene.add(ocean.mesh);
    this.oceans.push(ocean);

    const shoreZ = bounds.zMax - 8;
    for (let i = 0; i < 14; i++) {
      const x = bounds.xMin + 10 + Math.random() * (bounds.xMax - bounds.xMin - 20);
      const z = shoreZ - Math.random() * 30;
      const palm = new PalmTree(x, z);
      this.scene.add(palm.group);
    }

    for (let i = 0; i < 6; i++) {
      const x = bounds.xMin + 15 + Math.random() * (bounds.xMax - bounds.xMin - 30);
      const z = shoreZ - 5 - Math.random() * 20;
      this.scene.add(BeachProp.umbrella(x, z));
      this.scene.add(BeachProp.lounger(x + 1.2, z, Math.PI / 2));
      this.scene.add(BeachProp.lounger(x + 1.2, z + 1.0, Math.PI / 2));
      if (chance(0.5)) this.scene.add(BeachProp.beachBall(x - 1.5, z + 2));
    }
  }

  buildMountains() {
    const bounds = DISTRICT_LAYOUT.mountainBounds;
    for (let i = 0; i < 9; i++) {
      const x = bounds.xMin + 20 + Math.random() * (bounds.xMax - bounds.xMin - 40);
      const z = bounds.zMin + 20 + Math.random() * (bounds.zMax - bounds.zMin - 40);
      const radius = randInt(14, 26);
      const height = randInt(12, 30);
      const mountain = new Mountain(x, z, radius, height);
      this.scene.add(mountain.group);
      this.mountains.push(mountain);
    }

    for (let i = 0; i < 35; i++) {
      const x = bounds.xMin + 10 + Math.random() * (bounds.xMax - bounds.xMin - 20);
      const z = bounds.zMin + 10 + Math.random() * (bounds.zMax - bounds.zMin - 20);
      if (this._tooCloseToMountainPeak(x, z)) continue;
      const pine = new PineTree(x, z);
      this.scene.add(pine.group);
    }
  }

  buildSuburbs() {
    const bounds = DISTRICT_LAYOUT.suburbBounds;
    const spacing = 26;
    for (let x = bounds.xMin + 20; x < bounds.xMax - 10; x += spacing) {
      for (let z = bounds.zMin + 20; z < bounds.zMax - 10; z += spacing) {
        if (!chance(0.55)) continue;
        const w = randInt(6, 9);
        const d = randInt(6, 9);
        const h = randInt(5, 10);
        const color = pick(PALETTE.buildingPalette);
        const building = new Building(x, z, w, h, d, color);
        addFacadeDetails(building.group, w, h, d, building.color);
        this.windowGrid.applyToFace(building.group, w, h, d, d / 2 + 0.02, 'z');
        this.windowGrid.applyToFace(building.group, d, h, w, w / 2 + 0.02, 'x');
        this.scene.add(building.group);
        this.suburbBuildings.push({ mesh: building.group, x, z, w, d });
      }
    }
  }

  _tooCloseToMountainPeak(x, z, minDist = 6) {
    return this.mountains.some(m => {
      const dx = m.x - x, dz = m.z - z;
      return Math.sqrt(dx * dx + dz * dz) < (m.radius * 0.5 + minDist);
    });
  }

  checkMountainCollision(x, z, radius) {
    return this.mountains.some(m => {
      const dx = m.x - x, dz = m.z - z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      return dist < (m.radius * 0.55 + radius);
    });
  }

  checkSuburbCollision(x, z, radius) {
    return this.suburbBuildings.some(b => {
      return Math.abs(x - b.x) < b.w / 2 + radius && Math.abs(z - b.z) < b.d / 2 + radius;
    });
  }

  update(dt) {
    this.oceans.forEach(o => o.update(dt));
  }

  getDistrict(x, z) {
    return getDistrictAt(x, z);
  }
}
