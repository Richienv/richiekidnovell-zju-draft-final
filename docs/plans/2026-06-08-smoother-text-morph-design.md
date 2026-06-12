# Smoother text — word→word morph + silky motion — 2026-06-08

Two smoothness fixes the user asked for: (1) the message-to-message swap had a dead gap; (2) the
motion read as random sparkle, not flow.

## 1. Word→word morph (no gap)
- `textGeo` now carries **two** target attributes `aTargetA` / `aTargetB`; the vertex blends them
  `mix(aTargetA, aTargetB, smoother(uTMorph))`. A `mflight = 4·m·(1−m)` term arcs grains mid-flight.
- **Pre-bake** every message's per-particle targets once at load (`bakeTargets` → `tp._t`, `tp._aspect`).
  Eliminates the per-swap `getImageData` + 52k-loop frame **hitch**.
- Transition logic in `updateParticles`:
  - message changed **while hidden** (`uText<0.06`) → `applyTextDirect` snaps both slots, dissolves in.
  - message changed **while visible** → `startTextMorph`: freeze the current interpolated positions into
    `aTargetA`, set `aTargetB` to the new word, run `uTMorph` 0→1. Colour + box-aspect lerp alongside.
  - `uText` (visibility) stays at 1 across a morph → **no empty gap**. Verified: minUText during a swap
    stayed 0.999.

## 2. Silky motion
- **Coherent flow field** replaces independent per-grain `sin(seed)` churn: neighbours sample a shared
  field (`flow = vec2(sin/cos of lp·field + t)`), so the text undulates like silk instead of sparkling.
- **dt-corrected easing** (`elerp = c+(t−c)(1−e^(−k·dt))`) on `uText`, `uOn`, and `partEnergy` →
  identical feel at 30 or 60fps (no FPS-dependent stutter).
- **smootherstep** (C2) on the reveal and the morph curve; twinkle dialled from a buzz to a shimmer;
  a slow large-scale undulation travels across the word.

## Verification (headless stub)
All 9 messages pre-baked (`bakedAll=true`). peace→fist and single→combo morph with `uText` pinned at
0.999 (no gap) and `textMorph` animating 0→1. Nebula still renders (partOn 0.98). Settled messages
readable. 0 shader/console errors (only favicon 404).
