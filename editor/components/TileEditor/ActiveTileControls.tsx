import React, { FC, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { drawTile } from '../../../common/drawing';
import { Direction, TILE_SIZE } from '../../../game/common';
import { useTextureImage } from '../../hooks';
import { updateTile } from '../../reducers';
import { TileData } from '../../redux-types';
import { RootState } from '../../store';
import ActiveHeightMap from './ActiveHeightMap';
import styles from './style.module.scss';

const ActiveTileControls: FC = () => {
  const canRef = useRef<HTMLCanvasElement | null>(null);
  const activeTile = useSelector((state: RootState) => {
    const { activeTile } = state.editor;
    return state.tiles.find(tile => tile.id === activeTile);
  });
  const tileTextureImage = useTextureImage();
  const dispatch = useDispatch();
  const updateTileValue = (partial: Partial<TileData>) => {
    dispatch(updateTile({ id: activeTile?.id, ...partial}));
  };

  useEffect(() => {
    if (!(tileTextureImage && activeTile)) return;
    const ctx = canRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0,0,TILE_SIZE,TILE_SIZE);
    drawTile(ctx, tileTextureImage, activeTile, 0, 0);

  }, [
    tileTextureImage, activeTile
  ]);

  if (!activeTile) return null;

  const solid = {
    up: activeTile.solid.includes(Direction.Up),
    right: activeTile.solid.includes(Direction.Right),
    down: activeTile.solid.includes(Direction.Down),
    left: activeTile.solid.includes(Direction.Left),
  }

  const updateSolid = (direction: Direction, value: boolean) => {
    if (value) {
      updateTileValue({ solid: [...new Set([...activeTile.solid, direction])] });
    } else {
      updateTileValue({ solid: activeTile.solid.filter(dir => dir !== direction) })
    }
  };

  return (
    <div className={styles['active-tile-controls']}>
      <canvas className={styles.preview} ref={canRef} width={TILE_SIZE} height={TILE_SIZE}></canvas>
      <div className={styles.properties} >
        <b>{`Tile ${activeTile.id}`}</b>
        <div>
          <label>
            hFlip
            <input type="checkbox"
              checked={activeTile.hFlip}
              onChange={evt => { updateTileValue({ hFlip: evt.target.checked }); }}
            />
          </label>
          <label>
            vFlip
            <input type="checkbox"
              checked={activeTile.vFlip}
              onChange={evt => { updateTileValue({ vFlip: evt.target.checked }); }}
            />
          </label>
        </div>
        <label>
          Angle
          <input type="number"
            min="0" max="360"
            value={activeTile.angle * 180 / Math.PI}
            onChange={evt => { updateTileValue({ angle: Number(evt.target.value) * Math.PI / 180 }); }}
          />
        </label>
        <div>
          <b>Solid</b>
          <br/>
          <label>
            Up
            <input type="checkbox"
              checked={solid.up}
              onChange={evt => { updateSolid(Direction.Up, evt.target.checked); }}
            />
          </label>
          <label>
            Right
            <input type="checkbox"
              checked={solid.right}
              onChange={evt => { updateSolid(Direction.Right, evt.target.checked); }}
            />
          </label>
          <label>
            Down
            <input type="checkbox"
              checked={solid.down}
              onChange={evt => { updateSolid(Direction.Down, evt.target.checked); }}
            />
          </label>
          <label>
            Left
            <input type="checkbox"
              checked={solid.left}
              onChange={evt => { updateSolid(Direction.Left, evt.target.checked); }}
            />
          </label>
        </div>
      </div>
      <div className={styles['height-container']}>
        <ActiveHeightMap />
      </div>
      <div className={styles.textures}>textures</div>
    </div>
  );
};

export default ActiveTileControls;