import { Weapon } from './Weapon.js';
import { getWeaponDef } from '../config/weaponConfig.js';

export class Shotgun extends Weapon {
  constructor() {
    const def = getWeaponDef('shotgun');
    super(def.name, def.fireDelay, def.damage);
    this.pellets = def.pellets;
    this.spread = def.spread;
    this.bulletSpeed = def.bulletSpeed;
  }
}
