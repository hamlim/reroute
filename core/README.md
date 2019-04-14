# Reroute Core

This package maintains the core hooks for the Reroute library.

These can be manually consumed within feature applications, or they can be consumed through the
[`@reroute/browser`](https://github.com/hamlim/reroute/tree/master/browser) package via common
components like `Link` and `Route`.

## Install

```sh
yarn add @reroute/core
# Or
npm install @reroute/core
```

## API

```jsx
import { Router, useRoute, useLink } from '@reroute/core'

function UserRoute({ userId }) {
  let { match } = useRoute(`/user-${userId}`)
  if (match) {
    return <User />
  }
  return null
}

function Avatar({ userId }) {
  let getLinkProps = useLink(`/user-${userId}`)
  return (
    <a {...getLinkProps()}>
      <img src={`/users/${userId}.png`} alt={`${users[userId]}`} />
    </a>
  )
}

render(
  <Router>
    <main>
      <UserRoute userId="1" />
    </main>
    <aside>
      <Avatar userId="1" />
    </aside>
  </Router>,
)
```
