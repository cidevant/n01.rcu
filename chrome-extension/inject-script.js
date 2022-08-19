/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

window.n01rcu.ws = new window.n01rcu.WebSocketClient();

const backupFunctions = {};
const wrapperFunctions = {
  //start of new leg
  initScore: function () {
    console.log('[n01.rcu.inject-script] wrapper initScore');

    window.n01rcu.helpers.sendScoreLeft(window.n01rcu.ws);
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

    console.log('[n01.rcu.inject-script] wrapper finishMenuOpen', outs);

    setTimeout(() => {
      // if only one possibility - send without confirmation
      if (outs.length === 1) {
        $(`#${outs[0]}`).click();
      } else {
        // let user choose
        window.n01rcu.ws.send({
          type: 'CONTROLLERS:GET_FINISH_DART',
          payload: outs,
        });
      }
    }, 500);
  },
  // leg finished by you, dialog message: "Game shot 3rd dart (23 darts)", buttons: [ok]
  finishMsgOpen: function () {
    console.log('[n01.rcu.inject-script] wrapper finishMsgOpen');

    setTimeout(() => {
      $('#msg_ok').click(); // press OK
    }, 500);
  },
  // leg finished by opponent, dialog message: "Game shot 3rd dart (23 darts)", buttons: [ok]
  netFinishMsgOpen: function () {
    console.log('[n01.rcu.inject-script] wrapper netFinishMsgOpen');

    setTimeout(() => {
      $('#msg_net_ok').click(); // press OK
    }, 500);
  },
  // match finished, dialog message: "Winner is PlayerX", buttons: [ok]
  endMatchMsgOpen: function () {
    console.log('[n01.rcu.inject-script] wrapper endMatchMsgOpen');

    $('#msg_net_ok').click(); // press OK
    
    setTimeout(() => {
      menuFunc('menu_new'); // press Exit button
    }, 3000);
  },
};

window.onload = () => {
  window.n01rcu.helpers.addFunctionsWrappers(wrapperFunctions, backupFunctions);
  window.n01rcu.ws.connect();
};

window.onbeforeunload = () => {
  window.n01rcu.helpers.changeExtensionIcon('default');
  window.n01rcu.helpers.removeFunctionsWrappers(wrapperFunctions, backupFunctions);
  window.n01rcu.ws.disconnect();
};
