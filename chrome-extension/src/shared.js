const $$DEBUG = true;
const $$VERBOSE = false;
const $$VERY_VERBOSE = false;

// ---------------------------------------------------------------------------------------------
// SHARED
// ---------------------------------------------------------------------------------------------

class $SHARED {
    static __prefix = 'n01.RCU';

    static actions = {
        SPY_LOADED: `${$SHARED.__prefix}.action.SPY_LOADED`,
        SPY_UNLOAD: `${$SHARED.__prefix}.action.SPY_UNLOAD`,
        GET_DATA: `${$SHARED.__prefix}.action.GET_DATA`,
        SET_DATA: `${$SHARED.__prefix}.action.SET_DATA`,
        WATCH_NATIVE_FUNCTIONS: `${$SHARED.__prefix}.action.WATCH_NATIVE_FUNCTIONS`,
        WEBSOCKET_CONNECT: `${$SHARED.__prefix}.action.WEBSOCKET_CONNECT`,
        WEBSOCKET_DISCONNECT: `${$SHARED.__prefix}.action.WEBSOCKET_DISCONNECT`,
        WEBSOCKET_CONNECTION_OPEN: `${$SHARED.__prefix}.action.WEBSOCKET_CONNECTION_OPEN`,
        WEBSOCKET_CONNECTION_CLOSED: `${$SHARED.__prefix}.action.WEBSOCKET_CONNECTION_CLOSED`,
        WEBSOCKET_CONNECTION_ERROR: `${$SHARED.__prefix}.action.WEBSOCKET_CONNECTION_ERROR`,
        WEBSOCKET_MESSAGE: `${$SHARED.__prefix}.action.WEBSOCKET_MESSAGE`, // incoming
        WEBSOCKET_SEND: `${$SHARED.__prefix}.action.WEBSOCKET_SEND`, // outgoing
        UPDATE: `${$SHARED.__prefix}.action.UPDATE`,
        SET_ICON: `${$SHARED.__prefix}.action.SET_ICON`,
    };

    static targets = {
        background: `${$SHARED.__prefix}.target.BACKGROUND`,
        popup: `${$SHARED.__prefix}.target.POPUP`,
        content: `${$SHARED.__prefix}.target.CONTENT`,
        spy: `${$SHARED.__prefix}.target.SPY`,
        websocket: `${$SHARED.__prefix}.target.WEBSOCKET`,
    };

    static storageKeys = {
        DATA: `${$SHARED.__prefix}.storage.DATA`,
        CONNECTION: `${$SHARED.__prefix}.storage.CONNECTION`,
    };

    static webSocket;
}

// ---------------------------------------------------------------------------------------------
// VALIDATORS
// ---------------------------------------------------------------------------------------------

class $SHARED_VALIDATORS {
    static get webSocketExists() {
        return $SHARED.webSocket != null && $SHARED.webSocket instanceof $SHARED_WEBSOCKET;
    }

    /**
     * Validates action
     *
     * @static
     * @param {Object} action
     * @returns {boolean} result
     */
    static isValidAction(action) {
        if (Object.values($SHARED.actions)?.includes?.(action.type) !== true) {
            $$DEBUG && console.log('[n01.RCU.shared] action is not found', action.type);

            return false;
        }

        return true;
    }

    /**
     * Validates target
     *
     * @static
     * @param {string} target
     * @returns {boolean} result
     */
    static isValidTarget(target) {
        if (Object.values($SHARED.targets)?.includes?.(target) !== true) {
            $$DEBUG && console.log('[n01.RCU.shared] target is not found', target);

            return false;
        }

        return true;
    }

    /**
     * Checks if provided url is valid
     *
     * @param {string} input url to check
     * @returns {Promise<boolean>} result
     */
    static validateUrl(url) {
        return $SHARED_HELPERS.tryToPromise((resolve, reject) => {
            $$DEBUG && console.log('[n01.RCU.shared] validateUrl', url);

            if ($SHARED_VALIDATORS.isValidUrlFormat(url)) {
                fetch($SHARED_HELPERS.toWebUrl(url, '/is-alive'))
                    .then((resp) => resp.json())
                    .then((resp) => {
                        if (resp?.ok === true) {
                            resolve(true);
                        } else {
                            reject(`bad response: ${JSON.stringify(resp)}`);
                        }
                    })
                    .catch(reject);
            } else {
                reject('invalid url format');
            }
        });
    }

