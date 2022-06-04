import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import ActiveTileControls from './ActiveTileControls';
import TileSwatch from './TileSwatch';
import styles from './style.module.scss';
import { addNewTile, setActiveTile } from '../../reducers';

const TileEditor: FC = () => {
  const tiles = useSelector((state: RootState) => state.tiles);
  const activeTile = useSelector((state: RootState) => state.editor.activeTile);
  const dispatch = useDispatch();

  return (
    <div className={styles.editor}>

      <ActiveTileControls />

      <ul className={styles.tilelist}>
          <li>
            <button onClick={() => { dispatch(addNewTile()); }}>
              Add tile
            </button>
          </li>
        {
          tiles.map(tile => (
            <li key={tile.id} onClick={() => dispatch(setActiveTile(tile.id))}>
              <TileSwatch tile={tile} active={tile.id === activeTile} useControls />
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default TileEditor;