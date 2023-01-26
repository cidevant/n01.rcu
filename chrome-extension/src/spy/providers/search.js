const $SEARCH_PROVIDER = $SEARCH_PROVIDER_FACTORY();

let $$SCROLL_BOTTOM = false;
let $$SEARCH_FILTER = null;
let $$PREVIOUS_SEARCH_RESULT = null;

function $SEARCH_PROVIDER_FACTORY() {
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

    function sendSearchResult(data) {
        try {
            const { activity } = $DATA_PROVIDER.activity();

            if (activity === 'search') {
                const searchResult = [...(getSearchResults(data)?.passedFilter ?? [])].reverse();

                if (searchResult !== $$PREVIOUS_SEARCH_RESULT) {
                    $$PREVIOUS_SEARCH_RESULT = JSON.stringify(searchResult);

                    $SHARED_FOREGROUND.dispatchToContent({
                        type: $SHARED.actions.WEBSOCKET_SEND,
                        payload: {
                            type: 'CONTROLLERS:SEARCH_PAGE_FILTER_BY_AVERAGE_RESULT',
                            payload: searchResult,
                        },
                    });
                }
            } else {
                throw new Error(`activity must be "search", but got "${activity}"`);
            }
        } catch (error) {
            console.log('[n01.RCU.spy.search][error] searchByFilter', error?.message ?? error);
        }
    }

    /**
     * Filters opponents by avg score
     */
    function searchByFilter(data, ws) {
        $$SEARCH_FILTER = data;

        // @TODO remove
        // sendSearchResult(data);
    }

    /**
     * Sets auto scroll parameter
     *
     * @param {boolean} [payload=true] is autoscroll enabled
     */
    function setScrollBottom(payload = true) {
        $$SCROLL_BOTTOM = payload;
    }

    /**
     * Scrolls down on search page when there are any updates
     */
    function scrollToBottom(params) {
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
                    '[n01.RCU.spy.search][error] searchScrollBottom',
                    error?.message ?? error
                );
        }
    }

    function watchNativeSearchFunctions() {
        return {
            // players list changed
            createDiffList: function (data, changedCount) {
                $$DEBUG && $$VERBOSE && console.log('[n01.RCU.spy.search] createDiffList');

                if (changedCount > 0) {
                    if ($$SCROLL_BOTTOM === true) {
                        scrollToBottom();
                    }

                    if ($$SEARCH_FILTER) {
                        sendSearchResult($$SEARCH_FILTER);
                    }
                }
            },
        };
    }

    return {
        search: searchByFilter,
        scroll: setScrollBottom,
        native: watchNativeSearchFunctions,
    };
}
