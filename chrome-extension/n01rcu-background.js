/* eslint-disable no-undef */

chrome.runtime.onMessage.addListener(function (msg, _sender, _sendResponse) {
//   console.log('[n01.rcu.background] received message', JSON.stringify(msg));

  switch (msg.type) {
    case 'SET_ICON':
      n01rcu_setIcon(msg);
      break;

    default:
      break;
  }
});

function n01rcu_setIcon(msg) {
  if (msg != null && typeof msg === 'object') {
    // console.log(`[n01.rcu.background] changing icon to ${msg.icon}`);

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
