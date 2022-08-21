/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

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
                n01rcu_sendMatchStarted(ws);
                n01rcu_setPaired(true, ws);
                break;
            case 'UNPAIRED':
                n01rcu_setPaired(false, ws);
                break;
            case 'SEARCH_SCROLL_BOTTOM':
                n01rcu_searchScrollBottom();
                break;
            case 'SEARCH_FILTER_BY_SCORE':
                n01rcu_searchFilterByScore(data, ws);
                break;
            default:
                break;
        }
    } catch (error) {
        console.log('[n01.rcu.helpers] onWsMessage error: ', error);
    }
}

/**
 * Filters opponents by avg score
 *
 * @param {*} data
 * @param {*} ws
 */
const n01rcu_searchFilterByScore = function n01rcu_searchFilterByScore(data, ws) {
    // Hide myself
    let notMeSelector = '';

    const { from = 30, to = 100 } = data['payload'];
    const me = n01rcu_getPlayer();
    const result = [];

    if (me && me.pid) {
        notMeSelector = `[id!="${me.pid}"]`;

        $(`.user_list_item[id="${me.pid}"]`).hide();
    }

    // Filter by avg score value
    $(`.user_list_item:visible${notMeSelector}`).each((_index, user) => {
        const userEl = $(user);
        const avgText = userEl.find('.avg_text').text();
        const avgValue = parseFloat(avgText.replace(' (', '').replace(')', ''));

        if (!isNaN(avgValue)) {
            if (avgValue >= from && avgValue <= to) {
                result.push({
                    id: userEl.attr('id'),
                    name: userEl.find('.user_list_name_text').text(),
                });
            } else {
                userEl.hide();
            }
        } else {
            result.push({
                id: userEl.attr('id'),
                name: userEl.find('.user_list_name_text').text(),
            });
        }
    });

    ws.send({
        type: 'CONTROLLERS:SEARCH_FILTER_BY_SCORE_RESULT',
        payload: result,
    });
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
        return n01rcu_getLocalStorage('n01_net.onlineOptions');
    } catch (error) {
        console.log('[n01.rcu.helpers] getPlayer error: ', error);

        return {};
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
    const pageType = n01rcu_detectPageType();
    
    n01rcu_changeExtensionIcon(paired ? 'paired' : 'connected');
    
    if (pageType === 'game') {
        n01rcu_sendScoreLeft(ws);
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

    if (path === '/n01/online/' && join === true) {
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
    const type = n01rcu_detectPageType();

    switch (type) {
        case 'search':
            return true;
        case 'game':
            return true;
    }

    return false;
}
