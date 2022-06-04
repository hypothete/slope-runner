import React, { FC, useEffect, useRef } from 'react';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../game/common';
import GameInstance from '../../game/app';

import styles from './style.module.scss';
import { useLevelImportData } from '../../selectors';

const Game: FC = () => {
  const canRef = useRef<HTMLCanvasElement | null>(null);
  const levelData = useLevelImportData();

  useEffect(() => {
    const levelBlob = new Blob([JSON.stringify(levelData, null, 2)], {type: 'application/json'});
    const levelURL = URL.createObjectURL(levelBlob);
    const game = new GameInstance([levelURL]);
    game.start();

    return () => {
      game.cleanup();
    };
  }, []);

  return (
    <canvas className={styles.game} ref={canRef} width={SCREEN_WIDTH} height={SCREEN_HEIGHT}></canvas>
  );
};

export default Game;