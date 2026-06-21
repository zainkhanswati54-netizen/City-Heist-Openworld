import { Weapon } from './Weapon.js';
import { getWeaponDef } from '../config/weaponConfig.js';

export class Pistol extends Weapon {
  constructor() {
    const def = getWeaponDef('pistol');
    super(def.name, def.fireDelay, def.damage);
    this.spread = def.spread;
    this.bulletSpeed = def.bulletSpeed;
  }
}
