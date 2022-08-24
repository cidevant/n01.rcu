/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

let n01rcu_JOIN = false;
let n01rcu_PAIRED = false;

/**
 * Process commands from websocket server
 *
 * @param {*} data Message from server
 * @param {*} ws WebSocket client reference for responding
 */
const n01rcu_onWsMessage = function n01rcu_onWsMessage(data, ws) {
    try {
        switch (data.type) {
            case 'SET_INPUT_SCORE':
                n01rcu_setInputScore(data, ws);
                break;
            case 'SET_FINISH_DARTS':
                n01rcu_setFinishDart(data, ws);
                break;
            case 'PAIRED':
                n01rcu_setPaired(true, ws);
                break;
            case 'UNPAIRED':
                n01rcu_setPaired(false, ws);
                break;
            case 'SEARCH_PAGE_SCROLL_BOTTOM':
                n01rcu_searchScrollBottom();
                break;
            case 'SEARCH_PAGE_FILTER_BY_AVERAGE':
                n01rcu_searchFilterByAverageAndHide(data, ws);
                break;
            case 'SEARCH_PAGE_START_GAME':
                n01rcu_searchStartGame(data, ws);
            default:
                break;
        }
    } catch (error) {
        console.log('[n01.rcu.helpers] onWsMessage error: ', error);
    }
}

/**
 * Returns list of user which satisfies search condition
 *
 * @param {?number} from Average score from
 * @param {?number} to Average score to
 * @returns {Array<object>} list of users
 */
