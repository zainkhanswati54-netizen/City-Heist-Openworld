import { Pistol } from './Pistol.js';
import { Shotgun } from './Shotgun.js';
import { Rifle } from './Rifle.js';
import { WEAPON_DEFS } from '../config/weaponConfig.js';

const BUILDERS = {
  pistol: () => new Pistol(),
  shotgun: () => new Shotgun(),
  rifle: () => new Rifle()
};

export class WeaponRegistry {
  constructor() {
    this.weapons = WEAPON_DEFS.map(def => ({
      id: def.id,
      def,
      instance: BUILDERS[def.id](),
      ammo: def.id === 'pistol' ? def.maxAmmo : 0,
      unlocked: def.id === 'pistol'
    }));
  }

  get(id) {
    return this.weapons.find(w => w.id === id);
  }

  unlock(id) {
    const w = this.get(id);
    if (w) w.unlocked = true;
  }

  addAmmo(id, amount) {
    const w = this.get(id);
    if (!w) return;
    w.unlocked = true;
    w.ammo = Math.min(w.def.maxAmmo, w.ammo + amount);
  }

  list() {
    return this.weapons;
  }
}
