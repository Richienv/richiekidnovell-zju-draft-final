# Puzzle mini-game (frame → snap → 3×3 sliding puzzle) — 2026-06-06

A hand-framed photo becomes a 3×3 sliding puzzle solved with the index finger.

## State machine
`idle → framing → puzzle → (solved) → idle`. `puzzleActive = state!=='idle'` suppresses the
panel/particles/aura/clones so the game owns the screen.

## Frame (framing)
- `isFrameHand(h)`: index + thumb extended, middle/ring/pinky curled (an L / finger-gun).
- Both hands L for ~4 frames → enter `framing`. Rect = bbox of each hand's corner =
  midpoint(index-tip 8, thumb-tip 4). Live `#frameGuide` DOM rectangle + viewfinder dim + hint.

## Snap (capture)
- In framing, index→thumb pinch (`indexThumbPinch`, either hand) rising edge → set `captureFrameReq`.
- In the loop, right after `composer.render()` (effects suppressed = clean camera), copy the
  rect of the **GL canvas** (preserveDrawingBuffer) into a 360² canvas, centre-cropped square →
  `CanvasTexture` (sRGB). Already mirror/cover-fit-correct since it's the displayed pixels.

## Puzzle (puzzle)
- 8 tiles (src 0–7) + 1 hole (`emptySlot`, init 8); reveal piece src 8 hidden until solved.
- Shuffle = 100 random legal slides from solved (always solvable).
- Rendered **in GL** (ortho `pzScene`, 8 textured quads with per-tile UVs → recordable). Square
  board centred, sized to ~62% height. Tiles lerp to their slot centre (slide animation).

## Solve (point + pinch)
- Pointing hand = a present hand with index extended; cursor dot at its index tip; hovered tile
  highlighted only if adjacent to the hole.
- `indexThumbPinch` rising edge on that hand, over an adjacent tile → slide it into the hole.
- Solved = every tile.slot==tile.src && emptySlot==8 → reveal src 8, show `SOLVED!` banner.

## Exit / retake
- `#pzExit` button → idle. Both L-hands again (held) → re-enter framing (fresh capture).

## Verification
Headless: stub frame-hands → framing + rect; stub pinch → capture builds 8 tiles + texture;
simulate point+pinch slides (adjacency enforced); force-solve → reveal + banner; 0 console errors.
