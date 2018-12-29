import React, {
  useContext,
  useState,
  useRef,
  useEffect,
} from '@matthamlin/danger-react-suspense/dev/react.js'
import { routerContext, defaultValue } from './context.js'

// <Router value={{ history: myOwnHistory }}>
//   <Router> // has myOwnHistory
//     {anything}
//   </Router>
// </Router>

export function Router(props) {
  let providedContext = useContext(routerContext)

  let ctx

  if (providedContext === defaultValue) {
    ctx = defaultValue
  } else {
    ctx = providedContext
  }

  let [ctxState, setState] = useState(ctx)
  let updateRef = useRef(null)

  if (updateRef.current === null) {
    setState({
      ...ctxState,
      history: {
        ...ctxState.history,
        navigateTo(path) {
          ctxState.history.navigateTo(path)
          setState(s => ({ ...s }))
        },
      },
    })
    updateRef.current = true
  }

  return <routerContext.Provider value={ctxState} {...props} />
}
