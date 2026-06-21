export class PlayerStats {
  constructor(gameState) {
    this.gameState = gameState;
  }

  takeDamage(amount) {
    this.gameState.damage(amount);
    return this.gameState.health <= 0;
  }

  isDead() {
    return this.gameState.health <= 0;
  }

  respawn() {
    this.gameState.health = this.gameState.maxHealth;
    this.gameState._notify('health');
  }
}
