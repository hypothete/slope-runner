import Camera from './camera';
import Keyboard from './keyboard';
import Player from './player';

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 224;

enum GameState {
  Title,
  Playing,
  Paused
}

class Game {
  state = GameState.Title;
  player: Player;
  camera: Camera;
  keyboard: Keyboard;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  updateInterval?: number;

  constructor() {
    this.camera = new Camera();
    this.keyboard = new Keyboard();
    this.player = new Player();
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      throw new Error('No canvas found!');
    }
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Context could not be initialized!');
    }
    this.ctx = ctx;
    this.animate = this.animate.bind(this);
  }

  async start() {
    this.updateInterval = window.setInterval(() => { this.update(); }, 17);
    this.animate();
  }

  update() {
    // physics and input updates
    if (this.state === GameState.Title) {
      this.updateTitle();
    } else if (this.state === GameState.Playing) {
      this.updatePlaying();
    } else {
      this.updatePaused();
    }
  }

  animate() {
    // drawing updates
    requestAnimationFrame(this.animate);
    if (this.state === GameState.Title) {
      this.drawTitle();
    } else if (this.state === GameState.Playing) {
      this.drawPlaying();
    } else {
      this.drawPaused();
    }
  }

  updateTitle() {
    if (this.keyboard.keys['z']) {
      this.state = GameState.Playing;
    }
  }

  updatePlaying() {

  }

  updatePaused() {

  }

  drawTitle() {
    const { ctx } = this;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Press Z to start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  }

  drawPlaying() {
    const { ctx } = this;
    ctx.fillStyle = 'rgb(0, 0, 255)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  drawPaused() {
    const { ctx } = this;
    this.drawPlaying();
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  }
}

const game = new Game();
game.start();