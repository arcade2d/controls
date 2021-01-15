# Controls

Input detection components for browser-based game controls.

## Examples

### Keyboard Input

```typescript
import {
  KeyboardInput,
  KeyboardInputEvent,
  KeyboardState,
} from '@arcade2d/controls';

// Define keyboard input manager instance.
const keyboard = new KeyboardInput(document);

// Handle key press and release handlers.
keyboard.onKeyPress((event: KeyboardInputEvent) =>
  console.log('press', event.key),
);
keyboard.onKeyRelease((event: KeyboardInputEvent) =>
  console.log('release', event.key),
);

// Check keyboard state during a loop.
setInterval(() => {
  const state: KeyboardState = keyboard.getState();

  if (state.isDown('a')) {
    console.log('a is held down');
  }
}, 16);
```
