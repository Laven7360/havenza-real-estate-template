import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { atmosphereOptions, defaults, filterProperties, placeOptions, purposeOptions, resetDiscovery, typeOptions } from '../../data/propertyDiscovery'
import { properties } from '../../data/properties'

function Options({ name, label, options, value, onChange, allLabel = 'All', counts = true }) {
  const id = useId()
  return <fieldset className="discovery-options"><legend>{label}</legend>
    {[{ value: '', label: allLabel, count: properties.length }, ...options].map(option => <label key={option.value}>
      <input type="radio" name={`${name}-${id}`} value={option.value} checked={value === option.value} onChange={() => onChange(name, option.value)} />
      <span>{option.label}</span>{counts && <span className="option-count">{String(option.count).padStart(2, '0')}</span>}
    </label>)}
  </fieldset>
}

function MoreFields({ draft, change }) {
  return <>
    <Options name="beds" label="Minimum bedrooms" options={[1, 2, 3, 4].map(value => ({ value: String(value), label: `${value}+` }))} value={draft.beds} onChange={change} allLabel="Any" counts={false} />
    <fieldset className="discovery-price"><legend>Price range / MYR</legend><div>
      <label>Minimum<input type="number" inputMode="decimal" min="0" step="0.01" value={draft.min} placeholder="No minimum" onChange={event => change('min', event.target.value)} /></label>
      <label>Maximum<input type="number" inputMode="decimal" min={draft.min || '0'} step="0.01" value={draft.max} placeholder="No maximum" onChange={event => change('max', event.target.value)} /></label>
    </div><p>Purchase prices for Buy; monthly prices for Rent. Choose a purpose to compare like for like.</p></fieldset>
    <Options name="atmosphere" label="Way of living" options={atmosphereOptions} value={draft.atmosphere} onChange={change} />
    <label className="saved-filter"><input type="checkbox" checked={draft.saved === '1'} onChange={event => change('saved', event.target.checked ? '1' : '')} /> Only saved residences</label>
  </>
}

function MorePanel({ filters, onApply }) {
  const [draft, setDraft] = useState(filters)
  const change = (key, value) => setDraft(previous => ({ ...previous, [key]: value }))
  return <form onSubmit={event => { event.preventDefault(); onApply(draft) }}><MoreFields draft={draft} change={change} /><button className="discovery-apply" type="submit">Apply filters <span aria-hidden="true">→</span></button></form>
}

function MobileFilters({ filters, onApply, onClose, savedIds }) {
  const dialog = useRef(null)
  const [draft, setDraft] = useState(filters)
  const change = (key, value) => setDraft(previous => ({ ...previous, [key]: value }))
  const count = filterProperties(properties, draft, savedIds).length
  useEffect(() => {
    const element = dialog.current
    const trigger = document.activeElement
    const overflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    const query = window.matchMedia('(min-width: 901px)')
    const resized = () => { if (query.matches) onClose() }
    query.addEventListener('change', resized)
    return () => {
      query.removeEventListener('change', resized)
      element.close()
      document.body.style.overflow = overflow
      if (trigger?.isConnected) trigger.focus({ preventScroll: true })
    }
  }, [onClose])
  function trapFocus(event) {
    if (event.key !== 'Tab') return
    const elements = [...dialog.current.querySelectorAll('button, input, [href]')].filter(element => !element.disabled)
    const first = elements[0], last = elements.at(-1)
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
  }
  return <dialog ref={dialog} className="discovery-dialog" aria-labelledby="filter-dialog-heading" onCancel={event => { event.preventDefault(); onClose() }} onKeyDown={trapFocus}>
    <form onSubmit={event => { event.preventDefault(); onApply(draft); onClose() }}>
      <header><div><p className="eyebrow">Havenza / Your index</p><h2 id="filter-dialog-heading">Find your fit.</h2></div><button type="button" onClick={onClose} aria-label="Close filters">Close ×</button></header>
      <div className="discovery-dialog-fields">
        <Options name="purpose" label="Purpose" options={purposeOptions} value={draft.purpose} onChange={change} />
        <Options name="state" label="Place" options={placeOptions} value={draft.state} onChange={change} allLabel="All Malaysia" />
        <Options name="type" label="Property type" options={typeOptions} value={draft.type} onChange={change} />
        <MoreFields draft={draft} change={change} />
      </div>
      <footer><button type="button" onClick={() => setDraft(resetDiscovery(draft))}>Reset ×</button><button className="discovery-apply" type="submit">Show {count} {count === 1 ? 'residence' : 'residences'} →</button></footer>
    </form>
  </dialog>
}

