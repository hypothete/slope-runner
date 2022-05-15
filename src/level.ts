import { SCREEN_WIDTH, SCREEN_HEIGHT } from './common';

const TILE_SIZE =  16;
const CHUNK_SIZE = 128;
const CHUNK_TILE_SIZE = 8;

interface TileOptions {
  height: number[];
  hFlip: boolean;
  vFlip: boolean;
  angle: number;
  solid: boolean[];
  textures: number[];
}

class Tile {
  height = new Array(16).fill(0);
  hFlip: boolean = false;
  vFlip: boolean = false;
  angle = 0;
  solid = new Array<boolean>(4).fill(false);
  textures = new Array(4).fill(0);

  constructor(options: TileOptions) {
    Object.assign(this, options);
  }
}

interface ChunkOptions {
  tiles: number[];
}

class Chunk {
  tiles = new Array(64);

  constructor(options: ChunkOptions) {
    Object.assign(this, options);
  }
}

interface LevelOptions {
  name: string;
  width: number; // width and height are in chunks
  height: number;
  tiles: Tile[];
  chunks: Chunk[];
  data: number[]; // chunk ID array
  startX: number;
  startY: number;
}

class Level {
  name = 'NO_NAME';
  width = 0;
  height = 0;
  tiles: Tile[] = [];
  chunks: Chunk[] = [];
  data: number[] = [];
  startX = 0;
  startY = 0;

  constructor(options: LevelOptions) {
    Object.assign(this, options);
  }

  getTile(x: number, y: number) {
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkY = Math.floor(y / CHUNK_SIZE);
    const chunkIndex = this.data[chunkY * this.width + chunkX];
    const chunk = this.chunks[chunkIndex];
    const tileX = Math.floor((x - chunkX) / TILE_SIZE);
    const tileY = Math.floor((y - chunkY) / TILE_SIZE);
    const tileIndex = chunk.tiles[tileY * CHUNK_TILE_SIZE + tileX];
    return this.tiles[tileIndex];
  }

  drawChunk(ctx: CanvasRenderingContext2D, index: number, x: number, y: number) {
    const chunk = this.chunks[index];
    for(let i=0; i<chunk.tiles.length; i++) {
      const tileIndex = chunk.tiles[i];
      const tile = this.tiles[tileIndex];
      const tileX = i % CHUNK_TILE_SIZE;
      const tileY = Math.floor(i / CHUNK_TILE_SIZE);
      // todo get texture here
      // for now just draw red if solid
      if (tile.solid.includes(true)) {
        ctx.fillStyle = 'red';
        ctx.fillRect(x + tileX * TILE_SIZE, y + tileY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }

    // todo use debug flag to view other properties
  }

  draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // x and y are pixel locations for top-left corner of the screen
    const chunkStartX = Math.floor(x / CHUNK_SIZE);
    const chunkEndX = Math.ceil((x + SCREEN_WIDTH) / CHUNK_SIZE);
    const chunkStartY = Math.floor(y / CHUNK_SIZE);
    const chunkEndY = Math.floor((y + SCREEN_HEIGHT) / CHUNK_SIZE);

    for(let chunkY = chunkStartY; chunkY <= chunkEndY; chunkY++) {
      const sliceStart = chunkY * this.width + chunkStartX;
      const sliceEnd = chunkY * this.width + chunkEndX;
      const chunkIndices = this.data.slice(sliceStart, sliceEnd);
      let chunkX = chunkStartX;
      chunkIndices.forEach(chunkIndex => {
        this.drawChunk(ctx, chunkIndex, chunkX * CHUNK_SIZE, chunkY * CHUNK_SIZE);
        chunkX++;
      });
    }
  }
}

export default Level;

const demoLevel = new Level({
  name: 'Demo Level',
  width: 6,
  height: 6,
  startX: 32,
  startY: 96,
  tiles: [
    new Tile({
      height: new Array(16),
      hFlip: false,
      vFlip: false,
      angle: 0,
      solid: [false, false, false, false],
      textures: [0,0,0,0]
    }),
    new Tile({
      height: new Array(16).fill(16),
      hFlip: false,
      vFlip: false,
      angle: 0,
      solid: [true, true, true, true],
      textures: [0,0,0,0]
    }),
  ],
  chunks: [
    new Chunk({
      tiles: [
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
      ]
    }),
    new Chunk({
      tiles: [
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
      ]
    }),
  ],
  data: [
    0, 0, 0, 0, 0, 0,
    1, 1, 0, 0, 1, 1,
    0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 0, 1,
    1, 1, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1,
  ]
});

export { demoLevel };
