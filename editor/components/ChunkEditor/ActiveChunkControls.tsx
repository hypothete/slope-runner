import React, { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { drawChunk } from '../../../common/drawing';
import { CHUNK_SIZE, CHUNK_TILE_SIZE } from '../../../game/common';
import { useTextureImage } from '../../hooks';
import { updateChunk } from '../../reducers';
import { ChunkData } from '../../redux-types';
import { RootState } from '../../store';
import styles from './style.module.scss';
import TilePalette from './TilePalette';

const ActiveChunkControls: FC = () => {
  const canRef = useRef<HTMLCanvasElement | null>(null);
  const activeChunk = useSelector((state: RootState) => {
    const { activeChunk } = state.editor;
    return state.chunks.find(chunk => chunk.id === activeChunk);
  });
  const activeTile = useSelector((state: RootState) => {
    return state.editor.activeTile;
  });
  const allTiles = useSelector((state: RootState) => state.tiles);
  const tileTextureImage = useTextureImage();
  const dispatch = useDispatch();
  const updateChunkValue = (partial: Partial<ChunkData>) => {
    dispatch(updateChunk({ id: activeChunk?.id, ...partial }));
  };

  useEffect(() => {
    if (!(tileTextureImage && activeChunk)) return;
    const ctx = canRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, CHUNK_SIZE, CHUNK_SIZE);
    drawChunk(ctx, tileTextureImage, activeChunk, allTiles, 0, 0);
  }, [
    tileTextureImage, activeChunk
  ]);

  if (!activeChunk) return null;

  const handlePreviewClick = (evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const rect = canRef.current?.getBoundingClientRect();
    if (!rect || !canRef.current || activeChunk == null || activeTile === null) return;
    const clickX = Math.floor(CHUNK_TILE_SIZE * (evt.clientX - rect.left) / (4 * CHUNK_SIZE));
    const clickY = Math.floor(CHUNK_TILE_SIZE * (evt.clientY - rect.top) / (4 * CHUNK_SIZE));
    let newTiles = [...activeChunk.tiles];
    newTiles[clickY * CHUNK_TILE_SIZE + clickX] = activeTile;
    updateChunkValue({ tiles: newTiles })
  };

  return (
    <div className={styles['active-chunk-controls']}>
      <canvas className={styles.preview}
        ref={canRef} 
        width={CHUNK_SIZE}
        height={CHUNK_SIZE}
        onClick={evt => handlePreviewClick(evt)}>
      </canvas>
      <div className={styles.activetile}>
        <b>Active tile</b>
        <br />
        <TilePalette />
      </div>
    </div>
  );
};

export default ActiveChunkControls;