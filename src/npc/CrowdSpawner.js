import { PedestrianNPC } from './PedestrianNPC.js';
import { WomanNPC } from './WomanNPC.js';
import { KidNPC } from './KidNPC.js';
import { ElderNPC } from './ElderNPC.js';
import { TalkingNPCPair } from './TalkingNPCPair.js';
import { SittingNPC } from './SittingNPC.js';
import { BeachNPC } from './BeachNPC.js';
import { chance } from '../utils/RandomUtils.js';
import { SETTINGS } from '../config/settings.js';

function spawnRandomNPC(x, z) {
  const r = Math.random();
  if (r < 0.35) return new PedestrianNPC(x, z);
  if (r < 0.65) return new WomanNPC(x, z);
  if (r < 0.82) return new KidNPC(x, z);
  return new ElderNPC(x, z);
}

export class CrowdSpawner {
  static spawnAcrossBlocks(scene, blocks, perBlockChance, maxPerBlock) {
    const pbc = perBlockChance ?? SETTINGS.npc.crowdPerBlockChance;
    const mpb = maxPerBlock  ?? SETTINGS.npc.maxPerBlock;
    const pedestrians = [];
    const talkingPairs = [];

    blocks.forEach(block => {
      if (block.type === 'park') return;
      if (Math.random() > pbc) return;

      if (chance(0.22)) {
        const angle = Math.random() * Math.PI * 2;
        const pair = new TalkingNPCPair(block.x, block.z, angle);
        pair.npcs.forEach(n => scene.add(n.group));
        talkingPairs.push(pair);
        pedestrians.push(...pair.npcs);
        return;
      }

      const count = 1 + Math.floor(Math.random() * mpb);
      for (let i = 0; i < count; i++) {
        const ox = block.x + (Math.random() - 0.5) * (block.size * 0.6);
        const oz = block.z + (Math.random() - 0.5) * (block.size * 0.6);
        const npc = spawnRandomNPC(ox, oz);
        scene.add(npc.group);
        pedestrians.push(npc);
      }
    });

    return { pedestrians, talkingPairs };
  }

  static spawnOnBenches(scene, benchPositions) {
    const sitters = [];
    benchPositions.forEach(pos => {
      if (!chance(0.7)) return;
      const sitter = new SittingNPC(pos.x, pos.z + 0.3, pos.rotationY || 0);
      scene.add(sitter.group);
      sitters.push(sitter);
    });
    return sitters;
  }

  static spawnBeachCrowd(scene, bounds, count = 22) {
    const npcs = [];
    for (let i = 0; i < count; i++) {
      const x = bounds.xMin + 15 + Math.random() * (bounds.xMax - bounds.xMin - 30);
      const z = bounds.zMax - 10 - Math.random() * 35;
      const npc = new BeachNPC(x, z);
      scene.add(npc.group);
      npcs.push(npc);
    }
    return npcs;
  }
}
