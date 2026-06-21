import { SETTINGS } from '../config/settings.js';

export class GameState {
  constructor() {
    this.health = 100;
    this.maxHealth = 100;
    this.ammo = 30;
    this.score = 0;
    this.wantedLevel = 0;
    this.inVehicle = false;
    this.money = SETTINGS.economy.startMoney;
    this.reputation = 0;
    this.listeners = [];
  }

  onChange(fn) {
    this.listeners.push(fn);
  }

  _notify(field) {
    this.listeners.forEach(fn => fn(field, this));
  }

  damage(amount) {
    this.health = Math.max(0, this.health - amount);
    this._notify('health');
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
    this._notify('health');
  }

  addAmmo(amount) {
    this.ammo = Math.min(99, this.ammo + amount);
    this._notify('ammo');
  }

  useAmmo() {
    if (this.ammo <= 0) return false;
    this.ammo--;
    this._notify('ammo');
    return true;
  }

  addScore(points) {
    this.score += points;
    this._notify('score');
  }

  addMoney(amount) {
    this.money += amount;
    this._notify('money');
  }

  spendMoney(amount) {
    if (this.money < amount) return false;
    this.money -= amount;
    this._notify('money');
    return true;
  }

  fine(amount, reason) {
    this.money = Math.max(0, this.money - amount);
    this._notify('money');
    this._notify('fine', reason);
  }

  addReputation(amount) {
    const cfg = SETTINGS.reputation;
    this.reputation = Math.min(cfg.max, this.reputation + amount);
    this._notify('reputation');
  }

  loseReputation(amount) {
    const cfg = SETTINGS.reputation;
    this.reputation = Math.max(cfg.min, this.reputation - amount);
    this._notify('reputation');
  }

  raiseWanted(amount) {
    this.wantedLevel = Math.min(5, this.wantedLevel + amount);
    this._notify('wanted');
  }

  decayWanted(amount) {
    this.wantedLevel = Math.max(0, this.wantedLevel - amount);
    this._notify('wanted');
  }

  get wantedResponse() {
    const lvl = Math.floor(this.wantedLevel);
    if (lvl <= 0) return 'none';
    if (lvl === 1) return 'investigate';
    if (lvl === 2) return 'chase';
    if (lvl === 3) return 'roadblock';
    if (lvl === 4) return 'swat';
    return 'military';
  }

  get reputationLabel() {
    if (this.reputation >= 60)  return 'HERO';
    if (this.reputation >= 30)  return 'GOOD';
    if (this.reputation >= 0)   return 'NEUTRAL';
    if (this.reputation >= -30) return 'SHADY';
    if (this.reputation >= -60) return 'CRIMINAL';
    return 'MOST WANTED';
  }
}
