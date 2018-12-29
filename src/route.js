import { useContext } from '@matthamlin/danger-react-suspense/dev/react.js'
import { routerContext } from './context.js'

// <Route
//   path="/hello"
//   children={({ history }) => ( <marquee children="hello" />)}
// />
export function Route(props) {
  const { history } = useContext(routerContext)
  if (history.location().path === props.path) {
    let render
    if (props.render) {
      render = props.render
    } else {
      render = props.children
    }
    return render({ history, ...props })
  }
  return null
}
