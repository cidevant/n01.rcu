console.log('[n01.RCU.background] loaded');

importScripts('shared.js');

// INSTALL
chrome.runtime.onInstalled.addListener(async (reason) => {
    $$DEBUG && $$VERBOSE && console.log('[n01.RCU.background] onInstalled', reason);

    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
        $$DEBUG && console.log('[n01.RCU.background] initial storage setup');

        await $SHARED_STORAGE.updateConnection({
            url: $$DEBUG ? 'wss://n01.devant.cz/ws' : 'ws://n01.devant.cz/ws',
            urlValid: false,
            accessCode: null,
            accessCodeValid: false,
            paired: false,
        });
    }
});

// EVENTS
chrome.runtime.onMessage.addListener(async (event, _sender, sendResponse) => {
    if (event.__target === $SHARED.targets.background) {
        $$DEBUG && $$VERBOSE && console.log('[n01.RCU.background] got event', event);

        const { type, payload } = event;

        switch (type) {
            case $SHARED.actions.SPY_LOADED: {
                await $SHARED_BACKGROUND.dispatchToSpy({ type: $SHARED.actions.GET_DATA });

                break;
            }
            case $SHARED.actions.SET_DATA: {
                await $SHARED_STORAGE.saveData(payload);
                await $SHARED_BACKGROUND.dispatchToContent({
                    type: $SHARED.actions.WEBSOCKET_CONNECT,
                });
                await $SHARED_BACKGROUND.dispatchToSpy({
                    type: $SHARED.actions.WATCH_NATIVE_FUNCTIONS,
                });
                break;
            }
            case $SHARED.actions.SET_ICON: {
                $SHARED_HELPERS.changeChromeExtensionIcon(payload);

                break;
            }
        }

        sendResponse();
    }
});

// STORAGE
// if ($$DEBUG && $$VERBOSE && $$VERY_VERBOSE) {
//     chrome.storage.onChanged.addListener((changes, namespace) => {
//         for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
//             console.log(
//                 '[n01.RCU.background] storage.onChanged',
//                 key,
//                 'changed',
//                 oldValue,
//                 ' => ',
//                 newValue
//             );
//         }
//     });
// }

// CLOSE
chrome.tabs.onRemoved.addListener(async function (tabid, removed) {
    $SHARED_HELPERS.changeChromeExtensionIcon({ icon: 'default' });
});
