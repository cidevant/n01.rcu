/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/**
 * Connects to remote websocket server to control n01
 *
 * @class n01obs__WebSocketClient
 */
class n01rcu_WebSocketClient {
    static instance;

    constructor() {
        if (n01rcu_WebSocketClient.instance != null) {
            return n01rcu_WebSocketClient.instance;
        }

        n01rcu_WebSocketClient.instance = this;

        this.__closeCode = null;
        this.__closeReason = null;
     
        const storedUrl = localStorage.getItem('n01_rcu_url');
        const storedCode = localStorage.getItem('n01_rcu_code');

        if (this.__isValidUrl(storedUrl) && this.__isValidAccessCode(storedCode)) {
            this.updateSettings(storedUrl, storedCode);
        } else {
            this.resetSettings();
        }
    }

    connect = () => {
        if (this.open) {
            console.log('[n01.rcu.ws] connect error: already connected');
        } else {
            const player = n01rcu_getPlayer();

            if (player && player.sid && player.pid && player.playerName) {
                const params = `?client=true&id=${player.sid}&name=${player.playerName}&playerId=${player.pid}&accessCode=${this.__accessCode}`;

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

    updateSettings = (url, code) => {
        if (this.__isValidUrl(url)) {
            this.__url = url;
            localStorage.setItem('n01_rcu_url', url);
        } else {
            console.log('[n01.rcu.ws][error] updateSettings: invalid url');
        }

        if (this.__isValidAccessCode(code)) {
            this.__accessCode = code;
            localStorage.setItem('n01_rcu_code', code);
        } else {
            console.log('[n01.rcu.ws][error] updateSettings: invalid accessCode');
        }
    };

    resetSettings = () => {
        this.updateSettings(n01rcu_DEFAULT_SERVER_URL, n01rcu_DEFAULT_ACCESS_CODE);
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
        try {
            const msg = JSON.stringify(data);

            if (this.open) {
                console.log('[n01.rcu.ws] send message', data['type']);

                this.__socket.send(msg);

                return true;
            } else {
                console.log(
                    '[n01.rcu.ws][error] send message: no connection to server',
                    data['type']
                );
            }
        } catch (error) {
            console.log('[n01.rcu.ws][error] send message:', error);
        }

        return false;
    };

    __onMessage = (event) => {
        console.log('[n01.rcu.ws] received message', event.data);

        this.onmessage?.(event);
    };

    __onOpen = () => {
        console.log('[n01.rcu.ws] connected');

        this.__closeCode = null;
        this.__closeReason = null;

        this.onopen?.();
    };

    __onClose = (event) => {
        console.log('[n01.rcu.ws] closed connection', event?.code, event?.reason);

        this.__closeCode = event.code;
        this.__closeReason = event.reason;

        this.onclose?.(event);
    };

    __onError = (event) => {
        console.log('[n01.rcu.ws] connection failed');

        this.onerror?.(event);
    };

    get open() {
        return this.__socket && this.__socket.readyState === WebSocket.OPEN;
    }

    __isValidAccessCode = (input) => {
        return input?.length === 4;
    };

    __isValidUrl = (input) => {
        return input?.startsWith('ws') && input?.endsWith('/ws');
    };
}
