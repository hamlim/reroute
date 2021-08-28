import React from 'react'

const {
  createContext,
  useContext,
  useState,
  useMemo,
  useLayoutEffect,
  useRef,
  useCallback,
  useTransition: useReactTransition,
  Children,
  isValidElement,
  cloneElement,
  useEffect,
} = React

let historyContext = createContext({
  history: null,
  location: null,
  isPending: false,
})

let useTransition

if (typeof useReactTransition === 'function') {
  useTransition = useReactTransition
} else {
  useTransition = function() {
    let [val, setIsDone] = useState(0)
    let callback = useRef(null)

    useEffect(() => {
      if (val === 1) {
        callback.current()
        setIsDone(2)
      }
    }, [val])

    return [
      val === 1,
      cb => {
        setIsDone(1)
        callback.current = cb
      },
    ]
  }
}

// exports

export function Router({ children, createHistory, timeoutMs = 2000 }) {
  if (typeof createHistory !== 'function') {
    throw new Error(
      'createHistory prop was either not provided, or is not a function.',
    )
  }
  let { current: history } = useLazyRef(createHistory)
  let [location, setLocation] = useState(history.location)
  let [isPending, startTransition] = useTransition({ timeoutMs })

  let { current: listener } = useClientSideRef(() => {
    return history.listen(location => {
      startTransition(() => {
        setLocation(location)
      })
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
      isPending,
    }),
    [location, isPending],
  )

  return (
    <historyContext.Provider value={contextValue}>
      {children}
    </historyContext.Provider>
  )
}

export function Switch({ children, matcher = defaultPathMatcher } = {}) {
  let history = useHistory()
  if (history.location === null) {
    throw new Error(`Rendered a <Switch> component out of the context of a <Router> component.

Ensure the <Switch> is rendered as a child of the <Router>.`)
  }

  let { location } = history

  let element, match

  // We use React.Children.forEach instead of React.Children.toArray().find()
  // here because toArray adds keys to all child elements and we do not want
  // to trigger an unmount/remount for two <Route>s that render the same
  // component at different URLs.
  Children.forEach(children, child => {
    if (!match && isValidElement(child)) {
      element = child

      const path = child.props.path

      if (typeof path === 'string') {
        match = matcher(path, location)
      }
    }
  })

  return match ? element : null
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
      'aria-disabled': props.disabled ? 'true' : null,
      onClick: handler,
      onKeyDown: keyDown(handler),
      onKeyUp: keyUp(handler),
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
