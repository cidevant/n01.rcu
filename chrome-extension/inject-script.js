/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const n01obs__client = new n01obs__WebSocketClient();
const backupFunctions = {};
const wrapperFunctions = {
  //start of new leg
  initScore: function () {
    console.log('[n01.obs.inject-script] wrapper initScore');

    n01obs__sendScoreLeft(n01obs__client);
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

    console.log('[n01.obs.inject-script] wrapper finishMenuOpen', outs);

    setTimeout(() => {
      // if only one possibility - send without confirmation
      if (outs.length === 1) {
        $(`#${outs[0]}`).click();
      } else {
        // let user choose
        n01obs__client.send({
          type: 'GET_FINISH_DART',
          value: outs,
        });
      }
    }, 500);
  },
  // leg finished by you, dialog message: "Game shot 3rd dart (23 darts)", buttons: [ok]
  finishMsgOpen: function () {
    console.log('[n01.obs.inject-script] wrapper finishMsgOpen');

    setTimeout(() => {
      $('#msg_ok').click(); // press OK
    }, 500);
  },
  // leg finished by opponent, dialog message: "Game shot 3rd dart (23 darts)", buttons: [ok]
  netFinishMsgOpen: function () {
    console.log('[n01.obs.inject-script] wrapper netFinishMsgOpen');

    setTimeout(() => {
      $('#msg_net_ok').click(); // press OK
    }, 500);
  },
  // match finished, dialog message: "Winner is PlayerX", buttons: [ok]
  endMatchMsgOpen: function () {
    console.log('[n01.obs.inject-script] wrapper endMatchMsgOpen');

    $('#msg_net_ok').click(); // press OK
    
    setTimeout(() => {
      menuFunc('menu_new'); // press Exit button
    }, 3000);
  },
};

window.onload = () => {
  n01obs__addFunctionsWrappers(wrapperFunctions, backupFunctions);
  n01obs__client.connect();
};

window.onbeforeunload = () => {
  n01obs__changeExtensionIcon('default');
  n01obs__sendScoreLeft(n01obs__client, -1);
  n01obs__client.disconnect();
  n01obs__removeFunctionsWrappers(wrapperFunctions, backupFunctions);
};
