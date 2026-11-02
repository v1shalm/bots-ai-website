# BOTS.AI: Structure

Landing page in a blueprint art direction: every illustration is one large structural
wireframe drawing in blue line-work with a single pink element, set straight on the paper.
Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Run

Serve the folder with any static server, then open `http://localhost:8000`:

```
python3 -m http.server 8000
# or: npx serve .
```

## Files

| File | What it holds |
|---|---|
| `index.html` | All page content and section markup |
| `style.css` | Type scale, layout and motion styles. The last blocks ("Cleanup pass", "Art pass") override earlier rules |
| `app.js` | Smooth scroll and every scroll or pointer-driven effect |
| `lenis.min.js` | Smooth-scroll library (Lenis), vendored |
| `fonts/` | Geist Serif (headings) and Geist (text), SIL Open Font License in `OFL.txt`. Geist Mono is declared but barely used; the Inter Tight file is no longer loaded |
| `clients/` | Client logos for the proof strip, recoloured to one grey |
| `img/` | All illustrations, 1800px wide, with the paper colour `#f7f7f4` baked in |
| `logo.svg` | Official BOTS.AI logo |

## Motion

| Where | What happens | Code |
|---|---|---|
| Page load | Drafting-grid intro sweeps the screen, then the hero building draws in bottom-up | `intro()` in `app.js`, `.intro` / `.draw` in CSS |
| Hero | A lamp follows the cursor across the blueprint; the page slides up over the pinned hero | `--mx`/`--my` on `#heroArt`, `.sheet` |
| Headlines | Rise word by word | `.split` in `app.js`, `.w` in CSS |
| Figures | Count up when they enter | `count()` in `app.js` |
| Point of view | Ranked columns draw in left to right, then drift | `valueImg` in `frame()` |
| Capabilities | Phase line fills; the card at mid-screen lights up and swaps the drawing on the left | `capList` / `capImgs` in `frame()` |
| 6A framework | Pinned: the building is built floor by floor, stages tick off, counter runs 01–06 | `rise` block in `frame()` |
| Proof | Hourglass parallax | `featImg` in `frame()` |
| Industries | Hovering a row brings its drawing forward in the side panel | `setInd()` at the end of `app.js` |
| Why | Arch drifts and scales with scroll | `whyImg` in `frame()` |
| Closing CTA | Bridge draws left to right | `bridgeImg` in `frame()` |
| Nav | Switches light/dark with the section under it; hides on scroll down | top of `frame()` |

Everything respects `prefers-reduced-motion`.

## Art references

All images were generated with GPT Image. To add or replace one, generate with the same style
line plus a subject, then set the image's background to the paper colour `#f7f7f4`, removing
any vignette, so it sits on the page without a visible box.

