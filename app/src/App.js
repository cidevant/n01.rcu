import { Layout } from './components/Layout';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Settings from './pages/Settings';
import store from './redux/store';
import { ThemeProvider } from 'react-bootstrap';

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </Layout>
            </ThemeProvider>
        </Provider>
    );
}

export default App;
