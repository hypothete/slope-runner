class Player {
  x: number = 0;
  y: number = 0;

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x - 6, this.y - 6, 13, 13);
  }
}

export default Player;