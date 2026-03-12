class TitleScene extends Phaser.Scene {
    constructor() {
        super('TitleScene');
    }

    create() {
        // Dark background
        this.cameras.main.setBackgroundColor('#0a0a15');
        
        // City skyline silhouette
        const g = this.add.graphics();
        g.fillStyle(0x1a1a2a);
        // Buildings silhouette
        g.fillRect(0, 140, 40, 130);
        g.fillRect(45, 120, 50, 150);
        g.fillRect(100, 150, 35, 120);
        g.fillRect(140, 110, 60, 160);
        g.fillRect(210, 130, 45, 140);
        g.fillRect(260, 100, 70, 170);
        g.fillRect(340, 140, 40, 130);
        g.fillRect(385, 120, 55, 150);
        g.fillRect(450, 145, 30, 125);
        
        // Windows (random lit)
        g.fillStyle(0xffee77);
        for (let i = 0; i < 30; i++) {
            const wx = 10 + Math.random() * 460;
            const wy = 120 + Math.random() * 100;
            if (Math.random() > 0.5) {
                g.fillRect(wx, wy, 4, 3);
            }
        }
        
        // Title
        const title1 = this.add.text(GAME_WIDTH / 2, 30, 'УЛИЦЫ', {
            fontSize: '32px', fontFamily: 'monospace', fill: '#ff3333',
            stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5);
        
        const title2 = this.add.text(GAME_WIDTH / 2, 65, 'РАЗБОРОК', {
            fontSize: '28px', fontFamily: 'monospace', fill: '#ff3333',
            stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5);
        
        // Subtitle
        this.add.text(GAME_WIDTH / 2, 95, 'РОССИЯ 90-х', {
            fontSize: '14px', fontFamily: 'monospace', fill: '#aaa',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);
        
        // Flashing start text
        const startText = this.add.text(GAME_WIDTH / 2, 180, 'НАЖМИ ENTER ИЛИ КОСНИСЬ ЭКРАНА', {
            fontSize: '10px', fontFamily: 'monospace', fill: '#fff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: startText,
            alpha: 0.2,
            duration: 600,
            yoyo: true,
            repeat: -1
        });
        
        // Controls info
        this.add.text(GAME_WIDTH / 2, 210, 'WASD/Стрелки - ходить | J/Z - удар | K/X - спец | L/C - подобрать', {
            fontSize: '7px', fontFamily: 'monospace', fill: '#666'
        }).setOrigin(0.5);
        
        this.add.text(GAME_WIDTH / 2, 225, 'ESC - пауза | R - рестарт уровня', {
            fontSize: '7px', fontFamily: 'monospace', fill: '#666'
        }).setOrigin(0.5);
        
        // Title animation
        this.tweens.add({
            targets: title1,
            y: 33,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Input
        this.input.keyboard.on('keydown-ENTER', () => {
            this.scene.start('GameScene', { level: 0 });
        });
        this.input.keyboard.on('keydown-SPACE', () => {
            this.scene.start('GameScene', { level: 0 });
        });
        this.input.on('pointerdown', () => {
            this.scene.start('GameScene', { level: 0 });
        });
    }
}
