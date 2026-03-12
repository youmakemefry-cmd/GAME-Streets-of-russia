// Level definitions
// Each level has: background, name, width, waves of enemies, boss, props
const LEVELS = [
    {
        id: 1,
        name: 'НОЧНАЯ УЛИЦА',
        background: 'bg_night_street',
        width: 1800,
        music: 'level1_music', // placeholder
        props: [
            { type: 'devyatka', x: 300, y: 230 },
            { type: 'milicar', x: 800, y: 235 },
            { type: 'devyatka', x: 1400, y: 228 },
        ],
        waves: [
            { triggerX: 100, enemies: [
                { type: 'gopnik', x: 350, y: 200 },
                { type: 'gopnik', x: 380, y: 215 },
            ]},
            { triggerX: 400, enemies: [
                { type: 'gopnik', x: 600, y: 195 },
                { type: 'narik', x: 650, y: 210 },
                { type: 'gopnik', x: 680, y: 230 },
            ]},
            { triggerX: 700, enemies: [
                { type: 'narik', x: 900, y: 200 },
                { type: 'narik', x: 930, y: 220 },
                { type: 'gopnik', x: 960, y: 195 },
            ]},
            { triggerX: 1000, enemies: [
                { type: 'gopnik', x: 1200, y: 200 },
                { type: 'gopnik', x: 1230, y: 215 },
                { type: 'narik', x: 1260, y: 205 },
                { type: 'gopnik', x: 1290, y: 235 },
            ]},
        ],
        boss: {
            triggerX: 1400,
            enemies: [
                { type: 'skinhead', x: 1550, y: 200, isBoss: true },
                { type: 'skinhead', x: 1580, y: 215 },
                { type: 'skinhead', x: 1610, y: 230 },
                { type: 'skinhead', x: 1640, y: 195 },
            ]
        }
    },
    {
        id: 2,
        name: 'ЗИМНИЙ СНЕГОПАД',
        background: 'bg_winter',
        width: 2000,
        music: 'level2_music',
        snowEffect: true,
        props: [
            { type: 'shop', x: 500, y: 165 },
            { type: 'devyatka', x: 1000, y: 232 },
        ],
        waves: [
            { triggerX: 100, enemies: [
                { type: 'gopnik', x: 300, y: 200 },
                { type: 'skinhead', x: 350, y: 220 },
            ]},
            { triggerX: 400, enemies: [
                { type: 'narik', x: 600, y: 195 },
                { type: 'gopnik', x: 640, y: 210 },
                { type: 'skinhead', x: 670, y: 230 },
            ]},
            { triggerX: 700, enemies: [
                { type: 'magomed', x: 900, y: 210 },
                { type: 'gopnik', x: 940, y: 200 },
            ]},
            { triggerX: 1000, enemies: [
                { type: 'skinhead', x: 1200, y: 200 },
                { type: 'skinhead', x: 1240, y: 220 },
                { type: 'narik', x: 1270, y: 195 },
                { type: 'gopnik', x: 1300, y: 235 },
            ]},
            { triggerX: 1400, enemies: [
                { type: 'magomed', x: 1500, y: 210 },
                { type: 'narik', x: 1550, y: 200 },
                { type: 'gopnik', x: 1580, y: 225 },
            ]},
        ],
        boss: {
            triggerX: 1600,
            enemies: [
                { type: 'ment', x: 1750, y: 210, isBoss: true },
                { type: 'gopnik', x: 1780, y: 200 },
                { type: 'gopnik', x: 1800, y: 230 },
            ]
        }
    },
    {
        id: 3,
        name: 'ПРОМЗОНА',
        background: 'bg_industrial',
        width: 2000,
        music: 'level3_music',
        props: [],
        waves: [
            { triggerX: 100, enemies: [
                { type: 'skinhead', x: 300, y: 200 },
                { type: 'skinhead', x: 340, y: 220 },
                { type: 'gopnik', x: 370, y: 210 },
            ]},
            { triggerX: 400, enemies: [
                { type: 'narik', x: 600, y: 195 },
                { type: 'narik', x: 630, y: 220 },
                { type: 'skinhead', x: 660, y: 205 },
            ]},
            { triggerX: 700, enemies: [
                { type: 'magomed', x: 900, y: 210 },
                { type: 'gopnik', x: 940, y: 200 },
                { type: 'gopnik', x: 970, y: 230 },
                { type: 'narik', x: 950, y: 195 },
            ]},
            { triggerX: 1000, enemies: [
                { type: 'ment', x: 1200, y: 210 },
                { type: 'skinhead', x: 1240, y: 200 },
                { type: 'skinhead', x: 1270, y: 225 },
            ]},
            { triggerX: 1400, enemies: [
                { type: 'magomed', x: 1550, y: 205 },
                { type: 'ment', x: 1600, y: 215 },
                { type: 'narik', x: 1580, y: 235 },
                { type: 'gopnik', x: 1620, y: 195 },
            ]},
        ],
        boss: {
            triggerX: 1700,
            enemies: [
                { type: 'omon', x: 1850, y: 210, isBoss: true },
            ]
        }
    },
    {
        id: 4,
        name: 'НОЧНОЙ ПАРК',
        background: 'bg_park',
        width: 1800,
        music: 'level4_music',
        props: [],
        waves: [
            { triggerX: 100, enemies: [
                { type: 'narik', x: 300, y: 200 },
                { type: 'narik', x: 330, y: 220 },
                { type: 'narik', x: 360, y: 195 },
            ]},
            { triggerX: 400, enemies: [
                { type: 'gopnik', x: 600, y: 210 },
                { type: 'gopnik', x: 640, y: 200 },
                { type: 'skinhead', x: 670, y: 225 },
                { type: 'magomed', x: 700, y: 210 },
            ]},
            { triggerX: 700, enemies: [
                { type: 'ment', x: 900, y: 210 },
                { type: 'gopnik', x: 940, y: 195 },
                { type: 'skinhead', x: 960, y: 230 },
            ]},
            { triggerX: 1000, enemies: [
                { type: 'skinhead', x: 1200, y: 200 },
                { type: 'skinhead', x: 1230, y: 215 },
                { type: 'magomed', x: 1260, y: 205 },
                { type: 'ment', x: 1290, y: 225 },
            ]},
        ],
        boss: {
            triggerX: 1400,
            enemies: [
                { type: 'ment', x: 1550, y: 210, isBoss: true },
                { type: 'ment', x: 1600, y: 200 },
                { type: 'skinhead', x: 1580, y: 235 },
            ]
        }
    },
    {
        id: 5,
        name: 'ПОЛИЦЕЙСКИЙ УЧАСТОК',
        background: 'bg_police',
        width: 1800,
        music: 'level5_music',
        props: [],
        waves: [
            { triggerX: 100, enemies: [
                { type: 'ment', x: 300, y: 200 },
                { type: 'ment', x: 340, y: 220 },
            ]},
            { triggerX: 400, enemies: [
                { type: 'ment', x: 600, y: 195 },
                { type: 'ment', x: 640, y: 215 },
                { type: 'gopnik', x: 670, y: 230 },
            ]},
            { triggerX: 700, enemies: [
                { type: 'skinhead', x: 900, y: 200 },
                { type: 'ment', x: 940, y: 210 },
                { type: 'ment', x: 970, y: 225 },
                { type: 'gopnik', x: 950, y: 195 },
            ]},
            { triggerX: 1000, enemies: [
                { type: 'ment', x: 1200, y: 200 },
                { type: 'ment', x: 1230, y: 215 },
                { type: 'ment', x: 1260, y: 230 },
                { type: 'magomed', x: 1280, y: 195 },
            ]},
        ],
        boss: {
            triggerX: 1400,
            enemies: [
                { type: 'omon', x: 1550, y: 210, isBoss: true },
                { type: 'ment', x: 1600, y: 200 },
                { type: 'ment', x: 1620, y: 230 },
            ]
        }
    },
    {
        id: 6,
        name: 'ПОДЪЕЗД',
        background: 'bg_stairwell',
        width: 1600,
        music: 'level6_music',
        props: [],
        waves: [
            { triggerX: 50, enemies: [
                { type: 'gopnik', x: 250, y: 210 },
                { type: 'gopnik', x: 280, y: 225 },
                { type: 'narik', x: 300, y: 200 },
            ]},
            { triggerX: 300, enemies: [
                { type: 'gopnik', x: 500, y: 195 },
                { type: 'narik', x: 530, y: 215 },
                { type: 'skinhead', x: 560, y: 230 },
                { type: 'gopnik', x: 520, y: 200 },
            ]},
            { triggerX: 550, enemies: [
                { type: 'magomed', x: 700, y: 210 },
                { type: 'gopnik', x: 730, y: 200 },
                { type: 'narik', x: 760, y: 225 },
                { type: 'skinhead', x: 740, y: 195 },
            ]},
            { triggerX: 800, enemies: [
                { type: 'gopnik', x: 950, y: 200 },
                { type: 'gopnik', x: 980, y: 215 },
                { type: 'narik', x: 1000, y: 230 },
                { type: 'skinhead', x: 1020, y: 195 },
                { type: 'magomed', x: 1050, y: 210 },
            ]},
            { triggerX: 1050, enemies: [
                { type: 'ment', x: 1200, y: 210 },
                { type: 'gopnik', x: 1230, y: 200 },
                { type: 'gopnik', x: 1250, y: 225 },
                { type: 'narik', x: 1270, y: 195 },
                { type: 'skinhead', x: 1220, y: 235 },
            ]},
        ],
        boss: {
            triggerX: 1300,
            enemies: [
                { type: 'omon', x: 1450, y: 210, isBoss: true },
                { type: 'gopnik', x: 1480, y: 200 },
                { type: 'narik', x: 1490, y: 230 },
                { type: 'skinhead', x: 1510, y: 215 },
            ]
        }
    }
];
