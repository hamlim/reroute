import React, {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  useRef,
  useCallback,
} from 'react'

import { createBrowserHistory } from 'history'

let historyContext = createContext({
  history: null,
  location: null,
})

// exports

export function Router({ children }) {
  let { current: history } = useLazyRef(createBrowserHistory)
  let [location, setLocation] = useState(history.location)

  let { current: listener } = useClientSideRef(() => {
    return history.listen(location => {
      setLocation(location)
    })
  })

  useClientSideLayoutEffect(() => {
    return () => {
      if (typeof listener === 'function') {
        listener()
      }
    }
  }, [])

  return <historyContext.Provider value={{ history, location }}>{children}</historyContext.Provider>
}

export function useHistory() {
  return useContext(historyContext)
}

export function useLink(path, state) {
  let { history } = useHistory()
  let linkClick = useCallback(
    function linkClick(event) {
      if (event.defaultPrevented) {
        return
      }
      event.preventDefault()
      history.push(path, state)
    },
    [history],
  )

  return function getProps(props = {}) {
    let handler = applyToAll(props.onClick, linkClick)
    return {
      ...props,
      href: path,
      role: props.disabled ? 'presentation' : 'anchor',
      onClick: props.disabled ? noop : handler,
      onKeyDown: props.disabled ? noop : keyDown(handler),
      onKeyUp: props.disabled ? noop : keyUp(handler),
      tabIndex: props.disabled ? '-1' : '0',
    }
  }
}

export function useRoute(path, { matcher = defaultPathMatcher } = {}) {
  let { history, location } = useHistory()
  return {
    ...history,
    ...location,
    match: matcher(path, location),
  }
}

// Utils

function useLazyRef(initializer) {
  let ref = useRef(null)

  if (ref.current === null) {
    ref.current = initializer()
  }
  return ref
}

function useClientSideLayoutEffect(cb, deps) {
  let effect = typeof window !== 'undefined' ? useLayoutEffect : noop
  effect(cb, deps)
}

function useClientSideRef(initializer) {
  let ref = useRef(null)

  useClientSideLayoutEffect(() => {
    ref.current = initializer()
  }, [])

  return ref
}

function applyToAll(...fns) {
  return function(...values) {
    fns.forEach(fn => fn && fn(...values))
  }
}

function keyDown(handler) {
  return function(event) {
    if (event.key === ' ') {
      handler(event)
    }
  }
}

function keyUp(handler) {
  return function(event) {
    if (event.key === 'Enter') {
      handler(event)
    }
  }
}

function noop() {}

function defaultPathMatcher(path, location) {
  return path === location.pathname
}
