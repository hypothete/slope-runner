import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { addNewChunk, setActiveChunk } from '../../reducers';
import { useActiveChunk, useChunks } from '../../selectors';
import ActiveChunkControls from './ActiveChunkControls';
import ChunkSwatch from './ChunkSwatch';
import styles from './style.module.scss';

const ChunkEditor: FC = () => {
  const chunks = useChunks();
  const activeChunk = useActiveChunk();
  const dispatch = useDispatch();

  return (
    <div className={styles.editor}>

      <ActiveChunkControls />

      <ul className={styles.chunklist}>
        <li>
          <button onClick={() => { dispatch(addNewChunk()); }}>
            Add chunk
          </button>
        </li>
        {
          chunks.map(chunk => (
            <li key={chunk.id} onClick={() => dispatch(setActiveChunk(chunk.id))}>
              <ChunkSwatch chunk={chunk} active={chunk.id === activeChunk?.id} useControls />
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default ChunkEditor;