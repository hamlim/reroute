import React from 'react'
import { render, cleanup } from 'react-testing-library'

import { useHistory, useLink, useRoute, Router } from '../mod.js'

afterEach(cleanup)

test('it gives you the history', () => {
  let hist
  function Foo() {
    hist = useHistory()
    return null
  }

  render(
    <Router>
      <Foo />
    </Router>,
  )

  expect(hist.location.pathname).toEqual('/')
})

test('useLink provides a function to get link props', () => {
  let func
  function Foo() {
    func = useLink('/path')
    return null
  }
  render(
    <Router>
      <Foo />
    </Router>,
  )
  expect(typeof func).toBe('function')
})

test('calling the result of useLink provides the correct role', () => {
  function Foo() {
    let getLinkProps = useLink('/foo')

    return (
      <div {...getLinkProps()} data-testid="link">
        Yo
      </div>
    )
  }

  let { queryByTestId } = render(
    <Router>
      <Foo />
    </Router>,
  )

  expect(queryByTestId('link').getAttribute('role')).toEqual('anchor')
})

test('useLink supports disabled links', () => {
  function Foo() {
    let getLinkProps = useLink('/foo')

    return (
      <div {...getLinkProps({ disabled: true })} data-testid="link">
        Yo
      </div>
    )
  }

  let { queryByTestId } = render(
    <Router>
      <Foo />
    </Router>,
  )

  expect(queryByTestId('link').getAttribute('role')).toEqual('presentation')
})

test('useRoute determines if it matches the provided path', () => {
  let matches
  function Foo() {
    let { matches: _matches } = useRoute('/')
    matches = _matches

    return null
  }

  render(
    <Router>
      <Foo />
    </Router>,
  )

  expect(matches).toBe(true)
})

test('useRoute does not match for a different route', () => {
  let matches
  function Foo() {
    let { matches: _matches } = useRoute('/some-path-here')

    matches = _matches

    return null
  }
  render(
    <Router>
      <Foo />
    </Router>,
  )

  expect(matches).toBe(false)
})
