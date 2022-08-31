function popupListener(params) {
    const server_status = $('#server_status');
    const controllers_status = $('#controllers_status');
    const server_url_input = $('#server_url_input');
    const access_code_input = $('#access_code_input');
    const submit_button = $('#submit_button');
    
    
    // await dispatchToContent({ type: 'GET_CONNECTION_STATUS' });
    // await dispatchToContent({ type: 'GET_CONNECTION_SETTINGS' });
    
    submit_button.on('click', async () => {
        console.log('===================> fetching data');
        await dispatchToContent({ type: 'GET_CONNECTION_STATUS' });
        await dispatchToContent({ type: 'GET_CONNECTION_SETTINGS' });
        // const url = server_url_input.val();
        // const accessCode = access_code_input.val();
        
        // if (isValidUrl(url) && isValidAccessCode(accessCode)) {
        //     await dispatchToContent({ 
        //         type: 'SET_CONNECTION_SETTINGS',
        //         url,
        //         accessCode,
        //     });
        // }
    });
}

window.removeEventListener('DOMContentLoaded', popupListener);
window.addEventListener('DOMContentLoaded', popupListener, false);

// Listen for events
chrome.runtime.onMessage.addListener(({ __type, ...data }, _sender, _sendResponse) => {
    if (__type === 'n01rcu.Event.Popup' ) {
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
