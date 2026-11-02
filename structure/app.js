const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

/* Smooth scroll */
const lenis = !reduce && window.Lenis ? new Lenis({ lerp: 0.09, smoothWheel: true }) : null
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const t = $(a.getAttribute('href'))
  if (!t) return
  e.preventDefault()
  lenis ? lenis.scrollTo(t, { offset: 0, duration: 1.6 }) : t.scrollIntoView({ behavior: 'smooth' })
}))

/* Intro: drafting lines sweep the screen before the blueprint is drawn */
;(function intro() {
  const svg = $('#introSvg'), w = innerWidth, h = innerHeight
  if (reduce) { $('#intro').classList.add('done'); return }
  let html = ''
  for (let i = 1; i < 8; i++) html += `<line x1="${(w / 8) * i}" y1="0" x2="${(w / 8) * i}" y2="${h}" style="animation-delay:${i * 60}ms"/>`
  for (let i = 1; i < 5; i++) html += `<line x1="0" y1="${(h / 5) * i}" x2="${w}" y2="${(h / 5) * i}" style="animation-delay:${200 + i * 60}ms"/>`
  html += `<line class="p" x1="0" y1="${h * 0.62}" x2="${w}" y2="${h * 0.38}" style="animation-delay:520ms"/>`
  svg.innerHTML = html
  requestAnimationFrame(() => $('#intro').classList.add('done'))
  setTimeout(() => $('#heroImg').classList.add('in'), 900)
})()

/* Headlines: word by word */
$$('.split').forEach(h => {
  const base = +(h.dataset.d || 0)
  const html = h.innerHTML
  h.setAttribute('aria-label', h.textContent.replace(' | ', ' ').trim())
  // keep inline <em> runs intact
  const parts = html.split(/(<em>.*?<\/em>)/g)
  let k = 0
  h.innerHTML = parts.map(p => {
    if (p.startsWith('<em>')) return `<em>${p.slice(4, -5).split(' ').map(w => `<span class="w" aria-hidden="true"><i style="--d:${base + 80 + k++ * 55}ms">${w}</i></span>`).join(' ')}</em>`
    return p.trim().split(/\s+/).filter(Boolean).map(w => w === '|' ? '<br>' : `<span class="w" aria-hidden="true"><i style="--d:${base + 80 + k++ * 55}ms">${w}</i></span>`).join(' ')
  }).join(' ')
})

/* Count-ups */
function count(el) {
  const to = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', t0 = performance.now()
  const step = t => {
    const p = clamp((t - t0) / 1800), v = Math.round(to * (1 - Math.pow(1 - p, 4)))
    el.textContent = pre + v.toLocaleString('en-IN') + suf
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

/* Reveal on entry */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return
  const el = e.target
  const delay = el.closest('.hero') ? 2300 : 0
  setTimeout(() => {
    el.classList.add('in')
    if (el.dataset.count) count(el)
    $$('[data-count]', el).forEach(count)
  }, delay && el.classList.contains('hero__stats') ? delay : 0)
  io.unobserve(el)
}), { rootMargin: '0px 0px -12% 0px' })
$$('.rv, .split, .feature__main .big, .diag [data-count]').forEach(el => io.observe(el))

/* Hero: a lamp follows the cursor across the blueprint */
const hero = $('.hero'), heroArt = $('#heroArt')
let lx = 0.7, ly = 0.45, tlx = 0.7, tly = 0.45
hero.addEventListener('pointermove', e => { tlx = e.clientX / innerWidth; tly = e.clientY / innerHeight })

/* Scroll-linked scenes */
const nav = $('#nav'), bar = $('#progress')
const plan = $('#plan'), planImg = $('#planImg'), scan = $('#scan'), tags = $$('.plan__tag')
const capList = $$('.cap'), capImgs = $$('#capFrame img'), capName = $('#capName'), capN = $('#capN'), phases = $$('#phases li'), phaseFill = $('#phaseFill'), capsSec = $('#capabilities')
const CAPS = ['Four capabilities · one connection', 'Train · AI Learning & Development', 'Transform · AI Consulting & Transformation', 'Build · Custom AI Agents', 'Sustain · School for AI Trainers']
const rise = $('#framework'), riseArt = $('#riseArt'), riseItems = $$('#riseList li'), riseN = $('#riseN'), riseT = $('#riseT'), riseB = $('#riseB')
const SIX = [['Audit', 'Find the value in your workflows.'], ['Acumen', 'Build the fluency to use AI well.'], ['Assistants', 'Put copilots into everyday work.'], ['Autonomous Agents', 'Let agents execute, with human judgement.'], ['Assurance', 'Govern data, models and human checkpoints.'], ['Adoption', 'Make AI part of everyday operations.']]
const featImg = $('#featImg img'), whyImg = $('#whyArt img'), bridgeImg = $('#bridge img'), valueImg = $('#value2 img')
const darks = $$('[data-dark]')
let lastY = 0, lastStage = -1, lastCap = -1

