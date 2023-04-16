class $BACKGROUND_WEBSOCKET {
    static connectionTimeout = 5000; // must be same as on server
    static connectionTimeoutThreshold = 3000; // don't disconnect from server instantly
    static reconnectMaxTries = 24;
    static reconnectDelay = 5000;

    // ------------------------------------------
    // PUBLIC METHODS
    // ------------------------------------------

    onopen;
    onmessage;
    onclose;

    connect() {
        return this.validForConnect ? this.#connect() : false;
    }

    disconnect(code = 1000, reason) {
        return this.validForDisconnect ? this.#disconnect(code, reason) : false;
    }

    send(data) {
        let parsedData = data;

        try {
            parsedData = JSON.stringify(data);
        } catch (error) {
            $$DEBUG &&
                console.log("[n01.RCU][websocket][error] send: can't JSON parse", data, error);
        }

        if (this.validForSend) {
            try {
                this.#socket.send(parsedData);

                return true;
            } catch (error) {
                $$DEBUG && console.log('[n01.RCU][websocket][error] send:', error);
            }
        }

        $$DEBUG &&
            console.log('[n01.RCU][websocket][error] send: is not validForSend', this.errors);

        return false;
    }

    // PUBLIC SETTERS

    set data(data) {
        if (data) {
            const { url, accessCode } = data;

            this.#url = url;
            this.#accessCode = accessCode;

            this.#validate(url, accessCode);
        }
    }

    // PUBLIC GETTERS

    get data() {
        return {
            url: this.#url,
            accessCode: this.#accessCode,
        };
    }

    get connectionInfo() {
        return {
            readyState: this.readyState,
            open: this.open,
            hasErrors: this.hasErrors,
            errors: this.errors,
            closeCode: this.#closeCode,
            closeReason: this.#closeReason,
            closeError: this.#closeError,
        };
    }

    get connectionUrl() {
        const params = ['client=true', `accessCode=${this.#accessCode}`];

        return [this.#url, params.join('&')].join('?');
    }

    get readyState() {
        return this.#socket?.readyState ?? -1;
    }

    get open() {
        return this.readyState === WebSocket.OPEN;
    }

    get valid() {
        return this.#validate(this.#url, this.#accessCode);
    }

    get validForConnect() {
        return this.#validateForConnect();
    }

    get validForDisconnect() {
        return this.#validateOpenConnection();
    }

    get validForSend() {
        return this.#validateOpenConnection();
    }

    get errors() {
        return this.#errors;
    }

    get hasErrors() {
        return this.#errors?.length > 0;
    }

    // ------------------------------------------
    // PRIVATE
    // ------------------------------------------

    #socket;
    #url;
    #accessCode;
    #errors = [];
    #closeError;
    #closeCode;
    #closeReason;
    #pingPongTimeoutID;
    #reconnectTries = 0;
    #reconnectTimeoutID;

    #connect = () => {
        this.#socket = new WebSocket(this.connectionUrl);
        this.#socket.onopen = this.#onopen;
        this.#socket.onmessage = this.#onmessage;
        this.#socket.onclose = this.#onclose;

        return true;
    };

    #disconnect = (code, reason) => {
        this.#socket?.close?.(code, reason);
    };

    #onopen = () => {
        this.#closeCode = null;
        this.#closeReason = null;
        this.#closeError = null;

        this.#clearErrors();
        this.#stopTryingToReconnect();
        this.#pingPongStart();
        this.onopen?.();
    };

    #onclose = (event) => {
        this.#socket = null;
        this.#closeCode = event?.code ?? null;
        this.#closeReason = event?.reason ?? null;
        this.#closeError = $BACKGROUND_WEBSOCKET.closeErrors[event?.code] ?? null;

        this.#pingPongStop();
        this.onclose?.(event);
        this.#tryReconnect();
    };

    #onmessage = (event) => {
        if (this.#pingPongHandler(event)) {
            return;
        }

        try {
            this.onmessage?.(JSON.parse(event.data));
        } catch (error) {
            $$DEBUG && console.log('[n01.RCU][websocket][runtime_error]', error.message);
        }
    };

    // VALIDATORS

    #validate = (url, accessCode) => {
        this.#clearErrors();

        $SHARED_VALIDATORS
            .validateConnectionInfoFormat({
                url,
                accessCode,
            })
            .forEach(this.#addError);

        return !this.hasErrors;
    };

    #validateForConnect = () => {
        this.#clearErrors();

        if (this.open) {
            this.#addError({
                scope: 'connection',
                text: 'already connected',
            });

            return false;
        }

        return this.valid;
    };

    #validateOpenConnection = () => {
        this.#clearErrors();

        if (!this.open) {
            this.#addError({
                scope: 'connection',
                text: 'not connected',
            });

            return false;
        }

        return true;
    };

    // ERRORS

    #addError = (error) => {
        this.#errors.push(error);
    };

    #clearErrors = () => {
        this.#errors = [];
    };

    // RECONNECT

    #tryReconnect = () => {
        if (
            (this.#closeError == null || this.#closeError?.reconnect !== false) &&
            this.validForConnect === true
        ) {
            this.#startTryingToReconnect();
        } else {
            this.#stopTryingToReconnect();
        }
    };

    #startTryingToReconnect = () => {
        if (this.#reconnectTries < $BACKGROUND_WEBSOCKET.reconnectMaxTries) {
            this.#reconnectTries += 1;

            this.#reconnectTimeoutID = setTimeout(() => {
                this.#connect();
            }, $BACKGROUND_WEBSOCKET.reconnectDelay);
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

    // Handles "heartbeat" functionality:
    //      1) on successful connection to server:
    //          * starts `disconnect timer` which closes connection in `connectionTimeout + connectionTimeoutThreshold` ms
    //      2) on `ping` message from server:
    //          * restarts `disconnect timer`
    //          * responds to server with `pong` message
    //      3) no `ping` message received in `connectionTimeout + connectionTimeoutThreshold` ms:
    //          * closes connection to server

    #pingPongHandler = (event) => {
        if (event?.data === 'ping') {
            this.#pingPongStart();
            this.#socket?.send?.('pong');

            return true;
        }

        return false;
    };

    #pingPongStart = () => {
        this.#pingPongStop();

        this.#pingPongTimeoutID = setTimeout(() => {
            const closeError = $BACKGROUND_WEBSOCKET.closeErrors['4053'];

            this.#socket?.close?.(closeError?.code, closeError?.text);
        }, $BACKGROUND_WEBSOCKET.connectionTimeout + $BACKGROUND_WEBSOCKET.connectionTimeoutThreshold);
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
