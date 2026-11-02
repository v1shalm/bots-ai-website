// Dev-only preview: /preview.html?demo=<name>&w=<slot width in px>
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'

const demos = import.meta.glob('./demos/*/index.tsx') as Record<string, () => Promise<{ default: React.ComponentType }>>
const params = new URLSearchParams(location.search)
const name = params.get('demo') ?? ''
const slot = document.getElementById('example')!
slot.style.setProperty('--w', `${params.get('w') ?? 720}px`)

const loader = demos[`./demos/${name}/index.tsx`]
if (!loader) slot.textContent = `No demo named "${name}". Available: ${Object.keys(demos).map(k => k.split('/')[2]).join(', ')}`
else loader().then(mod => createRoot(slot).render(createElement(mod.default)))
