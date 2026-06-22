import * as THREE from 'three';
import { Engine } from './core/Engine.js';
import { Clock } from './core/Clock.js';
import { InputManager } from './core/InputManager.js';
import { SceneManager } from './core/SceneManager.js';
import { GameState } from './core/GameState.js';
import { PerformanceManager } from './core/PerformanceManager.js';
import { isLikelyMobile } from './core/PlatformDetect.js';

import { createSunLight } from './lighting/SunLight.js';
import { createAmbientLights } from './lighting/AmbientLight.js';
import { DayNightCycle } from './lighting/DayNightCycle.js';

import { CityBuilder } from './world/CityBuilder.js';
import { SkyDome } from './world/SkyDome.js';
import { CarFactory } from './vehicles/CarFactory.js';
import { TrafficCarFactory } from './vehicles/TrafficCarFactory.js';
import { VehicleEntryAnimation } from './vehicles/VehicleEntryAnimation.js';

import { PlayerCharacter } from './player/PlayerCharacter.js';
import { PlayerAnimator } from './player/PlayerAnimator.js';
import { PlayerController } from './player/PlayerController.js';
import { PlayerCamera } from './player/PlayerCamera.js';
import { EnterExitVehicle } from './player/EnterExitVehicle.js';
import { PlayerStats } from './player/PlayerStats.js';
import { FootstepDust } from './player/FootstepDust.js';

import { BulletPool } from './weapons/BulletPool.js';
import { MuzzleFlash } from './weapons/MuzzleFlash.js';
import { BulletImpactParticles } from './weapons/BulletImpactParticles.js';
import { WeaponPickup } from './weapons/WeaponPickup.js';
import { WeaponRegistry } from './weapons/WeaponRegistry.js';
import { WeaponSelector } from './weapons/WeaponSelector.js';

import { NPCHealthBar } from './npc/NPCHealthBar.js';
import { CrowdSpawner } from './npc/CrowdSpawner.js';
import { PoliceNPCPool } from './npc/PoliceNPCPool.js';
import { DaySchedule } from './npc/DaySchedule.js';

import { HUD } from './ui/HUD.js';
import { WeaponSelectorUI } from './ui/WeaponSelectorUI.js';
import { TouchControls } from './ui/TouchControls.js';
import { DPadControls } from './ui/DPadControls.js';
import { MobileLayout } from './ui/MobileLayout.js';
import { PauseMenu } from './ui/PauseMenu.js';
import { ButtonFix } from './ui/ButtonFix.js';
import { LoadingScreen } from './ui/LoadingScreen.js';
import { MissionHUD } from './ui/MissionHUD.js';

import { AudioManager } from './audio/AudioManager.js';
import { ProceduralEngineLayer } from './audio/ProceduralEngineLayer.js';
import { WeaponSoundKit } from './audio/WeaponSoundKit.js';
import { AmbientNatureSound } from './audio/AmbientNatureSound.js';
import { CityMusicPlayer } from './audio/CityMusicPlayer.js';
import { CityAmbientSounds } from './audio/CityAmbientSounds.js';
import { TrafficAmbientHum } from './audio/TrafficAmbientHum.js';

import { MissionSystem } from './gameplay/MissionSystem.js';

import { PICKUP_SPAWNS, STREET_PROP_SPAWNS, POLICE_SPAWNS } from './config/spawnTables.js';
import { DISTRICT_LAYOUT } from './config/districtConfig.js';
import { SETTINGS } from './config/settings.js';
import { distance2D } from './utils/MathUtils.js';
import { TweenManager } from './utils/Tween.js';

// ── Helpers ──────────────────────────────────────────────────────────────
function frame() { return new Promise(r => requestAnimationFrame(r)); }

// ── Boot ──────────────────────────────────────────────────────────────────
const canvas  = document.getElementById('game-canvas');
const hudRoot = document.getElementById('hud-root');
const loading = new LoadingScreen();

