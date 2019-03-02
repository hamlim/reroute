import React from 'react'
import { render, cleanup, fireEvent } from 'react-testing-library'
import { Route, Router, Link } from '../index.js'
import 'jest-dom/extend-expect'

afterEach(cleanup)

test('renders children when the path matches', () => {
  const { container, getByText } = render(
    <Router
      value={{
        history: {
          location: '/hello',
        },
      }}
    >
      <Route path="/hello">{() => <span>Hello</span>}</Route>
    </Router>,
  )

  getByText('Hello')
})

test('Link calls navigate when clicked', () => {
  const navigate = jest.fn()
  const { container, getByText, getByTestId } = render(
    <Router value={{ history: {}, navigate }}>
      <Link to="/yo" getProps={props => ({ ...props, 'data-testid': 'test-link' })}>
        Testing
      </Link>
    </Router>,
  )

  fireEvent.click(getByTestId('test-link'))

  expect(navigate).toHaveBeenCalled()
})
