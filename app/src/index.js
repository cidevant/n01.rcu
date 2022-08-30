import './index.scss';

import { BrowserRouter } from 'react-router-dom';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';
import registerServiceWorker from './registerServiceWorker';
import reportWebVitals from './reportWebVitals';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

library.add(fas);

// Get UUID
function getUUID() {
    return new Promise((resolve) => {
        const uuid = localStorage.getItem('uuid');

        if (uuid) {
            resolve(uuid);
        } else {
            FingerprintJS.load()
                .then((fp) => fp.get())
                .then((result) => {
                    localStorage.setItem('uuid', result.visitorId);
                    resolve(result.visitorId);
                })
                .catch(resolve);
        }
    });
}

// Render app
function renderApp() {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );

    registerServiceWorker();

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals();
}

// Start app
getUUID().then(renderApp);
