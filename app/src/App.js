import { Layout } from './components/Layout';
import { Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { WebsocketProvider } from './websocket/context';
import store from './store';

import Home from './pages/Home';
import Settings from './pages/Settings';

export default function App() {
    return (
        <Provider store={store}>
            <WebsocketProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </Layout>
            </WebsocketProvider>
        </Provider>
    );
}
