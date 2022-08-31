/* eslint-disable eqeqeq, no-undef */

function n01rcu_scriptInjector(path) {
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

function n01rcu_InEventsListener() {
    if (
        chrome == null ||
        chrome.runtime == null ||
        chrome.runtime.id == null
    ) {
        return;
    }

    chrome.runtime.onMessage.addListener((detail) => {
        document.dispatchEvent(new CustomEvent('n01rcu.Event.FromPopup', { detail }));
    });
}

function n01rcu_OutEventsListener(event) {
    if (
        chrome == null ||
        chrome.runtime == null ||
        chrome.runtime.id == null
    ) {
        return;
    }

    chrome.runtime.sendMessage({ __type: event.type, ...event.detail });
}

n01rcu_scriptInjector('content/helpers.js')
    .then(() => n01rcu_scriptInjector('content/websocket.js'))
    .then(() => n01rcu_scriptInjector('content/index.js'));
    
document.removeEventListener('n01rcu.Event.ToBackground', n01rcu_OutEventsListener);
document.addEventListener('n01rcu.Event.ToBackground', n01rcu_OutEventsListener, false);
document.removeEventListener('n01rcu.Event.ToPopup', n01rcu_OutEventsListener);
document.addEventListener('n01rcu.Event.ToPopup', n01rcu_OutEventsListener, false);
n01rcu_InEventsListener();
