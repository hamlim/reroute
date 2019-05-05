# Reroute Browser

A collection of routing components and hooks for composing web react applications.

## Install

```sh
yarn add @reroute/browser
# Or
npm install @reroute/browser
```

## API

```jsx
import { BrowserRouter, Route, Link, useLink, useRoute } from '@reroute/browser'

// useLink and useRoute are the same exports from '@reroute/core'

render(
  <BrowserRouter>
    <Route path="/hello-world">
      {({ match }) =>
        match && (
          <div>
            <marquee>Hello World!</marquee>
            <Link to="/">Go Back</Link>
          </div>
        )
      }
    </Route>
    <Link to="/hello-world">Go to Greeting</Link>
  </BrowserRouter>,
)
```

## Demo

Check out the [Codesandbox Demo](https://codesandbox.io/s/n96xx2p4yp).

## Testing

If you are testing components that use the Route or Link component, you may need to mount your
component with a test version of the Router. To do this, you can either:

1. Render inside a `<BrowserRouter>` or,
2. Render within a `<Router>` from `@reroute/core`

#### Option 1

The default BrowserRouter from `@reroute/browser` should work as expected within your test
environment, as long as you define the `window` and `document` APIs. If you are using Jest / a
testing framework that uses JSDom then you should be all set.

#### Option 2

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

#### Mounting with A Default Entry

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
