class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.currentLevel = data.level || 0;
        this.carryOverScore = data.score || 0;
        this.carryOverLives = data.lives || 3;
    }

    create() {
        const levelData = LEVELS[this.currentLevel];
        this.levelData = levelData;
        this.levelWidth = levelData.width;

        // Background - tile it
        this.bgImage = this.add.tileSprite(0, 0, levelData.width, GAME_HEIGHT, levelData.background);
        this.bgImage.setOrigin(0, 0);
        this.bgImage.setScrollFactor(0.5); // parallax

        // Ground area visual (slightly darker strip)
        const ground = this.add.rectangle(levelData.width / 2, (GROUND_Y + GROUND_BOTTOM) / 2, levelData.width, GROUND_BOTTOM - GROUND_Y, 0x000000, 0.1);
        ground.setDepth(0);

        // Props
        this.props = [];
        if (levelData.props) {
            levelData.props.forEach(p => {
                const prop = this.add.image(p.x, p.y, p.type);
                prop.setOrigin(0.5, 1);
                prop.setDepth(p.y);
                this.props.push(prop);
            });
        }

        // Player
        this.player = new Player(this, 60, 210);
        this.player.score = this.carryOverScore;
        this.player.lives = this.carryOverLives;

        // Enemies
        this.enemies = [];
        this.droppedWeapons = [];
        this.activeWaves = [...levelData.waves];
        this.bossWave = levelData.boss;
        this.bossSpawned = false;
        this.bossEnemy = null;
        this.allEnemiesCleared = false;
        this.levelComplete = false;

        // Camera
        this.cameras.main.setBounds(0, 0, levelData.width, GAME_HEIGHT);
        this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(50, 50);

        // HUD
        this.hud = new HUD(this);
        this.hud.setLevelName(levelData.name);

        // Snow effect for winter level
        if (levelData.snowEffect) {
            this.snowParticles = [];
            for (let i = 0; i < 60; i++) {
                const s = this.add.rectangle(
                    Math.random() * GAME_WIDTH, Math.random() * GAME_HEIGHT,
                    2, 2, 0xffffff, 0.6
                ).setScrollFactor(0).setDepth(4000);
                this.snowParticles.push({
                    obj: s,
                    speedX: (Math.random() - 0.5) * 20,
                    speedY: 20 + Math.random() * 40
                });
            }
        }

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = {
            w: this.input.keyboard.addKey('W'),
            a: this.input.keyboard.addKey('A'),
            s: this.input.keyboard.addKey('S'),
            d: this.input.keyboard.addKey('D'),
            j: this.input.keyboard.addKey('J'),
            k: this.input.keyboard.addKey('K'),
            l: this.input.keyboard.addKey('L'),
            z: this.input.keyboard.addKey('Z'),
            x: this.input.keyboard.addKey('X'),
            c: this.input.keyboard.addKey('C'),
            r: this.input.keyboard.addKey('R'),
            esc: this.input.keyboard.addKey('ESC'),
        };

        // Pause
        this.paused = false;
        this.pauseOverlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6)
            .setScrollFactor(0).setDepth(9000).setVisible(false);
        this.pauseText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'ПАУЗА', {
            fontSize: '24px', fontFamily: 'monospace', fill: '#fff',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(9001).setVisible(false);

        // Virtual input for mobile
        this.virtualInput = this.virtualInput || { up: false, down: false, left: false, right: false, attack: false, special: false, pickup: false };

        // Game over overlay
        this.isGameOver = false;

        // Level intro text
        this.showLevelIntro(levelData);

        // Camera scroll lock system (SoR-style)
        this.scrollLocked = false;
        this.scrollLockX = 0;
    }

    showLevelIntro(levelData) {
        const bg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.8)
            .setScrollFactor(0).setDepth(8000);
        const t1 = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 15, 'УРОВЕНЬ ' + levelData.id, {
            fontSize: '20px', fontFamily: 'monospace', fill: '#ff3333',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(8001);
        const t2 = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 15, levelData.name, {
            fontSize: '14px', fontFamily: 'monospace', fill: '#fff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0).setDepth(8001);

        this.time.delayedCall(2000, () => {
            this.tweens.add({ targets: [bg, t1, t2], alpha: 0, duration: 500, onComplete: () => { bg.destroy(); t1.destroy(); t2.destroy(); }});
        });
    }

    update(time, delta) {
        if (this.isGameOver) return;

        // Pause toggle
        if (Phaser.Input.Keyboard.JustDown(this.keys.esc)) {
            this.paused = !this.paused;
            this.pauseOverlay.setVisible(this.paused);
            this.pauseText.setVisible(this.paused);
        }
        if (this.paused) return;

        // Restart
        if (Phaser.Input.Keyboard.JustDown(this.keys.r)) {
            this.scene.restart({ level: this.currentLevel, score: 0, lives: 3 });
            return;
        }

        // Merge virtual input with keyboard for mobile
        const vi = this.virtualInput;
        if (vi.up) this.cursors.up.isDown = true;
        if (vi.down) this.cursors.down.isDown = true;
        if (vi.left) this.keys.a.isDown = true;
        if (vi.right) this.keys.d.isDown = true;

        // Update player
        this.player.update(delta, this.cursors, this.keys);

        // Mobile attack/special/pickup
        if (vi.attack) { 
            if (!this._lastVAttack) this.player.attack();
            this._lastVAttack = true;
        } else { this._lastVAttack = false; }
        if (vi.special) {
            if (!this._lastVSpecial) this.player.specialAttack();
            this._lastVSpecial = true;
        } else { this._lastVSpecial = false; }
        if (vi.pickup) {
            if (!this._lastVPickup) this.player.tryPickup();
            this._lastVPickup = true;
        } else { this._lastVPickup = false; }

        // Spawn waves based on player X position
        const px = this.player.x;
        for (let i = this.activeWaves.length - 1; i >= 0; i--) {
            const wave = this.activeWaves[i];
            if (px >= wave.triggerX) {
                this.spawnWave(wave);
                this.activeWaves.splice(i, 1);
            }
        }

        // Boss spawn
        if (!this.bossSpawned && this.bossWave && px >= this.bossWave.triggerX) {
            this.spawnBoss();
        }

        // Lock camera scroll when enemies alive (SoR style)
        const aliveEnemies = this.enemies.filter(e => e.state !== STATE_DEAD);
        if (aliveEnemies.length > 0 && !this.scrollLocked) {
            // Don't lock if we just spawned
        }

        // Update enemies
        this.enemies.forEach(e => e.update(delta, this.player));

        // Clean dead enemies
        this.enemies = this.enemies.filter(e => e.state !== STATE_DEAD || e.sprite.active);

        // Show GO arrow when all current enemies dead and more waves remain
        const enemiesAlive = this.enemies.some(e => e.state !== STATE_DEAD);
        this.hud.showGo(!enemiesAlive && (this.activeWaves.length > 0 || (!this.bossSpawned && this.bossWave)));

        // Update HUD
        this.hud.update(this.player, this.bossEnemy);

        // Snow
        if (this.snowParticles) {
            this.snowParticles.forEach(s => {
                s.obj.x += s.speedX * delta / 1000;
                s.obj.y += s.speedY * delta / 1000;
                if (s.obj.y > GAME_HEIGHT) { s.obj.y = -5; s.obj.x = Math.random() * GAME_WIDTH; }
                if (s.obj.x > GAME_WIDTH) s.obj.x = 0;
                if (s.obj.x < 0) s.obj.x = GAME_WIDTH;
            });
        }

        // Check level complete
        if (this.bossSpawned && !enemiesAlive && !this.levelComplete) {
            this.levelComplete = true;
            this.onLevelComplete();
        }
    }

    spawnWave(wave) {
        wave.enemies.forEach(eData => {
            const enemy = this.createEnemy(eData);
            this.enemies.push(enemy);
        });
    }

    spawnBoss() {
        this.bossSpawned = true;
        
        // Boss intro flash
        this.cameras.main.flash(300, 255, 0, 0, false, null, 0.3);
        
        // Show "BOSS" warning
        const warn = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, '⚠ ОСТОРОЖНО ⚠', {
            fontSize: '16px', fontFamily: 'monospace', fill: '#ff0000',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5).setScrollFactor(0).setDepth(7000);
        
        this.tweens.add({
            targets: warn, alpha: 0, duration: 2000,
            onComplete: () => warn.destroy()
        });

        this.bossWave.enemies.forEach(eData => {
            const enemy = this.createEnemy(eData);
            this.enemies.push(enemy);
            if (eData.isBoss) {
                this.bossEnemy = enemy;
            }
        });
    }

    createEnemy(data) {
        const classes = {
            gopnik: Gopnik,
            narik: Narik,
            skinhead: Skinhead,
            magomed: Magomed,
            ment: Ment,
            omon: Omon
        };
        const EnemyClass = classes[data.type] || Gopnik;
        return new EnemyClass(this, data.x, data.y, data.isBoss || false);
    }

    spawnWeapon(x, y, type) {
        const w = new DroppedWeapon(this, x, y, type);
        this.droppedWeapons.push(w);
    }

    showHitEffect(x, y) {
        // Simple hit spark
        const spark = this.add.text(x, y, '💥', { fontSize: '16px' }).setOrigin(0.5).setDepth(3000);
        this.tweens.add({
            targets: spark,
            alpha: 0, y: y - 15, scaleX: 1.5, scaleY: 1.5,
            duration: 300,
            onComplete: () => spark.destroy()
        });
        
        // Damage number
        const dmgText = this.add.text(x + (Math.random() - 0.5) * 10, y - 10, '!', {
            fontSize: '10px', fontFamily: 'monospace', fill: '#ff0',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(3001);
        this.tweens.add({
            targets: dmgText,
            alpha: 0, y: y - 30,
            duration: 500,
            onComplete: () => dmgText.destroy()
        });
    }

    onLevelComplete() {
        // Victory!
        const nextLevel = this.currentLevel + 1;
        
        if (nextLevel >= LEVELS.length) {
            // Game completed! Show ending cutscene
            this.time.delayedCall(1500, () => {
                this.scene.start('CutsceneScene', { score: this.player.score });
            });
        } else {
            // Show stage clear
            const clear = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'УРОВЕНЬ ПРОЙДЕН!', {
                fontSize: '18px', fontFamily: 'monospace', fill: '#00ff00',
                stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5).setScrollFactor(0).setDepth(8000);

            this.time.delayedCall(2500, () => {
                clear.destroy();
                this.scene.start('GameScene', {
                    level: nextLevel,
                    score: this.player.score,
                    lives: this.player.lives
                });
            });
        }
    }

    gameOver() {
        this.isGameOver = true;
        
        const bg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.8)
            .setScrollFactor(0).setDepth(9000);
        
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, 'ИГРА ОКОНЧЕНА', {
            fontSize: '24px', fontFamily: 'monospace', fill: '#ff0000',
            stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(9001);
        
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, 'ОЧКИ: ' + this.player.score, {
            fontSize: '14px', fontFamily: 'monospace', fill: '#fff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0).setDepth(9001);
        
        const retry = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, 'НАЖМИ ENTER ДЛЯ РЕСТАРТА', {
            fontSize: '10px', fontFamily: 'monospace', fill: '#aaa'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(9001);
        
        this.tweens.add({ targets: retry, alpha: 0.3, duration: 500, yoyo: true, repeat: -1 });
        
        this.input.keyboard.once('keydown-ENTER', () => {
            this.scene.start('GameScene', { level: this.currentLevel, score: 0, lives: 3 });
        });
        this.input.once('pointerdown', () => {
            this.scene.start('GameScene', { level: this.currentLevel, score: 0, lives: 3 });
        });
    }
}
