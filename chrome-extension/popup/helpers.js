/* eslint-disable no-unused-vars */

let __connection = {
    // provided by `Content`
    url: null,
    accessCode: null,
    server: false,
    paired: false,
    searching: false,
    closeCode: null,
    closeReason: null,

    // internal state
    urlValid: false,
    accessCodeValid: false,
};

/**
 * Handles received events (messages) from `Popup` and `Background`
 *
 * @param {*} { __type, ...data }
 * @param {*} _sender
 * @param {*} _sendResponse
 */
function receivedEventsHandler({ __type, ...data }, _sender, _sendResponse) {
    if (__type === 'n01rcu.Event.Popup') {
        const { type, ...payload } = data;

        console.log('[n01.rcu.popup]', JSON.stringify(data));

        switch (type) {
            case 'SET_CONNECTION':
                {
                    setConnection(payload);
                    updateConnectionInfo();
                }
                break;
            default:
                break;
        }
    }
}

/**
 * Returns connection state
 *
 * @returns {object} connection
 */
function getConnection() {
    return __connection;
}

/**
 * Updates connection state and ensures proper transitions
 *
 * @param {object} payload values to update
 */
function setConnection(payload) {
    const newPayload = { ...payload };

    // ===========================================
    // Ensures valid transitions of internal state
    // ===========================================

    // 1. when `connected` or `paired` or `searching` -> `url` & `accessCode` are valid
    if (payload.server === true || payload.paired === true || payload.searching === true) {
        newPayload.urlValid = true;
        newPayload.accessCodeValid = true;
    }

    __connection = Object.assign(__connection, newPayload);
}

/**
 * Updates UI to reflect actual state of connection
 */
function updateConnectionInfo() {
    $('#server_status').text(__connection.server ? 'CONNECTED' : 'DISCONNECTED');
    $('#controllers_status').text(__connection.paired ? 'PAIRED' : 'UNPAIRED');
    $('#server_url_input').val(__connection.url).attr('disabled', __connection.server);
    $('#access_code_input').text(__connection.accessCode);

    if (__connection.server) {
        $('#connect_button').hide();
        $('#reset_button').hide();
        $('#generate_button').hide();
        $('#disconnect_button').show();
    } else {
        $('#reset_button').show();

        if (__connection.urlValid) {
            $('#generate_button').show();
        }

        $('#connect_button').show();
        $('#disconnect_button').hide();
    }

    updateErrorsMessages();
}

/**
 * Checks if provided url is valid
 *
 * @param {string} input url to check
 * @returns {boolean} result
 */
function validateUrl(input) {
    return new Promise((resolve, reject) => {
        if (isValidUrlFormat(input)) {
            try {
                fetch(getWebServerUrl(input, '/is-alive'))
                    .then((resp) => resp.json())
                    .then((resp) => {
                        if (resp?.ok === true) {
                            resolve(true);
                        } else {
                            reject(`response: ${JSON.stringify(resp)}`);
                        }
                    })
                    .catch((error) => {
                        reject(error.message);
                    });
            } catch (error) {
                reject(error.message);
            }
        } else {
            reject('invalid url format');
        }
    });
}

/**
 * Checks if accessCode is free to use (unused on backend)
 *
 * @param {string} url backend server url
 * @param {string} input code to check
 * @returns {boolean} result
 */
function validateAccessCode(url, input) {
    return new Promise((resolve, reject) => {
        if (isValidAccessCodeFormat(input)) {
            try {
                fetch(getWebServerUrl(url, `/check-access-code?access-code=${input}`))
                    .then((resp) => resp.json())
                    .then((resp) => {
                        if (resp.ok === true) {
                            resolve();
                        } else {
                            reject(`response: ${JSON.stringify(resp)}`);
                        }
                    })
                    .catch((error) => {
                        reject(error.message);
                    });
            } catch (error) {
                reject(error.message);
            }
        } else {
            reject('invalid access code format');
        }
    });
}

