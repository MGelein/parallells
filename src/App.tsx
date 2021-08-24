import Nav from './Nav';
import Content from './Content';
import AppContext from './DataContext';

import './App.scss';

function App() {
  return (
    <div className="app">
      <AppContext>
        <Nav />
        <Content />
      </AppContext>
    </div>
  );
}

export default App;