const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const hoverable = matchMedia('(hover: hover) and (pointer: fine)')

const lenis = !reduce && window.Lenis ? new Lenis({ lerp: 0.09 }) : null
const nav = $('#nav'), bar = $('#progress')

// Links into this same page glide to their section; links to other pages navigate normally.
$$('a[href*="#"]').forEach(a => a.addEventListener('click', e => {
  const u = new URL(a.href)
  if (u.pathname !== location.pathname || !u.hash) return
  const t = document.getElementById(decodeURIComponent(u.hash.slice(1)))
  if (!t) return
  e.preventDefault()
  closeMega(); setMenu(false)
  history.pushState(null, '', u.hash)
  lenis ? lenis.scrollTo(t, { offset: -(nav.offsetHeight + 24), duration: 1.4 }) : t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
}))

// ── Mega menu: disclosure buttons; hover opens on fine pointers, click and keyboard everywhere ──
let openTrig = null, hoverTimer = 0, openedAt = 0
const panelOf = t => document.getElementById(t.getAttribute('aria-controls'))
function openMega(t) {
  if (openTrig === t) return
  const swap = !!openTrig
  if (openTrig) { openTrig.setAttribute('aria-expanded', 'false'); panelOf(openTrig).classList.remove('open', 'instant') }
  const p = panelOf(t)
  p.classList.toggle('instant', swap)
  t.setAttribute('aria-expanded', 'true'); p.classList.add('open')
  nav.classList.add('mega-open'); nav.classList.remove('hide')
  openTrig = t; openedAt = performance.now()
}
function closeMega(focus) {
  if (!openTrig) return
  const t = openTrig
  t.setAttribute('aria-expanded', 'false'); panelOf(t).classList.remove('open', 'instant')
  nav.classList.remove('mega-open'); openTrig = null
  if (focus) t.focus()
}
$$('.nav__trigger').forEach(t => {
  const li = t.closest('li')
  // a click that lands just after hover opened the panel confirms it rather than closing it
  t.addEventListener('click', () => (openTrig !== t ? openMega(t) : performance.now() - openedAt > 450 && closeMega()))
  li.addEventListener('pointerenter', e => { if (e.pointerType !== 'mouse' || !hoverable.matches) return; clearTimeout(hoverTimer); hoverTimer = setTimeout(() => openMega(t), openTrig ? 0 : 90) })
  li.addEventListener('pointerleave', e => { if (e.pointerType !== 'mouse' || !hoverable.matches) return; clearTimeout(hoverTimer); hoverTimer = setTimeout(() => openTrig === t && closeMega(), 220) })
  li.addEventListener('focusout', e => { if (openTrig === t && !li.contains(e.relatedTarget)) closeMega() })
})
document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (openTrig) closeMega(true); else if (menuOpen) setMenu(false, true) } })
document.addEventListener('pointerdown', e => { if (openTrig && !nav.contains(e.target)) closeMega() })

// ── Mobile menu sheet ──
const menuBtn = $('#menuBtn'), menu = $('#menu')
let menuOpen = false
function setMenu(open, focusBack) {
  if (!menu || open === menuOpen) return
  menuOpen = open
  menu.classList.toggle('open', open)
  menuBtn.setAttribute('aria-expanded', String(open))
  menuBtn.querySelector('.sr').textContent = open ? 'Close menu' : 'Menu'
  ;['main', 'footer'].forEach(s => { const el = $(s); if (el) el.inert = open })
  document.documentElement.style.overflow = open ? 'hidden' : ''
  if (lenis) open ? lenis.stop() : lenis.start()
  nav.classList.remove('hide')
  if (open) $('summary, a', menu).focus()
  else if (focusBack) menuBtn.focus()
}
menuBtn && menuBtn.addEventListener('click', () => setMenu(!menuOpen))
menu && $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)))
matchMedia('(min-width: 961px)').addEventListener('change', e => e.matches && setMenu(false))

// ── Headlines rise word by word; <strong> runs keep their emphasis ──
$$('.split').forEach(h => {
  const base = +(h.dataset.d || 0)
  h.setAttribute('aria-label', h.textContent.trim())
  let k = 0
  const wrap = txt => txt.trim().split(/\s+/).filter(Boolean).map(w => `<span class="w" aria-hidden="true"><i style="--d:${base + 60 + k++ * 55}ms">${w}</i></span>`).join(' ')
  h.innerHTML = h.innerHTML.split(/(<strong>.*?<\/strong>)/g).map(p => p.startsWith('<strong>') ? `<strong>${wrap(p.slice(8, -9))}</strong>` : wrap(p)).join(' ')
})

// ── Figures count up from data-from (or 0); the HTML already holds the final value ──
function count(el) {
  if (reduce) return
  const to = +el.dataset.count, from = +(el.dataset.from || 0), pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', t0 = performance.now()
  const step = t => {
    const p = clamp((t - t0) / 1700)
    el.textContent = pre + Math.round(from + (to - from) * (1 - Math.pow(1 - p, 4))).toLocaleString('en-IN') + suf
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return
  e.target.classList.add('in')
  $$('[data-count]', e.target).forEach(count)
  io.unobserve(e.target)
}), { rootMargin: '0px 0px -10% 0px' })
$$('.rv, .split').forEach(el => io.observe(el))

