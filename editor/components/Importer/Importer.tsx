import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { loadLevelFromFile } from '../../reducers';
import { LevelImportData } from '../../redux-types';

import styles from './style.module.scss';

const Importer: FC = () => {
  const dispatch = useDispatch();

  const handleFile = async (files: FileList | null) => {
    if (!files) return;
    const file = files.item(0);
    if (!file || file.type !== 'application/json') return;
    const fileText = await file.text();
    const levelImportData: LevelImportData = JSON.parse(fileText);
    dispatch(loadLevelFromFile(levelImportData))
  };

  return (
    <div className={styles.importer}>
      <p>Select a file to import</p>
      <input type="file" onChange={(evt) => handleFile(evt.target.files)} />
    </div>
  );
};

export default Importer;