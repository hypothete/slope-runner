import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../store';
import { EditorTab } from '../../reducers';

import styles from './style.module.sass';

const TabBar: FC = () => {
  const activeTab = useSelector((state: RootState) => state.editor.tab);

  const tabs = [
    {
      label: 'Tile',
      value: EditorTab.Tile
    },
    {
      label: 'Chunk',
      value: EditorTab.Chunk
    },
    {
      label: 'Level',
      value: EditorTab.Level
    },
    {
      label: 'Export',
      value: EditorTab.Export
    }
  ]

  return (
    <ul className={styles.tabbar}>
      {
        tabs.map(tab => (<li className={`${styles.tab} ${tab.value === activeTab ? styles.tab.active : ''}`}>{tab.label}</li>))
      }
    </ul>
  );
};

export default App;