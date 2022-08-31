function popupListener() {
    const server_status = $('#server_status');
    const controllers_status = $('#controllers_status');
    const server_url_input = $('#server_url_input');
    const access_code_input = $('#access_code_input');
    const save_button = $('#save_button');
    const connect_button = $('#connect_button');
    const disconnect_button = $('#disconnect_button');

    dispatchToContent({ type: 'GET_CONNECTION_STATUS' });
    dispatchToContent({ type: 'GET_CONNECTION_SETTINGS' });

    save_button.on('click', async () => {
        const url = server_url_input.val();
        const accessCode = access_code_input.val();

        if (isValidUrl(url) && isValidAccessCode(accessCode)) {
            dispatchToContent({
                type: 'SET_CONNECTION_SETTINGS',
                url,
                accessCode,
            });
        } else {
            console.error('invalid url or access code');
        }
    });

    connect_button.on('click', async () => {
        dispatchToContent({ type: 'CONNECT' });
    });

    disconnect_button.on('click', async () => {
        dispatchToContent({ type: 'DISCONNECT' });
    });
}

// Loaded event
window.removeEventListener('DOMContentLoaded', popupListener);
window.addEventListener('DOMContentLoaded', popupListener, false);

// Events for Popup
chrome.runtime.onMessage.addListener(({ __type, ...data }, _sender, _sendResponse) => {
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
});
