/* =====================================================================
   DATA — metals, weapons, parts, elements, foes, regions, badges
   ===================================================================== */
const METALS = {
  copper:   { name: 'Copper',   color: 0xc8714a, power: 1.0, dur: 1.0,  value: 1.0, band: [30, 50], rate: .33, hard: 0, price: 5,  unlock: 1,  pitch: .85, note: 'Soft and quick to melt' },
  bronze:   { name: 'Bronze',   color: 0xc49045, power: 1.2, dur: 1.25, value: 1.35, band: [35, 55], rate: .29, hard: 1, price: 9,  unlock: 1,  pitch: .95, note: 'Tougher than copper' },
  iron:     { name: 'Iron',     color: 0x7f8187, power: 1.5, dur: 1.5,  value: 1.8, band: [43, 62], rate: .25, hard: 2, price: 14, unlock: 3,  pitch: 1.05, note: 'Dependable and sturdy' },
  steel:    { name: 'Steel',    color: 0xbcc6ce, power: 1.9, dur: 1.85, value: 2.4, band: [50, 68], rate: .22, hard: 3, price: 22, unlock: 5,  pitch: 1.2, note: 'Hard to work, hits hard' },
  gold:     { name: 'Gold',     color: 0xf2bf45, power: 1.55, dur: 1.15, value: 4.0, band: [38, 56], rate: .28, hard: 1, price: 38, unlock: 6, pitch: .9, note: 'Customers pay double. Extra loot', lucky: true },
  mythril:  { name: 'Mythril',  color: 0x8ae8dc, power: 2.5, dur: 2.4,  value: 4.4, band: [58, 74], rate: .19, hard: 4, price: 52, unlock: 9,  pitch: 1.35, glow: 0x1a7068, note: 'Light as silk, strong as stone' },
  emberite: { name: 'Emberite', color: 0x9a3422, power: 3.2, dur: 2.7,  value: 6.0, band: [66, 82], rate: .16, hard: 5, price: 78, unlock: 13, pitch: .75, glow: 0x7a1c08, element: 'fire', note: 'Burns forever. Fire element built in' },
  frostsilver: { name: 'Frostsilver', color: 0xcfe8ff, power: 2.9, dur: 2.6, value: 5.2, band: [62, 78], rate: .17, hard: 4, price: 66, unlock: 11, pitch: 1.5, glow: 0x2a6a9a, element: 'frost', note: 'Mined from glacier hearts. Frost element built in' },
  starmetal: { name: 'Starmetal', color: 0x9aa8ff, power: 3.9, dur: 3.1, value: 7.5, band: [70, 86], rate: .14, hard: 6, price: 110, unlock: 18, pitch: 1.7, glow: 0x4a3aa0, element: 'radiant', note: 'Fallen from the sky. Radiant element built in' },
};
const METAL_ORDER = Object.keys(METALS);

const WTYPES = {
  sword:  { name: 'Longsword',    ore: 3, power: 10, dur: 30, speed: 1.0,  reach: 1.5, value: 30, strikes: 12, edge: 8, unlock: 1, cls: 'Knight' },
  axe:    { name: 'Battle Axe',   ore: 3, power: 13, dur: 27, speed: .8,   reach: 1.5, value: 34, strikes: 10, edge: 5, unlock: 2, cls: 'Berserker' },
  dagger: { name: 'Dagger',       ore: 2, power: 6,  dur: 22, speed: 1.8,  reach: 1.25, value: 22, strikes: 8, edge: 5, unlock: 3, cls: 'Rogue' },
  mace:   { name: 'Flanged Mace', ore: 4, power: 12, dur: 36, speed: .85,  reach: 1.4, value: 36, strikes: 10, edge: 0, unlock: 5, cls: 'Cleric' },
  shield: { name: 'Round Shield', ore: 5, power: 4,  dur: 72, speed: .8,   reach: 1.3, value: 32, strikes: 12, edge: 0, unlock: 6, cls: 'Guardian', taunt: true },
  spear:  { name: 'Spear',        ore: 2, power: 9,  dur: 26, speed: 1.0,  reach: 2.7, value: 32, strikes: 8,  edge: 5, unlock: 7, cls: 'Lancer' },
  hammer: { name: 'Warhammer',    ore: 4, power: 18, dur: 34, speed: .6,   reach: 1.5, value: 44, strikes: 10, edge: 0, unlock: 9, cls: 'Warden', splash: true },
  greatsword: { name: 'Greatsword', ore: 5, power: 21, dur: 40, speed: .7,  reach: 2.0, value: 58, strikes: 14, edge: 9, unlock: 11, cls: 'Champion', cleave: true },
  halberd: { name: 'Halberd',      ore: 4, power: 16, dur: 34, speed: .8,   reach: 3.0, value: 52, strikes: 11, edge: 6, unlock: 14, cls: 'Halberdier', cleave: true },
};
const WTYPE_ORDER = Object.keys(WTYPES);
function stepsFor(type) { const s = ['ore', 'smelt', 'pour', 'hammer', 'quench']; if (WTYPES[type].edge) s.push('sharpen'); s.push('assemble'); return s; }
const STEP_STATION = { ore: 'ore', smelt: 'furnace', pour: 'casting', hammer: 'anvil', quench: 'quench', sharpen: 'grind', assemble: 'bench', deliver: 'counter' };
const STEP_NAME = { ore: 'Choose ore', smelt: 'Smelt', pour: 'Pour', hammer: 'Hammer', quench: 'Quench', sharpen: 'Sharpen', assemble: 'Assemble', deliver: 'Deliver' };
const STEP_WEIGHT = { smelt: 1, pour: 1, hammer: 1.6, quench: 1, sharpen: 1, assemble: 1 };

