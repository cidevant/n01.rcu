/**
 * Handles messages received from [`SPY`, `POPUP`, `CONTENT`]
 *
 * @param {*} event
 * @param {*} port connected tab port
 */
async function n01rcu$background$spyMessagesHandler(event, port) {
    const { type, payload } = event;

    switch (type) {
        case $SHARED.actions.SPY_LOADED:
            await $SHARED_BACKGROUND.dispatchToSpy({ type: $SHARED.actions.GET_DATA });
            break;
        case $SHARED.actions.SET_DATA:
            await $SHARED_STORAGE.saveData(payload);
            await $SHARED_BACKGROUND.dispatchToSpy({
                type: $SHARED.actions.WATCH_NATIVE_FUNCTIONS,
            });
            break;
        case $SHARED.actions.SET_ICON:
            $SHARED_HELPERS.changeChromeExtensionIcon(payload);
            break;
        case $SHARED.actions.WEBSOCKET_DISCONNECT:
            n01rcu$background$webSocketDisconnect(payload);
            break;
        case $SHARED.actions.WEBSOCKET_SEND:
            n01rcu$background$webSocketSend(payload);
            break;
    }
}
// function contentForegroundEventsHandler(event) {
//     $$DEBUG && $$VERBOSE && console.log('[n01.RCU.content.events] got event from FG', event);

//     const { type, payload } = event;

//     switch (type) {
//         case $SHARED.actions.SPY_UNLOAD: {
//             const reason = $SHARED_WEBSOCKET.closeErrors['4051'];

//             webSocketDisconnect({
//                 code: reason?.code,
//                 reason: reason?.text,
//             });

//             break;
//         }
//         case $SHARED.actions.WEBSOCKET_SEND: {
//             let newPayload = null;

//             try {
//                 newPayload = payload?.length > 0 ? JSON.parse(payload) : null;
//             } catch (error) {
//                 $$DEBUG &&
//                     $$VERBOSE &&
//                     console.log(
//                         "[n01.RCU.content.events] cant parse 'payload' for WEBSOCKET_SEND",
//                         event
//                     );
//             }

//             webSocketSend(newPayload);

//             break;
//         }
//     }
// }
