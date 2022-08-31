/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const n01rcu_ws = new n01rcu_WebSocketClient();
const n01rcu_backupFunctions = {};
const n01rcu_wrapperFunctions = {
    // Watches update of JOIN (n01rcu_JOIN) value
    createList: function () {
        if (join !== n01rcu_JOIN) {
            n01rcu_JOIN = join;
            n01rcu_sendOnSearchPage(n01rcu_ws);
        }
    },
    // Watches update of JOIN (n01rcu_JOIN) value
    createDiffList: function () {
        if (join !== n01rcu_JOIN) {
            n01rcu_JOIN = join;
            n01rcu_sendOnSearchPage(n01rcu_ws);
        }
    },
    //start of new leg
    initScore: function () {
        console.log('[n01.rcu.wrapper] initScore');

        n01rcu_sendScoreLeft(n01rcu_ws);
    },
    // enter outs
    finishMenuOpen: function () {
        // possible outs
        const outs = ['finish_first', 'finish_second', 'finish_third'].reduce((acc, curr) => {
            if ($(`#${curr}`).is(':visible')) {
                acc.push(curr);
            }

            return acc;
        }, []);

        console.log('[n01.rcu.wrapper] finishMenuOpen', outs);

        setTimeout(() => {
            // if only one possibility - send without confirmation
            if (outs.length === 1) {
                $(`#${outs[0]}`).click();
            } else {
                // let user choose
                n01rcu_ws.send({
                    type: 'CONTROLLERS:GET_FINISH_DARTS',
                    payload: outs,
                });
            }
        }, 500);
    },
    // leg finished by you, dialog message: "Game shot 3rd dart (23 darts)", buttons: [ok]
    finishMsgOpen: function () {
        console.log('[n01.rcu.wrapper] finishMsgOpen');

        setTimeout(() => {
            $('#msg_ok').click(); // press OK
        }, 500);
    },
    // leg finished by opponent, dialog message: "Game shot 3rd dart (23 darts)", buttons: [ok]
    netFinishMsgOpen: function () {
        console.log('[n01.rcu.wrapper] netFinishMsgOpen');

        setTimeout(() => {
            $('#msg_net_ok').click(); // press OK
        }, 500);
    },
    // match finished, dialog message: "Winner is PlayerX", buttons: [ok]
    endMatchMsgOpen: function () {
        console.log('[n01.rcu.wrapper] endMatchMsgOpen');

        $('#msg_net_ok').click(); // press OK
        n01rcu_ws.send({ type: 'CONTROLLERS:MATCH_END' });

        setTimeout(() => {
            menuFunc('menu_new'); // press Exit button
        }, 3000);
    },
};

// ========================================================================================
// Run
// ========================================================================================

// When window loaded
window.onload = () => {
    document.addEventListener('n01rcu.Event.Popup.In', n01rcu_inPopupsEventsListener, false);

    if (n01rcu_shouldConnect()) {
        setTimeout(() => {
            n01rcu_ws.onopen = () => {
                n01rcu_addFunctionsWrappers(n01rcu_wrapperFunctions, n01rcu_backupFunctions)
                n01rcu_startMatchUpdater(n01rcu_ws);
            };
            n01rcu_ws.connect();
        });
    }
};

// Before window close
window.onbeforeunload = () => {
    document.removeEventListener('n01rcu.Event.Popup.In', n01rcu_inPopupsEventsListener);

    n01rcu_ws.disconnect(1000, 'window unload');
    n01rcu_stopMatchUpdater();
    n01rcu_changeExtensionIcon('default');
    n01rcu_removeFunctionsWrappers(n01rcu_wrapperFunctions, n01rcu_backupFunctions);

};
