import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { TILE_SIZE } from '../../game/common';
import { updateTile } from '../../reducers';
import { useActiveTile } from '../../selectors';
import styles from './style.module.scss';

const ActiveHeightMap: FC = () => {
  const canRef = useRef<HTMLCanvasElement | null>(null);
  const activeTile = useActiveTile();
  const dispatch = useDispatch();

  const handleClick = (evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const rect = canRef.current?.getBoundingClientRect();
    if (!rect || !canRef.current || !activeTile) return;
    const clickX = Math.floor(canRef.current.width * (evt.clientX - rect.left) / rect.width);
    const clickY = TILE_SIZE - Math.floor(canRef.current.height * (evt.clientY - rect.top) / rect.height + 0.5);
    const newHeight = [...activeTile.height];
    newHeight[clickX] = clickY;
    dispatch(updateTile({
      id: activeTile?.id,
      height: newHeight
    }));
  };

  useEffect(() => {
    if (!activeTile) return;
    const ctx = canRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,TILE_SIZE,TILE_SIZE);
    ctx.fillStyle = 'white';
    activeTile.height.forEach((value, index) => {
      ctx.fillRect(index, TILE_SIZE - value, 1, value);
    });
  }, [
    activeTile
  ]);

  if (!activeTile) return null;

  return (
    <canvas ref={canRef}
      className={styles['active-height-map']}
      width={TILE_SIZE} height={TILE_SIZE}
      onClick={evt => handleClick(evt)}
    ></canvas>
  );
};

export default ActiveHeightMap;