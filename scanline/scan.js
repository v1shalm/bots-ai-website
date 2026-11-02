// Line-screen renderer: turns a monochrome source image into horizontal scanlines.
// Each row is cut into runs; darker runs draw thicker. Rows reveal on entry, follow a
// scroll-driven build value when asked, and ripple sideways under the cursor.
//
// <canvas class="scan" data-src="src/hero.png" data-ink="#459ce7" data-pitch="6"
//         data-reveal="up|left|scroll" data-ramp="1|x">   ramp: 1 = bottom-to-top, x = left-to-right

const RAMP = [[7, 242, 144], [69, 156, 231], [221, 39, 251]]
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t))
const rampAt = t => t < 0.5 ? mix(RAMP[0], RAMP[1], t * 2) : mix(RAMP[1], RAMP[2], (t - 0.5) * 2)
const ease = t => 1 - Math.pow(1 - t, 3)
const still = matchMedia('(prefers-reduced-motion: reduce)').matches

class Scan {
  constructor(cv) {
    this.cv = cv
    this.ctx = cv.getContext('2d')
    this.pitch = +(cv.dataset.pitch || 6)
    this.ink = cv.dataset.ink ? hex(cv.dataset.ink) : null
    this.ramp = cv.dataset.ramp || ''
    this.mode = cv.dataset.reveal || 'up'
    this.fit = cv.dataset.fit || 'contain'
    this.align = cv.dataset.align || 'bottom'
    this.build = this.mode === 'scroll' ? 0 : 1
    this.t0 = 0
    this.mx = -1e4; this.my = -1e4; this.amp = 0; this.ampT = 0
    this.visible = false
    this.rows = []
    const img = new Image()
    img.onload = () => { this.img = img; this.layout(); this.observe() }
    img.src = cv.dataset.src
    new ResizeObserver(() => this.img && this.layout()).observe(cv)
    if (still) return
    const host = cv.closest('[data-scan-host]') || cv
    host.addEventListener('pointermove', e => {
      const r = cv.getBoundingClientRect()
      this.mx = e.clientX - r.left; this.my = e.clientY - r.top; this.ampT = 1; this.kick()
    })
    host.addEventListener('pointerleave', () => { this.ampT = 0; this.kick() })
  }

  layout() {
    const dpr = Math.min(1.75, devicePixelRatio || 1)
    const W = this.cv.clientWidth, H = this.cv.clientHeight
    if (!W || !H) return
    this.W = W; this.H = H; this.dpr = dpr
    this.cv.width = Math.round(W * dpr); this.cv.height = Math.round(H * dpr)
    // place the image inside the canvas box
    const ir = this.img.width / this.img.height, br = W / H
    let w, h
    if (this.fit === 'cover' ? ir < br : ir > br) { w = W; h = W / ir } else { h = H; w = H * ir }
    const x0 = (W - w) / 2
    const y0 = this.align === 'bottom' ? H - h : this.align === 'top' ? 0 : (H - h) / 2
    // sample luminance at one value per (row, 3px chunk)
    const P = this.pitch, CW = 3
    const sc = document.createElement('canvas')
    sc.width = Math.ceil(W / CW); sc.height = Math.ceil(H / P)
    const g = sc.getContext('2d', { willReadFrequently: true })
    g.fillStyle = '#fff'; g.fillRect(0, 0, sc.width, sc.height)
    g.imageSmoothingQuality = 'high'
    g.drawImage(this.img, x0 / CW, y0 / P, w / CW, h / P)
    const data = g.getImageData(0, 0, sc.width, sc.height).data
    const rows = []
    for (let r = 0; r < sc.height; r++) {
      const segs = []
      let run = null
      for (let c = 0; c < sc.width; c++) {
        const i = (r * sc.width + c) * 4
        const d = 1 - (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255
        const q = d < 0.1 ? 0 : d < 0.3 ? 1 : d < 0.55 ? 2 : d < 0.8 ? 3 : 4
        if (run && run.q === q) run.w += CW
        else { if (run && run.q) segs.push(run); run = { x: c * CW, w: CW, q } }
      }
      if (run && run.q) segs.push(run)
      if (segs.length) rows.push({ y: r * P + P / 2, segs, minX: segs[0].x, maxX: segs[segs.length - 1].x + segs[segs.length - 1].w })
    }
    this.rows = rows
    this.top = rows.length ? rows[0].y : 0
    this.bottom = rows.length ? rows[rows.length - 1].y : H
    this.draw(performance.now())
  }

  observe() {
    new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting
      if (this.visible && !this.t0) this.t0 = performance.now()
      this.kick()
    }, { rootMargin: '0px 0px -8% 0px' }).observe(this.cv)
  }

  kick() { if (!this.raf && this.visible) this.raf = requestAnimationFrame(t => this.loop(t)) }

  loop(t) {
    this.raf = 0
    this.amp += (this.ampT - this.amp) * 0.08
    const busy = this.draw(t)
    if (this.visible && (busy || Math.abs(this.ampT - this.amp) > 0.002 || this.amp > 0.01)) this.kick()
  }

  setBuild(v) { this.build = v; this.kick(); if (!this.raf) this.draw(performance.now()) }

  draw(t) {
    const { ctx, dpr, W, H, rows, pitch } = this
    if (!W) return false
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)
    const intro = still || !this.t0 ? (this.t0 ? 1 : 0) : (t - this.t0) / 1800
    let busy = intro < 1.6
    const span = Math.max(1, this.bottom - this.top)
    const level = this.mode === 'scroll' ? this.bottom - this.build * span : -1
    const time = t / 1000
    for (let k = 0; k < rows.length; k++) {
      const row = rows[k]
      const fromBottom = (this.bottom - row.y) / span
      // reveal: rows sweep in from the left, staggered from the ground up
      let p = 1
      if (this.mode === 'up' || this.mode === 'scroll') p = ease(Math.min(1, Math.max(0, intro * 1.25 - fromBottom * 0.55)))
      if (this.mode === 'left') p = ease(Math.min(1, Math.max(0, intro * 1.3 - (k % 7) * 0.03)))
      if (p <= 0) continue
      const built = this.mode !== 'scroll' || row.y >= level
      const reach = row.minX + (row.maxX - row.minX) * p
      // cursor ripple: rows near the pointer slide sideways in a damped wave
      const dy = (row.y - this.my) / 70
      const dx = this.amp * 14 * Math.exp(-dy * dy) * Math.sin(time * 3 + row.y * 0.08)
      const c = this.ramp === '1' ? rampAt(fromBottom) : this.ink
      if (c) ctx.fillStyle = built ? `rgb(${c})` : `rgba(${c},0.13)`
      for (const s of row.segs) {
        if (s.x >= reach) break
        const w = Math.min(s.w, reach - s.x)
        if (!c) ctx.fillStyle = `rgb(${rampAt(Math.min(1, s.x / W))})`
        const h = pitch * (0.12 + s.q * 0.16)
        ctx.fillRect(s.x + dx, row.y - h / 2, w, h)
      }
    }
    if (this.mode === 'scroll' && this.build > 0 && this.build < 1) {
      ctx.fillStyle = 'rgba(221,39,251,0.9)'
      ctx.fillRect(0, level - 0.5, W, 1)
    }
    return busy
  }
}

window.Scans = [...document.querySelectorAll('canvas.scan')].map(cv => (cv._scan = new Scan(cv)))
