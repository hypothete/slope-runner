import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { drawChunk } from '../../game/drawing';
import { CHUNK_SIZE } from '../../game/common';
import { useTextureImage } from '../../hooks';
import { updateLevel } from '../../reducers';
import { LevelData } from '../../redux-types';
import { useLevel, useActiveChunk, useChunks, useTiles } from '../../selectors';
import styles from './style.module.scss';

const LevelPreview: FC = () => {
  const canRef = useRef<HTMLCanvasElement | null>(null);
  const activeChunk = useActiveChunk();
  const level = useLevel();
  const allTiles = useTiles();
  const allChunks = useChunks();
  const tileTextureImage = useTextureImage();
  const dispatch = useDispatch();

  const updateLevelChunk = (partial: Partial<LevelData>) => {
    dispatch(updateLevel({ ...partial }));
  };

  const LEVEL_WIDTH = level.width * CHUNK_SIZE;
  const LEVEL_HEIGHT = level.height * CHUNK_SIZE;

  useEffect(() => {
    if (!tileTextureImage || !canRef.current) return;
    const ctx = canRef.current.getContext('2d');
    if (!ctx) return;
    
    canRef.current.width = LEVEL_WIDTH;
    canRef.current.height = LEVEL_HEIGHT;

    // draw chunks
    level.data.forEach((id, index) => {
      const chunkX = CHUNK_SIZE * (index % level.width);
      const chunkY = CHUNK_SIZE * Math.floor(index / level.width);
      const chunkAt = allChunks.find(chunk => chunk.id === id);
      if (chunkAt) {
        drawChunk(ctx, tileTextureImage, chunkAt, allTiles, chunkX, chunkY);
      } else {
        ctx.fillStyle = 'red';
        ctx.fillRect(chunkX, chunkY, CHUNK_SIZE, CHUNK_SIZE);
      }
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.beginPath();
      const lineX = chunkX + 0.5;
      const lineY = chunkY + 0.5;
      ctx.moveTo(lineX, lineY);
      ctx.lineTo(lineX + CHUNK_SIZE, lineY);
      ctx.moveTo(lineX, lineY);
      ctx.lineTo(lineX, lineY + CHUNK_SIZE);
      ctx.stroke();
    });

    // draw start position
    ctx.fillStyle = 'rgba(255,0,64,0.5)';
    ctx.beginPath();
    ctx.arc(level.startX, level.startY, 32, 0, Math.PI * 2);
    ctx.fill();
    ctx.textAlign = 'center';
    ctx.fillStyle = 'white';
    ctx.fillText('Start', level.startX, level.startY);
  }, [
    tileTextureImage, level
  ]);

  const handlePreviewClick = (evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const rect = canRef.current?.getBoundingClientRect();
    if (!rect || !canRef.current || activeChunk == null) return;
    const clickX = Math.floor((evt.clientX - rect.left) / CHUNK_SIZE);
    const clickY = Math.floor((evt.clientY - rect.top) / CHUNK_SIZE);
    const newData = [...level.data];
    newData[clickX + clickY * level.width] = activeChunk.id;
    updateLevelChunk({data: newData});
  };

  return (
    <div className={styles.preview}>
      <canvas className={styles['preview-canvas']}
        ref={canRef} 
        width={CHUNK_SIZE}
        height={CHUNK_SIZE}
        onClick={evt => handlePreviewClick(evt)}>
      </canvas>
    </div>
  );
};

export default LevelPreview;