async function boot() {
  // Stage 1 — Engine
  loading.setProgress(5, 'Initializing engine…');
  await frame();

  const engine       = new Engine(canvas);
  const clock        = new Clock();
  const input        = new InputManager(canvas);
  const sceneManager = new SceneManager(engine.scene);
  const gameState    = new GameState();
  const perf         = new PerformanceManager(engine.renderer, engine.camera);
  const mobile       = isLikelyMobile();
  const tweenManager = new TweenManager();

  const sun = createSunLight();
  const { hemi, ambient } = createAmbientLights();
  engine.scene.add(sun, hemi, ambient);
  const dayNight    = new DayNightCycle(engine.scene, sun, hemi, ambient);
  const daySchedule = new DaySchedule();

  // Sky dome — replaces flat background colour
  const skyDome = new SkyDome(engine.scene);
  dayNight.useSkyDome();

  loading.setProgress(12, 'Generating road network…');
  await frame();

  // Stage 2 — City
  const city = new CityBuilder(engine.scene);
  const { half: worldHalf } = city.build();

  loading.setProgress(42, 'Placing buildings…');
  await frame();

  const buildingLODItems = city.buildings.map(b => ({
    mesh: b.mesh, x: b.x, z: b.z, w: b.w, d: b.d,
    height: b.h, radius: Math.max(b.w, b.d) * 0.7
  }));

  loading.setProgress(52, 'Spawning vehicles…');
  await frame();

  // Stage 3 — Vehicles
  const cars             = CarFactory.spawnAll(engine.scene);
  const trafficCars      = TrafficCarFactory.spawnAll(engine.scene, city.roadsX, city.roadsZ, worldHalf);
  const vehicleEntryAnim = new VehicleEntryAnimation(tweenManager);

  loading.setProgress(62, 'Spawning player…');
  await frame();

  // Stage 4 — Player
  const player           = new PlayerCharacter();
  engine.scene.add(player.group);
  player.group.position.set(4, 0, 4);

  const playerAnimator   = new PlayerAnimator(player.parts);
  const playerController = new PlayerController(player.group, input);
  const playerCamera     = new PlayerCamera(engine.camera, input);
  const enterExit        = new EnterExitVehicle(player.group, cars);
  const playerStats      = new PlayerStats(gameState);
  const footstepDust     = new FootstepDust();

  const weaponRegistry   = new WeaponRegistry();
  const weaponSelector   = new WeaponSelector(weaponRegistry);
  const muzzleFlash      = new MuzzleFlash();
  const impactParticles  = new BulletImpactParticles();
  const bulletPool       = new BulletPool(engine.scene);

  loading.setProgress(72, 'Calling in the police…');
  await frame();

  // Stage 5 — NPCs & police
  const policePool     = new PoliceNPCPool(engine.scene);
  const police         = POLICE_SPAWNS.map(p => policePool.spawn(p.x, p.z));
  const { pedestrians, talkingPairs } = CrowdSpawner.spawnAcrossBlocks(engine.scene, city.cityBlocks);
  const benchPositions = STREET_PROP_SPAWNS.filter(p => p.type === 'bench');
  const benchSitters   = CrowdSpawner.spawnOnBenches(engine.scene, benchPositions);
  const beachCrowd     = CrowdSpawner.spawnBeachCrowd(engine.scene, DISTRICT_LAYOUT.beachBounds, 18);
  const policeHealthBars = police.map(p => new NPCHealthBar(p.group));

  loading.setProgress(82, 'Placing pickups & props…');
  await frame();

  // Stage 6 — Pickups + HUD
  const pickups = PICKUP_SPAWNS.map(p => new WeaponPickup(p.x, p.z));
  pickups.forEach(p => engine.scene.add(p.mesh));

  const hud = new HUD(hudRoot, gameState);
  hud.ammoCounter.set(weaponRegistry.get('pistol').ammo);

  const weaponSelectorUI = new WeaponSelectorUI(hudRoot, id => {
    weaponSelector.selectById(id);
    refreshAmmoDisplay();
  });
  weaponSelectorUI.render(weaponRegistry.list(), weaponSelector.activeIndex);

  const pauseMenu  = new PauseMenu(hudRoot, () => canvas.requestPointerLock());
  const buttonFix  = new ButtonFix(pauseMenu, input);
  MobileLayout.applyIfNeeded(hudRoot, mobile || MobileLayout.isSmallScreen());
  const touchControls = mobile ? new TouchControls(hudRoot) : null;
  const dpadControls  = mobile ? new DPadControls(hudRoot)  : null;

  // Stage 7 — Missions
  const missionSystem = new MissionSystem(engine.scene, gameState);
  const missionHUD    = new MissionHUD(hudRoot);

  missionHUD.onStartPressed(() => {
    if (!missionSystem.isRunning) missionSystem.startNext();
  });
  missionSystem.onEvent(ev => {
    missionHUD.handleEvent(ev);
  });

  // Stage 8 — Audio (not started yet)
  loading.setProgress(93, 'Preparing audio…');
  await frame();

  const audio          = new AudioManager();
  const engineSound    = new ProceduralEngineLayer(audio);
  const weaponSoundKit = new WeaponSoundKit(audio);
  const ambientSound   = new AmbientNatureSound(audio);
  const cityAmbient    = new CityAmbientSounds(audio);
  const trafficHum     = new TrafficAmbientHum(audio);
  // CityMusicPlayer intentionally NOT started in-game — music plays on loading screen only

  loading.setProgress(100, 'City Heist is ready!');
  await frame();

  daySchedule.update(dayNight.t);
  applyScheduleToPedestrians(pedestrians, daySchedule, hud);

  let audioStarted = false;
  function startAudio() {
    if (audioStarted) return;
    audioStarted = true;
    audio.init();
    ambientSound.start();
    cityAmbient.start();
    trafficHum.start();
    // cityMusic NOT started — user wants music in loading screen only
  }

  await new Promise(resolve => {
    loading.showTapToPlay(() => {
      startAudio();
      loading.dismiss();
      resolve();
    });
    canvas.addEventListener('click',      startAudio, { once: true });
    canvas.addEventListener('touchstart', startAudio, { once: true });
  });

  // ── Keyboard: M = start mission ─────────────────────────────────────────
  window.addEventListener('keydown', e => {
    if (e.code === 'KeyM' && !missionSystem.isRunning) missionSystem.startNext();
  });

  // ── Pre-computed squared distances ──────────────────────────────────────
  const NPC_UPDATE_DIST_SQ     = SETTINGS.npc.updateDistanceSq;
  const TRAFFIC_UPDATE_DIST_SQ = SETTINGS.traffic.updateDistanceSq;

  let scheduleApplyTimer = 0;
  const SCHEDULE_APPLY_INTERVAL = 600;
  let policeSpawnTimer = 0;

  // ── Helpers ────────────────────────────────────────────────────────────
  function refreshAmmoDisplay() {
    const active = weaponSelector.active;
    hud.ammoCounter.set(active.ammo);
    weaponSelectorUI.render(weaponRegistry.list(), weaponSelector.activeIndex);
  }

  function buildingCollision(x, z, radius) {
    return city.checkCollision(x, z, radius);
  }

  const _fireDir    = new THREE.Vector3();
  const _fireOrigin = new THREE.Vector3();
  const _spreadDir  = new THREE.Vector3();
  const _muzzlePos  = new THREE.Vector3();

  function triggerNearbyPanic(px, pz) {
    pedestrians.forEach(ped => {
      if (typeof ped.panic !== 'function') return;
      const d = distance2D(ped.group.position.x, ped.group.position.z, px, pz);
      if (d < SETTINGS.npc.panicRadius) ped.panic(px, pz);
    });
  }

  function fireWeapon() {
    const active = weaponSelector.active;
    if (!active.instance.canFire() || active.ammo <= 0) return;
    active.instance.triggerCooldown();
    active.ammo--;
    hud.ammoCounter.set(active.ammo);

    engine.camera.getWorldDirection(_fireDir);
    const originGroup = enterExit.inCar ? enterExit.currentCar.group : player.group;
    _fireOrigin.copy(originGroup.position);
    _fireOrigin.y += 1.2;

    const pelletCount = active.def.pellets || 1;
    for (let i = 0; i < pelletCount; i++) {
      const spread = active.def.spread || 0;
      _spreadDir.copy(_fireDir);
      _spreadDir.x += (Math.random() - 0.5) * spread;
      _spreadDir.y += (Math.random() - 0.5) * spread * 0.5;
      _spreadDir.z += (Math.random() - 0.5) * spread;
      _spreadDir.normalize();
      bulletPool.spawn(_fireOrigin, _spreadDir);
    }

    _muzzlePos.copy(_fireOrigin).addScaledVector(_fireDir, 0.6);
    muzzleFlash.spawn(engine.scene, _muzzlePos);
    if (audioStarted) weaponSoundKit.play(active.def.soundType);
    gameState.addScore(5);
    gameState.loseReputation(SETTINGS.reputation.shootLoss * 0.3);
    gameState.raiseWanted(0.15);
    triggerNearbyPanic(_fireOrigin.x, _fireOrigin.z);
  }

  let vehicleTransitionInProgress = false;

  function handleEnterExit() {
    if (vehicleTransitionInProgress) return;
    if (enterExit.inCar) {
      vehicleTransitionInProgress = true;
      const car = enterExit.currentCar;
      vehicleEntryAnim.playExit(car.driverDoor, () => {
        enterExit.tryToggle();
        hud.setMode(false);
        engineSound.stop();
        if (dpadControls)  dpadControls.hide();
        if (touchControls) touchControls.showOnFootControls();
        input.setTouchOverride({});
        vehicleTransitionInProgress = false;
      });
    } else {
      const nearCar = enterExit.nearestCar();
      if (!nearCar) return;
      vehicleTransitionInProgress = true;
      vehicleEntryAnim.playEnter(nearCar.driverDoor, () => {
        enterExit.tryToggle();
        hud.setMode(true);
        engineSound.start();
        if (dpadControls)  dpadControls.show();
        if (touchControls) touchControls.hideOnFootControls();
        input.setTouchOverride({});
        vehicleTransitionInProgress = false;
      });
    }
  }

  const _impactPos = new THREE.Vector3();

  function updateBullets(dt) {
    const active = bulletPool.activeBullets;
    for (let i = active.length - 1; i >= 0; i--) {
      const b = active[i];
      const stillAlive = bulletPool.step(b, dt);
      if (!stillAlive) continue;
      let hit = false;
      for (const officer of police) {
        if (!officer.alive) continue;
        const d = distance2D(b.mesh.position.x, b.mesh.position.z,
                             officer.group.position.x, officer.group.position.z);
        if (d < 0.9) {
          officer.takeDamage(weaponSelector.active.instance.damage);
          _impactPos.copy(b.mesh.position);
          impactParticles.spawn(engine.scene, _impactPos);
          gameState.addScore(50);
          hit = true;
          break;
        }
      }
      if (hit) bulletPool.release(b);
    }
  }

  function cleanupDeadPolice() {
    for (let i = police.length - 1; i >= 0; i--) {
      if (!police[i].alive) {
        policePool.despawn(police[i]);
        police.splice(i, 1);
        policeHealthBars.splice(i, 1);
      }
    }
  }

  function updatePickups() {
    const pos = enterExit.inCar ? enterExit.currentCar.group.position : player.group.position;
    pickups.forEach(p => {
      p.update(clock.delta);
      if (p.checkCollect(pos.x, pos.z)) {
        engine.scene.remove(p.mesh);
        weaponRegistry.addAmmo(weaponSelector.active.id, weaponSelector.active.def.ammoPerPickup);
        refreshAmmoDisplay();
        gameState.addScore(25);
        gameState.addMoney(20);
      }
    });
  }

  function applyTouchButtonFlags() {
    if (!touchControls) return;
    const flags = touchControls.consumePressFlags();
    if (flags.enterExitPressed)   handleEnterExit();
    if (flags.weaponCyclePressed) { weaponSelector.next(); refreshAmmoDisplay(); }
  }

  function applyTouchMovementOnFoot() {
    if (!touchControls) return;
    const { state } = touchControls;
    const look = touchControls.consumeLook();
    playerCamera.yaw   -= look.dx * 0.004;
    playerCamera.pitch  = THREE.MathUtils.clamp(playerCamera.pitch - look.dy * 0.004, -0.45, 0.45);
    input.setTouchOverride({
      forward:  state.moveY < -0.2,
      backward: state.moveY >  0.2,
      left:     state.moveX < -0.2,
      right:    state.moveX >  0.2,
      fire:     state.firing,
      run:      state.sprinting
    });
  }

  function getCarControls() {
    if (dpadControls && enterExit.inCar) {
      const d = dpadControls.consume();
      return {
        forward:   input.isDown('forward')   || d.accel,
        backward:  input.isDown('backward')  || d.brake,
        left:      input.isDown('left')      || d.left,
        right:     input.isDown('right')     || d.right,
        handbrake: input.isDown('handbrake') || d.handbrake
      };
    }
    return {
      forward:   input.isDown('forward'),
      backward:  input.isDown('backward'),
      left:      input.isDown('left'),
      right:     input.isDown('right'),
      handbrake: input.isDown('handbrake')
    };
  }

  function updateWantedResponse(dt) {
    const lvl = gameState.wantedLevel;
    if (lvl < 1) return;
    policeSpawnTimer -= dt;
    if (policeSpawnTimer <= 0) {
      const maxOfficers = Math.floor(lvl) * 2;
      if (police.length < maxOfficers) {
        const angle = Math.random() * Math.PI * 2;
        const dist  = 30 + Math.random() * 20;
        const px = player.group.position.x + Math.sin(angle) * dist;
        const pz = player.group.position.z + Math.cos(angle) * dist;
        const officer = policePool.spawn(px, pz);
        police.push(officer);
        policeHealthBars.push(new NPCHealthBar(officer.group));
      }
      policeSpawnTimer = Math.max(180, 480 - lvl * 60);
    }
  }

  // ── Main Loop ─────────────────────────────────────────────────────────
  // Target 30 fps — halves CPU/GPU workload vs uncapped on 60 Hz displays.
  // On a slow phone this also prevents the browser from thermal-throttling.
  const TARGET_MS = 1000 / 30;
  let _lastFrameTime = 0;
  let _frameCount    = 0;

  function animate(now) {
    requestAnimationFrame(animate);

    // ── 30 fps cap ───────────────────────────────────────────────────────
    if (now - _lastFrameTime < TARGET_MS) return;
    _lastFrameTime = now;
    _frameCount++;

    const dt = clock.tick();
    if (buttonFix.isPaused()) { engine.render(); return; }

    // ── Always: input + player + camera ─────────────────────────────────
    applyTouchButtonFlags();
    if (!enterExit.inCar) applyTouchMovementOnFoot();
    tweenManager.update(dt);
    weaponRegistry.list().forEach(w => w.instance.update(dt));

    if (enterExit.inCar) {
      const controls = getCarControls();
      enterExit.currentCar.update(controls, buildingCollision, dt, engine.scene);
      enterExit.currentCar.lights.setNight(dayNight.isNight);
      playerCamera.yaw = enterExit.currentCar.physics.angle;
      playerCamera.follow(enterExit.currentCar.group.position);
      engineSound.update(enterExit.currentCar.physics.speed / 0.95);
    } else {
      playerCamera.updateLook();
      playerController.yaw = playerCamera.yaw;
      const { moved, running } = playerController.update(dt, buildingCollision, worldHalf);
      playerAnimator.update(dt, moved, running);
      footstepDust.update(dt, engine.scene, player.group.position.x, player.group.position.z, moved && running);
      playerCamera.follow(player.group.position);
    }

    // Key inputs — every frame so they're never missed
    if (input.wasPressed('enterExitVehicle')) handleEnterExit();
    if (input.wasPressed('toggleCameraView')) playerCamera.toggleView();
    if (input.wasPressed('cycleWeapon'))      { weaponSelector.next(); refreshAmmoDisplay(); }
    if (input.isDown('fire') && !enterExit.inCar) fireWeapon();

    updateBullets(dt);
    muzzleFlash.update(dt);
    impactParticles.update(dt);

    const targetPos  = enterExit.inCar ? enterExit.currentCar.group.position : player.group.position;
    const viewerPos  = targetPos;
    const vpx = viewerPos.x, vpz = viewerPos.z;

    // ── Every frame: police AI (they need to react quickly) ─────────────
    police.forEach((officer, idx) => {
      if (!officer.alive) return;
      const result = officer.ai.update(officer.group, targetPos, dt, gameState.wantedLevel);
      officer.animator.update(dt, result.moving);
      if (policeHealthBars[idx]) {
        policeHealthBars[idx].setHealth(officer.hp);
        policeHealthBars[idx].faceCamera(engine.camera);
      }
      if (result.shouldFire) {
        gameState.damage(8);
        gameState.raiseWanted(0.3);
      }
    });
    cleanupDeadPolice();

    // ── Every 2 frames: traffic (cars don't need 30 Hz AI) ──────────────
    if (_frameCount % 2 === 0) {
      const trafficMult = daySchedule.trafficMultiplier;
      let nearTrafficCount = 0;
      trafficCars.forEach(tc => {
        const dx = tc.group.position.x - vpx;
        const dz = tc.group.position.z - vpz;
        const inRange = (dx * dx + dz * dz) < TRAFFIC_UPDATE_DIST_SQ;
        tc.group.visible = inRange;
        if (inRange) { tc.updateTraffic(dt * 2, trafficMult); nearTrafficCount++; }
        tc.lights.setNight(dayNight.isNight);
      });
      trafficHum.update(nearTrafficCount);
    }

    // ── Every 3 frames: pedestrians (slow walkers) ───────────────────────
    if (_frameCount % 3 === 0) {
      const period = daySchedule.period;
      pedestrians.forEach(ped => {
        const dx = ped.group.position.x - vpx;
        const dz = ped.group.position.z - vpz;
        const inRange = (dx * dx + dz * dz) < NPC_UPDATE_DIST_SQ;
        ped.group.visible = inRange;
        if (inRange && typeof ped.update === 'function') ped.update(dt * 3, period);
      });
      talkingPairs.forEach(pair => {
        const dx = pair.npcs[0].group.position.x - vpx;
        const dz = pair.npcs[0].group.position.z - vpz;
        if ((dx * dx + dz * dz) < NPC_UPDATE_DIST_SQ) pair.update(dt * 3);
      });
      beachCrowd.forEach(b => {
        const dx = b.group.position.x - vpx;
        const dz = b.group.position.z - vpz;
        if ((dx * dx + dz * dz) < NPC_UPDATE_DIST_SQ) b.update(dt * 3);
      });
      benchSitters.forEach(s => s.update(dt * 3));
    }

    // ── Every 4 frames: sky + day-night (visual-only, no rush) ──────────
    if (_frameCount % 4 === 0) {
      dayNight.update(dt * 4);
      daySchedule.update(dayNight.t);
      skyDome.update(sun.position, dayNight.cycle);
      city.update(dt * 4, dayNight.isNight);
      cars.forEach(car => { if (!car.inUse) car.lights.setNight(dayNight.isNight); });

      scheduleApplyTimer += dt * 4;
      if (daySchedule.periodChanged || scheduleApplyTimer >= SCHEDULE_APPLY_INTERVAL) {
        scheduleApplyTimer = 0;
        applyScheduleToPedestrians(pedestrians, daySchedule, hud);
      }
    }

    // ── Every 6 frames: non-critical systems ────────────────────────────
    if (_frameCount % 6 === 0) {
      perf.applyLOD(buildingLODItems, vpx, vpz);
      updatePickups();
      updateWantedResponse(dt * 6);
      const decayRate = 0.002 + Math.max(0, gameState.reputation) * 0.00005;
      gameState.decayWanted(decayRate * dt * 6);
      missionSystem.update(dt * 6, targetPos);
      if (missionSystem.isRunning) missionHUD.tick(missionSystem.timeLeft);
    }

    if (audioStarted && audio.ctx && audio.ctx.state === 'suspended') audio.resume();

    input.consumeFrame();
    engine.render();
  }

  engine.resize();
  animate();
}

function applyScheduleToPedestrians(pedestrians, daySchedule, hud) {
  const period = daySchedule.period;
  pedestrians.forEach(ped => {
    if (typeof ped.applySchedule === 'function') ped.applySchedule(period);
  });
  hud.setPeriod(period);
}

boot().catch(err => console.error('Boot failed:', err));
