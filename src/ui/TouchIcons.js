// Centralized icon glyphs (inline SVG strings) and a shared button factory so every touch
// control across the game looks visually consistent — circular, semi-transparent, icon-based,
// matching the classic mobile GTA control scheme rather than plain colored rectangles.

export const ICONS = {
  accelerate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`,
  brake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`,
  steerLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>`,
  steerRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
  handbrake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v6m0 0a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/><path d="M9 9l-3-3"/></svg>`,
  horn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a2 2 0 0 0 2 2h2l4 4V5L7 9H5a2 2 0 0 0-2 2z"/><path d="M17 8a5 5 0 0 1 0 8"/><path d="M20 5a9 9 0 0 1 0 14"/></svg>`,
  fire: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 14h5l-1 8 9-12h-5l1-8z"/></svg>`,
  enterCar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5"/><path d="M3 12v4a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4"/><circle cx="7" cy="16" r="1"/><circle cx="17" cy="16" r="1"/></svg>`,
  weaponCycle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/></svg>`,
  sprint: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13" cy="4" r="2"/><path d="M15 22l-2-7-3 2-2-5 4-3 3 3 3-1"/><path d="M9 22l2-4"/></svg>`,
  lookBack: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9"/><path d="M3 5v5h5"/></svg>`
};

export function makeIconButton({ icon, size = 56, bg = 'rgba(20,20,24,0.62)', borderColor = 'rgba(255,255,255,0.35)', iconColor = '#fff', extraStyle = '' }) {
  const btn = document.createElement('div');
  btn.innerHTML = ICONS[icon] || '';
  btn.style.cssText = `
    position:absolute;width:${size}px;height:${size}px;border-radius:50%;
    background:${bg};display:flex;align-items:center;justify-content:center;
    border:2px solid ${borderColor};user-select:none;touch-action:none;pointer-events:auto;
    box-shadow:0 2px 6px rgba(0,0,0,0.4);
    ${extraStyle}
  `;
  const svg = btn.querySelector('svg');
  if (svg) {
    svg.style.width = Math.round(size * 0.5) + 'px';
    svg.style.height = Math.round(size * 0.5) + 'px';
    svg.style.color = iconColor;
  }
  return btn;
}

export function bindHoldButton(el, onDown, onUp) {
  const down = e => { onDown(); if (e.cancelable) e.preventDefault(); };
  const up = () => onUp();
  el.addEventListener('touchstart', down, { passive: false });
  el.addEventListener('touchend', up);
  el.addEventListener('touchcancel', up);
  el.addEventListener('mousedown', down);
  el.addEventListener('mouseup', up);
  el.addEventListener('mouseleave', up);
}

export function bindTapButton(el, onTap) {
  el.addEventListener('click', onTap);
}
