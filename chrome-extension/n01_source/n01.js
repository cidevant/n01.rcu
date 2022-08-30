/*
 * n01.js
 *
 * Copyright (C) 1996-2020 by Ohno Tomoaki. All rights reserved.
 */

/*globals n01_data n01_util*/
/*eslint-env browser, jquery*/
var ajaxSyncFlag = false;
var ajaxSendFlag = false;
var exitFlag = false;
var finishFlag = false;
var sendScoreData = null;
var getSetRetryCount = 0;
var vsPid;

if (n01_data.phpUser === undefined) {
	n01_data.phpUser = n01_data.phpSite + 'n01_user.php';
}
if (n01_data.phpOnline === undefined) {
	n01_data.phpOnline = n01_data.phpSite + 'n01_online.php';
}

var resources = {
	en : {
		limit_set_msg1 : "First to ",
		limit_set_msg2 : " Sets / ",
		limit_set_msg3 : " Legs",
		limit_set_msg4 : " Sets",
		limit_set_msg5 : " Sets",
		limit_leg_msg1 : "First to ",
		limit_leg_msg2 : " Legs",
		best_of_msg1 : "Best of ",
		best_of_msg2 : " Legs",

		menu_webcam_on : "WebCam on",
		menu_webcam_off : "WebCam off",
		exit_msg : "Opponent has exit.\nDo you also exit?",
		exit_confirm: "Do you want to exit?",
		game_shot_msg_prefix : "Game shot ",
		game_shot_msg_suffix : " dart",
		game_shot_msg_darts : " darts",
		winner_msg_prefix : "Winner is ",
		winner_msg_suffix : "",
		webcam_msg : "Enable WebCam?",
		change_first_msg : "Do you want opponent to be First?",
		cam_device_msg : "You are set to use WebCam on another device.",
		input_error_msg : "Failed to send score. Try reloading.",
	},
	ja : {
		limit_set_msg1 : "",
		limit_set_msg2 : " Set / ",
		limit_set_msg3 : " Legĺ…ĺŹ–",
		limit_set_msg4 : " Setĺ…ĺŹ–",
		limit_set_msg5 : " Set",
		limit_leg_msg1 : "",
		limit_leg_msg2 : " Legĺ…ĺŹ–",
		best_of_msg1 : "Best of ",
		best_of_msg2 : " Leg",

		menu_chat : "ăăŁăă",
		menu_webcam_on : "Webă‚«ăˇă©ă‚’ă‚Şăłă«ă™ă‚‹",
		menu_webcam_off : "Webă‚«ăˇă©ă‚’ă‚Şă•ă«ă™ă‚‹",
		menu_webcam_setting : "Webă‚«ăˇă©ă®č¨­ĺ®š",
		menu_modify : "ă‚ąă‚±ă‚¸ăĄăĽă«ĺ¤‰ć›´",
		menu_remaining_score : "ć®‹ă‚Šă‚ąă‚łă‚˘ă§ĺ…ĄĺŠ›",
		menu_option : "ă‚Şă—ă‚·ă§ăł",
		menu_cancel : "ă‚­ăŁăłă‚»ă«",

		menu_new : "Exit",
		menu_finish : "Finish",
		menu_stats : "Stats",
		key_enter : "Enter",

		finish_first : "1ćś¬ç›®ă§çµ‚äş†",
		finish_second : "2ćś¬ç›®ă§çµ‚äş†",
		finish_third : "3ćś¬ç›®ă§çµ‚äş†",
		finish_cancel : "ă‚­ăŁăłă‚»ă«",

		msg_ok : "OK",
		msg_cancel : "ă‚­ăŁăłă‚»ă«",

		exit_msg : "ĺŻľć¦ç›¸ć‰‹ăŚé€€ĺ‡şă—ăľă—ăźă€‚\nă‚ăŞăźă‚‚é€€ĺ‡şă—ăľă™ă‹ďĽź",
		exit_confirm: "é€€ĺ‡şă—ăľă™ă‹ďĽź",
		game_shot_msg_prefix : "",
		game_shot_msg_suffix : "ćś¬ç›®ă§çµ‚äş†",
		game_shot_msg_darts : " ă€ăĽă„",
		winner_msg_prefix : "",
		winner_msg_suffix : " ă®ĺ‹ťĺ©",
		webcam_msg : "Webă‚«ăˇă©ă‚’ä˝żă„ăľă™ă‹?\nďĽĺŻľć¦ç›¸ć‰‹ăŻWebă‚«ăˇă©ă‚’ä˝żăŁă¦ă„ăľă™ďĽ‰",
		change_first_msg : "ĺ…ć”»ă‚’ĺ…Ąă‚Ść›żăăľă™ă‹ďĽź",
		cam_device_msg : "ĺĄç«Żćś«ă§ă‚«ăˇă©ă‚’ä˝żç”¨ă™ă‚‹č¨­ĺ®šă«ăŞăŁă¦ă„ăľă™ă€‚",

		input_error_msg : "ă‚ąă‚łă‚˘é€äżˇă«ĺ¤±ć•—ă—ăľă—ăźă€‚ăŞă­ăĽă‰ă—ă¦ăŹă ă•ă„ă€‚",
	},
};
var res = {};
$(function() {
	var lang = 'en';
	if (navigator.browserLanguage) {
	    lang = navigator.browserLanguage;
	} else if (navigator.language) {
	    lang = navigator.language;
	}
	if (lang.length > 2) {
		lang = lang.substr(0, 2);
	}
	res = resources[lang];
	if (res === undefined) {
		res = resources['en'];
	} else if (lang !== 'en') {
		$('#menu_chat_title').text(res.menu_chat);
		$('#menu_webcam_setting').text(res.menu_webcam_setting);
		$('#menu_modify').text(res.menu_modify);
		$('#menu_remaining_score').text(res.menu_remaining_score);
		$('#menu_option').text(res.menu_option);
		$('#menu_cancel').text(res.menu_cancel);

		$('#menu_new').text(res.menu_new);
		$('#menu_finish').text(res.menu_finish);
		$('#menu_stats').text(res.menu_stats);
		$('#key_enter').text(res.key_enter);

		$('#finish_first').text(res.finish_first);
		$('#finish_second').text(res.finish_second);
		$('#finish_third').text(res.finish_third);
		$('#finish_cancel').text(res.finish_cancel);

		$('#msg_ok').text(res.msg_ok);
		$('#msg_cancel').text(res.msg_cancel);
		$('#msg_net_ok').text(res.msg_ok);
	}
});

