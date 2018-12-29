# reroute

A quick and dirty browser router implementation using React.createContext.

```jsx
import { Router, Route, Link } from '@reroute/browser'

render(
  <Router>
    <Route path="/hello-world">
      {() => (
        <div>
          <marquee>Hello World!</marquee>
          <Link to="/">Go Back</Link>
        </div>
      )}
    </Route>
    <Link to="/hello-world">Go to Greeting</Link>
  </Router>,
)
```

## TODO:

- [ ] monorepo setup with lerna possibly?
  - [ ] @reroute/server
  - [ ] @reroute/native
  - [ ] more???
- [ ] Unit tests
- [ ] Demos
- [ ] `<SimpleRoute path="some-path">`
- [ ] capture groups maybe?
  - [ ] `path="/some-route/:id"`
