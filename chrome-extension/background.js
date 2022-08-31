/* eslint-disable no-undef */

chrome.runtime.onMessage.addListener(({ __type, ...msg }, _sender, _sendResponse) => {
    if (__type === 'n01rcu.Event.Background') {
        console.log('[n01.rcu.background]', JSON.stringify(msg));

        switch (msg?.type) {
            case 'SET_ICON':
                n01rcu_setIcon(msg);
                break;

            default:
                break;
        }
    }
});

function n01rcu_setIcon(msg) {
    if (msg?.icon?.length > 0) {
        chrome.action.setIcon({
            path: {
                16: `icons/${msg.icon}.png`,
                36: `icons/${msg.icon}.png`,
                48: `icons/${msg.icon}.png`,
                120: `icons/${msg.icon}.png`,
            },
        });
    }
}
