import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { HALF_TILE } from '../../../game/common';
import { useTextureImage } from '../../hooks';
import { setActiveTexture } from '../../reducers';
import { useActiveTexture } from '../../selectors';
import styles from './style.module.scss';

const SCALE_FACTOR = 4;

const TexturePalette: FC = () => {
  const canRef = useRef<HTMLCanvasElement | null>(null);
  const tileTextureImage = useTextureImage();
  const activeTexture = useActiveTexture();
  const dispatch = useDispatch();

  const handleClick = (evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const rect = canRef.current?.getBoundingClientRect();
    if (!rect || !canRef.current) return;
    const clickX = Math.floor((evt.clientX - rect.left) / (SCALE_FACTOR * HALF_TILE));
    dispatch(setActiveTexture(clickX));
  };

  useEffect(() => {
    if (!tileTextureImage || !canRef.current) return;
    const ctx = canRef.current.getContext('2d');
    if (!ctx) return;
    canRef.current.width = tileTextureImage.width + 2;
    canRef.current.height = tileTextureImage.height + 2;
    canRef.current.style.width = `${SCALE_FACTOR * tileTextureImage.width + 2}px`;
    canRef.current.style.height = `${SCALE_FACTOR * tileTextureImage.height + 2}px`;
    ctx.drawImage(tileTextureImage,1, 1);
    if (activeTexture !== null) {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.strokeRect(activeTexture * HALF_TILE + 0.5, 0.5, HALF_TILE + 1, HALF_TILE + 1);
    }
  }, [
    tileTextureImage, activeTexture
  ]);

  return (
    <canvas
      className={styles['texture-palette']}
      ref={canRef}
      onClick={evt => handleClick(evt)}
    ></canvas>
  );
};

export default TexturePalette;