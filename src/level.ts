import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  CHUNK_SIZE,
  CHUNK_TILE_SIZE,
  TILE_SIZE,
  Direction,
  Positioned
} from './common';

const HALF_TILE = TILE_SIZE / 2;

interface TileOptions {
  height: number[];
  hFlip: boolean;
  vFlip: boolean;
  angle: number;
  solid: Direction[];
  textures: number[];
}

export class Tile {
  height: number[] = new Array(16).fill(0);
  hFlip: boolean = false;
  vFlip: boolean = false;
  angle = 0;
  solid = new Array<Direction>(4);
  textures: number[] = new Array(4).fill(0);

  constructor(options: TileOptions) {
    Object.assign(this, options);
  }

  get isEmpty() {
    return !this.height.some(column => column > 0);
  }

  get isFull() {
    return this.height.every(column => column == 16);
  }

  getCollisionOffset(position: Positioned, direction: Direction): Positioned {
    if (!this.solid.includes(direction)) return { x: 0, y: 0};
    let { x, y } = position;
    if (this.hFlip) {
      x = TILE_SIZE - x;
    }
    if (this.vFlip) {
      y = TILE_SIZE - y;
    }
    switch(direction) {
      case Direction.Left: {
        let dx = 0;
        for(let i=TILE_SIZE-1; i>=x; i--) {
          const minHeight = TILE_SIZE - this.height[i];
          if (y <= minHeight) {
            break;
          }
          dx++;
        }

        return {
          x: dx,
          y: 0
        }
      }
      case Direction.Right: {
        let dx = 0;
        for(let i=0; i<x; i++) {
          const minHeight = TILE_SIZE - this.height[i];
          if (y <= minHeight) {
            break;
          }
          dx--;
        }

        return {
          x: dx,
          y: 0
        }
      }
      case Direction.Up: {
        return {
          x: 0,
          y: TILE_SIZE - y + this.height[x]
        };
      }
      case Direction.Down:
      default: {
        return {
          x: 0,
          y: TILE_SIZE - y - this.height[x]
        };
      }
    }
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
  tileSrc: string;
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
  tileSrc?: string;
  tileTexture?: HTMLImageElement;

  constructor(options: LevelOptions) {
    Object.assign(this, options);
  }

  get pixelWidth() {
    return this.width * CHUNK_SIZE;
  }

  get pixelHeight() {
    return this.height * CHUNK_SIZE;
  }

  async loadTexture() {
    if (!this.tileSrc) {
      throw new Error('No tile src for level!');
    }
    const tileImg = new Image();
    tileImg.src = this.tileSrc;
    await tileImg.decode();
    this.tileTexture = tileImg;
  }

  getTile(x: number, y: number): Tile {
    // find which chunk it's in
    const chunkX = Math.floor(x / CHUNK_SIZE);
    const chunkY = Math.floor(y / CHUNK_SIZE);
    const chunkIndex = this.data[chunkY * this.width + chunkX];
    const chunk = this.chunks[chunkIndex];

    // find position in the chunk
    const tileX = Math.floor((x % CHUNK_SIZE) / TILE_SIZE);
    const tileY = Math.floor((y % CHUNK_SIZE) / TILE_SIZE);

    try {
      const tileIndex = chunk.tiles[tileY * CHUNK_TILE_SIZE + tileX];
      return this.tiles[tileIndex];
    } catch {
      return this.tiles[0];
    }
  }

  drawTile(ctx: CanvasRenderingContext2D, tile: Tile, x: number, y: number) {
    tile.textures.forEach((texIndex, index) => {
      const dx = index % 2;
      const dy = Math.floor(index / 2);
      if (
        this.tileTexture &&
        texIndex * HALF_TILE < this.tileTexture.width
      ) {
        ctx.drawImage(
          this.tileTexture,
          texIndex * HALF_TILE,
          0,
          HALF_TILE,
          HALF_TILE,
          x + dx * HALF_TILE,
          y + dy * HALF_TILE,
          HALF_TILE,
          HALF_TILE
        );
      } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(
          x + dx * HALF_TILE,
          y + dy * HALF_TILE,
          HALF_TILE,
          HALF_TILE
        );
      }
    });
  }

  drawChunk(ctx: CanvasRenderingContext2D, index: number, x: number, y: number) {
    const chunk = this.chunks[index];
    for(let i=0; i<chunk.tiles.length; i++) {
      const tileIndex = chunk.tiles[i];
      const tile = this.tiles[tileIndex];
      const tileX = i % CHUNK_TILE_SIZE;
      const tileY = Math.floor(i / CHUNK_TILE_SIZE);
      this.drawTile(ctx, tile, x + tileX * TILE_SIZE, y + tileY * TILE_SIZE);
    }
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
  width: 10,
  height: 6,
  startX: 160,
  startY: 96,
  tileSrc: './tiles.png',
  tiles: [
    new Tile({
      height: new Array(16),
      hFlip: false,
      vFlip: false,
      angle: 0,
      solid: [],
      textures: [0,0,0,0]
    }),
    new Tile({
      height: new Array(16).fill(16),
      hFlip: false,
      vFlip: false,
      angle: 0,
      solid: [Direction.Down, Direction.Up, Direction.Left, Direction.Right],
      textures: [1,1,1,1]
    }),
    new Tile({
      height: [16, 16, 15, 15, 14, 14, 13, 13, 12, 12, 11, 11, 10, 10, 9, 9],
      hFlip: false,
      vFlip: false,
      angle: 15 * Math.PI / 8,
      solid: [Direction.Down, Direction.Up, Direction.Left, Direction.Right],
      textures: [3,4,1,1]
    }),
    new Tile({
      height: [8, 8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1],
      hFlip: false,
      vFlip: false,
      angle: 15 * Math.PI / 8,
      solid: [Direction.Down, Direction.Up, Direction.Left, Direction.Right],
      textures: [0,0,3,4]
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
    new Chunk({
      tiles: [
        2, 3, 0, 0, 0, 0, 0, 0,
        1, 1, 2, 3, 0, 0, 0, 0,
        1, 1, 1, 1, 2, 3, 0, 0,
        1, 1, 1, 1, 1, 1, 2, 3,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
      ]
    }),
  ],
  data: [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 2, 0, 0, 1, 2, 0, 0, 1,
    1, 0, 0, 0, 1, 1, 1, 1, 0, 1,
    1, 1, 1, 2, 0, 1, 0, 0, 0, 1,
    1, 1, 0, 0, 0, 0, 0, 2, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ]
});

export { demoLevel };
