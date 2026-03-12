// Main game configuration
const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: document.body,
    backgroundColor: '#0a0a0a',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, TitleScene, GameScene, CutsceneScene],
    audio: {
        disableWebAudio: false
    },
    input: {
        keyboard: true,
        touch: true
    }
};

const game = new Phaser.Game(config);
