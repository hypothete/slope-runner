export const SCREEN_WIDTH = 320;
export const SCREEN_HEIGHT = 224;

export const TILE_SIZE =  16;
export const CHUNK_SIZE = 128;
export const CHUNK_TILE_SIZE = 8;

export interface Positioned {
  x: number;
  y: number;
}
export enum Direction {
  Down,
  Right,
  Left,
  Up,
}

export const GRAVITY = 0.5;