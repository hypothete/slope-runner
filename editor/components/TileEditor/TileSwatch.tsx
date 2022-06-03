import React, { FC, useEffect, useRef } from 'react';
import { drawTile } from '../../../common/drawing';
import { TILE_SIZE } from '../../../game/common';
import { useTextureImage } from '../../hooks';
import { TileData } from '../../redux-types';
import styles from './style.module.scss';

type TileSwatchProps = {
  tile: TileData,
  active: boolean
};

const TileEditor: FC<TileSwatchProps> = ({ tile, active }) => {
  const canRef = useRef<HTMLCanvasElement | null>(null);
  const tileTextureImage = useTextureImage();

  useEffect(() => {
    if (!tileTextureImage) return;
    const ctx = canRef.current?.getContext('2d');
    if (!ctx) return;
    drawTile(ctx, tileTextureImage, tile, 0, 0);
  }, [
    tileTextureImage
  ]);

  return (
    <canvas className={[styles.swatch, active ? styles.active : ''].join(' ')} ref={canRef} width={TILE_SIZE} height={TILE_SIZE}></canvas>
  );
};

export default TileEditor;