import Level from "./level";
import Player from "./player";

class Camera {
  x: number = 0;
  y: number = 0;

  render(ctx: CanvasRenderingContext2D, player: Player, level: Level) {
    ctx.save();
    ctx.translate(this.x, this.y);
    level.draw(ctx, this.x, this.y);
    player.draw(ctx);
    ctx.restore();
  }
}

export default Camera;