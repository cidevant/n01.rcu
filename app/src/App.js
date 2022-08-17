import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Store from './Redux/Store/Store';
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={Store}>
      <div className="pt-5 p-0 m-0">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Provider>
  );
}

export default App;
