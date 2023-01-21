/**
 * Handles events received from `WEBSOCKET`, `BACKGROUND`, `POPUP`, `CONTENT`
 *
 * @param {*} event
 */
async function backgroundEventsListener({ detail }) {
    const { type, payload, ...rest } = detail;

    $$DEBUG && $$VERBOSE && console.log('[n01.RCU.spy] got event', detail);

    switch (type) {
        case $SHARED.actions.GET_DATA: {
            await $SHARED_FOREGROUND.dispatchToBackground({
                type: $SHARED.actions.SET_DATA,
                payload: $DATA_PROVIDER.all(),
            });
            break;
        }
        case $SHARED.actions.WEBSOCKET_MESSAGE: {
            try {
                wsMessageEventsHandler({
                    type,
                    payload: detail?.payload?.length > 0 ? JSON.parse(detail.payload) : null,
                });
            } catch (error) {
                $$DEBUG &&
                    console.log(
                        '[n01.RCU.spy][error] (backgroundEventsListener) WEBSOCKET_MESSAGE',
                        error?.message ?? error
                    );
            }
            break;
        }
        case $SHARED.actions.WATCH_NATIVE_FUNCTIONS: {
            originalFunctionsToWatch = [];
            Object.keys(nativeFunctionsWatchListCallbacks).forEach((name) => {
                originalFunctionsToWatch[name] = window[name];
                window[name] = function wrappedNativeFunction() {
                    try {
                        originalFunctionsToWatch[name].apply(window, arguments);
                        nativeFunctionsWatchListCallbacks?.[name]?.apply?.(window, arguments);
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
 * Handles events received from `WEBSOCKET`
 *
 * @param {*} event
 */
async function wsMessageEventsHandler({ payload: { type, payload } }) {
    switch (type) {
        // CONNECTION
        case 'PAIRED':
        case 'UNPAIRED':
            setPaired(type === 'PAIRED');
            break;
        // COMMON
        case 'GET_DATA':
            wsSendData();
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
        case 'SET_INPUT_SCORE':
            $GAME_PROVIDER.score(payload);
            break;
        case 'SET_FINISH_DARTS':
            $GAME_PROVIDER.finish(payload);
            break;
    }
}

/**
 * Manages PAIRED state:
 *      * response with data if paired
 *      * change chrome-extension icon
 *
 * @param {boolean} paired
 */
function setPaired(paired) {
    if (paired) {
        wsSendData();
    }
}

/**
 * Sends collected data to `WEBSOCKET`
 */
function wsSendData() {
    $SHARED_FOREGROUND.dispatchToContent({
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

const nativeFunctionsWatchListCallbacks = {
    ...$SEARCH_PROVIDER.native(),
    ...$GAME_PROVIDER.native(),
};
