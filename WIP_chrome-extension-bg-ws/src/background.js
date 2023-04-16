importScripts(
    'shared.js',
    'background/ws/actions.js',
    'background/ws/events.js',
    'background/events/spy.js',
    'background/events/popup.js',
    'background/init.js'
);

// `POPUP` MESSAGES
chrome.runtime.onMessage.addListener(n01rcu$background$onMessageEventListener);

// INSTALL
chrome.runtime.onInstalled.addListener(n01rcu$background$onInstallEventListener);

// `SPY` MESSAGES
chrome.runtime.onConnect.addListener(n01rcu$background$onConnectEventListener);

// REMOVE
chrome.tabs.onRemoved.addListener(n01rcu$background$onRemovedEventListener);

console.log('[n01.RCU.background] loaded');
