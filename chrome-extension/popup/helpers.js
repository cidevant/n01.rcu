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
}

function isValidUrl(value) {
    return false;
}


function isValidAccessCode(value) {
    return false;
}

/**
 * Sends message to content script of active tab
 *
 * @param {*} payload message body
 * @param {*} onResponseCallback response callback
 */
async function dispatchToContent(payload, onResponseCallback) {
    const currentTabId = await getActiveTab();
    
    if (currentTabId != null) {
        chrome.tabs.sendMessage(currentTabId, {__type: 'n01rcu.Event.Content', ...payload}, onResponseCallback);
    } else {
        console.log('[n01.rcu.popup][error] dispatchToContent: active tab id is null');
    }
}

/**
 * Returns active tab id
 *
 * @returns {?number} id of tab
 */
 async function getActiveTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tabs?.length > 0) {
        return tabs[0].id;
    }

    return null;
}

/**
 * Sends message to background
 *
 * @param {*} payload
 */
function dispatchToBackground(payload) {
    chrome.runtime.sendMessage({ __type: 'n01rcu.Event.Background', ...payload });
}
