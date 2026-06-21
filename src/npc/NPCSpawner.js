import { PoliceNPC } from './PoliceNPC.js';
import { PedestrianNPC } from './PedestrianNPC.js';
import { POLICE_SPAWNS, PEDESTRIAN_SPAWNS } from '../config/spawnTables.js';

export class NPCSpawner {
  static spawnPolice(scene) {
    return POLICE_SPAWNS.map(p => {
      const npc = new PoliceNPC(p.x, p.z);
      scene.add(npc.group);
      return npc;
    });
  }

  static spawnPedestrians(scene) {
    return PEDESTRIAN_SPAWNS.map(p => {
      const npc = new PedestrianNPC(p.x, p.z);
      scene.add(npc.group);
      return npc;
    });
  }

  static remove(scene, npc, list) {
    scene.remove(npc.group);
    const idx = list.indexOf(npc);
    if (idx >= 0) list.splice(idx, 1);
  }
}
