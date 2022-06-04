import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { setActiveTile } from '../../reducers';
import { useActiveTile, useTiles } from '../../selectors';
import TileSwatch from '../TileEditor/TileSwatch';
import styles from './style.module.scss';

const TilePalette: FC = () => {
  const allTiles = useTiles();
  const activeTile = useActiveTile();
  const dispatch = useDispatch();


  return (
    <ul className={styles.tilepalette}>
      {
        allTiles.map(tile => (
          <li key={tile.id} className={styles.paletteentry} onClick={() => { dispatch(setActiveTile(tile.id)) }}>
            <TileSwatch tile={tile} active={tile.id === activeTile?.id} useControls={false} />
          </li>
        ))
      }
    </ul>
  );
};

export default TilePalette;