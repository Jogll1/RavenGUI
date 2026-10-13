import ShortcutProvider from './components/ShortcutsProvider';
import Home from './pages/Home';

function App() {
  return (
    <div id="App">
      <ShortcutProvider>
        <Home />
      </ShortcutProvider>
    </div>
  );
}

export default App;
