class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create() {
        // Generate all procedural sprites
        SpriteGen.generateAll(this);
        // Generate all backgrounds
        BackgroundGen.generateAll(this);
        
        // Generate a simple 1px white texture for particles/effects
        const px = document.createElement('canvas');
        px.width = 4; px.height = 4;
        const pctx = px.getContext('2d');
        pctx.fillStyle = '#fff';
        pctx.fillRect(0, 0, 4, 4);
        this.textures.addCanvas('pixel', px);

        this.scene.start('TitleScene');
    }
}
