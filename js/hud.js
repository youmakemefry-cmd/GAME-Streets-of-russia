// hud.js - ПОЛНАЯ ВЕРСИЯ С ДЖОЙСТИКОМ
class HUD {
    constructor(scene) {
        this.scene = scene;
        const ui = scene.add.container(0, 0).setScrollFactor(0).setDepth(5000);
        
        // --- Стандартные элементы интерфейса ---
        this.nameText = scene.add.text(10, 6, 'СЕРЁГА', { fontSize: '10px', fill: '#fff', stroke: '#000', strokeThickness: 2 });
        ui.add(this.nameText);
        
        this.hpBg = scene.add.rectangle(10, 20, 80, 8, 0x333333).setOrigin(0, 0);
        this.hpFill = scene.add.rectangle(10, 20, 80, 8, 0x00ff00).setOrigin(0, 0);
        ui.add([this.hpBg, this.hpFill]);
        
        this.livesText = scene.add.text(10, 32, '❤❤❤', { fontSize: '10px', fill: '#ff4444' });
        ui.add(this.livesText);
        
        this.scoreText = scene.add.text(GAME_WIDTH - 10, 6, 'ОЧКИ: 0', { fontSize: '10px', fill: '#fff' }).setOrigin(1, 0);
        ui.add(this.scoreText);

        this.weaponText = scene.add.text(10, 44, '', { fontSize: '9px', fill: '#ffff00' });
        ui.add(this.weaponText);

        // Босс-бар
        this.bossNameText = scene.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 30, '', { fontSize: '10px', fill: '#ff4444' }).setOrigin(0.5, 0).setVisible(false);
        this.bossHpFill = scene.add.rectangle(GAME_WIDTH / 2 - 60, GAME_HEIGHT - 18, 120, 8, 0xff0000).setOrigin(0, 0).setVisible(false);
        ui.add([this.bossNameText, this.bossHpFill]);

        // Стрелка GO
        this.goArrow = scene.add.text(GAME_WIDTH - 30, GAME_HEIGHT / 2, '▶', { fontSize: '20px', fill: '#ffff00' }).setOrigin(0.5).setVisible(false);
        ui.add(this.goArrow);

        // --- МОБИЛЬНОЕ УПРАВЛЕНИЕ (ДЖОЙСТИК) ---
        this.setupMobileControls(scene, ui);
        this.ui = ui;
    }

    setupMobileControls(scene, ui) {
        if (!scene.sys.game.device.input.touch) return;

        // Разрешаем мультитач
        scene.input.addPointer(2);

        // Объект ввода для игрока
        scene.virtualInput = { left: false, right: false, up: false, down: false, attack: false, special: false, pickup: false };

        // Графика джойстика
        this.joyBase = scene.add.circle(0, 0, 35, 0xffffff, 0.15).setVisible(false).setDepth(6000);
        this.joyThumb = scene.add.circle(0, 0, 15, 0xffffff, 0.4).setVisible(false).setDepth(6001);
        ui.add([this.joyBase, this.joyThumb]);

        // Зона джойстика (левая половина экрана)
        const joyZone = scene.add.rectangle(0, 0, GAME_WIDTH / 2, GAME_HEIGHT).setOrigin(0, 0).setInteractive();
        
        joyZone.on('pointerdown', (pointer) => {
            this.joyBase.setPosition(pointer.x, pointer.y).setVisible(true);
            this.joyThumb.setPosition(pointer.x, pointer.y).setVisible(true);
            this.isDragging = true;
        });

        scene.input.on('pointermove', (pointer) => {
            if (!this.isDragging) return;
            
            // Если палец ушел в правую часть, но начинал в левой - продолжаем
            const dist = Phaser.Math.Distance.Between(this.joyBase.x, this.joyBase.y, pointer.x, pointer.y);
            const angle = Phaser.Math.Angle.Between(this.joyBase.x, this.joyBase.y, pointer.x, pointer.y);
            const maxDist = 30;

            const targetX = this.joyBase.x + Math.cos(angle) * Math.min(dist, maxDist);
            const targetY = this.joyBase.y + Math.sin(angle) * Math.min(dist, maxDist);
            
            this.joyThumb.setPosition(targetX, targetY);

            // Мертвая зона
            if (dist > 5) {
                scene.virtualInput.left = (targetX < this.joyBase.x - 10);
                scene.virtualInput.right = (targetX > this.joyBase.x + 10);
                scene.virtualInput.up = (targetY < this.joyBase.y - 10);
                scene.virtualInput.down = (targetY > this.joyBase.y + 10);
            }
        });

        const stopJoy = () => {
            this.isDragging = false;
            this.joyBase.setVisible(false);
            this.joyThumb.setVisible(false);
            scene.virtualInput.left = false;
            scene.virtualInput.right = false;
            scene.virtualInput.up = false;
            scene.virtualInput.down = false;
        };

        scene.input.on('pointerup', stopJoy);
        scene.input.on('pointerupall', stopJoy);

        // Кнопки действий (справа)
        const btnAlpha = 0.4;
        const createActionButton = (x, y, radius, color, label, key) => {
            const btn = scene.add.circle(x, y, radius, color, btnAlpha).setInteractive().setDepth(6000);
            const txt = scene.add.text(x, y, label, { fontSize: '12px', fill: '#fff' }).setOrigin(0.5).setDepth(6001);
            ui.add([btn, txt]);

            btn.on('pointerdown', () => { scene.virtualInput[key] = true; btn.setAlpha(0.8); });
            btn.on('pointerup', () => { scene.virtualInput[key] = false; btn.setAlpha(btnAlpha); });
            btn.on('pointerout', () => { scene.virtualInput[key] = false; btn.setAlpha(btnAlpha); });
        };

        createActionButton(GAME_WIDTH - 45, GAME_HEIGHT - 45, 22, 0xff4444, 'A', 'attack');
        createActionButton(GAME_WIDTH - 85, GAME_HEIGHT - 35, 16, 0x4444ff, 'S', 'special');
        createActionButton(GAME_WIDTH - 85, GAME_HEIGHT - 75, 16, 0x44ff44, 'P', 'pickup');
    }

    update(player, boss) {
        const hpRatio = Phaser.Math.Clamp(player.hp / player.maxHp, 0, 1);
        this.hpFill.width = 80 * hpRatio;
        this.hpFill.fillColor = hpRatio > 0.5 ? 0x00ff00 : (hpRatio > 0.25 ? 0xffff00 : 0xff0000);
        this.livesText.setText('❤'.repeat(Math.max(0, player.lives)));
        this.scoreText.setText('ОЧКИ: ' + player.score);
        
        if (player.weapon) {
            this.weaponText.setText('🔪 ОРУЖИЕ: ' + player.weapon.toUpperCase());
        } else {
            this.weaponText.setText('');
        }

        if (boss && boss.hp > 0) {
            this.bossNameText.setVisible(true).setText(boss.type.toUpperCase());
            this.bossHpFill.setVisible(true).width = 120 * (boss.hp / boss.maxHp);
        } else {
            this.bossNameText.setVisible(false);
            this.bossHpFill.setVisible(false);
        }
    }

    showGo(visible) { this.goArrow.setVisible(visible); }
    setLevelName(name) { /* Доп. логика по желанию */ }
}