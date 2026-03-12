// Procedural background generator
const BackgroundGen = {
    makeCanvas(w, h) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        return c;
    },

    drawRect(ctx, x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    },

    // Panel building (панельный дом)
    drawPanelBuilding(ctx, x, y, w, h, windowsLit) {
        // Main body
        this.drawRect(ctx, x, y, w, h, '#5a5a5a');
        // Panel seams
        for (let py = y; py < y + h; py += 20) {
            this.drawRect(ctx, x, py, w, 1, '#4a4a4a');
        }
        for (let px = x; px < x + w; px += 30) {
            this.drawRect(ctx, px, y, 1, h, '#4a4a4a');
        }
        // Windows
        for (let wy = y + 8; wy < y + h - 10; wy += 20) {
            for (let wx = x + 8; wx < x + w - 12; wx += 30) {
                const lit = Math.random() < (windowsLit || 0.3);
                this.drawRect(ctx, wx, wy, 12, 10, lit ? '#ffee77' : '#2a3a5a');
                // Window frame
                this.drawRect(ctx, wx + 5, wy, 1, 10, '#4a4a4a');
                this.drawRect(ctx, wx, wy + 5, 12, 1, '#4a4a4a');
            }
        }
    },

    // Street lamp
    drawLamp(ctx, x, y) {
        this.drawRect(ctx, x, y, 3, 60, '#5a5a5a');
        this.drawRect(ctx, x - 6, y, 15, 4, '#5a5a5a');
        this.drawRect(ctx, x - 4, y + 3, 11, 6, '#ffee88');
        // Glow
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#ffee88';
        ctx.beginPath();
        ctx.arc(x + 1, y + 20, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    },

    // Night street level 1
    generateNightStreet(scene) {
        const c = this.makeCanvas(960, 270);
        const ctx = c.getContext('2d');
        
        // Sky (dark night)
        const grad = ctx.createLinearGradient(0, 0, 0, 120);
        grad.addColorStop(0, '#0a0a1a');
        grad.addColorStop(1, '#1a1a2a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 960, 120);
        
        // Stars
        for (let i = 0; i < 30; i++) {
            this.drawRect(ctx, Math.random() * 960, Math.random() * 80, 1, 1, '#fff');
        }
        
        // Background buildings
        this.drawPanelBuilding(ctx, 20, 20, 120, 100, 0.3);
        this.drawPanelBuilding(ctx, 160, 30, 100, 90, 0.2);
        this.drawPanelBuilding(ctx, 300, 10, 140, 110, 0.35);
        this.drawPanelBuilding(ctx, 500, 25, 110, 95, 0.25);
        this.drawPanelBuilding(ctx, 650, 15, 130, 105, 0.3);
        this.drawPanelBuilding(ctx, 820, 35, 120, 85, 0.2);
        
        // Ground / sidewalk
        this.drawRect(ctx, 0, 165, 960, 5, '#4a4a4a');
        this.drawRect(ctx, 0, 170, 960, 100, '#2a2a2a');
        
        // Road markings
        for (let i = 0; i < 960; i += 40) {
            this.drawRect(ctx, i, 220, 20, 2, '#555');
        }
        
        // Lamps
        this.drawLamp(ctx, 100, 105);
        this.drawLamp(ctx, 350, 105);
        this.drawLamp(ctx, 600, 105);
        this.drawLamp(ctx, 850, 105);
        
        scene.textures.addCanvas('bg_night_street', c);
    },

    // Winter snowstorm level 2
    generateWinter(scene) {
        const c = this.makeCanvas(960, 270);
        const ctx = c.getContext('2d');
        
        // Sky (slightly lighter, snowy)
        const grad = ctx.createLinearGradient(0, 0, 0, 120);
        grad.addColorStop(0, '#2a2a3a');
        grad.addColorStop(1, '#3a3a4a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 960, 120);
        
        // Buildings with snow
        this.drawPanelBuilding(ctx, 30, 25, 130, 95, 0.4);
        // Snow on roof
        this.drawRect(ctx, 28, 23, 134, 4, '#dde8f0');
        
        this.drawPanelBuilding(ctx, 200, 15, 150, 105, 0.35);
        this.drawRect(ctx, 198, 13, 154, 4, '#dde8f0');
        
        this.drawPanelBuilding(ctx, 400, 30, 120, 90, 0.3);
        this.drawRect(ctx, 398, 28, 124, 4, '#dde8f0');
        
        this.drawPanelBuilding(ctx, 560, 20, 140, 100, 0.4);
        this.drawRect(ctx, 558, 18, 144, 4, '#dde8f0');
        
        this.drawPanelBuilding(ctx, 750, 35, 110, 85, 0.25);
        this.drawRect(ctx, 748, 33, 114, 4, '#dde8f0');
        
        // Snowy ground
        this.drawRect(ctx, 0, 165, 960, 5, '#bbc8d0');
        this.drawRect(ctx, 0, 170, 960, 100, '#8a9aa8');
        
        // Snow patches
        for (let i = 0; i < 40; i++) {
            const sx = Math.random() * 960;
            const sy = 170 + Math.random() * 80;
            this.drawRect(ctx, sx, sy, 8 + Math.random() * 16, 3, '#ccd8e0');
        }
        
        // Lamps
        this.drawLamp(ctx, 150, 105);
        this.drawLamp(ctx, 450, 105);
        this.drawLamp(ctx, 750, 105);
        
        scene.textures.addCanvas('bg_winter', c);
    },

    // Industrial zone level 3
    generateIndustrial(scene) {
        const c = this.makeCanvas(960, 270);
        const ctx = c.getContext('2d');
        
        // Murky sky
        const grad = ctx.createLinearGradient(0, 0, 0, 120);
        grad.addColorStop(0, '#1a1a15');
        grad.addColorStop(1, '#2a2a20');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 960, 120);
        
        // Industrial buildings / warehouses
        this.drawRect(ctx, 10, 40, 100, 80, '#4a4a3a');
        this.drawRect(ctx, 10, 35, 100, 8, '#5a4a3a'); // roof
        // Smokestack
        this.drawRect(ctx, 50, 5, 15, 35, '#555');
        this.drawRect(ctx, 48, 2, 19, 5, '#666');
        
        this.drawRect(ctx, 150, 50, 120, 70, '#3a3a2a');
        // Garage doors
        this.drawRect(ctx, 160, 70, 30, 50, '#2a2a1a');
        this.drawRect(ctx, 200, 70, 30, 50, '#2a2a1a');
        
        // Pipes
        this.drawRect(ctx, 320, 60, 200, 8, '#6a6a5a');
        this.drawRect(ctx, 320, 55, 8, 65, '#6a6a5a');
        this.drawRect(ctx, 512, 55, 8, 65, '#6a6a5a');
        
        // Another warehouse
        this.drawRect(ctx, 560, 45, 140, 75, '#4a4a3a');
        this.drawRect(ctx, 600, 70, 40, 50, '#2a2a1a');
        
        // Fence
        for (let fx = 740; fx < 960; fx += 15) {
            this.drawRect(ctx, fx, 80, 2, 40, '#6a6a5a');
        }
        this.drawRect(ctx, 740, 80, 220, 2, '#6a6a5a');
        this.drawRect(ctx, 740, 95, 220, 2, '#6a6a5a');
        
        // Dirty ground
        this.drawRect(ctx, 0, 165, 960, 5, '#3a3a2a');
        this.drawRect(ctx, 0, 170, 960, 100, '#2a2a1a');
        
        // Puddles
        for (let i = 0; i < 8; i++) {
            this.drawRect(ctx, Math.random() * 900, 180 + Math.random() * 60, 20 + Math.random() * 30, 4, '#1a2a3a');
        }
        
        scene.textures.addCanvas('bg_industrial', c);
    },

    // Night park level 4
    generatePark(scene) {
        const c = this.makeCanvas(960, 270);
        const ctx = c.getContext('2d');
        
        // Dark sky
        const grad = ctx.createLinearGradient(0, 0, 0, 120);
        grad.addColorStop(0, '#0a0a15');
        grad.addColorStop(1, '#1a1a25');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 960, 120);
        
        // Moon
        ctx.fillStyle = '#dde8f0';
        ctx.beginPath();
        ctx.arc(800, 30, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Trees (bare winter trees)
        const drawTree = (x, y) => {
            this.drawRect(ctx, x, y + 40, 6, 50, '#3a2a1a');
            // Branches
            for (let b = 0; b < 5; b++) {
                const bx = x + 3 + (Math.random() - 0.5) * 30;
                const by = y + 10 + b * 8;
                ctx.strokeStyle = '#3a2a1a';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x + 3, by);
                ctx.lineTo(bx, by - 10);
                ctx.stroke();
            }
        };
        
        drawTree(80, 60);
        drawTree(200, 55);
        drawTree(370, 65);
        drawTree(520, 50);
        drawTree(680, 60);
        drawTree(830, 55);
        
        // Park bench
        this.drawRect(ctx, 280, 140, 40, 3, '#5a3a1a');
        this.drawRect(ctx, 282, 143, 3, 12, '#5a3a1a');
        this.drawRect(ctx, 315, 143, 3, 12, '#5a3a1a');
        
        // Path (gravel)
        this.drawRect(ctx, 0, 165, 960, 5, '#3a3a30');
        this.drawRect(ctx, 0, 170, 960, 100, '#252520');
        
        // Broken lamp
        this.drawLamp(ctx, 440, 105);
        
        scene.textures.addCanvas('bg_park', c);
    },

    // Police station level 5
    generatePoliceStation(scene) {
        const c = this.makeCanvas(960, 270);
        const ctx = c.getContext('2d');
        
        // Interior ceiling
        this.drawRect(ctx, 0, 0, 960, 270, '#6a6a5a');
        
        // Floor tiles
        for (let y = 170; y < 270; y += 20) {
            for (let x = 0; x < 960; x += 20) {
                const shade = ((x / 20 + y / 20) % 2 === 0) ? '#5a5a4a' : '#4a4a3a';
                this.drawRect(ctx, x, y, 20, 20, shade);
            }
        }
        
        // Walls
        this.drawRect(ctx, 0, 20, 960, 150, '#7a7a6a');
        // Baseboard
        this.drawRect(ctx, 0, 160, 960, 10, '#4a3a2a');
        
        // Wanted posters
        for (let i = 0; i < 4; i++) {
            this.drawRect(ctx, 50 + i * 220, 50, 30, 40, '#ddd');
            this.drawRect(ctx, 55 + i * 220, 55, 20, 20, '#aaa');
        }
        
        // Doors
        this.drawRect(ctx, 100, 60, 50, 110, '#5a4a3a');
        this.drawRect(ctx, 140, 110, 5, 5, '#cca800');
        
        this.drawRect(ctx, 400, 60, 50, 110, '#5a4a3a');
        this.drawRect(ctx, 440, 110, 5, 5, '#cca800');
        
        this.drawRect(ctx, 700, 60, 50, 110, '#5a4a3a');
        this.drawRect(ctx, 740, 110, 5, 5, '#cca800');
        
        // Fluorescent light
        this.drawRect(ctx, 200, 22, 60, 4, '#fff');
        this.drawRect(ctx, 500, 22, 60, 4, '#fff');
        this.drawRect(ctx, 800, 22, 60, 4, '#eee');
        
        scene.textures.addCanvas('bg_police', c);
    },

    // Stairwell / подъезд level 6
    generateStairwell(scene) {
        const c = this.makeCanvas(960, 270);
        const ctx = c.getContext('2d');
        
        // Walls (dirty green paint typical of Russian подъезд)
        this.drawRect(ctx, 0, 0, 960, 270, '#4a6a4a');
        
        // Lower half - darker green
        this.drawRect(ctx, 0, 135, 960, 135, '#3a5a3a');
        
        // Paint border line
        this.drawRect(ctx, 0, 133, 960, 4, '#5a7a5a');
        
        // Floor (concrete)
        this.drawRect(ctx, 0, 200, 960, 70, '#5a5a5a');
        
        // Stairs
        for (let s = 0; s < 6; s++) {
            this.drawRect(ctx, 60 + s * 30, 170 - s * 5, 30, 35 + s * 5, '#6a6a6a');
            this.drawRect(ctx, 60 + s * 30, 170 - s * 5, 30, 2, '#7a7a7a');
        }
        
        // Railing
        this.drawRect(ctx, 55, 130, 195, 3, '#8a6a3a');
        for (let r = 0; r < 7; r++) {
            this.drawRect(ctx, 60 + r * 28, 130, 2, 45, '#8a6a3a');
        }
        
        // Elevator door
        this.drawRect(ctx, 400, 60, 60, 130, '#7a7a8a');
        this.drawRect(ctx, 428, 60, 4, 130, '#5a5a6a'); // center line
        this.drawRect(ctx, 410, 120, 10, 10, '#aaa'); // button
        
        // Mailboxes
        for (let m = 0; m < 6; m++) {
            this.drawRect(ctx, 550 + m * 25, 100, 22, 18, '#7a7a5a');
            this.drawRect(ctx, 555 + m * 25, 108, 12, 3, '#2a2a2a');
        }
        
        // Graffiti (abstract scribbles)
        ctx.strokeStyle = '#2a4a6a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(750, 80);
        ctx.lineTo(780, 70);
        ctx.lineTo(800, 85);
        ctx.lineTo(770, 90);
        ctx.stroke();
        
        ctx.strokeStyle = '#6a2a2a';
        ctx.beginPath();
        ctx.moveTo(820, 100);
        ctx.lineTo(860, 90);
        ctx.lineTo(870, 110);
        ctx.stroke();
        
        // Dim light bulb
        this.drawRect(ctx, 300, 5, 4, 8, '#333');
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#ffee88';
        ctx.beginPath();
        ctx.arc(302, 15, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        this.drawRect(ctx, 299, 8, 6, 6, '#ffdd66');
        
        scene.textures.addCanvas('bg_stairwell', c);
    },

    generateAll(scene) {
        this.generateNightStreet(scene);
        this.generateWinter(scene);
        this.generateIndustrial(scene);
        this.generatePark(scene);
        this.generatePoliceStation(scene);
        this.generateStairwell(scene);
    }
};
