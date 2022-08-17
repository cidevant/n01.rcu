/* eslint-disable no-undef */

if (!window.nakka_n01_rcu) {
  window.nakka_n01_rcu = {
    state: {
      currentIcon: 'default',
      init: {
        background: true,
      },
    },
  };
}

chrome.runtime.onMessage.addListener(function (msg, _sender, _sendResponse) {
  console.log('[n01.obs.background] received action', JSON.stringify(msg));

  switch (msg.action) {
    case 'updateIcon':
      updateMessage(msg);
      break;

    default:
      break;
  }
});

function updateMessage(msg) {
  if (msg != null && typeof msg === 'object') {
    nakka_n01_rcu.state.currentIcon = msg.icon;

    console.log(`[n01.obs.background] changing icon to ${msg.icon}`);

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
