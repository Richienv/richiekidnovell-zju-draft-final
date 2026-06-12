# Message gestures + live "neon" text — 2026-06-07

Nine gesture→message presets with text that breathes/glows like the nebula/orb.

## Gesture map (accuracy-first)
curls = [thumb, index, middle, ring, pinky], low = extended.

| Message | Pose | Detector |
|---|---|---|
| I LOVE YOU (red) | ✌️ peace | index+middle out, ring+pinky in |
| ISN'T THIS COOL? (blue) | ✊ fist | all curled |
| COMMENT "MAU"… (white) | 🖐 four | 4 fingers out, thumb tucked (proj on knuckle line) |
| Hi I'm Richie (green) | 🤟 three | index+middle+ring out, pinky in |
| Hey (cyan) | 👍 thumbs up | thumb out + tip above its MCP; 4 fingers curled |
| OH WAIT WHAT IS THIS? (orange) | 🤘 horns | index+pinky out, middle+ring+thumb in |
| BUILT THIS IN 2 HOURS / FOR CONTENT (purple) | 🤙 shaka | thumb+pinky out + geometric spread, 3 middle in |
| CHECK THIS FIRST (teal) | 👍+🤙 two-hand | thumb + shaka |
| DO YOU WANT IT? (magenta) | ✌️+🤙 two-hand | peace + shaka |

**Accuracy rules:** `handPose()` classifies each hand most-specific-first. Two-hand combos are
checked BEFORE singles (so thumb+shaka → "check first", not "Hey"+"build"). No two poses differ by
the thumb alone (the fragile case). Shaka adds geometric thumb/pinky-spread checks. A pose must hold
**3 stable frames** (`textCommitTp` debounce) before it commits — kills flicker, misfires, and the
combo race where one hand is seen a frame before the other. **Point is NOT used** (reserved for the
red/blue JJK orbs).

## Live text — full nebula steal, two-layer
1. **Glow under-layer** (`textGlowPts` in `trailScene`) → motion-trail persistence + selective bloom,
   same path as the nebula. Soft halo + bright core, dim per-grain (bloom amplifies). This is the
   "alive neon" wash.
2. **Crisp top-layer** (`textPts` in `scene`) → keeps letters legible over the glow.
3. Shared `TEXT_VERT` ports the nebula's life: per-particle **turbulence churn** + micro-orbit +
   ripple (small so letters hold), 3D depth parallax/breathe, **energy reactivity** (hand speed →
   grains fling out + white-hot, slow-decay momentum), twinkle, depth-shaded size/brightness.
4. **Buttery transitions** kept: staggered per-grain dissolve (`vRev` from per-particle `sz`) +
   cross-dissolve (old message melts fully out, swap targets+colour, new melts in).

## Verification (headless stub)
All 7 single poses + 2 combos classify correctly; open→nothing; single shaka/thumb still map to their
own message. Energy: calm textEnergy 0 → fast 1.0 → decay 0.055. Nebula still renders. Messages render
as readable glowing neon. 0 console/shader errors.
