import React, { FC } from 'react';
import { EditorTab } from './reducers';

import TabBar from './components/TabBar/TabBar';
import LoadSave from './components/LoadSave/LoadSave';
import ChunkEditor from './components/ChunkEditor/ChunkEditor';
import LevelEditor from './components/LevelEditor/LevelEditor';
import TileEditor from './components/TileEditor/TileEditor';
import { useActiveTab } from './selectors';

const App: FC = () => {
  const activeTab = useActiveTab();

  const ActiveTabContent = () => {
    switch(activeTab) {
      case EditorTab.Tile: {
        return <TileEditor/>;
      }
      case EditorTab.Chunk: {
        return <ChunkEditor/>;
      }
      case EditorTab.LoadSave: {
        return <LoadSave />;
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