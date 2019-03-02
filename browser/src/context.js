import { createContext } from 'react'
import { makeInitialHistory } from './history.js'

export function createRouterContext(defaultValue) {
  return createContext({ ...defaultValue, navigate() {}, isInitial: true })
}

export const defaultValue = { history: makeInitialHistory() }

export const routerContext = createRouterContext(defaultValue)
