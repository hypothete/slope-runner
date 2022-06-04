import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import ActiveTileControls from './ActiveTileControls';
import TileSwatch from './TileSwatch';
import styles from './style.module.scss';
import { addNewTile, setActiveTile } from '../../reducers';
import { useActiveTile, useTiles } from '../../selectors';

const TileEditor: FC = () => {
  const tiles = useTiles();
  const activeTile = useActiveTile();
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
              <TileSwatch tile={tile} active={tile.id === activeTile?.id} useControls />
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default TileEditor;