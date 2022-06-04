import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { EditorTab, setTab } from '../../reducers';
import { useActiveTab } from '../../selectors';
import styles from './style.module.scss';

const TabBar: FC = () => {
  const activeTab = useActiveTab();
  const dispatch = useDispatch();

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
      label: 'Load/Save',
      value: EditorTab.LoadSave
    }
  ]

  return (
    <ul className={styles.tabbar}>
      {
        tabs.map(tab => (
        <li
          key={tab.label}
          className={`${styles.tab} ${tab.value === activeTab ? styles.active : ''}`}
          onClick={() => { dispatch(setTab(tab.value)) }}
          >
          {tab.label}
        </li>
      ))
      }
    </ul>
  );
};

export default TabBar;