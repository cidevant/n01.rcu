/* eslint-disable eqeqeq */
/* eslint-disable no-undef */

if (!window.n01rcu) {
    window.n01rcu = {};
}

/**
 * Listens for "n01rcu.Event" event
 *
 * @param {*} event
 * @returns {*}
 */
 window.n01rcu.EventListener = function EventListener(event) {
  if (
    // event.source != window ||
    chrome == null ||
    chrome.runtime == null ||
    chrome.runtime.id == null
  ) {
    return;
  }

  console.log('[n01.rcu.content-script] n01rcu.Event', JSON.stringify(event.detail));

  chrome.runtime.sendMessage(event.detail);
}

/**
 * Script injector resolves promise when script is loaded
 *
 * @param {string} path script to load
 * @returns {Promise<any>} promise
 */
 window.n01rcu.scriptInjector = function scriptInjector(path) {
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

// Chained script initialization
window.n01rcu.scriptInjector('inject-helpers.js')
  .then(() => window.n01rcu.scriptInjector('inject-websocket.js'))
  .then(() => window.n01rcu.scriptInjector('inject-script.js'));

// Communication with service worker
document.removeEventListener('n01rcu.Event', window.n01rcu.EventListener);
document.addEventListener('n01rcu.Event', window.n01rcu.EventListener, false);
