/* eslint-disable eqeqeq */
/* eslint-disable no-undef */

/**
 * Listens for "n01obs.Event" event
 *
 * @param {*} event
 * @returns {*}
 */
function n01obs__EventListener(event) {
  if (
    chrome == null ||
    chrome.runtime == null ||
    chrome.runtime.id == null
  ) {
    return;
  }

  console.log('[n01.obs.content-script] n01obs.Event', JSON.stringify(event.detail));

  chrome.runtime.sendMessage(event.detail);
}

/**
 * Script injector resolves promise when script is loaded
 *
 * @param {string} path script to load
 * @returns {Promise<any>} promise
 */
function injector(path) {
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
injector('inject-helpers.js')
  .then(() => injector('inject-websocket.js'))
  .then(() => injector('inject-script.js'));

// Communication with service worker
document.removeEventListener('n01obs.Event', n01obs__EventListener);
document.addEventListener('n01obs.Event', n01obs__EventListener, false);
