import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from './store';
import { EditorTab } from './reducers';

import TabBar from './components/TabBar/TabBar';
import Importer from './components/Importer/Importer';
import ChunkEditor from './components/ChunkEditor/ChunkEditor';
import LevelEditor from './components/LevelEditor/LevelEditor';
import TileEditor from './components/TileEditor/TileEditor';

const App: FC = () => {
  const activeTab = useSelector((state: RootState) => state.editor.tab);

  const ActiveTabContent = () => {
    switch(activeTab) {
      case EditorTab.Tile: {
        return <TileEditor/>;
      }
      case EditorTab.Chunk: {
        return <ChunkEditor/>;
      }
      case EditorTab.LoadSave: {
        return <>
          <Importer />
        </>;
      }
      case EditorTab.Level:
      default: {
        return <LevelEditor/>;
      }
    }
  }

  return (
    <>
      <TabBar />
      <ActiveTabContent />
    </>
  );
};

export default App;