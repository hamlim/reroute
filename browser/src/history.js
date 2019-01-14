// { location: string, stack: Stack }

import { canAccessDOM } from './utils.js'

function getPathname(config) {
  if (config && config.pathname) {
    return config.pathname
  } else if (canAccessDOM()) {
    return window.location.pathname
  } else {
    return ''
  }
}

export function makeInitialHistory(config) {
  const pathname = getPathname()
  return {
    stack: [{ path: pathname }],
    location: pathname,
    ...config,
  }
}

export const INIT_ACTION = '@@INIT'
export const NAVIGATE = 'NAVIGATE'

export function historyReducer(state, { type, payload, meta }) {
  switch (type) {
    case INIT_ACTION: {
      return {
        ...makeInitialHistory(payload),
      }
    }
    case NAVIGATE: {
      return {
        ...state,
        location: payload.location,
        stack: [{ path: location }, ...state.stack],
      }
    }
    default:
      return state
  }
}
