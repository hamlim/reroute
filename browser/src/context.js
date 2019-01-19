import { createContext } from 'https://unpkg.com/@matthamlin/react@1.0.5/danger/react.js'
import { makeInitialHistory } from './history.js'

export function createRouterContext(defaultValue) {
  return createContext({ ...defaultValue, navigate() {}, isInitial: true })
}

export const defaultValue = { history: makeInitialHistory() }

export const routerContext = createRouterContext(defaultValue)
