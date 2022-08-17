import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings';
import store from './redux/store';

function App() {
    return (
        <Provider store={store}>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </div>
        </Provider>
    );
}

export default App;
