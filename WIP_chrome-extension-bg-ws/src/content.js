console.log('[n01.RCU.content] loaded');

init();

function init() {
    // ORDER IS IMPORTANT!
    Promise.resolve()
        // 1. Handles events from `BACKGROUND`, `POPUP`, `CONTENT`
        .then(() => {
            try {
                if (chrome == null || chrome.runtime == null || chrome.runtime.id == null) {
                    throw new Error('no chrome runtime');
                }
                chrome.runtime.onMessage.removeListener(backgroundEventsListener);
                chrome.runtime.onMessage.addListener(backgroundEventsListener);

                return Promise.resolve();
            } catch (error) {
                $$DEBUG && console.log('[n01.RCU.content][background][error]', error.message);

                return Promise.reject();
            }
        })
        // 2. Handles events from `SPY`
        .then(() => {
            document.removeEventListener($SHARED.targets.content, foregroundEventsListener);
            document.addEventListener($SHARED.targets.content, foregroundEventsListener, false);

            return Promise.resolve();
        })
        // [LAST] Injects `SPY` into page context to access functions and variables
        .then(() => {
            return Promise.resolve()
                .then(() => scriptInjector('src/shared.js')) // [FIRST]
                .then(() => scriptInjector('src/spy/providers/data.js'))
                .then(() => scriptInjector('src/spy/providers/user.js'))
                .then(() => scriptInjector('src/spy/providers/search.js'))
                .then(() => scriptInjector('src/spy/providers/game.js'))
                .then(() => scriptInjector('src/spy/events.js'))
                .then(() => scriptInjector('src/spy/spy.js')); // [LAST]
        });
}

/**
 * Proxify events from `WEBSOCKET`, `BACKGROUND`, `POPUP`
 *
 * @param {*} event received event
 */
function backgroundEventsListener(event, _sender, sendResponse) {
    $$DEBUG &&
        $$VERBOSE &&
        $$VERY_VERBOSE &&
        console.log('[n01.RCU.content][background] got event', event);

    // [PROXY] forward event to proper target
    switch (event.__target) {
        case $SHARED.targets.spy:
            $SHARED_FOREGROUND.dispatchToSpy(event);
            break;
    }

    sendResponse();
}

/**
 * Proxify events from `SPY`
 *
 * @param {*} event received event
 */
function foregroundEventsListener({ detail }) {
    try {
        if (chrome == null || chrome.runtime == null || chrome.runtime.id == null) {
            throw new Error('no chrome runtime');
        }

        $$DEBUG &&
            $$VERBOSE &&
            $$VERY_VERBOSE &&
            console.log('[n01.RCU.content][foreground] got event', detail);

        // [PROXY] forward event to proper target
        switch (detail.__target) {
            case $SHARED.targets.background: {
                $SHARED_BACKGROUND.dispatchToBackground({
                    ...detail,
                    payload: detail?.payload?.length > 0 ? JSON.parse(detail.payload) : null,
                });
                break;
            }
        }
    } catch (error) {
        $$DEBUG && console.log('[n01.RCU.content][foreground][error]', error.message);
    }
}

/**
 * Injects script into web page context so we are able to access variables and functions
 *
 * @param {string} path script path
 * @returns {Promise}
 */
function scriptInjector(path) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');

        script.src = chrome.runtime.getURL(path);
        script.onerror = () => reject();
        script.onload = function () {
            this.remove();
            resolve();
        };

        (document.head || document.documentElement).appendChild(script);
    });
}
