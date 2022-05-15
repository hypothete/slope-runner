class Keyboard {
  keys: Record<string, boolean> = {};

  constructor() {
    window.addEventListener('keydown', keyEvent => {
      this.keys[keyEvent.key] = true;
      console.log(keyEvent.key);
    });

    window.addEventListener('keyup', keyEvent => {
      this.keys[keyEvent.key] = false;
    });
  }
}

export default Keyboard;