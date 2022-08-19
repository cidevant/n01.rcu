/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

if (!window.n01rcu?.helpers) {
    window.n01rcu.helpers = {};
}

/**
 * Process commands from websocket server
 *
 * @param {*} data Message from server
 * @param {*} ws WebSocket client reference for responding
 */
window.n01rcu.helpers.onWsMessage = function onWsMessage(data, ws) {
  try {
    switch (data.type) {
      case 'SET_INPUT_SCORE':
        window.n01rcu.helpers.inputScore(data, ws);
        break;
      case 'SET_FINISH_DART':
        window.n01rcu.helpers.setFinishDart(data, ws);
        break;
      case 'PAIRED':
        window.n01rcu.helpers.setPaired(true, ws);
        break;
      case 'UNPAIRED':
        window.n01rcu.helpers.setPaired(false, ws);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log('[n01.rcu.helpers] onWsMessage error: ', error);
  }
}

/**
 * Submits player's score received from websocket server
 *
 * @param {*} data input score action
 * @param {*} ws websocket
 */
window.n01rcu.helpers.inputScore = function inputScore(data, ws) {
  try {
    // enter score
    for (const value of `${data.payload}`) {
        window.n01rcu.helpers.inputScore(value);
    }

    // submit score
    $('.score_input').click();

    // respond with score left
    window.n01rcu.helpers.sendScoreLeft(ws);
  } catch (error) {
    console.log('[n01.rcu.helpers] inputScore error: ', error);
  }
}

window.n01rcu.helpers.setFinishDart = function setFinishDart(data, ws) {
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
window.n01rcu.helpers.sendScoreLeft = function sendScoreLeft(ws, value) {
  try {
    const score = value ?? window.n01rcu.helpers.getPlayerLeftScore();

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
window.n01rcu.helpers.changeExtensionIcon = function changeExtensionIcon(icon = 'default') {
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
window.n01rcu.helpers.getPlayer = function getPlayer() {
  try {
    return window.n01rcu.helpers.getLocalStorage('n01_net.onlineOptions');
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
window.n01rcu.helpers.getPlayerIndexInMatch = function getPlayerIndexInMatch() {
  try {
    const match = window.n01rcu.helpers.getLocalStorage('n01_net.setData');

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
 window.n01rcu.helpers.getPlayerLeftScore = function getPlayerLeftScore() {
  try {
    const playerIndex = window.n01rcu.helpers.getPlayerIndexInMatch();

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
 window.n01rcu.helpers.getLocalStorage = function getLocalStorage(key) {
  try {
    return JSON.parse(localStorage[key]);
  } catch (error) {
    console.log('[n01.rcu.helpers] getLocalStorage error: ', error);

    return {};
  }
}

window.n01rcu.helpers.setPaired = function setPaired(paired = false, ws) {
    window.n01rcu.helpers.changeExtensionIcon(paired ? 'paired' : 'connected');
    window.n01rcu.helpers.sendScoreLeft(ws);
}

/**
 * Wraps n01 function to get notified when function is called
 *
 * @param {*} wrapperFunctions
 * @param {*} backupFunctions
 */
 window.n01rcu.helpers.addFunctionsWrappers = function addFunctionsWrappers(wrapperFunctions, backupFunctions) {
  console.log('[n01.rcu.helpers] wrap n01 functions');

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
 window.n01rcu.helpers.removeFunctionsWrappers = function removeFunctionsWrappers(wrapperFunctions, backupFunctions) {
  console.log('[n01.rcu.helpers] unwrap n01 functions');

  Object.keys(wrapperFunctions).forEach((fnName) => {
    window[fnName] = backupFunctions[fnName];
  });
}
