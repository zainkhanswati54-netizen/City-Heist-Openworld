import * as THREE from 'three';

// ── Mission definitions ───────────────────────────────────────────────────
const MISSIONS = [
  {
    id: 'delivery',
    name: 'DELIVERY RUN',
    color: 0xffd700,
    steps: [
      { text: 'Pick up the package', marker: { x:  55, z:  30 }, radius: 4 },
      { text: 'Deliver it to the drop point', marker: { x: -40, z:  65 }, radius: 5 }
    ],
    timeLimit: 120,
    reward: { money: 800, score: 500, rep: 20 },
    intro: "A contact needs a package moved — fast. No questions asked."
  },
  {
    id: 'survival',
    name: 'HOT PURSUIT',
    color: 0xff3300,
    steps: [
      { text: 'Survive for 45 seconds with 3 stars!', marker: null, radius: 0 }
    ],
    timeLimit: 45,
    reward: { money: 1500, score: 1000, rep: -10 },
    intro: "You've been spotted. Stay alive — every second counts.",
    onStart: (gameState) => { gameState.wantedLevel = 3; }
  },
  {
    id: 'race',
    name: 'STREET RACE',
    color: 0x00ffaa,
    steps: [
      { text: 'Reach checkpoint 1/4', marker: { x:  40, z: -40 }, radius: 6 },
      { text: 'Reach checkpoint 2/4', marker: { x:  80, z:  30 }, radius: 6 },
      { text: 'Reach checkpoint 3/4', marker: { x: -20, z:  80 }, radius: 6 },
      { text: 'Reach checkpoint 4/4 — FINISH!', marker: { x:   0, z:   0 }, radius: 6 }
    ],
    timeLimit: 90,
    reward: { money: 0, score: 0, rep: 5 },   // calculated dynamically by time
    intro: "Four checkpoints, one chance. Go."
  }
];

function makeMarkerMesh(color) {
  const group = new THREE.Group();

  // Spinning ring on the ground
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3, 0.22, 8, 32),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.85 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.3;
  group.add(ring);

  // Vertical beam
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 24, 8),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.28 })
  );
  beam.position.y = 12;
  group.add(beam);

  group._ring = ring;
  return group;
}

export class MissionSystem {
  constructor(scene, gameState) {
    this._scene     = scene;
    this._gameState = gameState;
    this._active    = null;   // current mission def
    this._step      = 0;
    this._timer     = 0;
    this._marker    = null;
    this._status    = 'idle'; // idle | running | success | failed
    this._onUpdate  = null;   // callback(event)
    this._missionIdx = 0;
  }

  // Register a callback that fires on mission events:
  // { type: 'start'|'objective'|'success'|'fail', mission, text, timeLeft, reward }
  onEvent(fn) { this._onUpdate = fn; }

  startNext() {
    if (this._status === 'running') return;
    const def = MISSIONS[this._missionIdx % MISSIONS.length];
    this._missionIdx++;
    this._startMission(def);
  }

  _startMission(def) {
    this._active = def;
    this._step   = 0;
    this._timer  = def.timeLimit;
    this._status = 'running';

    if (def.onStart) def.onStart(this._gameState);

    this._spawnMarker(def.steps[0]);
    this._emit({ type: 'start', text: def.intro || def.steps[0].text });
  }

  _spawnMarker(step) {
    this._clearMarker();
    if (!step || !step.marker) return;
    const mesh = makeMarkerMesh(this._active.color);
    mesh.position.set(step.marker.x, 0, step.marker.z);
    this._scene.add(mesh);
    this._marker = mesh;
  }

  _clearMarker() {
    if (this._marker) {
      this._scene.remove(this._marker);
      this._marker = null;
    }
  }

  _emit(extra) {
    if (!this._onUpdate) return;
    this._onUpdate({
      mission:  this._active,
      step:     this._step,
      timeLeft: Math.ceil(this._timer),
      ...extra
    });
  }

  update(dt, playerPos) {
    if (this._status !== 'running' || !this._active) return;

    // Animate marker spin
    if (this._marker) {
      this._marker._ring.rotation.z += dt * 0.04;
    }

    // Countdown
    this._timer -= dt;
    if (this._timer <= 0) {
      this._fail('Time\'s up!');
      return;
    }

    const def  = this._active;
    const step = def.steps[this._step];

    // Survival mission: just wait out the timer
    if (def.id === 'survival') {
      this._emit({ type: 'tick', text: step.text });
      if (this._gameState.hp <= 0) {
        this._fail('You were taken down!');
        return;
      }
      if (this._timer <= 0) {
        this._success();
      }
      return;
    }

    // Check proximity to marker
    if (!step.marker) return;
    const dx = playerPos.x - step.marker.x;
    const dz = playerPos.z - step.marker.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < step.radius) {
      this._step++;
      if (this._step >= def.steps.length) {
        this._success();
      } else {
        this._spawnMarker(def.steps[this._step]);
        this._emit({ type: 'objective', text: def.steps[this._step].text });
      }
    }
  }

  _success() {
    this._clearMarker();
    this._status = 'success';

    const def = this._active;
    let reward = { ...def.reward };

    // Race: bonus money based on time remaining
    if (def.id === 'race') {
      const bonus = Math.round(this._timer * 20);
      reward.money  = 600 + bonus;
      reward.score  = 400 + bonus;
    }

    this._gameState.addMoney(reward.money);
    this._gameState.addScore(reward.score);
    if (reward.rep > 0) this._gameState.gainReputation(reward.rep);

    this._emit({ type: 'success', reward });

    // Reset for next start after delay
    setTimeout(() => { this._status = 'idle'; this._active = null; }, 6000);
  }

  _fail(reason) {
    this._clearMarker();
    this._status = 'failed';
    this._emit({ type: 'fail', text: reason });
    setTimeout(() => { this._status = 'idle'; this._active = null; }, 5000);
  }

  get status()    { return this._status; }
  get timeLeft()  { return Math.ceil(this._timer); }
  get isRunning() { return this._status === 'running'; }
}
