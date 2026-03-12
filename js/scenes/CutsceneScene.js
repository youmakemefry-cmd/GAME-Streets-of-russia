class CutsceneScene extends Phaser.Scene {
    constructor() {
        super('CutsceneScene');
    }

    init(data) {
        this.finalScore = data.score || 0;
    }

    create() {
        this.cameras.main.setBackgroundColor('#2a2a2a');

        // Room interior
        const g = this.add.graphics();
        
        // Floor
        g.fillStyle(0x5a5a4a);
        g.fillRect(0, 180, GAME_WIDTH, 90);
        
        // Walls
        g.fillStyle(0x6a7a6a);
        g.fillRect(0, 0, GAME_WIDTH, 180);
        
        // Wallpaper pattern
        g.fillStyle(0x5a6a5a);
        for (let i = 0; i < GAME_WIDTH; i += 20) {
            g.fillRect(i, 0, 1, 180);
        }
        
        // Window (night outside)
        g.fillStyle(0x3a3a5a);
        g.fillRect(300, 30, 80, 60);
        g.fillStyle(0x0a0a1a);
        g.fillRect(305, 35, 70, 50);
        // Moon through window
        g.fillStyle(0xdde8f0);
        g.fillCircle(350, 50, 8);
        // Curtains
        g.fillStyle(0x8a4a3a);
        g.fillRect(298, 28, 8, 65);
        g.fillRect(374, 28, 8, 65);
        
        // Computer desk
        g.fillStyle(0x6a5a3a);
        g.fillRect(150, 140, 80, 40);
        // Desk legs
        g.fillRect(155, 178, 5, 20);
        g.fillRect(220, 178, 5, 20);
        
        // CRT Monitor
        g.fillStyle(0x4a4a4a);
        g.fillRect(165, 105, 55, 40);
        g.fillStyle(0x2a4a6a);
        g.fillRect(170, 110, 45, 30); // screen
        
        // Keyboard
        g.fillStyle(0x8a8a7a);
        g.fillRect(160, 148, 50, 10);
        
        // Chair
        g.fillStyle(0x3a3a3a);
        g.fillRect(130, 150, 25, 30);
        g.fillRect(135, 178, 15, 20);
        
        // Poster on wall (some band)
        g.fillStyle(0x1a1a1a);
        g.fillRect(50, 40, 40, 55);
        g.fillStyle(0x8a2a2a);
        g.fillRect(55, 45, 30, 25);
        
        // Bottle on desk
        g.fillStyle(0x2a6a2a);
        g.fillRect(210, 130, 6, 14);
        
        // Ashtray
        g.fillStyle(0x5a5a5a);
        g.fillRect(198, 140, 10, 4);

        // Player character sitting at computer
        const player = this.add.sprite(145, 178, 'player_idle', 0);
        player.setOrigin(0.5, 1);
        player.flipX = true;

        // Step 1: Player walks to computer (already there)
        // Step 2: Show screen turning on
        this.time.delayedCall(1000, () => {
            // Screen glow
            const screenGlow = this.add.rectangle(192, 125, 45, 30, 0x4488cc).setDepth(10);
            
            // Loading text on screen
            const loadText = this.add.text(192, 120, 'Загрузка...', {
                fontSize: '6px', fontFamily: 'monospace', fill: '#aaddff'
            }).setOrigin(0.5).setDepth(11);
            
            this.time.delayedCall(1500, () => {
                loadText.setText('Подключение\nк интернету...');
                
                this.time.delayedCall(2000, () => {
                    // Change screen to error
                    screenGlow.fillColor = 0x882222;
                    loadText.setText('');
                    
                    // Error message
                    const errorBg = this.add.rectangle(192, 122, 40, 20, 0xcccccc).setDepth(12);
                    
                    const errorText = this.add.text(192, 118, '⚠ ОШИБКА', {
                        fontSize: '5px', fontFamily: 'monospace', fill: '#ff0000'
                    }).setOrigin(0.5).setDepth(13);
                    
                    const errorMsg = this.add.text(192, 128, 'Пакет\nинтернета\nзакончился!', {
                        fontSize: '4px', fontFamily: 'monospace', fill: '#000', align: 'center'
                    }).setOrigin(0.5).setDepth(13);
                    
                    this.time.delayedCall(2000, () => {
                        // Bigger message overlay
                        const msgBg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 300, 120, 0xdddddd)
                            .setDepth(100);
                        const msgBorder = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 300, 120)
                            .setStrokeStyle(2, 0x333333).setDepth(101);
                        
                        // QIWI terminal style
                        const msgTitle = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, '❌ ИНТЕРНЕТ ОТКЛЮЧЕН', {
                            fontSize: '12px', fontFamily: 'monospace', fill: '#cc0000'
                        }).setOrigin(0.5).setDepth(102);
                        
                        const msgBody = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 10, 
                            'Ваш пакет интернета закончился.\nДля продления оплатите 150₽\nв ближайшем терминале QIWI.', {
                            fontSize: '8px', fontFamily: 'monospace', fill: '#333', align: 'center'
                        }).setOrigin(0.5).setDepth(102);
                        
                        const msgNote = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, 
                            'Ближайший терминал: ТЦ "Копеечка"\nРежим работы: круглосуточно', {
                            fontSize: '7px', fontFamily: 'monospace', fill: '#666', align: 'center'
                        }).setOrigin(0.5).setDepth(102);
                        
                        this.time.delayedCall(3000, () => {
                            // THE END / КОНЕЦ
                            const endBg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0)
                                .setDepth(200);
                            this.tweens.add({
                                targets: endBg, fillAlpha: 0.9, duration: 2000,
                                onComplete: () => {
                                    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, 'КОНЕЦ', {
                                        fontSize: '32px', fontFamily: 'monospace', fill: '#ff3333',
                                        stroke: '#000', strokeThickness: 4
                                    }).setOrigin(0.5).setDepth(201);
                                    
                                    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, 'ИТОГО ОЧКОВ: ' + this.finalScore, {
                                        fontSize: '14px', fontFamily: 'monospace', fill: '#fff',
                                        stroke: '#000', strokeThickness: 2
                                    }).setOrigin(0.5).setDepth(201);
                                    
                                    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 35, 'Такова жизнь в России 90-х...', {
                                        fontSize: '10px', fontFamily: 'monospace', fill: '#aaa',
                                        fontStyle: 'italic'
                                    }).setOrigin(0.5).setDepth(201);
                                    
                                    const back = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, 'НАЖМИ ENTER ДЛЯ ГЛАВНОГО МЕНЮ', {
                                        fontSize: '8px', fontFamily: 'monospace', fill: '#666'
                                    }).setOrigin(0.5).setDepth(201);
                                    this.tweens.add({ targets: back, alpha: 0.3, duration: 500, yoyo: true, repeat: -1 });
                                    
                                    this.input.keyboard.once('keydown-ENTER', () => {
                                        this.scene.start('TitleScene');
                                    });
                                    this.input.once('pointerdown', () => {
                                        this.scene.start('TitleScene');
                                    });
                                }
                            });
                        });
                    });
                });
            });
        });
    }
}
