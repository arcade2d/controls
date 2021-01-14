export abstract class AbstractInput<EventTypes extends string> {
  private listeners: { [type: string]: readonly Function[] } = {};

  protected addEventListener<E>(
    type: EventTypes,
    handler: (event: E) => void
  ): void {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }

    this.listeners[type] = this.listeners[type].concat(handler);
  }

  protected removeEventListener<E>(
    type: EventTypes,
    handler: (event: E) => void
  ): void {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter((h) => h !== handler);
    }
  }

  protected dispatchEvent<E>(type: EventTypes, event: E): void {
    if (this.listeners[type]) {
      for (const handler of this.listeners[type]) {
        handler(event);
      }
    }
  }

  public destroy(): void {
    this.listeners = {};
  }
}
