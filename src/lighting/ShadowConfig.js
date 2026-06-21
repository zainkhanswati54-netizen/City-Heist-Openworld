// Shadow map size: 512 is fast; 1024 is medium; 2048 is slow.
// Keep this at 512 — most players can't tell the difference on a phone.
export const SHADOW_CONFIG = {
  mapSize: 512,
  bias: -0.002,
  normalBias: 0.02,
  castDistance: 80
};

export function applyShadowCasting(mesh, cast = true, receive = true) {
  mesh.castShadow  = cast;
  mesh.receiveShadow = receive;
  return mesh;
}