const prog = el => { const r = el.getBoundingClientRect(); return clamp((innerHeight - r.top) / (innerHeight + r.height)) }

function frame() {
  const y = scrollY, vh = innerHeight, H = document.documentElement.scrollHeight - vh

  bar.style.transform = `scaleX(${clamp(y / H)})`

  const overDark = darks.some(z => { const r = z.getBoundingClientRect(); return r.top <= 36 && r.bottom >= 36 && getComputedStyle(z).zIndex !== '0' || (z.classList.contains('hero') && y < vh * 0.9) })
  nav.classList.toggle('dark', overDark)
  nav.classList.toggle('solid', y > 40)
  if (y > lastY + 6 && y > vh) nav.classList.add('hide')
  else if (y < lastY - 6) nav.classList.remove('hide')
  lastY = y

  if (!reduce) {
    lx += (tlx - lx) * 0.08; ly += (tly - ly) * 0.08
    heroArt.style.setProperty('--mx', `${lx * 100}%`); heroArt.style.setProperty('--my', `${ly * 100}%`)
    heroArt.style.transform = `translate3d(${(lx - 0.5) * -18}px, ${y * 0.25}px, 0) scale(${1.04 + y / 5000})`

    if (plan) {
    const pp = prog(plan)
    planImg.style.setProperty('--x', `${-(planImg.offsetWidth - plan.offsetWidth) * pp}px`)
    const s = clamp((pp - 0.15) / 0.6)
    scan.style.setProperty('--s', `${4 + s * 92}%`)
    tags.forEach(t => t.classList.toggle('on', s >= +t.dataset.at))
    }

    // ranked columns draw in left to right, then drift
    const vp = prog(valueImg.parentElement)
    valueImg.style.setProperty('--c', `${(1 - clamp((vp - 0.12) / 0.4)) * 100}%`)
    valueImg.style.setProperty('--x', `${(0.5 - vp) * 60}px`)
    featImg && featImg.style.setProperty('--p', `${(prog(featImg.parentElement) - 0.5) * -60}px`)
    if (whyImg) { const wp = prog(whyImg.parentElement); whyImg.style.setProperty('--y', `${(0.5 - wp) * 70}px`); whyImg.style.setProperty('--z', `${0.96 + wp * 0.1}`) }
    const bp = clamp((vh - bridgeImg.getBoundingClientRect().top) / (vh * 0.8))
    bridgeImg.style.setProperty('--c', `${(1 - bp) * 100}%`)
  }

  // capabilities: the card nearest the middle drives the frame and the phase rule
  const cr = capsSec.getBoundingClientRect()
  let active = 0
  const first = capList[0].getBoundingClientRect()
  if (first.top < vh * 0.6) {
    let bd = 1e9
    capList.forEach((c, i) => { const r = c.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - vh * 0.5); if (d < bd) { bd = d; active = i + 1 } })
  }
  if (active !== lastCap) {
    lastCap = active
    capList.forEach((c, i) => c.classList.toggle('on', i + 1 === active))
    capImgs.forEach((im, i) => im.classList.toggle('on', i === Math.max(0, active - 1)))
    if (capName) { capName.textContent = CAPS[active]; capN.textContent = `0${active} / 04` }
  }
  const cp = clamp((vh * 0.5 - cr.top) / cr.height)
  phaseFill.style.setProperty('--f', cp.toFixed(3))
  phases.forEach((p, i) => p.classList.toggle('on', cp > i / 5))

  // 6A: the building rises with scroll
  const rr = rise.getBoundingClientRect()
  const rp = clamp(-rr.top / (rr.height - vh))
  riseArt.style.setProperty('--top', `${92 - rp * 88}%`)
  const stage = Math.min(5, Math.floor(rp * 6))
  if (stage !== lastStage) {
    lastStage = stage
    riseItems.forEach((li, i) => { li.classList.toggle('done', i < stage); li.classList.toggle('now', i === stage) })
    riseN.textContent = '0' + (stage + 1); riseT.textContent = SIX[stage][0]; riseB.textContent = SIX[stage][1]
  }
}

function raf(t) { lenis && lenis.raf(t); frame(); requestAnimationFrame(raf) }
requestAnimationFrame(raf)

/* FAQ */
$$('.faq__item').forEach(item => $('.faq__q', item).addEventListener('click', () => {
  const open = item.classList.contains('open')
  $$('.faq__item').forEach(i => i.classList.remove('open'))
  if (!open) item.classList.add('open')
}))

/* Industries: the hovered row brings its drawing forward */
const indRows = $$('.ind__row'), indImgs = $$('#indVis img')
const setInd = k => { indRows.forEach((r, i) => r.classList.toggle('on', i === k)); indImgs.forEach((im, i) => im.classList.toggle('on', i === k)) }
indRows.forEach((r, i) => { r.addEventListener('pointerenter', () => setInd(i)); r.addEventListener('focus', () => setInd(i)) })
setInd(0)
