# BOTS.AI: Scanline

Marketing site in a line-screen art direction. Every illustration is drawn live in code as
horizontal scanlines, thicker where the source image is darker, in the logo's green, blue and pink.
Plain HTML, CSS and JavaScript. No build step, no dependencies.

## Run

The line renderer reads pixels from the source images, so the site must be served over HTTP.
Opening a page straight from disk leaves the art blank, because browsers block pixel reads on `file://`.

```
python3 -m http.server 8000
# or: npx serve .
```

Then open `http://localhost:8000`.

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `ai-transformation.html` | The four capabilities, the six-week diagnostic, the 6A framework |
| `industries.html` | Six industries, each linked to its client work |
| `case-studies.html` | Agent programme, BFSI onboarding, Nykaa, Jewelex, client diagnostic |
| `insights.html` | Free resources and perspectives |
| `about.html` | BOTS.AI and HR Anexi |
| `contact.html` | Contact form (opens the visitor's email app; no backend) |
| `legal.html` | Privacy, cookies and legal notices |

Every page repeats the same nav, mega menu, mobile menu and footer markup. When you change one, change it on all eight pages.

Each page loads `style.css`, `app.js`, `scan.js` and `lenis.min.js` with a `?v=` tag. After you edit one of those files, change its tag on all eight pages, or visitors' browsers keep using their old copy.
Copy drafted for the inner pages is listed in `COPY-REVIEW.md` for BOTS.AI to approve.

## Files

| File | What it holds |
|---|---|
| `style.css` | Type and spacing tokens, layout, components, breakpoints (every page) |
| `pages.css` | The inner-page system: hero, logo row, stat band, sticky track, bento, story cards, mosaic, editorial list, dark band, gradient card. Loaded by every page except home |
| `assets/demos/` | Built product demos (do not edit; built from `../demos`) |
| `scan.js` | The line-screen renderer: turns each `canvas.scan` into scanlines from its `data-src` image |
| `app.js` | Mega menu, mobile menu, smooth scroll, reveals, count-ups, phase line, the pinned 6A build, FAQ, contact form |
| `lenis.min.js` | Smooth-scroll library (Lenis), vendored |
| `fonts/` | Geist Serif (display) and Geist (text), Latin subset, SIL Open Font License in `OFL.txt` |
| `src/` | Grayscale source images the renderer draws from (never shown directly) |
| `logo.svg` | Official BOTS.AI logo |

## Product demos

The animated process demos and the industry stills are React components built with the Stageshow kit in `../demos`. Pages hold an empty slot, `<div class="demo" data-demo="build-agent"></div>`, and `assets/demos/main.js` loads each demo when its slot nears the viewport.

```
cd ../demos
npm install
npm run dev     # preview one demo: http://127.0.0.1:5173/preview.html?demo=build-agent&w=600
npm run build   # writes ../scanline/assets/demos
```

After a build, bump the `?v=` on `assets/demos/main.js` in the pages that load it.

## Type scale

Every font size in `style.css` is one of these tokens. Add a role to the scale before you add a size.

| Token | Size | Used for |
|---|---|---|
| `--t-display` | 44 to 88px, Geist Serif | Each page's h1, the footer line |
| `--t-h2` | 32 to 52px, Geist Serif | Each section heading |
| `--t-h3` | 24 to 30px, Geist Serif | Sub-sections, posts, menu sheet |
| `--t-h4` | 20px, Geist Medium | Card and item titles, FAQ questions |
| `--t-lede` | 17 to 19px | Intro paragraphs, legal text |
| `--t-body` | 16px | Body copy |
| `--t-ui` | 15px | Nav, buttons, links, form labels |
| `--t-small` | 14px | Labels, captions, notes |
| `--t-fig-xl` / `-l` / `-m` | 88 to 136 / 44 to 64 / 32px, Geist | Figures; the rupee sign needs Geist, which carries it |

## The renderer (`scan.js`)

Each illustration is a `<canvas class="scan">` configured with data attributes:

| Attribute | Meaning |
|---|---|
| `data-src` | Source image (grayscale, subject on pure white) |
| `data-ink` | One flat colour, e.g. `#459ce7` |
| `data-ramp` | `1` = green to blue to pink, bottom to top; `x` = left to right (replaces `data-ink`) |
| `data-pitch` | Line spacing in px (4 = finer detail, 6 = bolder) |
| `data-reveal` | `up` rows print from the ground up; `left` rows sweep in; `scroll` built by scroll (6A) |
| `data-fit` / `data-align` | `contain`/`cover`, and `bottom`/`center`/`top` placement |

Rows ripple sideways under the cursor inside the element marked `data-scan-host`.
With reduced motion turned on, the art draws once and the ripple is off.
