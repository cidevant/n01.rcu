/* eslint-disable no-unused-vars */

let __connection = {
    url: '-url-',
    accessCode: '-accessCode-',
    server: false,
    paired: false,
    searching: false,
    closeCode: null,
    closeReason: null,
};

function receivedEventsHandler({ __type, ...data }, _sender, _sendResponse) {
    if (__type === 'n01rcu.Event.Popup') {
        console.log('[n01.rcu.popup]', JSON.stringify(data));

        switch (data?.type) {
            case 'SET_CONNECTION': {
                setConnectionFromContent(data);
            } break;
            default:
                break;
        }
    }
}

function setConnectionFromContent() {
    __connection = {
        ...__connection,
        ...data,
    };

    delete __connection.type;

    updateConnectionInfo();
}

function updateConnectionInfo() {
    $('#server_status').text(__connection.server ? 'CONNECTED' : 'DISCONNECTED');
    $('#controllers_status').text(__connection.paired ? 'PAIRED' : 'UNPAIRED');
    $('#server_url_input').val(__connection.url).attr('disabled', __connection.server);
    $('#access_code_input').val(__connection.accessCode).attr('disabled', __connection.server);
}

function setInputValidation(selector, isValid = false) {
    const el = $(selector);

    if (el) {
        const className = isValid === true ? 'ok' : 'error';

        el.addClass(className);

        setTimeout(() => {
            el.removeClass(className);
        }, 400);
    }
}

function isValidUrl(input) {
    return input?.startsWith('ws') && input?.endsWith('/ws');
}

function isValidAccessCode(input) {
    return input?.length === 4;
}

/**
 * Sends message to content script of active tab
 *
 * @param {*} payload message body
 * @param {*} onResponseCallback response callback
 */
function dispatchToContent(payload, onResponseCallback) {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }).then(tabs => {
            if (tabs?.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    __type: 'n01rcu.Event.Content',
                    ...payload
                }, onResponseCallback);
                resolve();
            } else {
                console.log('[n01.rcu.popup][error] dispatchToContent: active tab id is null');
                reject();
            }
        }).catch(reject);
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
        ...payload
    });
}
