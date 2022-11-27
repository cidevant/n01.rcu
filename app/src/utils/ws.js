export const WS_IN_PREFIX = 'WS:IN'; // incoming message action prefix
export const WS_OUT_PREFIX = 'WS:OUT'; // sending message action prefix

class WebsocketClient {
    connect = (accessCode, url) => {
        const isValidAccessCode = this.__isValidAccessCode(accessCode);
        const isValidUrl = this.__isValidUrl(url);

        if (!this.open && isValidAccessCode && isValidUrl) {
            const uuid = localStorage.getItem('uuid');
            const name = this.__getName();
            const params = `?client=false&id=${uuid}&name=${name}&accessCode=${accessCode}`;

            this.__socket = new WebSocket(`${url}${params}`);
            this.__socket.onopen = this.__onOpen;
            this.__socket.onclose = (event) => this.__onClose(event, accessCode, url);
            this.__socket.onerror = this.__onError;
            this.__socket.onmessage = this.__onMessage;
        } else {
            const reasons = [];

            if (this.open) {
                reasons.push('already connected');
            }
            if (!isValidAccessCode) {
                reasons.push('invalid accessCode');
            }
            if (!isValidUrl) {
                reasons.push('invalid server url');
            }

            console.error('[ws.client][connect][error]', reasons);
        }

        return this;
    };

    disconnect = () => {
        if (this.open) {
            console.log('[ws.client] disconnecting');

            this.__socket.close();
        }
    };

    /**
     * Sends data to websocket server
     *
     * @param {*} data
     */
    send = (data) => {
        try {
            const msg = JSON.stringify(data);

            if (this.open) {
                console.log('[ws.client] send message', data['type']);

                this.__socket.send(msg);
            } else {
                throw new Error(`[ws.client] send error: no connection ${msg}`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    onopen() {}
    onclose() {}
    onerror() {}
    onmessage() {}

    // ---------------------------------------------------------------------------

    __isValidAccessCode = (input) => {
        return input?.length === 4;
    };

    __isValidUrl = (input) => {
        return input?.startsWith('ws') && input?.endsWith('/ws');
    };

    /**
     * Receives data from websocket server
     *
     * @param {*} evt message event
     */
    __onMessage = (event) => {
        if (this.#pingPongMessageHandler(event)) {
            return;
        }

        try {
            const message = JSON.parse(event.data);

            console.log('[ws.client] incoming message', message['type']);

            this.onmessage(message);
        } catch (error) {
            console.error('[ws.client] message error', error, event.data);
        }
    };

    __onOpen = () => {
        console.log('[ws.client] connection opened');

        // order is important
        this.#pingPongStart();
        this.#stopTryingToReconnect();
        this.onopen?.();
    };

    __onClose = (event, accessCode, url) => {
        const { code, reason } = event;

        console.log('[ws.client] connection closed ', event);

        // order is important
        this.#pingPongStop();
        this.onclose?.(code, reason);
        this.#tryReconnect(event, accessCode, url);
    };

    __onError = () => {
        console.log('[ws.client] connection error');

        this.onerror('connection error');
    };

    __getName = () => {
        try {
            return navigator.userAgent.split('(')[1].split(')')[0];
        } catch (error) {
            return navigator.userAgent;
        }
    };

    get open() {
        return this.__socket != null && this.__socket.readyState === WebSocket.OPEN;
    }

    // RECONNECT

    static reconnectMaxTries = 24;
    static reconnectDelay = 5000;

    #reconnectTries = 0;
    #reconnectTimeoutID;

    #tryReconnect = (event, accessCode, url) => {
        const closeError = WebsocketClient.closeError?.[event?.code];

        if (closeError == null || closeError?.reconnect !== false) {
            if (this.__isValidAccessCode(accessCode) && this.__isValidUrl(url)) {
                this.#startTryingToReconnect(accessCode, url);
            } else {
                this.#stopTryingToReconnect();
            }
        }
    };

    #startTryingToReconnect = (accessCode, url) => {
        if (this.#reconnectTries < WebsocketClient.reconnectMaxTries) {
            this.#reconnectTries += 1;

            this.#reconnectTimeoutID = setTimeout(() => {
                this.connect(accessCode, url);
            }, WebsocketClient.reconnectDelay);
        }
    };

    #stopTryingToReconnect = () => {
        if (this.#reconnectTimeoutID != null) {
            clearTimeout(this.#reconnectTimeoutID);

            this.#reconnectTimeoutID = null;
        }

        this.#reconnectTries = 0;
    };

    // PING-PONG

    static connectionTimeout = 5000; // must be same as on server
    static connectionTimeoutThreshold = 3000; // allow some time for data communication (ping - delay - pong)

    #pingPongTimeoutID;

    // Handles "heartbeat" logic:
    //    1) on successful connection to server:
    //        * start `disconnect timer` which closes socket connection after `connectionTimeout + connectionTimeoutThreshold` ms
    //    2) server should start `ping` messages
    //    3) if `ping` message NOT received after `connectionTimeout + connectionTimeoutThreshold` ms:
    //        * close connection to server
    //    4) if received `ping` message from  server:
    //        * restart `disconnect timer`
    //        * respond to server with `pong` message

    #pingPongMessageHandler = (event) => {
        if (event.data === 'ping') {
            this.#pingPongStart();
            this.__socket.send('pong');

            return true;
        }

        return false;
    };

    #pingPongStart = () => {
        this.#pingPongStop();

        this.#pingPongTimeoutID = setTimeout(() => {
            const closeError = WebsocketClient.closeErrors['4053'];

            this.__socket?.close?.(closeError?.code, closeError?.text);
        }, WebsocketClient.connectionTimeout + WebsocketClient.connectionTimeoutThreshold);
    };

    #pingPongStop = () => {
        if (this.#pingPongTimeoutID != null) {
            clearTimeout(this.#pingPongTimeoutID);

            this.#pingPongTimeoutID = null;
        }
    };

    // CLOSE ERRORS

    static closeErrors = {
        // common
        1000: {
            code: 1000,
            scope: 'connection',
            text: 'normal closure',
        },
        1006: {
            code: 1006,
            scope: 'connection',
            text: 'abnormal closure',
        },
        // failed params validation
        4000: {
            code: 4000,
            scope: 'accessCode',
            text: 'missing',
            reconnect: false,
        },
        4001: {
            code: 4001,
            scope: 'accessCode',
            text: 'already in use',
            reconnect: false,
        },
        4003: {
            code: 4003,
            scope: 'player.id',
            text: 'missing',
            reconnect: false,
        },
        4004: {
            code: 4004,
            scope: 'player.name',
            text: 'missing',
            reconnect: false,
        },
        // client socket replace
        4002: {
            code: 4002,
            scope: 'client',
            text: 'replaced by new client',
            reconnect: false,
        },
        // user action
        4050: {
            code: 4050,
            scope: 'connection',
            text: 'user requested action',
            reconnect: false,
        },
        4051: {
            code: 4051,
            scope: 'connection',
            text: 'leaving page',
            reconnect: false,
        },
        // ping pong
        4053: {
            code: 4053,
            scope: 'connection',
            text: 'connection timeout (ping-pong, client)',
        },
        4054: {
            code: 4054,
            scope: 'connection',
            text: 'connection timeout (ping-pong, server)',
        },
    };
}

export const ws = new WebsocketClient();
export default ws;
