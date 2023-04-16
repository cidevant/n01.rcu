/**
 * Handles messages from `POPUP`
 *
 * @param {*} event
 */
async function n01rcu$background$popupMessagesHandler(event) {
    const { type, payload } = event;

    switch (type) {
        case $SHARED.actions.WEBSOCKET_CONNECT:
            n01rcu$background$webSocketConnect(payload);
            break;
        case $SHARED.actions.WEBSOCKET_DISCONNECT:
            n01rcu$background$webSocketDisconnect(payload);
            break;
        case $SHARED.actions.SET_ICON:
            $SHARED_HELPERS.changeChromeExtensionIcon(payload);
            break;
    }
}
