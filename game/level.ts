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
  id: number;
  height: number[];
  hFlip: boolean; // used for reading heights and drawing tile
  vFlip: boolean;
  angle: number;
  solid: Direction[];
  textures: number[];
}

export class Tile {
  id: number = -1;
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

export class Chunk {
  tiles = new Array(64);

  constructor(options: ChunkOptions) {
    Object.assign(this, options);
  }
}

interface LevelData {
  name: string;
  width: number;
  height: number;
  tiles: TileOptions[];
  chunks: ChunkOptions[];
  data: number[];
  startX: number;
  startY: number;
  tileSrc: string;
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
      // fall back to 0th tile in the set - probably empty
      return this.tiles[0];
    }
  }

  drawTile(ctx: CanvasRenderingContext2D, tile: Tile, x: number, y: number) {
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
        this.tileTexture &&
        texIndex * HALF_TILE < this.tileTexture.width
      ) {
        ctx.drawImage(
          this.tileTexture,
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

  static async loadFromFile(path: string) {
    const levelData: LevelData = await fetch(path).then(res => res.json());
    const tiles = levelData.tiles.map(tileData => {
      return new Tile(tileData);
    });
    const chunks = levelData.chunks.map(chunkData => {
      return new Chunk(chunkData);
    });
    const level = new Level({
      ...levelData,
      tiles,
      chunks
    });
    console.log(`Loaded ${level.name}`)
    return level;
  }
}

export default Level;
