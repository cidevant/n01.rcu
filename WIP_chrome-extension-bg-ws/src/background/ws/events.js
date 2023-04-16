/**
 * Handles `WEBSOCKET` events
 *
 * @param {*} message websocket message
 */
async function webSocketMessageHandler(message) {
    // Update UI when PAIRED state changed
    switch (message?.type) {
        case 'PAIRED':
        case 'UNPAIRED': {
            const paired = message?.type === 'PAIRED';

            await $SHARED_STORAGE.updateConnection({ paired });
            await $SHARED_BACKGROUND.dispatchToPopup({ type: $SHARED.actions.UPDATE });
            break;
        }
    }

    return $SHARED_FOREGROUND.dispatchToSpy({
        type: $SHARED.actions.WEBSOCKET_MESSAGE,
        payload: message,
    });
}
