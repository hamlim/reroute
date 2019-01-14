export function canAccessDOM() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export function applyToAll(...fns) {
  return function(...args) {
    fns.forEach(fn => fn && fn(...args))
  }
}
