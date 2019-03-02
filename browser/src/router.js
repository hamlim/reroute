import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useReducer,
  useCallback,
  memo,
} from 'react'
import { routerContext, defaultValue } from './context.js'
import { INIT_ACTION, historyReducer, NAVIGATE } from './history.js'
import { canAccessDOM } from './utils.js'

// <Router value={{ history: myOwnHistory }}>
//   <Router> // has myOwnHistory
//     {anything}
//   </Router>
// </Router>

function init(config) {
  return function() {
    return historyReducer(undefined, { type: INIT_ACTION, payload: config })
  }
}

export function useRouter(config) {
  let [history, dispatch] = useReducer(historyReducer, {}, init(config))
  const navigate = useCallback(
    function navigate(to) {
      dispatch({ type: NAVIGATE, payload: { location: to } })
    },
    [dispatch],
  )
  return [history, navigate, dispatch]
}

export const Router = memo(function Router(props) {
  let [history, navigate] = useRouter()
  let providedCtx = useContext(routerContext)

  if (providedCtx.isInitial) {
    providedCtx = { ...history, navigate }
  }

  useEffect(() => {
    if (canAccessDOM()) {
      if (typeof window.history !== 'undefined' && typeof window.history.pushState === 'function') {
        window.history.pushState(null, null, history.location)
      }
    }
  }, [history.location])

  return <routerContext.Provider value={providedCtx} {...props} />
})
