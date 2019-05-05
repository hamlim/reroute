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
import { createBrowserHistory } from 'history'
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
  <Router createHistory={() => createBrowserHistory()}>
    <main>
      <UserRoute userId="1" />
    </main>
    <aside>
      <Avatar userId="1" />
    </aside>
  </Router>,
)
```

## Testing

If you are testing components that use the `useRoute` or `useLink` hooks, you may need to mount your
component with a test version of the Router. To do this, you can render your components within a
custom Router component.

#### Mounting your Component

If you want more control over the current Router state, for example mounting your application during
a test at a nested pathname, then you can use the `<Router>` from `@reroute/core` and provide it a
function to it's `createHistory` prop.

```jsx
// one suggestion is to use the `create*History` APIs from the `history` module from NPM
import { createMemoryHistory } from 'history'
import { Router } from '@reroute/core'

render(
  <Router createHistory={createMemoryHistory}>
    <FeatureComponent />
  </Router>,
)
```

#### If you want to default the Router to a particular pathname

```jsx
import { createMemoryHistory } from 'history'
import { Router } from '@reroute/core'

render(
  <Router
    createHistory={() =>
      createMemoryHistory({
        initialEntries: ['/foo'],
      })
    }
  >
    <Route path="/foo">{({ match }) => match && <>This will render initially</>}</Route>
  </Router>,
)
```

Check out the `history` modules documentation [here](https://www.npmjs.com/package/history#usage)
for more information about how you can configure different history variations.
