import React, { FC } from 'react';

import Exporter from './Exporter';
import Importer from './Importer';

import styles from './style.module.scss';

const LoadSave: FC = () => {
  return (
  <div className={styles.loadsave}>
    <Importer />
    <Exporter />
  </div>
  );
};

export default LoadSave;