import { createAction, createReducer } from "@reduxjs/toolkit";
import { CHUNK_TILE_SIZE } from "../game/common";
import { ChunkData, LevelData, LevelImportData, TileData } from "./redux-types";

export enum EditorTab {
  Tile,
  Chunk,
  Level,
  LoadSave
}

// ACTION CREATORS

export const setTab = createAction<EditorTab, 'SET_TAB'>('SET_TAB');
export const loadLevelFromFile = createAction<LevelImportData, 'LOAD_LEVEL_FROM_FILE'>('LOAD_LEVEL_FROM_FILE');
export const setActiveTexture = createAction<number, 'SET_ACTIVE_TEXTURE'>('SET_ACTIVE_TEXTURE');
export const setActiveChunk = createAction<number, 'SET_ACTIVE_CHUNK'>('SET_ACTIVE_CHUNK');
export const setActiveTile = createAction<number, 'SET_ACTIVE_TILE'>('SET_ACTIVE_TILE');

export const addNewTile = createAction<Partial<TileData> | undefined, 'ADD_NEW_TILE'>('ADD_NEW_TILE');
export const deleteTile = createAction<number, 'DELETE_TILE'>('DELETE_TILE');
export const updateTile = createAction<Partial<TileData>, 'UPDATE_TILE'>('UPDATE_TILE');

export const addNewChunk = createAction<Partial<ChunkData> | undefined, 'ADD_NEW_CHUNK'>('ADD_NEW_CHUNK');
export const deleteChunk = createAction<number, 'DELETE_CHUNK'>('DELETE_CHUNK');
export const updateChunk = createAction<Partial<ChunkData>, 'UPDATE_CHUNK'>('UPDATE_CHUNK');

// EDITOR

type EditorState = {
  tab: EditorTab,
  activeTile: number | null,
  activeTexture: number | null,
  activeChunk: number | null,
};

const initialEditor: EditorState = {
  tab: EditorTab.LoadSave,
  activeTile: null,
  activeTexture: 0,
  activeChunk: null,
};

export const editorReducer = createReducer(initialEditor, builder => {
  builder.addCase(setTab, (state, action) => {
    state.tab = action.payload;
  });

  builder.addCase(setActiveTile, (state, action) => {
    state.activeTile = action.payload;
  });

  builder.addCase(setActiveTexture, (state, action) => {
    if (state.activeTexture == action.payload) {
      state.activeTexture = null;
    } else {
      state.activeTexture = action.payload;
    }
  });

  builder.addCase(setActiveChunk, (state, action) => {
    state.activeChunk = action.payload;
  });
});

// TILES

const initialTiles: TileData[] = [];

export const tilesReducer = createReducer(initialTiles, builder => {
  builder.addCase(loadLevelFromFile, (state, action) => {
    return action.payload.tiles;
  });

  builder.addCase(updateTile, (state, action) => {
    const tileIndex = state.findIndex(tile => tile.id === action.payload.id);
    if (tileIndex > -1) {
      state[tileIndex] = {...state[tileIndex], ...action.payload};
    }
  });

  builder.addCase(addNewTile, (state, action) => {
    const highestID = Math.max(...state.map(tile => tile.id));
    state.push({
      height: new Array(16).fill(0),
      hFlip: false,
      vFlip: false,
      solid: [],
      angle: 0,
      textures: [0,0,0,0],
      ...action.payload,
      id: highestID + 1
    });
  });

  builder.addCase(deleteTile, (state, action) => {
    return state.filter(tile => tile.id !== action.payload);
  });
});

// CHUNKS

const initialChunks: ChunkData[] = [];

export const chunksReducer = createReducer(initialChunks, builder => {
  builder.addCase(loadLevelFromFile, (state, action) => {
    return action.payload.chunks;
  });

  builder.addCase(addNewChunk, (state, action) => {
    const highestID = Math.max(...state.map(chunk => chunk.id));
    state.push({
      tiles: new Array(CHUNK_TILE_SIZE * CHUNK_TILE_SIZE).fill(0),
      ...action.payload,
      id: highestID + 1
    });
  });

  builder.addCase(deleteChunk, (state, action) => {
    return state.filter(chunk => chunk.id !== action.payload);
  });

  builder.addCase(updateChunk, (state, action) => {
    const chunkIndex = state.findIndex(chunk => chunk.id === action.payload.id);
    if (chunkIndex > -1) {
      state[chunkIndex] = {...state[chunkIndex], ...action.payload};
    }
  });

  // replace tiles with 0 if deleted
  builder.addCase(deleteTile, (state, action) => {
    return state.map(chunk => {
      if (chunk.tiles.includes(action.payload)) {
        chunk.tiles = chunk.tiles.map(tileId => {
          return tileId === action.payload ? 0 : tileId;
        });
      }
      return chunk;
    });
  });
});

// LEVEL

const initialLevel: LevelData = {
  name: 'My Level',
  width: 0,
  height: 0,
  startX: 0,
  startY: 0,
  tileSrc: '',
  data: []
};

export const levelReducer = createReducer(initialLevel, builder => {
  builder.addCase(loadLevelFromFile, (state, action) => {
    const { chunks, tiles, ...level } = action.payload;
    return level;
  });
});
