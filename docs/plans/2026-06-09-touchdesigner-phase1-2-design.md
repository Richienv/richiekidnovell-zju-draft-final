# TouchDesigner-grade upgrade — Phases 1+2 — 2026-06-09

## Phase 1 — 3D foundation
- **One-euro filtering** on all 21 landmarks (x, y, AND MediaPipe z) replaces lerp(0.5): still at rest,
  zero-lag in motion (minCutoff 1.4Hz, beta 28).
- **Sprung 3D hand frames** `H3[i]`: position from palm-screen-pos + size-derived depth
  (d = 0.55/knuckle-span, clamped 3–8.2 world units), orientation basis wrist→middle ∧ index→pinky
  (with landmark z). Critically-damped springs on position (ω16 ζ0.82) and quaternion (ω13 ζ0.92,
  angular-velocity integration). Snap on first appearance.
- **Head parallax**: face center drives a sprung pcam offset (±0.42). camQuad re-parented INTO pcam
  → the video is glued to the camera, 3D objects shift against it = window illusion, no edge crops.
- Face landmarker gate widened: any hand present (every 2nd frame) — parallax + cage need it.

## Phase 2a — holo-cube (ref v2)
Volumetric raymarched cubes (16-step fbm volume + hologram scan stripes + fresnel glass shell +
glowing edge wireframe) replace the JJK orb core sprites. Red cube left ☝, blue right ☝, sprung to
0.22 above the fingertip, oriented by the hand frame plus an idle spin that accelerates with charge.
Merge → both pull to the midpoint and blend to purple; throw → okok flow untouched. White
double-box wireframe CAGE floats around the head (face-depth-estimated, sprung, slow drift) while
any cube is live. Old jjkCorePts permanently hidden; particle clouds retained as energy ambience.

## Phase 2b — bloom-tree (ref v3)
Trigger: 🤘+🤘 (both hands horns; single horns keeps its message — combo returns null in
activeTextPreset). Deterministic L-system skeleton (66 curved segments, 12 tip flowers), grown by
g∈[0,1] at 2.6s: stems extend segment-by-segment via per-segment [g0,g1] windows; screen-space
ribbon shader (px-width by branch depth, DoubleSide). Flowers: billboard quads with procedural
4-lobe petal pattern, bloom = 1−e^(−4u)cos(6u) (overshoot → settle). Root sprung between the two
H3 frames; height from hand distance (1.5–2.9); uSpread from spread; sway = sprung lean from root
velocity + sinusoidal wind, amplitude ∝ height². Monospace fingertip readouts (GROW % / SPREAD °).
Suppresses the live panel while active.

## Phase 2c — X-ray lens (ref v4)
livePanel hull RETIRED → true 3D plane between the hands: x-axis = hand-to-hand, normal = average
palm normal (orthogonalized, 35% flat bias), sprung pos+quat → real perspective trapezoid.
Fragment samples the camera at the plane's exact screen projection (vClip/w → suv) = a lens that
transforms what's behind it. Pinch modes: 0 THERMAL (jet, posterized, sensor noise), 1 NIGHT
(green amp + scanlines + grain), 2 EDGE (sobel cyan blueprint), 3 DOT-MATRIX (red halftone).
White frame line + tilt fresnel + travelling specular streak. liveOn semantics unchanged
(particle field as before); lens requires both hands.

## Strongest calls (made without asking, per the brief)
1. Holo-cube replaces the orb CORES (not the clouds) so the loved charge→throw→okok flow is intact.
2. Tree trigger = horns+horns (L+L is the puzzle's; ref-faithful "L-gesture" was taken).
3. Single-open-hand no longer shows a panel (hull retired); particles unchanged.
4. Lens reuses existing pinch-mode system; MODE_NAMES in the HUD unchanged (nebula label + thermal lens share mode 0).
5. Old PANEL_FX hull material left in place but never shown (zero-risk retirement).

## Verification (headless, swiftshader)
H3 placement/depth + parallax flip; cube vis/merge 0.81/throw→okok; tree grow 0→1 + readouts +
single-horns message intact; lens vis + 4 modes + perspective tilt screenshot; full regression:
7 single messages, 2 combos, tree, lens, holo, puzzle frame→snap→9 tiles+mask. 0 console errors.
