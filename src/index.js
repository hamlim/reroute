import React, { Component, createContext } from 'react'
import createHistory from 'history/createBrowserHistory'

export const history = createHistory()

const ctx = {
  history,
  ...history,
}

export const context = createContext(ctx)

export class Router extends Component {
  state = ctx
  componentDidMount() {
    this.listener = this.state.listen(
      (location, action) => {
        this.setState({ location, action })
      },
    )
  }
  componentWillUnmount() {
    this.listener()
  }
  render() {
    return (
      <context.Provider value={this.state}>
        {this.props.children}
      </context.Provider>
    )
  }
}

export const Link = ({ to, Element = 'a', ...rest }) => (
  <context.Consumer>
    {({ push }) => (
      <Element
        {...rest}
        href={to}
        onClick={e => {
          e.preventDefault()
          push(to)
        }}
      />
    )}
  </context.Consumer>
)

export const Route = ({ children }) => (
  <context.Consumer>{children}</context.Consumer>
)
