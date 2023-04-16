/**
 * Handles messages received from `BACKGROUND`
 *
 * @param {*} event
 */
async function n01rcu$spy$backgroundMessagesHandler({ detail }) {
    const { type, payload, ...rest } = detail;

    $$DEBUG && $$VERBOSE && console.log('[n01.RCU.spy] got event', detail);

    switch (type) {
        // ----------------------------------------------------
        // WEBSOCKET messages

        case $SHARED.actions.WEBSOCKET_MESSAGE: {
            try {
                n01rcu$spy$wsMessageHandler({
                    type,
                    payload: detail?.payload?.length > 0 ? JSON.parse(detail.payload) : null,
                });
            } catch (error) {
                $$DEBUG &&
                    console.log(
                        '[n01.RCU.spy][error] (n01rcu$spy$backgroundMessagesHandler) WEBSOCKET_MESSAGE',
                        error?.message ?? error
                    );
            }
            break;
        }

        // ----------------------------------------------------
        // BACKGROUND

        case $SHARED.actions.GET_DATA: {
            await $SHARED_FOREGROUND.dispatchToBackground({
                type: $SHARED.actions.SET_DATA,
                payload: $DATA_PROVIDER.all(),
            });
            break;
        }
        case $SHARED.actions.WATCH_NATIVE_FUNCTIONS: {
            originalFunctionsToWatch = [];
            Object.keys(n01rcu$spy$nativeFunctionsWatchListCallbacks).forEach((name) => {
                originalFunctionsToWatch[name] = window[name];
                window[name] = function n01rcu$spy$wrappedNativeFunction() {
                    try {
                        originalFunctionsToWatch[name].apply(window, arguments);
                        n01rcu$spy$nativeFunctionsWatchListCallbacks?.[name]?.apply?.(
                            window,
                            arguments
                        );
                    } catch (error) {
                        $$DEBUG &&
                            console.log(
                                `[n01.RCU.spy][error] native function invoke: ${name}`,
                                error
                            );
                    }
                };
            });
            break;
        }
    }
}

/**
 * Handles messages received from `WEBSOCKET`
 *
 * @param {*} event
 */
async function n01rcu$spy$wsMessageHandler({ payload: { type, payload } }) {
    switch (type) {
        // CONNECTION
        case 'PAIRED':
        case 'UNPAIRED':
            {
                if (type === 'PAIRED') {
                    n01rcu$spy$wsSendData();
                }
            }
            break;
        // COMMON
        case 'GET_DATA':
            n01rcu$spy$wsSendData();
            break;
        // SEARCH
        case 'SEARCH_PAGE_SCROLL_BOTTOM':
            $SEARCH_PROVIDER.scroll(payload);
            break;
        case 'SEARCH_PAGE_FILTER_BY_AVERAGE':
            $SEARCH_PROVIDER.search(payload);
            break;
        // GAME
        case 'START_GAME':
            $GAME_PROVIDER.start(payload);
            break;
        case 'EXIT_GAME':
            $GAME_PROVIDER.exit();
            break;
        case 'TOGGLE_STATS':
            $GAME_PROVIDER.toggleStats();
            break;
        case 'REFRESH_PAGE':
            $GAME_PROVIDER.refresh();
            break;
        case 'SET_INPUT_SCORE':
            $GAME_PROVIDER.score(payload);
            break;
        case 'SET_FINISH_DARTS':
            $GAME_PROVIDER.finish(payload);
            break;
    }
}

/**
 * Sends collected data to `WEBSOCKET`
 */
function n01rcu$spy$wsSendData() {
    $SHARED_FOREGROUND.dispatchToBackground({
        type: $SHARED.actions.WEBSOCKET_SEND,
        payload: {
            type: 'CONTROLLERS:SET_DATA',
            payload: $DATA_PROVIDER.all(),
        },
    });
}

/**
 * List of native functions to watch
 *
 * We want to execute our code after those native functions.
 * Native functions are wrapped by our "watching" wrapper `nativeFn = wrapperFn(exec nativeFn, exec "our code")`
 */

const n01rcu$spy$nativeFunctionsWatchListCallbacks = {
    ...$SEARCH_PROVIDER.native(),
    ...$GAME_PROVIDER.native(),
};
