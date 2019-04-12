import { createBrowserHistory } from 'history'
import { Router, useRoute, useLink } from '@reroute/core'
import React from 'react'

export function Link({ to, children, ...rest }) {
  let getLinkProps = useLink(to)
  return <a {...getLinkProps(rest)}>{children}</a>
}

export function Route({ path, children }) {
  let routeProps = useRoute(path)
  return children(routeProps)
}

export function BrowserRouter({ children, createHistory = createBrowserHistory }) {
  return <Router createHistory={createHistory}>{children}</Router>
}

export { useRoute, useLink }
