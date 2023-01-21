import './index.scss';

import { HashRouter } from 'react-router-dom';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import registerServiceWorker from './registerServiceWorker';
import reportWebVitals from './reportWebVitals';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(fas);

// Render app
function renderApp() {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <HashRouter>
            <App />
        </HashRouter>
    );

    registerServiceWorker();

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
}

// Start app
renderApp();
