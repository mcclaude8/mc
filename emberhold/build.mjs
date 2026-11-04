// Bundles the per-system source files into one playable HTML page.
//   node emberhold/build.mjs
// Outputs:
//   index.html                        standalone page (open it in any modern browser)
//   emberhold/dist/emberhold.html     the same page without the document skeleton (for Claude artifacts)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, 'src');

// Load order matters: every file shares one module scope, later files use earlier ones.
const MODULES = [
  '00-core.js',        // helpers, settings, renderer, post-processing, tweens
  '01-audio.js',       // synthesized sfx, ambience beds, generative music
  '02-data.js',        // metals, weapons, parts, foes, regions, badges, upgrades
  '03-noise.js',       // seeded simplex noise, fbm, ridged
  '04-textures.js',    // procedural canvas textures
  '05-materials.js',   // shared materials, env maps
  '06-weapons.js',     // procedural weapon meshes, heat glow, parts
  '07-characters.js',  // jointed humanoids, animation
  '08-creatures.js',   // monsters, the wyrm, wildlife
  '09-fx.js',          // particles, sparks, rings, screen text
  '10-terrain.js',     // height field, biomes, LOD chunks, splat shader
  '11-sky.js',         // sky, sun/moon, stars, clouds, day-night lighting, weather
  '12-water.js',       // lake/ocean and lava shaders
  '13-flora.js',       // trees, rocks, bushes, grass
  '14-shop.js',        // the smithy, inside and out
  '15-village.js',     // Emberhold village, villagers, landmarks
  '16-world.js',       // world assembly, resources, points of interest, wildlife
  '17-state.js',       // save state, economy, progression rules
  '18-ui.js',          // HUD, minimap, panels, journal, map
  '19-stations.js',    // station camera travel, minigame chrome
  '20-minigames.js',   // smelt, pour, hammer, quench, sharpen, assemble, mine
  '21-customers.js',   // orders, delivery, rack
  '22-battle.js',      // real-time trail battles
  '23-player.js',      // walking, third-person camera, interaction
  '24-main.js',        // day flow, input, loop, boot
];

const head = readFileSync(join(src, 'head.html'), 'utf8');
const body = readFileSync(join(src, 'body.html'), 'utf8');
const js = MODULES.map(f => `/* ==== ${f} ==== */\n` + readFileSync(join(src, 'js', f), 'utf8')).join('\n');

const importMap = `<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"}}</script>`;
const page = `${head}\n${body}\n${importMap}\n<script type="module">\n${js}\n</script>\n`;

mkdirSync(join(here, 'dist'), { recursive: true });
writeFileSync(join(here, 'dist', 'emberhold.html'), page);
const standalone = `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">` +
  `<style>:root{box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;padding:0}[hidden]{display:none!important}</style></head><body>\n${page}</body></html>\n`;
writeFileSync(join(here, '..', 'index.html'), standalone);
console.log(`built ${MODULES.length} modules, ${(page.length / 1024).toFixed(0)} KB`);
