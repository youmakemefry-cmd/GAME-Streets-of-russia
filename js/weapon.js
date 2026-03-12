// Dropped weapon class
class DroppedWeapon {
    constructor(scene, x, y, type) {
        this.type = type;
        const textureKey = 'weapon_' + type;
        this.sprite = scene.add.image(x, y - 5, textureKey);
        this.sprite.setDepth(y - 2);
        this.sprite.setOrigin(0.5, 1);
        
        // Bounce effect
        scene.tweens.add({
            targets: this.sprite,
            y: y - 10,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Glow indicator
        this.glow = scene.add.rectangle(x, y - 2, 20, 4, 0xffff00, 0.3);
        this.glow.setDepth(y - 3);
        scene.tweens.add({
            targets: this.glow,
            alpha: 0.1,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }
    
    destroy() {
        if (this.sprite) this.sprite.destroy();
        if (this.glow) this.glow.destroy();
    }
}
