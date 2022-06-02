import { Direction } from './common';
import Level, { Chunk, Tile } from './level';

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
    new Tile({
      height: [16, 16, 15, 15, 14, 14, 13, 13, 12, 12, 11, 11, 10, 10, 9, 9],
      hFlip: true,
      vFlip: false,
      angle: Math.PI / 8,
      solid: [Direction.Down, Direction.Up, Direction.Left, Direction.Right],
      textures: [3,4,1,1]
    }),
    new Tile({
      height: [8, 8, 7, 7, 6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1],
      hFlip: true,
      vFlip: false,
      angle: Math.PI / 8,
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
    new Chunk({
      tiles: [
        0, 0, 0, 0, 0, 0, 5, 4,
        0, 0, 0, 0, 5, 4, 1, 1,
        0, 0, 5, 4, 1, 1, 1, 1,
        5, 4, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
      ]
    }),

    new Chunk({
      tiles: [
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1,
      ]
    }),

    new Chunk({
      tiles: [
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        2, 3, 0, 0, 0, 0, 0, 0,
        1, 1, 2, 3, 0, 0, 0, 0,
        1, 1, 1, 1, 2, 3, 0, 0,
        1, 1, 1, 1, 1, 1, 2, 3,
      ]
    }),
    new Chunk({
      tiles: [
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 5, 4,
        0, 0, 0, 0, 5, 4, 1, 1,
        0, 0, 5, 4, 1, 1, 1, 1,
        5, 4, 1, 1, 1, 1, 1, 1,
      ]
    }),

  ],
  data: [ // 6 x 10
    1, 0, 0, 0, 0, 0, 0, 0, 0, 6,
    1, 1, 2, 5, 0, 0, 3, 1, 1, 1,
    1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
    1, 0, 0, 0, 0, 0, 6, 4, 1, 1,
    1, 0, 0, 6, 3, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ]
});

export default demoLevel;
