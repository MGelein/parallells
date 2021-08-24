import { useState } from 'react';
import Nav from './Nav';
import Content from './Content';
import DataContext from './DataContext';

import './App.scss';

function App() {
  const [mode, setMode] = useState('filepicker');

  return (
    <div className="app">
      <DataContext.Provider value={{ mode, setMode }}>
        <Nav />
        <Content />
      </DataContext.Provider>
    </div>
  );
}

export default App;