export type InputEventHandler<E> = (event: E) => void;

export abstract class InputEvent {
  constructor(public readonly type: string) {}
}

export abstract class AbstractInput<E extends InputEvent> {
  private listeners: { [type: string]: readonly InputEventHandler<E>[] } = {};

  protected addListener(type: string, handler: InputEventHandler<E>): void {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }

    this.listeners[type] = this.listeners[type].concat(handler);
  }

  protected removeListener(type: string, handler: InputEventHandler<E>): void {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter(
        (entry: Function) => entry !== handler,
      );

      if (this.listeners[type].length === 0) {
        delete this.listeners[type];
      }
    }
  }

  protected dispatch(event: E): void {
    if (this.hasListener(event.type)) {
      for (const handler of this.listeners[event.type]) {
        handler(event);
      }
    }
  }

  protected hasListener(type: string): boolean {
    return this.listeners[type] !== undefined;
  }

  /**
   * Destroy this input controller, releasing all listeners.
   */
  public destroy(): void {
    this.listeners = {};
  }
}
