# Power-Up Aura flagship (Super-Saiyan) — 2026-06-06

Make the effect happen ON the person → the shareable "transform-YOU" moment. Reuses the particle
engine (additive glow, trail buffer, motion-energy scatter) we already built.

## Components
1. **Head tracking** — add MediaPipe `FaceLandmarker` (numFaces:1) beside the gesture recognizer +
   segmenter. Per new frame → head anchor `{present, cx, cy, rx, ry}` in mirror-corrected screen-uv
   (bbox of the 468 landmarks). Smoothed. Only run when both hands are present or the aura is active.
2. **Aura emitter** — a dedicated `THREE.Points` (~10k) anchored to the head, added to `trailScene`
   so it feeds the **trail buffer** → licking flames. Particles spawn in a wide oval skirt around the
   head/shoulders (radius > head, so the face stays clear) and **flow upward** with flame sway +
   inward taper, **gold → white-hot**, brightest at the base. Height/brightness scale with `uPower`
   (charge) and `uEnergy` (flare).
3. **Trigger = power up** — both hands raised above the chin line (`palm.y < face.cy + face.ry*1.4`)
   → `auraPower` ramps up (slow charge), sustain while held, decays when lowered. **Motion (hand
   speed → energy)** makes it flare bigger + white-hot. No instructions needed.
4. **Rim light** — full-screen additive quad sampling the person mask edge → gold glow along the
   silhouette while the aura burns (reuses the segmenter already wired for clones).
5. **Peak punch** — a CSS radial vignette whose opacity tracks `power*energy` so the peak hits.
6. **Focus** — suppress the hand panel + hand particles while the aura is active (aura is the hero).

## Integration / perf
- Loop: recognizer → face (if hands present / aura active) → clones → mask (if seal/clone/aura) →
  aura → panels → particles → render trails (incl. aura) → composer → overlays.
- Peak load = 3 MediaPipe models (hands+face+seg) only while powering up; idle runs hands only.
  Gate face/seg to active states; can drop face to 15 Hz if fps dips.
- Aura draws over the person (energy in front); face stays clear because the skirt emits at radius >
  head. Pushing the aura *behind* the person via the mask is a possible v2.

## Verification
Headless: stub `face` + raised hands via `window.__T.setFace`/`setHand`; confirm `auraPower` ramps,
aura points become visible, screenshot shows a gold flame rising around the head; flare grows with
`setSpeed`; rim light appears with a stub mask; 0 console errors. Then clean up.
