# Dryad walk right — v4 (AutoSprite free tier)
- Frames: 13 native (no tweens), 58 ms each, loop 0.754 s. Canvas 1024², pivot (512,980), true alpha from the source.
- Source frames are ~230 px tall and upscaled x3.83 with LANCZOS, so expect **visible softness** at 1024. Treat the result as a 2x-quality asset; display at ≤512 px.
- Duplicates: none (md5 unique). Smallest neighbour difference is 000→001; 012→000 is close but distinct, so the wrap is smooth.
- Contacts / passing: heel contacts around 000/006 and passing poses around 004/009–010 (each side). Contact sheet shows lowest foot on baseline every frame.
- Sliding: walk-in-place, horizontally aligned on the torso centroid. Planted foot drifts a few px between frames (the AI source isn't foot-locked), so there's minor sliding if you move the root at constant speed.
- Silhouette and consistency: on-model the whole way, with stable hair, outfit and proportions. Small flicker in the hand and hair edges, typical of AI output.
- Checklist: no duplicates ✅, contacts ✅, passing ✅, silhouette ✅, consistency ✅ (minor flicker), foot locking ⚠️ approximate, resolution ⚠️ upscaled.
