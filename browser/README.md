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
