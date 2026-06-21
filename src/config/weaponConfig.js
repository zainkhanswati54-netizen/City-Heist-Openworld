export const WEAPON_DEFS = [
  {
    id: 'pistol',
    name: 'Pistol',
    damage: 1,
    fireDelay: 10,
    bulletSpeed: 1.4,
    spread: 0.01,
    ammoPerPickup: 15,
    maxAmmo: 99,
    auto: false,
    soundType: 'pistol'
  },
  {
    id: 'shotgun',
    name: 'Shotgun',
    damage: 1,
    pellets: 6,
    fireDelay: 28,
    bulletSpeed: 1.1,
    spread: 0.09,
    ammoPerPickup: 8,
    maxAmmo: 40,
    auto: false,
    soundType: 'shotgun'
  },
  {
    id: 'rifle',
    name: 'Rifle',
    damage: 1,
    fireDelay: 6,
    bulletSpeed: 1.8,
    spread: 0.02,
    ammoPerPickup: 30,
    maxAmmo: 150,
    auto: true,
    soundType: 'rifle'
  }
];

export function getWeaponDef(id) {
  return WEAPON_DEFS.find(w => w.id === id) || WEAPON_DEFS[0];
}
