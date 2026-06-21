export const SHADOW_CONFIG = {
  mapSize: 2048,
  bias: -0.0015,
  normalBias: 0.02,
  castDistance: 260
};

export function applyShadowCasting(mesh, cast = true, receive = true) {
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  return mesh;
}
