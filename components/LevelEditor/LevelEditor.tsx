import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { CHUNK_SIZE } from '../../game/common';
import { setActiveChunk, updateLevel } from '../../reducers';
import { LevelData } from '../../redux-types';
import { useChunks, useActiveChunk, useLevel } from '../../selectors';
import ChunkSwatch from '../ChunkEditor/ChunkSwatch';
import LevelPreview from './LevelPreview';
import styles from './style.module.scss';

const LevelEditor: FC = () => {
  const chunks = useChunks();
  const activeChunk = useActiveChunk();
  const level = useLevel();
  const dispatch = useDispatch();

  const updateLevelData = (partial: Partial<LevelData>) => {
    dispatch(updateLevel({ ...partial }));
  };

  return (
    <div className={styles.editor}>
      <LevelPreview />

      <div className={styles.properties}>
        <b>Level Properties</b>
        <label>
          <input type="text" value={level.name}
            onChange={evt => updateLevelData({ name: evt.target.value })} />
          Name
        </label>
        <div>
          <label>
            <input type="number" value={level.width}
              min={4} max={40} step={1}
              onChange={evt => updateLevelData({ width: Number(evt.target.value) })} />
            Chunk Width
          </label>
          <label>
            <input type="number" value={level.height}
              min={4} max={40} step={1}
              onChange={evt => updateLevelData({ height: Number(evt.target.value) })} />
            Chunk Height
          </label>
        </div>
        <b>Start position</b>
        <div>
          <label>
            <input type="number" value={level.startX}
              min={0} max={level.width * CHUNK_SIZE} step={8}
              onChange={evt => updateLevelData({ startX: Number(evt.target.value) })} />
            X
          </label>
          <label>
            <input type="number" value={level.startY}
              min={0} max={level.height * CHUNK_SIZE} step={8}
              onChange={evt => updateLevelData({ startY: Number(evt.target.value) })} />
            Y
          </label>
        </div>
      </div>

      <ul className={styles.chunklist}>
        {
          chunks.map(chunk => (
            <li key={chunk.id} onClick={() => dispatch(setActiveChunk(chunk.id))}>
              <ChunkSwatch chunk={chunk} active={chunk.id === activeChunk?.id} useControls={false} />
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default LevelEditor;