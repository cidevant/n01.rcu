/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

class WebsocketClient {
    constructor(url) {
        this.__url = url;
    }

    connect = () => {
        if (this.open) {
            console.error('[ws.client] already opened');
        } else {
            const uuid = localStorage.getItem('uuid');

            this.__socket = new WebSocket(
                `${this.__url}?client=false&id=${uuid}&name=${this.__getName()}&accessCode=TEST`
            );
            this.__socket.onopen = this.__onOpen;
            this.__socket.onclose = this.__onClose;
            this.__socket.onerror = this.__onError;
            this.__socket.onmessage = this.__onMessage;
        }

        return this;
    };

    __getName = () => {
        try {
            return navigator.userAgent.split('(')[1].split(')')[0];
        } catch (error) {
            return navigator.userAgent;
        }
    };

    disconnect = () => {
        if (this.open) {
            console.log('[ws.client] disconnecting');

            this.__socket.close();
        } else {
            console.error('[ws.client] disconnect error: no connection to server');
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

    __onError = (error) => {
        console.log('[ws.client] error', error);

        this.onerror(error);
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
