const $SEARCH_PROVIDER = $SEARCH_PROVIDER_FACTORY();

let $$SCROLL_BOTTOM = false;
let $$SEARCH_FILTER = null;
let $$PREVIOUS_SEARCH_RESULT = null;
let $$SENDING_SEARCH_RESULT = false;
let $$SENDING_SEARCH_RESULT_TIMEOUT = null;

function $SEARCH_PROVIDER_FACTORY() {
    function reset() {
        $$SEARCH_FILTER = null;
        $$PREVIOUS_SEARCH_RESULT = null;
        $$SCROLL_BOTTOM = false;

        if ($$SENDING_SEARCH_RESULT_TIMEOUT != null) {
            clearTimeout($$SENDING_SEARCH_RESULT_TIMEOUT);
            $$SENDING_SEARCH_RESULT_TIMEOUT = null;
        }

        $$SENDING_SEARCH_RESULT = false;
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
     * Safely sends search data over WEBSOCKET to CONTROLLERS
     *
     * Safety checks:
     *      * search data are same as sent previously
     *      * already sending search data
     *
     * @param {boolean} [force=false] If true -> ignore safety checks
     */
    function sendSearchResults(force = false) {
        if (force) {
            // Don't spam server, send updates only once in 2 seconds
            if ($$SEARCH_FILTER != null && $$SENDING_SEARCH_RESULT === false) {
                $$SENDING_SEARCH_RESULT = true;
                $$SENDING_SEARCH_RESULT_TIMEOUT = setTimeout(() => {
                    wsSendSearchResults($$SEARCH_FILTER);
                    $$SENDING_SEARCH_RESULT = false;
                }, 2000);
            }
        } else {
            if (
                $$SEARCH_FILTER != null &&
                $$SENDING_SEARCH_RESULT === false &&
                $$PREVIOUS_SEARCH_RESULT == null
            ) {
                wsSendSearchResults($$SEARCH_FILTER);
            }
        }
    }

    /**
     * Sends search data over WEBSOCKET to CONTROLLERS
     *
     * @param {*} data
     */
    function wsSendSearchResults(data) {
        try {
            const { activity } = $DATA_PROVIDER.activity();

            if (activity === 'search') {
                const searchResult = [...(getSearchResults(data)?.passedFilter ?? [])].reverse();

                if ($$PREVIOUS_SEARCH_RESULT == null || searchResult !== $$PREVIOUS_SEARCH_RESULT) {
                    $$PREVIOUS_SEARCH_RESULT = JSON.stringify(searchResult);

                    $SHARED_FOREGROUND.dispatchToContent({
                        type: $SHARED.actions.WEBSOCKET_SEND,
                        payload: {
                            type: 'CONTROLLERS:SEARCH_PAGE_FILTER_BY_AVERAGE_RESULT',
                            payload: searchResult,
                        },
                    });
                }

                scrollToBottom();
            } else {
                throw new Error(`activity must be "search", but got "${activity}"`);
            }
        } catch (error) {
            console.log('[n01.RCU.spy.search][error] search', error?.message ?? error);
        }
    }

    /**
     * Sets auto scroll parameter
     *
     * @param {boolean} [payload=true] is autoscroll enabled
     */
    function setScrollBottom(payload = true) {
        const changed = $$SCROLL_BOTTOM !== payload;

        $$SCROLL_BOTTOM = payload;

        if (changed) {
            scrollToBottom();
        }
    }

    /**
     * Scrolls down on search page when there are any updates
     */
    function scrollToBottom() {
        if ($$SCROLL_BOTTOM === true) {
            try {
                $('#schedule_button').hide();
                $('#page_bottom').hide();
                $('#chat_button').hide();
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
     * @param {*} data
     * @returns {boolean} is same?
     */
    function isSearchFilterChanged(newFilter) {
        if ($$SEARCH_FILTER != null) {
            try {
                const newFilterString = JSON.stringify(newFilter);
                const previousFilterString = JSON.stringify($$SEARCH_FILTER);

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

        $$SEARCH_FILTER = data;

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

                sendSearchResults(changedCount > 0);
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
