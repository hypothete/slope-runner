import { ChunkData, TileData } from "../editor/redux-types";
import { CHUNK_TILE_SIZE, HALF_TILE, TILE_SIZE } from "../game/common";

export const drawTile = (ctx: CanvasRenderingContext2D, tileTexture: HTMLImageElement, tile: TileData, x: number, y: number): void => {
  ctx.save();

  ctx.translate(
    tile.hFlip ? x + TILE_SIZE : x,
    tile.vFlip ? y + TILE_SIZE : y,
  );

  ctx.scale(
    tile.hFlip ? -1 : 1,
    tile.vFlip ? -1 : 1
  );
  
  tile.textures.forEach((texIndex, index) => {
    const dx = index % 2;
    const dy = Math.floor(index / 2);
    if (
      tileTexture &&
      texIndex * HALF_TILE < tileTexture.width
    ) {
      ctx.drawImage(
        tileTexture,
        texIndex * HALF_TILE,
        0,
        HALF_TILE,
        HALF_TILE,
        dx * HALF_TILE,
        dy * HALF_TILE,
        HALF_TILE,
        HALF_TILE
      );
    } else {
      ctx.fillStyle = 'red';
      ctx.fillRect(
        dx * HALF_TILE,
        dy * HALF_TILE,
        HALF_TILE,
        HALF_TILE
      );
    }
  });

  ctx.restore();
}

export const drawChunk = (ctx: CanvasRenderingContext2D, tileTexture: HTMLImageElement, chunk: ChunkData, tiles: TileData[], x: number, y: number) => {
  for(let i=0; i<chunk.tiles.length; i++) {
    const tileId = chunk.tiles[i];
    const tile = tiles.find(tile => tile.id === tileId);
    if (!tile) throw new Error(`Could not draw tile with ID ${tileId}`);
    const tileX = i % CHUNK_TILE_SIZE;
    const tileY = Math.floor(i / CHUNK_TILE_SIZE);
    drawTile(ctx, tileTexture, tile, x + tileX * TILE_SIZE, y + tileY * TILE_SIZE);
  }
}