    /**
     * Checks if accessCode is free to use (unused on backend)
     *
     * @param {string} url backend server url
     * @param {string} accessCode code to check
     * @returns {Promise<boolean>} result
     */
    static validateAccessCode(url, accessCode) {
        return $SHARED_HELPERS.tryToPromise((resolve, reject) => {
            $$DEBUG && console.log('[n01.RCU.shared] validateAccessCode', url, accessCode);

            if ($SHARED_VALIDATORS.isValidAccessCodeFormat(accessCode)) {
                fetch($SHARED_HELPERS.toWebUrl(url, `/check-access-code?access-code=${accessCode}`))
                    .then((response) => response.json())
                    .then((response) => {
                        if (response.ok === true) {
                            resolve();
                        } else {
                            reject(`bad response: ${JSON.stringify(response)}`);
                        }
                    })
                    .catch(reject);
            } else {
                reject('invalid access code format');
            }
        });
    }

    static isValidAccessCodeFormat(code) {
        if (!code) {
            return false;
        }

        return /^[A-Z0-9]{4}$/i.test(`${code}`);
    }

    static isValidUrlFormat(url) {
        return url?.length > 0 && url?.startsWith('ws') && url?.endsWith('/ws');
    }

    static isValidPlayerId(id) {
        try {
            if (!id || id?.length !== 22) {
                return false;
            }

            const splitId = `${id}`.split('_');

            if (splitId.length !== 2) {
                return false;
            }

            return splitId[0].length === 8 && splitId[1].length === 13;
        } catch (error) {
            $$DEBUG && console.log('[n01.RCU.shared][error] isValidPlayerId', error.message);

            return false;
        }
    }

    static validateConnectionInfoFormat({ url, accessCode, player }) {
        const result = [];

        if (!url || !(url?.length > 0)) {
            result.push({
                scope: 'url',
                text: 'missing',
                value: url,
            });
        } else if (!$SHARED_VALIDATORS.isValidUrlFormat(url)) {
            result.push({
                scope: 'url',
                text: 'invalid format',
                value: url,
            });
        }

        if (!accessCode || !(accessCode?.length > 0)) {
            result.push({
                scope: 'accessCode',
                text: 'missing',
                value: accessCode,
            });
        } else if (!$SHARED_VALIDATORS.isValidAccessCodeFormat(accessCode)) {
            result.push({
                scope: 'accessCode',
                text: 'invalid format',
                value: accessCode,
            });
        }

        if (player) {
            if (!player.pid || !(player?.pid?.length > 0)) {
                result.push({
                    scope: 'player',
                    text: 'missing id',
                    value: player.pid,
                });
            } else if (!$SHARED_VALIDATORS.isValidPlayerId(player.pid)) {
                result.push({
                    scope: 'player',
                    text: 'invalid id format',
                    value: player.pid,
                });
            }

            if (!player.playerName || !(player.playerName?.length > 0)) {
                result.push({
                    scope: 'player',
                    text: 'missing name',
                    value: player.playerName,
                });
            }
        } else {
            result.push({
                scope: 'player',
                text: 'missing',
                value: player,
            });
        }

        return result;
    }
}

// ---------------------------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------------------------

class $SHARED_HELPERS {
    /**
     * Promisify `try/catch` callback
     *
     * @static
     * @param {*} callback
     * @returns {*}
     */
    static tryToPromise(callback) {
        return new Promise((resolve, reject) => {
            try {
                callback(resolve, reject);
            } catch (error) {
                const msg = error?.message ?? error;

                console.log(msg);
                reject(msg);
            }
        });
    }

