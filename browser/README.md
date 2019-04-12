# Reroute Browser

A collection of routing components and hooks for composing web react applications.

## API

```jsx
import { BrowserRoute, Route, Link, useLink, useRoute } from '@reroute/browser'

// useLink and useRoute are the same exports from '@reroute/core'

render(
  <BrowserRoute>
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
  </BrowserRoute>,
)
```