// ── Scroll-linked chrome and scenes ──
const phases = $('#phases'), phaseItems = $$('#phases li'), fill = $('.phases__fill')
const rise = $('#framework.rise'), riseScan = $('#riseScan'), riseList = $$('#riseList li')
let lastY = scrollY, lastStage = -1

function frame(t) {
  lenis && lenis.raf(t)
  const y = scrollY, vh = innerHeight
  bar.style.transform = `scaleX(${clamp(y / Math.max(1, document.documentElement.scrollHeight - vh))})`
  nav.classList.toggle('solid', y > 30)
  if (!openTrig && !menuOpen) {
    if (y > lastY + 6 && y > vh * 0.8) nav.classList.add('hide')
    else if (y < lastY - 6) nav.classList.remove('hide')
  } else if (openTrig && Math.abs(y - lastY) > 2 && !panelOf(openTrig).contains(document.activeElement)) closeMega()
  lastY = y

  if (phases) {
    const host = phases.closest('section').getBoundingClientRect()
    const cp = clamp((vh * 0.85 - host.top) / (host.height * 0.8))
    fill.style.setProperty('--f', cp.toFixed(3))
    phaseItems.forEach((p, i) => p.classList.toggle('on', cp > i / 5))
  }

  // 6A: the office is printed in from the floor up as the pinned section scrolls
  if (rise) {
    const rr = rise.getBoundingClientRect()
    const rp = clamp(-rr.top / (rr.height - vh))
    riseScan && riseScan._scan && riseScan._scan.setBuild(0.04 + rp * 0.96)
    const stage = Math.min(5, Math.floor(rp * 6))
    if (stage !== lastStage) {
      lastStage = stage
      riseList.forEach((li, i) => { li.classList.toggle('done', i < stage); li.classList.toggle('now', i === stage) })
    }
  }
  requestAnimationFrame(frame)
}
requestAnimationFrame(frame)

// ── FAQ: one open at a time; collapsed answers leave the tab order and the accessibility tree ──
const faqItems = $$('.faq__item')
const setFaq = (item, open) => {
  item.classList.toggle('open', open)
  $('.faq__q', item).setAttribute('aria-expanded', String(open))
  $('.faq__a', item).inert = !open
}
faqItems.forEach(item => {
  setFaq(item, item.classList.contains('open'))
  $('.faq__q', item).addEventListener('click', () => {
    const open = !item.classList.contains('open')
    faqItems.forEach(i => setFaq(i, false))
    setFaq(item, open)
  })
})

// ── Contact: validate on submit, then hand the message to the visitor's email app ──
const form = $('#contactForm')
if (form) {
  const pick = new URLSearchParams(location.search).get('interest')
  const radio = pick && form.querySelector(`input[name="interest"][value="${CSS.escape(pick)}"]`)
  if (radio) radio.checked = true
  const status = $('#formStatus'), to = form.dataset.email
  const rules = {
    name: v => v ? '' : 'Enter your name.',
    company: v => v ? '' : 'Enter your company name.',
    email: v => !v ? 'Enter your work email.' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter an email address like name@company.com.',
    message: v => v ? '' : 'Tell us which work takes the most hours.',
  }
  const check = el => {
    const msg = rules[el.name](el.value.trim())
    el.setAttribute('aria-invalid', String(!!msg))
    $('#e-' + (el.name === 'message' ? 'msg' : el.name)).textContent = msg
    return !msg
  }
  Object.keys(rules).forEach(n => form.elements[n].addEventListener('input', e => e.target.getAttribute('aria-invalid') === 'true' && check(e.target)))
  form.addEventListener('submit', e => {
    e.preventDefault()
    const bad = Object.keys(rules).map(n => form.elements[n]).filter(el => !check(el))
    if (bad.length) { status.textContent = ''; bad[0].focus(); return }
    const f = form.elements, interest = form.querySelector('input[name="interest"]:checked')
    const topic = interest ? interest.nextElementSibling.textContent : 'Not sure yet'
    const subject = `${topic} · ${f.company.value.trim()}`
    const phone = f.phone.value.trim()
    const lines = [`Name: ${f.name.value.trim()}`, `Company: ${f.company.value.trim()}`, `Email: ${f.email.value.trim()}`]
    if (phone) lines.push(`Phone: ${phone}`)
    lines.push(`Topic: ${topic}`, '', f.message.value.trim())
    const body = lines.join('\n')
    location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    status.innerHTML = `Your email app should now be open with this message. If it didn’t open, write to <a href="mailto:${to}">${to}</a> and paste your message there.`
  })
}

// ── Sticky track: the side list marks the group on screen ──
const trackLinks = $$('.track__nav a')
if (trackLinks.length) {
  const mark = id => trackLinks.forEach(a => a.classList.toggle('is-on', a.getAttribute('href') === '#' + id))
  const tio = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && mark(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
  $$('.track__group').forEach(g => tio.observe(g))
  mark(trackLinks[0].getAttribute('href').slice(1))
}
