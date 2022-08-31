function onPopupLoadedListener() {
    dispatchToContent({ type: 'GET_CONNECTION_SETTINGS' });
    dispatchToContent({ type: 'GET_CONNECTION_STATUS' });

    $('#save_button').on('click', async () => {
        const url = $('#server_url_input').val();
        const accessCode = $('#access_code_input').val();
        const validUrl = isValidUrl(url);
        const validCode = isValidAccessCode(accessCode);

        if (validUrl && validCode) {
            dispatchToContent({
                type: 'SET_CONNECTION_SETTINGS',
                url,
                accessCode,
            });
        }

        setInputValidation('#server_url_input', validUrl);
        setInputValidation('#access_code_input', validCode);
    });

    $('#connect_button').on('click', async () => {
        dispatchToContent({ type: 'CONNECT' });
    });

    $('#disconnect_button').on('click', async () => {
        dispatchToContent({ type: 'DISCONNECT' });
    });
}

// Loaded event
window.removeEventListener('DOMContentLoaded', onPopupLoadedListener);
window.addEventListener('DOMContentLoaded', onPopupLoadedListener, false);

// Events for Popup
chrome.runtime.onMessage.addListener(receivedEventsHandler);
