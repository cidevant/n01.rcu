export const WS_IN_PREFIX = 'WS:IN'; // incoming message action prefix
export const WS_OUT_PREFIX = 'WS:OUT'; // sending message action prefix

class WebsocketClient {
    constructor(url) {
        this.__url = url;
        this.__accessCode = null;
    }

    connect = (accessCode) => {
        if (accessCode !== this.__accessCode) {
            this.__accessCode = accessCode;

            if (this.open) {
                this.disconnect();
            }

            this.__connect(accessCode);
        } else if (!this.open) {
            this.__connect(accessCode);
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
        const msg = JSON.stringify(data);

        if (this.open) {
            console.log('[ws.client] send message', msg);

            this.__socket.send(msg);
        } else {
            console.error('[ws.client] send error: no connection', msg);
        }
    };

    __connect = (accessCode) => {
        if (!this.open) {
            const uuid = localStorage.getItem('uuid');
            const name = this.__getName();
            const params = `?client=false&id=${uuid}&name=${name}&accessCode=${accessCode}`;

            this.__socket = new WebSocket(`${this.__url}${params}`);
            this.__socket.onopen = this.__onOpen;
            this.__socket.onclose = this.__onClose;
            this.__socket.onerror = this.__onError;
            this.__socket.onmessage = this.__onMessage;
        }
    };

    /**
     * Receives data from websocket server
     *
     * @param {*} evt message event
     */
    __onMessage = (event) => {
        console.log('[ws.client] incoming message', event.data);

        try {
            const message = JSON.parse(event.data);

            this.onmessage(message);
        } catch (error) {
            console.error('[ws.client] cant parse message', event.data);
        }
    };

    __onOpen = () => {
        console.log('[ws.client] connected');

        this.onopen();
    };

    __onClose = (code, reason) => {
        console.log('[ws.client] closed connection');

        this.onclose(code, reason);
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
        return this.__socket && this.__socket.readyState === WebSocket.OPEN;
    }

    onopen() {}
    onclose() {}
    onerror() {}
    onmessage() {}
}

export const ws = new WebsocketClient('ws://localhost:3000/ws');
export default ws;
