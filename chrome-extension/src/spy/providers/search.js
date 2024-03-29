const $SEARCH_PROVIDER = $SEARCH_PROVIDER_FACTORY();

let $$SCROLL_BOTTOM = false;
let $$SCROLL_BOTTOM_USER = false;
let $$SEARCH_FILTER = null;
let $$SENDING_SEARCH_RESULT_TIMEOUT = null;

function $$_getScrollBottom() {
    return $$SCROLL_BOTTOM && $$SCROLL_BOTTOM_USER;
}

function $$_setScrollBottom(input) {
    $$SCROLL_BOTTOM = input;
    $$SCROLL_BOTTOM_USER = input;
}

function $$_getSearchFilter() {
    return $$SEARCH_FILTER;
}

function $$_setSearchFilter(input) {
    $$SEARCH_FILTER = input;
}

function $SEARCH_PROVIDER_FACTORY() {
    function reset() {
        $$_setSearchFilter(null);
        $$_setScrollBottom(false);

        clearSendingTimeout();
    }

    function clearSendingTimeout(params) {
        if ($$SENDING_SEARCH_RESULT_TIMEOUT != null) {
            clearTimeout($$SENDING_SEARCH_RESULT_TIMEOUT);
            $$SENDING_SEARCH_RESULT_TIMEOUT = null;
        }
    }

    /**
     * Returns list of user which satisfies search condition
     *
     * @param {Object} searchFilter.from Average score from
     * @param {Object} searchFilter.to Average score to
     * @param {Object} searchFilter.cam Cam only?
     * @returns {Array<object>} list of users
     */
    function getSearchResults(searchFilter) {
        $$DEBUG && $$VERBOSE && console.log('[n01.RCU.spy.search] getSearchResults', searchFilter);

        let notMeSelector = '';

        const { from, to, cam = true } = searchFilter;
        const me = $DATA_PROVIDER.me();
        const returnValue = {
            passedFilter: [],
            notPassedFilter: [],
        };
        const isValidAvgValue = (value) => {
            if (isNaN(value) || (isNaN(from) && isNaN(to))) {
                return true;
            }

            if (isNaN(from) && !isNaN(to)) {
                return value <= to;
            }

            if (!isNaN(from) && isNaN(to)) {
                return value >= from;
            }

            return value >= from && value <= to;
        };

        // Don't include myself into search results
        if (me && me.pid) {
            notMeSelector = `[id!="${me.pid}"]`;
        }

        // Filter by avg score value
        $(`.user_list_item${notMeSelector}`).each((_index, user) => {
            const userEl = $(user);
            const avgValue = parseFloat(
                userEl.find('.avg_text').text().replace(' (', '').replace(')', '')
            );
            const average = isNaN(avgValue) ? null : avgValue;
            const playerId = userEl.attr('id');
            const isSearching = userEl
                .find('input[type="button"][value="Play"].play_button')
                .is(':visible');
            const camEnabled = userEl.find('.webcam').is(':visible');
            const camFilter = cam === false ? true : camEnabled;
            const legsMessage = userEl.find('.legs_msg').text();

            if ($SHARED_VALIDATORS.isValidPlayerId(playerId)) {
                if (isSearching && camFilter) {
                    // Filter by params
                    if (!isNaN(from) || !isNaN(to)) {
                        if (isValidAvgValue(avgValue)) {
                            returnValue.passedFilter.push({
                                id: playerId,
                                name: userEl.find('.user_list_name_text').text(),
                                average,
                                cam: camEnabled,
                                legs: legsMessage,
                            });
                        } else {
                            returnValue.notPassedFilter.push({
                                id: playerId,
                                name: userEl.find('.user_list_name_text').text(),
                                average,
                                cam: camEnabled,
                                legs: legsMessage,
                            });
                        }
                    } else {
                        // Add all
                        returnValue.passedFilter.push({
                            id: playerId,
                            name: userEl.find('.user_list_name_text').text(),
                            average,
                            cam: camEnabled,
                            legs: legsMessage,
                        });
                    }
                } else {
                    // not playing or no cam
                    returnValue.notPassedFilter.push({
                        id: playerId,
                        name: userEl.find('.user_list_name_text').text(),
                        average,
                        cam: camEnabled,
                        legs: legsMessage,
                    });
                }
            }
        });

        return returnValue;
    }

    /**
     *  Throttled sending of search results
     *
     * @param {boolean} [force=false] Disables throttling
     */
    function sendSearchResults(force = false) {
        if ($$_getSearchFilter() != null) {
            if (force) {
                clearSendingTimeout();
                wsSendSearchResults($$_getSearchFilter());
            } else if ($$SENDING_SEARCH_RESULT_TIMEOUT == null) {
                // Don't spam server, send updates only once in 2 seconds
                $$SENDING_SEARCH_RESULT_TIMEOUT = setTimeout(() => {
                    wsSendSearchResults($$_getSearchFilter());
                    $$SENDING_SEARCH_RESULT_TIMEOUT = null;
                }, 2000);
            }
        }
    }

    /**
     * Sends search data over WEBSOCKET to CONTROLLERS
     *
     * @param {Array<Object>} data Search results
     */
    function wsSendSearchResults(data) {
        const { activity } = $DATA_PROVIDER.activity();

        if (activity === 'search') {
            try {
                $SHARED_FOREGROUND.dispatchToContent({
                    type: $SHARED.actions.WEBSOCKET_SEND,
                    payload: {
                        type: 'CONTROLLERS:SEARCH_PAGE_FILTER_BY_AVERAGE_RESULT',
                        payload: [...(getSearchResults(data)?.passedFilter ?? [])].reverse(),
                    },
                });
                scrollToBottom();
            } catch (error) {
                console.log('[n01.RCU.spy.search][error] search', error?.message ?? error);
            }
        } else {
            console.log(
                '[n01.RCU.spy.search][error] search',
                `activity must be "search", but got "${activity}"`
            );
        }
    }

    /**
     * Sets auto scroll parameter
     *
     * @param {boolean} [payload=true] is autoscroll enabled
     */
    function setScrollBottom(payload = true) {
        const changed = $$_getScrollBottom() !== payload;

        $$_setScrollBottom(payload);

        if (changed) {
            scrollToBottom();
        }
    }

    /**
     * Scrolls down on search page if enabled
     */
    function scrollToBottom() {
        if ($$_getScrollBottom() === true) {
            try {
                $('#schedule_button').hide();
                // $('#page_bottom').hide();
                // $('#chat_button').hide();
                $('#button_history').hide();
                $('#share').hide();
                $('#menu_button').hide();
                $('#article').css('padding-bottom', 0);
                $('#article').css('margin-bottom', 0);
                scroll_bottom();
            } catch (error) {
                $$DEBUG &&
                    console.log(
                        '[n01.RCU.spy.search][error] scrollToBottom',
                        error?.message ?? error
                    );
            }
        }
    }

    /**
     * Checks if new search filter is same as existing search filter (if any exists)
     *
     * @param {Object} data search filter
     * @returns {boolean} is same?
     */
    function isSearchFilterChanged(newFilter) {
        if ($$_getSearchFilter() != null) {
            try {
                const newFilterString = JSON.stringify(newFilter);
                const previousFilterString = JSON.stringify($$_getSearchFilter());

                return newFilterString !== previousFilterString;
            } catch (error) {
                $$DEBUG &&
                    $$VERBOSE &&
                    console.log(
                        '[n01.RCU.spy.search][error] isSearchFilterChanged',
                        error?.message ?? error
                    );

                return false;
            }
        }

        return false;
    }

    /**
     * Filters opponents by avg score
     */
    function search(data, ws) {
        const changed = isSearchFilterChanged(data);

        $$_setSearchFilter(data);

        sendSearchResults(changed);
    }

    /**
     * Watches n01 native functions invocations and intercepts them
     *
     * @returns {*}
     */
    function watchNativeSearchFunctions() {
        return {
            // players list changed
            createDiffList: function (data, changedCount) {
                $$DEBUG && $$VERBOSE && console.log('[n01.RCU.spy.search] createDiffList');

                if (changedCount > 0) {
                    sendSearchResults();
                }
            },
        };
    }

    return {
        reset,
        search,
        scroll: setScrollBottom,
        native: watchNativeSearchFunctions,
    };
}
