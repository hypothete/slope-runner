import React, { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { drawTile } from '../../../common/drawing';
import { TILE_SIZE } from '../../../game/common';
import { useTextureImage } from '../../hooks';
import { RootState } from '../../store';
import styles from './style.module.scss';

const ActiveTileControls: FC = () => {
  const canRef = useRef<HTMLCanvasElement | null>(null);
  const activeTile = useSelector((state: RootState) => {
    const { activeTile } = state.editor;
    return state.tiles.find(tile => tile.id === activeTile);
  });
  const tileTextureImage = useTextureImage();

  useEffect(() => {
    if (!(tileTextureImage && activeTile)) return;
    const ctx = canRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0,0,TILE_SIZE,TILE_SIZE);
    drawTile(ctx, tileTextureImage, activeTile, 0, 0);

  }, [
    tileTextureImage, activeTile
  ]);

  return (
    <div className={styles['active-tile-controls']}>
      <canvas className={styles.preview} ref={canRef} width={TILE_SIZE} height={TILE_SIZE}></canvas>
      <div className={styles.properties} >Properties</div>
      <div className={styles.textures}>textures</div>
    </div>
  );
};

export default ActiveTileControls;