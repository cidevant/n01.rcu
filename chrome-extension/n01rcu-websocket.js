/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/**
 * Connects to remote websocket server to control n01
 *
 * @class n01obs__WebSocketClient
 */
class n01rcu_WebSocketClient {
    constructor() {
        this.__url = 'ws://localhost:3000/ws';
    }

    connect = () => {
        if (this.open) {
            console.log('[n01.rcu.ws.client] connect error: already connected');
        } else {
            const player = n01rcu_getPlayer();

            if (player && player.sid && player.pid && player.playerName) {
                const params = `?client=true&id=${player.sid}&name=${player.playerName}&playerId=${player.pid}&accessCode=TEST`;

                console.log(
                    `[n01.rcu.ws.client] connecting to ${this.__url} (name: ${player.playerName}, id: ${player.sid})`
                );

                this.__socket = new WebSocket(`${this.__url}${params}`);
                this.__socket.onopen = this.__onOpen;
                this.__socket.onerror = this.__onError;
                this.__socket.onclose = this.__onClose;
                this.__socket.onmessage = this.__onMessage;
            } else {
                console.log('[n01.rcu.ws.client] connect error: no user info', JSON.stringify(player));
            }
        }
    };

    disconnect = (code, reason) => {
        if (this.open) {
            console.log('[n01.rcu.ws.client] disconnecting');

            this.__socket.close(code ?? 1000, reason ?? 'Normal Closure');
        } else {
            console.log('[n01.rcu.ws.client] disconnect error: no connection to server');

            n01rcu_changeExtensionIcon('default');
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
            console.log('[n01.rcu.ws.client] send message', data['type']);

            this.__socket.send(msg);

            return true;
        } else {
            console.log('[n01.rcu.ws.client][error] send message: no connection to server', data['type']);
        }

        return false;
    };

    /**
     * Receives data from websocket server
     *
     * @param {*} event message event
     */
    __onMessage = (event) => {
        console.log('[n01.rcu.ws.client] received message', event.data);
        
        this.onmessage?.(event);
        n01rcu_onWsMessage(JSON.parse(event.data), this);
    };

    __onOpen = () => {
        console.log('[n01.rcu.ws.client] connected');

        this.onopen?.();
        n01rcu_changeExtensionIcon('connected');
    };

    __onClose = (event) => {
        console.log('[n01.rcu.ws.client] closed connection', event?.code, event?.reason);
        
        this.onclose?.(event);
        n01rcu_changeExtensionIcon('default');
    };

    __onError = () => {
        console.log('[n01.rcu.ws.client] connection failed');

        this.onerror?.();
        n01rcu_changeExtensionIcon('failed');
    };

    get open() {
        return this.__socket && this.__socket.readyState === WebSocket.OPEN;
    }
}
