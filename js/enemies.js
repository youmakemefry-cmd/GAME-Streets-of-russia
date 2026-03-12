// Specific enemy types with unique behaviors

class Gopnik extends Enemy {
    constructor(scene, x, y, isBoss = false) {
        super(scene, x, y, 'gopnik', {
            hp: isBoss ? 60 : 25,
            speed: 35 + Math.random() * 15, // slow (drunk)
            damage: 6,
            aggroRange: 250, // very aggressive range
            attackRange: 28,
            attackCooldown: 800,
            isBoss: isBoss,
            behavior: 'drunk'
        });
        this.swayTimer = 0;
        this.swayAmount = 2;
    }

    think(player) {
        // Always aggressive, but stumbles - moves erratically
        const dx = player.x - this.x;
        const dist = Math.abs(dx);
        
        // Drunk sway
        this.swayTimer += 0.1;
        const sway = Math.sin(this.swayTimer) * 20;
        
        this.targetX = player.x + sway;
        this.targetY = player.y + Math.sin(this.swayTimer * 0.7) * 15;
    }

    update(dt, player) {
        super.update(dt, player);
        // Drunk sway on sprite
        if (this.state !== STATE_DEAD && this.state !== STATE_HURT) {
            this.swayTimer += dt / 500;
            this.sprite.angle = Math.sin(this.swayTimer) * 5;
        }
    }
}

class Narik extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'narik', {
            hp: 20,
            speed: 70,
            damage: 12, // knife hurts
            aggroRange: 180,
            attackRange: 25,
            attackCooldown: 1200,
            dropWeapon: 'knife',
            behavior: 'sneaky'
        });
        this.sneaking = true;
    }

    think(player) {
        // Try to get behind the player
        const behindX = player.x - player.facing * 50;
        const dx = behindX - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 30) {
            this.targetX = behindX + (Math.random() - 0.5) * 20;
            this.targetY = player.y + (Math.random() - 0.5) * 10;
        } else {
            // In position, approach for attack
            this.targetX = player.x;
            this.targetY = player.y;
        }
    }
}

class Skinhead extends Enemy {
    constructor(scene, x, y, isBoss = false) {
        super(scene, x, y, 'skinhead', {
            hp: isBoss ? 80 : 40,
            speed: 50,
            damage: 14,
            aggroRange: 200,
            attackRange: 35,
            attackCooldown: 900,
            isBoss: isBoss,
            dropWeapon: 'bat',
            behavior: 'aggressive'
        });
    }

    think(player) {
        // Aggressive, charges straight at player
        const dx = player.x - this.x;
        const dist = Math.abs(dx);
        
        if (dist < this.aggroRange) {
            // Charge!
            this.targetX = player.x;
            this.targetY = player.y;
            this.speed = 65; // speeds up when charging
        } else {
            this.speed = 50;
            this.targetX = this.x + (Math.random() - 0.5) * 30;
            this.targetY = this.y + (Math.random() - 0.5) * 15;
        }
    }
}

class Magomed extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'magomed', {
            hp: 35,
            speed: 55,
            damage: 8,
            aggroRange: 150,
            attackRange: 28,
            attackCooldown: 1500,
            behavior: 'coward'
        });
        this.calledBackup = false;
        this.wasAttacked = false;
        this.callTimer = 0;
    }

    think(player) {
        const dx = player.x - this.x;
        const dist = Math.abs(dx);

        if (!this.wasAttacked) {
            // Cowardly - keep distance
            if (dist < 80) {
                this.targetX = this.x - Math.sign(dx) * 60;
                this.targetY = this.y + (Math.random() - 0.5) * 20;
            } else {
                this.targetX = this.x + (Math.random() - 0.5) * 20;
                this.targetY = this.y;
            }
        } else {
            // Attacked! Become aggressive
            this.targetX = player.x;
            this.targetY = player.y;
            this.speed = 75;
            this.attackCooldown = 700;
        }
    }

    takeDamage(amount, fromDir) {
        super.takeDamage(amount, fromDir);
        if (!this.wasAttacked && !this.calledBackup && this.hp > 0) {
            this.wasAttacked = true;
            this.callBackup();
        }
    }

    callBackup() {
        if (this.calledBackup) return;
        this.calledBackup = true;
        
        // Play phone animation (switch to frame 1)
        this.sprite.setFrame(1);
        
        // Show phone call indicator
        const callText = this.scene.add.text(this.x, this.y - 60, '📱 ...', {
            fontSize: '12px', fill: '#fff'
        }).setDepth(2000);
        
        this.scene.time.delayedCall(1500, () => {
            callText.destroy();
            // Spawn 3 backup Magomeds
            for (let i = 0; i < 3; i++) {
                this.scene.time.delayedCall(i * 500, () => {
                    const side = Math.random() > 0.5 ? 1 : -1;
                    const mx = this.scene.cameras.main.scrollX + (side > 0 ? GAME_WIDTH + 20 : -20);
                    const my = GROUND_Y + Math.random() * (GROUND_BOTTOM - GROUND_Y);
                    const backup = new Magomed(this.scene, mx, my);
                    backup.wasAttacked = true; // immediately aggressive
                    backup.calledBackup = true; // won't call more
                    this.scene.enemies.push(backup);
                });
            }
        });
    }
}

