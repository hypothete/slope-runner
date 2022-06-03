export const SCREEN_WIDTH = 320;
export const SCREEN_HEIGHT = 224;

export const TILE_SIZE =  16;
export const HALF_TILE =  TILE_SIZE / 2;
export const CHUNK_SIZE = 128;
export const CHUNK_TILE_SIZE = 8;

export interface Positioned {
  x: number;
  y: number;
}
export enum Direction {
  Up,
  Right,
  Down,
  Left,
}

export const GRAVITY = 0.5;