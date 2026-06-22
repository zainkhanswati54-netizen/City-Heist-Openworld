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
    const pedestrians  = [];
    const talkingPairs = [];

    blocks.forEach(block => {
      if (block.type === 'park') return;
      if (Math.random() > pbc) return;

      // 45 % chance of a talking pair — makes streets feel social
      if (chance(0.45)) {
        const angle = Math.random() * Math.PI * 2;
        const pair = new TalkingNPCPair(block.x, block.z, angle);
        pair.npcs.forEach(n => scene.add(n.group));
        talkingPairs.push(pair);
        pedestrians.push(...pair.npcs);

        // Sometimes add a solo NPC standing nearby (street corner trio)
        if (chance(0.35)) {
          const ox = block.x + (Math.random() - 0.5) * 4;
          const oz = block.z + (Math.random() - 0.5) * 4;
          const extra = spawnRandomNPC(ox, oz);
          scene.add(extra.group);
          pedestrians.push(extra);
        }
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

  static spawnBeachCrowd(scene, bounds, count) {
    const crowd = [];
    for (let i = 0; i < count; i++) {
      const bx = bounds.xMin + Math.random() * (bounds.xMax - bounds.xMin);
      const bz = bounds.zMin + Math.random() * (bounds.zMax - bounds.zMin);
      const npc = new BeachNPC(bx, bz);
      scene.add(npc.group);
      crowd.push(npc);
    }
    return crowd;
  }
}
