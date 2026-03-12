// Base enemy class
class Enemy {
    constructor(scene, x, y, type, config) {
        this.scene = scene;
        this.type = type;
        this.hp = config.hp || 30;
        this.maxHp = this.hp;
        this.speed = config.speed || 60;
        this.damage = config.damage || 8;
        this.aggroRange = config.aggroRange || ENEMY_AGGRO_RANGE;
        this.attackRange = config.attackRange || 30;
        this.attackCooldown = config.attackCooldown || 1000;
        this.state = STATE_IDLE;
        this.facing = DIR_LEFT;
        this.lastAttack = 0;
        this.hurtTimer = 0;
        this.thinkTimer = 0;
        this.targetX = x;
        this.targetY = y;
        this.isBoss = config.isBoss || false;
        this.behavior = config.behavior || 'aggressive';
        this.onDeath = config.onDeath || null;
        this.dropWeapon = config.dropWeapon || null;

        // Sprite
        this.sprite = scene.add.sprite(x, y, type, 0);
        this.sprite.setOrigin(0.5, 1);
        this.sprite.setDepth(y);

        // Shadow
        this.shadow = scene.add.ellipse(x, y, 24, 8, 0x000000, 0.3);
        this.shadow.setDepth(y - 1);

        // HP bar (for bosses show always, for mobs show when damaged)
        this.hpBarBg = scene.add.rectangle(x, y - this.sprite.height - 8, 30, 4, COLOR_HP_BG);
        this.hpBarBg.setDepth(1000);
        this.hpBarBg.setOrigin(0.5, 0.5);
        this.hpBarBg.visible = this.isBoss;

        this.hpBar = scene.add.rectangle(x, y - this.sprite.height - 8, 30, 4, COLOR_HP_RED);
        this.hpBar.setDepth(1001);
        this.hpBar.setOrigin(0, 0.5);
        this.hpBar.visible = this.isBoss;

        // Create anims if not exists
        if (!scene.anims.exists(type + '_idle')) {
            scene.anims.create({
                key: type + '_idle',
                frames: scene.anims.generateFrameNumbers(type, { start: 0, end: 0 }),
                frameRate: 2,
                repeat: -1
            });
            scene.anims.create({
                key: type + '_walk',
                frames: scene.anims.generateFrameNumbers(type, { start: 0, end: 1 }),
                frameRate: 4,
                repeat: -1
            });
        }
        this.sprite.play(type + '_idle');
    }

    get x() { return this.sprite.x; }
    set x(v) { this.sprite.x = v; this.shadow.x = v; }
    get y() { return this.sprite.y; }
    set y(v) { this.sprite.y = v; this.shadow.y = v; this.sprite.setDepth(v); this.shadow.setDepth(v - 1); }

    update(dt, player) {
        if (this.state === STATE_DEAD) return;

        if (this.hurtTimer > 0) {
            this.hurtTimer -= dt;
            if (this.hurtTimer <= 0) this.state = STATE_IDLE;
            this.updateHpBar();
            return;
        }

        // AI
        this.thinkTimer -= dt;
        if (this.thinkTimer <= 0) {
            this.think(player);
            this.thinkTimer = 200 + Math.random() * 300;
        }

        // Move towards target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 5) {
            const mx = (dx / dist) * this.speed * dt / 1000;
            const my = (dy / dist) * this.speed * dt / 1000;
            this.x += mx;
            this.y += my;
            this.y = Phaser.Math.Clamp(this.y, GROUND_Y, GROUND_BOTTOM);
            this.facing = dx > 0 ? DIR_RIGHT : DIR_LEFT;
            this.sprite.flipX = (this.facing === DIR_LEFT);

            if (this.sprite.anims.currentAnim?.key !== this.type + '_walk') {
                this.sprite.play(this.type + '_walk');
            }
        } else {
            if (this.sprite.anims.currentAnim?.key !== this.type + '_idle') {
                this.sprite.play(this.type + '_idle');
            }
        }

        // Try attack
        const px = Math.abs(this.x - player.x);
        const py = Math.abs(this.y - player.y);
        if (px < this.attackRange && py < 20) {
            this.tryAttack(player);
        }

        this.updateHpBar();
    }

    think(player) {
        // Override in subclasses for different behavior
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.aggroRange) {
            // Move towards player with some offset
            this.targetX = player.x - this.facing * 20;
            this.targetY = player.y + (Math.random() - 0.5) * 10;
        } else {
            // Wander
            this.targetX = this.x + (Math.random() - 0.5) * 40;
            this.targetY = this.y + (Math.random() - 0.5) * 20;
        }
    }

    tryAttack(player) {
        const now = Date.now();
        if (now - this.lastAttack < this.attackCooldown) return;
        if (player.state === STATE_DEAD || player.invincible > 0) return;

        this.lastAttack = now;
        this.facing = player.x > this.x ? DIR_RIGHT : DIR_LEFT;
        
        player.takeDamage(this.damage, this.facing);
        this.sprite.setTint(0xffaa00);
        this.scene.time.delayedCall(150, () => {
            if (this.sprite && this.state !== STATE_DEAD) this.sprite.clearTint();
        });
    }

    takeDamage(amount, fromDir) {
        if (this.state === STATE_DEAD) return;
        this.hp -= amount;
        this.state = STATE_HURT;
        this.hurtTimer = 200;

        // Knockback
        this.x += fromDir * 10;

        // Show HP bar
        this.hpBarBg.visible = true;
        this.hpBar.visible = true;

        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(150, () => {
            if (this.sprite && this.state !== STATE_DEAD) this.sprite.clearTint();
        });

        if (this.hp <= 0) {
            this.hp = 0;
            this.die();
        }
    }

    die() {
        this.state = STATE_DEAD;
        
        // Drop weapon if applicable
        if (this.dropWeapon) {
            this.scene.spawnWeapon(this.x, this.y, this.dropWeapon);
        }

        // Callback
        if (this.onDeath) this.onDeath(this);

        // Death animation - fall and fade
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            angle: 90,
            duration: 500,
            onComplete: () => {
                this.sprite.destroy();
                this.shadow.destroy();
                this.hpBar.destroy();
                this.hpBarBg.destroy();
            }
        });
        this.scene.tweens.add({
            targets: this.shadow,
            alpha: 0,
            duration: 500
        });
    }

    updateHpBar() {
        if (!this.hpBarBg || !this.hpBarBg.active) return;
        const barY = this.y - (this.sprite.height || 48) - 8;
        this.hpBarBg.setPosition(this.x, barY);
        this.hpBar.setPosition(this.x - 15, barY);
        const ratio = this.hp / this.maxHp;
        this.hpBar.width = 30 * ratio;
        this.hpBar.fillColor = ratio > 0.5 ? COLOR_HP_GREEN : (ratio > 0.25 ? COLOR_YELLOW : COLOR_HP_RED);
    }
}
