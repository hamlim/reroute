import { getByText, getByTestId, fireEvent } from 'dom-testing-library'
import ReactDOM from '@matthamlin/danger-react-suspense/dev/react-dom.js'

let body = document.body
let container = document.createElement('div')

body.appendChild(container)

function render(app) {
  ReactDOM.render(app, container)
  return {
    container,
    getByText: str => getByText(container, str),
    getByTestId: str => getByTestId(container, str),
  }
}

function cleanup() {
  ReactDOM.unmountComponentAtNode(container)
  container.innerHTML = ''
}

export { render, cleanup, fireEvent }
