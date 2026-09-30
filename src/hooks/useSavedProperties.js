import { useSyncExternalStore } from 'react'
import { properties } from '../data/properties'

export const SAVED_KEY = 'havenza.saved.v1'
const empty = []
let snapshot = empty
let loaded = false
const listeners = new Set()
export function parseSaved(raw) {
  try {
    const values = JSON.parse(raw)
    return Array.isArray(values) ? [...new Set(values.filter(id => properties.some(property => property.id === id)))] : []
  } catch { return [] }
}
function readStorage() {
  try { return parseSaved(window.localStorage.getItem(SAVED_KEY)) } catch { return [] }
}
function emit(next) { snapshot = next; listeners.forEach(listener => listener()) }
function storageChanged(event) { if (event.key === SAVED_KEY || event.key === null) emit(readStorage()) }
function subscribe(listener) {
  listeners.add(listener)
  if (listeners.size === 1) window.addEventListener('storage', storageChanged)
  if (!loaded) { loaded = true; emit(readStorage()) }
  return () => { listeners.delete(listener); if (!listeners.size) window.removeEventListener('storage', storageChanged) }
}
export function toggleSaved(id) {
  if (!properties.some(property => property.id === id)) return
  if (!loaded) { loaded = true; snapshot = readStorage() }
  const next = snapshot.includes(id) ? snapshot.filter(value => value !== id) : [...snapshot, id]
  try { window.localStorage.setItem(SAVED_KEY, JSON.stringify(next)) } catch { /* Saving still works for this visit when storage is unavailable. */ }
  emit(next)
}
export default function useSavedProperties() {
  const savedIds = useSyncExternalStore(subscribe, () => snapshot, () => empty)
  return { savedIds, toggleSaved }
}
