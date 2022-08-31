/*
 * n01_online.js
 *
 * Copyright (C) 1996-2020 by Ohno Tomoaki. All rights reserved.
 */

/*eslint-env browser, jquery*/
/*globals n01_data n01_util*/
var join = false;
var away = false;
var maintenance = false;
var updateTime = 0;

if (n01_data.phpUser === undefined) {
	n01_data.phpUser = n01_data.phpSite + 'n01_user.php';
}

var resources = {
	en : {
		button_join : "Join",
		button_quit : "Quit",
		title_users : " users",
		title_status : "Status",
		title_filter : "Ready Only",

		maintenance_msg : "Under maintenance.",
		no_users_msg : "No users.",
		secret_key_input_msg : "Please input a secret key.",
		set_msg_prefix : "First to<br />",
		set_msg_set_name : " Sets/",
		set_msg_suffix : " Legs",
		leg_msg_prefix : "First to ",
		leg_msg_suffix : "",
		matching_error_msg : "Matching failed",
		secret_key_error_msg : "Secret key unmatch",
		data_recv_error_msg : "Data Recv Error",
		
		play_button : "Play",
		secret_button : "🔒Play",
		view_button : "Watch",
		away_button : "Away",
		return_button : "Return",

		status_ready : "Ready",
		status_playing : "Playing",
		status_live : "Live",
		status_live_online : "Online",
		status_tournament : "Tournament",
		status_league : "League",
		status_away : "Away",
		status_watching : "Watching",
	},
	ja : {
		header_title : "n01オンライン",
		title_users : "人",
		button_history : "履歴",
		button_join : "参加",
		button_quit : "終了",
		title_name : "名前",
		title_status : "状態",
		title_filter : "待機中のみ",
		schedule_button : "スケジュールモード",
		menu_button : "メニュー",

		maintenance_msg : "現在、メンテナンス中です。",
		no_users_msg : "現在、参加者はいません。",
		secret_key_input_msg : "シークレットキーを入力してください。",
		set_msg_prefix : "",
		set_msg_set_name : " Set/",
		set_msg_suffix : " Leg<br />先取",
		leg_msg_prefix : "",
		leg_msg_suffix : " Leg先取",
		matching_error_msg : "マッチングに失敗しました。\n少し時間を置いてから試してください。",
		secret_key_error_msg : "シークレットキーが一致しませんでした。",
		data_recv_error_msg : "データ取得に失敗しました。",

		play_button : "Play",
		secret_button : "🔒Play",
		view_button : "観戦",
		away_button : "離席",
		return_button : "復帰",

		status_ready : "待機中",
		status_playing : "ゲーム中",
		status_live : "中継中",
		status_live_online : "オンライン",
		status_tournament : "トーナメント",
		status_league : "リーグ",
		status_away : "離席中",
		status_watching : "観戦中",
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
		$('#header_title').text(res.header_title);
		$('#button_history').text(res.button_history);
		$('#button_join').text(res.button_join);

		$('#title_name').text(res.title_name);
		$('#schedule_button').val(res.schedule_button);
		$('#menu_button').val(res.menu_button);
	}
});

