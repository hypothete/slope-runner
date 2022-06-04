import React, { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { drawChunk } from '../../../common/drawing';
import { CHUNK_SIZE } from '../../../game/common';
import { useTextureImage } from '../../hooks';
import { addNewChunk, deleteChunk } from '../../reducers';
import { ChunkData } from '../../redux-types';
import { RootState } from '../../store';
import styles from './style.module.scss';

type ChunkSwatchProps = {
  chunk: ChunkData,
  active: boolean,
  useControls: boolean,
};

const ChunkSwatch: FC<ChunkSwatchProps> = ({ chunk, active, useControls }) => {
  const canRef = useRef<HTMLCanvasElement | null>(null);
  const tileTextureImage = useTextureImage();
  const allTiles = useSelector((state: RootState) => state.tiles);
  const dispatch = useDispatch();

  const handleCopy = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    evt.stopPropagation();
    dispatch(addNewChunk(chunk));
  };
  const handleDelete = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    evt.stopPropagation();
    dispatch(deleteChunk(chunk.id));
  };

  useEffect(() => {
    if (!tileTextureImage) return;
    const ctx = canRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, CHUNK_SIZE, CHUNK_SIZE);
    drawChunk(ctx, tileTextureImage, chunk, allTiles, 0, 0);
  }, [
    tileTextureImage
  ]);

  return (
    <div className={styles.swatch}>
      <canvas className={[styles['swatch-canvas'], active ? styles.active : ''].join(' ')} ref={canRef} width={CHUNK_SIZE} height={CHUNK_SIZE}></canvas>
      {
        useControls && (
          <>
            {
              chunk.id !== 0 && (
                <button className={styles['swatch-button']} title={`Delete`} onClick={(evt) => handleDelete(evt)}>🗑</button>
              )
            }
            <button className={styles['swatch-button']} title={`Copy`} onClick={(evt) => handleCopy(evt)}>👯‍♀️</button>
          </>
        )
      }
    </div>
  );
};

export default ChunkSwatch;