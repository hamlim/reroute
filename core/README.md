# Reroute Core

This package maintains the core hooks for the Reroute library.

These can be manually consumed within feature applications, or they can be consumed through the [`@reroute/browser`](https://github.com/hamlim/reroute/tree/master/browser) package via common components like `Link` and `Route`.

## API

```jsx
import { Router, useRoute, useLink } from '@reroute/core'

function Link({ to, children, ...rest }) {
  let getLinkProps = useLink(to)
  return <a {...getLinkProps(rest)}>{children}</a>
}

function Route({ path, children }) {
  let routeProps = useRoute(path)
  return children(routeProps)
}

render(
  <Router>
    <main />
  </Router>,
)
```