$(function() {
	$('#button_join').css('color', $('#header').css('background-color'));
	$('#header').show();
	$('#article').show();
	$('#contents').show();
	initSetting();
	getInfoMessage();
	resize();
	$(window).resize(function() {
		resize();
	});

	var ua = n01_util.getUserAgent();
	if (window.location.protocol === 'http:' && !(ua.isiOS &&
		(ua.name.indexOf('iphone os 9') >= 0 || ua.name.indexOf('ipad; cpu os 9') >= 0 ||
		ua.name.indexOf('iphone os 8') >= 0 || ua.name.indexOf('ipad; cpu os 8') >= 0 ||
		ua.name.indexOf('iphone os 7') >= 0 || ua.name.indexOf('ipad; cpu os 7') >= 0 ||
		ua.name.indexOf('iphone os 6') >= 0 || ua.name.indexOf('ipad; cpu os 6') >= 0))) {
		var url = window.location.href;
		window.location.replace(url.replace('http:', 'https:'));
	}

	$('#schedule_button').click(function() {
		// Schedule Mode
		window.location.href = 'schedule/';
	});

	$('#menu_button').click(function() {
		// Menu
		window.location.href = '../menu/';
	});

	$('#status_button').click(function() {
		n01_data.onlineOptions.filter = !n01_data.onlineOptions.filter;
		n01_data.saveOnlineOptions();
		location.reload();
	});

	$('.away_button').click(function() {
		if (maintenance || join === false) {
			return;
		}
		var cmd = 'away';
		if (away) {
			cmd = 'away_return';
		}
		// Away
		$.ajax({
			url: n01_data.phpUser + '?cmd=' + cmd + '&sid=' + n01_data.onlineOptions.sid,
			type: 'POST',
			timeout: 30000,
			success: function(data) {
				window.location.href = '.';
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert('Away Error\n\n' + textStatus + '\n' + XMLHttpRequest.status + ' ' + errorThrown);
			},
			complete: function(data) {
			}
		});
	});

	$('#button_history').click(function() {
		n01_data.options.liveReturnUrl = '';
		n01_data.saveOptions();
		window.location.href = 'history/';
	});

	$('#button_join').click(function() {
		if (maintenance) {
			return;
		}
		if (join === false) {
			// Join
			n01_data.onlineOptions.returnTop = window.location.href;
			n01_data.saveOnlineOptions();
			window.location.href = n01_data.subPagePath + 'setting.php';
			return;
		}
		// Quit
		$.ajax({
			url: n01_data.phpUser + '?cmd=quit&sid=' + n01_data.onlineOptions.sid,
			type: 'POST',
			timeout: 30000,
			success: function(data) {
				n01_data.onlineOptions.pid = '';
				n01_data.onlineOptions.sid = '';
				n01_data.onlineOptions.tid = '';
				n01_data.onlineOptions.tname = '';
				n01_data.onlineOptions.fid = '';
				n01_data.onlineOptions.fname = '';
				n01_data.saveOnlineOptions();
				window.location.href = '.';
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert('Quit Error\n\n' + textStatus + '\n' + XMLHttpRequest.status + ' ' + errorThrown);
			},
			complete: function(data) {
			}
		});
	});
	
	$('#channel').change(function() {
		n01_data.onlineOptions.ch = parseInt($('#channel').val(), 10);
		if (join === false) {
			n01_data.saveOnlineOptions();
			window.location.href = '.';
		} else {
			$.ajax({
				url: n01_data.phpUser + '?cmd=channel&sid=' + n01_data.onlineOptions.sid,
				type: 'POST',
				dataType: 'json',
				data: JSON.stringify({pid:n01_data.onlineOptions.pid, ch:n01_data.onlineOptions.ch}),
				timeout: 30000,
				success: function(data) {
					n01_data.saveOnlineOptions();
					window.location.href = '.';
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					alert('Channel Error\n\n' + textStatus + '\n' + XMLHttpRequest.status + ' ' + errorThrown);
				},
				complete: function(data) {
				}
			});
		}
	});
	
	$('#channel').click(function() {
		updateSelectChannel();
	});

	$('.play_button').click(function() {
		if (maintenance) {
			return;
		}
		matchUser($(this).attr('pid'), '');
	});
	
	$('.secret_button').click(function() {
		if (maintenance) {
			return;
		}
		skey = window.prompt(res.secret_key_input_msg, '');
		if(skey === '' || skey === null){
			return;
		}
		skey = skey.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
			return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
		});
		matchUser($(this).attr('pid'), skey);
	});

	$('.view_button').click(function() {
		if (maintenance) {
			return;
		}
		viewMatch($(this).attr('pid'));
	});

	var tooltipTimer = null;
	$('.flag').on({
		'click': function() {
			clearTimeout(tooltipTimer);
			var top = $(this).offset().top + $(this).height();
			var left = $(this).offset().left + $(this).width();
			$("#tooltip").text($(this).attr('cname'))
				.css({top: top, left: left})
				.fadeIn(200);
			tooltipTimer = setTimeout(function(){
				$("#tooltip").fadeOut(200);
				tooltipTimer = null;
			}, 3000);
		},
		'mouseenter': function() {
			$(this).click();
		},
		'mouseleave': function() {
			$("#tooltip").hide();
			clearTimeout(tooltipTimer);
			tooltipTimer = null;
		},
	});

	$('.tw').on({
		'click': function() {
			if ($(this).attr('sname') === '1') {
				return;
			}
			window.open('https://twitter.com/' + $(this).attr('sname'), '_blank');
		},
		'mouseenter': function() {
			if ($(this).attr('sname') === '1') {
				return;
			}
			clearTimeout(tooltipTimer);
			var top = $(this).offset().top + $(this).height();
			var left = $(this).offset().left + $(this).width();
			$("#tooltip").text('@' + $(this).attr('sname'))
				.css({top: top, left: left})
				.fadeIn(200);
			tooltipTimer = setTimeout(function(){
				$("#tooltip").fadeOut(200);
				tooltipTimer = null;
			}, 3000);
		},
		'mouseleave': function() {
			$("#tooltip").hide();
			clearTimeout(tooltipTimer);
			tooltipTimer = null;
		},
	});
});

