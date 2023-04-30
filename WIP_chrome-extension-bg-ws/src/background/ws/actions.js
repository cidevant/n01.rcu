let $$WEBSOCKET = null;

/**
 * Creates $SHARED_WEBSOCKET instance
 *
 */
async function n01rcu$background$webSocketInit() {
    if ($$WEBSOCKET) {
        $$DEBUG &&
            console.log(
                '[n01.RCU.background.websocket][error] webSocketInit: instance already exists',
                $$WEBSOCKET.connectionInfo
            );
    } else {
        $$WEBSOCKET = new $SHARED_WEBSOCKET();
        $$WEBSOCKET.onmessage = async (event) => {
            await n01rcu$background$webSocketMessagesHandler(event);
        };
        $$WEBSOCKET.onopen = async () => {
            await n01rcu$background$webSocketConnectionHandler(
                $SHARED.actions.WEBSOCKET_CONNECTION_OPEN
            );
            $SHARED_HELPERS.changeChromeExtensionIcon({
                icon: 'connected',
            });
        };
        $$WEBSOCKET.onclose = async () => {
            await $SHARED_STORAGE.updateConnection({ paired: false });
            await n01rcu$background$webSocketConnectionHandler(
                $SHARED.actions.WEBSOCKET_CONNECTION_CLOSED
            );
            $SHARED_HELPERS.changeChromeExtensionIcon({
                icon: 'default',
            });
        };
    }
}

async function n01rcu$background$webSocketConnect() {
    $$DEBUG && $$VERBOSE && console.log('[n01.RCU.background.websocket] webSocketConnect');

    await n01rcu$background$webSocketInit();

    // gets connection data from store
    const data = await $SHARED_STORAGE.getConnection();

    if (data) {
        // sets connection data
        $$WEBSOCKET.data = data;

        // validate connection data and try to connect
        const validateAndConnect = async () => {
            if ($$WEBSOCKET.valid) {
                $$WEBSOCKET.connect();
            } else {
                await n01rcu$background$webSocketConnectionHandler(
                    $SHARED.actions.WEBSOCKET_CONNECTION_ERROR
                );
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
    } else {
        $$DEBUG &&
            console.log(
                '[n01.RCU.background.websocket][error] webSocketConnect: no connection data'
            );
    }
}

/**
 * Disconnects websocket
 *
 * @param {*} { code, reason }
 */
function n01rcu$background$webSocketDisconnect({ code, reason }) {
    if ($$WEBSOCKET && $$WEBSOCKET.open) {
        $$WEBSOCKET.disconnect(code, reason);
    } else {
        $$DEBUG &&
            console.log(
                '[n01.RCU.background.websocket][error] webSocketDisconnect no connection to ws server'
            );

        n01rcu$background$webSocketConnectionHandler($SHARED.actions.WEBSOCKET_CONNECTION_CLOSED);
    }
}

/**
 * Sends message to websocket
 *
 * @param {*} { type, payload }
 */
function n01rcu$background$webSocketSend(message) {
    if ($$WEBSOCKET && $$WEBSOCKET.open) {
        $$WEBSOCKET.send(message);
    } else {
        $$DEBUG &&
            console.log(
                '[n01.RCU.background.websocket][error] webSocketSend: no connection to ws server'
            );

        n01rcu$background$webSocketConnectionHandler($SHARED.actions.WEBSOCKET_CONNECTION_CLOSED);
    }
}

/**
 * Saves connection status to storage and sends event to `POPUP`
 *
 * @param {string} type Event type
 */
async function n01rcu$background$webSocketConnectionHandler(type) {
    if ($$WEBSOCKET) {
        await $SHARED_STORAGE.updateConnection($$WEBSOCKET.connectionInfo);
        await $SHARED_BACKGROUND.dispatchToPopup({ type });

        switch (type) {
            case $SHARED.actions.WEBSOCKET_CONNECTION_CLOSED:
            case $SHARED.actions.WEBSOCKET_CONNECTION_ERROR:
                $SHARED_HELPERS.changeChromeExtensionIcon({ icon: 'default' });
                break;
            case $SHARED.actions.WEBSOCKET_CONNECTION_OPEN:
                $SHARED_HELPERS.changeChromeExtensionIcon({ icon: 'connected' });
                break;
            default:
                break;
        }
    } else {
        $$DEBUG &&
            console.log(
                "[n01.RCU.background.websocket][error] webSocketConnectionHandler: $$WEBSOCKET instance doesn't exists"
            );
    }
}
