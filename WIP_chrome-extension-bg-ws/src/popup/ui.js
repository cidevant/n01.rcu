/* eslint-disable prefer-destructuring */

/**
 * Internal validation state
 */
const $VALIDATION = {
    url: false,
    accessCode: false,
};

/**
 * Loads UI initial state
 *
 * @returns {Promise<any>} init promise
 */
async function initUI() {
    try {
        const connection = await $SHARED_STORAGE.getConnection();

        $$DEBUG && console.log('[n01.RCU.popup] initUI connectionInfo', connection);

        $VALIDATION.url = connection?.urlValid ?? false;
        $VALIDATION.accessCode = connection?.accessCodeValid ?? false;

        $('#server_url_input').val(connection?.url);
        $('#access_code_input').text(connection?.accessCode);

        await checkEnabledUI();
        await updateUI();
    } catch (error) {
        $$DEBUG && console.log('[n01.RCU.popup][error] initUI', error?.message ?? error);
    }
}

/**
 * Activates/Deactivates popup
 *
 * @param {*} value
 */
async function checkEnabledUI() {
    try {
        if (chrome?.runtime?.id == null || chrome?.tabs?.query == null) {
            throw new Error('no chrome runtime');
        }

        const tabs = await chrome.tabs.query({
            currentWindow: true,
            url: 'https://nakka.com/n01/online/*',
        });
        const value = tabs != null && tabs?.length > 0;

        $$DEBUG && console.log('[n01.RCU.popup] checkEnabledUI', value);

        if (value) {
            $('#UI_table').show();
            $('#UI_disabled').hide();
        } else {
            $('#UI_table').hide();
            $('#UI_disabled').show();

            await $SHARED_BACKGROUND.dispatchToBackground({
                type: $SHARED.actions.SET_ICON,
                payload: {
                    icon: 'default',
                },
            });
        }
    } catch (error) {
        $$DEBUG && console.log('[n01.RCU.popup][error] checkEnabledUI', error?.message ?? error);
    }
}

/**
 * Updates UI to reflect actual state of connection and validation
 */
async function updateUI() {
    const connection = await $SHARED_STORAGE.getConnection();

    // url input disabled
    $('#server_url_input').attr('disabled', connection?.open);

    // handle connected state
    if (connection?.open) {
        // fix local validation state
        if (!$VALIDATION.url || !$VALIDATION.accessCode) {
            $VALIDATION.url = true;
            $VALIDATION.accessCode = true;
        }

        $('#server_status').text('CONNECTED').addClass('ok');
        $('#access_code_input').addClass('disabled');
        $('#connect_button').hide();
        $('#reset_button').hide();
        $('#generate_button').hide();
        $('#validate_url_button').hide();
        $('#disconnect_button').show();

        if (connection?.paired) {
            $('#pairing_status').text('PAIRED').addClass('ok');
        } else {
            $('#pairing_status').text('NOT PAIRED').removeClass('ok');
        }
    } else {
        // handle unconnected state
        $('#server_status').removeClass('ok');
        $('#access_code_input').removeClass('disabled');
        $('#reset_button').show();
        $('#disconnect_button').hide();

        // URL
        if ($VALIDATION.url) {
            $('#settings_access_code').show();
            $('#generate_button').show();
            $('#server_status').text('DISCONNECTED');
            $('#validate_url_button').hide();
            $('#connect_button').show();
        } else {
            $('#server_status').text('NOT CHECKED');
            $('#settings_access_code').hide();
            $('#connect_button').hide();
            $('#validate_url_button').show();
        }

        // ACCESS CODE
        $('#pairing_status').text('').removeClass('ok');

        if ($VALIDATION.accessCode) {
            $('#settings_access_code .value').show();
            $('#settings_access_code .status').show();
            $('#settings_access_code .action').removeClass('left');
        } else {
            if (!$SHARED_VALIDATORS.isValidAccessCodeFormat(connection?.accessCode)) {
                $('#settings_access_code .action').addClass('left');
                $('#settings_access_code .value').hide();
                $('#settings_access_code .status').hide();
            }
        }
    }

    updateErrorsMessages(connection);
}

/**
 * Makes ok/error animation
 *
 * @param {*} selector
 * @param {boolean} [isValid=false]
 */
function animateValidation(key) {
    const selector = key === 'url' ? '#server_url_input' : '#access_code_input';
    const className = $VALIDATION[key] === true ? 'ok' : 'error';

    $(selector).addClass(className);

    setTimeout(() => {
        $(selector).removeClass(className);
    }, 250);
}

/**
 * Shows/hides errors
 */
function updateErrorsMessages(connection) {
    // const hasMessage = (key) => connection[key] !== true && connection[key]?.length > 0;
    // // clear old
    // $('#settings_errors').empty();
    // // add new
    // [
    //     ['$VALIDATION.url', 'Server URL'],
    //     ['$VALIDATION.accessCode', 'Pairing Code'],
    // ].forEach(([key, label]) => {
    //     if (hasMessage(key)) {
    //         const $wrapper = $('<div>', { class: 'settings_error d-flex' });
    //         $('<div>', { class: 'settings_error_label' }).text(label).appendTo($wrapper);
    //         $('<div>', { class: 'settings_error_text' }).text(connection[key]).appendTo($wrapper);
    //         $('#settings_errors').append($wrapper);
    //     }
    // });
}