function updateSelectChannel() {
	$.ajax({
		url: n01_data.phpUser + '?cmd=ch_count&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		timeout: 10000,
		success: function(data) {
			var nm = "Channel ";
			$("select[name='channel'] option").filter(function(index){
				var ch = $(this).val();
				var text = nm + ch;
				if (parseInt(ch, 10) === n01_data.onlineOptions.ch) {
				} else if (data[ch] !== undefined) {
					text = text + " (" + data[ch] + ")";
				} else {
					text = text + " (0)";
				}
				$(this).text(text);
			})
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		},
		complete: function(data) {
		}
	});
}

function resize() {
	var windowSize = ($(window).width() < $(window).height()) ? $(window).width() : $(window).height();
	var bodyFont = windowSize * 0.06;
	$('body').css('font-size', bodyFont + 'px');
	$('input').css('font-size', bodyFont + 'px');
	$('select').css('font-size', bodyFont + 'px');
	$('#chat_return_button').css('font-size', (windowSize * 0.04) + 'px');
	$('#c_send_button').css('font-size', (windowSize * 0.04) + 'px');

	$('#dmsg').css('margin-top', (windowSize * 0.05) + 'px');
	$('#dmsg').css('padding', (windowSize * 0.05) + 'px 0');
	$('#dmsg').css('font-size', (windowSize * 0.05) + 'px');

	var listMargin = windowSize * 0.03;
	$('.user_list_table').css('margin-top', listMargin + 'px');

	var hPadding = windowSize * 0.05;
	$('.user_list_name').css('padding', hPadding + 'px 0');
	$('#message').css('padding', hPadding + 'px 0');

	$('#channel').css('margin-top', windowSize * 0.05 + 'px');

	$('#status_button').css('font-size', windowSize * 0.04 + 'px');
	$('#status_button').css('padding', windowSize * 0.032 + 'px ' + windowSize * 0.02 + 'px');
	$('#status_button').css('margin-bottom', windowSize * 0.01 + 'px');
	var buttonRadius = windowSize * 0.06;
	$('#status_button').css('border-radius', buttonRadius + 'px');
	$('#status_button').css('-webkit-border-radius', buttonRadius + 'px');
	$('#status_button').css('-moz-border-radius', buttonRadius + 'px');

	var namePadding = windowSize * 0.03;
	$('.user_list_name').css('padding-left', namePadding + 'px');
	$('#title_name').css('padding-left', namePadding + 'px');
	$('#message').css('padding-left', namePadding + 'px');
	$('#message').css('padding-right', namePadding + 'px');
	$('.user_list_status').css('padding', '0 ' + namePadding + 'px');
	$('.user_list_button').css('padding-right', namePadding + 'px');

	var flagSize = windowSize * 0.06;
	$('.flag').css('width', flagSize + 'px');
	$('.flag').css('height', flagSize + 'px');
	$('.flag').css('margin-top', (windowSize * 0.0035) + 'px');
	$('.flag').css('margin-left', (windowSize * 0.02) + 'px');

	$('.tw').css('height', (windowSize * 0.04) + 'px');
	$('.tw').css('margin-top', (windowSize * 0.0125) + 'px');
	$('.tw').css('margin-left', (windowSize * 0.02) + 'px');
	$('.fb').css('height', (windowSize * 0.035) + 'px');
	$('.fb').css('margin-top', (windowSize * 0.0155) + 'px');
	$('.fb').css('margin-left', (windowSize * 0.02) + 'px');
	$('.webcam').css('height', (windowSize * 0.05) + 'px');
	$('.webcam').css('margin-top', (windowSize * 0.0085) + 'px');
	$('.webcam').css('margin-left', (windowSize * 0.02) + 'px');

	$('.avg_text').css('font-size', (windowSize * 0.04) + 'px');
	$('.legs_msg').css('font-size', (windowSize * 0.04) + 'px');

	$('#info').css('padding', windowSize * 0.03 + 'px');
	$('#info').css('margin', windowSize * 0 + 'px ' + windowSize * 0.03 + 'px');
	$('#info').css('margin-top', windowSize * 0.05 + 'px');

	$('input[type="button"]').css('padding', (windowSize * 0.02) + 'px');
	buttonRadius = windowSize * 0.02;
	$('input[type="button"]').css('border-radius', buttonRadius + 'px');
	$('input[type="button"]').css('-webkit-border-radius', buttonRadius + 'px');
	$('input[type="button"]').css('-moz-border-radius', buttonRadius + 'px');
	$('input[type="button"]').css('box-shadow', '0px ' + (windowSize * 0.003) + 'px ' + (windowSize * 0.01) + 'px rgba(0,0,0,0.3)');

	buttonRadius = windowSize * 0.1;
	$('#schedule_button').css('padding', (windowSize * 0.015) + 'px');
	$('#schedule_button').css('border-radius', buttonRadius + 'px');
	$('#schedule_button').css('-webkit-border-radius', buttonRadius + 'px');
	$('#schedule_button').css('-moz-border-radius', buttonRadius + 'px');

	$('#menu_button').css('padding', (windowSize * 0.015) + 'px');
	$('#menu_button').css('border-radius', buttonRadius + 'px');
	$('#menu_button').css('-webkit-border-radius', buttonRadius + 'px');
	$('#menu_button').css('-moz-border-radius', buttonRadius + 'px');

	var menuPadding = windowSize * 0.03;
	$('.menu').css('padding-top', menuPadding + 'px');

	$('#tooltip').css('font-size', (windowSize * 0.03) + 'px');
	$('#tooltip').css('padding', (windowSize * 0.01) + 'px');

	var windowSize = ($(window).width() < $(window).height()) ? $(window).width() : ($(window).height() * 0.8);
	$('.scroll_button').css('width', (windowSize * 0.12) + 'px');
	$('.scroll_button').css('height', (windowSize * 0.12) + 'px');
	$('.scroll_button').css('box-shadow', '0px ' + (windowSize * 0.02) + 'px ' + (windowSize * 0.04) + 'px rgba(0,0,0,0.3)');
	$('.scroll_button').css('margin-left', -(windowSize * 0.135) + 'px');
	$('.scroll_button').css('margin-bottom', (windowSize * 0.04) + 'px');

	n01_util.headerResize();
	$('#article').css('margin-left', '0px');
	$('#article').css('margin-right', '0px');
	$('#article').css('margin-bottom', (windowSize * 0.2) + 'px');

	$('.chat_button').css('width', (windowSize * 0.12) + 'px');
	$('.chat_button').css('height', (windowSize * 0.12) + 'px');
	var w_s = document.getElementById("article").offsetWidth - document.getElementById("article").clientWidth;
	var h_s = document.getElementById("article").offsetHeight - document.getElementById("article").clientHeight;
	$('.chat_button').css('margin-left', (windowSize * 0.015) + 'px');
	$('.chat_button').css('margin-bottom', (windowSize * 0.04 + h_s) + 'px');
	$('.chat_button').css('box-shadow', '0px ' + (windowSize * 0.02) + 'px ' + (windowSize * 0.04) + 'px rgba(0,0,0,0.3)');
	$('.chat_image').css('width', (windowSize * 0.05) + 'px');
	$('#chat_count').css('font-size', windowSize * 0.03 + 'px');
	$('#chat_count').css('padding', (windowSize * 0.01) + 'px ' + (windowSize * 0.02) + 'px');
	var buttonRadius = windowSize * 0.05;
	$('#chat_count').css('border-radius', buttonRadius + 'px');
	$('#chat_count').css('-webkit-border-radius', buttonRadius + 'px');
	$('#chat_count').css('-moz-border-radius', buttonRadius + 'px');
}

