import { createContext } from '@matthamlin/danger-react-suspense/dev/react.js'
import { makeHistory } from './history.js'

export function createRouterContext(defaultValue) {
  return createContext(defaultValue)
}

export const defaultValue = { history: makeHistory() }

export const routerContext = createRouterContext(defaultValue)
