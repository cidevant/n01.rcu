console.log('[n01.RCU.spy] loaded');

window.onload = () => {
    // Wait a while for a running native scripts to finish their job
    // (not all variables are available now, we have to wait)
    setTimeout(() => {
        // add listeners
        document.removeEventListener($SHARED.targets.spy, backgroundEventsListener);
        document.addEventListener($SHARED.targets.spy, backgroundEventsListener, false);

        // report load finished
        $SHARED_FOREGROUND.dispatchToBackground({ type: $SHARED.actions.SPY_LOADED });
    }, 1500);
};

window.onbeforeunload = () => {
    // remove listener
    document.removeEventListener($SHARED.targets.spy, backgroundEventsListener);

    // report unload started
    $SHARED_FOREGROUND.dispatchToContent({ type: $SHARED.actions.SPY_UNLOAD });
};
