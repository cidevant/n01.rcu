let $$WEBSOCKET = null;

const intID = null;

async function n01rcu$background$webSocketConnect() {
    $$DEBUG && $$VERBOSE && console.log('[n01.RCU.background.websocket] webSocketConnect');

    // creates websocket instance
    if (!$$WEBSOCKET) {
        $$WEBSOCKET = new $BACKGROUND_WEBSOCKET();
        $$WEBSOCKET.onmessage = async (event) =>
            await n01rcu$background$webSocketMessagesHandler(event);
        $$WEBSOCKET.onopen = async () => {
            await n01rcu$background$webSocketConnectionHandler(
                $SHARED.actions.WEBSOCKET_CONNECTION_OPEN
            );
            $SHARED_HELPERS.changeChromeExtensionIcon({
                icon: 'connected',
            });

            // intID = setInterval(() => {
            //     console.log('===================> ws open', $$WEBSOCKET.open);
            // }, 4000);
        };
        $$WEBSOCKET.onclose = async () => {
            await $SHARED_STORAGE.updateConnection({ paired: false });
            await n01rcu$background$webSocketConnectionHandler(
                $SHARED.actions.WEBSOCKET_CONNECTION_CLOSED
            );
            $SHARED_HELPERS.changeChromeExtensionIcon({
                icon: 'default',
            });
            // clearInterval(intID);
        };
    }

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
        // await $SHARED_BACKGROUND.dispatchToPopup({ type });
    } else {
        $$DEBUG &&
            console.log(
                "[n01.RCU.background.websocket][error] webSocketConnectionHandler: $$WEBSOCKET instance doesn't exists"
            );
    }
}
