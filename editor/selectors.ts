import { useSelector } from 'react-redux';
import { RootState } from './store';

export const useActiveTab = () => useSelector((state: RootState) => state.editor.tab);

export const useActiveChunk = () => useSelector((state: RootState) => {
  const { activeChunk } = state.editor;
  return state.chunks.find(chunk => chunk.id === activeChunk) || null;
});

export const useActiveTile = () => useSelector((state: RootState) => {
  const { activeTile } = state.editor;
  return state.tiles.find(tile => tile.id === activeTile) || null;
});

export const useActiveTexture = () => useSelector((state: RootState) => {
  return state.editor.activeTexture;
});

export const useTiles = () => useSelector((state: RootState) => state.tiles);

export const useChunks = () => useSelector((state: RootState) => state.chunks);