function initSetting() {
	// Optionの読み込み
	n01_data.restoreOptions();
	n01_data.restoreOnlineOptions();
	if (n01_data.onlineOptions.sid === undefined) {
		n01_data.onlineOptions.sid = '';
	}
	if (n01_data.onlineOptions.filter) {
		$('#status_button').text(res.title_filter);
	} else {
		$('#status_button').text(res.title_status);
	}
	if (n01_data.onlineOptions.ch === undefined) {
		n01_data.onlineOptions.ch = 1;
	}
	if (n01_data.onlineOptions.ch > $("#channel option").length) {
		n01_data.onlineOptions.ch = 1;
	}
	$('#channel').val('' + n01_data.onlineOptions.ch);

	$.ajax({
		url: n01_data.phpUser + '?cmd=valid&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		timeout: 30000,
		success: function(data) {
			if (data.awayMode === 1) {
				away = true;
			}
			if (data.result === 1) {
				join = true;
				$('#join').text('1');
				$('#button_join').text(res.button_quit);
				checkMe();
				n01_util.updateUser();
			}
			$('#button_join').css('color', '#fff');
			startPush();
			reloadList();
			updateSelectChannel();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			setTimeout(function(){
				initSetting();
			}, 30000);
		},
		complete: function(data) {
		}
	});
}

