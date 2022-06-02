class Keyboard {
  keys: Record<string, boolean> = {};

  constructor() {
    window.addEventListener('keydown', keyEvent => {
      this.keys[keyEvent.key] = true;
    });

    window.addEventListener('keyup', keyEvent => {
      this.keys[keyEvent.key] = false;
    });
  }
}

export default Keyboard;