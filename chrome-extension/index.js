/* eslint-disable eqeqeq */
/* eslint-disable no-undef */

/**
 * Listens for "n01rcu.Event" event
 *
 * @param {*} event
 * @returns {*}
 */
const n01rcu_EventListener = function EventListener(event) {
    if (
        chrome == null ||
        chrome.runtime == null ||
        chrome.runtime.id == null
    ) {
        return;
    }

    console.log('[n01.rcu.event]', JSON.stringify(event.detail));

    chrome.runtime.sendMessage(event.detail);
}

/**
 * Script injector resolves promise when script is loaded
 *
 * @param {string} path script to load
 * @returns {Promise<any>} promise
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

// 1. Communication with service worker (background.js)
document.removeEventListener('n01rcu.Event', n01rcu_EventListener);
document.addEventListener('n01rcu.Event', n01rcu_EventListener, false);

// 2. Chained script initialization
n01rcu_scriptInjector('src/helpers.js')
    .then(() => n01rcu_scriptInjector('src/websocket.js'))
    .then(() => n01rcu_scriptInjector('src/index.js'));
