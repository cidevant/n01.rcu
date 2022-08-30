/*
 * n01_setting.js
 *
 * Copyright (C) 1996-2020 by Ohno Tomoaki. All rights reserved.
 */

/*eslint-env browser, jquery*/
/*globals n01_data n01_util*/
var skey = '';

var resources = {
	en : {
		secret_key_msg : 'Your secret key is &quot;<span class="secret_key">%key</span>&quot;.<br>Please send to the meeting partner.',

		input_name_msg : "Input name",
		max_user_msg : "Maximum user count has been exceeded.",
	},
	ja : {
		header_title : "参加設定",
		button_cancel : "キャンセル",
		button_game_on : "完了",

		title_player_name : "名前",
		title_tw_login : "Twitter",
		title_tw_remove : "Twitter連携の解除",
		title_fb_login : "Facebook",
		title_fb_remove : "Facebook連携の解除",
		sns_detail : "SNSと連携するとスタッツを管理できます。",
		title_country : "国 (任意)",
		
		webcam_title : "Webカメラを使用する",
		webcam_button : "Webカメラの設定",

		secret_mode_title : "シークレットモード",
		secret_key_msg : 'あなたのシークレットキーは「<span class="secret_key">%key</span>」です。<br>待ち合わせの相手に送ってください。',

		limit_set_title : "対戦を申し込まれた時のSet数を制限",
		limit_set_msg1 : "",
		limit_set_msg2 : " Set / ",
		limit_set_msg3 : " Leg先取",
		limit_leg_title : "対戦を申し込まれた時のLeg数を制限",
		limit_leg_msg1 : "",
		limit_leg_msg2 : " Leg先取",
		no_limit_title : "制限しない",

		start_score_title : "開始スコア",

		reset_button : "Averageをリセット",

		input_name_msg : "名前を入力してください",
		max_user_msg : "ユーザー数の上限に達しています。\n少し時間を置いてから試してください。",

		d_msg : "「n01オンライン」の継続的な改善のために寄付をお願いします。",
	},
};
var res = {};
var lang = 'en';
$(function() {
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
		$('#button_cancel').text(res.button_cancel);
		$('#button_game_on').text(res.button_game_on);

		$('#title_player_name').text(res.title_player_name);
		$('#title_tw_login').text(res.title_tw_login);
		$('#title_tw_remove').text(res.title_tw_remove);
		$('#title_fb_login').text(res.title_fb_login);
		$('#title_fb_remove').text(res.title_fb_remove);
		$('#sns_detail').text(res.sns_detail);
		$('#title_country').text(res.title_country);

		$('#webcam_title').text(res.webcam_title);
		$('#webcam_button').val(res.webcam_button);
		$('#secret_mode_title').text(res.secret_mode_title);

		$('#limit_set_title').text(res.limit_set_title);
		$('#limit_set_msg1').text(res.limit_set_msg1);
		$('#limit_set_msg2').text(res.limit_set_msg2);
		$('#limit_set_msg3').text(res.limit_set_msg3);
		$('#limit_leg_title').text(res.limit_leg_title);
		$('#limit_leg_msg1').text(res.limit_leg_msg1);
		$('#limit_leg_msg2').text(res.limit_leg_msg2);
		$('#no_limit_title').text(res.no_limit_title);

		$('#start_score_title').text(res.start_score_title);

		$('#reset_button').val(res.reset_button);

		$('#d_msg').text(res.d_msg);
		//$('#paypay').show();
	}
});

