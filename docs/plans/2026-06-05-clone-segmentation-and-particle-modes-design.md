# Shadow-clone segmentation + particle-morph modes (2026-06-05)

Two upgrades to `pinch-curtain.html`, driven by two reference videos.

## Feature 1 — Shadow Clone v2 (person cutout + layering)
Reference: Naruto shadow-clone meme (a crowd of the *person*, not oval photos).

- **Segmentation:** add MediaPipe `ImageSegmenter` (selfie model) beside the existing
  `GestureRecognizer`, same FilesetResolver. Per new frame → person confidence mask,
  read via `getAsUint8Array()` into a `THREE.DataTexture` (RedFormat/UnsignedByte, linear).
  Only run while a clone is active (`sealActive || cloneAmt>0.01`) to save GPU.
- **Cutout:** clone shader multiplies alpha by the mask (feathered), so each clone is a
  person-shaped cutout; live room shows between them. Falls back to the oval crop if the
  segmenter fails to load (`uHasMask=0`).
- **Layering ("original in front"):** draw order back→front =
  1) live camera, 2) clone crowd (segmented, smaller, fanned out from the hand-clasp anchor),
  3) **hero cutout** — a full-frame masked cutout of the *live* you, renderOrder 40, drawn last,
  so any clone that drifts inward is occluded by you. Same pixels already on screen → no doubling.
- **Anchor / crop:** clones fan from the smoothed average palm point (≈ person center) and crop
  the camera there, so they sample the actual person.
- **Mask orientation:** sample mask at `(c.x, 1.0 - c.y)` to match the flipY'd VideoTexture;
  `k` key toggles the flip as insurance on real hardware.

## Feature 2 — Particle-morph effects (modes 0–2)
Reference: hand-gesture particle clip (a glowing cloud that morphs between shapes).

- **`THREE.Points`, ~9k additive glowing particles**, added to the main `scene` (sRGB-correct
  through OutputPass). Each particle carries a stable `aSeed` (angle, radius, phase).
- **Domain = oriented ellipse fit to the hands** each frame via 2×2 PCA of all hand landmarks
  (centroid + major/minor axes → NDC), so "the hands create it" still holds.
- **Per-mode target in the vertex shader**, eased between old/new mode over ~0.5s (`uMorph`)
  → smooth morph when you pinch to switch:
  - **0 NEBULA** (teal/blue) — diffuse disk fill + curl drift + twinkle.
  - **1 ORB** (gold, hot core) — collapse into an orbiting glowing sphere.
  - **2 PRISM** (rainbow) — spread into a shimmering horizontal wave-ribbon, hue along X.
- **Mode 3 red dot-matrix unchanged.** Particles hidden in mode 3 / during the seal.
- The hull panel stays as a dim backing + rim (`uFill≈0.25` for modes 0–2) so locked
  snapshots stay coherent; particles are the hero. Lock/clear untouched.

## Verification
Headless harness (stub camera + fake recognizer + `window.__T`): synthetic mask DataTexture to
confirm cutout + orientation; PCA ellipse + particle visibility + morph ramp; screenshots of the
crowd and each particle mode; 0 console errors. Then clean up the test file.
