const $DATA_PROVIDER = $DATA_PROVIDER_FACTORY();

function $DATA_PROVIDER_FACTORY() {
    function safeGetPartialData(key) {
        try {
            return n01_data[key];
        } catch (error) {
            $$DEBUG &&
                $$VERBOSE &&
                console.log('[n01.RCU.spy.data][error] safeGetPartialData', key, error.message);
        }
    }

    function safeGetFunctionResult(functionName, ...args) {
        try {
            return eval(functionName)(...args);
        } catch (error) {
            $$DEBUG &&
                $$VERBOSE &&
                console.log('[n01.RCU.spy.data][error] safeGetFunctionResult', error.message);

            return null;
        }
    }

    function getActivities(page, player, gameData) {
        try {
            const activities = {
                idle: isActivityIdle(page),
                setup: isActivitySearchSetup(page),
                search: isActivitySearch(page, player),
                game: isActivityPlay(page, gameData),
            };

            return {
                activity: getCurrentActivity(page, activities),
                activities,
            };
        } catch (error) {
            $$DEBUG &&
                $$VERBOSE &&
                console.log('[n01.RCU.spy.data][error] getActivities', error.message);
        }
    }

    function getCurrentActivity(page, activities) {
        const { idle, setup, search, game } = activities;

        if (page === 'game' && game && !idle && !setup && !search) {
            return 'game';
        }

        if (page === 'setup' && setup && !idle && !game && !search) {
            return 'setup';
        }

        if (page === 'home' && search && !idle && !setup && !game) {
            return 'search';
        }

        if (page === 'home' && idle && !game && !setup && !search) {
            return 'idle';
        }

        $$DEBUG &&
            $$VERBOSE &&
            console.log(
                "[n01.RCU.spy.data][error] can't choose getCurrentActivity",
                page,
                activities
            );
    }

    function isActivityIdle(page) {
        try {
            return page === 'home' && join === false;
        } catch (error) {
            $$DEBUG &&
                $$VERBOSE &&
                console.log('[n01.RCU.spy.data][error] isActivityIdle', error.message);

            return false;
        }
    }

    function isActivitySearchSetup(page) {
        try {
            return page === 'setup';
        } catch (error) {
            $$DEBUG &&
                $$VERBOSE &&
                console.log('[n01.RCU.spy.data][error] isActivitySearchSetup', error.message);

            return false;
        }
    }

    function isActivitySearch(page, player) {
        try {
            return page === 'home' && join === true && player?.sid?.length > 0;
        } catch (error) {
            $$DEBUG &&
                $$VERBOSE &&
                console.log('[n01.RCU.spy.data][error] isActivitySearch', error.message);

            return false;
        }
    }

    function isActivityPlay(page, game) {
        try {
            // eslint-disable-next-line prettier/prettier
            const { statsData, mid, endMatch } = game?.set ?? {};
            const me = statsData?.find?.((p) => p?.me === 1);

            return me != null && page === 'game' && mid?.length > 0 && endMatch === 0;
        } catch (error) {
            $$DEBUG &&
                $$VERBOSE &&
                console.log('[n01.RCU.spy.data][error] isActivityPlay', error.message);

            return false;
        }
    }

    function getPage(path) {
        try {
            switch (path) {
                case '/n01/online/':
                    return 'home';
                case '/n01/online/n01_v2/setting.php':
                    return 'setup';
                case '/n01/online/n01.php':
                    return 'game';
                default:
                    throw new Error('unknown page path', path);
            }
        } catch (error) {
            $$DEBUG && $$VERBOSE && console.log('[n01.RCU.spy.data][error] getPage', error.message);
        }
    }

    function setPlayerName(player) {
        if (player == null) {
            return;
        }

        const getName = (i) => {
            if (i?.editName?.length > 0) {
                return i.editName;
            }

            if (i?.gname?.length > 0) {
                return i.gname;
            }

            if (i?.tname?.length > 0) {
                return i.tname;
            }

            if (i?.fname?.length > 0) {
                return i.fname;
            }

            if (i?.playerName?.length > 0) {
                return i.playerName;
            }
        };

        return {
            ...player,
            playerName: getName(player),
        };
    }

    function getGame(page, player) {
        try {
            const set = safeGetPartialData('setData');
            const leg = safeGetFunctionResult('currentLegData');

            if (page !== 'game' || player == null || set == null || leg == null) {
                throw new Error(
                    'game info is missing ' +
                        JSON.stringify({
                            page,
                            player,
                            set,
                            leg,
                        })
                );
            }

            const playersInfo = getGamePlayersInfo(page, set);

            if (playersInfo == null) {
                throw new Error(
                    "can't extract players info from game " +
                        JSON.stringify({
                            page,
                            player,
                            set,
                            leg,
                            playersInfo,
                        })
                );
            }

            return {
                set,
                leg,
                ...playersInfo,
            };
        } catch (error) {
            $$DEBUG &&
                $$VERBOSE &&
                page === 'game' &&
                console.log('[n01.RCU.spy.data][error] getGame', error.message);
        }
    }

    function getGamePlayersInfo(page, set) {
        try {
            if (page !== 'game' || set == null) {
                throw new Error(
                    'game info is missing ' +
                        JSON.stringify({
                            page,
                            set,
                        })
                );
            }

            const playerIndex = set?.statsData?.findIndex?.((p) => p.me === 1);

            if (playerIndex > -1) {
                const player = set?.statsData[playerIndex];
                const opponentIndex = playerIndex === 0 ? 1 : 0;
                const opponent = set?.statsData[opponentIndex];

                if (player == null || opponent == null) {
                    throw new Error('player info is missing in game');
                }

                return {
                    playerIndex,
                    player,
                    opponentIndex,
                    opponent,
                };
            } else {
                throw new Error("can't find player in game");
            }
        } catch (error) {
            $$DEBUG &&
                $$VERBOSE &&
                console.log('[n01.RCU.spy.data][error] getGamePlayersInfo', error.message);
        }
    }

    // EXPOSED

    /**
     * Collects n01 application data (state)
     *
     * @returns {Object} current status
     */
    function allData() {
        try {
            const path = location.pathname;
            const page = getPage(path);
            const player = setPlayerName(safeGetPartialData('onlineOptions'));
            const game = getGame(page, player);
            const activities = getActivities(page, player, game);

            return {
                ...activities,
                path,
                page,
                game,
                player,
                settings: safeGetPartialData('options'),
                stats: safeGetPartialData('statsData'),
                ws: safeGetPartialData('ws'),
            };
        } catch (error) {
            $$DEBUG && console.log('[n01.RCU.spy.data][error] allData', error.message);

            return {};
        }
    }

    function getGameData() {
        try {
            const path = location.pathname;
            const page = getPage(path);
            const player = setPlayerName(safeGetPartialData('onlineOptions'));

            return getGame(page, player);
        } catch (error) {
            $$DEBUG && console.log('[n01.RCU.spy.data][error] getGameData', error.message);
        }
    }

    function getActivitiesData() {
        try {
            const path = location.pathname;
            const page = getPage(path);
            const player = setPlayerName(safeGetPartialData('onlineOptions'));
            const game = getGame(page, player);

            return getActivities(page, player, game);
        } catch (error) {
            $$DEBUG && console.log('[n01.RCU.spy.data][error] getActivitiesData', error.message);
        }
    }

    function getPlayerData() {
        try {
            return setPlayerName(safeGetPartialData('onlineOptions'));
        } catch (error) {
            $$DEBUG && console.log('[n01.RCU.spy.data][error] getPlayerData', error.message);
        }
    }

    return {
        all: allData,
        game: getGameData,
        activity: getActivitiesData,
        me: getPlayerData,
    };
}