const GRIPS = {
  oak:        { name: 'Oak Grip',      dur: 0,  power: 0, price: 0,  free: true, color: 0x8a5a34 },
  leather:    { name: 'Leather Wrap',  dur: 5,  power: 0, price: 7,  color: 0x4f2e1c, unlock: 1 },
  bone:       { name: 'Bone Grip',     dur: 3,  power: 2, price: 13, color: 0xe6dac0, unlock: 3 },
  ironwood:   { name: 'Ironwood',      dur: 10, power: 0, price: 19, color: 0x3e3029, unlock: 5 },
  dragonhide: { name: 'Dragonhide',    dur: 14, power: 3, price: 34, color: 0x8a1f1f, unlock: 9 },
};
const GUARDS = {
  plain:  { name: 'Plain Fittings',  dur: 0, power: 0, price: 0,  free: true },
  brass:  { name: 'Brass Fittings',  dur: 3, power: 1, price: 8,  color: 0xd8a74a, unlock: 1 },
  spiked: { name: 'Spiked Fittings', dur: 0, power: 4, price: 15, color: 0x3a3a42, unlock: 3 },
  royal:  { name: 'Royal Fittings',  dur: 5, power: 3, price: 30, color: 0xf2c14e, value: 1.25, unlock: 5 },
};
const GEMS = {
  none:      { name: 'No Gem',      el: null,      price: 0,  free: true },
  ruby:      { name: 'Ruby',        el: 'fire',    price: 16, color: 0xff3324, unlock: 1 },
  emerald:   { name: 'Emerald',     el: 'nature',  price: 16, color: 0x2fe46c, unlock: 1 },
  sapphire:  { name: 'Sapphire',    el: 'frost',   price: 20, color: 0x3a9cff, unlock: 5 },
  topaz:     { name: 'Storm Topaz', el: 'storm',   price: 22, color: 0xb27cff, unlock: 9 },
  amber:     { name: 'Amber',       el: 'stone',   price: 22, color: 0xffa224, unlock: 9 },
  moonstone: { name: 'Moonstone',   el: 'radiant', price: 28, color: 0xfff2c0, unlock: 13 },
  diamond:   { name: 'Diamond',     el: null,      price: 40, color: 0xe8f6ff, unlock: 12, power: 6 },
};

const ELEMENTS = {
  fire:    { name: 'Fire',    css: 'var(--el-fire)',    hex: 0xff6b3a },
  frost:   { name: 'Frost',   css: 'var(--el-frost)',   hex: 0x7fd3ff },
  storm:   { name: 'Storm',   css: 'var(--el-storm)',   hex: 0xb99bff },
  nature:  { name: 'Nature',  css: 'var(--el-nature)',  hex: 0x74d66a },
  stone:   { name: 'Stone',   css: 'var(--el-stone)',   hex: 0xd8ab6e },
  radiant: { name: 'Radiant', css: 'var(--el-radiant)', hex: 0xfff0a8 },
  shadow:  { name: 'Shadow',  css: 'var(--el-shadow)',  hex: 0xa184e0 },
};
const GEM_FOR = { fire: 'ruby', frost: 'sapphire', storm: 'topaz', nature: 'emerald', stone: 'amber', radiant: 'moonstone' };

