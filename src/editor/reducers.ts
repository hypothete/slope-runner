import { createAction, createReducer } from "@reduxjs/toolkit";
import { ChunkData, LevelData, TileData } from "./redux-types";

export enum EditorTab {
  Tile,
  Chunk,
  Level,
  Export
}

type EditorState = {
  tab: EditorTab,
};

const initialEditor: EditorState = {
  tab: EditorTab.Level
};

const setTab = createAction<EditorTab, 'SET_TAB'>('SET_TAB');

export const editorReducer = createReducer(initialEditor, builder => {
  builder.addCase(setTab, (state, action) => {
    state.tab = action.payload;
  });
});

const initialTiles: TileData[] = [];

export const tilesReducer = createReducer(initialTiles, builder => {

});

const initialChunks: ChunkData[] = [];

export const chunksReducer = createReducer(initialChunks, builder => {

});

const initialLevel: LevelData = {
  name: 'My Level',
  width: 0,
  height: 0,
  startX: 0,
  startY: 0,
  tileSrc: '',
  chunks: []
};

export const levelReducer = createReducer(initialLevel, builder => {

});