import {
  Direction
} from '../common';

type TileData = {
  id: number;
  height: number[]; // height map
  hFlip: boolean;   // used for reading heights and drawing tile
  vFlip: boolean;
  angle: number;
  solid: Direction[];
  textures: number[];
}

type ChunkData = {
  id: number;
  tiles: number[];
}

type LevelData = {
  name: string;
  width: number; // width and height are in chunks
  height: number;
  startX: number;
  startY: number;
  tileSrc: string;
  data: number[]; // chunk ID array
}

interface LevelImportData extends LevelData {
  chunks: ChunkData[];
  tiles: TileData[];
}