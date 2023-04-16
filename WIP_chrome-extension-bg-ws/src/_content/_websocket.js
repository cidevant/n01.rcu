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
    if (!$SHARED_VALIDATORS.webSocketExists) {
        $SHARED.webSocket = new $SHARED_WEBSOCKET();
        $SHARED.webSocket.onmessage = async (event) => await webSocketMessageHandler(event);
        $SHARED.webSocket.onopen = async () => {
            await webSocketConnectionHandler($SHARED.actions.WEBSOCKET_CONNECTION_OPEN);
            await $SHARED_BACKGROUND.dispatchToBackground({
                type: $SHARED.actions.SET_ICON,
                payload: {
                    icon: 'connected',
                },
            });
        };
        $SHARED.webSocket.onclose = async () => {
            await $SHARED_STORAGE.updateConnection({ paired: false });
            await webSocketConnectionHandler($SHARED.actions.WEBSOCKET_CONNECTION_CLOSED);
            await $SHARED_BACKGROUND.dispatchToBackground({
                type: $SHARED.actions.SET_ICON,
                payload: {
                    icon: 'default',
                },
            });
        };
    }

    // sets connection data
    $SHARED.webSocket.data = data;

    // validate connection data and try to connect
    const validateAndConnect = async () => {
        if ($SHARED.webSocket.valid) {
            $SHARED.webSocket.connect();
        } else {
            await webSocketConnectionHandler($SHARED.actions.WEBSOCKET_CONNECTION_ERROR);
        }
    };

    // checks existing open connection
    if ($SHARED.webSocket.open) {
        $SHARED.webSocket.disconnect();
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
    if ($SHARED_VALIDATORS.webSocketExists) {
        $SHARED.webSocket.disconnect(code, reason);
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
    if ($SHARED_VALIDATORS.webSocketExists) {
        $SHARED.webSocket.send(message);
    } else {
        $$DEBUG &&
            console.log(
                '[n01.RCU.content.websocket][error] webSocketSend: no connection to ws server'
            );
    }
}

/**
 * Saves connection status to storage and sends event to `POPUP`
 *
 * @param {string} type Event type
 */
async function webSocketConnectionHandler(type) {
    await $SHARED_STORAGE.updateConnection($SHARED.webSocket.connectionInfo);
    await $SHARED_BACKGROUND.dispatchToPopup({ type });
}