/**
 * Requests new access code from server
 *
 * @returns {Promise<string>} fetch promise
 */
function generateAccessCode() {
    return new Promise((resolve, reject) => {
        try {
            fetch(getWebServerUrl(__connection.url, '/generate-access-code'))
                .then((resp) => resp.json())
                .then((resp) => {
                    if (resp?.ok === true && resp?.code?.length === 4) {
                        resolve(resp.code);
                    } else {
                        reject(`response: ${JSON.stringify(resp)}`);
                    }
                })
                .catch((error) => {
                    reject(error.message);
                });
        } catch (error) {
            reject(error.message);
        }
    });
}

/**
 * Validates format `url`
 *
 * @param {string} input value to check
 * @returns {boolean} has valid format?
 */
function isValidUrlFormat(input) {
    return input?.startsWith('ws') && input?.endsWith('/ws');
}

/**
 * Validates format `accessCode`
 *
 * @param {string} input value to check
 * @returns {boolean} has valid format?
 */
function isValidAccessCodeFormat(input) {
    return input?.length === 4;
}

/**
 * Makes ok/error animation and hides/shows `accessCode`
 *
 * @param {*} selector
 * @param {boolean} [isValid=false]
 */
function setInputValidation(selector, isValid = false) {
    const className = isValid === true ? 'ok' : 'error';

    // toggle state
    $(selector).addClass(className);
    setTimeout(() => {
        $(selector).removeClass(className);
    }, 400);

    // hide/show access_code if url is valid/invalid
    if (selector === '#server_url_input') {
        if (isValid === true) {
            $('#settings_access_code').show();
        } else {
            setTimeout(() => {
                $('#settings_access_code').hide();
            }, 800);
        }
    }

    updateErrorsMessages();
}

/**
 * Shows/hides errors which are stored at `urlValid` and `accessCodeValid` variables
 */
function updateErrorsMessages() {
    const hasMessage = (key) => __connection[key] !== true && __connection[key]?.length > 0;

    // clear old
    $('#settings_errors').empty();

    // add new
    [
        ['urlValid', 'Server URL'],
        ['accessCodeValid', 'Pairing Code'],
    ].forEach(([key, label]) => {
        if (hasMessage(key)) {
            const $wrapper = $('<div>', { class: 'settings_error d-flex' });

            $('<div>', { class: 'settings_error_label' }).text(label).appendTo($wrapper);
            $('<div>', { class: 'settings_error_text' }).text(__connection[key]).appendTo($wrapper);
            $('#settings_errors').append($wrapper);
        }
    });
}

/**
 * Sends message to content script of active tab
 *
 * @param {*} payload message body
 * @param {*} onResponseCallback response callback
 */
function dispatchToContent(payload, onResponseCallback) {
    return new Promise((resolve, reject) => {
        chrome.tabs
            .query({
                active: true,
                currentWindow: true,
            })
            .then((tabs) => {
                if (tabs?.length > 0) {
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        {
                            __type: 'n01rcu.Event.Content',
                            ...payload,
                        },
                        onResponseCallback
                    );
                    resolve();
                } else {
                    console.log('[n01.rcu.popup][error] dispatchToContent: active tab id is null');
                    reject();
                }
            })
            .catch(reject);
    });
}

/**
 * Sends message to background
 *
 * @param {*} payload message body
 */
function dispatchToBackground(payload) {
    chrome.runtime.sendMessage({
        __type: 'n01rcu.Event.Background',
        ...payload,
    });
}

/**
 * Convert WS url to WEB url
 *
 * @param {string} url ws://.../ws
 * @param {string} path replaces /ws at the end
 * @returns {string} output http://.../path
 */
function getWebServerUrl(url, path) {
    return `${url}`.replace('wss://', 'https://').replace('ws://', 'http://').replace('/ws', path);
}
