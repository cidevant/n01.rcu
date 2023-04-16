console.log('[n01.RCU.background] loaded');

importScripts('shared.js');

importScripts('background/ws/index.js'); // creates ws instance
importScripts('background/ws/actions.js'); // connect/disconnect/send
importScripts('background/ws/events.js'); // events received from ws

// INSTALL
chrome.runtime.onInstalled.addListener(async (reason) => {
    $$DEBUG && $$VERBOSE && console.log('[n01.RCU.background] onInstalled', reason);

    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
        $$DEBUG && console.log('[n01.RCU.background] initial storage setup');

        await $SHARED_STORAGE.updateConnection({
            url: 'wss://n01.devant.cz/ws',
            urlValid: false,
            accessCode: null,
            accessCodeValid: false,
            paired: false,
        });
    }
});

// EVENTS received from SPY/CONTENT
chrome.runtime.onMessage.addListener(async (event, _sender, sendResponse) => {
    if (event.__target === $SHARED.targets.background) {
        $$DEBUG && $$VERBOSE && console.log('[n01.RCU.background] got event', event);

        const { type, payload } = event;

        // switch (type) {
        //     case $SHARED.actions.WEBSOCKET_CONNECT:
        //         webSocketConnect();
        //         break;
        //     case $SHARED.actions.WEBSOCKET_DISCONNECT:
        //         webSocketDisconnect(payload);
        //         break;
        //     case $SHARED.actions.WEBSOCKET_SEND:
        //         webSocketSend(payload);
        //         break;
        //     case $SHARED.actions.SPY_LOADED: {
        //         await $SHARED_BACKGROUND.dispatchToSpy({ type: $SHARED.actions.GET_DATA });

        //         break;
        //     }
        //     case $SHARED.actions.SET_DATA: {
        //         await $SHARED_STORAGE.saveData(payload);
        //         await $SHARED_BACKGROUND.dispatchToSpy({
        //             type: $SHARED.actions.WATCH_NATIVE_FUNCTIONS,
        //         });
        //         break;
        //     }
        //     case $SHARED.actions.SET_ICON: {
        //         $SHARED_HELPERS.changeChromeExtensionIcon(payload);

        //         break;
        //     }
        // }

        sendResponse();
    }
});

// CLOSE
chrome.tabs.onRemoved.addListener(async function (_tabId, _removed) {
    $SHARED_HELPERS.changeChromeExtensionIcon({ icon: 'default' });
});
