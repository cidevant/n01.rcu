console.log('[n01.RCU.background] loading');

importScripts(
    'shared.js',
    'background/ws/events.js',
    'background/ws/actions.js',
    'background/events/spy.js',
    'background/events/popup.js',
    'background/init.js'
);

// INSTALL
chrome.runtime.onInstalled.addListener(n01rcu$background$onInstallEventListener);

// `SPY` MESSAGES
chrome.runtime.onConnect.addListener(n01rcu$background$onConnectEventListener);

// `POPUP` MESSAGES
chrome.runtime.onMessage.addListener(n01rcu$background$onMessageEventListener);

// REMOVE
// chrome.tabs.onRemoved.addListener(n01rcu$background$onRemovedEventListener);
