export const KEYBINDS = {
  forward: ['KeyW', 'ArrowUp'],
  backward: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  run: ['ShiftLeft', 'ShiftRight'],
  enterExitVehicle: ['KeyE'],
  fire: ['Space'],
  handbrake: ['Space'],
  pause: ['Escape'],
  toggleCameraView: ['KeyC'],
  cycleWeapon: ['KeyQ']
};

export function matchesBind(code, bindName) {
  const list = KEYBINDS[bindName];
  return !!list && list.includes(code);
}
