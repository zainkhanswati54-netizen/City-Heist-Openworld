// GTA-style mission HUD: banner on start, objective strip, timer, result splash.
export class MissionHUD {
  constructor(root) {
    this._root = root;
    this._banner  = null;
    this._strip   = null;
    this._timer   = null;
    this._result  = null;
    this._startBtn = null;
    this._buildPersistent();
  }

  // ── Persistent elements (always in DOM) ─────────────────────────────────
  _buildPersistent() {
    // Objective strip — bottom-centre
    this._strip = document.createElement('div');
    this._strip.style.cssText = [
      'position:absolute', 'bottom:110px', 'left:50%',
      'transform:translateX(-50%)',
      'background:rgba(0,0,0,0.62)',
      'color:#fff', 'font-family:monospace', 'font-size:13px',
      'letter-spacing:1px', 'padding:6px 20px 5px',
      'border-left:3px solid #ffd700',
      'pointer-events:none', 'display:none',
      'max-width:320px', 'text-align:center', 'line-height:1.4'
    ].join(';');
    this._root.appendChild(this._strip);

    // Timer — top-right
    this._timer = document.createElement('div');
    this._timer.style.cssText = [
      'position:absolute', 'top:70px', 'right:16px',
      'color:#ff4400', 'font-family:monospace', 'font-size:22px',
      'font-weight:bold', 'text-shadow:0 0 8px #ff2200',
      'pointer-events:none', 'display:none'
    ].join(';');
    this._root.appendChild(this._timer);

    // "START MISSION" button — visible when idle
    this._startBtn = document.createElement('div');
    this._startBtn.style.cssText = [
      'position:absolute', 'bottom:160px', 'left:50%',
      'transform:translateX(-50%)',
      'background:rgba(255,180,0,0.15)',
      'border:1.5px solid #ffd700',
      'color:#ffd700', 'font-family:monospace', 'font-size:12px',
      'letter-spacing:3px', 'padding:8px 22px',
      'cursor:pointer', 'pointer-events:all',
      'text-shadow:0 0 8px #ffd700',
      'user-select:none'
    ].join(';');
    this._startBtn.textContent = '[ M ] START MISSION';
    this._startBtn.addEventListener('click',     () => this._onStart && this._onStart());
    this._startBtn.addEventListener('touchstart', e => { e.preventDefault(); this._onStart && this._onStart(); }, { passive: false });
    this._root.appendChild(this._startBtn);
  }

  onStartPressed(fn) { this._onStart = fn; }

  // ── Handle mission events ────────────────────────────────────────────────
  handleEvent(ev) {
    switch (ev.type) {
      case 'start':
        this._startBtn.style.display = 'none';
        this._showBanner(ev.mission.name, ev.text, ev.mission.color);
        this._setObjective(ev.mission.steps[0].text);
        if (ev.mission.timeLimit) this._timer.style.display = 'block';
        break;

      case 'objective':
        this._setObjective(ev.text);
        break;

      case 'tick':
        this._setObjective(ev.text);
        break;

      case 'success':
        this._strip.style.display = 'none';
        this._timer.style.display = 'none';
        this._showResult('MISSION COMPLETE', `+$${ev.reward.money}`, '#00ff88');
        setTimeout(() => { this._startBtn.style.display = 'block'; }, 5000);
        break;

      case 'fail':
        this._strip.style.display = 'none';
        this._timer.style.display = 'none';
        this._showResult('MISSION FAILED', ev.text || '', '#ff3300');
        setTimeout(() => { this._startBtn.style.display = 'block'; }, 4000);
        break;
    }
  }

  tick(timeLeft) {
    if (this._timer.style.display === 'block') {
      this._timer.textContent = '⏱ ' + String(timeLeft).padStart(2, '0') + 's';
      this._timer.style.color = timeLeft <= 10 ? '#ff0000' : '#ff6600';
    }
  }

  _setObjective(text) {
    this._strip.textContent = '▸ ' + text;
    this._strip.style.display = 'block';
  }

  _showBanner(title, sub, colorHex) {
    if (this._banner) {
      clearTimeout(this._banner._timeout);
      if (this._banner.parentNode) this._banner.parentNode.removeChild(this._banner);
    }

    const hex = '#' + colorHex.toString(16).padStart(6, '0');
    const el = document.createElement('div');
    el.style.cssText = [
      'position:absolute', 'top:22%', 'left:50%',
      'transform:translateX(-50%)',
      'text-align:center', 'pointer-events:none',
      'animation:missionBannerIn 0.4s ease'
    ].join(';');
    el.innerHTML = `
      <div style="color:${hex};font-family:'Arial Black',Impact,sans-serif;font-size:clamp(22px,5vw,38px);
                  font-weight:900;letter-spacing:2px;text-shadow:0 0 20px ${hex}88;line-height:1.1">
        ${title}
      </div>
      <div style="color:#ccc;font-family:monospace;font-size:12px;margin-top:6px;letter-spacing:1px">
        ${sub}
      </div>
    `;

    this._ensureBannerKeyframe();
    this._root.appendChild(el);
    this._banner = el;
    el._timeout = setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.5s';
      setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 500);
    }, 3200);
  }

  _showResult(title, sub, color) {
    if (this._banner) {
      clearTimeout(this._banner._timeout);
      if (this._banner.parentNode) this._banner.parentNode.removeChild(this._banner);
    }
    const el = document.createElement('div');
    el.style.cssText = [
      'position:absolute', 'top:30%', 'left:50%',
      'transform:translateX(-50%)',
      'text-align:center', 'pointer-events:none'
    ].join(';');
    el.innerHTML = `
      <div style="color:${color};font-family:'Arial Black',Impact,sans-serif;
                  font-size:clamp(26px,6vw,46px);font-weight:900;
                  text-shadow:0 0 30px ${color}99;letter-spacing:3px">${title}</div>
      <div style="color:#aaa;font-family:monospace;font-size:13px;margin-top:8px">${sub}</div>
    `;
    this._root.appendChild(el);
    this._banner = el;
    el._timeout = setTimeout(() => {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.6s';
      setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 600);
    }, 4500);
  }

  _ensureBannerKeyframe() {
    if (document.getElementById('_mhud_kf')) return;
    const s = document.createElement('style');
    s.id = '_mhud_kf';
    s.textContent = `
      @keyframes missionBannerIn {
        from { opacity:0; transform:translateX(-50%) translateY(-18px); }
        to   { opacity:1; transform:translateX(-50%) translateY(0); }
      }
    `;
    document.head.appendChild(s);
  }
}
