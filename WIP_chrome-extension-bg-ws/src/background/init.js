/**
 * Handles tab connection from `SPY`
 *
 * @param {*} event
 * @param {*} _sender
 * @param {*} sendResponse
 */
async function n01rcu$background$onConnectEventListener(port) {
    if (port.name === 'n01.rcu.background') {
        $$DEBUG && $$VERBOSE && console.log('[n01.RCU.background] onConnect', port);

        port.onMessage.addListener((event) => n01rcu$background$spyMessagesHandler(event, port));
        port.onDisconnect.addListener((port) => {
            console.log('[n01.RCU.background] onConnect: onDisconnect');
        });

        n01rcu$background$webSocketConnect();
    }
}

/**
 * Handles messages from `POPUP`
 *
 * @param {*} event
 * @param {*} _sender
 * @param {*} sendResponse
 */
async function n01rcu$background$onMessageEventListener(event, _sender, sendResponse) {
    if (event.__target === $SHARED.targets.background) {
        $$DEBUG && $$VERBOSE && console.log('[n01.RCU.background] onMessage', event);

        n01rcu$background$popupMessagesHandler(event);
        sendResponse();
    }
}

/**
 * Handles first installation
 *
 * @param {*} reason
 */
async function n01rcu$background$onInstallEventListener(event) {
    $$DEBUG && $$VERBOSE && console.log('[n01.RCU.background] onInstalled', event);

    if (event.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        $$DEBUG && console.log('[n01.RCU.background] initial storage setup');

        await $SHARED_STORAGE.updateConnection({
            url: 'wss://n01.devant.cz/ws',
            urlValid: true,
            accessCode: 'ACDC',
            accessCodeValid: true,
            paired: false,
        });
    }
}

/**
 * Handles tab close event
 *
 * @param {*} tabId
 * @param {*} removed
 */
async function n01rcu$background$onRemovedEventListener(tabId, removed) {
    $$DEBUG && $$VERBOSE && console.log('[n01.RCU.background] onRemoved', tabId, removed);

    $SHARED_HELPERS.changeChromeExtensionIcon({ icon: 'default' });
}
