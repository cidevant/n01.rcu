$$WEBSOCKET = new $SHARED_WEBSOCKET();

/**
 * Tries to connect to WS server
 *
 * @returns {*}
 */
async function webSocketConnect() {
    $$DEBUG && $$VERBOSE && console.log('[n01.RCU.content.websocket] webSocketConnect');

    // gets connection data from store
    const data = await $SHARED_STORAGE.getConnection();

    // creates websocket instance
    if (!$$WEBSOCKET) {
        $$WEBSOCKET.onmessage = async (event) => await webSocketMessageHandler(event);
        $$WEBSOCKET.onopen = async () => {
            await $SHARED_STORAGE.updateConnection($$WEBSOCKET.connectionInfo);
        };
        $$WEBSOCKET.onclose = async () => {
            await $SHARED_STORAGE.updateConnection({ paired: false });
        };
    }

    // sets connection data
    $$WEBSOCKET.data = data;

    // validate connection data and try to connect
    const validateAndConnect = async () => {
        if ($$WEBSOCKET.valid) {
            $$WEBSOCKET.connect();
        } else {
            // await webSocketConnectionHandler($SHARED.actions.WEBSOCKET_CONNECTION_ERROR);
        }
    };

    // checks existing open connection
    if ($$WEBSOCKET.open) {
        $$WEBSOCKET.disconnect();
        // waits for connection close and tries to connect
        setTimeout(async () => {
            await validateAndConnect();
        }, 500);
    } else {
        await validateAndConnect();
    }
}

/**
 * Disconnects websocket
 *
 * @param {*} { code, reason }
 */
function webSocketDisconnect({ code, reason }) {
    if ($$WEBSOCKET && $$WEBSOCKET.open) {
        $$WEBSOCKET.disconnect(code, reason);
    } else {
        $$DEBUG &&
            console.log(
                '[n01.RCU.content.websocket][error] webSocketDisconnect no connection to ws server'
            );
    }
}

/**
 * Sends message to websocket
 *
 * @param {*} { type, payload }
 */
function webSocketSend(message) {
    if ($$WEBSOCKET && $$WEBSOCKET.open) {
        $$WEBSOCKET.send(message);
    } else {
        $$DEBUG &&
            console.log(
                '[n01.RCU.content.websocket][error] webSocketSend: no connection to ws server'
            );
    }
}

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
