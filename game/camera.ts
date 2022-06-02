import Level from "./level";
import Player from "./player";
import { Positioned, SCREEN_WIDTH, SCREEN_HEIGHT } from './common';

const HALF_WIDTH = SCREEN_WIDTH / 2;
const HALF_HEIGHT = SCREEN_HEIGHT / 2;
const LEFT_BORDER = Math.floor(SCREEN_WIDTH * 9 / 20);
const RIGHT_BORDER = HALF_WIDTH;
const TOP_BORDER = Math.floor(SCREEN_HEIGHT * 2 / 7);
const BOTTOM_BORDER = Math.floor(SCREEN_HEIGHT * 4 / 7);
const MAX_CAMERA_SPEED = 16;

class Camera {
  // the camera position is in the middle of the screen
  x: number = 0;
  y: number = 0;
  target?: Positioned;
  boundsX: number = 0;
  boundsY: number = 0;

  setTarget(target: Positioned) {
    this.target = target;
  }

  setBounds(width: number, height: number) {
    this.boundsX = width  - HALF_WIDTH;
    this.boundsY = height - HALF_HEIGHT;
  }

  clampToBounds() {
    this.x = Math.max(HALF_WIDTH, Math.min(this.x, this.boundsX));
    this.y = Math.max(HALF_HEIGHT, Math.min(this.y, this.boundsY));
  }

  update() {
    const { target } = this;
    if (!target) return;

    const offsetX = target.x - this.x;
    const offsetY = target.y - this.y;

    if (target.x < LEFT_BORDER || target.x > RIGHT_BORDER) {
      this.x += Math.sign(offsetX) * Math.min(Math.abs(offsetX), MAX_CAMERA_SPEED);
    }

    if (target.y < TOP_BORDER || target.y > BOTTOM_BORDER) {
      this.y += Math.sign(offsetY) * Math.min(Math.abs(offsetY), MAX_CAMERA_SPEED);
    } else {
      // todo center on target if not in air
    }

    this.clampToBounds();
  }

  render(ctx: CanvasRenderingContext2D, player: Player, level: Level) {
    const x = this.x - HALF_WIDTH;
    const y = this.y - HALF_HEIGHT;
    ctx.save();
    ctx.translate(-x, -y);
    level.draw(ctx, x, y);
    player.draw(ctx);
    ctx.restore();
  }
}

export default Camera;