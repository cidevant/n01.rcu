/* eslint-disable no-unused-vars */

let __connection = {
    // internal state
    urlValid: false,
    accessCodeValid: false,

    // provided by content
    url: null,
    accessCode: null,
    server: false,
    paired: false,
    searching: false,
    closeCode: null,
    closeReason: null,
};

function receivedEventsHandler({ __type, ...action }, _sender, _sendResponse) {
    const { type, ...payload } = action;

    if (__type === 'n01rcu.Event.Popup') {
        console.log('[n01.rcu.popup]', JSON.stringify(action));

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

function getConnection() {
    return __connection;
}

function setConnection(payload) {
    const newPayload = { ...payload };

    // ===========================================
    // Ensure valid transitions of internal state
    // ===========================================

    // 1. when `connected` or `paired` or `searching` -> `url` & `accessCode` are valid
    if (payload.server === true || payload.paired === true || payload.searching === true) {
        newPayload.urlValid = true;
        newPayload.accessCodeValid = true;
    }

    // 2. `url` was valid and became invalid -> invalidate `accessCode`
    if (__connection.urlValid === true && newPayload.urlValid !== true) {
        newPayload.accessCodeValid = 'invalid url';
    }

    __connection = Object.assign(__connection, newPayload);
}

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
}

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
                            reject(`fetch response error ${JSON.stringify(resp)}`);
                        }
                    })
                    .catch((error) => {
                        reject(`fetch error ${error.message}`);
                    });
            } catch (error) {
                reject(`fetch error ${error.message}`);
            }
        } else {
            reject('invalid url format');
        }
    });
}

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
                            reject(`fetch result error ${JSON.stringify(resp)}`);
                        }
                    })
                    .catch((error) => {
                        reject(`fetch error ${error.message}`);
                    });
            } catch (error) {
                reject(`fetch error ${error.message}`);
            }
        } else {
            reject('invalid access code format');
        }
    });
}

function generateAccessCode() {
    return new Promise((resolve, reject) => {
        try {
            fetch(getWebServerUrl(__connection.url, '/generate-access-code'))
                .then((resp) => resp.json())
                .then((resp) => {
                    if (resp?.ok === true && resp?.code?.length === 4) {
                        resolve(resp.code);
                    } else {
                        reject(resp.error);
                    }
                })
                .catch((error) => {
                    reject(`fetch error ${error.message}`);
                });
        } catch (error) {
            reject(`fetch error ${error.message}`);
        }
    });
}

function isValidUrlFormat(input) {
    return input?.startsWith('ws') && input?.endsWith('/ws');
}

function isValidAccessCodeFormat(input) {
    return input?.length === 4;
}

function setInputValidation(selector, isValid = false) {
    const className = isValid === true ? 'ok' : 'error';

    // toggle state
    $(selector).addClass(className);
    setTimeout(() => {
        $(selector).removeClass(className);
    }, 400);

    // toggle access code state
    if (selector === '#server_url_input') {
        if (isValid === true) {
            $('#settings_access_code').show();
        } else {
            $('#settings_access_code').hide();
        }
    }
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

function getWebServerUrl(url, path) {
    return `${url}`.replace('wss://', 'https://').replace('ws://', 'http://').replace('/ws', path);
}
