const TIPS = [
  'Police only activate when you have a Wanted level — stay clean to stay safe.',
  'Push the joystick all the way to sprint automatically.',
  'Traffic lights are real — aggressive drivers run them.',
  'NPCs follow a daily schedule: fewer people out at night.',
  'Driving over NPCs raises your Wanted level and costs reputation.',
  'Picking up ammo packs also earns you cash.',
  'Your reputation affects how fast your Wanted level drops.',
  'Different districts have different vibes — explore the Beach and Mountains.',
  'Watch for aggressive (darker) traffic cars — they speed and never stop.',
  'Park your car near pickups to collect them without getting out.',
];

export class LoadingScreen {
  constructor() {
    this._pct = 0;
    this._tipIndex = 0;
    this._tipTimer = null;
    this._ready = false;
    this._tapCallback = null;

    this.el = document.createElement('div');
    this.el.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:9999',
      'display:flex', 'flex-direction:column',
      'align-items:center', 'justify-content:center',
      'background:radial-gradient(ellipse at 50% 40%, #10101e 0%, #000008 100%)',
      'transition:opacity 0.9s ease', 'opacity:1'
    ].join(';');

    this._buildContent();
    document.body.appendChild(this.el);
  }

  _buildContent() {
    // ── Scanline overlay ──────────────────────────────────────────────────
    const scan = document.createElement('div');
    scan.style.cssText = [
      'position:absolute', 'inset:0', 'pointer-events:none',
      'background:repeating-linear-gradient(0deg,rgba(0,0,0,0.08) 0px,rgba(0,0,0,0.08) 1px,transparent 1px,transparent 2px)',
      'z-index:1'
    ].join(';');
    this.el.appendChild(scan);

    // ── Badge / logo strip ────────────────────────────────────────────────
    const badge = document.createElement('div');
    badge.style.cssText = [
      'position:relative', 'z-index:2',
      'border:2px solid #ff6600', 'padding:6px 36px 4px',
      'margin-bottom:10px',
      'color:#ff6600', 'font-family:monospace', 'font-size:11px',
      'letter-spacing:5px', 'text-transform:uppercase',
      'text-shadow:0 0 10px #ff6600'
    ].join(';');
    badge.textContent = 'ROCKSTAR CITY STUDIOS';
    this.el.appendChild(badge);

    // ── Title ─────────────────────────────────────────────────────────────
    const title = document.createElement('div');
    title.style.cssText = [
      'position:relative', 'z-index:2',
      'font-family:"Arial Black",Impact,sans-serif',
      'font-size:clamp(52px,10vw,110px)',
      'font-weight:900', 'letter-spacing:-2px',
      'color:#ffffff',
      'text-shadow:0 0 40px #ff4400, 0 0 80px #ff220088, 4px 4px 0 #aa2200',
      'line-height:1', 'margin:10px 0 6px'
    ].join(';');
    title.textContent = 'CITY HEIST';
    this.el.appendChild(title);
    this._animateTitle(title);

    // ── Tagline ───────────────────────────────────────────────────────────
    const tag = document.createElement('div');
    tag.style.cssText = [
      'position:relative', 'z-index:2',
      'color:#cc8844', 'font-family:monospace', 'font-size:13px',
      'letter-spacing:4px', 'margin-bottom:44px'
    ].join(';');
    tag.textContent = 'AN OPEN WORLD CRIME EXPERIENCE';
    this.el.appendChild(tag);

    // ── Progress bar wrapper ──────────────────────────────────────────────
    const barWrap = document.createElement('div');
    barWrap.style.cssText = [
      'position:relative', 'z-index:2',
      'width:min(420px,80vw)', 'margin-bottom:12px'
    ].join(';');

    const barLabel = document.createElement('div');
    barLabel.style.cssText = [
      'display:flex', 'justify-content:space-between',
      'color:#888', 'font-family:monospace', 'font-size:11px',
      'margin-bottom:6px'
    ].join(';');
    this._statusEl = document.createElement('span');
    this._statusEl.textContent = 'Initializing…';
    this._pctEl = document.createElement('span');
    this._pctEl.textContent = '0%';
    barLabel.appendChild(this._statusEl);
    barLabel.appendChild(this._pctEl);
    barWrap.appendChild(barLabel);

    const track = document.createElement('div');
    track.style.cssText = [
      'width:100%', 'height:6px',
      'background:rgba(255,255,255,0.08)',
      'border-radius:3px', 'overflow:hidden'
    ].join(';');
    this._bar = document.createElement('div');
    this._bar.style.cssText = [
      'height:100%', 'width:0%',
      'background:linear-gradient(90deg,#ff4400,#ff8800)',
      'box-shadow:0 0 12px #ff6600',
      'border-radius:3px',
      'transition:width 0.35s ease'
    ].join(';');
    track.appendChild(this._bar);
    barWrap.appendChild(track);
    this.el.appendChild(barWrap);

    // ── Tip text ──────────────────────────────────────────────────────────
    this._tipEl = document.createElement('div');
    this._tipEl.style.cssText = [
      'position:relative', 'z-index:2',
      'width:min(480px,82vw)', 'text-align:center',
      'color:#556', 'font-family:monospace', 'font-size:11px',
      'line-height:1.6', 'min-height:36px',
      'transition:opacity 0.4s'
    ].join(';');
    this._tipEl.textContent = '💡 ' + TIPS[0];
    this.el.appendChild(this._tipEl);
    this._rotateTips();

    // ── Tap to play ───────────────────────────────────────────────────────
    this._tapEl = document.createElement('div');
    this._tapEl.style.cssText = [
      'position:relative', 'z-index:2',
      'margin-top:42px',
      'color:#ff6600', 'font-family:monospace', 'font-size:14px',
      'letter-spacing:4px', 'text-transform:uppercase',
      'text-shadow:0 0 12px #ff4400',
      'opacity:0', 'transition:opacity 0.6s',
      'cursor:pointer', 'user-select:none'
    ].join(';');
    this._tapEl.textContent = '▶  TAP TO PLAY  ◀';
    this._tapEl.addEventListener('click',     () => this._onTap());
    this._tapEl.addEventListener('touchstart', e => { e.preventDefault(); this._onTap(); }, { passive: false });
    this.el.appendChild(this._tapEl);
    this._pulseTap();
  }

  _animateTitle(el) {
    let t = 0;
    const tick = () => {
      if (!this.el.parentNode) return;
      t += 0.04;
      const glow = 40 + Math.sin(t) * 12;
      el.style.textShadow = `0 0 ${glow}px #ff4400, 0 0 80px #ff220066, 4px 4px 0 #aa2200`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  _rotateTips() {
    this._tipTimer = setInterval(() => {
      this._tipEl.style.opacity = '0';
      setTimeout(() => {
        this._tipIndex = (this._tipIndex + 1) % TIPS.length;
        this._tipEl.textContent = '💡 ' + TIPS[this._tipIndex];
        this._tipEl.style.opacity = '1';
      }, 420);
    }, 4000);
  }

  _pulseTap() {
    let up = true;
    setInterval(() => {
      if (!this._ready) return;
      this._tapEl.style.opacity = up ? '1' : '0.3';
      up = !up;
    }, 700);
  }

  _onTap() {
    if (!this._ready || !this._tapCallback) return;
    this._tapCallback();
  }

  setProgress(pct, label = '') {
    this._pct = Math.min(100, Math.max(0, pct));
    this._bar.style.width = this._pct + '%';
    this._pctEl.textContent = Math.round(this._pct) + '%';
    if (label) this._statusEl.textContent = label;
  }

  showTapToPlay(callback) {
    this._ready = true;
    this._tapCallback = callback;
    this.setProgress(100, 'Ready!');
    this._tapEl.style.opacity = '1';
    this._statusEl.textContent = '✔ City loaded — tap to begin';
  }

  dismiss() {
    clearInterval(this._tipTimer);
    this.el.style.opacity = '0';
    setTimeout(() => {
      if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
    }, 950);
  }
}
