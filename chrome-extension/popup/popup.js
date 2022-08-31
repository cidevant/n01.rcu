function onPopupLoadedListener() {
    dispatchToContent({ type: 'GET_CONNECTION' });

    $('#connect_button').on('click', async () => {
        const url = $('#server_url_input').val();
        const accessCode = $('#access_code_input').text();
        const validUrl = isValidUrl(url);

        if (validUrl) {
            isValidAccessCode(accessCode, url).then((validCode) => {
                if (validCode) {
                    dispatchToContent({
                        type: 'SERVER_CONNECT',
                        url,
                        accessCode,
                    });
                }
                setInputValidation('#server_url_input', validUrl);
            });
        }
    });

    $('#disconnect_button').on('click', async () => {
        dispatchToContent({ type: 'SERVER_DISCONNECT' });
    });

    $('#reset_button').on('click', async () => {
        dispatchToContent({ type: 'RESET_CONNECTION_SETTINGS' });
    });

    $('#generate_button').on('click', async () => {
        const url = $('#server_url_input').val();
        const validUrl = isValidUrl(url);

        if (validUrl) {
            generateAccessCode()
                .then((code) => {
                    setConnectionFromContent({ accessCode: code });
                    setInputValidation('#access_code_input', true);
                })
                .catch(() => {
                    console.error('[n01.rcu.popup][error] generateAccessCode', error);
                    setInputValidation('#access_code_input', false);
                });
        } else {
            setInputValidation('#server_url_input', false);
        }
    });
}

// Loaded event
window.removeEventListener('DOMContentLoaded', onPopupLoadedListener);
window.addEventListener('DOMContentLoaded', onPopupLoadedListener, false);

// Events for Popup
chrome.runtime.onMessage.addListener(receivedEventsHandler);
