/**
 * Handles and forwards websocket messages to `SPY`
 *
 * @param {*} message websocket message
 */
async function n01rcu$background$webSocketMessagesHandler(message) {
    // Update UI when `PAIRED` state changed
    switch (message?.type) {
        case 'PAIRED':
        case 'UNPAIRED':
            {
                const paired = message?.type === 'PAIRED';

                await $SHARED_STORAGE.updateConnection({ paired });
                await $SHARED_BACKGROUND.dispatchToPopup({ type: $SHARED.actions.UPDATE });
                $SHARED_HELPERS.changeChromeExtensionIcon({
                    icon: paired ? 'paired' : 'connected',
                });
            }
            break;
    }

    // Forward message to `SPY`
    return $SHARED_BACKGROUND.dispatchToSpy({
        type: $SHARED.actions.WEBSOCKET_MESSAGE,
        payload: message,
    });
}
