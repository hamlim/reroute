import React, { useContext } from 'react'
import { routerContext } from './context.js'
import { applyToAll } from './utils.js'

function defaultGetProps(props) {
  return props
}

export function Link({ to, getProps = defaultGetProps, ...rest } = {}) {
  const { navigate } = useContext(routerContext)
  return (
    <a
      {...getProps({
        ...rest,
        href: to,
        onClick: applyToAll(event => {
          event.preventDefault()
          navigate(to)
        }, rest.onClick),
      })}
    />
  )
}
