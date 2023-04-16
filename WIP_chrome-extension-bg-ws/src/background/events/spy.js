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
            await port.postMessage({ type: $SHARED.actions.GET_DATA });
            break;
        case $SHARED.actions.SPY_UNLOAD:
            {
                // const reason = $BACKGROUND_WEBSOCKET.closeErrors['4051'];
                // webSocketDisconnect({
                //     code: reason?.code,
                //     reason: reason?.text,
                // });
            }
            break;
        case $SHARED.actions.SET_DATA:
            await $SHARED_STORAGE.saveData(payload);
            await port.postMessage({
                type: $SHARED.actions.WATCH_NATIVE_FUNCTIONS,
            });
            break;
        case $SHARED.actions.WEBSOCKET_SEND:
            {
                let newPayload = null;

                try {
                    newPayload =
                        typeof payload === 'string' && payload?.length > 0
                            ? JSON.parse(payload)
                            : payload;
                } catch (error) {
                    $$DEBUG &&
                        $$VERBOSE &&
                        console.log(
                            "[n01.RCU.content.events] cant parse 'payload' for WEBSOCKET_SEND",
                            event
                        );
                }

                n01rcu$background$webSocketSend(newPayload);
            }
            break;
    }
}
