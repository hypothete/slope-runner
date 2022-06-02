import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from './store';
import { EditorTab } from './reducers';
import TabBar from './components/TabBar/TabBar';
import Importer from './components/Importer/Importer';

const App: FC = () => {
  const activeTab = useSelector((state: RootState) => state.editor.tab);

  const ActiveTabContent = () => {
    switch(activeTab) {
      case EditorTab.Tile: {
        return <p>Tile editor</p>;
      }
      case EditorTab.Chunk: {
        return <p>Chunk editor</p>;
      }
      case EditorTab.LoadSave: {
        return <>
          <Importer />
        </>;
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