$(function() {
	$('#header').show();
	$('#article').show();
	initSetting();
	resize();
	$(window).resize(function() {
		resize();
	});

	$(document).on('keydown', function(e) {
		if (e.key !== undefined) {
			switch (e.key) {
			case 'Enter':
				$('#button_game_on').click();
				break;
			case 'Escape':
			case 'Esc':
				setTimeout(function() {
					$('#button_cancel').click();
				}, 100);
				break;
			}
		} else {
			switch (e.keyCode) {
			case 13:	// Enter
				$('#button_game_on').click();
				break;
			case 27:	// ESC
				setTimeout(function() {
					$('#button_cancel').click();
				}, 100);
				break;
			}
		}
	});

	$('#button_cancel').click(function() {
		// 戻る
		if (n01_data.onlineOptions.returnTop !== undefined && n01_data.onlineOptions.returnTop) {
			window.location.href = n01_data.onlineOptions.returnTop;
		} else {
			window.location.href = '../';
		}
	});

	var disable = false;
	$('#button_game_on').click(function() {
		var name = '';
		var tw_name = $('#tw_name').text();
		if (tw_name) { 
			name = tw_name;
		} else {
			name = jQuery.trim($('#p1_name').val());
		}
		if (name === '') {
			alert(res.input_name_msg);
			return;
		}

		// Optionの保存
		saveSetting();

		var sets = 0;
		var legs = 0;
		switch (n01_data.onlineOptions.limit) {
		case 0:
		default:
			break;
		case 1:
			legs = n01_data.onlineOptions.limit_leg_count;
			break;
		case 2:
			sets = n01_data.onlineOptions.limit_set_count;
			legs = n01_data.onlineOptions.limit_set_leg_count;
			break;
		}
		var send_key = (n01_data.onlineOptions.secret_mode) ? skey : '';
		var tw_str = $('#tw_str').text();
		var fb_str = $('#fb_str').text();
		
		var uid = '';
		if (n01_data.camOptions.camera_device) {
			uid = n01_data.camOptions.camera_device_uid + '_' + n01_util.crc32(n01_data.camOptions.camera_device_pass.toLowerCase());
		}

		if (disable) {
			return;
		}
		disable = true;
		var jsonData = {
			name: jQuery.trim(name),
			country: n01_data.onlineOptions.country,
			skey: send_key,
			uid: uid,
			sets: sets,
			legs: legs,
			startScore: n01_data.onlineOptions.startScore,
			score: n01_data.statsData.score,
			darts: n01_data.statsData.darts,
			tw_str: tw_str,
			fb_str: fb_str,
			ch: n01_data.onlineOptions.ch,
			webcam: n01_data.camOptions.webcam,
		};
		$.ajax({
			url: n01_data.phpUser + '?cmd=join&sid=' + n01_data.onlineOptions.sid,
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(jsonData),
			timeout: 30000,
			success: function(data) {
				if (data.result === -1) {
					alert(res.max_user_msg);
					return;
				}
				if (data.result === -2) {
					alert('Data Error');
					return;
				}
				if (data.result === -4) {
					alert('User Error');
					return;
				}
				if (data.result === -5) {
					alert('User Name Error');
					return;
				}
				n01_data.onlineOptions.pid = data.pid;
				n01_data.onlineOptions.sid = data.sid;
				n01_data.saveOnlineOptions();
				// セット情報の初期化
				n01_data.initSet();
				n01_data.saveSetData();
				// 戻る
				if (n01_data.onlineOptions.returnTop !== undefined && n01_data.onlineOptions.returnTop) {
					window.location.href = n01_data.onlineOptions.returnTop;
				} else {
					window.location.href = '../';
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert('Error\n\n' + textStatus + '\n' + XMLHttpRequest.status + ' ' + errorThrown);
			},
			complete: function(data) {
				disable = false;
			}
		});
	});
	
	$('#tw_login_button').click(function() {
		saveSetting();
		window.location.href = '../twitter/login.php';
	});

	$('#tw_remove_button').click(function() {
		saveSetting();
		window.location.href = '?sns_cancel=1';
	});

	$('#fb_login_button').click(function() {
		saveSetting();
		window.location.href = '../facebook/fb_login.php';
	});

	$('#fb_remove_button').click(function() {
		saveSetting();
		window.location.href = '?sns_cancel=1';
	});

	$('#webcam_button').click(function() {
		saveSetting();
		n01_data.onlineOptions.returnUrl = window.location.href;
		n01_data.saveOnlineOptions();
		window.location.href = 'webcam.html';
	});
	
	$('#reset_button').click(function() {
		n01_data.statsData.score = 0;
		n01_data.statsData.darts = 0;
		
		$('#avg_text').text('0.00');
	});
});

function saveSetting() {
	n01_data.camOptions.webcam = ($('#webcam').prop('checked')) ? 1 : 0;
	n01_data.saveCamOptions();

	// Optionの保存
	n01_data.onlineOptions.playerName = jQuery.trim($('#p1_name').val());
	n01_data.onlineOptions.tid = $('#tid').text();
	n01_data.onlineOptions.tname = $('#tname').text();
	n01_data.onlineOptions.fid = $('#fid').text();
	n01_data.onlineOptions.fname = $('#fname').text();
	n01_data.onlineOptions.country = $('#country').val();
	n01_data.onlineOptions.secret_mode = ($('#secret_mode').prop('checked')) ? 1 : 0;
	n01_data.onlineOptions.secret_key = skey;
	if ($('#limit_leg').prop('checked')) {
		n01_data.onlineOptions.limit = 1;
	} else if ($('#limit_set').prop('checked')) {
		n01_data.onlineOptions.limit = 2;
	} else if ($('#no_limit').prop('checked')) {
		n01_data.onlineOptions.limit = 0;
	}

	var limit_leg_count = $('#limit_leg_count').val();
	if (limit_leg_count === '') {
		limit_leg_count = 2;
	} else {
		limit_leg_count = parseInt(limit_leg_count, 10);
		if (limit_leg_count <= 0) {
			limit_leg_count = 1;
		}
		if (limit_leg_count > 99) {
			limit_leg_count = 99;
		}
	}
	n01_data.onlineOptions.limit_leg_count = limit_leg_count;
	
	var limit_set_count = $('#limit_set_count').val();
	if (limit_set_count === '') {
		limit_set_count = 2;
	} else {
		limit_set_count = parseInt(limit_set_count, 10);
		if (limit_set_count <= 0) {
			limit_set_count = 1;
		}
		if (limit_set_count > 99) {
			limit_set_count = 99;
		}
	}
	n01_data.onlineOptions.limit_set_count = limit_set_count;

	var limit_set_leg_count = $('#limit_set_leg_count').val();
	if (limit_set_leg_count === '') {
		limit_set_leg_count = 2;
	} else {
		limit_set_leg_count = parseInt(limit_set_leg_count, 10);
		if (limit_set_leg_count <= 0) {
			limit_set_leg_count = 1;
		}
		if (limit_set_leg_count > 99) {
			limit_set_leg_count = 99;
		}
	}
	n01_data.onlineOptions.limit_set_leg_count = limit_set_leg_count;

	var startScore = $('#start_score').val();
	if (startScore === '') {
		startScore = 501;
	} else {
		startScore = parseInt(startScore, 10);
		if (startScore < 100) {
			startScore = 501;
		}
		if (startScore > 10001) {
			startScore = 501;
		}
	}
	n01_data.onlineOptions.startScore = startScore;
	
	n01_data.saveOnlineOptions();

	// スタッツの保存
	n01_data.saveStatsData();
}

function enableLimitText() {
	if ($('#limit_leg').prop('checked')) {
		$('#limit_leg_count').prop('disabled', false);
		$('#limit_set_count').prop('disabled', true);
		$('#limit_set_leg_count').prop('disabled', true);
	} else if ($('#limit_set').prop('checked')) {
		$('#limit_leg_count').prop('disabled', true);
		$('#limit_set_count').prop('disabled', false);
		$('#limit_set_leg_count').prop('disabled', false);
	} else if ($('#no_limit').prop('checked')) {
		$('#limit_leg_count').prop('disabled', true);
		$('#limit_set_count').prop('disabled', true);
		$('#limit_set_leg_count').prop('disabled', true);
	}
}

function escapeHTML(str) {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function showSecretKeyText(ischecked) {
	if (ischecked) {
		var c = '34567ACDEFGHJKLMNPRSTUVWXY';
		var cl = c.length;
		skey = '';
		for(var i = 0; i < 3; i++){
			skey += c[Math.floor(Math.random() * cl)];
		}
		var msg = res.secret_key_msg;
		$('#secret_key_msg').html(msg.replace('%key', escapeHTML(skey)));
		$('#secret_key_msg').show();
	} else {
		$('#secret_key_msg').hide();
	}
}

function initSetting() {
	// Optionの読み込み
	n01_data.restoreOptions();
	n01_data.restoreOnlineOptions();
	n01_data.restoreCamOptions();
	
	$('#p1_name').val(n01_data.onlineOptions.playerName);
	$('#country').val(n01_data.onlineOptions.country);

	$('#webcam').prop('checked', (n01_data.camOptions.webcam) ? true : false);

	if (n01_data.onlineOptions.secret_key !== undefined && n01_data.onlineOptions.secret_key) {
		skey = n01_data.onlineOptions.secret_key;
	} else {
		var c = '34567ACDEFGHJKLMNPRSTUVWXY';
		var cl = c.length;
		skey = '';
		for(var i = 0; i < 3; i++){
			skey += c[Math.floor(Math.random() * cl)];
		}
	}
	var msg = res.secret_key_msg;
	$('#secret_key_msg').html(msg.replace('%key', escapeHTML(skey)));
	if (n01_data.onlineOptions.secret_mode === 1) {
		$('#secret_mode').prop('checked', true);
		$('#secret_key_msg').show();
	}

	if (n01_data.onlineOptions.limit === undefined) {
		if (n01_data.onlineOptions.limit_leg) {
			n01_data.onlineOptions.limit = 1;
		} else {
			n01_data.onlineOptions.limit = 0;
		}
	}
	switch (n01_data.onlineOptions.limit) {
	case 0:
	default:
		$('#no_limit').prop('checked', true);
		break;
	case 1:
		$('#limit_leg').prop('checked', true);
		break;
	case 2:
		$('#limit_set').prop('checked', true);
		break;
	}
	$('#limit_leg_count').val(n01_data.onlineOptions.limit_leg_count);
	if (n01_data.onlineOptions.limit_set_count !== undefined) {
		$('#limit_set_count').val(n01_data.onlineOptions.limit_set_count);
	}
	if (n01_data.onlineOptions.limit_set_leg_count !== undefined) {
		$('#limit_set_leg_count').val(n01_data.onlineOptions.limit_set_leg_count);
	}
	enableLimitText();

	if (n01_data.onlineOptions.startScore === undefined || !n01_data.onlineOptions.startScore) {
		$('#start_score').val(501);
	} else {
		$('#start_score').val(n01_data.onlineOptions.startScore);
	}

	// スタッツの読み込み
	n01_data.restoreStatsData();
	if (n01_data.statsData.darts !== undefined && n01_data.statsData.darts > 0) {
		var avg = n01_data.statsData.score / n01_data.statsData.darts;
		if (n01_data.options.avePPR === 1) {
			avg *= 3;
		}
		$('#avg_text').text(avg.toFixed(2));
	} else {
		$('#avg_text').text('0.00');
	}
}

var oldWidth = 0;
function resize() {
	if (oldWidth !== 0 && oldWidth === $(window).width()) {
		// ソフトキーボード表示／非表示の可能性があるためサイズ変更しない
		return;
	}
	oldWidth = $(window).width();
	var windowSize = ($(window).width() < $(window).height()) ? $(window).width() : $(window).height();
	var bodyFont = windowSize * 0.06;
	$('body').css('font-size', bodyFont + 'px');
	$('input').css('font-size', bodyFont + 'px');
	$('select').css('font-size', bodyFont + 'px');

	$('#dmsg').css('font-size', windowSize * 0.04 + 'px');

	var checkWidth = windowSize * 0.05;
	$('input[type="checkbox"]').css('width', checkWidth + 'px');
	$('input[type="radio"]').css('width', checkWidth + 'px');
	var checkHeight = windowSize * 0.05;
	$('input[type="checkbox"]').css('height', checkHeight + 'px');
	$('input[type="radio"]').css('height', checkHeight + 'px');

	var inputMarginTop = windowSize * 0.01;
	var inputMarginBottom = windowSize * 0.03;
	$('input[type="text"]').css('margin', inputMarginTop + 'px 0 ' + inputMarginBottom + 'px 0');
	$('input[type="number"]').css('margin', inputMarginTop + 'px 0 ' + inputMarginBottom + 'px 0');
	$('select').css('margin', inputMarginTop + 'px 0 ' + inputMarginBottom + 'px 0');

	var inputPadding = windowSize * 0.015;
	$('input[type="text"]').css('padding', inputPadding + 'px');
	$('input[type="number"]').css('padding', inputPadding + 'px');
	$('select').css('padding', inputPadding + 'px');

	var buttonPadding = windowSize * 0.015;
	$('input[type="button"]').css('padding', buttonPadding + 'px ' + (buttonPadding * 3) + 'px');
	$('input[type="button"]').css('margin', windowSize * 0.015 + 'px 0');
	buttonRadius = windowSize * 0.02;
	$('input[type="button"]').css('border-radius', buttonRadius + 'px');
	$('input[type="button"]').css('-webkit-border-radius', buttonRadius + 'px');
	$('input[type="button"]').css('-moz-border-radius', buttonRadius + 'px');
	$('input[type="button"]').css('box-shadow', '0px ' + (windowSize * 0.003) + 'px ' + (windowSize * 0.01) + 'px rgba(0,0,0,0.3)');

	var indent = windowSize * 0.07;
	$('.indent').css('padding-left', indent + 'px');

	var hrMargin = windowSize * 0.03;
	$('hr').css('margin', hrMargin + 'px 0');

	$('.tw_button').css('padding', windowSize * 0.03 + 'px 0');
	$('.fb_button').css('padding', windowSize * 0.03 + 'px 0');
	$('.tw_logo').css('width', windowSize * 0.06 + 'px');
	$('.tw_logo').css('margin-right', windowSize * 0.02 + 'px');

	$('.tw_info').css('margin-top', windowSize * 0.01 + 'px');
	$('.tw_info').css('margin-bottom', windowSize * 0.03 + 'px');
	$('#tw_remove_button').css('margin-bottom', windowSize * 0.05 + 'px');
	$('#fb_login_button').css('margin-bottom', windowSize * 0.02 + 'px');
	$('#fb_remove_button').css('margin-bottom', windowSize * 0.05 + 'px');
	
	$('#name_or').css('margin-top', windowSize * 0.02 + 'px');
	$('#name_or').css('margin-bottom', windowSize * 0.04 + 'px');
	$('#name_or').css('font-size', windowSize * 0.05 + 'px');
	$('#screen_name').css('font-size', windowSize * 0.05 + 'px');
	$('#screen_name').css('margin-left', windowSize * 0.04 + 'px');
	$('#sns_detail').css('margin-top', windowSize * 0.02 + 'px');
	$('#sns_detail').css('margin-bottom', windowSize * 0.05 + 'px');
	$('#sns_detail').css('font-size', windowSize * 0.04 + 'px');
	$('#policy').css('margin-top', windowSize * 0.02 + 'px');
	$('#policy').css('margin-bottom', windowSize * 0.04 + 'px');
	$('#policy').css('font-size', windowSize * 0.05 + 'px');

	n01_util.headerResize();
	
	if (lang === 'ja') {
		var cancelButtonWidth;
		if ($(window).width() < $(window).height()) {
			cancelButtonWidth = windowSize * 0.32;
		} else {
			cancelButtonWidth = windowSize * 0.27;
		}
		$('#td_button_cancel').css('width', cancelButtonWidth + 'px');
	}
	var headerHeight = $('#header_table').height();
	$('#header_back').css('height', headerHeight + 'px');
	$('#article').css('padding-top', headerHeight + 'px');
}
