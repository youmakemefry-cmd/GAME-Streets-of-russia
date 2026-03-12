// player.js - ПОЛНАЯ ВЕРСИЯ
class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.hp = PLAYER_HP;
        this.maxHp = PLAYER_HP;
        this.lives = 3;
        this.score = 0;
        this.state = STATE_IDLE;
        this.facing = DIR_RIGHT;
        this.weapon = null; 
        this.comboCount = 0;
        this.lastAttackTime = 0;
        this.attackCooldown = 0;
        this.hurtTimer = 0;
        this.invincible = 0;
        this.flashTimer = 0;

        this.sprite = scene.add.sprite(x, y, 'player_idle', 0);
        this.sprite.setOrigin(0.5, 1);
        this.sprite.setDepth(y);

        this.shadow = scene.add.ellipse(x, y, 24, 8, 0x000000, 0.3);
        this.shadow.setDepth(y - 1);

        // Инициализация анимаций (если они еще не созданы)
        if (!scene.anims.exists('player_idle_anim')) {
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
        }
    }

    update(dt, cursors, keys) {
        if (this.state === STATE_DEAD) return;

        // Ссылка на виртуальный ввод из HUD
        const vInput = this.scene.virtualInput || {};

        if (this.hurtTimer > 0) this.hurtTimer -= dt;
        if (this.invincible > 0) this.invincible -= dt;
        if (this.attackCooldown > 0) this.attackCooldown -= dt;

        if (this.state === STATE_HURT && this.hurtTimer <= 0) {
            this.state = STATE_IDLE;
        }

        if (this.state !== STATE_ATTACK && this.state !== STATE_HURT) {
            let vx = 0;
            let vy = 0;

            // Комбинируем клавиатуру и джойстик
            const moveLeft = cursors.left.isDown || (keys.a && keys.a.isDown) || vInput.left;
            const moveRight = cursors.right.isDown || (keys.d && keys.d.isDown) || vInput.right;
            const moveUp = cursors.up.isDown || (keys.w && keys.w.isDown) || vInput.up;
            const moveDown = cursors.down.isDown || (keys.s && keys.s.isDown) || vInput.down;

            if (moveLeft) {
                vx = -PLAYER_SPEED;
                this.facing = DIR_LEFT;
            } else if (moveRight) {
                vx = PLAYER_SPEED;
                this.facing = DIR_RIGHT;
            }

            if (moveUp) {
                vy = -PLAYER_SPEED * 0.6;
            } else if (moveDown) {
                vy = PLAYER_SPEED * 0.6;
            }

            if (vx !== 0 || vy !== 0) {
                this.x += vx * (dt / 1000);
                this.y += vy * (dt / 1000);
                this.state = STATE_WALK;
                this.sprite.play('player_walk_anim', true);
            } else {
                this.state = STATE_IDLE;
                this.sprite.play('player_idle_anim', true);
            }

            // Ограничения экрана
            this.y = Phaser.Math.Clamp(this.y, GROUND_Y, GROUND_BOTTOM);
            this.x = Phaser.Math.Clamp(this.x, 20, this.scene.levelWidth - 20);
        }

        // Кнопки действий
        const justAttack = Phaser.Input.Keyboard.JustDown(keys.j) || vInput.attack;
        const justSpecial = Phaser.Input.Keyboard.JustDown(keys.k) || vInput.special;
        const justPickup = Phaser.Input.Keyboard.JustDown(keys.l) || vInput.pickup;

        if (justAttack && this.attackCooldown <= 0) {
            this.attack();
            if (vInput.attack) vInput.attack = false; 
        }
        if (justSpecial) {
            this.specialAttack();
            if (vInput.special) vInput.special = false;
        }
        if (justPickup) {
            this.tryPickup();
            if (vInput.pickup) vInput.pickup = false;
        }

        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.scaleX = this.facing;
        this.sprite.setDepth(this.y);
        this.shadow.x = this.x;
        this.shadow.y = this.y;
    }

    attack() {
        this.state = STATE_ATTACK;
        this.sprite.play('player_attack_anim');
        this.attackCooldown = 300;
        
        this.scene.time.delayedCall(200, () => {
            if (this.state === STATE_ATTACK) this.state = STATE_IDLE;
            // Логика нанесения урона врагам
            this.scene.enemies.forEach(enemy => {
                const dist = Phaser.Math.Distance.Between(this.x, this.y, enemy.x, enemy.y);
                if (dist < 40 && Math.abs(this.y - enemy.y) < 15) {
                    enemy.takeDamage(PLAYER_ATTACK_DMG, this.facing);
                }
            });
        });
    }

    specialAttack() {
        console.log("Спецуха!");
    }

    tryPickup() {
        // Логика подбора оружия (упрощено)
        if (this.scene.droppedWeapons) {
            for (let i = this.scene.droppedWeapons.length - 1; i >= 0; i--) {
                const w = this.scene.droppedWeapons[i];
                if (Phaser.Math.Distance.Between(this.x, this.y, w.sprite.x, w.sprite.y) < 30) {
                    this.weapon = w.type;
                    w.destroy();
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
        this.invincible = 800;
        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => { if (this.sprite) this.sprite.clearTint(); });
        if (this.hp <= 0) this.die();
    }

    die() {
        this.state = STATE_DEAD;
        this.lives--;
        this.sprite.setAngle(90);
        if (this.lives > 0) {
            this.scene.time.delayedCall(2000, () => this.respawn());
        } else {
            this.scene.gameOver();
        }
    }

    respawn() {
        this.hp = PLAYER_HP;
        this.state = STATE_IDLE;
        this.sprite.setAngle(0);
        this.x = this.scene.cameras.main.scrollX + 50;
    }
}