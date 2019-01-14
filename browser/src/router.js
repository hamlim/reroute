import React, {
  useContext,
  useState,
  useRef,
  useEffect,
  useReducer,
  useCallback,
  memo,
} from '@matthamlin/danger-react-suspense/dev/react.js'
import { routerContext, defaultValue } from './context.js'
import { INIT_ACTION, historyReducer, NAVIGATE } from './history.js'
import { canAccessDOM } from './utils.js'

// <Router value={{ history: myOwnHistory }}>
//   <Router> // has myOwnHistory
//     {anything}
//   </Router>
// </Router>

export function useRouter(config) {
  let [history, dispatch] = useReducer(historyReducer, {}, { type: INIT_ACTION, payload: config })
  function navigate(to) {
    dispatch({ type: NAVIGATE, payload: { location: to } })
  }
  return [history, navigate, dispatch]
}

function performSideEffects(location) {
  if (canAccessDOM()) {
    if (typeof window.history !== 'undefined' && typeof window.history.pushState === 'function') {
      window.history.pushState(null, null, location)
    }
  }
}

export const Router = memo(function Router(props) {
  let [history, navigate] = useRouter()
  let providedCtx = useContext(routerContext)

  if (providedCtx.isInitial) {
    providedCtx = { ...history, navigate }
  }

  const locationRef = useRef(providedCtx.location)

  if (locationRef.current !== history.location) {
    performSideEffects(history.location)
  }

  if (locationRef) return <routerContext.Provider value={providedCtx} {...props} />
})
