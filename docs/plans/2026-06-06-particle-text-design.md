# B1 — Particle Text (2026-06-06)

Particles fly from their cloud into a readable word that floats between the hands. Reuses the
particle pool + trail/glow.

## Mechanism
- `buildTextTargets(str)`: render the string to a hidden 2D canvas (heavy condensed sans), sample
  lit pixels, normalize to a centred [-0.5,0.5] box (track aspect), and write one target per particle
  into a new `aTarget` (vec2) attribute. Recomputed only on text change.
- Particles assigned to random lit pixels (even density) + tiny jitter.
- Vertex shader: `finalP = mix(modeShapePos, uTextCen + aTarget*uTextScale, uText)`; color → `uTextCol`,
  fade → 1 as `uText`→1. Smooth ease in/out.
- Bump pool 9k → 16k for legibility.

## Placement
Between the hands: `uTextCen` = hand-field centroid; `uTextScale` from the field's major axis
(clamped 0.25–0.9 NDC half-width), height = width/aspect so it isn't stretched. Spread hands = bigger.

## Trigger / UX
- `MESSAGE` button + `t` key toggle text mode.
- `EDIT` button → `prompt()` for custom text; cycles presets (`I LOVE YOU`, `HI`, `WOW`).
- Works in any pinch-mode (mode just colours it). Shows when text on AND hands present (not during
  seal/aura). Default colour warm white-gold.

## Verification
Headless: set message, raise hands, confirm `uText` ramps, particles land on sampled letter points,
screenshot shows a readable word, 0 console errors. Clean up.
