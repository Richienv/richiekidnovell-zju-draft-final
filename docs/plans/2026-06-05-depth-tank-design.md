# DEPTH TANK — design (2026-06-05)

Pivot away from the flat 2D "DEPTH WARP" toward a single hero mechanic inspired by
reference video 1 (a TouchDesigner clip): a **3D glass prism held and rotated between
two open palms**, over the live camera.

## Decisions (from brainstorming)
- **Direction:** the 3D held-tank (not BLOOM, not both).
- **Control:** two open palms — box spans palm-to-palm; tilt rotates; spread scales; drop fades.
- **Content:** spectrum/thermal strip on top + starfield/rippling-water front face; **hand-driven**
  reactivity (no microphone permission).
- **Scope:** strip everything else (warp, zones, glass-draw, slice, grab). One mechanic, deep.

## Architecture
- Single **perspective** scene. Live camera = a quad filling the frustum at the far plane
  (mirrored, cover-fit, sRGB→linear via the same camSample; OutputPass re-encodes → pixel-clean idle).
- The tank = true 3D geometry in front of the camera quad.
- `RenderPass(scene, perspectiveCam)` + `OutputPass`. No bloom pass (keeps idle glow at 0).

## Tank
- Procedural box (no assets): additive white **wireframe edges**, **front face** shader
  (starfield + caustic ripples + central glow), **top face** shader (thermal spectrum strip),
  faint tinted **side faces** for solidity.
- Transform each frame from two palm anchors (unprojected to 3D): position = midpoint,
  width/scale = hand distance, roll = hand-line tilt, + fixed forward pitch so the top face
  shows. Smoothed (lerp position/scale, slerp rotation).

## Reactivity (hands, no mic)
- combined hand speed → ripple amplitude + spectrum energy.
- hand closeness → central glow size/brightness.
- hand distance → tank scale.

## Activation
- both hands OPEN ~8 frames → fade in; drop either OPEN 6 frames → fade out ~400ms.

## Kept
camera, MediaPipe recognizer, MIRROR/CAPTURE/FULLSCREEN/CLEAR/RECORD, idle pixel-cleanliness,
top-center state readout, new HOW TO PLAY.

## Known iteration point
The look of the front-face water and the top spectrum strip is the "wow" and will need a
visual pass after seeing it live on a real webcam.
