import { Layout } from './components/Layout';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings';
import store from './redux/store';

function App() {
    return (
        <Provider store={store}>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </Layout>
        </Provider>
    );
}

export default App;
