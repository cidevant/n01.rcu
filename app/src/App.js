import { Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { WebSocket } from './components/WebSocket';
import { Layout } from './components/Layout';

import store from './store';

import Home from './pages/Home';
import Game from './pages/Game';

export default function App() {
    return (
        <Provider store={store}>
            <WebSocket>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/game" element={<Game />} />
                    </Routes>
                </Layout>
            </WebSocket>
        </Provider>
    );
}