$(function() {
	n01_data.restoreOptions();
	n01_data.restoreOnlineOptions();
	n01_data.restoreCamOptions();
	if (n01_data.options.css !== undefined && n01_data.options.css !== '') {
		var link = $('<link>').attr({
			'rel': 'stylesheet',
			'href': n01_data.options.css + '?a=9'
		});
		$('head').append(link);
	}
	setTimeout(function() {
		resize();
	}, 100);
	var sdata = n01_data.getSetData();
	if (sdata !== null && sdata.viewMode === 1) {
		window.location.href = 'n01_view.html';
		return;
	}
	$.ajax({
		url: n01_data.phpOnline + '?cmd=get_match&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		timeout: 30000,
		success: function(data) {
			if (data && data.statsData) {
				if (data.statsData[0].pid === n01_data.onlineOptions.pid) {
					data.statsData[0].me = 1;
					vsPid = data.statsData[1].pid;
				} else if (data.statsData[1].pid === n01_data.onlineOptions.pid) {
					data.statsData[1].me = 1;
					vsPid = data.statsData[0].pid;
				}
				var soundPlay = true;
				if (sdata !== null) {
					soundPlay = sdata.soundPlay;
				}
				n01_data.setData = data;
				if (n01_data.setData.endMatch === 0 && n01_data.setData.limitLeg > 0 &&
					(n01_data.setData.limitLeg <= n01_data.setData.statsData[0].winLegs || n01_data.setData.limitLeg <= n01_data.setData.statsData[1].winLegs)) {
					n01_data.setData.endMatch = 1;
					n01_data.setData.currentLeg--;
				}
				n01_data.setData.soundPlay = soundPlay;
				n01_data.saveSetData();
				var str = localStorage.getItem(n01_data.optionPrefix + 'sendScoreData');
				if (str !== null) {
					sendScoreData = JSON.parse(str);
					if (sendScoreData !== null) {
						if (n01_data.setData.mid !== sendScoreData.mid) {
							localStorage.setItem(n01_data.optionPrefix + 'sendScoreData', null);
							sendScoreData = null;
						} else {
							netInputScore(null);
						}
					}
				}
				init();
			} else {
				initLocalData(sdata);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert('Error\n\n' + XMLHttpRequest.status + ' ' + errorThrown);
			initLocalData(sdata);
		},
		complete: function(data) {
		}
	});
});

function initLocalData(sdata) {
	if (sdata === null) {
		if (n01_data.onlineOptions.returnTop) {
			window.location.href = n01_data.onlineOptions.returnTop;
		} else {
			window.location.href = '.';
		}
		return;
	}
	n01_data.setData = sdata;
	n01_data.saveSetData();
	var str = localStorage.getItem(n01_data.optionPrefix + 'sendScoreData');
	if (str !== null) {
		sendScoreData = JSON.parse(str);
		if (sendScoreData !== null) {
			if (n01_data.setData.mid !== sendScoreData.mid) {
				localStorage.setItem(n01_data.optionPrefix + 'sendScoreData', null);
				sendScoreData = null;
			} else {
				netInputScore(null);
			}
		}
	}
	init();
}

function init() {
	$('#header').fadeIn('normal');
	$('#article').fadeIn('normal');
	$('#footer').fadeIn('normal');
	
	if (currentLegData().selectRound === null) {
		currentLegData().selectRound = currentLegData().currentRound;
	}
	if (currentLegData().selectPlayer === null) {
		currentLegData().selectPlayer = currentLegData().currentPlayer;
	}
	if (n01_data.options.leftShow === 1) {
		$('#left_table').show();
	}
	initScore();
	showKeypad();
	enableFinishButton();

	if (n01_data.setData.statsData[0].me === 1) {
		$('#localVideoWrapper').appendTo('#p1left_big_td');
		$('#remoteVideoWrapper').appendTo('#p2left_big_td');
	} else {
		$('#remoteVideoWrapper').appendTo('#p1left_big_td');
		$('#localVideoWrapper').appendTo('#p2left_big_td');
	}
	if (n01_data.camOptions.webcam === 1) {
		startWebCam();
	} else if (n01_data.camOptions.webcam === -1 || n01_data.camOptions.camera_device === 1) {
	} else if ((n01_data.setData.statsData[0].me === 1 && n01_data.setData.statsData[1].w === 1) ||
		(n01_data.setData.statsData[1].me === 1 && n01_data.setData.statsData[0].w === 1)) {
		setTimeout(function() {
			if (window.confirm(res.webcam_msg)) {
				startWebCam();
			} else {
				n01_data.camOptions.webcam = -1;
				n01_data.saveCamOptions();
			}
		}, 100);
	}

	changeSelectInput(currentLegData().selectRound, currentLegData().selectPlayer);
	updateUser();
	startPush();

	if (n01_data.setData.soundPlay === undefined || n01_data.setData.soundPlay === false) {
		try {
			new Promise(function(resolve){
				$('#match_sound')[0].play();
				resolve();
			});
		} catch(err) {
		}
		n01_data.setData.soundPlay = true;
		n01_data.saveSetData();
	}
	initChat();
}

function playSound(e) {
	try {
		new Promise(function(resolve){
			e.play();
			resolve();
		});
	} catch(err) {
	}
}

function startWebCam() {
	if (n01_data.camOptions.camera_device) {
		if (n01_data.camOptions.camera_window) {
			setTimeout(function(){
				n01_data.restoreCamOptions();
				n01_data.camOptions.webcam = 1;
				n01_data.saveCamOptions();
				var url = '//nakka.com/n01/cam/?id=' + n01_data.camOptions.camera_device_uid + '&window=1';
				if (n01_data.camOptions.camera_window_left !== undefined && n01_data.camOptions.camera_window_top !== undefined &&
					n01_data.camOptions.camera_window_width !== undefined && n01_data.camOptions.camera_window_height !== undefined &&
					n01_data.camOptions.camera_window_width && n01_data.camOptions.camera_window_height) {
					window.open(url, 'n01_cam_window',
						'toolbar=no,menubar=no,left=' + n01_data.camOptions.camera_window_left + ',top=' + n01_data.camOptions.camera_window_top +
						',innerWidth=' + n01_data.camOptions.camera_window_width + ',innerHeight=' + n01_data.camOptions.camera_window_height);
				} else {
					window.open(url, 'n01_cam_window', 'toolbar=no,menubar=no');
				}
			}, 100);
		}
	} else {
		try {
			webrtcInit();
			n01_data.restoreCamOptions();
			n01_data.camOptions.webcam = 1;
			n01_data.saveCamOptions();
		} catch(err) {
		}
	}
}

function startPush() {
	startPushConnect(['score_' + n01_data.setData.mid, 'p_chat_' + n01_data.setData.mid], {
		notify: function(id) {
			if (id === 'score_' + n01_data.setData.mid) {
				netCheckScore();
			} else if (id === 'p_chat_' + n01_data.setData.mid) {
				checkMsgCount();
				checkMsg();
			}
		},
		all: function() {
			netCheckScore();
			checkMsgCount();
			checkMsg();
		},
	});
}

var recvTime = [0, 0];
function recvScore(scoreData) {
	scoreData.data = scoreData.data.filter(function(v) {
		var idx = (v.p !== undefined) ? v.p : ((n01_data.setData.statsData[0].me === 1) ? 1 : 0);
		if (recvTime[idx] >= v.time) {
			return false;
		}
		recvTime[idx] = v.time;
		return true;
	});
	if (scoreData.data.length === 0) {
		return;
	}
	if (n01_data.camOptions.camera_auto_zoom && typeof popupWebCamOpen == 'function') {
		popupWebCamOpen(1);
	}
	for (var i = 0; i < scoreData.data.length; i++) {
		if (scoreData.data[i].leg !== n01_data.setData.currentLeg) {
			continue;
		}
		var player = scoreData.data[i].p;
		if (player === undefined) {
			player = (n01_data.setData.statsData[0].me === 1) ? 1 : 0;
		}
		if (!isFinite(scoreData.data[i].score) || scoreData.data[i].score < -3 || scoreData.data[i].score > 180) {
			netSendError({type:'score', data:scoreData, index:i});
			exitFlag = true;
			alert('Data Error\nTry reloading');
			changeSelectInput(currentLegData().selectRound, currentLegData().selectPlayer);
			return;
		}
		if (scoreData.data[i].round === -1) {
			if (scoreData.data[i].time <= n01_data.setData.statsData[player ? 0 : 1].time) {
				continue;
			}
			currentLegData().currentPlayer = player;
			currentLegData().first = currentLegData().currentPlayer;
			showName();
			showLeft();
			n01_data.saveSetData();
			continue;
		}
		if (!isFinite(scoreData.data[i].round) || scoreData.data[i].round < 0 || scoreData.data[i].round > currentLegData().currentRound) {
			netSendError({type:'round', leg:n01_data.setData.currentLeg, round:currentLegData().currentRound, data:scoreData, index:i});
			exitFlag = true;
			alert('Data Error\nTry reloading');
			changeSelectInput(currentLegData().selectRound, currentLegData().selectPlayer);
			return;
		}
		changeSelectInput(scoreData.data[i].round, player, true);
		if (scoreData.data[i].score < 0) {
			// finish
			var throwIndex = scoreData.data[i].score * -1;
			var round = currentLegData().selectRound;
			netFinishMsgOpen(player, throwIndex, (round * 3) + throwIndex);
			return;
		} else {
			setCurrentScore(scoreData.data[i].score);
			scrollRound(currentLegData().selectRound);
			if ((n01_data.setData.statsData[player].me === 1)) {
				nextScore(true);
			} else {
				nextScore();
			}
		}
	}
	changeSelectInput(currentLegData().currentRound, currentLegData().currentPlayer);
}

function updateUser() {
	$.ajax({
		url: n01_data.phpUser + '?cmd=update&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		timeout: 10000,
		success: function(data) {
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		},
		complete: function(data) {
			setTimeout(function(){
				updateUser();
			}, 60000);
		}
	});
}

function netCheckScore() {
	if (ajaxSyncFlag === true || n01_data.setData.endMatch || exitFlag === true) {
		return;
	}
	ajaxSyncFlag = true;
	if (n01_data.setData.statsData[currentLegData().currentPlayer].me === 1) {
		ajaxSyncFlag = false;
		return;
	}
	$.ajax({
		url: n01_data.phpOnline + '?cmd=check_score&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		timeout: 30000,
		success: function(scoreData) {
			if (finishFlag === true || scoreData.result === 0) {
				return;
			}
			if (scoreData.result < 0) {
				if (n01_data.camOptions.camera_auto_zoom && typeof popupWebCamOpen == 'function') {
					popupWebCamOpen(1);
				}
				exitFlag = true;
				if (window.confirm(res.exit_msg)) {
					menuFunc('menu_new');
					return;
				}
				changeSelectInput(currentLegData().selectRound, currentLegData().selectPlayer);
				return;
			}
			recvScore(scoreData);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			setTimeout(function() {
				netCheckScore();
			}, 10000);
		},
		complete: function(data) {
			ajaxSyncFlag = false;
		}
	});
}

function netInputScore(score) {
	if (score !== null && score !== undefined) {
		var now = new Date();
		var data = {leg: n01_data.setData.currentLeg, round: currentLegData().selectRound, p: currentLegData().currentPlayer, score: score, time: now.getTime()};
		if (sendScoreData === null) {
			sendScoreData = {mid: n01_data.setData.mid, data: [data]};
		} else {
			// ĺŚä¸€ă©ă‚¦ăłă‰ă®ă‡ăĽă‚żă‚’ĺ‰Šé™¤
			sendScoreData.data = sendScoreData.data.filter(function(v) {
				return (v.leg !== n01_data.setData.currentLeg || v.round !== currentLegData().selectRound);
			});
			// é€äżˇç”¨ă‡ăĽă‚żă«ĺ…ĄĺŠ›ă‡ăĽă‚żă‚’č“„ç©Ť
			sendScoreData.data.push(data);
		}
		localStorage.setItem(n01_data.optionPrefix + 'sendScoreData', JSON.stringify(sendScoreData));
		if (currentLegData().currentRound === currentLegData().selectRound) {
			netDeleteScore();
		}
		recvTime[currentLegData().currentPlayer] = now.getTime();
	} else if (sendScoreData === null || sendScoreData.data.length === 0) {
		return;
	}
	if (sendScoreData !== null) {
		// é€äżˇć¸ă‡ăĽă‚żă®ĺ‰Šé™¤
		sendScoreData.data = sendScoreData.data.filter(function(v) {
			return !v.del;
		});
	}
	if (currentLegData().selectRound === currentLegData().currentRound &&
		currentLegData().selectPlayer === currentLegData().currentPlayer) {
		setTimeout(function(){
			changeSelectInput(currentLegData().currentRound, currentLegData().currentPlayer);
		}, 10);
	}
	if (ajaxSendFlag) {
		return;
	}
	ajaxSendFlag = true;
	sendScoreData.data.some(function(v, i) {
		v.send = 1;
	});
	$.ajax({
		url: n01_data.phpOnline + '?cmd=input&sid=' + n01_data.onlineOptions.sid + '&mid=' + n01_data.setData.mid + '&l=' + n01_data.setData.currentLeg + '&r=' + currentLegData().selectRound + '&p=' + currentLegData().selectPlayer + '&s=' + score,
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify(sendScoreData),
		timeout: 10000,
		success: function(data) {
			if (data.result < 0) {
				exitFlag = true;
				alert(res.input_error_msg);
				changeSelectInput(currentLegData().selectRound, currentLegData().selectPlayer);
				sendScoreData = null;
				localStorage.setItem(n01_data.optionPrefix + 'sendScoreData', null);
				return;
			}
			if (sendScoreData !== null) {
				sendScoreData.data.some(function(v, i) {
					if (v.send === 1) {
						v.del = 1;
					}
				});
				localStorage.setItem(n01_data.optionPrefix + 'sendScoreData', JSON.stringify(sendScoreData));
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			setTimeout(function(){
				netInputScore(null);
			}, 10000);
		},
		complete: function(data) {
			ajaxSendFlag = false;
		}
	});
}

function netChangeSelect() {
	var now = new Date();
	var data = {leg: n01_data.setData.currentLeg, round: -1, p: (currentLegData().currentPlayer === 0) ? 1 : 0, score: 0, time: now.getTime()};
	sendScoreData = {mid: n01_data.setData.mid, data: [data]};
	localStorage.setItem(n01_data.optionPrefix + 'sendScoreData', JSON.stringify(sendScoreData));
	$.ajax({
		url: n01_data.phpOnline + '?cmd=input&sid=' + n01_data.onlineOptions.sid + '&mid=' + n01_data.setData.mid + '&l=' + n01_data.setData.currentLeg + '&r=-1&p=' + currentLegData().selectPlayer + '&s=0',
		type: 'POST',
		async: false,
		dataType: 'json',
		data: JSON.stringify(sendScoreData),
		timeout: 30000,
		success: function(data) {
			localStorage.setItem(n01_data.optionPrefix + 'sendScoreData', null);
			sendScoreData = null;
			currentLegData().currentPlayer = (currentLegData().currentPlayer === 0) ? 1 : 0;
			currentLegData().first = currentLegData().currentPlayer;
			changeSelectInput(currentLegData().currentRound, currentLegData().currentPlayer);
			showName();
			showLeft();
			n01_data.saveSetData();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert('Change Select Error\n\n' + XMLHttpRequest.status + ' ' + errorThrown);
		},
		complete: function(data) {
		}
	});
}

function netGetSet() {
	$.ajax({
		url: n01_data.phpOnline + '?cmd=get_match&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		timeout: 30000,
		success: function(data) {
			getSetRetryCount = 0;
			if (data && data.statsData !== undefined) {
				if (data.statsData[0].pid === n01_data.onlineOptions.pid) {
					data.statsData[0].me = 1;
					vsPid = data.statsData[1].pid;
				} else if (data.statsData[1].pid === n01_data.onlineOptions.pid) {
					data.statsData[1].me = 1;
					vsPid = data.statsData[0].pid;
				}
				n01_data.setData = data;
				n01_data.setData.soundPlay = true;
				n01_data.saveSetData();
				localStorage.setItem(n01_data.optionPrefix + 'sendScoreData', null);
				sendScoreData = null;
				initScore();
				changeSelectInput(currentLegData().currentRound, currentLegData().currentPlayer);
				startPush();
				
				if (n01_data.setData.scid !== undefined && n01_data.setData.scid !== '' && n01_data.setData.endSchedule === 1) {
					endMatchMsgOpen();
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			getSetRetryCount++;
			if (getSetRetryCount > 3) {
				getSetRetryCount = 0;
				alert('Get data Error\n\n' + XMLHttpRequest.status + ' ' + errorThrown);
			}
			setTimeout(function(){
				netGetSet();
			}, 10000);
		},
		complete: function(data) {
		}
	});
}

function netDeleteScore() {
	$.ajax({
		url: n01_data.phpOnline + '?cmd=delete_score&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		timeout: 30000,
		success: function(data) {
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		},
		complete: function(data) {
		}
	});
}

function netSendError(jsonData) {
	$.ajax({
		url: n01_data.phpOnline + '?cmd=error&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify(jsonData),
		timeout: 30000,
		success: function(data) {
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		},
		complete: function(data) {
		}
	});
}

function netExitUser() {
	var cmd = 'match_end';
	exitFlag = true;
	n01_data.restoreStatsData();
	var jsonData = {
		score: n01_data.statsData.score,
		darts: n01_data.statsData.darts
	};
	$.ajax({
		url: n01_data.phpUser + '?cmd=' + cmd + '&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify(jsonData),
		timeout: 30000,
		success: function(data) {
			// ă‚»ăăć…ĺ ±ă®ĺťćśźĺŚ–
			n01_data.initSet();
			n01_data.saveSetData();
			window.location.href = n01_data.onlineOptions.returnTop;
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert('Error\n\n' + XMLHttpRequest.status + ' ' + errorThrown);
		},
		complete: function(data) {
		}
	});
}

$(function () {
	var timer = null;
	$(window).resize(function() {
		resize();
		if (timer !== null) {
			clearTimeout(timer);
		}
		timer = setTimeout(function() {
			timer = null;
			resize();
		}, 100);
	});
});

$(function () {
	$(document).on('keydown', function(e) {
		if($('#modal-overlay')[0]) {
			return false;
		}
		if ($('#chat_window').is(':visible')) {
			return true;
		}
		if (!currentLegData()) {
			return false;
		}
		var round = currentLegData().selectRound;
		var player = currentLegData().selectPlayer;
		if (e.key !== undefined) {
			switch (e.key) {
			case 'Enter':
			case 'Tab':
				scrollRound(currentLegData().selectRound);
				if (nextScore() === false) {
					return false;
				}
				changeNextSelect();
				return false;
			case 'Backspace':
				deleteScore();
				return false;
			case 'Escape':
			case 'Esc':
				if (currentLegData().currentRound === currentLegData().selectRound &&
					currentLegData().currentPlayer === currentLegData().selectPlayer) {
					scrollRound(currentLegData().selectRound);
					return false;
				}
				if (currentLegData().playerData[currentLegData().selectPlayer][currentLegData().selectRound + 1] !== undefined) {
					setCurrentScore(currentLegData().playerData[currentLegData().selectPlayer][currentLegData().selectRound + 1].score);
				}
				changeSelectInput(currentLegData().currentRound, currentLegData().currentPlayer);
				return false;
			case 'ArrowLeft':
			case 'Left':
				if (currentLegData().selectPlayer === 0 || nextScore() === false) {
					scrollRound(currentLegData().selectRound);
					return false;
				}
				changeSelectInput(round, 0);
				if (currentLegData().currentRound === 0 && currentLegData().first === currentLegData().currentPlayer) {
					changeFirstConfirmOpen();
				}
				return false;
			case 'ArrowUp':
			case 'Up':
				if (round === 0) {
					scrollTop();
					return false;
				}
				if (round <= currentLegData().currentRound - 1) {
					scrollRound(currentLegData().selectRound);
					return false;
				}
				if (nextScore() === false) {
					scrollRound(currentLegData().selectRound);
					return false;
				}
				changeSelectInput(round - 1, player);
				return false;
			case 'ArrowRight':
			case 'Right':
				if (currentLegData().selectPlayer === 1 || nextScore() === false) {
					scrollRound(currentLegData().selectRound);
					return false;
				}
				changeSelectInput(round, 1);
				if (currentLegData().currentRound === 0 && currentLegData().first === currentLegData().currentPlayer) {
					changeFirstConfirmOpen();
				}
				return false;
			case 'ArrowDown':
			case 'Down':
				if (round >= currentLegData().currentRound || nextScore() === false) {
					scrollRound(currentLegData().selectRound);
					return false;
				}
				changeSelectInput(round + 1, player);
				return false;
			case 'f':
				if ($('#menu_finish').is(':visible')) {
					scrollRound(currentLegData().selectRound);
					finishMenuOpen();
				}
				return false;
			case 'm':
				generalMenuOpen();
				return false;
			case 's':
				statsOpen();
				return false;
			case 'F5':
			case 'F11':
				break;
			default:
				if (e.key.match(/^[0-9]$/)) {
					inputScore(parseInt(e.key, 10));
				}
				return false;
			}
		} else {
			switch (e.keyCode) {
			case 13:	// Enter
			case 9:		// Tab
				scrollRound(currentLegData().selectRound);
				if (nextScore() === false) {
					return false;
				}
				changeNextSelect();
				return false;
			case 8:		// BS
				deleteScore();
				return false;
			case 27:	// ESC
				if (currentLegData().currentRound === currentLegData().selectRound &&
					currentLegData().currentPlayer === currentLegData().selectPlayer) {
					scrollRound(currentLegData().selectRound);
					return false;
				}
				if (currentLegData().playerData[currentLegData().selectPlayer][currentLegData().selectRound + 1] !== undefined) {
					setCurrentScore(currentLegData().playerData[currentLegData().selectPlayer][currentLegData().selectRound + 1].score);
				}
				changeSelectInput(currentLegData().currentRound, currentLegData().currentPlayer);
				return false;
			case 37:	// â†
				if (currentLegData().selectPlayer === 0 || nextScore() === false) {
					scrollRound(currentLegData().selectRound);
					return false;
				}
				changeSelectInput(round, 0);
				if (currentLegData().currentRound === 0 && currentLegData().first === currentLegData().currentPlayer) {
					changeFirstConfirmOpen();
				}
				return false;
			case 38:	// â†‘
				if (round === 0) {
					scrollTop();
					return false;
				}
				if (round <= currentLegData().currentRound - 1) {
					scrollRound(currentLegData().selectRound);
					return false;
				}
				if (nextScore() === false) {
					scrollRound(currentLegData().selectRound);
					return false;
				}
				changeSelectInput(round - 1, player);
				return false;
			case 39:	// â†’
				if (currentLegData().selectPlayer === 1 || nextScore() === false) {
					scrollRound(currentLegData().selectRound);
					return false;
				}
				changeSelectInput(round, 1);
				if (currentLegData().currentRound === 0 && currentLegData().first === currentLegData().currentPlayer) {
					changeFirstConfirmOpen();
				}
				return false;
			case 40:	// â†“
				if (round >= currentLegData().currentRound || nextScore() === false) {
					scrollRound(currentLegData().selectRound);
					return false;
				}
				changeSelectInput(round + 1, player);
				return false;
			case 70:	// f
				if ($('#menu_finish').is(':visible')) {
					scrollRound(currentLegData().selectRound);
					finishMenuOpen();
				}
				return false;
			case 77:	// m
				generalMenuOpen();
				return false;
			case 83:	// s
				statsOpen();
				return false;
			case 116:	// F5
			case 122:	// F11
				break;
			default:
				if (e.keyCode >= 48 && e.keyCode <= 48 + 9) {
					inputScore(e.keyCode - 48);
				} else if (e.keyCode >= 96 && e.keyCode <= 96 + 9) {
					inputScore(e.keyCode - 96);
				}
				return false;
			}
		}
		return true;
	});
});

$(function() {
	$('#header_table, #score_table, #menu_table').on('click', function() {
		setFocus();
	});

	// ĺ…ĄĺŠ›ă‚ąă‚łă‚˘ă‚ŻăŞăă‚Ż
	$('.score_input').on('click', function() {
		var round = parseInt($(this).attr('round'), 10);
		if (isNaN(round) || round < currentLegData().currentRound - 1 || round > currentLegData().currentRound) {
			// ćś‰ĺŠąçŻ„ĺ›˛ĺ¤–
			return;
		}
		var player = parseInt($(this).attr('player'), 10);
		if (isNaN(player)) {
			return;
		}
		if (currentLegData().selectRound === round && currentLegData().selectPlayer === player) {
			// ç§»ĺ‹•ăŞă—
			return;
		}
		if (nextScore()) {
			changeSelectInput(round, player);
			if (currentLegData().currentRound === 0 && currentLegData().first === currentLegData().currentPlayer) {
				changeFirstConfirmOpen();
			}
		}
	});
	// ć®‹ă‚Šă‚ąă‚łă‚˘ă‚ŻăŞăă‚Ż
	$('.score_left').on('click', function() {
		var round = parseInt($(this).attr('round'), 10);
		if (isNaN(round) || round < currentLegData().currentRound - 1 || round > currentLegData().currentRound) {
			// ćś‰ĺŠąçŻ„ĺ›˛ĺ¤–
			return;
		}
		var player = parseInt($(this).attr('player'), 10);
		if (isNaN(player)) {
			return;
		}
		if (currentLegData().selectRound === round && currentLegData().selectPlayer === player) {
			// ç§»ĺ‹•ăŞă—
			return;
		}
		if (nextScore()) {
			changeSelectInput(round, player);
			if (currentLegData().currentRound === 0 && currentLegData().first === currentLegData().currentPlayer) {
				changeFirstConfirmOpen();
			}
		}
	});
});

// ăˇă‹ăĄăĽĺ‡¦ç†
function menuFunc(menuId) {
	switch (menuId) {
	case 'menu_new':
		if (n01_data.setData.endMatch) {
			netExitUser();
			break;
		}
		if (!exitFlag) {
			exitConfirmOpen();
		} else {
			netExitUser();
		}
		break;
	case 'menu_finish':
		scrollRound(currentLegData().selectRound);
		finishMenuOpen();
		break;
	case 'menu_stats':
		statsOpen();
		break;
	case 'menu_menu':
		generalMenuOpen();
		break;
	}
}

$(function() {
	$('#menu_table td').on('click', function(e) {
		if ($(this).prop('disabled')) {
			return false;
		}
		menuFunc(this.id);
		return false;
	});

	// ă‚­ăĽă‘ăă‰ĺ‡¦ç†
	var touchstart;
	var touchend;
	if (navigator.pointerEnabled) {
		touchstart = 'pointerdown';
		touchend = 'pointerup';
	} else if (navigator.msPointerEnabled) {
		touchstart = 'MSPointerDown';
		touchend = 'MSPointerUp';
	} else if ('ontouchstart' in window) {
		if (n01_util.getUserAgent().isAndroid) {
			touchstart = 'touchstart';
			touchend = 'touchend';
		} else {
			touchstart = 'touchstart mousedown';
			touchend = 'touchend mouseup';
		}
	} else {
		touchstart = 'mousedown';
		touchend = 'mouseup';
	}
	var touched = false;
	var eventType = null;
	var keyTimer = null;
	$('#key_table td').on(touchstart, function(e) {
		$(this).addClass('key_active');
		touched = true;
		return true;
	});
	$('#key_table td').on(touchend, function(e) {
		$(this).removeClass('key_active');
		// touchendă¨mouseupăŚé€Łç¶šă—ă¦ç™şç”źă™ă‚‹ă®ă‚’ćŠ‘ĺ¶
		if (keyTimer !== null) {
			clearTimeout(keyTimer);
		}
		keyTimer = setTimeout(function() {
			keyTimer = null;
			eventType = null;
		}, 1000);
		if (eventType !== null && eventType !== e.type) {
			return false;
		}
		eventType = e.type;
		if (!touched) {
			return false;
		}
		touched = false;

		// ĺ…ĄĺŠ›ĺ‡¦ç†
		scrollRound(currentLegData().selectRound);
		var str = this.id;
		str = str.substr('key_'.length);
		if (str.length === 1) {
			inputScore(str);
		} else if (str === 'delete') {
			deleteScore();
		} else if (str === 'enter') {
			if (nextScore()) {
				changeNextSelect();
			}
		}
		return false;
	});
	$('#key_table td').on('mouseout', function() {
		$(this).removeClass('key_active');
		touched = false;
	});
});

// ăŞă‚µă‚¤ă‚ş
var resizeTimer = null;
function resize() {
	var windowSize = ($(window).width() < $(window).height()) ? $(window).width() : $(window).height();

	// ă˘ăĽă€ă«ă‚¦ă‚Łăłă‰ă‚¦
	var modalWidth = windowSize * 0.9;
	$('.modal_window').css('width', modalWidth + 'px');
	var modalFont = windowSize * 0.06;
	$('.modal_window').css('font-size', modalFont + 'px');
	var menuPadding = windowSize * 0.045;
	$('.menu_ul li').css('padding', menuPadding + 'px 0px');
	var messagePadding1 = windowSize * 0.1;
	var messagePadding2 = windowSize * 0.005;
	var messagePaddingWidth = windowSize * 0.05;
	$('.message_title').css('padding', messagePadding1 + 'px ' + messagePaddingWidth + 'px ' + messagePadding2 + 'px ' + messagePaddingWidth + 'px');
	$('.message_msg').css('padding', messagePadding2 + 'px ' + messagePaddingWidth + 'px ' + messagePadding1 + 'px ' + messagePaddingWidth + 'px');
	$('#stats_msg').css('width', $(window).width() * 0.9 + 'px');
	$('#stats_msg').css('height', $(window).height() * 0.9 + 'px');
	
	centeringObject($('#general_menu'));
	centeringObject($('#finish_menu'));
	centeringObject($('#popup_message'));
	centeringObject($('#popup_message_net'));
	centeringObject($('#stats_msg'));

	var messageButtonPadding = windowSize * 0.045;
	$('.msg_button').css('padding', messageButtonPadding + 'px 0px');
	var messageButtonMargin = windowSize * 0.045;
	$('#msg_cancel').css('margin', '0 ' + (messageButtonMargin / 2) + 'px ' + messageButtonMargin + 'px ' + messageButtonMargin + 'px');
	$('#msg_ok').css('margin', '0 ' + messageButtonMargin + 'px ' + messageButtonMargin + 'px ' + (messageButtonMargin / 2) + 'px');
	$('#msg_net_ok').css('margin', messageButtonMargin + 'px');
	$('#msg_net_ok').css('margin-top', '0');

	$('#menu_chat_count').css('font-size', windowSize * 0.04 + 'px');
	$('#menu_chat_count').css('padding', (windowSize * 0.02) + 'px ' + (windowSize * 0.02) + 'px');
	$('#menu_chat_count').css('line-height', windowSize * 0.02 + 'px');
	$('#menu_chat_count').css('margin-left', windowSize * 0.02 + 'px');

	// ăăă€ăĽ
	var flagSize = windowSize * 0.05;
	var flagMargin = windowSize * 0.015;
	if (n01_data.options.keyShow === 1 && $('#left_table').is(':visible') &&
		$(window).width() > $(window).height()) {
		$('.player_name').css('padding', (windowSize * 0.005) + 'px ' + (windowSize * 0.01) + 'px');
		$('.player_name').css('height', (windowSize * 0.05) + 'px');
		$('#header_table').css('font-size', windowSize * 0.03 + 'px');
		$('#legs').css('font-size', (windowSize * 0.04) + 'px');
		$('#title').css('font-size', (windowSize * 0.03) + 'px');
		$('#title').css('padding-top', (windowSize * 0.005) + 'px');
		flagSize = windowSize * 0.03;
		flagMargin = windowSize * 0.01;
	} else {
		$('.player_name').css('padding', (windowSize * 0.01) + 'px ' + (windowSize * 0.02) + 'px');
		$('.player_name').css('height', (windowSize * 0.08) + 'px');
		if ($(window).width() > $(window).height()) {
			$('#header_table').css('font-size', windowSize * 0.05 + 'px');
		} else {
			$('#header_table').css('font-size', windowSize * 0.045 + 'px');
		}
		$('#legs').css('font-size', ((n01_data.setData.scid) ? windowSize * 0.06 : windowSize * 0.07) + 'px');
		$('#title').css('font-size', (windowSize * 0.035) + 'px');
		$('#title').css('padding-top', (windowSize * 0.01) + 'px');
	}
	$('.flag').css('width', flagSize + 'px');
	$('.flag').css('height', flagSize + 'px');
	$('.flag').css('margin-left', flagMargin + 'px');
	$('#header').css('height', $('#header_table').height() + 'px');

	var scoreFont;
	if ($(window).width() < $(window).height()) {
		// ç¸¦ĺą…ăŚé•·ă„ĺ ´ĺăŻSmartphoneă«ćś€é©ĺŚ–
		windowSize = $(window).width();
		scoreFont = windowSize * 0.085;
	} else {
		// ć¨Şĺą…ăŚé•·ă„ĺ ´ĺăŻPCă«ćś€é©ĺŚ–
		windowSize = $(window).width() * 0.75;
		scoreFont = windowSize * 0.09;
	}
	
	// ă‚ąă‚łă‚˘ä¸€č¦§
	var scoreHeaderHeight = windowSize * 0.06;
	var scoreHeaderFont = windowSize * 0.045;
	$('.score_table th').css('height', scoreHeaderHeight + 'px');
	$('.score_table th').css('font-size', scoreHeaderFont + 'px');

	var scoreHeight = windowSize * 0.138;
	$('.score_table td').css('height', scoreHeight + 'px');
	$('.score_table td').css('font-size', scoreFont + 'px');
	$('.hidden_table td').css('height', scoreHeight + 'px');
	$('.hidden_table td').css('font-size', scoreFont + 'px');
	$('.input_text_score').css('font-size', scoreFont + 'px');

	$('.score_table th:first-child, .score_table td:first-child, .hidden_table td:first-child').css('border-left', '0px');
	$('.score_table th:last-child, .score_table td:last-child, .hidden_table td:last-child').css('border-right', '0px');

	resizeCircleTon(windowSize);

	windowSize = ($(window).width() < $(window).height()) ? $(window).width() : $(window).height();
	// ă•ăă‚żăĽ
	$('#key_table td:first-child').css('border-left', '0px');
	$('#key_table td:last-child').css('border-right', '0px');
	$('#key_table tr:last-child td').css('border-bottom', '0px');
	if ($('#left_table').is(':visible')) {
		var leftWindowSize = ($(window).width() < $(window).height() * 1.1) ? $(window).width() : $(window).height() * 1.1;
		if (n01_data.options.keyShow === 1 && leftWindowSize > $(window).height() / 1.2) {
			leftWindowSize = $(window).height() / 1.2;
		}
		if (n01_data.options.keyShow === 1 && leftWindowSize > $(window).height() / 1.5 &&
			($('#localVideoWrapper').is(':visible') || $('#remoteVideoWrapper').is(':visible'))) {
			leftWindowSize = $(window).height() / 1.5;
		}
		var leftFont = leftWindowSize * 0.21;
		$('#left_table td').css('font-size', leftFont + 'px');
		var leftFocusSize = windowSize * 0.017;
		$('.left_big').css('margin', leftFocusSize + 'px');

		if ($('#localVideoWrapper').is(':visible') || $('#remoteVideoWrapper').is(':visible')) {
			$('#localVideoWrapper').css('height', (leftWindowSize * 0.36) + 'px');
			$('#localVideoWrapper').css('margin', (leftFocusSize / 2) + 'px');
			$('#remoteVideoWrapper').css('height', (leftWindowSize * 0.36) + 'px');
			$('#remoteVideoWrapper').css('margin', (leftFocusSize / 2) + 'px');

			$('.left_big').css('height', (leftWindowSize * 0.36) + 'px');
			$('.left_big').css('margin', (leftFocusSize / 2) + 'px');
			$('.left_big').css('padding', '0');

			$('#localVideoContainer').css('width', $('#localVideoWrapper').height() * 1.33 + 'px');
			$('#localVideoContainer').css('height', $('#localVideoWrapper').height() + 'px');
			$('#localVideoContainer').css('left', ($('#localVideoWrapper').width() / 2 - $('#localVideoContainer').width() / 2) + 'px');
			if ($('#localVideo').width() > $('#localVideo').height() * 1.33) {
				$('#localVideo').css('height', $('#localVideoContainer').height() + 'px');
				$('#localVideo').css('width', 'auto');
			} else {
				$('#localVideo').css('width', $('#localVideoContainer').height() * 1.33 + 'px');
				$('#localVideo').css('height', 'auto');
			}
			$('#localVideo').css('top', ($('#localVideoContainer').height() / 2 - $('#localVideo').height() / 2) + 'px');
			$('#localVideo').css('left', ($('#localVideoContainer').width() / 2 - $('#localVideo').width() / 2) + 'px');

			if ($('#popup_webcam').is(':visible')) {
				var ws = ($(window).width() < $(window).height()) ? $(window).width() : $(window).height();
				var ws_w = $(window).width();
				var show_score = true;
				if ($(window).width() < $(window).height() + 250) {
					$('#videoWrapper').css('width', $(window).width() + 'px');
					$('#videoWrapper').css('height', ($(window).width() * 0.75) + 'px');
					if (n01_data.options.keyShow !== 1) {
						$('#videoWrapper').css('top', ($(window).height() / 2 - $('#videoWrapper').height() / 2) + 'px');
					} else if ($(window).height() - $('#footer').offset().top < $('#videoWrapper').height()) {
						$('#videoWrapper').css('top', ($(window).height() - $('#videoWrapper').height()) + 'px');
					} else {
						$('#videoWrapper').css('top', $('#footer').offset().top + 'px');
						show_score = false;
					}
					$('#videoWrapper').css('left', '0px');
				} else {
					ws_w = ws * 1.33;
					$('#videoWrapper').css('height', ws + 'px');
					$('#videoWrapper').css('width', (ws * 1.33) + 'px');
					$('#videoWrapper').css('top', '0px');
					$('#videoWrapper').css('left', ($(window).width() / 2 - $('#videoWrapper').width() / 2) + 'px');
				}

				$('#remoteVideoContainer').css('width', $('#videoWrapper').height() * 1.33 + 'px');
				$('#remoteVideoContainer').css('height', $('#videoWrapper').height() + 'px');
				$('#remoteVideoContainer').css('left', ($('#videoWrapper').width() / 2 - $('#videoWrapper').width() / 2) + 'px');
				
				if (show_score) {
					if (!$('#p1left_cam').length) {
						$('#remoteVideoContainer').append('<div id="p1left_cam" class="score_left_big"></div>');
						$('#remoteVideoContainer').append('<div id="p2left_cam" class="score_left_big"></div>');
						$('#p1left_big').parent().appendTo('#p1left_cam');
						$('#p2left_big').parent().appendTo('#p2left_cam');

						$('#p1left_cam').css('position', 'absolute');
						$('#p2left_cam').css('position', 'absolute');
					} else {
						$('#p1left_cam').show();
						$('#p2left_cam').show();
					}
					$('#p1left_big').parent().show();
					$('#p2left_big').parent().show();
					$('.left_big').css('height', '100%');
					$('.score_left_big').css('font-size', ws_w * 0.08 + 'px');
					$('#p1left_cam').css('opacity', 0.75);
					$('#p1left_cam').css('width', ws_w * 0.22 + 'px');
					$('#p1left_cam').css('height', ws_w * 0.1 + 'px');
					$('#p1left_cam').css('left', '0px');
					$('#p1left_cam').css('bottom', leftFocusSize + 'px');

					$('#p2left_cam').css('opacity', 0.75);
					$('#p2left_cam').css('width', ws_w * 0.22 + 'px');
					$('#p2left_cam').css('height', ws_w * 0.1 + 'px');
					$('#p2left_cam').css('right', '0px');
					$('#p2left_cam').css('bottom', leftFocusSize + 'px');
				} else if ($('#p1left_cam').length) {
					$('#p1left_cam').hide();
					$('#p2left_cam').hide();
				}
			} else {
				if ($('#p1left_cam').length) {
					$('#p1left_cam').hide();
					$('#p2left_cam').hide();
				}
				$('#remoteVideoContainer').css('width', $('#remoteVideoWrapper').height() * 1.33 + 'px');
				$('#remoteVideoContainer').css('height', $('#remoteVideoWrapper').height() + 'px');
				$('#remoteVideoContainer').css('left', ($('#remoteVideoWrapper').width() / 2 - $('#remoteVideoContainer').width() / 2) + 'px');
			}
			if ($('#remoteVideo').width() > $('#remoteVideo').height() * 1.33) {
				$('#remoteVideo').css('height', $('#remoteVideoContainer').height() + 'px');
				$('#remoteVideo').css('width', 'auto');
			} else {
				$('#remoteVideo').css('width', $('#remoteVideoContainer').height() * 1.33 + 'px');
				$('#remoteVideo').css('height', 'auto');
			}
			$('#remoteVideo').css('top', ($('#remoteVideoContainer').height() / 2 - $('#remoteVideo').height() / 2) + 'px');
			$('#remoteVideo').css('left', ($('#remoteVideoContainer').width() / 2 - $('#remoteVideo').width() / 2) + 'px');

			$('#localVideoWrapper').find('.mic_icon').css('height', (leftWindowSize * 0.12) + 'px');
			var mic_left = ($('#localVideoWrapper').width() - ($('#localVideoWrapper').width() - $('#localVideoContainer').width()) / 2);
			if (mic_left > $('#localVideoWrapper').width()) {
				mic_left = $('#localVideoWrapper').width();
			}
			mic_left = mic_left - leftWindowSize * 0.125;
			$('#localVideoWrapper').find('.mic_icon').css('left', mic_left + 'px');
			var mic_top = ($('#localVideoWrapper').height() - ($('#localVideoWrapper').height() - $('#localVideoContainer').height()) / 2);
			if (mic_top > $('#localVideoWrapper').height()) {
				mic_top = $('#localVideoWrapper').height();
			}
			mic_top = mic_top - leftWindowSize * 0.125;
			$('#localVideoWrapper').find('.mic_icon').css('top', mic_top + 'px');
			$('#localVideoWrapper').find('.mic_icon').css('border-radius', '50%');
			
			$('#remoteVideoWrapper').find('.mic_icon').css('height', (leftWindowSize * 0.06) + 'px');
			mic_left = ($('#remoteVideoWrapper').width() - ($('#remoteVideoWrapper').width() - $('#remoteVideoContainer').width()) / 2);
			if (mic_left > $('#remoteVideoWrapper').width()) {
				mic_left = $('#remoteVideoWrapper').width();
			}
			mic_left = mic_left - leftWindowSize * 0.065;
			$('#remoteVideoWrapper').find('.mic_icon').css('left', mic_left + 'px');
			mic_top = ($('#remoteVideoWrapper').height() - ($('#remoteVideoWrapper').height() - $('#remoteVideoContainer').height()) / 2);
			if (mic_top > $('#remoteVideoWrapper').height()) {
				mic_top = $('#remoteVideoWrapper').height();
			}
			mic_top = mic_top - leftWindowSize * 0.065;
			$('#remoteVideoWrapper').find('.mic_icon').css('top', mic_top + 'px');
			$('#remoteVideoWrapper').find('.mic_icon').css('border-radius', '50%');
		} else {
			var leftPadding = leftWindowSize * 0.005;
			$('.left_big').css('padding', leftPadding + 'px 0');
			$('.left_big').css('height', 'auto');
		}
	}

	if (n01_data.options.smallKeypad === 1) {
		windowSize = windowSize / 1.5;
	}
	var keySize = windowSize;
	if (n01_data.options.keyShow === 1 && $('#left_table').is(':visible')) {
		keySize = $(window).height() / 2;
	} else {
		keySize = $(window).height() / 1.5;
	}
	if (windowSize > keySize) {
		windowSize = keySize;
	}
	var menuHeight = windowSize * 0.1;
	var menuFont = windowSize * 0.05;
	$('#menu_table td').css('height', menuHeight + 'px');
	$('#menu_table td').css('font-size', menuFont + 'px');

	var imgMenuHeight = windowSize * 0.03;
	var imgMenuWidth = imgMenuHeight * 2;
	$('#img_menuButton').css('height', imgMenuHeight + 'px');
	$('#img_menuButton').css('width', imgMenuWidth + 'px');

	$('#chat_count').css('font-size', windowSize * 0.03 + 'px');
	$('#chat_count').css('margin-top', -(windowSize * 0.01) + 'px');
	$('#chat_count').css('padding', (windowSize * 0.015) + 'px ' + (windowSize * 0.015) + 'px');
	$('#chat_count').css('line-height', windowSize * 0.02 + 'px');
	$('#chat_count').css('margin-left', windowSize * 0.02 + 'px');
	$('#chat_return_button').css('font-size', (windowSize * 0.04) + 'px');
	$('#c_send_button').css('font-size', (windowSize * 0.04) + 'px');

	// ć•°ĺ­—ă‚­ăĽ
	var keyHeight = windowSize * 0.15;
	var keyFont = windowSize * 0.09;
	$('#key_table td').css('height', keyHeight + 'px');
	$('#key_table').css('font-size', keyFont + 'px');
	var enterFont = windowSize * 0.06;
	$('#key_enter').css('font-size', enterFont + 'px');

	var imgDeleteHeight = windowSize * 0.058;
	var imgDeleteWidth = imgDeleteHeight * (230 / 140);
	$('#img_delete').css('height', imgDeleteHeight + 'px');
	$('#img_delete').css('width', imgDeleteWidth + 'px');

	// ć•°ĺ­—ă‚­ăĽă®čˇ¨ç¤şă€éťžčˇ¨ç¤şă«ă‚ă‚‹ă‚ąă‚Żă­ăĽă«çŻ„ĺ›˛ă®č¨­ĺ®š
	var footerHeight = $('#menu_table').height();
	if ($('#left_table').is(':visible')) {
		footerHeight += $('#left_table').height();
	}
	if (n01_data.options.keyShow === 1) {
		footerHeight += $('#key_table').height();
	}
	if (n01_data.options.inputTag === 1 && n01_util.getUserAgent().isiOS) {
		//footerHeight += 44;
	}
	$('#footer').css('height', footerHeight + 'px');
	$('#article').css('height', ($(window).height() - $('#header').outerHeight(true) - $('#footer').outerHeight(true)) + 'px');
	$('#article').css('margin-top', $('#header').outerHeight(true) + 'px');

	if (currentLegData() !== undefined && currentLegData() !== null) {
		if (resizeTimer !== null) {
			clearTimeout(resizeTimer);
		}
		resizeTimer = setTimeout(function() {
			resizeTimer = null;
			scrollTop();
			scrollRound(currentLegData().selectRound);
		}, 100);
	}
}

function resizeCircleTon(windowSize) {
	if (n01_data.options.circleTon !== 1) {
		return;
	}
	var tonWidth = getScoreObj(0, 0).width() * 4;
	var tonHeight = getScoreObj(0, 0).height() * 4;
	if (tonWidth === 0 || tonHeight === 0) {
		return;
	}
	$('#canvas_ton').attr('width', tonWidth + 'px');
	$('#canvas_ton').attr('height', tonHeight + 'px');
	var canvas = document.getElementById('canvas_ton');
	if (!canvas || !canvas.getContext) {
		return;
	}
	var ctx = canvas.getContext('2d');
	ctx.beginPath();
	ctx.save();
	ctx.scale(tonWidth / tonHeight, 1);
	var margin = Math.floor(windowSize * 0.006);
	if (margin < 2) {
		margin = 2;
	}
	ctx.arc(tonHeight / 2, tonHeight / 2, tonHeight/ 2 - margin * 4, 0, Math.PI * 2, false);
	ctx.restore();
	if ($('#canvas_ton').length) {
		ctx.strokeStyle = $('#canvas_ton').css('color');
	}
	var border = Math.floor(windowSize * 0.005);
	if (border < 2) {
		border = 2;
	}
	ctx.lineWidth = border * 4;
	ctx.stroke();
	$('.score_input').each(function(i, elem) {
		setCircleTon($(elem));
	});
}

function setCircleTon(obj) {
	if (n01_data.options.circleTon !== 1) {
		return;
	}
	var score = parseInt(obj.text(), 10);
	if (score >= 100) {
		var canvas = document.getElementById('canvas_ton');
		if (canvas && canvas.getContext) {
			obj.css('background-image', 'url("' + canvas.toDataURL() + '")');
		}
		obj.addClass('ton');
	} else {
		obj.css('background-image', 'none');
		obj.removeClass('ton');
	}
}

// ă‚»ăłă‚żăŞăłă‚°
function centeringObject(obj) {
	var w = $(window).width();
	var h = $(window).height();
	var cw = obj.width();
	var ch = obj.height();
	obj.css({'left': ((w - cw) / 2) + 'px', 'top': ((h - ch) / 2) + 'px'});
}

// ă‚­ăĽă‘ăă‰ă®čˇ¨ç¤şĺ‡ă‚Šć›żă
function showKeypad() {
	if (n01_data.options.keyShow === 1) {
		$('#key_table').show();
	} else {
		$('#key_table').hide();
	}
	resize();
	scrollRound(currentLegData().selectRound);
}

// ĺŤĺ‰Ťă®čˇ¨ç¤ş
function showName() {
	var t = '';
	if (n01_data.setData.scMode === 1) {
		t = res.limit_leg_msg1 + n01_data.setData.limitLeg + res.limit_leg_msg2;
	} else if (n01_data.setData.limitSet > 0) {
		t = res.limit_set_msg1 + n01_data.setData.limitSet + res.limit_set_msg2 + n01_data.setData.limitLeg + res.limit_set_msg3;
	} else if (n01_data.setData.limitLeg > 0) {
		if (n01_data.setData.drawMode === 1) {
			t = res.best_of_msg1 + (n01_data.setData.limitLeg - 1) * 2 + res.best_of_msg2;
		} else {
			t = res.limit_leg_msg1 + n01_data.setData.limitLeg + res.limit_leg_msg2;
		}
	}
	if (n01_data.setData.title) {
		$('#title').text(n01_data.setData.title + ((t !== '') ? ' (' + t + ')' : ''));
		$('#title').show();
	} else if (t !== '') {
		$('#title').text(t);
		$('#title').show();
	} else {
		$('#title').hide();
	}
	if (currentLegData().first === 0) {
		$('#p1_name').find('.name_text').text('* ' + n01_data.setData.statsData[0].name);
		$('#p2_name').find('.name_text').text(n01_data.setData.statsData[1].name);
	} else {
		$('#p1_name').find('.name_text').text(n01_data.setData.statsData[0].name);
		$('#p2_name').find('.name_text').text('* ' + n01_data.setData.statsData[1].name);
	}
	if (n01_data.setData.statsData[0].country) {
		$('#p1_name').find('.flag').attr('src', 'n01_v2/image/flags/' + n01_data.setData.statsData[0].country + '.png');
		$('#p1_name').find('.flag').show();
	}
	if (n01_data.setData.statsData[1].country) {
		$('#p2_name').find('.flag').attr('src', 'n01_v2/image/flags/' + n01_data.setData.statsData[1].country + '.png');
		$('#p2_name').find('.flag').show();
	}
	
	$('#article').css('top', $('#header_table').height() + 'px');
}

// Legć•°ă®čˇ¨ç¤ş
function showLegs() {
	if (n01_data.setData.scid === undefined || n01_data.setData.scid === '') {
		$('#legs').text(n01_data.setData.statsData[0].winLegs + ' - ' + n01_data.setData.statsData[1].winLegs);
	} else {
		$('#legs').text('(' + n01_data.setData.statsData[0].winSets + ') ' + n01_data.setData.statsData[0].winLegs + ' - ' + n01_data.setData.statsData[1].winLegs + ' (' + n01_data.setData.statsData[1].winSets + ')');
	}
}

// ć®‹ă‚Šă‚ąă‚łă‚˘ă®čˇ¨ç¤ş
function showLeft() {
	var left;
	try {
		if (currentLegData().playerData[0][currentLegData().currentRound + 1] !== undefined) {
			left = currentLegData().playerData[0][currentLegData().currentRound + 1].left;
		} else {
			left = currentLegData().playerData[0][currentLegData().currentRound].left;
		}
		$('#p1left_big').text(left);
	} catch (e) {
	  console.error(e);
	}
	try {
		if (currentLegData().playerData[1][currentLegData().currentRound + 1] !== undefined) {
			left = currentLegData().playerData[1][currentLegData().currentRound + 1].left;
		} else {
			left = currentLegData().playerData[1][currentLegData().currentRound].left;
		}
		$('#p2left_big').text(left);
	} catch (e) {
	  console.error(e);
	}
	showLeftCurrent();
}

function setFinishLeft() {
	if (currentLegData().currentPlayer === 0) {
		$('#p1left_big').text(0);
	} else {
		$('#p2left_big').text(0);
	}
}

function showLeftCurrent() {
	if (currentLegData().currentPlayer === 0) {
		$('#p1left_big_td').addClass('focus_frame');
		$('#p2left_big_td').removeClass('focus_frame');
	} else {
		$('#p1left_big_td').removeClass('focus_frame');
		$('#p2left_big_td').addClass('focus_frame');
	}
}

function scrollTop() {
	$('#article').scrollTop(0);
}

// é¸ćŠžä˝Ťç˝®ăľă§ă‚ąă‚Żă­ăĽă«
function scrollRound(round) {
	var offsetY = $('#article').height() - $('#round_' + round).height();
	var top = 0;
	if ($('.score_table th').is(':visible')) {
		top += $('#score_table th').height();
	}
	if ($('#score_list_start').is(':visible')) {
		top += $('#round_' + round).height() * (round + 1);
	} else {
		top += $('#round_' + round).height() * round;
	}
	var scrollY = $('#article').scrollTop();
	if (top <= scrollY) {
		// ä¸Šă«ă‚ąă‚Żă­ăĽă«
		$('#article').scrollTop(top);
	} else if(top >= scrollY + offsetY) {
		// ä¸‹ă«ă‚ąă‚Żă­ăĽă«
		$('#article').scrollTop(top - offsetY);
	}
}

var currentInputObj;
var startInput = true;
// é¸ćŠžă‚’ç§»ĺ‹•
function changeSelectInput(newRound, newPlayer, checkStart, sel_only) {
	if (n01_data.setData.endMatch) {
		return;
	}
	if (newRound < 0 || newRound > currentLegData().currentRound) {
		return;
	}
	if (currentInputObj) {
		// ĺ‰Ťĺ›žă®ĺ…ĄĺŠ›ă®č§Łé™¤
		currentInputObj.removeClass('input_area');
		currentInputObj.removeClass('loding');
		if (n01_data.options.inputTag === 1) {
			var currentScore = getCurrentScore();
			$('#input_text_score').remove();
			currentInputObj.text(currentScore);
			setCircleTon(currentInputObj);
		}
	}
	// ĺ…ĄĺŠ›ĺźźă®č¨­ĺ®š
	currentInputObj = getScoreObj(newRound, newPlayer);
	currentInputObj.addClass('input_area');
	if (n01_data.options.inputTag === 1) {
		// ĺ…ĄĺŠ›ĺźźă‚’inpută‚żă‚°ă«ă™ă‚‹(iOSă§ă®BluetoothĺŻľĺżś)
		var score = currentInputObj.text();
		currentInputObj.text('');
		currentInputObj.append('<input type="text" id="input_text_score" class="input_text_score" />');
		$('.input_text_score').css('font-size',  $('.score_table td').css('font-size'));
		setCurrentScore(score);
		setCircleTon(currentInputObj);
	}
	startInput = true;
	
	currentLegData().selectRound = newRound;
	currentLegData().selectPlayer = newPlayer;
	n01_data.setData.currnetInput = getCurrentScore();
	n01_data.saveSetData();
	
	scrollRound(currentLegData().selectRound);
	enableFinishButton();

	setFocus();
	if (sel_only) {
		return;
	}
	if (currentLegData().selectRound === currentLegData().currentRound &&
		currentLegData().selectPlayer === currentLegData().currentPlayer &&
		currentLegData().playerData[currentLegData().selectPlayer][currentLegData().selectRound + 1] === undefined &&
		n01_data.setData.statsData[currentLegData().currentPlayer].me !== 1) {
		
		setTimeout(function(){
			if (n01_data.camOptions.camera_auto_zoom &&
				n01_data.setData.statsData[currentLegData().currentPlayer].me !== 1 &&
				typeof popupWebCamOpen == 'function') {
				popupWebCamOpen(0);
			}
		}, 1000);
		
		if (exitFlag === false) {
			$('#input_text_score').hide();
			currentInputObj.addClass('loding');
		} else {
			currentInputObj.text('--');
			n01_data.setData.endMatch = 1;
		}
	}
}

function changeNextSelect() {
	if (n01_data.setData.endMatch) {
		return;
	}
	if (getCurrentScore() === '') {
		return;
	}
	if (currentLegData().first === currentLegData().selectPlayer) {
		changeSelectInput(currentLegData().selectRound, (currentLegData().selectPlayer === 0) ? 1 : 0);
	} else {
		changeSelectInput(currentLegData().selectRound + 1, (currentLegData().selectPlayer === 0) ? 1 : 0);
	}
}

function setCurrentScore(score) {
	if (n01_data.options.inputTag === 1) {
		$('#input_text_score').val(score);
	} else {
		currentInputObj.text(score);
		setCircleTon(currentInputObj);
	}
}

function getCurrentScore() {
	var score;
	if (n01_data.options.inputTag === 1) {
		score = $('#input_text_score').val();
	} else {
		score = currentInputObj.text();
	}
	if (score === null) {
		score = '';
	}
	return score;
}

function setFocus() {
	if (n01_data.options.inputTag === 1) {
		$('#input_text_score').focus();
	}
}

// Finishăśă‚żăłă®ć´»ć€§ďĽŹéťžć´»ć€§
function enableFinishButton() {
	if (n01_data.setData.endMatch) {
		$('#menu_finish').hide();
		$('#menu_finish_disable').show();
		return;
	}
	if (n01_data.setData.statsData[currentLegData().selectPlayer].me !== 1) {
		$('#menu_finish').hide();
		$('#menu_finish_disable').show();
		return;
	}
	var left = currentLegData().playerData[currentLegData().selectPlayer][currentLegData().selectRound].left;
	if (left <= 170 && left !== 169 && left !== 169 && left !== 166 && left !== 165 && left !== 163 && left !== 162 && left !== 159) {
		$('#menu_finish').show();
		$('#menu_finish_disable').hide();
	} else {
		$('#menu_finish').hide();
		$('#menu_finish_disable').show();
	}
}

// ă‚ąă‚łă‚˘ĺ¶ĺľˇ
function initScore() {
	// ĺťćśźĺŚ–
	scrollTop();
	currentInputObj = undefined;
	$('#score_body').empty();

	// é–‹ĺ§‹ă‚ąă‚łă‚˘ă®č¨­ĺ®š
	var objStart = $('#score_list_start').clone(false).appendTo('#score_body');
	objStart.find('.p1left').text(currentLegData().playerData[0][0].left);
	objStart.find('.p2left').text(currentLegData().playerData[1][0].left);

	// ă©ă‚¦ăłă‰ă‡ăĽă‚żă®ç”źć
	var round = 15;
	if (round < currentLegData().playerData[0].length) {
		round = currentLegData().playerData[0].length;
	}
	for (var i = 0; i < round; i++) {
		var obj = addRound(i);
		if (currentLegData().playerData[0][i + 1] != undefined) {
			if (n01_data.setData.endMatch && currentLegData().playerData[0][i + 1].score < 0) {
				var score = '';
				switch (currentLegData().playerData[0][i + 1].score) {
				case -1:
					score = 'x1';
					break;
				case -2:
					score = 'x2';
					break;
				case -3:
					score = 'x3';
					break;
				}
				obj.find('.p1score').text(score);
			} else {
				obj.find('.p1score').text(currentLegData().playerData[0][i + 1].score);
				obj.find('.p1left').text(currentLegData().playerData[0][i + 1].left);
				setCircleTon(obj.find('.p1score'));
			}
		}
		if (currentLegData().playerData[1][i + 1] != undefined) {
			if (n01_data.setData.endMatch && currentLegData().playerData[1][i + 1].score < 0) {
				var score = '';
				switch (currentLegData().playerData[1][i + 1].score) {
				case -1:
					score = 'x1';
					break;
				case -2:
					score = 'x2';
					break;
				case -3:
					score = 'x3';
					break;
				}
				obj.find('.p2score').text(score);
			} else {
				obj.find('.p2score').text(currentLegData().playerData[1][i + 1].score);
				obj.find('.p2left').text(currentLegData().playerData[1][i + 1].left);
				setCircleTon(obj.find('.p2score'));
			}
		}
	}

	if (!n01_data.setData.endMatch) {
		// é¸ćŠžă®ç§»ĺ‹•
		var currnetInput = n01_data.setData.currnetInput;
		changeSelectInput(currentLegData().selectRound, currentLegData().selectPlayer);
		// ĺ…ĄĺŠ›ä¸­ă‚ąă‚łă‚˘ă®ĺľ©ĺ…
		if (currnetInput !== getCurrentScore()) {
			startInput = false;
		}
		setCurrentScore(currnetInput);
		n01_data.setData.currnetInput = currnetInput;
		n01_data.saveSetData();
	}

	// ăăă€ć…ĺ ±ă®ĺťćśźĺŚ–
	showName();
	showLegs();
	showLeft();

	// ă‚µă‚¤ă‚şčŞżć•´
	resize();
	var diff = $('#p1_name').width() - $('#p2_name').width();
	if (diff > 1 || diff < -1 || $('#header_table').width() > $(window).width()) {
		// ćŠčż”ă—ć–ąćł•ă®ĺ¤‰ć›´
		$('.player_name').css('word-break', 'break-all');
		resize();
	}
	
	setTimeout(function() {
		// é¸ćŠžä˝Ťç˝®ăľă§ă‚ąă‚Żă­ăĽă«
		scrollRound(currentLegData().selectRound);
		setFocus();
	}, 200);
}

function addRound(round) {
	var obj = $('#score_list_score').clone(true).appendTo('#score_body');
	obj.attr('id', 'round_' + round);
	if (n01_data.options.roundDarts === 1) {
		obj.find('.score_round').text((round + 1) * 3);
	} else {
		obj.find('.score_round').text(round + 1);
	}
	obj.find('.p1score').attr('round', round);
	obj.find('.p1left').attr('round', round);
	obj.find('.p2score').attr('round', round);
	obj.find('.p2left').attr('round', round);
	return obj;
}

function inputScore(value) {
	if (n01_data.setData.endMatch) {
		return;
	}
	if (n01_data.setData.statsData[currentLegData().selectPlayer].me !== 1) {
		return;
	}
	scrollRound(currentLegData().selectRound);
	var score = getCurrentScore();
	if (startInput === true || score === '') {
		score = '0';
	}
	score = parseInt(score, 10) * 10 + parseInt(value, 10);
	if (score > 999) {
		return;
	}
	setCurrentScore(score);
	startInput = false;

	n01_data.setData.currnetInput = getCurrentScore();
	n01_data.saveSetData();
}

function deleteScore() {
	if (n01_data.setData.endMatch) {
		return;
	}
	if (n01_data.setData.statsData[currentLegData().selectPlayer].me !== 1) {
		return;
	}
	scrollRound(currentLegData().selectRound);
	var score = getCurrentScore();
	if (score === '') {
		return;
	}
	if (score.length === 1) {
		setCurrentScore('');
	} else {
		setCurrentScore(Math.floor(parseInt(score, 10) / 10));
	}
	startInput = false;

	n01_data.setData.currnetInput = getCurrentScore();
	n01_data.saveSetData();
}

function remainingScore() {
	if (n01_data.setData.endMatch) {
		return;
	}
	if (n01_data.setData.statsData[currentLegData().selectPlayer].me !== 1) {
		return;
	}
	scrollRound(currentLegData().selectRound);
	var score = getCurrentScore();
	if (score === '') {
		return;
	}
	var left = currentLegData().playerData[currentLegData().selectPlayer][currentLegData().selectRound].left;
	if (left - score >= 0) {
		setCurrentScore(left - score);
		if (nextScore()) {
			changeNextSelect();
		}
	}
}

function nextScore(no_send) {
	if (n01_data.setData.endMatch) {
		return false;
	}
	// ĺ…ĄĺŠ›ăă‚§ăă‚Ż
	var score = getCurrentScore();
	if (n01_data.options.inputTag === 1) {
		score = score.replace(/[ďĽ-ďĽ™]/g, function(s){return String.fromCharCode(s.charCodeAt(0) - 0xFEE0)});
		score = score.replace(/[^0-9]/g, '');
		setCurrentScore(score);
	}
	if (score === null || score === '') {
		if (n01_data.setData.statsData[currentLegData().currentPlayer].me !== 1) {
			return false;
		}
		if (currentLegData().selectRound === currentLegData().currentRound &&
			(currentLegData().first === currentLegData().currentPlayer || currentLegData().selectPlayer === currentLegData().currentPlayer)) {
			return true;
		}
		return false;
	}
	score = parseInt(score, 10);
	if (isNaN(score) ||
		score > 180 || score === 179 ||
		score === 178 || score === 176 ||
		score === 175 || score === 173 ||
		score === 172 || score === 169 ||
		score === 166 || score === 163) {
		return false;
	}

	// ĺ…ć”»ă®ĺ…Ąă‚Ść›żăăŻă—ăŞă„
	if (currentLegData().selectRound === currentLegData().currentRound &&
		currentLegData().currentPlayer === currentLegData().first &&
		currentLegData().selectPlayer !== currentLegData().first) {
		return false;
	}

	// ĺ…ĄĺŠ›ă©ă‚¦ăłă‰ă®ć®‹ă‚Šă‚ąă‚łă‚˘ă‚’ć›´ć–°
	var left = currentLegData().playerData[currentLegData().selectPlayer][currentLegData().selectRound].left - score;
	if (left < 0 || left === 1 || (left === 0 && !$('#menu_finish').is(':visible'))) {
		if (startInput === true) {
			return true;
		}
		return false;
	}
	if (left === 0) {
		finishMenuOpen();
		return false;
	}

	if (currentLegData().playerData[currentLegData().selectPlayer][currentLegData().selectRound + 1] === undefined) {
		currentLegData().playerData[currentLegData().selectPlayer].push({score: score, left: left});
		if (n01_data.setData.statsData[currentLegData().selectPlayer].me === 1 && no_send !== true) {
			netInputScore(score);
		}
	} else {
		if (n01_data.setData.statsData[currentLegData().selectPlayer].me === 1 && no_send !== true &&
			currentLegData().playerData[currentLegData().selectPlayer][currentLegData().selectRound + 1].score !== score) {
			netInputScore(score);
		}
		currentLegData().playerData[currentLegData().selectPlayer][currentLegData().selectRound + 1].score = score;
		currentLegData().playerData[currentLegData().selectPlayer][currentLegData().selectRound + 1].left = left;
	}
	getLeftObj(currentLegData().selectRound, currentLegData().selectPlayer).text(left);

	// ĺ…ĄĺŠ›ă©ă‚¦ăłă‰ä»Ąé™Ťă®ć®‹ă‚Šă‚ąă‚łă‚˘ă‚’ć›´ć–°
	for (var i = currentLegData().selectRound + 1; i < currentLegData().currentRound + 1; i++) {
		if (currentLegData().playerData[currentLegData().selectPlayer][i + 1] === undefined) {
			break;
		}
		var nLeft = currentLegData().playerData[currentLegData().selectPlayer][i].left - currentLegData().playerData[currentLegData().selectPlayer][i + 1].score;
		currentLegData().playerData[currentLegData().selectPlayer][i + 1].left = nLeft;
		getLeftObj(i, currentLegData().selectPlayer).text(nLeft);
	}

	// é¸ćŠžă®ç§»ĺ‹•
	if (currentLegData().first === currentLegData().selectPlayer) {
		if (currentLegData().selectRound === currentLegData().currentRound &&
			currentLegData().selectPlayer === currentLegData().currentPlayer) {
			currentLegData().currentPlayer = (currentLegData().currentPlayer === 0) ? 1 : 0;
		}
	} else {
		if (currentLegData().selectRound === currentLegData().currentRound) {
			currentLegData().currentRound++;
			currentLegData().currentPlayer = currentLegData().first;
			if ($('#score_body').children().length <= currentLegData().currentRound + 1) {
				// čˇ¨ç¤şă©ă‚¦ăłă‰ă®čż˝ĺŠ 
				addRound(currentLegData().currentRound);
				setTimeout(function(){
					scrollRound(currentLegData().selectRound);
				}, 100);
			}
		}
	}
	showLeft();
	n01_data.saveSetData();
	return true;
}

function nextLeg() {
	if (n01_data.setData.limitLeg > 0 &&
		(n01_data.setData.limitLeg <= n01_data.setData.statsData[0].winLegs || n01_data.setData.limitLeg <= n01_data.setData.statsData[1].winLegs)) {
		n01_data.setData.endMatch = 1;
		n01_data.saveSetData();
		enableFinishButton();
		return;
	}
	if (n01_data.setData.legData[n01_data.setData.currentLeg + 1] === undefined) {
		// Legć…ĺ ±ă®čż˝ĺŠ 
		n01_data.setData.legData.push($.extend(true, {}, n01_data.initLegData));
		var nextFirst = (currentLegData().first === 0) ? 1 : 0;
		n01_data.setData.currentLeg++;
		currentLegData().first = currentLegData().currentPlayer = currentLegData().selectPlayer = nextFirst;
	} else {
		// ć—˘ă«ă‚ă‚‹Legć…ĺ ±ă‚’ĺ©ç”¨
		n01_data.setData.currentLeg++;
	}
	// é–‹ĺ§‹ă‚ąă‚łă‚˘ă®č¨­ĺ®š
	currentLegData().playerData[0][0].left = n01_data.setData.startScore;
	currentLegData().playerData[1][0].left = n01_data.setData.startScore;
	n01_data.setData.currnetInput = '';
	
	n01_data.saveSetData();
}

function nextSet(me) {
	if (n01_data.setData.scid !== undefined && n01_data.setData.scid !== '' && n01_data.setData.endMatch === 1) {
		if (n01_data.setData.statsData[0].winLegs > n01_data.setData.statsData[1].winLegs) {
			n01_data.setData.statsData[0].winSets++;
		} else if (n01_data.setData.statsData[0].winLegs < n01_data.setData.statsData[1].winLegs) {
			n01_data.setData.statsData[1].winSets++;
		}
		n01_data.saveSetData();
		enableFinishButton();
		
		if (n01_data.setData.limitSet > 0 &&
			(n01_data.setData.limitSet <= n01_data.setData.statsData[0].winSets || n01_data.setData.limitSet <= n01_data.setData.statsData[1].winSets)) {
			n01_data.setData.endSchedule = 1;
			n01_data.saveSetData();
			showLegs();
			endMatchMsgOpen();
			return;
		}
		netGetSet();
	} else if (me !== true) {
		netGetSet();
	}
}

function calcStatsData(player) {
	if (currentLegData().winner === player) {
		n01_data.setData.statsData[player].winLegs++;
	}
}

function finishConfirm(dart) {
	finishMsgOpen(currentLegData().selectPlayer, dart, (currentLegData().selectRound * 3) + dart);
}

function finish(dart) {
	// Finishă©ă‚¦ăłă‰ä»Ąé™Ťă®ă‚ąă‚łă‚˘ă‡ăĽă‚żă‚’ć¶ĺŽ»
	currentLegData().playerData[currentLegData().selectPlayer].splice(currentLegData().selectRound + 1);
	var deletePlayer = (currentLegData().selectPlayer === 0) ? 1 : 0;
	var deleteRound = (currentLegData().first === deletePlayer) ? currentLegData().selectRound + 2 : currentLegData().selectRound + 1;
	currentLegData().playerData[deletePlayer].splice(deleteRound);

	// Finishă‚ąă‚łă‚˘ă®č¨­ĺ®š
	if (currentLegData().playerData[currentLegData().selectPlayer][currentLegData().selectRound + 1] === undefined) {
		currentLegData().playerData[currentLegData().selectPlayer].push({score: (dart * -1), left: 0});
	} else {
		currentLegData().playerData[currentLegData().selectPlayer][currentLegData().selectRound + 1].score = (dart * -1);
		currentLegData().playerData[currentLegData().selectPlayer][currentLegData().selectRound + 1].left = 0;
	}
	// Legć…ĺ ±ă®ć›´ć–°
	currentLegData().currentRound = currentLegData().selectRound;
	currentLegData().currentPlayer = currentLegData().selectPlayer;
	currentLegData().endFlag = 1;
	currentLegData().winner = currentLegData().selectPlayer;
	calcStatsData(currentLegData().selectPlayer);

	var sRound;
	var sLeft;
	if (n01_data.setData.statsData[currentLegData().currentPlayer].me === 1) {
		sRound = currentLegData().currentRound;
		sLeft = dart * -1;
	} else {
		var player = (currentLegData().currentPlayer === 0) ? 1 : 0;
		sRound = (currentLegData().first === player) ? currentLegData().currentRound + 1 : currentLegData().currentRound;
		sLeft = currentLegData().playerData[player][sRound].left;
	}
	
	n01_data.restoreStatsData();
	if (sLeft < 0) {
		n01_data.statsData.score += n01_data.setData.startScore;
		n01_data.statsData.darts += (sRound * 3 + sLeft * -1);
	} else {
		n01_data.statsData.score += (n01_data.setData.startScore - sLeft);
		n01_data.statsData.darts += (sRound * 3);
	}
	n01_data.saveStatsData();
	
	// ć¬ˇă®Legă«ç§»ĺ‹•
	nextLeg();
}

// ăťăă—ă‚˘ăă—ç”»éť˘ĺ¶ĺľˇ
function generalMenuOpen() {
	if($('#modal-overlay')[0]) {
		return;
	}
	$('body').append('<div id="modal-overlay"></div>');
	$('#modal-overlay').show();

	if (n01_data.restoreGameOptions !== undefined) {
		n01_data.restoreGameOptions();
		if (n01_data.gameOptions !== undefined && n01_data.gameOptions.scheduleOwner === 1) {
			$('#menu_modify').show();
		}
	}
	
	centeringObject($('#general_menu'));
	$('#general_menu').show();
	
	function generalMenuClose() {
		$('#general_menu').hide();
		$('#modal-overlay').remove();
		$(document).off('keydown.general_menu');
	}

	$('#modal-overlay').unbind().click(function() {
		generalMenuClose();
		setFocus();
		return false;
	});
	
	$('#menu_chat').unbind().click(function() {
		generalMenuClose();
		openChat();
		return false;
	});
	if ($('#localVideoWrapper').is(':visible')) {
		$('#menu_webcam').text(res.menu_webcam_off);
	} else {
		$('#menu_webcam').text(res.menu_webcam_on);
	}
	$('#menu_webcam').unbind().click(function() {
		if ($('#localVideoWrapper').is(':visible')) {
			n01_data.restoreCamOptions();
			n01_data.camOptions.webcam = -1;
			n01_data.saveCamOptions();
			location.reload(true);
			return false;
		}
		generalMenuClose();
		if (n01_data.camOptions.camera_device && !n01_data.camOptions.camera_window) {
			alert(res.cam_device_msg);
			return false;
		}
		startWebCam();
		resize();
		setFocus();
		return false;
	});
	$('#menu_webcam_setting').unbind().click(function() {
		generalMenuClose();
		n01_data.onlineOptions.returnUrl = window.location.href;
		n01_data.saveOnlineOptions();
		window.location.href = n01_data.subPagePath + 'webcam.html?join=1';
		return false;
	});
	$('#menu_modify').unbind().click(function() {
		generalMenuClose();
		if (n01_data.setData.endSchedule !== 1) {
			window.location.href = n01_data.subPagePath + 'modify.html';
		}
		return false;
	});
	$('#menu_remaining_score').unbind().click(function() {
		generalMenuClose();
		remainingScore();
		setFocus();
		return false;
	});
	$('#menu_option').unbind().click(function() {
		generalMenuClose();
		n01_data.onlineOptions.returnUrl = window.location.href;
		n01_data.saveOnlineOptions();
		window.location.href = n01_data.subPagePath + 'option.html';
		return false;
	});
	$('#menu_cancel').unbind().click(function() {
		generalMenuClose();
		setFocus();
		return false;
	});

	$(document).on('keydown.general_menu', function(e) {
		if (e.key !== undefined) {
			switch (e.key) {
			case '1':
				$('#menu_chat').click();
				break;
			case '2':
				$('#menu_webcam').click();
				break;
			case '3':
				$('#menu_webcam_setting').click();
				break;
			case '4':
				$('#menu_modify').click();
				break;
			case '5':
				$('#menu_remaining_score').click();
				break;
			case '6':
				$('#menu_option').click();
				break;
			case 'Escape':
			case 'Esc':
				$('#menu_cancel').click();
				break;
			}
		} else {
			switch (e.keyCode) {
			case 49:	// 1
			case 97:	// 1
				$('#menu_chat').click();
				break;
			case 50:	// 2
			case 98:	// 2
				$('#menu_webcam').click();
				break;
			case 51:	// 3
			case 99:	// 3
				$('#menu_webcam_setting').click();
				break;
			case 52:	// 4
			case 100:	// 4
				$('#menu_modify').click();
				break;
			case 53:	// 5
			case 101:	// 5
				$('#menu_remaining_score').click();
				break;
			case 54:	// 6
			case 102:	// 6
				$('#menu_option').click();
				break;
			case 27:	// ESC
				$('#menu_cancel').click();
				break;
			}
		}
	});
}

function finishMenuOpen() {
	if($('#modal-overlay')[0]) {
		return;
	}
	$('body').append('<div id="modal-overlay"></div>');
	$('#modal-overlay').show();

	$('#finish_third').prependTo('#finish_menu ul');
	var left = currentLegData().playerData[currentLegData().selectPlayer][currentLegData().selectRound].left;
	if (left > 120) {
		$('#finish_second').hide();
	} else {
		$('#finish_second').insertBefore('#finish_third');
		$('#finish_second').show();
	}
	if (left > 60) {
		$('#finish_first').hide();
	} else {
		$('#finish_first').insertBefore('#finish_second');
		$('#finish_first').show();
	}
	centeringObject($('#finish_menu'));
	$('#finish_menu').show();
	
	function finishMenuClose() {
		$('#finish_menu').hide();
		$('#modal-overlay').remove();
		$(document).off('keydown.finish_menu');
	}

	$('#modal-overlay').unbind().click(function() {
		finishMenuClose();
		setFocus();
		return false;
	});
	
	$('#finish_first').unbind().click(function() {
		finishMenuClose();
		finishConfirm(1);
		return false;
	});
	$('#finish_second').unbind().click(function() {
		finishMenuClose();
		finishConfirm(2);
		return false;
	});
	$('#finish_third').unbind().click(function() {
		finishMenuClose();
		finishConfirm(3);
		return false;
	});
	$('#finish_cancel').unbind().click(function() {
		finishMenuClose();
		setFocus();
		return false;
	});

	$(document).on('keydown.finish_menu', function(e) {
		if (e.key !== undefined) {
			switch (e.key) {
			case '1':
				if (left > 60) {
					break;
				}
			//$FALLTHROUGH$
			case '2':
				if (left > 120) {
					break;
				}
			//$FALLTHROUGH$
			case '3':
				finishMenuClose();
				finishConfirm(parseInt(e.key, 10));
				break;
			case 'Escape':
			case 'Esc':
				$('#finish_cancel').click();
				break;
			}
		} else {
			switch (e.keyCode) {
			case 49:	// 1
			case 97:	// 1
				if (left > 60) {
					break;
				}
			//$FALLTHROUGH$
			case 50:	// 2
			case 98:	// 2
				if (left > 120) {
					break;
				}
			//$FALLTHROUGH$
			case 51:	// 3
			case 99:	// 3
				finishMenuClose();
				finishConfirm(e.keyCode - 48);
				break;
			case 27:	// ESC
				$('#finish_cancel').click();
				break;
			}
		}
	});
}

function finishMsgOpen(player, dart, darts) {
	var oldInputScore = getCurrentScore();
	switch (dart) {
	case 1:
		setCurrentScore('x1');
		break;
	case 2:
		setCurrentScore('x2');
		break;
	case 3:
		setCurrentScore('x3');
		break;
	}
	setFinishLeft();

	if($('#modal-overlay')[0]) {
		return;
	}
	$('body').append('<div id="modal-overlay"></div>');
	$('#modal-overlay').show();

	$('#msg_title').text(n01_data.setData.statsData[player].name);
	$('#msg_text').text(res.game_shot_msg_prefix + dart + res.game_shot_msg_suffix + ' (' + darts + res.game_shot_msg_darts + ')');
	centeringObject($('#popup_message'));
	$('#popup_message').show();

	function messageClose(cancel) {
		$('#popup_message').hide();
		$('#modal-overlay').remove();
		$(document).off('keydown.finish_message');
		if (cancel) {
			setCurrentScore(oldInputScore);
			showLeft();
		}
		setFocus();
	}

	$('#msg_ok').unbind().click(function() {
		messageClose(false);
		netInputScore(dart * -1);
		finish(dart);
		initScore();
		changeSelectInput(currentLegData().selectRound, currentLegData().selectPlayer);
		if ((n01_data.setData.scid === undefined || n01_data.setData.scid === '') && n01_data.setData.endMatch) {
			endMatchMsgOpen();
		}
		nextSet(true);
		return false;
	});
	$('#msg_cancel').unbind().click(function() {
		messageClose(true);
		return false;
	});
	

	$(document).on('keydown.finish_message', function(e) {
		if (e.key !== undefined) {
			switch (e.key) {
			case 'Enter':
				$('#msg_ok').click();
				break;
			case 'Escape':
			case 'Esc':
				$('#msg_cancel').click();
				break;
			}
		} else {
			switch (e.keyCode) {
			case 13:	// Enter
				$('#msg_ok').click();
				break;
			case 27:	// ESC
				$('#msg_cancel').click();
				break;
			}
		}
	});
}

function netFinishMsgOpen(player, dart, darts) {
	finishFlag = true;
	switch (dart) {
	case 1:
		setCurrentScore('x1');
		break;
	case 2:
		setCurrentScore('x2');
		break;
	case 3:
		setCurrentScore('x3');
		break;
	}
	setFinishLeft();
	currentInputObj.removeClass('loding');

	$('body').append('<div id="modal-overlay"></div>');
	$('#modal-overlay').show();
	
	$('#msg_net_title').text(n01_data.setData.statsData[player].name);
	$('#msg_net_title').text(res.game_shot_msg_prefix + dart + res.game_shot_msg_suffix + ' (' + darts + res.game_shot_msg_darts + ')');
	centeringObject($('#popup_message_net'));
	$('#popup_message_net').show();

	function messageClose() {
		$('#popup_message_net').hide();
		$('#modal-overlay').remove();
		$(document).off('keydown.net_finish_message');
		setFocus();
		finishFlag = false;
	}

	$('#msg_net_ok').unbind().click(function() {
		messageClose();
		finish(dart);
		initScore();
		changeSelectInput(currentLegData().selectRound, currentLegData().selectPlayer);
		if ((n01_data.setData.scid === undefined || n01_data.setData.scid === '') && n01_data.setData.endMatch) {
			endMatchMsgOpen();
		}
		nextSet(false);
		return false;
	});
	
	$(document).on('keydown.net_finish_message', function(e) {
		if (e.key !== undefined) {
			switch (e.key) {
			case 'Enter':
				$('#msg_net_ok').click();
				break;
			}
		} else {
			switch (e.keyCode) {
			case 13:	// Enter
				$('#msg_net_ok').click();
				break;
			}
		}
	});
}

function endMatchMsgOpen() {
	finishFlag = true;
	$('body').append('<div id="modal-overlay"></div>');
	$('#modal-overlay').show();

	var player = '';
	if (n01_data.setData.scid === undefined || n01_data.setData.scid === '') {
		$('#msg_net_title').text(n01_data.setData.statsData[0].winLegs + ' - ' + n01_data.setData.statsData[1].winLegs);
		if (n01_data.setData.statsData[0].winLegs > n01_data.setData.statsData[1].winLegs) {
			player = n01_data.setData.statsData[0].name;
		} else if (n01_data.setData.statsData[0].winLegs < n01_data.setData.statsData[1].winLegs) {
			player = n01_data.setData.statsData[1].name;
		}
	} else {
		$('#msg_net_title').text(n01_data.setData.statsData[0].winSets + ' - ' + n01_data.setData.statsData[1].winSets);
		if (n01_data.setData.statsData[0].winSets > n01_data.setData.statsData[1].winSets) {
			player = n01_data.setData.statsData[0].name;
		} else if (n01_data.setData.statsData[0].winSets < n01_data.setData.statsData[1].winSets) {
			player = n01_data.setData.statsData[1].name;
		}
	}
	$('#msg_net_text').text(res.winner_msg_prefix + player + res.winner_msg_suffix);
	centeringObject($('#popup_message_net'));
	$('#popup_message_net').show();

	function messageClose() {
		$('#popup_message_net').hide();
		$('#modal-overlay').remove();
		$(document).off('keydown.net_endmatch_message');
		setFocus();
		finishFlag = false;
	}

	$('#msg_net_ok').unbind().click(function() {
		messageClose();
		return false;
	});
	
	$(document).on('keydown.net_endmatch_message', function(e) {
		if (e.key !== undefined) {
			switch (e.key) {
			case 'Enter':
				$('#msg_net_ok').click();
				break;
			}
		} else {
			switch (e.keyCode) {
			case 13:	// Enter
				$('#msg_net_ok').click();
				break;
			}
		}
	});
}

function exitConfirmOpen() {
	if($('#modal-overlay')[0]) {
		return;
	}
	$('body').append('<div id="modal-overlay"></div>');
	$('#modal-overlay').show();

	$('#msg_title').text(res.exit_confirm);
	$('#msg_text').text('');
	centeringObject($('#popup_message'));
	$('#popup_message').show();

	function messageClose(cancel) {
		$('#popup_message').hide();
		$('#modal-overlay').remove();
		$(document).off('keydown.exit_confirm_message');
		setFocus();
	}

	$('#msg_ok').unbind().click(function() {
		messageClose(false);
		netExitUser();
		return false;
	});
	$('#msg_cancel').unbind().click(function() {
		messageClose(true);
		return false;
	});
	
	$(document).on('keydown.exit_confirm_message', function(e) {
		if (e.key !== undefined) {
			switch (e.key) {
			case 'Enter':
				$('#msg_ok').click();
				break;
			case 'Escape':
			case 'Esc':
				$('#msg_cancel').click();
				break;
			}
		} else {
			switch (e.keyCode) {
			case 13:	// Enter
				$('#msg_ok').click();
				break;
			case 27:	// ESC
				$('#msg_cancel').click();
				break;
			}
		}
	});
}

function changeFirstConfirmOpen() {
	if($('#modal-overlay')[0]) {
		return;
	}
	$('body').append('<div id="modal-overlay"></div>');
	$('#modal-overlay').show();

	$('#msg_title').text(res.change_first_msg);
	$('#msg_text').text('');
	centeringObject($('#popup_message'));
	$('#popup_message').show();

	function messageClose(cancel) {
		$('#popup_message').hide();
		$('#modal-overlay').remove();
		$(document).off('keydown.change_first');
		setFocus();
	}

	$('#msg_ok').unbind().click(function() {
		messageClose(false);
		netChangeSelect();
		return false;
	});
	$('#msg_cancel').unbind().click(function() {
		messageClose(true);
		changeSelectInput(currentLegData().currentRound, currentLegData().currentPlayer);
		return false;
	});
	
	$(document).on('keydown.change_first', function(e) {
		if (e.key !== undefined) {
			switch (e.key) {
			case 'Enter':
				$('#msg_ok').click();
				break;
			case 'Escape':
			case 'Esc':
				$('#msg_cancel').click();
				break;
			}
		} else {
			switch (e.keyCode) {
			case 13:	// Enter
				$('#msg_ok').click();
				break;
			case 27:	// ESC
				$('#msg_cancel').click();
				break;
			}
		}
	});
}

function statsOpen() {
	if($('#modal-overlay')[0]) {
		return;
	}
	$('body').append('<div id="modal-overlay"></div>');
	$('#modal-overlay').show();

	$('#article').css({'overflow': 'hidden'});

	n01_data.saveSetData();
	$('#stats_msg').css('background-color', $('body').css('background-color'));
	$('#stats_msg').html('<iframe id="stats_frame" src="' + n01_data.subPagePath + 'c_stats.html?a=7" width="100%" height="100%"></iframe>');
	$('#stats_msg').css('position', 'fixed');
	$('#stats_msg').css('-webkit-overflow-scrolling', 'touch');
	$('#stats_msg').css('overflow', 'auto');
	$('#stats_frame').css('border', 'none');
	$('#stats_frame').css('display', 'block');
	centeringObject($('#stats_msg'));
	$('#stats_msg').show();

	$('#modal-overlay').unbind().click(function() {
		statsClose();
		return false;
	});

	$(document).on('keydown.stats', function(e) {
		if (e.key !== undefined) {
			switch (e.key) {
			case 'Escape':
			case 'Esc':
				statsClose();
				break;
			}
		} else {
			switch (e.keyCode) {
			case 27:	// ESC
				statsClose();
				break;
			}
		}
	});
}

function statsClose() {
	if ($('#stats_msg').is(':visible')) {
		$('#stats_msg').hide();
		$('#modal-overlay').remove();
		$(document).off('keydown.stats');
		$('#stats_frame').remove();

		$('#article').css({'overflow': 'auto'});
		resize();
		scrollRound(currentLegData().selectRound);
		setFocus();
	}
}

// Util
function currentLegData() {
	if (n01_data.setData === null) {
		return null;
	}
	return n01_data.setData.legData[n01_data.setData.currentLeg];
}

function getScoreObj(round, player) {
	if (player === 0) {
		return $('#round_' + round).find('.p1score');
	} else {
		return $('#round_' + round).find('.p2score');
	}
}

function getLeftObj(round, player) {
	if (player === 0) {
		return $('#round_' + round).find('.p1left');
	} else {
		return $('#round_' + round).find('.p2left');
	}
}