const FAMILIES = {
  plant:  { name: 'Thornling',    big: 'Bramble Brute', el: 'nature', weak: 'fire',    hp: 26, atk: 4, spd: 1.3, rate: 1.4 },
  stone:  { name: 'Pebble Golem', big: 'Boulder Golem', el: 'stone',  weak: 'nature',  hp: 38, atk: 5, spd: .9,  rate: 1.7 },
  fire:   { name: 'Cinder Imp',   big: 'Magma Ogre',    el: 'fire',   weak: 'frost',   hp: 30, atk: 6, spd: 1.5, rate: 1.4 },
  frost:  { name: 'Rime Wolf',    big: 'Frost Troll',   el: 'frost',  weak: 'storm',   hp: 32, atk: 6, spd: 1.8, rate: 1.3 },
  storm:  { name: 'Storm Wisp',   big: 'Thunderhorn',   el: 'storm',  weak: 'stone',   hp: 30, atk: 7, spd: 1.6, rate: 1.5 },
  shadow: { name: 'Gloom Wraith', big: 'Night Stalker', el: 'shadow', weak: 'radiant', hp: 36, atk: 8, spd: 1.4, rate: 1.5 },
};

const REGIONS = [
  { id: 'meadow', name: 'Greenmeadow Trail',  fams: ['plant', 'plant', 'stone'], sky: 0x8ec9ea, fog: 0xc6e0ea, ground: 0x5f9a3c, ground2: 0x86b84e, path: 0x9c7b55, leaf: [0x3f8a3a, 0x5aa244, 0x2f7034], trunk: 0x6b4a2e, tree: 'round', sun: 0xfff1d6, hemi: [0xdff0ff, 0x4a6a30] },
  { id: 'cinder', name: 'Cinder Hollow',      fams: ['fire', 'fire', 'plant', 'stone'], sky: 0xc77a52, fog: 0x86503c, ground: 0x3b2b24, ground2: 0x56372a, path: 0x5e4636, leaf: [0x5b3524, 0x3e2a20], trunk: 0x2a1d18, tree: 'dead', sun: 0xffb27a, hemi: [0xffc8a0, 0x3a2018], lava: true },
  { id: 'frost',  name: 'Frostfang Pass',     fams: ['frost', 'frost', 'storm', 'stone'], sky: 0xb9d4ea, fog: 0xdde9f3, ground: 0xe9f0f6, ground2: 0xcfdbe6, path: 0xaab4be, leaf: [0x2f5a4c, 0x3b6b5a], trunk: 0x4a3a30, tree: 'pine', sun: 0xeaf4ff, hemi: [0xe8f2ff, 0x8090a0], snow: true },
  { id: 'storm',  name: 'Stormspire Heights', fams: ['storm', 'shadow', 'frost', 'fire'], sky: 0x4c4870, fog: 0x5b5780, ground: 0x4a5058, ground2: 0x5c636c, path: 0x707078, leaf: [0x34485a, 0x2c3c4a], trunk: 0x2a2a30, tree: 'pine', sun: 0xc8c0ff, hemi: [0xb8b0ff, 0x30303a] },
  { id: 'keep',   name: 'The Ashen Keep',     fams: ['shadow', 'fire', 'storm'], sky: 0x3a2222, fog: 0x3a2626, ground: 0x2e2626, ground2: 0x3a302c, path: 0x4a3c36, leaf: [0x2a2020], trunk: 0x1e1616, tree: 'dead', sun: 0xff9a6a, hemi: [0xff9a7a, 0x201010], lava: true, boss: true },
];
const BOSS_DAY = 17;

const BOMBS = [
  { id: 'bomb',  name: 'Powder Keg',    cd: 6,  unlock: 1, el: null,    dmg: 28, radius: 2.3, color: '#6b6f78' },
  { id: 'fire',  name: 'Firebomb',      cd: 11, unlock: 2, el: 'fire',  dmg: 16, burn: 6, radius: 2.5, color: '#ff6b3a' },
  { id: 'mend',  name: 'Mending Flask', cd: 15, unlock: 3, heal: .35, radius: 3.4, color: '#8fd982' },
  { id: 'frost', name: 'Frost Orb',     cd: 13, unlock: 5, el: 'frost', dmg: 14, freeze: 3, radius: 2.7, color: '#7fd3ff' },
  { id: 'storm', name: 'Storm Jar',     cd: 13, unlock: 7, el: 'storm', dmg: 24, chain: 3, radius: 2.1, color: '#b99bff' },
  { id: 'rally', name: 'War Horn',      cd: 22, unlock: 9, buff: .6, dur: 8, radius: 5.5, color: '#ffc65c' },
];

