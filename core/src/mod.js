import React, { createContext, useContext, useState, useLayoutEffect, useRef } from 'react'

import { createBrowserHistory } from 'history'

let browserHistory = createBrowserHistory()

let historyContext = createContext(browserHistory)

// exports

export function Router({ children }) {
  let [location, setLocation] = useState(browserHistory.location)

  let { current: listener } = useClientSideRef(() => {
    return browserHistory.listen(location => {
      setLocation(location)
    })
  })

  useClientSideLayoutEffect(() => {
    return listener
  }, [])

  return (
    <historyContext.Provider value={{ history: browserHistory, location }}>
      {children}
    </historyContext.Provider>
  )
}

export function useHistory() {
  return useContext(historyContext)
}

export function useLink(path, state) {
  let { history } = useHistory()
  function linkClick(event) {
    if (event.defaultPrevented) {
      return
    }
    event.preventDefault()
    history.push(path, state)
  }

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
  let effect = typeof window !== 'undefined' ? useLayoutEffect : () => {}
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
