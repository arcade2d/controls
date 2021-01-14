import { AbstractInput } from "./base";

export type KeyboardState = { [key: string]: number };

export type KeyPressEvent = {
  readonly key: string;
  readonly native: KeyboardEvent;
};

export type KeyReleaseEvent = {
  readonly key: string;
  readonly native: KeyboardEvent;
};

export type KeyboardInputOptions = {
  readonly map: { [name: string]: string };
};

/**
 * Provides an instance through which to handle keyboard input.
 */
export class KeyboardInput extends AbstractInput<"press" | "release"> {
  private state: KeyboardState = {};

  private readonly keyUpHandler: (event: KeyboardEvent) => void;
  private readonly keyDownHandler: (event: KeyboardEvent) => void;

  constructor(
    private readonly context: Document,
    private readonly options: KeyboardInputOptions
  ) {
    super();

    this.keyUpHandler = (event: KeyboardEvent) => {
      if (this.isKeyDown(event.key)) {
        this.dispatchEvent<KeyReleaseEvent>("release", {
          key: event.key,
          native: event,
        });

        delete this.state[event.key];
      }
    };

    this.keyDownHandler = (event: KeyboardEvent) => {
      if (!this.isKeyDown(event.key)) {
        this.state[event.key] = Date.now();

        this.dispatchEvent<KeyReleaseEvent>("press", {
          key: event.key,
          native: event,
        });
      }
    };

    context.addEventListener("keyup", this.keyUpHandler);
    context.addEventListener("keydown", this.keyDownHandler);
  }

  public onKeyPress(handler: (event: KeyPressEvent) => void): void {
    this.addEventListener("press", handler);
  }

  public onKeyRelease(handler: (event: KeyReleaseEvent) => void): void {
    this.addEventListener("release", handler);
  }

  public isKeyDown(key: string): boolean {
    return key in this.state;
  }

  public destroy(): void {
    this.context.removeEventListener("keyup", this.keyUpHandler);
    this.context.removeEventListener("keydown", this.keyDownHandler);
  }

  public getState(): KeyboardState {
    return { ...this.state };
  }
}
