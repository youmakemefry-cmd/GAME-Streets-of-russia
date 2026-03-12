// Procedural sprite generator - creates all game sprites as pixel art on canvas
// Every sprite can be replaced with a real PNG later in assets/sprites/

const SpriteGen = {
    // Helper to create a small canvas and return it
    makeCanvas(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        return c;
    },

    drawRect(ctx, x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    },

    // ---- PLAYER ----
    generatePlayer(scene) {
        // idle frame 32x48
        const frames = [];
        for (let f = 0; f < 4; f++) {
            const c = this.makeCanvas(32, 48);
            const ctx = c.getContext('2d');
            // Legs (dark jeans)
            this.drawRect(ctx, 10, 32, 5, 14, '#2a2a4a');
            this.drawRect(ctx, 17, 32, 5, 14, '#2a2a4a');
            // Shoes
            this.drawRect(ctx, 9, 44, 7, 4, '#1a1a1a');
            this.drawRect(ctx, 16, 44, 7, 4, '#1a1a1a');
            // Body (dark jacket)
            this.drawRect(ctx, 8, 16, 16, 18, '#3a3a3a');
            // Arms
            this.drawRect(ctx, 4, 18, 5, 12, '#3a3a3a');
            this.drawRect(ctx, 23, 18, 5, 12, '#3a3a3a');
            // Head (skin)
            this.drawRect(ctx, 10, 4, 12, 12, '#d4a574');
            // Beanie (шапка)
            this.drawRect(ctx, 9, 1, 14, 6, '#1a1a3a');
            // Eyes
            this.drawRect(ctx, 13, 9, 2, 2, '#000');
            this.drawRect(ctx, 19, 9, 2, 2, '#000');
            // Cigarette
            if (f % 2 === 0) {
                this.drawRect(ctx, 22, 13, 6, 1, '#fff');
                this.drawRect(ctx, 27, 12, 2, 1, '#ff4400');
            }
            // Walkman wire
            this.drawRect(ctx, 14, 16, 1, 8, '#555');
            // Headphone buds at ears
            this.drawRect(ctx, 9, 8, 2, 2, '#222');
            this.drawRect(ctx, 21, 8, 2, 2, '#222');
            
            frames.push(c);
        }
        return frames;
    },

    generatePlayerWalk(scene) {
        const frames = [];
        for (let f = 0; f < 4; f++) {
            const c = this.makeCanvas(32, 48);
            const ctx = c.getContext('2d');
            const legOffset = (f % 2 === 0) ? 2 : -2;
            // Legs walking
            this.drawRect(ctx, 10 + legOffset, 32, 5, 14, '#2a2a4a');
            this.drawRect(ctx, 17 - legOffset, 32, 5, 14, '#2a2a4a');
            this.drawRect(ctx, 9 + legOffset, 44, 7, 4, '#1a1a1a');
            this.drawRect(ctx, 16 - legOffset, 44, 7, 4, '#1a1a1a');
            // Body
            this.drawRect(ctx, 8, 16, 16, 18, '#3a3a3a');
            this.drawRect(ctx, 4, 18, 5, 12, '#3a3a3a');
            this.drawRect(ctx, 23, 18, 5, 12, '#3a3a3a');
            // Head
            this.drawRect(ctx, 10, 4, 12, 12, '#d4a574');
            this.drawRect(ctx, 9, 1, 14, 6, '#1a1a3a');
            this.drawRect(ctx, 13, 9, 2, 2, '#000');
            this.drawRect(ctx, 19, 9, 2, 2, '#000');
            this.drawRect(ctx, 22, 13, 6, 1, '#fff');
            this.drawRect(ctx, 27, 12, 2, 1, '#ff4400');
            this.drawRect(ctx, 14, 16, 1, 8, '#555');
            this.drawRect(ctx, 9, 8, 2, 2, '#222');
            this.drawRect(ctx, 21, 8, 2, 2, '#222');
            frames.push(c);
        }
        return frames;
    },

    generatePlayerAttack(scene) {
        const frames = [];
        for (let f = 0; f < 3; f++) {
            const c = this.makeCanvas(48, 48);
            const ctx = c.getContext('2d');
            // Legs
            this.drawRect(ctx, 10, 32, 5, 14, '#2a2a4a');
            this.drawRect(ctx, 17, 32, 5, 14, '#2a2a4a');
            this.drawRect(ctx, 9, 44, 7, 4, '#1a1a1a');
            this.drawRect(ctx, 16, 44, 7, 4, '#1a1a1a');
            // Body
            this.drawRect(ctx, 8, 16, 16, 18, '#3a3a3a');
            // Back arm
            this.drawRect(ctx, 4, 18, 5, 12, '#3a3a3a');
            // Punch arm extending
            const punchExt = f * 6;
            this.drawRect(ctx, 23, 20 - f * 2, 5 + punchExt, 5, '#3a3a3a');
            // Fist
            this.drawRect(ctx, 27 + punchExt, 19 - f * 2, 5, 6, '#d4a574');
            // Head
            this.drawRect(ctx, 10, 4, 12, 12, '#d4a574');
            this.drawRect(ctx, 9, 1, 14, 6, '#1a1a3a');
            this.drawRect(ctx, 13, 9, 2, 2, '#000');
            this.drawRect(ctx, 19, 9, 2, 2, '#000');
            frames.push(c);
        }
        return frames;
    },

    // ---- ENEMIES ----
    generateGopnik(scene) {
        // Drunk gopnik - tracksuit, squatting posture implied
        const frames = [];
        for (let f = 0; f < 2; f++) {
            const c = this.makeCanvas(32, 48);
            const ctx = c.getContext('2d');
            // Legs (adidas-style tracksuit)
            this.drawRect(ctx, 10, 32, 5, 14, '#1a1a6a');
            this.drawRect(ctx, 17, 32, 5, 14, '#1a1a6a');
            // White stripes on pants
            this.drawRect(ctx, 14, 32, 1, 14, '#fff');
            this.drawRect(ctx, 21, 32, 1, 14, '#fff');
            this.drawRect(ctx, 9, 44, 7, 4, '#fff'); // white sneakers
            this.drawRect(ctx, 16, 44, 7, 4, '#fff');
            // Body (tracksuit top)
            this.drawRect(ctx, 8, 16, 16, 18, '#1a1a6a');
            // White stripes on jacket
            this.drawRect(ctx, 8, 16, 1, 18, '#fff');
            this.drawRect(ctx, 23, 16, 1, 18, '#fff');
            // Arms
            this.drawRect(ctx, 4, 18, 5, 12, '#1a1a6a');
            this.drawRect(ctx, 23, 18, 5, 12, '#1a1a6a');
            // Head (ruddy skin - drunk)
            this.drawRect(ctx, 10, 4, 12, 12, '#e8a070');
            // Flat cap (кепка)
            this.drawRect(ctx, 8, 2, 16, 5, '#2a2a2a');
            this.drawRect(ctx, 6, 5, 6, 2, '#2a2a2a'); // visor
            // Red nose (drunk)
            this.drawRect(ctx, 15, 10, 3, 3, '#ff4444');
            // Eyes (squinty)
            this.drawRect(ctx, 12, 8, 3, 1, '#000');
            this.drawRect(ctx, 19, 8, 3, 1, '#000');
            // Bottle in hand sometimes
            if (f === 1) {
                this.drawRect(ctx, 1, 22, 3, 8, '#3a6a3a');
            }
            frames.push(c);
        }
        return frames;
    },

    generateNarik(scene) {
        // Drug addict - skinny, hoodie
        const frames = [];
        for (let f = 0; f < 2; f++) {
            const c = this.makeCanvas(32, 48);
            const ctx = c.getContext('2d');
            // Thin legs
            this.drawRect(ctx, 11, 32, 4, 14, '#2a2a2a');
            this.drawRect(ctx, 18, 32, 4, 14, '#2a2a2a');
            this.drawRect(ctx, 10, 44, 6, 4, '#3a2a1a');
            this.drawRect(ctx, 17, 44, 6, 4, '#3a2a1a');
            // Skinny body (dirty hoodie)
            this.drawRect(ctx, 9, 16, 14, 18, '#4a4a2a');
            // Hood up
            this.drawRect(ctx, 8, 2, 16, 14, '#4a4a2a');
            // Gaunt face inside hood
            this.drawRect(ctx, 11, 5, 10, 10, '#c89a60');
            // Sunken eyes
            this.drawRect(ctx, 13, 8, 2, 2, '#000');
            this.drawRect(ctx, 18, 8, 2, 2, '#000');
            // Dark circles under eyes
            this.drawRect(ctx, 13, 10, 2, 1, '#6a4a3a');
            this.drawRect(ctx, 18, 10, 2, 1, '#6a4a3a');
            // Thin arms
            this.drawRect(ctx, 5, 18, 4, 12, '#4a4a2a');
            this.drawRect(ctx, 23, 18, 4, 12, '#4a4a2a');
            // Knife in hand
            if (f === 0) {
                this.drawRect(ctx, 26, 28, 2, 8, '#aaa');
                this.drawRect(ctx, 25, 26, 4, 3, '#6a4a1a');
            }
            frames.push(c);
        }
        return frames;
    },

    generateSkinhead(scene) {
        const frames = [];
        for (let f = 0; f < 2; f++) {
            const c = this.makeCanvas(36, 52);
            const ctx = c.getContext('2d');
            // Heavy boots
            this.drawRect(ctx, 9, 44, 8, 8, '#1a1a1a');
            this.drawRect(ctx, 19, 44, 8, 8, '#1a1a1a');
            // Jeans with suspenders
            this.drawRect(ctx, 10, 30, 7, 16, '#2a3a6a');
            this.drawRect(ctx, 19, 30, 7, 16, '#2a3a6a');
            // Body (bomber jacket)
            this.drawRect(ctx, 7, 14, 22, 18, '#2a4a2a');
            // Thick arms
            this.drawRect(ctx, 2, 16, 6, 14, '#2a4a2a');
            this.drawRect(ctx, 28, 16, 6, 14, '#2a4a2a');
            // Bald head
            this.drawRect(ctx, 11, 2, 14, 13, '#e0b080');
            // Angry eyes
            this.drawRect(ctx, 14, 7, 3, 2, '#000');
            this.drawRect(ctx, 20, 7, 3, 2, '#000');
            // Angry brow
            this.drawRect(ctx, 13, 6, 4, 1, '#000');
            this.drawRect(ctx, 20, 6, 4, 1, '#000');
            // Mouth (yelling)
            this.drawRect(ctx, 16, 11, 5, 2, '#8a2a1a');
            // Bat
            this.drawRect(ctx, 30, 8, 3, 22, '#8a6a3a');
            frames.push(c);
        }
        return frames;
    },

    generateMagomed(scene) {
        const frames = [];
        for (let f = 0; f < 2; f++) {
            const c = this.makeCanvas(32, 48);
            const ctx = c.getContext('2d');
            // Dress shoes
            this.drawRect(ctx, 9, 44, 7, 4, '#1a1a1a');
            this.drawRect(ctx, 16, 44, 7, 4, '#1a1a1a');
            // Pants (black)
            this.drawRect(ctx, 10, 32, 5, 14, '#1a1a1a');
            this.drawRect(ctx, 17, 32, 5, 14, '#1a1a1a');
            // Leather jacket
            this.drawRect(ctx, 8, 16, 16, 18, '#2a1a1a');
            // Arms
            this.drawRect(ctx, 4, 18, 5, 12, '#2a1a1a');
            this.drawRect(ctx, 23, 18, 5, 12, '#2a1a1a');
            // Head (darker skin)
            this.drawRect(ctx, 10, 4, 12, 12, '#c08a50');
            // Кепка (cap)
            this.drawRect(ctx, 8, 2, 16, 5, '#1a1a1a');
            this.drawRect(ctx, 6, 5, 6, 2, '#1a1a1a');
            // Big mustache
            this.drawRect(ctx, 12, 11, 9, 3, '#1a1a1a');
            // Eyes
            this.drawRect(ctx, 13, 8, 2, 2, '#000');
            this.drawRect(ctx, 19, 8, 2, 2, '#000');
            // Phone (when calling)
            if (f === 1) {
                this.drawRect(ctx, 1, 18, 3, 5, '#333');
                this.drawRect(ctx, 1, 17, 3, 1, '#4a4a4a');
            }
            frames.push(c);
        }
        return frames;
    },

    generateMent(scene) {
        const frames = [];
        for (let f = 0; f < 2; f++) {
            const c = this.makeCanvas(36, 52);
            const ctx = c.getContext('2d');
            // Boots
            this.drawRect(ctx, 10, 44, 7, 8, '#1a1a1a');
            this.drawRect(ctx, 19, 44, 7, 8, '#1a1a1a');
            // Uniform pants
            this.drawRect(ctx, 11, 30, 6, 16, '#2a3a5a');
            this.drawRect(ctx, 19, 30, 6, 16, '#2a3a5a');
            // Uniform top (militsiya gray-blue)
            this.drawRect(ctx, 8, 14, 20, 18, '#4a5a7a');
            // Belt
            this.drawRect(ctx, 8, 30, 20, 2, '#3a2a1a');
            // Arms
            this.drawRect(ctx, 3, 16, 6, 14, '#4a5a7a');
            this.drawRect(ctx, 27, 16, 6, 14, '#4a5a7a');
            // Head
            this.drawRect(ctx, 11, 2, 14, 13, '#d4a574');
            // Militsiya cap
            this.drawRect(ctx, 9, 0, 18, 5, '#2a3a5a');
            this.drawRect(ctx, 9, 4, 18, 2, '#1a1a1a'); // visor
            // Badge on cap
            this.drawRect(ctx, 16, 1, 4, 3, '#ccaa00');
            // Stern face
            this.drawRect(ctx, 14, 7, 2, 2, '#000');
            this.drawRect(ctx, 20, 7, 2, 2, '#000');
            this.drawRect(ctx, 15, 11, 6, 1, '#8a5a4a');
            // Baton or gun
            if (f === 0) {
                this.drawRect(ctx, 30, 18, 3, 14, '#2a2a2a');
            } else {
                this.drawRect(ctx, 30, 20, 8, 3, '#3a3a3a');
                this.drawRect(ctx, 37, 21, 2, 1, '#ff0');
            }
            frames.push(c);
        }
        return frames;
    },

    generateOmon(scene) {
        const frames = [];
        for (let f = 0; f < 2; f++) {
            const c = this.makeCanvas(40, 56);
            const ctx = c.getContext('2d');
            // Heavy boots
            this.drawRect(ctx, 10, 48, 9, 8, '#1a1a1a');
            this.drawRect(ctx, 21, 48, 9, 8, '#1a1a1a');
            // Armored legs
            this.drawRect(ctx, 11, 32, 8, 18, '#3a4a3a');
            this.drawRect(ctx, 21, 32, 8, 18, '#3a4a3a');
            // Armored body (bulky)
            this.drawRect(ctx, 6, 12, 28, 22, '#3a4a3a');
            // Chest armor plate
            this.drawRect(ctx, 10, 14, 20, 16, '#4a5a4a');
            // ОМОН text area
            this.drawRect(ctx, 13, 18, 14, 4, '#fff');
            // Arms (thick armored)
            this.drawRect(ctx, 1, 14, 6, 16, '#3a4a3a');
            this.drawRect(ctx, 33, 14, 6, 16, '#3a4a3a');
            // Helmet
            this.drawRect(ctx, 10, 0, 20, 14, '#3a4a3a');
            // Visor
            this.drawRect(ctx, 12, 6, 16, 5, '#1a3a5a');
            // AK-47
            this.drawRect(ctx, 34, 18, 6, 3, '#4a3a2a');
            this.drawRect(ctx, 34, 15, 2, 6, '#2a2a2a');
            if (f === 1) {
                // Muzzle flash
                this.drawRect(ctx, 39, 17, 4, 5, '#ff8800');
                this.drawRect(ctx, 38, 18, 6, 3, '#ffff00');
            }
            frames.push(c);
        }
        return frames;
    },

    // ---- WEAPONS ----
    generateKnife(scene) {
        const c = this.makeCanvas(16, 16);
        const ctx = c.getContext('2d');
        this.drawRect(ctx, 2, 7, 6, 3, '#8a6a3a'); // handle
        this.drawRect(ctx, 7, 7, 8, 2, '#ccc'); // blade
        this.drawRect(ctx, 14, 7, 2, 1, '#eee'); // tip
        return c;
    },

    generateBat(scene) {
        const c = this.makeCanvas(16, 32);
        const ctx = c.getContext('2d');
        this.drawRect(ctx, 6, 0, 5, 24, '#8a6a3a');
        this.drawRect(ctx, 5, 24, 7, 6, '#6a4a2a'); // grip
        this.drawRect(ctx, 7, 30, 3, 2, '#444'); // end cap
        return c;
    },

    generatePistol(scene) {
        const c = this.makeCanvas(16, 12);
        const ctx = c.getContext('2d');
        this.drawRect(ctx, 0, 2, 12, 4, '#3a3a3a'); // barrel
        this.drawRect(ctx, 2, 5, 8, 6, '#2a2a2a'); // grip
        this.drawRect(ctx, 11, 2, 3, 2, '#555'); // muzzle
        return c;
    },

    // ---- PROPS ----
    generateDevyatka(scene) {
        // VAZ-2109 (devyatka)
        const c = this.makeCanvas(80, 40);
        const ctx = c.getContext('2d');
        // Body
        this.drawRect(ctx, 10, 12, 60, 18, '#7a7a8a');
        // Roof
        this.drawRect(ctx, 20, 2, 35, 12, '#7a7a8a');
        // Windows
        this.drawRect(ctx, 22, 4, 14, 8, '#3a5a8a');
        this.drawRect(ctx, 38, 4, 14, 8, '#3a5a8a');
        // Headlights
        this.drawRect(ctx, 66, 14, 4, 4, '#ffff88');
        // Taillights
        this.drawRect(ctx, 10, 14, 4, 4, '#ff3333');
        // Wheels
        this.drawRect(ctx, 18, 28, 10, 10, '#1a1a1a');
        this.drawRect(ctx, 52, 28, 10, 10, '#1a1a1a');
        this.drawRect(ctx, 20, 30, 6, 6, '#4a4a4a');
        this.drawRect(ctx, 54, 30, 6, 6, '#4a4a4a');
        return c;
    },

    generateMiliCar(scene) {
        // Militsiya car
        const c = this.makeCanvas(80, 40);
        const ctx = c.getContext('2d');
        // Body (white with blue stripe)
        this.drawRect(ctx, 10, 12, 60, 18, '#ddd');
        this.drawRect(ctx, 10, 20, 60, 4, '#2a4a8a');
        // Roof
        this.drawRect(ctx, 20, 2, 35, 12, '#ddd');
        // Lightbar
        this.drawRect(ctx, 30, 0, 16, 3, '#ff0000');
        this.drawRect(ctx, 38, 0, 8, 3, '#0044ff');
        // Windows
        this.drawRect(ctx, 22, 4, 14, 8, '#3a5a8a');
        this.drawRect(ctx, 38, 4, 14, 8, '#3a5a8a');
        this.drawRect(ctx, 18, 28, 10, 10, '#1a1a1a');
        this.drawRect(ctx, 52, 28, 10, 10, '#1a1a1a');
        this.drawRect(ctx, 20, 30, 6, 6, '#4a4a4a');
        this.drawRect(ctx, 54, 30, 6, 6, '#4a4a4a');
        return c;
    },

    generateShop(scene) {
        // Копеечка shop
        const c = this.makeCanvas(120, 80);
        const ctx = c.getContext('2d');
        // Building
        this.drawRect(ctx, 0, 10, 120, 70, '#8a8a7a');
        // Sign
        this.drawRect(ctx, 10, 2, 100, 14, '#cc3333');
        // Sign text would go here - just draw letter-like blocks
        for (let i = 0; i < 8; i++) {
            this.drawRect(ctx, 18 + i * 11, 5, 8, 8, '#ffff88');
        }
        // Door
        this.drawRect(ctx, 48, 40, 24, 40, '#4a3a2a');
        this.drawRect(ctx, 68, 58, 3, 3, '#cca800');
        // Windows
        this.drawRect(ctx, 8, 20, 32, 24, '#5a7aaa');
        this.drawRect(ctx, 80, 20, 32, 24, '#5a7aaa');
        // Bars on windows
        for (let i = 0; i < 4; i++) {
            this.drawRect(ctx, 14 + i * 8, 20, 1, 24, '#555');
            this.drawRect(ctx, 86 + i * 8, 20, 1, 24, '#555');
        }
        return c;
    },

    // Convert canvas to Phaser texture
    canvasToTexture(scene, canvas, key) {
        scene.textures.addCanvas(key, canvas);
    },

    // Create spritesheet from array of canvases
    framesToSpritesheet(scene, frames, key, frameWidth, frameHeight) {
        const totalWidth = frameWidth * frames.length;
        const sheet = this.makeCanvas(totalWidth, frameHeight);
        const ctx = sheet.getContext('2d');
        frames.forEach((f, i) => {
            ctx.drawImage(f, i * frameWidth, 0);
        });
        scene.textures.addSpriteSheet(key, sheet, { frameWidth, frameHeight });
    },

    // Generate all sprites for the game
    generateAll(scene) {
        // Player
        const playerIdle = this.generatePlayer(scene);
        this.framesToSpritesheet(scene, playerIdle, 'player_idle', 32, 48);
        
        const playerWalk = this.generatePlayerWalk(scene);
        this.framesToSpritesheet(scene, playerWalk, 'player_walk', 32, 48);
        
        const playerAttack = this.generatePlayerAttack(scene);
        this.framesToSpritesheet(scene, playerAttack, 'player_attack', 48, 48);

        // Also generate a hurt frame
        const hurtFrames = [playerIdle[0]]; // reuse idle as base
        this.framesToSpritesheet(scene, hurtFrames, 'player_hurt', 32, 48);

        // Enemies
        const gopnik = this.generateGopnik(scene);
        this.framesToSpritesheet(scene, gopnik, 'gopnik', 32, 48);
        
        const narik = this.generateNarik(scene);
        this.framesToSpritesheet(scene, narik, 'narik', 32, 48);
        
        const skinhead = this.generateSkinhead(scene);
        this.framesToSpritesheet(scene, skinhead, 'skinhead', 36, 52);
        
        const magomed = this.generateMagomed(scene);
        this.framesToSpritesheet(scene, magomed, 'magomed', 32, 48);
        
        const ment = this.generateMent(scene);
        this.framesToSpritesheet(scene, ment, 'ment', 36, 52);
        
        const omon = this.generateOmon(scene);
        this.framesToSpritesheet(scene, omon, 'omon', 40, 56);

        // Weapons (single frame textures)
        this.canvasToTexture(scene, this.generateKnife(scene), 'weapon_knife');
        this.canvasToTexture(scene, this.generateBat(scene), 'weapon_bat');
        this.canvasToTexture(scene, this.generatePistol(scene), 'weapon_pistol');

        // Props
        this.canvasToTexture(scene, this.generateDevyatka(scene), 'devyatka');
        this.canvasToTexture(scene, this.generateMiliCar(scene), 'milicar');
        this.canvasToTexture(scene, this.generateShop(scene), 'shop');
    }
};
