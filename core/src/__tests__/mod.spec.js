import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { useHistory, useLink, useRoute, Router, Switch } from '../mod.js'
import { createMemoryHistory } from 'history'


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

test('useLink`s linkClick callback throws when no history is provided within context', () => {
  let clickHandler
  function Link() {
    let getLinkProps = useLink('/foo')
    let { onClick, ...rest } = getLinkProps()
    clickHandler = onClick
    return null
  }
  render(<Link />)

  expect(() => clickHandler({ defaultPrevented: false, preventDefault() {} }))
    .toThrowErrorMatchingInlineSnapshot(`
"Link attempted to route to path: '/foo' but no history was found in context.

Check to ensure the link is rendered within a Router."
`)
})

test('link still calls the handler even if disabled', () => {
  let clickHandler = jest.fn()
  function Link() {
    let getLinkProps = useLink('/foo')
    return (
      <a {...getLinkProps({ disabled: true, onClick: clickHandler })}>anchor</a>
    )
  }
  let { container } = render(
    <Router createHistory={createMemoryHistory}>
      <Link />
    </Router>,
  )
  let anchor = container.querySelector('a')
  fireEvent.click(anchor)
  expect(clickHandler).toHaveBeenCalled()
})

test('switch renders the matching route', () => {
  function Route({ children }) {
    return children()
  }
  let { queryByText } = render(
    <Router
      createHistory={() =>
        createMemoryHistory({
          initialEntries: ['/foo'],
        })
      }
    >
      <Switch>
        <Route path="/foo">{() => <p>Foo</p>}</Route>
        <Route path="/bar">{() => <p>Bar</p>}</Route>
        <Route path="/baz">{() => <p>Baz</p>}</Route>
        <Route path="/fizz">{() => <p>Fizz</p>}</Route>
      </Switch>
    </Router>,
  )

  expect(queryByText(/Foo/)).not.toBe(null)
  expect(queryByText(/Bar/)).toBe(null)
  expect(queryByText(/Baz/)).toBe(null)
  expect(queryByText(/Fizz/)).toBe(null)
})

test('Switch throws when not rendered in a Router', () => {
  pauseErrorLogging(() =>
    expect(() => render(<Switch />)).toThrowErrorMatchingInlineSnapshot(`
"Rendered a <Switch> component out of the context of a <Router> component.

Ensure the <Switch> is rendered as a child of the <Router>."
`),
  )
})
