# Forest Dryad Ranger: design spec (Phase 1)

Source: `src/sheet.jpg`, 1408×1408 JPEG ("Forest Dryad Ranger turnaround sheet, ver 1.0, Studio Wildroot").
The side-view figure crop is only **about 155×607 px** (`src/side_crop.png`). It faces viewer-LEFT, so the
right-facing master reference (`src/side_ref_right.png`) is a horizontal mirror of it. (Caveat: the mirror flips anatomy, see below.)

## Identity
- **Race and class:** dryad ranger. 168 cm, 54 kg, adult, age "unknown".
- **Face:** soft anime face, large almond green eyes, small nose, gentle smile (neutral/calm is the default). Long pointed elf ears that angle up and back.
- **Proportions:** about 7.5 heads tall. Very curvy hourglass figure, long legs, small hands and feet. Heels add about 8–10 cm.
- **Hair:** very long (to the thighs), loose and slightly wavy, moss green (#3B5137 swatch, highlights about #6E8A4E). Side bangs. **Pale pink-lavender flower** above her **left** ear (it sits on image-right in the front view).
- **Costume (preserve as drawn):** a minimal leaf-and-vine armour top and briefs joined by thin vine cords and side ties. Leaf-textured olive vine **arm wraps** from the upper arm to the wrist. Olive leaf-mesh **thigh-high leggings** wrapped in criss-cross vines. **Leaf-strap stiletto sandals** (olive). Vine bracelets.
- **Distinctive details:**
  - flower in her hair (left side)
  - green vine **tattoos** across the shoulders, collarbone and upper arms
  - thigh vine wraps
  - leaf heels
  - small leaf earrings and pendant accents
- **Expressions on the sheet:** neutral, focused, smile, curious, determined, blush. The walk uses neutral/calm.

## Palette (hex sampled from the sheet's swatches, box-averaged)
| swatch | hex |
|---|---|
| Hair / leaf | #3B5137 |
| Eyes / gem | #798650 |
| Bark / wood | #775C41 |
| Vine / shadow | #555751 |
| Flower / accent | #886BA2 |
| Skin / light | #FBCFBE |

## Weapon: vine bow
A living-wood recurve bow (dark bark core, green vine string, a spirit-bloom focus at the grip) that fires thorn-seed arrows.
**No figure on the sheet holds or wears it.** The bow appears only in the separate "bow details" panel.
**Assumption for Phase 1: the bow is NOT drawn in the walk** (treated as stowed or off-model) to avoid inventing a sling or quiver.
For later phases I assume she is right-handed: bow held in her LEFT hand, string drawn with her RIGHT.

## Lighting
Flat, even studio light from the front-upper-left. Soft cel shading with one shadow tone, light glossy highlights on the skin and leggings. No rim colour, no cast shadow on the sheet.

## Exclusions
The wolf companion (Lirian) is excluded.

## Assumptions NOT visible in the reference
1. Handedness (right-handed) and bow hand (left). Nothing shows her holding the bow.
2. How the bow is carried while walking (no sling or quiver is drawn), so it's omitted from the walk.
3. Her **right** side in profile. The sheet's side view shows her left side. The right-facing view is inferred by mirroring, so the flower's side in a right profile (it should be on the FAR side, mostly hidden) is an inference.
4. How the hair and costume behave in motion (sway amount, cord flutter).
5. Gait style (a heel-toe walk in stilettos).
6. Exact tattoo layout on the right arm and shoulder (only partly visible).
