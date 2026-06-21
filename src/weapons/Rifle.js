import { Weapon } from './Weapon.js';
import { getWeaponDef } from '../config/weaponConfig.js';

export class Rifle extends Weapon {
  constructor() {
    const def = getWeaponDef('rifle');
    super(def.name, def.fireDelay, def.damage);
    this.spread = def.spread;
    this.bulletSpeed = def.bulletSpeed;
    this.auto = def.auto;
  }
}
