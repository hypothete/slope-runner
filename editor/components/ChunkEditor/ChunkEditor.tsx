import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ChunkEditor: FC = () => {
  const chunks = useSelector((state: RootState) => state.chunks);

  return (
    <div>
      <p>Chunk Editor</p>
      <ul>
          <li>Add chunk</li>
        {
          chunks.map(chunk => (
            <li key={chunk.id}>
              {JSON.stringify(chunk)}
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default ChunkEditor;