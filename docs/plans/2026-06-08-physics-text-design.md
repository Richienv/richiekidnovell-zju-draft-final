# Physics text — weighty & smooth follow — 2026-06-08

The message text used to snap `uTextCen` directly to the hand target each frame → rigid "floating".
Give it weight: it lags, gently overshoots, and swooshes when the hand moves.

## 1. Spring-damper follow (weight)
Persistent `textPos` + `textVel` (Vector2). Target = hand-derived `(tcx,tcy)`.
`acc = (target−pos)·ω² − vel·2ζω`, semi-implicit Euler, dt-clamped (≤0.033). ω≈14, ζ≈0.72 →
visible lag + one gentle overshoot, settles ~0.4s. Render `uTextCen = textPos`. Snap to target on
first appearance (uText<0.05) so it doesn't fly in from screen-center.

## 2. Velocity smear + 3. per-particle inertia (the swoosh)
Pass `uVel = clamp(textVel·SMEAR)` to the text materials. In `TEXT_VERT`, each grain trails BACKWARD
along uVel scaled by its seed (`textP -= uVel·(0.15+0.55·sd)`), so tail grains lag more → the word
stretches along motion (squash & stretch) and swooshes like cloth, regrouping crisp at rest. Capped so
letters stay legible; with the trail-buffer glow this reads as a real motion streak.

Tuning for "weighty & smooth": the spring carries the feel; smear/inertia stay subtle. All dt-corrected.

## Verification (headless)
Fling the stub hand: `textPos` lags the target, overshoots then settles; `uVel` spikes then decays to
~0 at rest; text readable when still. 0 console/shader errors.