    /**
     * Requests new access code from server
     *
     * @returns {Promise<string>} fetch promise
     */
    static generateAccessCode(url) {
        return $SHARED_HELPERS.tryToPromise((resolve, reject) => {
            $$DEBUG && console.log('[n01.RCU.shared] generateAccessCode', url);

            fetch($SHARED_HELPERS.toWebUrl(url, '/generate-access-code'))
                .then((response) => response.json())
                .then((response) => {
                    if (
                        response?.ok === true &&
                        $SHARED_VALIDATORS.isValidAccessCodeFormat(response?.code)
                    ) {
                        resolve(response.code);
                    } else {
                        reject(`bad response: ${JSON.stringify(response)}`);
                    }
                })
                .catch(reject);
        });
    }

    /**
     * Convert WS url to WEB url
     *
     * @param {string} url ws://.../ws
     * @param {string} path replaces /ws at the end
     * @returns {string} output http://.../path
     */
    static toWebUrl(url, path) {
        return `${url}`
            .replace('wss://', 'https://')
            .replace('ws://', 'http://')
            .replace('/ws', path);
    }
}

// ---------------------------------------------------------------------------------------------
// BACKGROUND (used by `BACKGROUND` and `POPUP`)
// ---------------------------------------------------------------------------------------------

class $SHARED_BACKGROUND {
    static #bg_dispatchTo(to, action = {}) {
        return $SHARED_HELPERS.tryToPromise((resolve, reject) => {
            if ($SHARED_VALIDATORS.isValidTarget(to) && $SHARED_VALIDATORS.isValidAction(action)) {
                $$DEBUG &&
                    $$VERBOSE &&
                    $$VERY_VERBOSE &&
                    console.log('[n01.RCU.shared] #bg_dispatchTo', to, action);

                if (chrome?.runtime?.id == null) {
                    reject('no chrome runtime');

                    return;
                }

                chrome.runtime
                    .sendMessage({
                        __target: to,
                        ...action,
                    })
                    .then(resolve)
                    .catch((error) => reject(error?.message ?? error));
            } else {
                reject('invalid target or action');
            }
        });
    }

    static #bg_dispatchToActiveTab(to, action = {}) {
        return $SHARED_HELPERS.tryToPromise((resolve, reject) => {
            if ($SHARED_VALIDATORS.isValidTarget(to) && $SHARED_VALIDATORS.isValidAction(action)) {
                $$DEBUG &&
                    $$VERBOSE &&
                    $$VERY_VERBOSE &&
                    console.log('[n01.RCU.shared] #bg_dispatchToActiveTab', to, action);

                if (chrome?.runtime?.id == null || chrome?.tabs?.query == null) {
                    reject('no chrome runtime');

                    return;
                }

                chrome.tabs
                    .query({
                        currentWindow: true,
                        url: 'https://nakka.com/n01/online/*',
                    })
                    .then((tabs) => {
                        if (tabs.length === 0) {
                            reject("can't find active tab");
                        }

                        chrome.tabs
                            .sendMessage(tabs[0].id, {
                                __target: to,
                                ...action,
                            })
                            .then(resolve)
                            .catch((error) => reject(error.message));
                    })
                    .catch((error) => reject(error.message));
            } else {
                reject('invalid target or action');
            }
        });
    }

    static dispatchToBackground(action) {
        return $SHARED_BACKGROUND.#bg_dispatchTo($SHARED.targets.background, action);
    }

    static dispatchToPopup(action) {
        return $SHARED_BACKGROUND.#bg_dispatchTo($SHARED.targets.popup, action);
    }

    static dispatchToContent(action) {
        return $SHARED_BACKGROUND.#bg_dispatchToActiveTab($SHARED.targets.content, action);
    }

    static dispatchToSpy(action) {
        return $SHARED_BACKGROUND.#bg_dispatchToActiveTab($SHARED.targets.spy, action);
    }
}

// ---------------------------------------------------------------------------------------------
// FOREGROUND (used by `CONTENT` and `SPY`)
// ---------------------------------------------------------------------------------------------

