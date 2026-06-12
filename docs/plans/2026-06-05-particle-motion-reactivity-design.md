# Particle motion reactivity + trails (A1 + A2) — 2026-06-05

Make the particle field feel *alive* (the thing the TouchDesigner references have that we don't).

## A1 — Flick to scatter, calm to gather
- Compute `energy` 0..1 from max hand speed (`handSpeed`), with a deadzone + scale.
- **Fast attack, slow decay** envelope → a flick spikes energy, then it eases back like momentum.
- Pass as `uEnergy` to the particle vertex shader, which:
  - flings each particle outward = `outDir*k + perParticleRandomDir*k`, scaled by energy & seed,
  - adds high-freq turbulence,
  - boosts point size, shifts colour toward white-hot,
  - lifts the boundary feather so the burst stays visible.
- Energy→0 ⇒ particles relax back to the clean shape target.

## A2 — Motion trails (persistent buffer)
- A **half-float trail RT** at drawing-buffer size, cleared once.
- `trailScene` = a black fade-quad (alpha ≈ 0.12, normal blend → multiplies buffer by ~0.88/frame)
  + the particle `Points` (additive). Move `partPts` out of `scene` into `trailScene`.
- Each frame: render `trailScene` into the RT with `autoClear=false` (persist). No read/write hazard
  (fade-quad uses framebuffer blending, not a texture sample).
- A full-screen **composite quad** in `scene` (renderOrder 4, additive) samples the trail RT so the
  streaks draw over the camera + dim panel, then OutputPass sRGB-encodes the sum.
- Resize: rebuild/clear the RT.

## Why cheap & safe
Only the particle path changes; camera, panels, clones, hero untouched. Half-float avoids harsh 8-bit
trail clipping. Reversible (one composite quad + one extra render).

## Next
B1 — particle text/shape (assemble particles into a word/heart on a pose).

## Verification
Headless: drive `energy` via fast vs still hands; confirm scatter (particles exceed the calm radius),
trail buffer accumulates (non-zero after motion, decays when still), 0 console errors; screenshots of a
flick (streaks) vs calm (clean shape).