function startPush() {
	startPushConnect(['online_list', 'online_chat'], {
		notify: function(id) {
			if (id === 'online_list') {
				reloadList();
			} else if (id === 'online_chat') {
				checkMsgCount();
				checkMsg();
			}
		},
		all: function() {
			reloadList();
			checkMsgCount();
			checkMsg();
		},
	});
}

function reloadList() {
	$.ajax({
		url: n01_data.phpUser + '?cmd=list_diff&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify({updatetime: updateTime, join: ((join === true) ? 1 : 0), ch: n01_data.onlineOptions.ch, poling: 0}),
		timeout: 40000,
		success: function(data) {
			if (data.maintenance === 1 && maintenance === false) {
				$('#user_body').empty();
				maintenance = true;
				join = false;
				$('#join').text('0');
				$('#button_join').text(res.button_join);
				$('#message').text(res.maintenance_msg);
				$('#message').show();
				resize();
				return;
			} else if ((data.maintenance === undefined || data.maintenance === 0) && maintenance === true) {
				maintenance = false;
			}
			if (data.updatetime !== undefined) {
				updateTime = data.updatetime;
			}
			if (data.data !== undefined && data.data !== null) {
				if (data.diff === 1) {
					createDiffList(data.data, data.cnt);
				} else {
					createList(data.data);
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		},
		complete: function(data) {
		}
	});
}

function createList(data) {
	$('#user_body').empty();
	$('#message').text('');
	$('#message').hide();

	$('#list_count').text(data.length);
	$('#header_title_detail').text('(ch' + n01_data.onlineOptions.ch + ' - ' + data.length + res.title_users + ')');
	
	var existUser = false;
	if (data.length === 0) {
		$('#message').text(res.no_users_msg);
		$('#message').show();
	} else {
		for (var i = 0; i < data.length; i++) {
			if (data[i].pid === n01_data.onlineOptions.pid) {
				data[i].j = 0;
				existUser = true;
				break;
			}
		}
		data.sort(
			function(a, b){
				if (a.j !== b.j) {
					return (a.j < b.j) ? -1 : 1;
				}
				return 0;
			}
		);
		for (var i = 0; i < data.length; i++) {
			addUserData(data, i);
		}
	}
	if (join === false && existUser === true) {
		join = true;
		$('#join').text('1');
		$('#button_join').text(res.button_quit);
		createList(data);
	} else if (join === true && existUser === false) {
		join = false;
		$('#join').text('0');
		$('#button_join').text(res.button_join);
		createList(data);
	}
	resize();
}

function createDiffList(data, count) {
	$('#message').text('');
	$('#message').hide();
	$('#list_count').text(count);
	$('#header_title_detail').text('(ch' + n01_data.onlineOptions.ch + ' - ' + count + res.title_users + ')');

	if (count === 0) {
		$('#user_body').empty();
		$('#message').text(res.no_users_msg);
		$('#message').show();
	} else {
		if (data.length === 0) {
			return;
		}
		n01_data.restoreOnlineOptions();
		for (var i = 0; i < data.length; i++) {
			if ($('#' + data[i].pid).length) {
				var obj = $('#' + data[i].pid);
				if ((data[i].st & (1 << 5)) === 0) {
					// 削除
					obj.remove();
					if (data[i].pid === n01_data.onlineOptions.pid) {
						join = false;
						$('#join').text('0');
						$('#button_join').text(res.button_join);
						updateTime = 0;
					}
				} else {
					// 更新
					if (n01_data.onlineOptions.filter == true && data[i].pid !== n01_data.onlineOptions.pid &&
						((data[i].st & 1) || (data[i].st & 1 << 2) || (data[i].st & 1 << 1))) {
						obj.remove();
						continue;
					}
					if (data[i].pid === n01_data.onlineOptions.pid) {
						join = true;
						away = (data[i].st & 1 << 2) ? true : false;
						$('#join').text('1');
						$('#button_join').text(res.button_quit);
						updateTime = 0;
					}
					obj.find('.user_list_button').find('.play_button').hide();
					obj.find('.user_list_button').find('.secret_button').hide();
					obj.find('.user_list_button').find('.view_button').hide();
					obj.find('.user_list_button').find('.away_button').hide();
					obj.css('background-color', '#ffffff');
					obj.css('color', '#000');
					if ((data[i].st & 1) === 0) {
						if (data[i].st & 1 << 2) {
							// 離席中
							awayMode(obj, data[i].pid);
						} else if (data[i].st & 1 << 1) {
							// 観戦中
							viewMode(obj);
						} else if (data[i].st & 1 << 4) {
							// 待ち合わせ中
							secretMode(obj, data[i].pid);
						} else {
							// 待機中
							waitingMode(obj, data[i].pid);
						}
					} else {
						if (data[i].st & 1 << 3) {
							// 中継中
							relayMode(obj, data[i].pid);
						} else {
							// ゲーム中
							playingMode(obj, data[i].pid);
						}
					}
					obj.find('.legs_msg').remove();
					obj.find('.avg_text').remove();
					addDetailMessage(obj, data, i);
				}
			} else if (data[i].st & (1 << 5)) {
				if (data[i].pid === n01_data.onlineOptions.pid) {
					join = true;
					away = (data[i].st & 1 << 2) ? true : false;
					$('#join').text('1');
					$('#button_join').text(res.button_quit);
					updateTime = 0;
				}
				// 追加
				addUserData(data, i);
			}
		}
	}
	resize();
}

function escapeHTML(str) {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function addUserData(data, i) {
	if (n01_data.onlineOptions.filter == true && data[i].pid !== n01_data.onlineOptions.pid &&
		((data[i].st & 1) || (data[i].st & 1 << 2) || (data[i].st & 1 << 1))) {
		return;
	}
	var obj = $('#user_list_item').clone(true).appendTo('#user_body');
	obj.attr('id', data[i].pid);
	if (!obj.find('.user_list_name_text').length) {
		obj.find('.user_list_name').prepend('<span class="user_list_name_text"></span>');
	}
	if (data[i].pid === n01_data.onlineOptions.pid) {
		var name = '<a href="stats/">' + escapeHTML(data[i].n) + '</a>';
		if (data[i].st & 1 << 4) {
			name = name + '🔒' + ((data[i].skey !== undefined) ? escapeHTML(data[i].skey) : '');
		}
		obj.find('.user_list_name_text').html(name);
	} else {
		obj.find('.user_list_name_text').text(data[i].n);
	}
	obj.find('.user_list_button').find('.play_button').attr('pid', data[i].pid);
	obj.find('.user_list_button').find('.secret_button').attr('pid', data[i].pid);
	obj.find('.user_list_button').find('.view_button').attr('pid', data[i].pid);
	if ((data[i].st & 1) === 0) {
		if (data[i].st & 1 << 2) {
			// 離席中
			awayMode(obj, data[i].pid);
		} else if (data[i].st & 1 << 1) {
			// 観戦中
			viewMode(obj);
		} else if (data[i].st & 1 << 4) {
			// 待ち合わせ中
			secretMode(obj, data[i].pid);
		} else {
			// 待機中
			waitingMode(obj, data[i].pid);
		}
	} else {
		if (data[i].st & 1 << 3) {
			// 中継中
			relayMode(obj, data[i].pid);
		} else {
			// ゲーム中
			playingMode(obj, data[i].pid);
		}
	}
	if (data[i].c !== undefined && data[i].c !== null && data[i].c !== '') {
		obj.find('.flag').attr('src', n01_data.subPagePath + 'image/flags/' + data[i].c + '.png');
		try {
			obj.find('.flag').attr('cname', getCountryName(data[i].c));
		} catch (e) {
		}
		obj.find('.flag').show();
	}
	if (data[i].tw !== undefined && data[i].tw !== null && data[i].tw !== '') {
		obj.find('.tw').attr('sname', data[i].tw);
		obj.find('.tw').show();
	}
	if (data[i].fb !== undefined && data[i].fb !== null && data[i].fb !== '') {
		obj.find('.fb').show();
	}
	if (data[i].w !== undefined && data[i].w !== null && data[i].w !== '') {
		obj.find('.webcam').show();
	}
	if (data[i].pid === n01_data.onlineOptions.pid) {
		if (data[i].w !== undefined && data[i].w !== null && data[i].w !== '') {
			n01_data.onlineOptions.webcam = 1;
		} else {
			n01_data.onlineOptions.webcam = 0;
		}
		n01_data.saveOnlineOptions();
	}
	addDetailMessage(obj, data, i);
}

function addDetailMessage(obj, data, i) {
	if (data[i].lg && data[i].td) {
		obj.find('.user_list_status').append('<div class="legs_msg" style="color:#808080"><a href="../league/season.php?id=' + data[i].td + '" class="t_link" target="_blank">' + res.status_league + '</a></div>');
	} else if (data[i].td) {
		obj.find('.user_list_status').append('<div class="legs_msg" style="color:#808080"><a href="../tournament/comp.php?id=' + data[i].td + '" class="t_link" target="_blank">' + res.status_tournament + '</a></div>');
	} else if (data[i].om) {
		obj.find('.user_list_status').append('<div class="legs_msg" style="color:#808080">' + res.status_live_online + '</div>');
	} else if (data[i].se > 0) {
		var legsMsg = res.set_msg_prefix + data[i].se + res.set_msg_set_name + data[i].l + res.set_msg_suffix;
		if (data[i].ss !== undefined) {
			legsMsg = legsMsg + '<br />(' + data[i].ss + ')';
		}
		obj.find('.user_list_status').append('<div class="legs_msg" style="color:#808080">' + legsMsg + '</div>');
	} else if (data[i].l > 0) {
		var legsMsg = res.leg_msg_prefix + data[i].l + res.leg_msg_suffix;
		if (data[i].ss !== undefined) {
			legsMsg = legsMsg + '<br />(' + data[i].ss + ')';
		}
		obj.find('.user_list_status').append('<div class="legs_msg" style="color:#808080">' + legsMsg + '</div>');
	} else if (data[i].ss) {
		obj.find('.user_list_status').append('<div class="legs_msg" style="color:#808080">(' + data[i].ss + ')</div>');
	}
	if (data[i].t) {
		obj.find('.user_list_name_text').append('<span class="avg_text" style="color:#808080"> (' + escapeHTML(data[i].t) + ')</span>');
	} else if (data[i].d !== undefined && data[i].d > 0) {
		var avg = data[i].s / data[i].d;
		if (n01_data.options.avePPR === 1) {
			avg *= 3;
		}
		obj.find('.user_list_name_text').append('<span class="avg_text" style="color:#808080"> (' + avg.toFixed(2) + ')</span>');
	}
}

function waitingMode(obj, pid) {
	obj.find('.user_list_status').text(res.status_ready);
	if (pid === n01_data.onlineOptions.pid) {
		obj.css('background-color', '#FFE3E3');
	}
	if (join === false || away === true) {
	} else if (pid === n01_data.onlineOptions.pid) {
		obj.find('.user_list_button').find('.away_button').val(res.away_button);
		obj.find('.user_list_button').find('.away_button').show();
	} else {
		obj.find('.user_list_button').find('.play_button').val(res.play_button);
		obj.find('.user_list_button').find('.play_button').show();
	}
}

function secretMode(obj, pid) {
	obj.find('.user_list_status').text(res.status_ready);
	if (pid === n01_data.onlineOptions.pid) {
		obj.css('background-color', '#FFE3E3');
	}
	if (join === false || away === true) {
	} else if (pid === n01_data.onlineOptions.pid) {
		obj.find('.user_list_button').find('.away_button').val(res.away_button);
		obj.find('.user_list_button').find('.away_button').show();
	} else {
		obj.find('.user_list_button').find('.secret_button').val(res.secret_button);
		obj.find('.user_list_button').find('.secret_button').show();
	}
}

function playingMode(obj, pid) {
	obj.find('.user_list_status').text(res.status_playing);
	obj.css('background-color', '#c0c0c0');
	obj.css('color', '#606060');
	if (join === true && pid === n01_data.onlineOptions.pid) {
		checkMe();
	}
	if (join === true && away === false && pid !== n01_data.onlineOptions.pid) {
		obj.find('.user_list_button').find('.view_button').val(res.view_button);
		obj.find('.user_list_button').find('.view_button').show();
	}
}

function relayMode(obj, pid) {
	obj.find('.user_list_status').text(res.status_live);
	obj.css('background-color', '#c0c0c0');
	obj.css('color', '#606060');
	if (join === true && pid === n01_data.onlineOptions.pid) {
		checkMe();
	}
	if (join === true) {
		if (away === false && pid !== n01_data.onlineOptions.pid) {
			obj.find('.user_list_button').find('.view_button').val(res.view_button);
			obj.find('.user_list_button').find('.view_button').show();
		}
	} else {
		obj.find('.user_list_button').find('.view_button').val(res.view_button);
		obj.find('.user_list_button').find('.view_button').show();
	}
}

function awayMode(obj, pid) {
	obj.find('.user_list_status').text(res.status_away);
	if (pid === n01_data.onlineOptions.pid) {
		obj.css('background-color', '#FFE3E3');
		obj.css('color', '#808080');
		obj.find('.user_list_button').find('.away_button').val(res.return_button);
		obj.find('.user_list_button').find('.away_button').show();
	} else {
		obj.css('background-color', '#c0c0c0');
		obj.css('color', '#606060');
	}
}

function viewMode(obj) {
	obj.find('.user_list_status').text(res.status_watching);
	obj.css('background-color', '#c0c0c0');
	obj.css('color', '#606060');
}

var disable = false;
function matchUser(pid, skey) {
	if (disable) {
		return;
	}
	disable = true;
	$.ajax({
		url: n01_data.phpUser + '?cmd=match_start&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify({pid:pid, skey:skey}),
		timeout: 30000,
		success: function(data) {
			if (data.result === undefined) {
				// error
				alert(res.matching_error_msg);
			} else if (data.result === -5) {
				// error
				alert(res.secret_key_error_msg);
			} else if (data.result < 0) {
				// error
				alert(res.matching_error_msg);
			} else {
				checkMe();
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(res.matching_error_msg + '\n\n' + textStatus + '\n' + XMLHttpRequest.status + ' ' + errorThrown);
		},
		complete: function(data) {
			disable = false;
		}
	});
}

function checkMe() {
	if (maintenance) {
		return;
	}
	if (n01_data.getSetData() !== null) {
		if (n01_data.getSetData().viewMode === 1) {
			return;
		}
		n01_data.onlineOptions.returnTop = window.location.href;
		n01_data.saveOnlineOptions();
		window.location.href = 'n01.html';
		return;
	}
	$.ajax({
		url: n01_data.phpUser + '?cmd=check&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		timeout: 10000,
		success: function(data) {
			if (data.startScore === undefined) {
				return;
			}
			if (data.statsData[0].pid === n01_data.onlineOptions.pid) {
				data.statsData[0].me = 1;
			} else if (data.statsData[1].pid === n01_data.onlineOptions.pid) {
				data.statsData[1].me = 1;
			}
			n01_data.setData = data;
			n01_data.saveSetData();
			
			n01_data.onlineOptions.returnTop = window.location.href;
			n01_data.saveOnlineOptions();
			window.location.href = 'n01.html';
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		},
		complete: function(data) {
		}
	});
}

function viewMatch(pid) {
	if (disable) {
		return;
	}
	disable = true;
	$.ajax({
		url: n01_data.phpUser + '?cmd=match_view&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify({pid:pid}),
		timeout: 30000,
		success: function(data) {
			if (data.startScore === undefined) {
				alert(res.data_recv_error_msg);
				return;
			}
			n01_data.setData = data;
			n01_data.setData.viewMode = 1;
			if (n01_data.setData.endSchedule === 1) {
				n01_data.setData.currentLeg--;
			}
			n01_data.saveSetData();

			if (data.sets !== undefined) {
				n01_data.onlineOptions.winSets = data.sets;
			} else {
				n01_data.onlineOptions.winSets = [0, 0];
			}
			n01_data.onlineOptions.returnTop = window.location.href;
			n01_data.saveOnlineOptions();
			if (data.scid === undefined || data.scid === '') {
				window.location.href = 'n01_view.html?mid=' + data.mid;
			} else {
				window.location.href = 'n01_view.html?scid=' + data.scid;
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert(res.data_recv_error_msg + '\n\n' + textStatus + '\n' + XMLHttpRequest.status + ' ' + errorThrown);
		},
		complete: function(data) {
			disable = false;
		}
	});
}

function getInfoMessage() {
	$.ajax({
		url: n01_data.phpUser + '?cmd=info&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		timeout: 10000,
		success: function(data) {
			if (data.text !== undefined && data.text !== '') {
				var msg = data.text.replace(/\+/g, ' ');
				$('#info').append(decodeURIComponent(msg));
				$('#info').show();
			} else {
				$('#info').append('');
				$('#info').hide();
			}
			resize();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		},
		complete: function(data) {
		}
	});
}

function scroll_bottom() {
	var target = [document.body.clientHeight,document.body.scrollHeight,document.documentElement.clientHeight,document.documentElement.scrollHeight];
	var bottom = Math.max.apply(null, target);
	$('html, body').animate({scrollTop: bottom});
}

