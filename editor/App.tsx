import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from './store';
import { EditorTab } from './reducers';
import TabBar from './components/TabBar/TabBar';

const App: FC = () => {
  const activeTab = useSelector((state: RootState) => state.editor.tab);

  const ActiveTabContent = () => {
    switch(activeTab) {
      case EditorTab.Chunk: {
        return <p>Chunk editor</p>;
      }
      case EditorTab.Tile: {
        return <p>Tile editor</p>;
      }
      case EditorTab.Export: {
        return <p>Exporter</p>;
      }
      case EditorTab.Level:
      default: {
        return <p>Level editor</p>;
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