export default function DiscoveryControls({ filters, onChange, savedIds }) {
  const [panel, setPanel] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const bar = useRef(null)
  const closeMobile = useCallback(() => setMobileOpen(false), [])
  useEffect(() => {
    if (!panel) return
    const closeOutside = event => { if (!bar.current.contains(event.target)) setPanel(null) }
    const escape = event => { if (event.key === 'Escape') { bar.current.querySelector(`[data-panel="${panel}"]`)?.focus(); setPanel(null) } }
    const query = window.matchMedia('(max-width: 900px)')
    const resized = () => { if (query.matches) setPanel(null) }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('focusin', closeOutside)
    document.addEventListener('keydown', escape)
    query.addEventListener('change', resized)
    return () => { document.removeEventListener('pointerdown', closeOutside); document.removeEventListener('focusin', closeOutside); document.removeEventListener('keydown', escape); query.removeEventListener('change', resized) }
  }, [panel])
  const controls = [
    { key: 'purpose', label: 'Purpose', options: purposeOptions, all: 'All' },
    { key: 'state', label: 'Place', options: placeOptions, all: 'All Malaysia' },
    { key: 'type', label: 'Type', options: typeOptions, all: 'All types' },
  ]
  const commit = next => { onChange(next); setPanel(null); bar.current?.querySelector(`[data-panel="${panel}"]`)?.focus() }
  const moreCount = ['beds', 'min', 'max', 'atmosphere', 'saved'].filter(key => filters[key] !== defaults[key]).length
  return <div className="discovery-controls">
    <div className="discovery-bar" ref={bar}>
      {controls.map(control => <div className="discovery-control" key={control.key}>
        <button type="button" data-panel={control.key} aria-expanded={panel === control.key} aria-controls={`filter-${control.key}`} onClick={() => setPanel(panel === control.key ? null : control.key)}><span className="eyebrow">{control.label}</span><span>{control.options.find(option => option.value === filters[control.key])?.label || control.all}<span aria-hidden="true">{panel === control.key ? '−' : '+'}</span></span></button>
        {panel === control.key && <div className="discovery-panel" id={`filter-${control.key}`}><Options name={control.key} label={control.label} options={control.options} value={filters[control.key]} allLabel={control.all} onChange={(key, value) => commit({ ...filters, [key]: value })} /><p className="panel-note">Counts across the full collection.</p></div>}
      </div>)}
      <div className="discovery-control"><button type="button" data-panel="more" aria-expanded={panel === 'more'} aria-controls="filter-more" onClick={() => setPanel(panel === 'more' ? null : 'more')}><span className="eyebrow">More filters {moreCount > 0 && ` / ${moreCount}`}</span><span>Refine your index <span aria-hidden="true">{panel === 'more' ? '−' : '+'}</span></span></button>
        {panel === 'more' && <div className="discovery-panel discovery-more" id="filter-more"><MorePanel filters={filters} onApply={commit} /></div>}
      </div>
    </div>
    <button className="mobile-filter-trigger" type="button" onClick={() => setMobileOpen(true)} aria-haspopup="dialog">Filters <span aria-hidden="true">+</span></button>
    {mobileOpen && <MobileFilters filters={filters} onApply={onChange} onClose={closeMobile} savedIds={savedIds} />}
  </div>
}
