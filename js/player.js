// Player class
class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.hp = PLAYER_HP;
        this.maxHp = PLAYER_HP;
        this.lives = 3;
        this.score = 0;
        this.state = STATE_IDLE;
        this.facing = DIR_RIGHT;
        this.weapon = null; // null, 'knife', 'bat'
        this.comboCount = 0;
        this.lastAttackTime = 0;
        this.attackCooldown = 0;
        this.hurtTimer = 0;
        this.invincible = 0;
        this.flashTimer = 0;

        // Create sprite
        this.sprite = scene.add.sprite(x, y, 'player_idle', 0);
        this.sprite.setOrigin(0.5, 1);
        this.sprite.setDepth(y);

        // Shadow
        this.shadow = scene.add.ellipse(x, y, 24, 8, 0x000000, 0.3);
        this.shadow.setDepth(y - 1);

        // Create animations
        scene.anims.create({
            key: 'player_idle_anim',
            frames: scene.anims.generateFrameNumbers('player_idle', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1
        });
        scene.anims.create({
            key: 'player_walk_anim',
            frames: scene.anims.generateFrameNumbers('player_walk', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });
        scene.anims.create({
            key: 'player_attack_anim',
            frames: scene.anims.generateFrameNumbers('player_attack', { start: 0, end: 2 }),
            frameRate: 12,
            repeat: 0
        });

        this.sprite.play('player_idle_anim');

        // Hit box for attacks
        this.attackBox = { x: 0, y: 0, w: 40, h: 20 };
    }

    get x() { return this.sprite.x; }
    set x(v) { this.sprite.x = v; this.shadow.x = v; }
    get y() { return this.sprite.y; }
    set y(v) { this.sprite.y = v; this.shadow.y = v; this.sprite.setDepth(v); this.shadow.setDepth(v - 1); }

    update(dt, cursors, keys) {
        if (this.state === STATE_DEAD) return;

        // Timers
        if (this.attackCooldown > 0) this.attackCooldown -= dt;
        if (this.hurtTimer > 0) {
            this.hurtTimer -= dt;
            if (this.hurtTimer <= 0) this.state = STATE_IDLE;
            return;
        }
        if (this.invincible > 0) {
            this.invincible -= dt;
            this.flashTimer += dt;
            this.sprite.alpha = Math.sin(this.flashTimer * 20) > 0 ? 1 : 0.3;
            if (this.invincible <= 0) {
                this.sprite.alpha = 1;
            }
        }

        // Attack state
        if (this.state === STATE_ATTACK) {
            if (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim.key !== 'player_attack_anim') {
                this.state = STATE_IDLE;
            }
            return;
        }

        // Movement
        let vx = 0, vy = 0;
        if (cursors.left.isDown || (keys.a && keys.a.isDown)) { vx = -PLAYER_SPEED; this.facing = DIR_LEFT; }
        if (cursors.right.isDown || (keys.d && keys.d.isDown)) { vx = PLAYER_SPEED; this.facing = DIR_RIGHT; }
        if (cursors.up.isDown || (keys.w && keys.w.isDown)) { vy = -PLAYER_SPEED * 0.7; }
        if (cursors.down.isDown || (keys.s && keys.s.isDown)) { vy = PLAYER_SPEED * 0.7; }

        if (vx !== 0 || vy !== 0) {
            this.state = STATE_WALK;
            this.x += vx * dt / 1000;
            this.y += vy * dt / 1000;
            // Clamp Y to walkable area
            this.y = Phaser.Math.Clamp(this.y, GROUND_Y, GROUND_BOTTOM);
            // Clamp X 
            this.x = Phaser.Math.Clamp(this.x, 20, this.scene.levelWidth ? this.scene.levelWidth - 20 : GAME_WIDTH - 20);

            if (this.sprite.anims.currentAnim?.key !== 'player_walk_anim') {
                this.sprite.play('player_walk_anim');
            }
        } else {
            if (this.state === STATE_WALK) {
                this.state = STATE_IDLE;
                this.sprite.play('player_idle_anim');
            }
        }

        this.sprite.flipX = (this.facing === DIR_LEFT);

        // Attack input
        if (Phaser.Input.Keyboard.JustDown(keys.j) || Phaser.Input.Keyboard.JustDown(keys.z)) {
            this.attack();
        }

        // Special attack (costs HP, hits all nearby)
        if (Phaser.Input.Keyboard.JustDown(keys.k) || Phaser.Input.Keyboard.JustDown(keys.x)) {
            this.specialAttack();
        }

        // Pick up weapon
        if (Phaser.Input.Keyboard.JustDown(keys.l) || Phaser.Input.Keyboard.JustDown(keys.c)) {
            this.tryPickup();
        }
    }

    attack() {
        if (this.attackCooldown > 0) return;
        
        const now = Date.now();
        if (now - this.lastAttackTime < PLAYER_COMBO_WINDOW) {
            this.comboCount = Math.min(this.comboCount + 1, 3);
        } else {
            this.comboCount = 1;
        }
        this.lastAttackTime = now;
        
        this.state = STATE_ATTACK;
        this.sprite.play('player_attack_anim');
        this.attackCooldown = 250;

        // Calculate damage
        let dmg = PLAYER_ATTACK_DMG;
        if (this.weapon === 'knife') dmg = 15;
        if (this.weapon === 'bat') dmg = 20;
        dmg += (this.comboCount - 1) * 3; // combo bonus
        
        // Attack hitbox position
        const ax = this.x + this.facing * 25;
        const ay = this.y;
        
        // Check hits on enemies
        if (this.scene.enemies) {
            this.scene.enemies.forEach(enemy => {
                if (enemy.state === STATE_DEAD) return;
                const dx = Math.abs(enemy.x - ax);
                const dy = Math.abs(enemy.y - ay);
                if (dx < 35 && dy < 20) {
                    enemy.takeDamage(dmg, this.facing);
                    this.score += 10;
                    
                    // Screen shake on combo 3
                    if (this.comboCount >= 3) {
                        this.scene.cameras.main.shake(100, 0.005);
                    }
                    
                    // Hit effect
                    this.scene.showHitEffect(enemy.x, enemy.y - 20);
                }
            });
        }
    }

    specialAttack() {
        if (this.hp <= PLAYER_SPECIAL_COST) return;
        this.hp -= PLAYER_SPECIAL_COST;
        
        this.state = STATE_ATTACK;
        this.sprite.play('player_attack_anim');
        this.scene.cameras.main.shake(200, 0.01);
        this.scene.cameras.main.flash(100, 255, 255, 255, false, null, 0.3);
        
        // Hit all nearby enemies
        if (this.scene.enemies) {
            this.scene.enemies.forEach(enemy => {
                if (enemy.state === STATE_DEAD) return;
                const dx = Math.abs(enemy.x - this.x);
                const dy = Math.abs(enemy.y - this.y);
                if (dx < 80 && dy < 30) {
                    enemy.takeDamage(25, this.facing);
                    this.score += 15;
                    this.scene.showHitEffect(enemy.x, enemy.y - 20);
                }
            });
        }
    }

    tryPickup() {
        if (this.scene.droppedWeapons) {
            for (let i = this.scene.droppedWeapons.length - 1; i >= 0; i--) {
                const w = this.scene.droppedWeapons[i];
                const dx = Math.abs(w.sprite.x - this.x);
                const dy = Math.abs(w.sprite.y - this.y);
                if (dx < 30 && dy < 20) {
                    this.weapon = w.type;
                    w.sprite.destroy();
                    this.scene.droppedWeapons.splice(i, 1);
                    break;
                }
            }
        }
    }

    takeDamage(amount, fromDir) {
        if (this.invincible > 0 || this.state === STATE_DEAD) return;
        
        this.hp -= amount;
        this.state = STATE_HURT;
        this.hurtTimer = 300;
        this.invincible = 500;
        this.flashTimer = 0;
        
        // Knockback
        this.x += (fromDir || 1) * 15;
        
        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            if (this.sprite) this.sprite.clearTint();
        });
        
        if (this.hp <= 0) {
            this.hp = 0;
            this.die();
        }
    }

    die() {
        this.state = STATE_DEAD;
        this.lives--;
        this.sprite.setTint(0xff0000);
        this.sprite.alpha = 0.5;
        
        if (this.lives > 0) {
            this.scene.time.delayedCall(1500, () => {
                this.respawn();
            });
        } else {
            this.scene.gameOver();
        }
    }

    respawn() {
        this.hp = this.maxHp;
        this.state = STATE_IDLE;
        this.weapon = null;
        this.sprite.alpha = 1;
        this.sprite.clearTint();
        this.invincible = 2000;
        this.flashTimer = 0;
        this.sprite.play('player_idle_anim');
    }

    heal(amount) {
        this.hp = Math.min(this.hp + amount, this.maxHp);
    }
}
