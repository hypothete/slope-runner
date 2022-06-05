import { drawChunk } from './drawing';
import { ChunkData, LevelImportData, TileData } from '../redux-types';
import {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  CHUNK_SIZE,
  CHUNK_TILE_SIZE,
  TILE_SIZE,
  Direction,
  Positioned
} from './common';

export class Tile {
  id: number = -1;
  height: number[] = new Array(16).fill(0);
  hFlip: boolean = false;
  vFlip: boolean = false;
  angle = 0;
  solid = new Array<Direction>(4);
  textures: number[] = new Array(4).fill(0);

  constructor(options: TileData) {
    Object.assign(this, options);
  }

  get isEmpty() {
    return this.height.every(column => column === 0);
  }

  get isFull() {
    return this.height.every(column => column == 16);
  }

  getCollisionOffset(position: Positioned, direction: Direction): Positioned {
    if (!this.solid.includes(direction)) return { x: 0, y: 0};
    let { x, y } = position;
    if (this.hFlip) {
      x = TILE_SIZE - 1 - x;
    }
    if (this.vFlip) {
      y = TILE_SIZE - 1 - y;
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

export class Chunk {
  id: number = -1;
  tiles = new Array(64);

  constructor(options: ChunkData) {
    Object.assign(this, options);
  }
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

  constructor(options: LevelImportData) {
    const { chunks: chunksData, tiles: tilesData, ...levelData } = options;

    const tiles = tilesData.map(tileData => {
      return new Tile(tileData);
    });
    const chunks = chunksData.map(chunkData => {
      return new Chunk(chunkData);
    });

    Object.assign(this, { tiles, chunks, ...levelData});
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
      // fall back to 0th tile in the set - probably empty
      return this.tiles[0];
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
      const chunkIds = this.data.slice(sliceStart, sliceEnd);
      let chunkX = chunkStartX;
      chunkIds.forEach(chunkId => {
        const chunk = this.chunks.find(chunk => chunk.id === chunkId);
        if (!chunk) throw new Error(`Could not find chunk with ID ${chunkId}`);
        if (!this.tileTexture) throw new Error(`Could not draw chunk: tile texture not loaded`);
        drawChunk(ctx, this.tileTexture, chunk, this.tiles, chunkX * CHUNK_SIZE, chunkY * CHUNK_SIZE);
        chunkX++;
      });
    }
  }

  static async loadFromFile(path: string) {
    const levelData: LevelImportData = await fetch(path).then(res => res.json());
    const level = new Level(levelData);
    console.log(`Loaded ${level.name}`)
    return level;
  }
}

export default Level;