Style, light drawings:
> Match the attached reference's drawing style exactly: a precise engineer's 3D wireframe drawing, thin crisp uniform lines in blue (#459CE7) on a very pale blue-white field (#EEF5FD), a few planes very lightly filled with translucent pale blue, and exactly ONE element picked out in magenta-pink (#DD27FB). ONE large object, dramatic but calm three-quarter perspective, large in frame, generous empty field around it, NOT isometric, NOT a miniature scene, no clutter, no small props, no people unless stated. Absolutely no text, letters, numbers, logos or signage.

Style, dark drawings (`voice`, `ins-book`):
> Match the attached reference's drawing style exactly: a precise engineer's 3D wireframe drawing in thin white and blue (#459CE7) lines on a deep ink-navy background (#120A1A), a few planes faintly filled with translucent blue, exactly ONE element in magenta-pink (#DD27FB). ONE large object, dramatic three-quarter perspective, large in frame, calm, no clutter. Absolutely no text, letters, numbers, logos or signage.

Style for the three original drawings (`s3`, `s5`, `s6`):
> Style must match the attached reference exactly: a precise engineer's 3D structural wireframe, thin crisp uniform lines in blue (#459CE7) on a very pale blue-white field (#EEF5FD), some planes very lightly filled with the same pale blue, and only one or two members picked out in magenta-pink (#DD27FB). Clean, structural, confident, architectural; no people, no text, no numbers, no logos, no signage.

| File | Used in | Subject prompt |
|---|---|---|
| `img/s3-dark.jpg` | Hero (dark) | A dramatic three-quarter view of a tall modern building's complete structural frame rising from the ground, drawn in thin white and blue lines on a deep ink-navy background (#120A1A) instead of pale blue, a few planes faintly filled in translucent blue, two members in magenta. Wide landscape (about 16:9). |
| `img/s5-rising.jpg` | 6A framework | A mid-rise building under construction seen at eye level from the front, the structural frame complete up to the roof; the lower floors are softly filled with pale frosted glass planes as if finished, the upper floors still open frame; one floor slab edge in magenta. Wide landscape (about 2:1), building centred, ground plane at the bottom. |
| `img/s6-bridge.jpg` | Closing CTA | A long, elegant cantilevered truss bridge spanning the full width of the frame from left to right in gentle perspective, its lattice of members drawn in fine blue lines, deck plates lightly filled, one diagonal member in magenta, nothing else. Very wide landscape (about 3:1). |
| `img/value.jpg` | Point of view | a row of seven tall structural columns of clearly different heights standing on one long base slab, like a three-dimensional ranked bar chart built in steel lattice, seen in low perspective receding to the right; the tallest column in magenta. Very wide landscape (about 3:1). |
| `img/cap-train.jpg` | Capabilities · Train | a tiered lecture theatre seen from the back row looking down: curved rows of stepped seating drawn as structure, with a dozen seated people drawn as simple blue-line figures, and one standing presenter at the front in magenta. Landscape about 4:3. |
| `img/cap-transform.jpg` | Capabilities · Transform | a large precise mechanical gear train, an exploded clockwork assembly of interlocking gears and shafts floating in perspective, one new gear being lowered into place in magenta. Landscape about 4:3. |
| `img/cap-build.jpg` | Capabilities · Build | an industrial robotic arm on a pedestal placing one box onto a conveyor line, with one person drawn as a simple blue-line figure standing at a small control desk overseeing it; the box being placed in magenta. Landscape about 4:3. |
| `img/cap-sustain.jpg` | Capabilities · Sustain | a single large tree drawn as a precise wireframe, its crown above and its deep spreading root system visible below a thin ground plane, like an engineering section; one young branch in magenta. Landscape about 4:3. |
| `img/proof-hours.jpg` | Proof (~20 hours) | a large elegant hourglass in a structural frame, drawn as a precise wireframe in three-quarter perspective, the sand stream and lower heap in magenta. Portrait-leaning composition (about 4:5). |
| `img/voice.jpg` | Client voice (dark) | an interview film set seen in three-quarter perspective: two armchairs angled toward each other, a cinema camera on a tripod and two softbox lights on stands; the camera's lens ring in magenta. Landscape about 3:2. |
| `img/ind-gems.jpg` | Industries · Gems & jewellery | a solitaire diamond ring standing upright, drawn as a jewellery CAD wireframe showing every facet and the prongs, very large in frame; the diamond in magenta. Landscape about 4:3. |
| `img/ind-bfsi.jpg` | Industries · BFSI | a massive circular bank vault door, half open, drawn in three-quarter perspective with its bolts, hinge and locking mechanism; the locking wheel in magenta. Landscape about 4:3. |
| `img/ind-retail.jpg` | Industries · Retail | a curving conveyor belt carrying a neat line of parcels of different sizes, in perspective; one parcel in magenta. Landscape about 4:3. |
| `img/ind-hospitality.jpg` | Industries · Hospitality | a single restaurant table setting seen close in three-quarter perspective: a dinner plate with a cloche, cutlery, two wine glasses; one wine glass in magenta. Landscape about 4:3. |
| `img/ind-realestate.jpg` | Industries · Real estate | a tower crane beside a building core under construction, low perspective looking up; the crane's hook load in magenta. Landscape about 4:3. |
| `img/ind-manufacturing.jpg` | Industries · Manufacturing | a large industrial hydraulic press machine in three-quarter perspective with its frame, cylinders and die; the die block in magenta. Landscape about 4:3. |
| `img/why-arch.jpg` | Why BOTS.AI | a classical masonry arch drawn as a precise structural wireframe, each voussoir stone outlined, standing on two piers, low frontal-three-quarter view; the keystone at the top in magenta. Landscape about 3:2. |
| `img/ins-book.jpg` | Insights · resources (dark) | an open hardcover book standing slightly open with pages fanning, drawn in perspective; one page in magenta. Landscape about 3:2. |
| `img/ins-scale.jpg` | Insights · pay back | a precise balance scale with two pans, beam tilted, in three-quarter perspective; the heavier pan in magenta. Landscape about 3:2. |
| `img/ins-key.jpg` | Insights · capability | a single large ornate key lying diagonally in perspective; the key's bit in magenta. Landscape about 3:2. |
