import React from 'react'

const { createContext, useContext, useState, useMemo, useLayoutEffect, useRef, useCallback } = React

let historyContext = createContext({
  history: null,
  location: null,
})

// exports

export function Router({ children, createHistory }) {
  if (typeof createHistory !== 'function') {
    throw new Error('createHistory prop was either not provided, or is not a function.')
  }
  let { current: history } = useLazyRef(createHistory)
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

  let contextValue = useMemo(
    () => ({
      history,
      location,
    }),
    [location],
  )

  return <historyContext.Provider value={contextValue}>{children}</historyContext.Provider>
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
      if (history === null || history === undefined) {
        throw new Error(`Link attempted to route to path: '${path}' but no history was found in context.

Check to ensure the link is rendered within a Router.`)
      }
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
