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
 * Sends message to content script of active tab
 *
 * @param {*} payload message body
 * @param {*} onResponseCallback response callback
 */
async function dispatchToContent(payload, onResponseCallback) {
    const currentTabId = await getActiveTab();
    
    if (currentTabId != null) {
        chrome.tabs.sendMessage(currentTabId, payload, onResponseCallback);
    } else {
        console.log('[n01.rcu.popup][error] sendMessage: active tab id is null');
    }
}
