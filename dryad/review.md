# Review: dryad_walk_right (Phase 1)

**Verdict: NOT READY.** The frames are clean, distinct, on-model and correctly framed, but the motion doesn't meet the walk spec (see the failures below).

## Method actually used
- **Pose guides:** stick-figure guides drawn in code from a walk-phase model (`src/guide.py`). Blue is the anatomical LEFT/far leg, red the RIGHT/near leg. One phase per frame, phase = i/16, frame 0 = L contact.
- **Generation:**
  - GenerateImage with the guide, the mirrored side-view crop and the accepted adjacent frames as references.
  - 4 four-frame sheets (s0–s3, each 1280×720) gave frames 0–15.
  - Frames **3, 5, 8, 9 and 12** were rejected and regenerated as single figures (1280×720): 3 and 12 had high back-kicks, 5 was airborne, 8 and 9 were near-copies of 0 and 1.
  - Also rejected: a first sheet with 4 near-identical poses, and 4 earlier single keys that came out as the same stride.
- **Extraction:**
  - rembg (isnet-general-use with alpha matting) on each whole sheet.
  - The slot boundaries are **measured, not an assumed grid**: the column-occupancy minimum within ±90 px of each quarter. Results are in `src/segments.json`; hair or a hand overlapped at some cuts (21–37 px).
  - Stray fragments from neighbouring figures were removed with connected components.
- **Real source resolution:** the figures are about **600 px tall** in the sheets and about 665 px in the singles. They're upscaled ×1.5 or ×1.35 (Lanczos) to about 900 px on the 1024 canvas. **Upscaling adds no detail.**
- **Normalisation:** pivot (512, 980). Root x is the torso centre. Sheet frames keep their sheet ground line (y = 655 → 980); single frames are scaled by head-to-foot height to match.

## Checks
| check | result |
|---|---|
| Identity / costume | PASS: same face, hair, flower, tattoos, leggings and leaf heels in all 16 frames; no costume changes. |
| Distinct frames | PASS: no duplicates. The closest pair (7 vs 9) differs by a mean abs RGBA of 3.2/255; adjacent pairs differ by 4.0–14.2. |
| Alpha | PASS: true alpha from rembg, about 20% soft-edge pixels, no background halo seen on grey. |
| Canvas / scale / pivot | PASS: 1024×1024, head top at y = 80–82 and feet at y = 975–981 in every frame. |
| Clipping by canvas | PASS: nothing touches the canvas edge. |
| Clipping by extraction | **FAIL (minor):** frame 014 lost the tip of the front hand at the slot cut. |
| 8-key choreography | **FAIL:** the generator kept drifting back to a similar mid-stride. Contact/settle and push-off are weakly differentiated; clear passing poses appear only around 002, 005, 012 and 014. |
| Anatomical L/R tracking | **FAIL / unverifiable:** both legs wear identical leggings and the model doesn't reliably keep near = right; several frames read as the same leg leading. |
| Ground contact | PARTIAL: planted feet sit on the baseline (±3 px), but the planted foot does not stay fixed, so there's some **foot sliding** between frames from different sources. |
| Vertical bob | **FAIL:** head height is constant (±1 px). No settle dip or passing rise. |
| Hair / leaf secondary motion | **FAIL (weak):** the hair barely changes. |
| Loop 015 → 000 | PARTIAL: no pop in scale or position, but the pose jump is about the same size as the other transitions, so the loop reads as jittery rather than seamless. |
| Timing | 16 × 42 ms = 672 ms. The GIF stores 40 ms per frame (GIF timing is in 10 ms units); `preview.html` plays at the exact 42 ms. |
| Flower side | Note: the generated frames show the flower on the near (right) side, whereas the sheet puts it on her left. |

## What would fix it
- Regenerate per frame with a stronger pose lock (ControlNet OpenPose on a local or rented GPU).
- Or paint or rig the legs: cut her into parts and animate with a 2D bone rig, which guarantees L/R and foot locking.
- Then add bob and hair sway as an overlay pass.
