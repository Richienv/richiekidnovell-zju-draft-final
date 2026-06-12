# Minecraft chunk-load puzzle + block-break poofs — 2026-06-08

Make the puzzle "build" like Minecraft chunks when the photo snaps, and spray cube particles on swaps.

## Part A — chunk-load build-in
Replace the tile `MeshBasicMaterial` with a `ShaderMaterial` driven by a global `uBuild` clock
(0→1 over ~0.9s, `buildStart` set in `buildPuzzle`). Per tile, per fragment:
- **Chunk resolve**: quantize the texture UV to a block grid whose count STEPS up with uBuild
  (~4 blocks → sharp) → "chunks loading."
- **Reveal sweep**: blocks pop in along a diagonal across the whole board; timing keyed off the
  tile's current board position (`uBoardPos`, set each frame from the mesh position) so it assembles
  block-by-block, not all at once. Unrevealed fragments discard.
- **Block bevel**: lighter top-left / darker bottom-right per block (3D cube look); strong during
  build, fades to subtle once sharp. After uBuild=1 it's a crisp normal puzzle.

## Part B — block-break poofs
GL Points system `breakPts` in `pzScene`. On a successful tile move (cell change), emit a burst of
SQUARE particles (gl_PointCoord box, no round falloff) in the tile's colours, with velocity + gravity
+ short life. Pure juice, on-theme.

## Integration
- Tile material: texture → `uMap` uniform; `setTileUV` still writes geometry uv (shader samples it).
- `uBuild` fed to all 9 tile shaders each frame; `uBoardPos` from each mesh's NDC position.
- Slide/swap/solve logic untouched except an `emitBreak()` call on each move.

## Verification (headless)
buildPuzzle → uBuild ramps 0→1 then holds 1 (crisp), tiles visible/correct; simulate swap → break
burst spawns (drawRange>0); 0 console/shader errors; screenshot mid-build chunky state.