const UPGRADES = {
  bellows:    { name: 'Great Bellows',   desc: 'Each pump adds more heat and the melting band widens.', costs: [60, 160, 320] },
  hammer:     { name: 'Master Hammer',   desc: 'Strike rings close slower and timing is more forgiving.', costs: [70, 180, 360] },
  whetstone:  { name: 'Fine Whetstone',  desc: 'Grinding is gentler, so it is harder to overgrind an edge.', costs: [60, 170] },
  oil:        { name: 'Quenching Oil',   desc: 'The tempering band on the quench gauge widens.', costs: [60, 170] },
  jig:        { name: 'Assembly Jig',    desc: 'Parts swing more slowly at the workbench.', costs: [50, 150] },
  catapult:   { name: 'Siege Catapult',  desc: 'Bombs recharge 12% faster and hit 15% harder per level.', costs: [90, 220, 420] },
  apprentice: { name: 'Apprentice',      desc: 'Hones every finished weapon: +5% power per level.', costs: [150, 350] },
  crucible:   { name: 'Clay Crucible',   desc: 'Ore melts 15% faster per level.', costs: [80, 200] },
  pickaxe:    { name: 'Tempered Pickaxe', desc: 'Mining swings land easier and veins give more ore.', costs: [60, 180, 380] },
  boots:      { name: 'Trail Boots',     desc: 'Run 10% faster and tire 20% slower per level.', costs: [70, 200] },
  banner:     { name: 'Guild Banner',    desc: 'Your soldiers march with +8% weapon durability per level.', costs: [120, 280, 520] },
  satchel:    { name: 'Forager Satchel', desc: 'Gem crystals and chests give one extra find per level.', costs: [90, 240] },
};

const NAMES = ['Brannoc', 'Ysolde', 'Tamsin', 'Garrick', 'Odalys', 'Fennick', 'Marisol', 'Hollis', 'Wren', 'Corvin', 'Isra', 'Dagny', 'Tobiah', 'Seren', 'Mabry', 'Kestrel', 'Alder', 'Briony', 'Cato', 'Delphine', 'Eamon', 'Freya', 'Gideon', 'Hesper', 'Ivo', 'Juniper', 'Kael', 'Liesel', 'Merrick', 'Nell', 'Osric', 'Petra', 'Quill', 'Rowan', 'Sabine', 'Thane', 'Ulla', 'Vesna', 'Wystan', 'Yara', 'Zeb', 'Ansel', 'Bryn', 'Cormac', 'Dara', 'Elva'];
const CLASS_LOOK = {
  Knight:    { tunic: 0x35588c, trim: 0xd6a957, head: 'helm', armor: true, cape: 0x24406a, plume: 0xd6a957 },
  Berserker: { tunic: 0x8c3a2a, trim: 0x5a3a24, head: 'hair', beard: true },
  Rogue:     { tunic: 0x2f4232, trim: 0x6a5a40, head: 'hood', cape: 0x243326 },
  Cleric:    { tunic: 0xe4dcc6, trim: 0xc89a3a, head: 'cap' },
  Guardian:  { tunic: 0x5a4a7a, trim: 0xb0b0b8, head: 'helm', armor: true },
  Lancer:    { tunic: 0x2a6a6a, trim: 0xd6a957, head: 'helm', plume: 0x2a6a6a },
  Warden:    { tunic: 0x6a5030, trim: 0x303030, head: 'hair', beard: true, armor: true },
  Champion:  { tunic: 0x7a1a24, trim: 0xd6a957, head: 'helm', armor: true, cape: 0x5a0e14, plume: 0xd8c050 },
  Halberdier:{ tunic: 0x284a7a, trim: 0xb0b0b8, head: 'helm', armor: true, plume: 0xc8302a },
  Smith:     { tunic: 0x5a4030, trim: 0x2a1a10, head: 'hair', beard: true, apron: true },
  Villager:  { tunic: 0x6a7a3a, trim: 0x4a3020, head: 'hair' },
};
const ORDER_LINES = [
  'I need a {w}. Scouts say {f} are on the trail.',
  'Forge me a {w}, smith. {f} block the road ahead.',
  'A {w}, if you please. We march against {f} at dusk.',
  'My last {w} snapped. {f} are waiting for us out there.',
  'Make it a {w}. I have heard the {f} are nasty this season.',
];
const THANKS = { S: ['A masterwork! The bards will sing of this.', 'I have never held anything finer.'], A: ['Superb work, smith.', 'Balanced like a dream.'], B: ['Solid. This will serve.', 'Good steel, good smith.'], C: ['It will do… I suppose.', 'A little rough, but it will hold.'], D: ['Is this… meant to look like that?', 'I will pray it holds together.'] };

