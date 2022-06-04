import React, { FC, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { drawTile } from '../../game/drawing';
import { Direction, HALF_TILE, TILE_SIZE } from '../../game/common';
import { useTextureImage } from '../../hooks';
import { updateTile } from '../../reducers';
import { TileData } from '../../redux-types';
import { useActiveTile, useActiveTexture } from '../../selectors';
import ActiveHeightMap from './ActiveHeightMap';
import styles from './style.module.scss';
import TexturePalette from './TexturePalette';

const ActiveTileControls: FC = () => {
  const canRef = useRef<HTMLCanvasElement | null>(null);
  const activeTile = useActiveTile();
  const activeTexture = useActiveTexture();
  const tileTextureImage = useTextureImage();
  const dispatch = useDispatch();
  const updateTileValue = (partial: Partial<TileData>) => {
    dispatch(updateTile({ id: activeTile?.id, ...partial }));
  };

  useEffect(() => {
    if (!(tileTextureImage && activeTile)) return;
    const ctx = canRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, TILE_SIZE, TILE_SIZE);
    drawTile(ctx, tileTextureImage, activeTile, 0, 0);

  }, [
    tileTextureImage, activeTile
  ]);

  if (!activeTile) return <p>
  <b>Pick a tile to edit</b>
</p>;

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

  const handlePreviewClick = (evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const rect = canRef.current?.getBoundingClientRect();
    if (!rect || !canRef.current || activeTexture == null) return;
    const clickX = Math.floor((evt.clientX - rect.left) / (24 * HALF_TILE));
    const clickY = Math.floor((evt.clientY - rect.top) / (24 * HALF_TILE));
    let newTextures = [...activeTile.textures];
    newTextures[clickY * 2 + clickX] = activeTexture;
    updateTileValue({ textures: newTextures })
  };

  return (
    <div className={styles['active-tile-controls']}>
      <canvas className={styles.preview}
        ref={canRef} 
        width={TILE_SIZE}
        height={TILE_SIZE}
        onClick={evt => handlePreviewClick(evt)}>
      </canvas>
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
          <input type="range"
            value={activeTile.angle * 180 / Math.PI}
            min={0} max={360} step={22.5}
            onChange={evt => { updateTileValue({ angle: Number(evt.target.value) * Math.PI / 180 }); }}
          />
          {`${(activeTile.angle * 180 / Math.PI).toFixed(1)}`}
        </label>
        <div>
          <b>Solid</b>
          <br />
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
        <b>Height map</b>
        <ActiveHeightMap />
      </div>
      <div>
        <b>Active texture</b>
        <br />
        <div className={styles.textures}>
          <TexturePalette />
        </div>
      </div>
    </div>
  );
};

export default ActiveTileControls;