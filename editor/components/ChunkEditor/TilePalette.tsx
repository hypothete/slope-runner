import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTile } from '../../reducers';
import { RootState } from '../../store';
import TileSwatch from '../TileEditor/TileSwatch';
import styles from './style.module.scss';

const TilePalette: FC = () => {
  const allTiles = useSelector((state: RootState) => state.tiles);
  const activeTile = useSelector((state: RootState) =>  state.editor.activeTile);
  const dispatch = useDispatch();


  return (
    <ul className={styles.tilepalette}>
      {
        allTiles.map(tile => (
          <li key={tile.id} className={styles.paletteentry} onClick={() => { dispatch(setActiveTile(tile.id)) }}>
            <TileSwatch tile={tile} active={tile.id === activeTile} useControls={false} />
          </li>
        ))
      }
    </ul>
  );
};

export default TilePalette;