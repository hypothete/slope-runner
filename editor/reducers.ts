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

// EDITOR

type EditorState = {
  tab: EditorTab,
};

const initialEditor: EditorState = {
  tab: EditorTab.LoadSave
};

export const editorReducer = createReducer(initialEditor, builder => {
  builder.addCase(setTab, (state, action) => {
    state.tab = action.payload;
  });
});

// TILES

const initialTiles: TileData[] = [];

export const tilesReducer = createReducer(initialTiles, builder => {
  builder.addCase(loadLevelFromFile, (state, action) => {
    return action.payload.tiles;
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
