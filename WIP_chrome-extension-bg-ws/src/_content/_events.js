// /**
//  * Handles events from `SPY`
//  *
//  * @param {*} event incoming event
//  */
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

// /**
//  * Handles events from `WEBSOCKET`, `BACKGROUND`, `POPUP`, `WEBSOCKET`
//  *
//  * @param {*} event incoming event
//  */
// function contentBackgroundEventsHandler(event) {
//     $$DEBUG && $$VERBOSE && console.log('[n01.RCU.content.events] got event from BG', event);

//     const { type, payload } = event;

//     switch (type) {
//         case $SHARED.actions.WEBSOCKET_CONNECT:
//             webSocketConnect();
//             break;
//         case $SHARED.actions.WEBSOCKET_DISCONNECT:
//             webSocketDisconnect(payload);
//             break;
//         case $SHARED.actions.WEBSOCKET_SEND:
//             webSocketSend(payload);
//             break;
//     }
// }

// /**
//  * Handles `WEBSOCKET` events
//  *
//  * @param {*} message websocket message
//  */
// async function webSocketMessageHandler(message) {
//     // Update UI when PAIRED state changed
//     switch (message?.type) {
//         case 'PAIRED':
//         case 'UNPAIRED': {
//             const paired = message?.type === 'PAIRED';

//             await $SHARED_STORAGE.updateConnection({ paired });
//             await $SHARED_BACKGROUND.dispatchToPopup({ type: $SHARED.actions.UPDATE });
//             await $SHARED_BACKGROUND.dispatchToBackground({
//                 type: $SHARED.actions.SET_ICON,
//                 payload: {
//                     icon: paired ? 'paired' : 'connected',
//                 },
//             });
//             break;
//         }
//     }

//     return $SHARED_FOREGROUND.dispatchToSpy({
//         type: $SHARED.actions.WEBSOCKET_MESSAGE,
//         payload: message,
//     });
// }
