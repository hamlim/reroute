// { location: string, stack: Stack }

class Route {
  constructor(path) {
    this.route = path
  }

  get path() {
    return this.route
  }
}

export function createRoute(path) {
  return new Route(path)
}

class Stack {
  constructor() {
    this.length = 0
    this.items = []
  }

  insert(item) {
    this.items.push(item)
    this.length += 1
  }

  pop() {
    try {
      return this.items[this.length - 1]
    } finally {
      this.length -= 1
    }
  }

  top() {
    return this.items[this.length - 1]
  }
}

export function makeHistory(config) {
  let stack = new Stack()
  let initialRoute = config ? config.initialRoute : window.location.pathname
  stack.insert(createRoute(initialRoute))
  return {
    initialRoute: stack.top(),
    currentRoute: stack.top(),
    historyStack: stack,
    nativeHistory: window.history,
    location() {
      return this.historyStack.top()
    },
    navigateTo(path) {
      this.historyStack.insert(createRoute(path))
      this.nativeHistory.pushState(null, null, path)
      this.currentRoute = path
    },
    ...config,
  }
}
