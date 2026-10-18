# Dryad walk right — review (v2, 2D bone rig)

v1 (the generated-frame walk) is backed up in `v1/`.

## Method
- **Master:** one generated right-facing side frame. It is 1280x720 and the figure is about 660 px tall. Background removed with rembg (isnet). The far-side flower was painted out.
- **Parts:** cut into 8 layers: back hair (strip mesh), far arm, far leg (thigh/shin/foot, darkened ×0.8), torso+head, leaf strands, near leg, near arm (upper arm + forearm/hand), front hair lock. Hidden overlaps were inpainted with OpenCV TELEA, and the back of the buttock was rebuilt as an ellipse.
- **Rig:** pelvis, spine, neck, head; per leg hip→knee→ankle→ball; arms with shoulder/elbow/wrist; hair chain h0–h4 and leaf chain. Mesh skinning is linear-blend on subdivided plane grids, so knees and hips bend instead of hinging.
- **Animation:** 16 frames × 42 ms = 0.672 s, looping. Keys: 0 L contact, 2 L settle, 4 R passing, 6 L push-off, 8 R contact, 10 R settle, 12 L passing, 14 R push-off.
  - Legs use 2-bone IK. The planted foot slides back at a constant 15.1 px/frame (canvas), so there is no world foot skate.
  - Stiletto heel-toe roll: heel strike −12°, flat, then heel-off about the ball up to +38°.
  - Pelvis bob is 6 px, low at contact/settle and high at passing. Slight pelvis rotation, arm counter-swing, and hair/leaf lag.
- **Output:** 1024x1024 RGBA with true alpha, pivot (512,980). The real art is a 660 px figure scaled ×1.374. Upscaling adds no detail.

## Checklist
| Item | Result |
|---|---|
| Identity / costume preserved | PASS (same master on every frame) |
| Legs alternate, far leg darker | PASS |
| Ground contact / no skate | PASS (numerically verified) |
| Loop 15→0 | PASS (phase-periodic) |
| Alpha / canvas / pivot | PASS |
| 16 distinct frames | PASS |
| Joints / gaps | PARTIAL, see defects |

## Known defects
1. There is a visible seam where the near thigh meets the rebuilt buttock in swing frames (about 4–7 and 12–15).
2. The inpainted region over the back of the bikini bottom reads pale/whitish. Its fabric texture is lost.
3. The far thigh top shows a dark notch at the hip during far-leg swing.
4. The back-hair fill behind the near arm is a cloned band and slightly greyer than the real hair.
5. The cut-out look: the body has no turn or volume change through the stride, and the upper body is a rigid sprite with mild rotation.
6. There is a small stray sliver near the front of the waist in some frames.
