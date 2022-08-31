window.addEventListener('DOMContentLoaded', () => {
    $('#submit_button').on('click', async () => {
        await sendMessage({ test: 'DATA' });
    })

    chrome.runtime.onMessage.addListener(({ __type, ...msg }, _sender, _sendResponse) => {
        if (__type === 'n01rcu.Event.Popup.Out') {
            console.log('[n01.rcu.popup]', JSON.stringify(msg));
    
            switch (msg?.type) {
                case '':
                    break;
    
                default:
                    break;
            }
        }
    });
});