const n01rcu_getSearchResults = function n01rcu_getSearchResults(from, to, cam = true) {
    let notMeSelector = '';

    const me = n01rcu_getPlayer();
    const returnValue = {
        passedFilter: [],
        notPassedFilter: []
    };
    const isValid = (value) => {
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

    // Hide myself
    if (me && me.pid) {
        notMeSelector = `[id!="${me.pid}"]`;
    }

    // Filter by avg score value
    $(`.user_list_item${notMeSelector}`).each((_index, user) => {
        const userEl = $(user);
        const avgValue = parseFloat(userEl.find('.avg_text').text().replace(' (', '').replace(')', ''));
        const average = isNaN(avgValue) ? null : avgValue;
        const playerId = userEl.attr('id');
        const isSearching = userEl.find('input[type="button"][value="Play"].play_button').is(':visible');
        const camFilter = cam === false ? true : userEl.find('.webcam').is(':visible');

        if (n01rcu_isValidPlayerId(playerId)) {
            if (isSearching && camFilter) {
                // Filter by params
                if (!isNaN(from) || !isNaN(to)) {
                    if (isValid(avgValue)) {
                        returnValue.passedFilter.push({
                            id: playerId,
                            name: userEl.find('.user_list_name_text').text(),
                            average,
                        });
                    } else {
                        returnValue.notPassedFilter.push({
                            id: playerId,
                            name: userEl.find('.user_list_name_text').text(),
                            average,
                        });
                    }
                } else {
                    // Add all
                    returnValue.passedFilter.push({
                        id: playerId,
                        name: userEl.find('.user_list_name_text').text(),
                        average,
                    });
                }
            } else {
                // Hide all not playing
                returnValue.notPassedFilter.push({
                    id: playerId,
                    name: userEl.find('.user_list_name_text').text(),
                    average,
                });
            }
        }
    });

    return returnValue;
};

/**
 * Filters opponents by avg score
 *
 * @param {*} data filter conditions: from, to
 * @param {*} ws websocket connection
 */
const n01rcu_searchFilterByAverageAndHide = function n01rcu_searchFilterByAverageAndHide(data, ws) {
    if (join === true) {
        const search = n01rcu_getSearchResults(data?.payload?.from, data?.payload?.to, data?.payload?.cam);
        const me = n01rcu_getPlayer();
    
        // // Hide myself
        // if (me && me.pid) {
        //     $(`.user_list_item[id="${me.pid}"]`).hide();
        // }
    
        // // Hide all who not passed filter
        // search.notPassedFilter.forEach((user) => {
        //     $(`.user_list_item[id="${user.id}"]`).hide();
        // });
    
        // // Show all who passed
        // search.passedFilter.forEach((user) => {
        //     $(`.user_list_item[id="${user.id}"]`).show();
        // });

        ws.send({
            type: 'CONTROLLERS:SEARCH_PAGE_FILTER_BY_AVERAGE_RESULT',
            payload: [...search.passedFilter].reverse(),
        });
    }
};

/**
 * Scrolls down on search page
 *
 */
const n01rcu_searchScrollBottom = function n01rcu_searchScrollBottom() {
    $("#schedule_button").hide();
    $("#menu_button").hide();
    $('#article').css('padding-bottom', 0);
    $('#article').css('margin-bottom', 0);
    scroll_bottom();
}

/**
 * Starts game with opponent
 *
 * @param {*} data
 * @param {*} ws
 */
const n01rcu_searchStartGame = function n01rcu_searchStartGame(data, ws) {
    const userEl = $(`.user_list_item[id="${data['payload']}"]`);
    const playButton = userEl.find('input[type="button"][value="Play"].play_button');

    if (playButton.is(':visible')) {
        playButton.click();
    } else {
        console.log('[n01.rcu.helpers][searchStartGame][error] cant start game with player', data['payload']);
    }
}

/**
 * Sends `ON_SEARCH_PAGE`
 *
 * @param {*} ws
 * @returns {*} 
 */
const n01rcu_sendOnSearchPage = function n01rcu_sendOnSearchPage(ws) {
    const pageType = n01rcu_detectPageType();

    if (pageType === 'search') {
        ws.send({
            type: 'CONTROLLERS:ON_SEARCH_PAGE',
            payload: n01rcu_JOIN,
        });
    }
}

/**
 * Submits player's score received from websocket server
 *
 * @param {*} data input score action
 * @param {*} ws websocket
 */
const n01rcu_setInputScore = function n01rcu_setInputScore(data, ws) {
    try {
        // enter score
        for (const value of `${data.payload}`) {
            inputScore(value);
        }

        // submit score
        $('.score_input').click();

        // respond with score left
        n01rcu_sendScoreLeft(ws);
    } catch (error) {
        console.log('[n01.rcu.helpers] inputScore error: ', error);
    }
}

/**
 * Submits finish darts
 *
 * @param {*} data
 * @param {*} ws
 */
const n01rcu_setFinishDart = function n01rcu_setFinishDart(data, ws) {
    if ($(`#${data['payload']}`).is(':visible')) {
        console.log('[n01.rcu.helpers] setFinishDart ', data);

        $(`#${data['payload']}`).click();
    } else {
        console.log(
            `[n01.rcu.helpers] setFinishDart error: ${data['payload']} not found or is not visible`
        );
    }
}

/**
 * Sends player's left score
 *
 * @param {WebSocket} ws socket connection
 */
const n01rcu_sendScoreLeft = function n01rcu_sendScoreLeft(ws, value) {
    try {
        const score = value ?? n01rcu_getPlayerLeftScore();

        ws.send({
            type: 'CONTROLLERS:SET_SCORE_LEFT',
            payload: score === -1 ? '-' : score,
        });
    } catch (error) {
        console.log('[n01.rcu.helpers] sendScoreLeft error', error);
    }
}

/**
 * Changes icon of extension
 *
 * @param {boolean} [connected=true]
 */
const n01rcu_changeExtensionIcon = function n01rcu_changeExtensionIcon(icon = 'default') {
    setTimeout(function () {
        document.dispatchEvent(
            new CustomEvent('n01rcu.Event', {
                detail: {
                    type: 'SET_ICON',
                    icon,
                },
            })
        );
    }, 0);
}

/**
 * Returns information about player
 *
 * @returns {Object} player info
 */
const n01rcu_getPlayer = function n01rcu_getPlayer() {
    try {
        const user = n01rcu_getLocalStorage('n01_net.onlineOptions');

        if (!user) {
            throw new Error('no player info')
        }

        return {
            ...user,
            playerName: n01rcu_getPlayerName(user),
        }
    } catch (error) {
        console.log('[n01.rcu.helpers] getPlayer error: ', error);

        return {};
    }
}

/**
 * Returns user name
 *
 * @param {Object} user
 * @returns {string} name
 */
const n01rcu_getPlayerName = function n01rcu_getPlayerName(user) {
    if (user?.editName?.length > 0) {
        return user.editName;
    }

    if (user?.gname?.length > 0) {
        return user.gname;
    }

    if (user?.tname?.length > 0) {
        return user.tname;
    }

    if (user?.fname?.length > 0) {
        return user.fname;
    }

    if (user?.playerName?.length > 0) {
        return user.playerName;
    }
}

/**
 * Gets player's position in match
 *
 * @returns {number} index of player (0 or 1)
 */
const n01rcu_getPlayerIndexInMatch = function n01rcu_getPlayerIndexInMatch() {
    try {
        const match = n01rcu_getLocalStorage('n01_net.setData');

        if (match && Array.isArray(match.statsData)) {
            return match.statsData.findIndex((p) => p.me === 1);
        } else {
            throw 'No match data found';
        }
    } catch (error) {
        console.log('[n01.rcu.helpers] getPlayerIndexInMatch error: ', error);

        return -1;
    }
}

/**
 * Gets player's left score
 *
 * @returns {number} left score
 */
const n01rcu_getPlayerLeftScore = function n01rcu_getPlayerLeftScore() {
    try {
        const playerIndex = n01rcu_getPlayerIndexInMatch();

        if (playerIndex > -1) {
            const rounds = currentLegData()?.playerData?.[playerIndex];

            if (Array.isArray(rounds) && rounds?.length > 0) {
                return rounds[rounds.length - 1].left;
            }

            throw 'no data for current leg';
        }

        throw 'bad getPlayerIndexInMatch index';
    } catch (error) {
        console.log('[n01.rcu.helpers] getPlayerLeftScore error: ', error);

        return -1;
    }
}

/**
 * Parses data from localStorage to JSON
 *
 * @param {string} key localStorage key
 * @returns {Object} parsed object
 */
const n01rcu_getLocalStorage = function n01rcu_getLocalStorage(key, shouldParseJSON = true) {
    if (!shouldParseJSON) {
        return localStorage[key];
    }

    try {
        return JSON.parse(localStorage[key]);
    } catch (error) {
        console.log('[n01.rcu.helpers] getLocalStorage error: ', error);

        return {};
    }
}

/**
 * Received 'PAIRED' message
 *
 * @param {boolean} [paired=false]
 * @param {*} ws
 */
const n01rcu_setPaired = function n01rcu_setPaired(paired = false, ws) {
    n01rcu_PAIRED = paired;

    n01rcu_changeExtensionIcon(paired ? 'paired' : 'connected');

    switch (n01rcu_detectPageType()) {
        case 'search':
            n01rcu_sendOnSearchPage(ws);
            break;
        case 'game':
            n01rcu_sendMatchStarted(ws);
            n01rcu_sendScoreLeft(ws);
            break;
        default:
            break;
    }
}

/**
 * Sends `MATCH_STARTED` event to controllers
 *
 * @param {*} ws
 * @returns {*} 
 */
const n01rcu_sendMatchStarted = function n01rcu_sendMatchStarted(ws) {
    const pageType = n01rcu_detectPageType();

    let result = false;

    if (pageType === 'game') {
        result = ws.send({
            type: 'CONTROLLERS:MATCH_START',
            payload: n01rcu_getLocalStorage('n01_net.setData')
        });
    }

    return result;
}

/**
 * Wraps n01 function to get notified when function is called
 *
 * @param {*} wrapperFunctions
 * @param {*} backupFunctions
 */
const n01rcu_addFunctionsWrappers = function n01rcu_addFunctionsWrappers(wrapperFunctions, backupFunctions) {
    Object.keys(wrapperFunctions).forEach((fnName) => {
        backupFunctions[fnName] = window[fnName];
        window[fnName] = function () {
            backupFunctions[fnName].apply(window, arguments);
            wrapperFunctions[fnName].apply(window, arguments);
        };
    });
}

/**
 * Remove n01 function wrappers
 *
 * @param {*} wrapperFunctions
 * @param {*} backupFunctions
 */
const n01rcu_removeFunctionsWrappers = function n01rcu_removeFunctionsWrappers(wrapperFunctions, backupFunctions) {
    Object.keys(wrapperFunctions).forEach((fnName) => {
        window[fnName] = backupFunctions[fnName];
    });
}

let n01rcu_matchUpdater;
let n01rcu_matchUpdaterLastMessage;

/**
 * Reports match updates
 *
 * @param {*} ws
 */
const n01rcu_startMatchUpdater = function n01rcu_startMatchUpdater(ws) {
    const pageType = n01rcu_detectPageType();

    if (ws.open && pageType === 'game') {
        console.log('[n01.rcu.helpers] startMatchUpdater');

        const result = n01rcu_sendMatchStarted(ws);

        if (n01rcu_matchUpdater !== null) {
            clearInterval(n01rcu_matchUpdater);
            n01rcu_matchUpdater = null;
        }

        if (result) {
            n01rcu_matchUpdater = setInterval(() => {
                const matchResultString = n01rcu_getLocalStorage('n01_net.setData', false);

                if (matchResultString && matchResultString !== n01rcu_matchUpdaterLastMessage) {
                    try {
                        ws.send({
                            type: 'CONTROLLERS:UPDATE_MATCH',
                            payload: JSON.parse(matchResultString),
                        });
                    } catch (error) {
                        console.log('[n01.rcu.helpers][error] startMatchUpdater', error);
                    }

                    n01rcu_matchUpdaterLastMessage = matchResultString
                }
            }, 5000);
        }
    }
}

/**
 * Stops reporting match updates
 *
 * @param {*} ws
 */
const n01rcu_stopMatchUpdater = function n01rcu_stopMatchUpdater(ws) {
    if (n01rcu_matchUpdater !== null) {
        console.log('[n01.rcu.helpers] stopMatchUpdater');

        clearInterval(n01rcu_matchUpdater);
        n01rcu_matchUpdater = null;
        n01rcu_matchUpdaterLastMessage = null;
    }
}

/**
 * Detects type of page
 *
 * @returns {?string} 'game' or 'search'
 */
const n01rcu_detectPageType = function n01rcu_detectPageType() {
    const path = window.location.pathname;

    if (path === '/n01/online/n01.php') {
        return 'game';
    }

    if (path === '/n01/online/') {
        return 'search';
    }

    return null;
}

/**
 * Checks if we should connect to websocket server
 *
 * @returns {*} 
 */
const n01rcu_shouldConnect = function n01rcu_shouldConnect() {
    const player = n01rcu_getPlayer();
    const type = n01rcu_detectPageType();

    if (player.sid) {
        switch (type) {
            case 'search':
                return true;
            case 'game':
                return true;
        }
    }

    return false;
}


/**
 * Validates player id
 *
 * @param {string} id player id
 * @returns {boolean} is valid?
 */
const n01rcu_isValidPlayerId = function n01rcu_isValidPlayerId(id) {
    if (!id || id?.length !== 22) {
        return false;
    }

    const splitId = `${id}`.split('_');

    if (splitId.length !== 2) {
        return false;
    }

    return splitId[0].length === 8 && splitId[1].length === 13;
}
