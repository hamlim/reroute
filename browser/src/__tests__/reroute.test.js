import React from '@matthamlin/danger-react-suspense/dev/react.js'
import { render, cleanup, fireEvent } from '@matthamlin/react-testing-library'
import { Route, Router, Link } from '../index.js'
import 'jest-dom/extend-expect'

afterEach(cleanup)

test('renders children when the path matches', () => {
  const { container, getByText } = render(
    <Router
      value={{
        history: {
          location() {
            return { path: '/hello' }
          },
        },
      }}
    >
      <Route path="/hello">{() => <span>Hello</span>}</Route>
    </Router>,
  )

  getByText('Hello')
})

test('Link calls history.navigateTo when clicked', () => {
  const navigateTo = jest.fn()
  const { container, getByText, getByTestId } = render(
    <Router value={{ history: { navigateTo } }}>
      <Link to="/yo" getProps={props => ({ ...props, 'data-testid': 'test-link' })}>
        Testing
      </Link>
    </Router>,
  )

  fireEvent.click(getByTestId('test-link'))

  expect(navigateTo).toHaveBeenCalled()
})
