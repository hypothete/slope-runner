import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { drawTile } from '../../../common/drawing';
import { TILE_SIZE } from '../../../game/common';
import { useTextureImage } from '../../hooks';
import { addNewTile, deleteTile } from '../../reducers';
import { TileData } from '../../redux-types';
import styles from './style.module.scss';

type TileSwatchProps = {
  tile: TileData,
  active: boolean,
  useControls: boolean
};

const TileSwatch: FC<TileSwatchProps> = ({ tile, active, useControls }) => {
  const canRef = useRef<HTMLCanvasElement | null>(null);
  const tileTextureImage = useTextureImage();
  const dispatch = useDispatch();

  const handleCopy = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    evt.stopPropagation();
    dispatch(addNewTile(tile));
  };
  const handleDelete = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    evt.stopPropagation();
    dispatch(deleteTile(tile.id));
  };

  useEffect(() => {
    if (!tileTextureImage) return;
    const ctx = canRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, TILE_SIZE, TILE_SIZE);
    drawTile(ctx, tileTextureImage, tile, 0, 0);
  }, [
    tileTextureImage
  ]);

  return (
    <div className={styles.swatch}>
      <canvas className={[styles['swatch-canvas'], active ? styles.active : ''].join(' ')} ref={canRef} width={TILE_SIZE} height={TILE_SIZE}></canvas>
      {
        useControls && (
          <>
            <button className={styles['swatch-button']} title={`Delete`} onClick={(evt) => handleDelete(evt)}>🗑</button>
            <button className={styles['swatch-button']} title={`Copy`} onClick={(evt) => handleCopy(evt)}>👯‍♀️</button>
          </>
        )
      }
    </div>
  );
};

export default TileSwatch;