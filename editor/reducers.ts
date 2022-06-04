import { createAction, createReducer } from "@reduxjs/toolkit";
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
export const setActiveTile = createAction<number, 'SET_ACTIVE_TILE'>('SET_ACTIVE_TILE');
export const updateTile = createAction<Partial<TileData>, 'UPDATE_TILE'>('UPDATE_TILE');
export const addNewTile = createAction<undefined, 'ADD_NEW_TILE'>('ADD_NEW_TILE');
export const setActiveTexture = createAction<number, 'SET_ACTIVE_TEXTURE'>('SET_ACTIVE_TEXTURE');

// EDITOR

type EditorState = {
  tab: EditorTab,
  activeTile: number | null,
  activeTexture: number | null,
};

const initialEditor: EditorState = {
  tab: EditorTab.LoadSave,
  activeTile: null,
  activeTexture: 0
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

  builder.addCase(addNewTile, (state) => {
    let newId = 0;
    state.forEach(tile => {
      if (tile.id > newId) {
        newId = tile.id + 1;
      }
    });
    state.push({
      id: newId,
      height: new Array(16).fill(0),
      hFlip: false,
      vFlip: false,
      solid: [],
      angle: 0,
      textures: [0,0,0,0]
    })
  });
});

// CHUNKS

const initialChunks: ChunkData[] = [];

export const chunksReducer = createReducer(initialChunks, builder => {
  builder.addCase(loadLevelFromFile, (state, action) => {
    return action.payload.chunks;
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
