// Mounts each demo into its slot on the static pages: <div class="demo" data-demo="<name>"></div>.
// A demo's code loads only when its slot comes near the viewport.
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'

const demos = import.meta.glob('./demos/*/index.tsx') as Record<string, () => Promise<{ default: React.ComponentType }>>

function load(slot: HTMLElement) {
  const loader = demos[`./demos/${slot.dataset.demo}/index.tsx`]
  if (!loader) { console.warn(`No demo named "${slot.dataset.demo}"`); return }
  loader().then(mod => {
    slot.classList.add('is-ready')
    createRoot(slot).render(createElement(mod.default))
  })
}

const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return
  io.unobserve(e.target)
  load(e.target as HTMLElement)
}), { rootMargin: '300px 0px' })

document.querySelectorAll<HTMLElement>('[data-demo]').forEach(slot => io.observe(slot))
