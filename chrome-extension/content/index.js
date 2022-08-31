/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const n01rcu_ws = new n01rcu_WebSocketClient();

// When window loaded
window.onload = () => {
    // received events
    document.addEventListener('n01rcu.Event.Content', n01rcu_ToContentEventsHandler(n01rcu_ws));
    
    // ws setup
    n01rcu_ws.onopen = () => {
        n01rcu_changeExtensionIcon('connected');
        n01rcu_startMatchUpdater(n01rcu_ws);
        n01rcu_reportConnectionToPopup(n01rcu_ws);
    };
    n01rcu_ws.onmessage = (event) => {
        n01rcu_onWsMessage(JSON.parse(event.data), n01rcu_ws);
    };
    n01rcu_ws.onclose = () => {
        n01rcu_stopMatchUpdater();
        n01rcu_PAIRED = false;
        n01rcu_reportConnectionToPopup(n01rcu_ws);
    };
    n01rcu_ws.onerror = () => {
        n01rcu_changeExtensionIcon('failed');
    };

    // connect
    if (n01rcu_shouldConnect()) {
        setTimeout(() => {   
            n01rcu_ws.connect();
        }, 100);
    }

    // wrap
    n01rcu_addFunctionsWrappers(n01rcu_wrapperFunctions, n01rcu_backupFunctions);
};

// Before window close
window.onbeforeunload = () => {
    document.removeEventListener('n01rcu.Event.Content', n01rcu_ToContentEventsHandler(n01rcu_ws));
    n01rcu_ws.disconnect(1000, 'window unload');
    n01rcu_stopMatchUpdater();
    n01rcu_changeExtensionIcon('default');
    n01rcu_removeFunctionsWrappers(n01rcu_wrapperFunctions, n01rcu_backupFunctions);
};
