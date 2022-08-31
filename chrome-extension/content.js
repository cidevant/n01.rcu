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

function n01rcu_receiveEventsListener() {
    if (
        chrome == null ||
        chrome.runtime == null ||
        chrome.runtime.id == null
    ) {
        return;
    }

    chrome.runtime.onMessage.addListener(({ __type, ...data}) => {
        if (__type === 'n01rcu.Event.Content') {
            document.dispatchEvent(new CustomEvent(__type, { detail: data }));
        }
    });
}

function n01rcu_sendEventsListener(event) {
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

// Events
document.removeEventListener('n01rcu.Event.Background', n01rcu_sendEventsListener);
document.addEventListener('n01rcu.Event.Background', n01rcu_sendEventsListener, false);
document.removeEventListener('n01rcu.Event.Popup', n01rcu_sendEventsListener);
document.addEventListener('n01rcu.Event.Popup', n01rcu_sendEventsListener, false);
n01rcu_receiveEventsListener();
