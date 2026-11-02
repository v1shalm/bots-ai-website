# BOTS.AI website

Two design directions for the BOTS.AI by HR Anexi marketing site. Both are plain HTML, CSS and JavaScript with no build step.

| Folder | Direction |
|---|---|
| `scanline/` | Line-screen art drawn live in code. A full site: home, AI transformation, industries, case studies, insights, about, contact and legal pages, with a mega menu and a shared footer |
| `structure/` | Blueprint art direction. A single landing page built around structural wireframe drawings |
| `demos/` | Source for the animated product demos on the Scanline inner pages (React and Vite). The built files live in `scanline/assets/demos`, so you only need this folder to change a demo |

## Run

Serve the repo root over HTTP. The Scanline renderer reads pixels from its source images, and browsers block that on `file://`.

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/scanline/` or `http://localhost:8000/structure/`.

Each folder has its own README with its files, type scale and motion notes. `scanline/COPY-REVIEW.md` lists the copy and sample data that BOTS.AI still has to approve before launch.

## Fonts and libraries

- Geist Serif and Geist, SIL Open Font License (`fonts/OFL.txt` in each site)
- Lenis smooth scroll, vendored as `lenis.min.js`
- The demos use the Stageshow kit, React and lucide-react