const BADGES = [
  ['first', 'First Spark', 'Forge your first weapon'],
  ['dozen', "Smith's Dozen", 'Forge 12 weapons'],
  ['fifty', 'Anvil Veteran', 'Forge 50 weapons'],
  ['srank', 'Masterwork', 'Forge an S-grade weapon'],
  ['perfect', 'Flawless', 'Score 99% or more on a whole weapon'],
  ['pour', 'Steady Hand', 'Score 100 on a pour'],
  ['temper', 'Even Temper', 'Score 98+ on a quench'],
  ['streak5', 'Ringing Anvil', 'Land 5 PERFECT strikes in a row'],
  ['allgreat', 'Rhythm of the Hammer', 'Finish a hammering with every strike GREAT or better'],
  ['razor', "Razor's Edge", 'Score 98+ on sharpening'],
  ['smelt', 'Bellows Master', 'Score 100 on smelting'],
  ['copperday', 'Copper Kettle', 'Forge a whole day of copper weapons'],
  ['bronzeday', 'Bronze Age', 'Forge a whole day of bronze weapons'],
  ['ironday', 'Iron Will', 'Forge a whole day of iron weapons'],
  ['steelday', 'Steel Resolve', 'Forge a whole day of steel weapons'],
  ['gold', 'Gilded', 'Forge a gold weapon'],
  ['mythril', 'Mythsmith', 'Forge a mythril weapon'],
  ['emberite', 'Heart of Embers', 'Forge an emberite weapon'],
  ['arsenal', 'Full Arsenal', 'Forge every type of weapon'],
  ['gems10', 'Gemcutter', 'Set 10 gems'],
  ['weak25', 'Super Effective', 'Hit 25 weaknesses in battle'],
  ['allweak', 'Elementalist', 'Exploit all six weaknesses'],
  ['flawless', 'Not a Scratch', 'Clear a trail with no weapon breaking'],
  ['trails5', 'Trailblazer', 'Clear 5 trails'],
  ['kills100', 'Monster Slayer', 'Defeat 100 monsters'],
  ['bombs10', 'Bombardier', 'Defeat 10 monsters with bombs'],
  ['mend10', 'Field Medic', 'Mend weapons 10 times'],
  ['overkill', 'Overkill', 'Throw 3 different bombs within 3 seconds'],
  ['nobomb', 'Steel Alone', 'Clear a trail without throwing a bomb'],
  ['gold1k', 'Coin Purse', 'Earn 1,000 gold'],
  ['gold10k', 'Merchant Prince', 'Earn 10,000 gold'],
  ['tinker', 'Tinkerer', 'Buy 5 workshop upgrades'],
  ['bronzeM', 'Journeyman', 'Reach Bronze mastery with any weapon'],
  ['goldM', 'Grandmaster', 'Reach Gold mastery with any weapon'],
  ['cinder', 'Into the Fire', 'Reach Cinder Hollow'],
  ['frostR', 'Cold Feet', 'Reach Frostfang Pass'],
  ['stormR', 'Eye of the Storm', 'Reach Stormspire Heights'],
  ['wyrm', 'Wyrmslayer', 'Defeat Vorgrath the Ashen Wyrm'],
  ['outside', 'Fresh Air', 'Step out of the smithy into Emberhold'],
  ['miner1', 'First Vein', 'Mine your first ore vein'],
  ['miner50', 'Deep Delver', 'Mine 50 ore from the wild'],
  ['crystal', 'Crystal Gatherer', 'Gather 10 gem crystals'],
  ['chest', 'Treasure Hunter', 'Open 5 treasure chests'],
  ['poi5', 'Wayfarer', 'Discover 5 landmarks'],
  ['poiAll', 'Cartographer', 'Discover every landmark'],
  ['shrine3', 'Pilgrim', 'Light 3 waystones'],
  ['travel', 'Fast Feet', 'Fast travel between waystones'],
  ['summit', 'Top of the World', 'Climb to 150 meters above the sea'],
  ['swim', 'Cold Water', 'Swim in the lake'],
  ['night', 'Night Owl', 'Be outdoors at midnight'],
  ['storm', 'Lightning Rod', 'Stand outside during a thunderstorm'],
  ['talk10', 'Good Neighbor', 'Talk with villagers 10 times'],
  ['battle1', 'Field Commander', 'Lead a warband in a live battle'],
  ['bossLive', 'Dragonfall', 'Defeat Vorgrath in a live battle'],
  ['nobreak3', 'Iron Discipline', 'Win 3 live battles without a weapon breaking'],
  ['chain10', 'Storm Caller', 'Hit 10 foes with one day of Storm Jars'],
  ['frostsilver', 'Glacier Heart', 'Forge a frostsilver weapon'],
  ['starmetal', 'Star Forged', 'Forge a starmetal weapon'],
  ['greatsword', 'Champion\'s Steel', 'Forge a greatsword'],
  ['halberd', 'Long Reach', 'Forge a halberd'],
  ['diamond', 'Brilliant Cut', 'Set a diamond'],
  ['renown3', 'Talk of the Town', 'Reach Renown level 3'],
  ['renown6', 'Legend of Emberhold', 'Reach Renown level 6'],
  ['market', 'Haggler', 'Buy ore on a day its price fell'],
  ['sell', 'Ore Trader', 'Sell ore back to the market'],
  ['day30', 'Seasoned Smith', 'Reach day 30'],
  ['rich', 'Golden Anvil', 'Hold 5,000 gold at once'],
  ['allRegions', 'Explorer', 'Walk in all five lands'],
];
const MASTERY = [{ n: 3, name: 'Bronze', bonus: .06 }, { n: 8, name: 'Silver', bonus: .12 }, { n: 15, name: 'Gold', bonus: .2 }];