class $SHARED_FOREGROUND extends $SHARED {
    /**
     * Used by `CONTENT` and `SPY` for communication with other components.
     * When `SPY` wants to send event to `BACKGROUND` we use `CONTENT` as proxy, which receives event from `SPY` and sends to `BACKGROUND` (and vise versa).
     * When `CONTENT` wants to send event to `SPY` we don't use `CONTENT` as proxy to avoid sending event form `CONTENT` to `CONTENT` (infinite loop).
     *
     * @param {*} to event receiver target
     * @param {*} action event data
     * @param {boolean} [proxy=true] use `CONTENT` as proxy or send event to exact event receiver target
     * @returns {Promise}
     */
    static #fg_dispatchTo(to, action, proxy = true) {
        return $SHARED_HELPERS.tryToPromise((resolve, reject) => {
            if ($SHARED_VALIDATORS.isValidTarget(to) && $SHARED_VALIDATORS.isValidAction(action)) {
                $$DEBUG &&
                    $$VERBOSE &&
                    $$VERY_VERBOSE &&
                    console.log('[n01.RCU.shared] #fg_dispatchTo', to, action);

                if (!document?.dispatchEvent) {
                    reject('no document or dispatcher');

                    return;
                }

                const { type, payload: payloadStr } = action;

                document.dispatchEvent(
                    new CustomEvent(proxy ? $SHARED.targets.content : to, {
                        detail: {
                            __target: to,
                            type,
                            payload: JSON.stringify(payloadStr),
                        },
                    })
                );

                resolve();
            } else {
                reject('invalid target or action');
            }
        });
    }

    // used by SPY
    static dispatchToContent(action) {
        return $SHARED_FOREGROUND.#fg_dispatchTo($SHARED.targets.content, action);
    }

    // used by SPY
    static dispatchToBackground(action) {
        return $SHARED_FOREGROUND.#fg_dispatchTo($SHARED.targets.background, action);
    }

    // used by SPY
    static dispatchToPopup(action) {
        return $SHARED_FOREGROUND.#fg_dispatchTo($SHARED.targets.popup, action);
    }

    // used by CONTENT (don't use `CONTENT` as proxy -> avoids sending event form `CONTENT` to `CONTENT` (infinite loop))
    static dispatchToSpy(action) {
        return $SHARED_FOREGROUND.#fg_dispatchTo($SHARED.targets.spy, action, false);
    }
}

// ---------------------------------------------------------------------------------------------
// STORAGE
// ---------------------------------------------------------------------------------------------

class $SHARED_STORAGE extends $SHARED {
    // DATA

    static getData() {
        return $SHARED_STORAGE.#getItem($SHARED.storageKeys.DATA);
    }

    static saveData(data) {
        return $SHARED_STORAGE.#saveItem($SHARED.storageKeys.DATA, data);
    }

    static clearData() {
        return $SHARED_STORAGE.#clearByKey($SHARED.storageKeys.DATA);
    }

    // CONNECTION

    static getConnection() {
        return $SHARED_STORAGE.#getItem($SHARED.storageKeys.CONNECTION);
    }

    static updateConnection(data) {
        return $SHARED_STORAGE.#updateItem($SHARED.storageKeys.CONNECTION, data);
    }

    static clearConnection() {
        return $SHARED_STORAGE.#clearByKey($SHARED.storageKeys.CONNECTION);
    }

    // CLEAR ALL

    static clearStorage() {
        const promises = Object.values($SHARED.storageKeys).map((key) =>
            $SHARED_STORAGE.#clearByKey(key)
        );

        return Promise.all(promises);
    }

    // PRIVATE METHODS

