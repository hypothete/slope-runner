import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store';
import { EditorTab, setTab } from '../../reducers';

import styles from './style.module.scss';

const TabBar: FC = () => {
  const activeTab = useSelector((state: RootState) => state.editor.tab);
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
      label: 'Export',
      value: EditorTab.Export
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