// Renown levels: earned from delivered weapons, raise pay
const RENOWN = [0, 60, 160, 320, 560, 900, 1400, 2100];
// weapon epithets for A and S grade work
const EPITHET_A = ['Dawn', 'Ember', 'Iron', 'Storm', 'Frost', 'Thorn', 'Ash', 'Star', 'Wolf', 'Oath', 'Grim', 'Bright', 'Night', 'Stone', 'Gale', 'Rune'];
const EPITHET_B = ['breaker', 'fang', 'song', 'warden', 'bane', 'heart', 'brand', 'call', 'edge', 'keeper', 'fall', 'bite', 'mourn', 'light', 'reaver', 'ward'];
const WEATHER_NAMES = { clear: 'Clear skies', cloudy: 'Overcast', rain: 'Rain', storm: 'Thunderstorm', snow: 'Snowfall', ash: 'Ashfall', fog: 'Mist' };
const VILLAGER_LINES = [
  'The mountains to the north hide iron and steel. Bring a good pickaxe.',
  'They say mythril glitters on the Stormspire peaks after the rain.',
  'Emberite only grows near the lava in Cinder Hollow. Mind your boots.',
  'Waystones let a traveler cross the land in a blink, once they are lit.',
  'A matching gem wins the soldiers the day. Read the scout report!',
  'The old windmill has stood since my grandmother was a girl.',
  'Frostsilver forms deep in the glacier ice past Frostfang Pass.',
  'I saw a falling star land far to the northeast. Starmetal, maybe?',
  'Your forge keeps the whole village warm on winter nights, smith.',
  'Rain makes the meadow mushrooms grow. Good for nothing, really.',
  'The Ashen Keep was a king\'s hall once. Now only the wyrm lives there.',
  'Fishermen at the lake dock swear the water glows at midnight.',
  'Climb high enough and you can see all five lands at once.',
  'Prices at the market change every morning. Buy low, smith!',
  'The standing stones hum when a storm rolls in.',
  'Soldiers with shields keep the monsters off the others.',
  'A storm jar arcs from one monster to the next. Wonderful to watch.',
  'Every chest in the wilds was left by someone. Finders keepers.',
];
