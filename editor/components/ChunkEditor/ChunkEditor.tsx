import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewChunk, setActiveChunk } from '../../reducers';
import { RootState } from '../../store';
import ActiveChunkControls from './ActiveChunkControls';
import ChunkSwatch from './ChunkSwatch';
import styles from './style.module.scss';

const ChunkEditor: FC = () => {
  const chunks = useSelector((state: RootState) => state.chunks);
  const activeChunk = useSelector((state: RootState) => state.editor.activeChunk);
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
              <ChunkSwatch chunk={chunk} active={chunk.id === activeChunk} useControls />
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default ChunkEditor;