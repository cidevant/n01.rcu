const $GAME_PROVIDER = $GAME_PROVIDER_FACTORY();

function $GAME_PROVIDER_FACTORY() {
    /**
     * Starts game with provided user
     *
     * @returns {Object} current status
     */
    function startGame(data) {
        try {
            const userEl = $(`.user_list_item[id="${data}"]`);
            const playButton = userEl.find('input[type="button"][value="Play"].play_button');

            if (playButton.is(':visible')) {
                playButton.click();
            } else {
                throw new Error(`player not found ${data}`);
            }
        } catch (error) {
            $$DEBUG && console.log('[n01.RCU.spy.game][error] startGame', error?.message ?? error);
        }
    }

    /**
     * Toggle stats window
     *
     */
    function toggleStats() {
        if ($('#stats_msg').is(':visible')) {
            // statsClose();
            $('#modal-overlay').click();
        } else {
            menuFunc('menu_stats');
        }
    }

    /**
     * Exits game
     *
     */
    function exitGame() {
        menuFunc('menu_new'); // press Exit button

        setTimeout(() => {
            $('#msg_exit_ok').click();
        }, 500);
    }

    /**
     * Submits finish darts
     *
     * @param {*} data
     * @param {*} ws
     */
    function setFinishDart(data) {
        if ($(`#${data}`).is(':visible')) {
            $(`#${data}`).click();
        } else {
            $$DEBUG &&
                console.log(
                    `[n01.RCU.spy.game][error] setFinishDart: ${data} not found or is not visible`
                );
        }
    }

    /**
     * Submits player's score received from websocket server
     *
     * @param {*} data input score action
     * @param {*} ws websocket
     */
    function setInputScore(data) {
        try {
            // enter score
            for (const value of `${data}`) {
                inputScore(value);
            }

            // submit score
            $('.score_input').click();

            // respond with score left
            sendScoreLeft();
        } catch (error) {
            $$DEBUG &&
                console.log('[n01.RCU.spy.game][error] setInputScore', error?.message ?? error);
        }
    }

    /**
     * Sends player's left score
     */
    function sendScoreLeft() {
        try {
            $SHARED_FOREGROUND.dispatchToContent({
                type: $SHARED.actions.WEBSOCKET_SEND,
                payload: {
                    type: 'CONTROLLERS:SET_SCORE_LEFT',
                    payload: getPlayerScoreLeft(),
                },
            });
        } catch (error) {
            $$DEBUG &&
                console.log('[n01.RCU.spy.game][error] sendScoreLeft', error?.message ?? error);
        }
    }

    /**
     * Gets player's left score
     *
     * @returns {number} left score
     */
    function getPlayerScoreLeft() {
        try {
            const game = $DATA_PROVIDER.game();
            const rounds = game?.leg?.playerData?.[game?.playerIndex];

            if (rounds?.length > 0) {
                return rounds[rounds.length - 1].left ?? -1;
            }
        } catch (error) {
            $$DEBUG &&
                console.log(
                    '[n01.RCU.spy.game][error] getPlayerScoreLeft',
                    error?.message ?? error
                );

            return -1;
        }
    }

    /**
     * Watches executed functions of n01.nakka
     *
     * @returns {Object} list of functions to watch
     */
    function watchNativeGameFunctions() {
        return {
            //start of new leg
            initScore: function () {
                $$DEBUG && $$VERBOSE && console.log('[n01.RCU.spy.game] initScore');

                sendScoreLeft();
            },

            // enter outs
            finishMenuOpen: function () {
                // possible outs
                const outs = ['finish_first', 'finish_second', 'finish_third'].reduce(
                    (acc, curr) => {
                        if ($(`#${curr}`).is(':visible')) {
                            acc.push(curr);
                        }

                        return acc;
                    },
                    []
                );

                $$DEBUG && $$VERBOSE && console.log('[n01.RCU.spy.game] finishMenuOpen', outs);

                setTimeout(() => {
                    // if only one possibility - send without confirmation
                    if (outs.length === 1) {
                        $(`#${outs[0]}`).click();
                    } else {
                        $SHARED_FOREGROUND.dispatchToContent({
                            type: $SHARED.actions.WEBSOCKET_SEND,
                            payload: {
                                type: 'CONTROLLERS:GET_FINISH_DARTS',
                                payload: outs,
                            },
                        });
                    }
                }, 500);
            },

            // leg finished by you, dialog message: "Game shot 3rd dart (23 darts)", buttons: [ok]
            finishMsgOpen: function () {
                $$DEBUG && $$VERBOSE && console.log('[n01.RCU.spy.game] finishMsgOpen');

                setTimeout(() => {
                    $('#msg_ok').click(); // press OK
                }, 500);
            },

            // leg finished by opponent, dialog message: "Game shot 3rd dart (23 darts)", buttons: [ok]
            netFinishMsgOpen: function () {
                $$DEBUG && $$VERBOSE && console.log('[n01.RCU.spy.game] netFinishMsgOpen');

                setTimeout(() => {
                    $('#msg_net_ok').click(); // press OK
                }, 500);
            },

            // match finished, dialog message: "Winner is PlayerX", buttons: [ok]
            endMatchMsgOpen: function () {
                $$DEBUG && $$VERBOSE && console.log('[n01.RCU.spy.game] endMatchMsgOpen');

                $('#msg_net_ok').click(); // press OK

                $SHARED_FOREGROUND.dispatchToContent({
                    type: $SHARED.actions.WEBSOCKET_SEND,
                    payload: {
                        type: 'CONTROLLERS:MATCH_END',
                    },
                });
            },
        };
    }

    return {
        start: startGame,
        finish: setFinishDart,
        score: setInputScore,
        exit: exitGame,
        toggleStats,
        native: watchNativeGameFunctions,
    };
}

// Disable browser alerting
window.alert = function (message) {
    $SHARED_FOREGROUND.dispatchToContent({
        type: $SHARED.actions.WEBSOCKET_SEND,
        payload: {
            type: 'CONTROLLERS:ALERT',
            payload: message,
        },
    });
};
