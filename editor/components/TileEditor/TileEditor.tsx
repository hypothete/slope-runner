import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import ActiveTileControls from './ActiveTileControls';
import TileSwatch from './TileSwatch';
import styles from './style.module.scss';
import { setActiveTile } from '../../reducers';

const TileEditor: FC = () => {
  const tiles = useSelector((state: RootState) => state.tiles);
  const activeTile = useSelector((state: RootState) => state.editor.activeTile);
  const dispatch = useDispatch();

  return (
    <div className={styles.editor}>
      <p>Tile Editor</p>

      <ActiveTileControls />

      <ul className={styles.tilelist}>
          <li>Add tile</li>
        {
          tiles.map(tile => (
            <li key={tile.id} onClick={() => dispatch(setActiveTile(tile.id))}>
              <TileSwatch tile={tile} active={tile.id === activeTile} />
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default TileEditor;