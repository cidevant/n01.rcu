console.log('[n01.RCU.content] loaded');

n01rcu$content$init();

let $$BACKGROUND_CONNECTION_PORT = null;

function n01rcu$content$init() {
    // ORDER IS IMPORTANT!
    Promise.resolve()
        // // 1. Forwards messages from `BACKGROUND` to `SPY`
        .then(() => {
            try {
                if (chrome == null || chrome.runtime == null || chrome.runtime.id == null) {
                    throw new Error('no chrome runtime');
                }

                $$BACKGROUND_CONNECTION_PORT = chrome.runtime.connect({
                    name: 'n01.rcu.background',
                });
                $$BACKGROUND_CONNECTION_PORT.onMessage.addListener((message) => {
                    $$DEBUG &&
                        console.log('[n01.RCU.content] got message from BACKGROUND', error.message);

                    $SHARED_BACKGROUND.dispatchToSpy(message);
                });

                return Promise.resolve();
            } catch (error) {
                $$BACKGROUND_CONNECTION_PORT = null;

                $$DEBUG && console.log('[n01.RCU.content][background][error]', error.message);

                return Promise.reject();
            }
        })
        // 2. Forwards messages from `SPY` to `BACKGROUND`
        .then(() => {
            document.removeEventListener(
                $SHARED.targets.content,
                n01rcu$content$spyMessagesListener
            );
            document.addEventListener(
                $SHARED.targets.content,
                n01rcu$content$spyMessagesListener,
                false
            );

            return Promise.resolve();
        })
        // [LAST] Injects `SPY` into page context to access functions and variables
        .then(() => {
            return Promise.resolve()
                .then(() => n01rcu$content$scriptInjector('src/shared.js')) // [FIRST]
                .then(() => n01rcu$content$scriptInjector('src/spy/providers/data.js'))
                .then(() => n01rcu$content$scriptInjector('src/spy/providers/user.js'))
                .then(() => n01rcu$content$scriptInjector('src/spy/providers/search.js'))
                .then(() => n01rcu$content$scriptInjector('src/spy/providers/game.js'))
                .then(() => n01rcu$content$scriptInjector('src/spy/events.js'))
                .then(() => n01rcu$content$scriptInjector('src/spy/spy.js')); // [LAST]
        });
}

/**
 * Proxies events from [`SPY`] to [`BACKGROUND`]
 *
 * @param {*} event received event
 */
function n01rcu$content$spyMessagesListener({ detail }) {
    $$DEBUG &&
        $$VERBOSE &&
        $$VERY_VERBOSE &&
        console.log('[n01.RCU.content] message from SPY', detail);

    try {
        if (chrome == null || chrome.runtime == null || chrome.runtime.id == null) {
            throw new Error('no chrome runtime');
        }

        if (!$$BACKGROUND_CONNECTION_PORT) {
            throw new Error("chrome port doesn't exist");
        }

        // [PROXY] forward event to `BACKGROUND`
        switch (detail.__target) {
            case $SHARED.targets.background: {
                $$BACKGROUND_CONNECTION_PORT.postMessage({
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
function n01rcu$content$scriptInjector(path) {
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
