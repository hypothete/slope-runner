import Camera from './camera';
import Keyboard from './keyboard';
import Level, { demoLevel } from './level';
import Player from './player';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from './common';

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
  levels: Level[];
  activeLevel: number = -1;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  updateInterval?: number;

  constructor() {
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
    this.camera = new Camera();
    this.keyboard = new Keyboard();
    this.player = new Player();
    this.levels = [demoLevel];
    this.animate = this.animate.bind(this);
  }

  get level() {
    return this.levels[this.activeLevel];
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
      this.startLevel(0);
    }
  }

  updatePlaying() {
    const { camera, keyboard, level, player } = this;
    player.update(keyboard.keys, level);
    camera.update();
  }

  updatePaused() {

  }

  drawTitle() {
    const { ctx } = this;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Press Z to start', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
  }

  drawPlaying() {
    const { camera, ctx, player, level } = this;
    ctx.fillStyle = 'rgb(0, 0, 255)';
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    camera.render(ctx, player, level);
  }

  drawPaused() {
    const { ctx } = this;
    this.drawPlaying();
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
  }

  startLevel(levelIndex: number) {
    this.activeLevel = levelIndex;
    const { level, camera, player } = this;
    player.setPosition(level.startX, level.startY);
    camera.setBounds(level.pixelWidth, level.pixelHeight)
    camera.setTarget(player);
  }
}

const game = new Game();
game.start();