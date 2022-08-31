const __connection = {
    status: {
        server: false,
        paired: false,
        searching: false,
        close: {
            code: null,
            reason: null,
        },
    },
    settings: {
        url: 'url',
        accessCode: 'accessCode',
    },
}

function setConnectionStatus(data) {
    __connection.status = {
        ...__connection.status,
        ...data,
    };

    $('#server_status').text(__connection.status.server ? 'CONNECTED' : 'DISCONNECTED');
    $('#controllers_status').text(__connection.status.paired ? 'PAIRED' : 'UNPAIRED');
}

function setConnectionSettings(data) {
    __connection.settings = {
        ...__connection.settings,
        ...data,
    };

    $('#server_url_input').val(__connection.settings.url);
    $('#access_code_input').val(__connection.settings.accessCode);
}

function receivedEventsHandler({ __type, ...data }, _sender, _sendResponse) {
    if (__type === 'n01rcu.Event.Popup') {
        console.log('[n01.rcu.popup]', JSON.stringify(data));

        switch (data?.type) {
            case 'SET_CONNECTION_STATUS':
                setConnectionStatus(data);
                break;
            case 'SET_CONNECTION_SETTINGS':
                setConnectionSettings(data);
                break;
            default:
                break;
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
        chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
            if (tabs?.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, { __type: 'n01rcu.Event.Content', ...payload }, onResponseCallback);
                resolve();
            } else {
                console.log('[n01.rcu.popup][error] dispatchToContent: active tab id is null');
                reject();
            }
        }).catch(reject);
    })
}

/**
 * Sends message to background
 *
 * @param {*} payload
 */
function dispatchToBackground(payload) {
    chrome.runtime.sendMessage({ __type: 'n01rcu.Event.Background', ...payload });
}

function setInputValidation(selector, isValid = false) {
    const el = $(selector);
    
    if (el) {
        const className = isValid === true ? 'ok' : 'error';

        el.addClass(className);

        setTimeout(() => {
            el.removeClass(className);
        }, 200);
    }
}

function isValidUrl(input) {
    return input?.startsWith('ws') && input?.endsWith('/ws');

}

function isValidAccessCode(input) {
    return input?.length === 4;
}
