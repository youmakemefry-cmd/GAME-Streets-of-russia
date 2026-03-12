// Game constants
const GAME_WIDTH = 480;
const GAME_HEIGHT = 270;
const SCALE = 2;
const GROUND_Y = 180; // top of walkable area
const GROUND_BOTTOM = 250; // bottom of walkable area
const SCROLL_SPEED = 1;

// Player
const PLAYER_SPEED = 120;
const PLAYER_HP = 100;
const PLAYER_ATTACK_DMG = 8;
const PLAYER_COMBO_WINDOW = 500; // ms
const PLAYER_SPECIAL_COST = 0; // special is 1 per level now
const PLAYER_GRAB_RANGE = 22;
const PLAYER_JUMP_FORCE = -200;
const PLAYER_GRAVITY = 500;

// Enemy base
const ENEMY_AGGRO_RANGE = 200;

// Colors
const COLOR_HP_GREEN = 0x00ff00;
const COLOR_HP_RED = 0xff0000;
const COLOR_HP_BG = 0x333333;
const COLOR_WHITE = 0xffffff;
const COLOR_YELLOW = 0xffff00;

// Directions
const DIR_LEFT = -1;
const DIR_RIGHT = 1;

// States
const STATE_IDLE = 'idle';
const STATE_WALK = 'walk';
const STATE_ATTACK = 'attack';
const STATE_HURT = 'hurt';
const STATE_DEAD = 'dead';
const STATE_SPECIAL = 'special';
const STATE_PICKUP = 'pickup';
const STATE_GRAB = 'grab';
const STATE_JUMP = 'jump';
const STATE_THROW = 'throw';
const STATE_STUNNED = 'stunned';
const STATE_FLEE = 'flee';
const STATE_CALLING = 'calling';
const STATE_RAGE = 'rage';
const STATE_SHOOTING = 'shooting';

// Weapon types
const WEAPON_NONE = null;
const WEAPON_KNIFE = 'knife';
const WEAPON_BAT = 'bat';
const WEAPON_PIPE = 'pipe';
const WEAPON_BOTTLE = 'bottle';

// Weapon stats
const WEAPON_STATS = {
    knife: { damage: 14, range: 28, speed: 1.0, throwable: true, throwDmg: 20 },
    bat: { damage: 22, range: 42, speed: 0.7, throwable: false },
    pipe: { damage: 18, range: 38, speed: 0.8, throwable: false },
    bottle: { damage: 10, range: 26, speed: 1.2, throwable: true, throwDmg: 15, breaksOnHit: true },
};

// Car
const CAR_SPEED = 250;
const CAR_DAMAGE = 40;
const CAR_HP = 60;
