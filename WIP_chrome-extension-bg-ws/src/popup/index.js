window.addEventListener('DOMContentLoaded', async function popupLoadedCallback() {
    initUI();

    $('#server_url_input')
        .off()
        .on('input', () => {
            $VALIDATION.url = false;
            $VALIDATION.accessCode = false;

            updateUI();
        });

    $('#connect_button').on('click', async () => {
        $$DEBUG && $$VERBOSE && console.log('[n01.RCU.popup] #connect_button');

        const url = $('#server_url_input').val();
        const accessCode = $('#access_code_input').text();

        await tryToConnect(url, accessCode);
    });

    $('#generate_button').on('click', async () => {
        $$DEBUG && $$VERBOSE && console.log('[n01.RCU.popup] #generate_button');

        const url = $('#server_url_input').val();

        try {
            const code = await $SHARED_HELPERS.generateAccessCode(url);

            $VALIDATION.accessCode = true;
            animateValidation('accessCode');

            $('#access_code_input').text(code);
        } catch (_) {
            $VALIDATION.accessCode = false;
            animateValidation('accessCode');
        }

        await updateUI();
    });

    $('#validate_url_button').on('click', async () => {
        $$DEBUG && $$VERBOSE && console.log('[n01.RCU.popup] #validate_url_button');

        const url = $('#server_url_input').val();

        try {
            await $SHARED_VALIDATORS.validateUrl(url);

            $VALIDATION.url = true;

            const connection = await $SHARED_STORAGE.getConnection();

            // try to connect with stored accessCode
            if ($SHARED_VALIDATORS.isValidAccessCodeFormat(connection.accessCode)) {
                // will animate url validation
                tryToConnect(url, connection.accessCode);
            } else {
                // animate url validation if no connection attempt
                animateValidation('url');
            }
        } catch (_) {
            $VALIDATION.url = false;
            animateValidation('url');
        }

        await updateUI();
    });

    $('#disconnect_button').on('click', async () => {
        $$DEBUG && $$VERBOSE && console.log('[n01.RCU.popup] #disconnect_button');

        const reason = $BACKGROUND_WEBSOCKET.closeErrors['4050'];

        await $SHARED_BACKGROUND.dispatchToBackground({
            type: $SHARED.actions.WEBSOCKET_DISCONNECT,
            payload: {
                code: reason.code,
                reason: reason.text,
            },
        });
    });

    $('#open_nakka_button').on('click', async () => {
        $$DEBUG && $$VERBOSE && console.log('[n01.RCU.popup] #open_nakka_button');

        chrome?.tabs?.create?.({
            url: 'https://nakka.com/n01/online/',
        });
    });
});

chrome.runtime.onMessage.addListener(async (event, _sender, sendResponse) => {
    if (event.__target === $SHARED.targets.popup) {
        $$DEBUG && $$VERBOSE && $$VERY_VERBOSE && console.log('[n01.RCU.popup] got event', event);

        await checkEnabledUI();

        switch (event.type) {
            case $SHARED.actions.WEBSOCKET_CONNECTION_OPEN: {
                $VALIDATION.url = true;
                $VALIDATION.accessCode = true;

                await $SHARED_STORAGE.updateConnection({
                    urlValid: true,
                    accessCodeValid: true,
                });
                await updateUI();
                break;
            }
            default:
                await updateUI();
                break;
        }
    }

    sendResponse();
});

/**
 * Tries to connect to websocket server
 *
 * @param {*} url
 * @param {*} accessCode
 * @returns {Promise<any>}
 */
async function tryToConnect(url, accessCode) {
    $$DEBUG &&
        $$VERBOSE &&
        $$VERY_VERBOSE &&
        console.log('[n01.RCU.popup] tryToConnect', url, accessCode);

    // check url
    try {
        await $SHARED_VALIDATORS.validateUrl(url);

        try {
            await $SHARED_VALIDATORS.validateAccessCode(url, accessCode);

            $VALIDATION.accessCode = true;
            animateValidation('accessCode');

            await $SHARED_STORAGE.updateConnection({
                url,
                accessCode,
                urlValid: true,
                accessCodeValid: true,
            });
            await $SHARED_BACKGROUND.dispatchToBackground({
                type: $SHARED.actions.WEBSOCKET_CONNECT,
            });
        } catch (errorAccessCode) {
            $$DEBUG &&
                console.log(
                    '[n01.RCU.popup][error] tryToConnect validateAccessCode',
                    errorAccessCode?.message ?? errorAccessCode
                );

            $VALIDATION.accessCode = false;
            animateValidation('accessCode');
        }
    } catch (errorUrl) {
        $$DEBUG &&
            console.log(
                '[n01.RCU.popup][error] tryToConnect validateUrl',
                errorUrl?.message ?? errorUrl
            );

        $VALIDATION.url = false;
        animateValidation('url');
    }

    await updateUI();
}
