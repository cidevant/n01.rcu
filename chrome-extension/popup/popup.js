function onPopupLoadedListener() {
    dispatchToContent({ type: 'GET_CONNECTION_SETTINGS' });
    dispatchToContent({ type: 'GET_CONNECTION_STATUS' });

    $('#connect_button').on('click', async () => {
        const url = $('#server_url_input').val();
        const accessCode = $('#access_code_input').val();
        const validUrl = isValidUrl(url);
        const validCode = isValidAccessCode(accessCode);

        setInputValidation('#server_url_input', validUrl);
        setInputValidation('#access_code_input', validCode);

        if (validUrl && validCode) {
            dispatchToContent({ 
                type: 'SERVER_CONNECT',
                url,
                accessCode,
            });
        }
    });

    $('#disconnect_button').on('click', async () => {
        dispatchToContent({ type: 'SERVER_DISCONNECT' });
    });

    $('#reset_button').on('click', async () => {
        dispatchToContent({ type: 'RESET_CONNECTION_SETTINGS' });
    });
}

// Loaded event
window.removeEventListener('DOMContentLoaded', onPopupLoadedListener);
window.addEventListener('DOMContentLoaded', onPopupLoadedListener, false);

// Events for Popup
chrome.runtime.onMessage.addListener(receivedEventsHandler);
