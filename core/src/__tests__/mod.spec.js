import React from 'react'
import { render, cleanup } from 'react-testing-library'

import { useHistory, useLink, useRoute, Router } from '../mod.js'
import { createMemoryHistory } from 'history'

afterEach(cleanup)

test('it gives you the history', () => {
  let hist
  function Foo() {
    hist = useHistory()
    return null
  }

  render(
    <Router createHistory={createMemoryHistory}>
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
    <Router createHistory={createMemoryHistory}>
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
    <Router createHistory={createMemoryHistory}>
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
    <Router createHistory={createMemoryHistory}>
      <Foo />
    </Router>,
  )

  expect(queryByTestId('link').getAttribute('role')).toEqual('presentation')
})

test('useRoute determines if it matches the provided path', () => {
  let match
  function Foo() {
    let { match: _match } = useRoute('/')
    match = _match

    return null
  }

  render(
    <Router createHistory={createMemoryHistory}>
      <Foo />
    </Router>,
  )

  expect(match).toBe(true)
})

test('useRoute does not match for a different route', () => {
  let match
  function Foo() {
    let { match: _match } = useRoute('/some-path-here')

    match = _match

    return null
  }
  render(
    <Router createHistory={createMemoryHistory}>
      <Foo />
    </Router>,
  )

  expect(match).toBe(false)
})

// Workaround react bug, see: https://github.com/facebook/react/issues/12485
const pauseErrorLogging = codeToRun => {
  const logger = console.error
  console.error = () => {}

  codeToRun()

  console.error = logger
}

test('Router throws when no createHistory is provided, or its not a function', () => {
  pauseErrorLogging(() =>
    expect(() => {
      render(<Router />)
    }).toThrowErrorMatchingInlineSnapshot(
      `"createHistory prop was either not provided, or is not a function."`,
    ),
  )

  pauseErrorLogging(() =>
    expect(() => {
      render(<Router createHistory={null} />)
    }).toThrowErrorMatchingInlineSnapshot(
      `"createHistory prop was either not provided, or is not a function."`,
    ),
  )
})
