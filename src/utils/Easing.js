export const Easing = {
  linear: t => t,
  easeOutQuad: t => 1 - (1 - t) * (1 - t),
  easeInQuad: t => t * t,
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  easeOutBack: t => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeOutCubic: t => 1 - Math.pow(1 - t, 3)
};
