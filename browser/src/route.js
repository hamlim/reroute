import { useContext } from 'https://unpkg.com/@matthamlin/react@1.0.5/danger/react.js'
import { routerContext } from './context.js'

// <Route
//   path="/hello"
//   children={({ history }) => ( <marquee children="hello" />)}
// />
export function Route(props) {
  const { navigate, ...history } = useContext(routerContext)
  let matches = history.location === props.path
  let render
  if (props.render) {
    render = props.render
  } else {
    render = props.children
  }
  return render({ history, navigate, matches, ...props })
}