    static #getItem(key) {
        return $SHARED_HELPERS.tryToPromise((resolve, reject) => {
            $$DEBUG && $$VERBOSE && $$VERY_VERBOSE && console.log('[n01.RCU.shared] #getItem', key);

            if (chrome == null || chrome.storage == null || chrome.storage.local == null) {
                reject('no chrome storage');

                return;
            }

            chrome.storage.local.get([key], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);

                    return;
                }

                resolve(result[key]);
            });
        });
    }

    static #saveItem(key, data) {
        return $SHARED_HELPERS.tryToPromise((resolve, reject) => {
            $$DEBUG &&
                $$VERBOSE &&
                $$VERY_VERBOSE &&
                console.log('[n01.RCU.shared] #saveItem', key, data);

            if (chrome == null || chrome.storage == null || chrome.storage.local == null) {
                reject('no chrome storage');

                return;
            }

            chrome.storage.local.set({ [key]: data }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);

                    return;
                }

                resolve(data);
            });
        });
    }

    static async #updateItem(key, data) {
        return $SHARED_HELPERS.tryToPromise(async (resolve, reject) => {
            $$DEBUG &&
                $$VERBOSE &&
                $$VERY_VERBOSE &&
                console.log('[n01.RCU.shared] #updateItem, update data', key, data);

            if (chrome?.storage?.local == null) {
                reject('no chrome storage');

                return;
            }

            const oldData = (await this.#getItem(key)) ?? {};
            const newData = {
                ...oldData,
                ...data,
            };

            chrome.storage.local.set({ [key]: newData }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);

                    return;
                }

                $$DEBUG &&
                    $$VERBOSE &&
                    $$VERY_VERBOSE &&
                    console.log('[n01.RCU.shared] #updateItem, final data:', newData);

                resolve(newData);
            });
        });
    }

    static #clearByKey(key) {
        return $SHARED_HELPERS.tryToPromise((resolve, reject) => {
            $$DEBUG &&
                $$VERBOSE &&
                $$VERY_VERBOSE &&
                console.log('[n01.RCU.shared] #clearByKey', key);

            if (chrome == null || chrome.storage == null || chrome.storage.local == null) {
                reject('no chrome storage');

                return;
            }

            chrome.storage.local.remove([key], () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);

                    return;
                }

                resolve();
            });
        });
    }
}

// ---------------------------------------------------------------------------------------------
// WEBSOCKET
// ---------------------------------------------------------------------------------------------

class $SHARED_WEBSOCKET {
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

    set data({ url, accessCode, player }) {
        this.#url = url;
        this.#accessCode = accessCode;
        this.#player = player;

        this.#validate(url, accessCode, player);
    }

    // PUBLIC GETTERS

    get data() {
        return {
            url: this.#url,
            accessCode: this.#accessCode,
            player: this.#player,
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
        const params = [
            'client=true',
            `id=${this.#player?.pid}`,
            `name=${this.#player?.playerName}`,
            `accessCode=${this.#accessCode}`,
        ];

        return [this.#url, params.join('&')].join('?');
    }

    get readyState() {
        return this.#socket?.readyState ?? -1;
    }

    get open() {
        return this.readyState === WebSocket.OPEN;
    }

    get valid() {
        return this.#validate(this.#url, this.#accessCode, this.#player);
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
    #player;
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
        this.#closeError = $SHARED_WEBSOCKET.closeErrors[event?.code] ?? null;

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

    #validate = (url, accessCode, player) => {
        this.#clearErrors();

        $SHARED_VALIDATORS
            .validateConnectionInfoFormat({
                url,
                accessCode,
                player,
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
        if (this.#reconnectTries < $SHARED_WEBSOCKET.reconnectMaxTries) {
            this.#reconnectTries += 1;

            this.#reconnectTimeoutID = setTimeout(() => {
                this.#connect();
            }, $SHARED_WEBSOCKET.reconnectDelay);
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
        if (event.data === 'ping') {
            this.#pingPongStart();
            this.#socket.send('pong');

            return true;
        }

        return false;
    };

    #pingPongStart = () => {
        this.#pingPongStop();

        this.#pingPongTimeoutID = setTimeout(() => {
            const closeError = $SHARED_WEBSOCKET.closeErrors['4053'];

            this.#socket?.close?.(closeError?.code, closeError?.text);
        }, $SHARED_WEBSOCKET.connectionTimeout + $SHARED_WEBSOCKET.connectionTimeoutThreshold);
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
