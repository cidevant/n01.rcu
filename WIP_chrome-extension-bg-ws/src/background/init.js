/**
 * Handles first installation
 *
 * @param {*} reason
 */
async function n01rcu$background$onInstallEventListener(reason) {
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
}

/**
 * Handles tab connection event
 *
 * @param {*} event
 * @param {*} _sender
 * @param {*} sendResponse
 */
async function n01rcu$background$onConnectEventListener(port) {
    if (port.name === 'n01.rcu.background') {
        $$DEBUG && $$VERBOSE && console.log('[n01.RCU.background] onConnect ', port);

        port.onMessage.addListener((event) => n01rcu$background$spyMessagesHandler(event, port));
        port.onDisconnect.addListener((port) => {
            // @TODO implement
            console.log('[n01.RCU.background] onDisconnect');
        });

        webSocketConnect();
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
