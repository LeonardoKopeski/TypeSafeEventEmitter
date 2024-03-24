class EventEmitter<EventMap extends Record<string, any[]>> {
  private readonly _listeners: {
    [k in keyof EventMap]?: Array<(...args: EventMap[k]) => any>
  } = {}

  on<T extends keyof EventMap>(event: T, callback: (...args: EventMap[T]) => any): {
    off: () => void
  } {
    this._listeners[event] = this._listeners[event] ?? []

    this._listeners[event]?.push(callback)

    return {
      off: () => {
        const index = this._listeners[event]?.findIndex(elm => elm === callback)
        if (index === -1 || index === undefined) throw new Error('Trying to remove a listener that not exists anymore')
        this._listeners[event]?.splice?.(index, 1)
      }
    }
  }

  protected emit<T extends keyof EventMap> (event: T, ...args: EventMap[T]): void {
    this._listeners[event]?.forEach((elm => {
      elm(...args)
    }))
  }
}
