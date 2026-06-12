# Minecraft-background puzzle (4:3, you-in-the-world) — 2026-06-08

Composite the segmented subject onto a random Minecraft world; the 4:3 result is the 3×3 puzzle.

## Assets
8 originals downscaled → `Background-Minecraft/web/bg-mn-{1..8}.jpg` (1024×768, ~200KB, ~1.7MB total).
Loaded by RELATIVE path (deploy the `web/` folder alongside the HTML on Vercel). Preloaded as
THREE.Textures at startup via TextureLoader; `bgReady[]` flags.

## Composite (capture shader)
`captureRT` → **4:3** (512×384). `pzCapMat` adds `uBg` (sampler) + `uBgY` (flip flag):
`gl_FragColor = vec4(mix( bg(vUv|flip), camera(crop), maskAt(crop) ), 1.0)` — opaque, subject over the
world. Camera `uCrop` becomes a centred **4:3** rect of the framed region (was square) so the subject
isn't squashed. Random bg chosen each `capturePuzzleNow` from the loaded set → `pzCapMat.uBg`.

## 4:3 board
`boardHalf()` returns a 4:3 on-screen rectangle: `hy=0.62`, `hx = hy*(4/3)*(db.y/db.x)` (4:3 in
pixels). 3×3 cells stay 4:3; `setTileUV` already normalised so the 4:3 atlas maps fine. Slide / swap /
Minecraft chunk-build / block-poofs unchanged; poofs sample the composite via the RT readback.

## Verification (headless)
- web JPEGs exist & load (bgReady all true).
- Puzzle builds on a 4:3 board; tiles show the MC world with the stub subject composited over it.
- Two snaps pick different backgrounds (random).
- Orientation correct (world upright, subject upright); 0 console/shader errors.
