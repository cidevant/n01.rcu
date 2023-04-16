importScripts(
    'shared.js',
    'background/ws/index.js',
    'background/ws/actions.js',
    'background/ws/events.js',
    'background/events/spy.js',
    'background/init.js'
);

// INSTALL
chrome.runtime.onInstalled.addListener(n01rcu$background$onInstallEventListener);

// `SPY` CONNECTION
chrome.runtime.onConnect.addListener(n01rcu$background$onConnectEventListener);

// REMOVE
chrome.tabs.onRemoved.addListener(n01rcu$background$onRemovedEventListener);

console.log('[n01.RCU.background] loaded');
