function onPopupLoadedListener() {
    dispatchToContent({ type: 'GET_CONNECTION' });

    $('#connect_button').on('click', async () => {
        const url = $('#server_url_input').val();
        const accessCode = $('#access_code_input').text();

        try {
            // set url valid
            await validateUrl(url);
            setInputValidation('#server_url_input', true);
            setConnection({
                url,
                urlValid: true,
            });

            try {
                // set accessCode valid
                await validateAccessCode(url, accessCode);
                setInputValidation('#access_code_input', true);
                setConnection({
                    accessCode,
                    accessCodeValid: true,
                });

                // connect to server
                dispatchToContent({
                    type: 'SERVER_CONNECT',
                    url,
                    accessCode,
                });
            } catch (errorCode) {
                // set accessCode invalid
                setInputValidation('#access_code_input', false);
                setConnection({
                    accessCode,
                    accessCodeValid: errorCode,
                });
            }
        } catch (errorUrl) {
            // set url invalid
            setConnection({
                url,
                urlValid: errorUrl,
                accessCode: '',
                accessCodeValid: false,
            });
            setInputValidation('#server_url_input', false);
        }
    });

    $('#generate_button').on('click', async () => {
        const connection = getConnection();

        if (connection.urlValid === true) {
            try {
                // generate valid accessCode
                const newAccessCode = await generateAccessCode(connection.url);

                setConnection({
                    accessCode: newAccessCode,
                    accessCodeValid: true,
                });
                setInputValidation('#access_code_input', true);
            } catch (errorCode) {
                // accessCode generation failed
                console.error('[n01.rcu.popup][error] generateAccessCode', errorCode);
            }
        } else {
            setInputValidation('#server_url_input', false);
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
