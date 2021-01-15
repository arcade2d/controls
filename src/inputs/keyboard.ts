import { AbstractInput, InputEvent, InputEventHandler } from './base';

export type KeyboardKeyList = { [key: string]: number };

export class KeyboardInputEvent extends InputEvent {
  constructor(
    public readonly type: string,
    public readonly key: string,
    public readonly native: KeyboardEvent,
  ) {
    super(type);
  }
}

export class KeyboardState {
  constructor(public readonly keys: KeyboardKeyList) {}

  /**
   * Determine whether the input key is pressed in this state snapshot.
   *
   * @param key The key to check.
   */
  public isDown(key: string): boolean {
    return key in this.keys;
  }

  /**
   * Determine whether all of the keys in the provided array are pressed in this
   * state snapshot.
   *
   * @param keys The keys to check.
   */
  public areDown(keys: readonly string[]): boolean {
    return keys.every((key: string) => this.isDown(key));
  }
}

/**
 * Provides an instance through which to handle keyboard input.
 */
export class KeyboardInput extends AbstractInput<KeyboardInputEvent> {
  private keys: KeyboardKeyList = {};

  private readonly keyUpHandler: (event: KeyboardEvent) => void;
  private readonly keyDownHandler: (event: KeyboardEvent) => void;

  constructor(private readonly context: Document) {
    super();

    this.keyUpHandler = (event: KeyboardEvent) => {
      if (this.keys[event.key]) {
        delete this.keys[event.key];
        this.dispatch(new KeyboardInputEvent('release', event.key, event));
      }
    };

    this.keyDownHandler = (event: KeyboardEvent) => {
      if (!this.keys[event.key]) {
        this.keys[event.key] = Date.now();
        this.dispatch(new KeyboardInputEvent('press', event.key, event));
      }
    };

    context.addEventListener('keyup', this.keyUpHandler);
    context.addEventListener('keydown', this.keyDownHandler);
  }

  /**
   * Attach a handler function to execute when a key is pressed.
   *
   * @param handler The handler function.
   */
  public onKeyPress(handler: InputEventHandler<KeyboardInputEvent>): void {
    this.addListener('press', handler);
  }

  /**
   * Attach a handler function to execute when a key is released.
   *
   * @param handler The handler function.
   */
  public onKeyRelease(handler: InputEventHandler<KeyboardInputEvent>): void {
    this.addListener('release', handler);
  }

  public destroy(): void {
    this.context.removeEventListener('keyup', this.keyUpHandler);
    this.context.removeEventListener('keydown', this.keyDownHandler);
  }

  /**
   * Retrieve the current keyboard state which includes information about which
   * keys are currently pressed and the timestamps that they were pressed at.
   */
  public getState(): KeyboardState {
    return new KeyboardState({ ...this.keys });
  }
}
