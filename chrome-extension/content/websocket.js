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
            console.log('[n01.rcu.ws] connect error: already connected');
        } else {
            const player = n01rcu_getPlayer();

            if (player && player.sid && player.pid && player.playerName) {
                const params = `?client=true&id=${player.sid}&name=${player.playerName}&playerId=${player.pid}&accessCode=TEST`;

                console.log(
                    `[n01.rcu.ws] connecting to ${this.__url} (name: ${player.playerName}, id: ${player.sid})`
                );

                this.__socket = new WebSocket(`${this.__url}${params}`);
                this.__socket.onopen = this.__onOpen;
                this.__socket.onerror = this.__onError;
                this.__socket.onclose = this.__onClose;
                this.__socket.onmessage = this.__onMessage;
            } else {
                console.log('[n01.rcu.ws] connect error: no user info', JSON.stringify(player));
            }
        }
    };

    disconnect = (code, reason) => {
        if (this.open) {
            console.log('[n01.rcu.ws] disconnecting');

            this.__socket.close(code ?? 1000, reason ?? 'Normal Closure');
        } else {
            console.log('[n01.rcu.ws] disconnect error: no connection to server');

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
            console.log('[n01.rcu.ws] send message', data['type']);

            this.__socket.send(msg);

            return true;
        } else {
            console.log('[n01.rcu.ws][error] send message: no connection to server', data['type']);
        }

        return false;
    };

    /**
     * Receives data from websocket server
     *
     * @param {*} event message event
     */
    __onMessage = (event) => {
        console.log('[n01.rcu.ws] received message', event.data);
        
        this.onmessage?.(event);
        n01rcu_onWsMessage(JSON.parse(event.data), this);
    };

    __onOpen = () => {
        console.log('[n01.rcu.ws] connected');

        this.onopen?.();
        n01rcu_changeExtensionIcon('connected');
    };

    __onClose = (event) => {
        console.log('[n01.rcu.ws] closed connection', event?.code, event?.reason);
        
        this.onclose?.(event);
    };

    __onError = () => {
        console.log('[n01.rcu.ws] connection failed');

        this.onerror?.();
        n01rcu_changeExtensionIcon('failed');
    };

    get open() {
        return this.__socket && this.__socket.readyState === WebSocket.OPEN;
    }
}
