/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const n01rcu_ws = new n01rcu_WebSocketClient();
const n01rcu_backupFunctions = {};
const n01rcu_wrapperFunctions = {
    //start of new leg
    initScore: function () {
        console.log('[n01.rcu.n01rcu-action-listeners] wrapper initScore');

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

        console.log('[n01.rcu.n01rcu-action-listeners] wrapper finishMenuOpen', outs);

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
        console.log('[n01.rcu.n01rcu-action-listeners] wrapper finishMsgOpen');

        setTimeout(() => {
            $('#msg_ok').click(); // press OK
        }, 500);
    },
    // leg finished by opponent, dialog message: "Game shot 3rd dart (23 darts)", buttons: [ok]
    netFinishMsgOpen: function () {
        console.log('[n01.rcu.n01rcu-action-listeners] wrapper netFinishMsgOpen');

        setTimeout(() => {
            $('#msg_net_ok').click(); // press OK
        }, 500);
    },
    // match finished, dialog message: "Winner is PlayerX", buttons: [ok]
    endMatchMsgOpen: function () {
        console.log('[n01.rcu.n01rcu-action-listeners] wrapper endMatchMsgOpen');

        $('#msg_net_ok').click(); // press OK
        n01rcu_ws.send({ type: 'CONTROLLERS:MATCH_END' });

        setTimeout(() => {
            menuFunc('menu_new'); // press Exit button
        }, 3000);
    },
};

const n01rcu_shouldConnect = function n01rcu_shouldConnect() {
    const path = window.location.pathname;

    if (path === '/n01/online/n01.php') {
        console.log('[n01.rcu.n01rcu-action-listeners][shouldConnect] match started -> requesting connect')
        
        return true;
    }

    if (path === '/n01/online/') {
        if (join === true) {
            console.log('[n01.rcu.n01rcu-action-listeners][shouldConnect] search match -> requesting connect')
        
            return true;
        }

        console.log('[n01.rcu.n01rcu-action-listeners][shouldConnect] not searching match -> no need to connect')

        return false;
    }

    console.log('[n01.rcu.n01rcu-action-listeners][shouldConnect] bad path -> no need to connect', path)

    return false;
}

window.onload = () => {
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

window.onbeforeunload = () => {
    n01rcu_stopMatchUpdater();
    n01rcu_changeExtensionIcon('default');
    n01rcu_removeFunctionsWrappers(n01rcu_wrapperFunctions, n01rcu_backupFunctions);

    if (n01rcu_ws.open) {
        n01rcu_ws.disconnect(1001, 'window unload');
    }
};
