/* eslint-disable eqeqeq, no-undef */

/**
 * Send message from `Content` to `Background`
 *
 * @param {*} event
 * @returns {*} 
 */
 const n01rcu_backgroundEventsListener = function n01rcu_backgroundEventsListener(event) {
    if (
        chrome == null ||
        chrome.runtime == null ||
        chrome.runtime.id == null
    ) {
        return;
    }

    chrome.runtime.sendMessage(event.detail);
}

/**
 * Add `Background` events listener
 */
const n01rcu_listenBackgroundEvents = function n01rcu_listenBackgroundEvents() {
    document.removeEventListener('n01rcu.Event', n01rcu_backgroundEventsListener);
    document.addEventListener('n01rcu.Event', n01rcu_backgroundEventsListener, false);
}

// ========================================================================================
n01rcu_listenBackgroundEvents();
// ========================================================================================

/**
 * Injects `Content` scripts into page
 *
 * @param {*} path
 * @returns {*} 
 */
const n01rcu_scriptInjector = function n01rcu_scriptInjector(path) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');

        script.src = chrome.runtime.getURL(path);
        script.onerror = () => reject();
        script.onload = function () {
            this.remove();
            resolve();
        };

        (document.head || document.documentElement).appendChild(script);
    });
}

// ========================================================================================
n01rcu_scriptInjector('content/helpers.js')
    .then(() => n01rcu_scriptInjector('content/websocket.js'))
    .then(() => n01rcu_scriptInjector('content/index.js'));
// ========================================================================================


/**
 * Process message from `Popup`
 *
 * @param {*} request
 * @param {*} sender
 * @param {*} sendResponse
 */
 const n01rcu_popupEventListener = function n01rcu_popupEventListener(request, sender, sendResponse) {
    switch (request.type) {
        case 'GET_CONNECTION_STATUS':
            break;
        case 'SET_CONNECTION_SETTINGS':
            break;
        case 'CONNECT':
            break;
        case 'DISCONNECT':
            break;
        default:
            break;
    }
};

/**
 * Add `Popup` events listener
 */
const n01rcu_listenPopupEvents = function n01rcu_listenPopupEvents() {
    if (
        chrome == null ||
        chrome.runtime == null ||
        chrome.runtime.id == null
    ) {
        return;
    }

    chrome.runtime.onMessage.addListener(n01rcu_popupEventListener);
}

// ========================================================================================
n01rcu_listenPopupEvents();
// ========================================================================================

