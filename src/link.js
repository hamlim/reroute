import React, { useContext } from '@matthamlin/danger-react-suspense/dev/react.js'
import { routerContext } from './context.js'

function defaultGetProps(props) {
  return props
}

export function Link({ to, Element = 'a', getProps = defaultGetProps, ...rest } = {}) {
  const { history } = useContext(routerContext)
  return (
    <Element
      {...getProps({
        ...rest,
        href: to,
        onClick: event => {
          event.preventDefault()
          history.navigateTo(to)
        },
      })}
    />
  )
}
