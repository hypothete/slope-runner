import React, { FC } from 'react';

import { useLevelImportData } from '../../selectors';

import styles from './style.module.scss';

const Exporter: FC = () => {
  const levelData = useLevelImportData();
  const levelBlob = new Blob([JSON.stringify(levelData, null, 2)], {type: 'application/json'});

  return (
    <div className={styles.exporter}>
      <b>Click to download</b>
      <br />
      <a download={`${levelData.name}.json`} href={URL.createObjectURL(levelBlob)}>{`${levelData.name}.json`}</a>
    </div>
  );
};

export default Exporter;