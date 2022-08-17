/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

/**
 * Process commands from websocket server
 *
 * @param {*} data Message from server
 * @param {*} ws WebSocket client reference for responding
 */
function n01obs__onWsMessage(data, ws) {
  try {
    switch (data.type) {
      case 'inputScore':
        n01obs__inputScore(data, ws);
        break;

      case 'setFinishDart':
        n01obs__setFinishDart(data, ws);
        break;
      case 'paired':
        n01obs__setPaired(true);
        break;
      case 'unpaired':
        n01obs__setPaired(false);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log('[n01.obs.inject-helpers] onWsMessage error: ', error);
  }
}

/**
 * Submits player's score received from websocket server
 *
 * @param {*} data input score action
 * @param {*} ws websocket
 */
function n01obs__inputScore(data, ws) {
  try {
    // enter score
    for (const value of `${data.value}`) {
      inputScore(value);
    }

    // submit score
    $('.score_input').click();

    // respond with score left
    n01obs__sendScoreLeft(ws);
  } catch (error) {
    console.log('[n01.obs.inject-helpers] inputScore error: ', error);
  }
}

function n01obs__setFinishDart(data, ws) {
  if ($(`#${data['value']}`).is(':visible')) {
    console.log('[n01.obs.inject-helpers] setFinishDart ', data);

    $(`#${data['value']}`).click();
  } else {
    console.log(
      `[n01.obs.inject-helpers] setFinishDart error: ${data['value']} not found or is not visible`
    );
  }
}

/**
 * Sends player's left score
 *
 * @param {WebSocket} ws socket connection
 */
function n01obs__sendScoreLeft(ws, value) {
  try {
    const score = value ?? n01obs__getPlayerLeftScore();

    ws.send({
      type: 'scoreLeft',
      value: score === -1 ? '-' : score,
    });
  } catch (error) {
    console.log('[n01.obs.inject-helpers] sendScoreLeft error: ', error);
  }
}

/**
 * Changes icon of extension
 *
 * @param {boolean} [connected=true]
 */
function n01obs__changeExtensionIcon(icon = 'default') {
  setTimeout(function () {
    document.dispatchEvent(
      new CustomEvent('n01obs.Event', {
        detail: {
          action: 'updateIcon',
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
function n01obs__getPlayer() {
  try {
    return n01obs__getLocalStorage('n01_net.onlineOptions');
  } catch (error) {
    console.log('[n01.obs.inject-helpers] getPlayer error: ', error);

    return {};
  }
}

/**
 * Gets player's position in match
 *
 * @returns {number} index of player (0 or 1)
 */
function n01obs__getPlayerIndexInMatch() {
  try {
    const match = n01obs__getLocalStorage('n01_net.setData');

    if (match && Array.isArray(match.statsData)) {
      return match.statsData.findIndex((p) => p.me === 1);
    } else {
      throw 'No match data found';
    }
  } catch (error) {
    console.log('[n01.obs.inject-helpers] getPlayerIndexInMatch error: ', error);

    return -1;
  }
}

/**
 * Gets player's left score
 *
 * @returns {number} left score
 */
function n01obs__getPlayerLeftScore() {
  try {
    const playerIndex = n01obs__getPlayerIndexInMatch();

    if (playerIndex > -1) {
      const rounds = currentLegData()?.playerData?.[playerIndex];

      if (Array.isArray(rounds) && rounds?.length > 0) {
        return rounds[rounds.length - 1].left;
      }

      throw 'no data for current leg';
    }

    throw 'bad getPlayerIndexInMatch index';
  } catch (error) {
    console.log('[n01.obs.inject-helpers] getPlayerLeftScore error: ', error);

    return -1;
  }
}

/**
 * Parses data from localStorage to JSON
 *
 * @param {string} key localStorage key
 * @returns {Object} parsed object
 */
function n01obs__getLocalStorage(key) {
  try {
    return JSON.parse(localStorage[key]);
  } catch (error) {
    console.log('[n01.obs.inject-helpers] getLocalStorage error: ', error);

    return {};
  }
}

function n01obs__setPaired(paired = false) {
  n01obs__changeExtensionIcon(paired ? 'paired' : 'connected');
}

/**
 * Wraps n01 function to get notified when function is called
 *
 * @param {*} wrapperFunctions
 * @param {*} backupFunctions
 */
function n01obs__addFunctionsWrappers(wrapperFunctions, backupFunctions) {
  console.log('[n01.obs.inject-helpers] wrap n01 functions');

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
function n01obs__removeFunctionsWrappers(wrapperFunctions, backupFunctions) {
  console.log('[n01.obs.inject-helpers] unwrap n01 functions');

  Object.keys(wrapperFunctions).forEach((fnName) => {
    window[fnName] = backupFunctions[fnName];
  });
}
