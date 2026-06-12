# Puzzle + text polish (items 1-4) — 2026-06-08

## 1. Minecraft — no dim
Tile shader stops fading blocks up from black. Hard pop-in: `if(reveal<0.5) discard; else draw full
colour`. Unplaced blocks aren't drawn (live camera shows through). Chunk-resolve + bevel kept.

## 2. Puzzle = subject only (live camera behind)
At snap, render the capture through a masked shader into a 360² RGBA render-target:
`rgb = raw camera (sRGB) at the cropped/mirrored display UV`, `a = maskAt()` (selfie segmentation).
Reuses CAM_PRELUDE `camCoord`/`maskAt` so mirror + cover-fit + mask alignment match the live view.
Tile `uMap = captureRT.texture`; tile discards where `texA<0.5` (background) → only the person tiles.
`uCrop` (vx0,vy0,vw,vh) computed from `frameRect` with the same centred-square crop, converted to the
cam quad's y-up UV. Block-break colours read back once from the RT at capture.

## 3. Comment text → short
`TP_COMMENT.str = 'COMMENT WOW FOR LINK'` (one line). Stays ink (black) + block font.

## 4. Black ink + white outline
New `textInkOutline` points layer (white, NormalBlending, larger `uSize` so it peeks past the black
core → an outline) rendered BEHIND the black core. Visible only for ink presets; neon presets keep the
faint dark backing. White outline → black text readable on any background.

## Verification (headless)
- Minecraft: mid-build shows blocks popping in with NO black squares (camera shows through gaps).
- Masked capture: tiles show the (stub) subject, transparent/camera elsewhere; 0 errors; orientation
  correct (face upright) — adjust y-flip if needed.
- Comment renders 'COMMENT WOW FOR LINK' in black with a visible white outline.
- 0 console/shader errors.