class Ment extends Enemy {
    constructor(scene, x, y, isBoss = false) {
        super(scene, x, y, 'ment', {
            hp: isBoss ? 100 : 50,
            speed: 45,
            damage: 12,
            aggroRange: 220,
            attackRange: 35,
            attackCooldown: 800,
            isBoss: isBoss,
            behavior: 'ment'
        });
        this.shooting = false;
        this.shootTimer = 0;
    }

    think(player) {
        const dx = player.x - this.x;
        const dist = Math.abs(dx);
        const hpRatio = this.hp / this.maxHp;

        if (hpRatio <= 0.15 && !this.shooting) {
            // Switch to shooting mode!
            this.shooting = true;
            this.sprite.setFrame(1); // gun frame
            this.speed = 30; // backs away slower
            this.attackRange = 150; // shoots from distance
            this.damage = 15;
            this.attackCooldown = 1200;
        }

        if (this.shooting) {
            // Keep distance and shoot
            if (dist < 100) {
                this.targetX = this.x - Math.sign(dx) * 40;
                this.targetY = this.y + (Math.random() - 0.5) * 10;
            } else if (dist > 160) {
                this.targetX = player.x - Math.sign(dx) * 120;
                this.targetY = player.y + (Math.random() - 0.5) * 10;
            }
        } else {
            // Normal baton behavior
            this.targetX = player.x;
            this.targetY = player.y;
        }
    }

    tryAttack(player) {
        if (this.shooting) {
            const now = Date.now();
            if (now - this.lastAttack < this.attackCooldown) return;
            if (player.state === STATE_DEAD || player.invincible > 0) return;
            this.lastAttack = now;
            
            // Shoot - create bullet visual
            const bullet = this.scene.add.rectangle(this.x, this.y - 20, 6, 3, 0xffff00);
            bullet.setDepth(2000);
            this.scene.tweens.add({
                targets: bullet,
                x: player.x,
                y: player.y - 20,
                duration: 200,
                onComplete: () => {
                    bullet.destroy();
                    player.takeDamage(this.damage, this.facing);
                    this.scene.showHitEffect(player.x, player.y - 20);
                }
            });
            
            // Muzzle flash
            this.scene.cameras.main.flash(50, 255, 255, 0, false, null, 0.2);
        } else {
            super.tryAttack(player);
        }
    }
}

class Omon extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'omon', {
            hp: 200,
            speed: 40,
            damage: 20,
            aggroRange: 250,
            attackRange: 45,
            attackCooldown: 600,
            isBoss: true,
            behavior: 'omon'
        });
        this.burstTimer = 0;
        this.burstCount = 0;
        this.phase = 1;
    }

    think(player) {
        const dx = player.x - this.x;
        const dist = Math.abs(dx);
        const hpRatio = this.hp / this.maxHp;

        // Phase 2: more aggressive at half HP
        if (hpRatio < 0.5 && this.phase === 1) {
            this.phase = 2;
            this.speed = 55;
            this.damage = 25;
        }

        if (dist > 120) {
            // Shoot burst
            this.targetX = this.x; // stand still
            this.targetY = this.y;
        } else {
            // Close range melee
            this.targetX = player.x;
            this.targetY = player.y;
        }
    }

    tryAttack(player) {
        const now = Date.now();
        if (now - this.lastAttack < this.attackCooldown) return;
        if (player.state === STATE_DEAD || player.invincible > 0) return;

        const dx = Math.abs(player.x - this.x);
        
        if (dx > 60) {
            // AK burst fire
            this.lastAttack = now;
            for (let i = 0; i < 3; i++) {
                this.scene.time.delayedCall(i * 150, () => {
                    if (this.state === STATE_DEAD || !this.sprite.active) return;
                    const bullet = this.scene.add.rectangle(this.x, this.y - 25, 6, 3, 0xffff00);
                    bullet.setDepth(2000);
                    const targetY = player.y - 20 + (Math.random() - 0.5) * 20;
                    this.scene.tweens.add({
                        targets: bullet,
                        x: player.x + (Math.random() - 0.5) * 30,
                        y: targetY,
                        duration: 250,
                        onComplete: () => {
                            bullet.destroy();
                            const hitDx = Math.abs(player.x - bullet.x);
                            if (hitDx < 25) {
                                player.takeDamage(this.damage * 0.5, this.facing);
                            }
                        }
                    });
                    this.scene.cameras.main.flash(30, 255, 200, 0, false, null, 0.15);
                });
            }
        } else {
            // Melee hit (rifle butt)
            this.lastAttack = now;
            player.takeDamage(this.damage, this.facing);
            this.scene.showHitEffect(player.x, player.y - 20);
            this.scene.cameras.main.shake(100, 0.008);
        }
    }
}
