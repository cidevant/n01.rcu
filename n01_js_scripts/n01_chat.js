/*
 * n01_chat.js
 *
 * Copyright (C) 1996-2020 by Ohno Tomoaki. All rights reserved.
 */

/*eslint-env browser, jquery*/
/*globals n01_data n01_util*/
var chatFirstTime = 0;
var chatUpdateTime = 0;
var msgAjaxSyncFlag = false;
var backScrollTop = 0;
var first = true;

var chatResources = {
	en : {
		chat_join_msg : "Please join n01 online.",
		char_limit_over: "Over the Character Limit.(140 characters)",
	},
	ja : {
		chat_return_button : "閉じる",
		chat_msg_input : "Enterで送信",
		c_send_button : "送信",

		chat_join_msg : "発言するにはn01オンラインに参加してください。",
		char_limit_over: "文字数制限を超えています。(140文字)",
	},
};
var chatRes = {};
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
	chatRes = chatResources[lang];
	if (chatRes === undefined) {
		chatRes = chatResources['en'];
	} else if (lang !== 'en') {
		$('#chat_return_button').val(chatRes.chat_return_button);
		$('#chat_msg_input').attr('placeholder', chatRes.chat_msg_input);
		$('#c_send_button').val(chatRes.c_send_button);
	}
});

$(function() {
	resizeChat();

	// Optionの読み込み
	n01_data.restoreOnlineOptions();
	n01_data.restoreChatOptions();

	var chatInputMsg = localStorage.getItem('n01_chatInputMsg');
	if (chatInputMsg !== null) {
		$('#chat_msg_input').val(chatInputMsg);
	}

	var resizeTimer = false;
	$(window).resize(function() {
		resizeChat();
		if (resizeTimer !== false) {
			clearTimeout(resizeTimer);
		}
		resizeTimer = setTimeout(function() {
			resizeChat();
		}, 500);
	});

	$('#chat_button').click(function() {
		initChat();
	});

	$('#chat_return_button').click(function() {
		if ($('#chat_window').css('display') === 'block') {
			$('#chat_window').fadeOut('fast');
			$('#article' ).attr({style: ''});
			resize();
			$('html,body').scrollTop(backScrollTop);
			
			initMsgCount();
		}
	});
	
	$(document).on('keydown', function(e) {
		if ($('#chat_window').css('display') === 'block') {
			switch (e.keyCode) {
			case 13:	// Enter
				sendMsg();
				return false;
			case 27:	// ESC
				$('#chat_return_button').click();
				return false;
			}
		}
	});

	$('#chat_msg_input').change(function() {
		checkChange();
	});
	$('#chat_msg_input').keyup(function() {
		checkChange();
	});
	$('#c_send_button').click(function() {
		sendMsg();
	});
});

$(function() {
	$('#chat_area').top_reload({proximity: 0.03});
	$('#chat_area').on('top_reload', function() {
		getOldMsg();
	});
});

function initChat() {
	var ua = n01_util.getUserAgent();
	if (!ua.isWindowsPhone && !ua.isiOS && !ua.isAndroid) {
		initMsgCount();
		$('#chat_count').hide();
		openChatWindow();
		return;
	}

	initMsgCount();
	$('#chat_count').hide();

	backScrollTop = $(window).scrollTop();
	$('#article').css({'position':'fixed','top':-backScrollTop});
	$('#chat_window').fadeIn('fast');
	resizeChat();
	
	first = true;
	checkMsg();
}

var chatWindow;
function openChatWindow() {
	if (chatWindow) {
		if (chatWindow.closed) {
			chatWindow = window.open(n01_data.subPagePath + 'chat.html', 'n01_Chat', 'width=800, height=550, menubar=no, toolbar=no, scrollbars=yes, resizable=yes');
		} else {
			chatWindow.focus();
		}
	} else {
		chatWindow = window.open(n01_data.subPagePath + 'chat.html', 'n01_Chat', 'width=800, height=550, menubar=no, toolbar=no, scrollbars=yes, resizable=yes');
	}
}

var oldText = null;
function checkChange(){
	newText = $('#chat_msg_input').val();
	if(oldText !== newText){
		oldText = newText;
		localStorage.setItem('n01_chatInputMsg', newText);
	}
}

var oldChatWidth = 0;
function resizeChat() {
	$('#chat_window').css('height', $(window).height() + 'px');
	var windowSize = ($('#chat_window').width() < $('#chat_window').height()) ? $('#chat_window').width() : $('#chat_window').height();
	if (oldChatWidth !== 0 && oldChatWidth === $(window).width()) {
		$('#chat_contents').css('height', ($('#chat_window').height() - $('#return_area').outerHeight(true)) + 'px');
		$('#chat_area').css('height', ($('#chat_window').height() - $('#return_area').outerHeight(true) - $('#input_area').outerHeight(true)) + 'px');
		$('#chat_area').scrollTop($('#chat_area')[0].scrollHeight);
		return;
	}
	oldChatWidth = $(window).width();
	
	$('#chat_msg_input').css('font-size', (windowSize * 0.06) + 'px');
	$('#chat_return_button').css('font-size', (windowSize * 0.04) + 'px');
	$('#chat_return_button').css('padding', (windowSize * 0.02) + 'px');
	resizeSNS();

	$('#return_area').css('padding-top', (windowSize * 0.01) + 'px');
	$('#return_area').css('padding-bottom', (windowSize * 0.01) + 'px');

	$('#input_area').css('padding-top', (windowSize * 0.015) + 'px');
	
	$('#chat_contents').css('height', ($('#chat_window').height() - $('#return_area').outerHeight(true)) + 'px');

	$('#chat_area').css('font-size', (windowSize * 0.05) + 'px');
	$('#chat_area').css('padding-left', (windowSize * 0.02) + 'px');
	$('#chat_area').css('padding-right', (windowSize * 0.02) + 'px');
	$('#chat_area').css('height', ($('#chat_window').height() - $('#return_area').outerHeight(true) - $('#input_area').outerHeight(true)) + 'px');

	$('.chat_msg').css('padding-top', (windowSize * 0.02) + 'px');
	$('.chat_msg_time').css('font-size', (windowSize * 0.04) + 'px');
	$('.chat_msg_name').css('margin-right', (windowSize * 0.01) + 'px');

	$('.chat_date ').css('margin-top', (windowSize * 0.05) + 'px');
	$('.chat_date ').css('margin-bottom', (windowSize * 0.02) + 'px');
	$('.chat_date_area ').css('top', -(windowSize * 0.03) + 'px');
	$('.chat_date_msg').css('font-size', (windowSize * 0.04) + 'px');

	$('#chat_area').scrollTop($('#chat_area')[0].scrollHeight);
}

function resizeSNS() {
	var windowSize = ($('#chat_window').width() < $('#chat_window').height()) ? $('#chat_window').width() : $('#chat_window').height();
	$('.chat_tw').css('height', (windowSize * 0.05) + 'px');
	$('.chat_tw').css('margin-top', (windowSize * 0.005) + 'px');
	$('.chat_tw').css('margin-left', (windowSize * 0.005) + 'px');
	$('.chat_fb').css('height', (windowSize * 0.04) + 'px');
	$('.chat_fb').css('margin-top', (windowSize * 0.005) + 'px');
	$('.chat_fb').css('margin-left', (windowSize * 0.005) + 'px');
}

var currentNewDate = '';
var currentOldDate = '';
function toLocaleDateString(datetime)
{
	return n01_date_format.formatDate(new Date(datetime), navigator.language);
}

function setMsg(obj, data) {
	var time = n01_date_format.formatTime(new Date(data.time), navigator.language);
	obj.find('.chat_msg_time').text(time);
	obj.find('.chat_msg_name').text(data.name);
	if (data.sname !== undefined && data.sname !== null && data.sname !== '') {
		obj.find('.chat_msg_name').append('<a href="https://twitter.com/' + data.sname + '" target="_blank"><img src="twitter/Twitter_Logo_Blue.png" class="chat_tw" /></a>');
		resizeSNS();
	} else if (data.fb !== undefined && data.fb !== null && data.fb !== '') {
		obj.find('.chat_msg_name').append('<img src="facebook/f_logo_RGB-Blue_114.png" class="chat_fb" />');
		resizeSNS();
	}
	var str = String(data.msg).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	str = str.replace(/(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '<a href="$1" target="_blank">$1</a>');
	obj.find('.chat_msg_content').html(str);
}

function checkMsg() {
	if ($('#chat_window').css('display') !== 'block') {
		return;
	}
	$.ajax({
		url: n01_data.phpChat + '?cmd=getmsg&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify({updatetime: chatUpdateTime, poling: 0}),
		success: function(data) {
			if (data.length > 0) {
				data.sort(
					function(a, b){
						if (a.time !== b.time) {
							return (a.time > b.time) ? 1 : -1;
						}
						return 0;
					}
				);
				for (var i = 0; i < data.length; i++) {
					if (chatFirstTime === 0 || chatFirstTime > data[i].time) {
						chatFirstTime = data[i].time;
					}
					if (chatUpdateTime < data[i].time) {
						chatUpdateTime = data[i].time;
					}
					// 日付出力
					var dateStr = toLocaleDateString(data[i].time);
					if (currentNewDate !== '' && currentNewDate !== dateStr) {
						var objDate = $('#chat_date').clone(true).appendTo('#chat_area');
						objDate.attr('id', '');
						objDate.find('.chat_date_msg').text(toLocaleDateString(data[i].time));
						currentNewDate = dateStr;
					}
					if (currentNewDate === '') {
						currentOldDate = dateStr;
						currentNewDate = dateStr;
					}
					// メッセージ出力
					var obj = $('#chat_msg').clone(true).appendTo('#chat_area').hide().fadeIn((data.length === 1) ? 500 : 0);
					obj.attr('id', '');
					setMsg(obj, data[i]);
				}
				var windowSize = ($('#chat_window').width() < $('#chat_window').height()) ? $('#chat_window').width() : $('#chat_window').height();
				if (first === true) {
					first = false;
					$("#chat_area").scrollTop($("#chat_area")[0].scrollHeight);
				} else if (($('#chat_area').scrollTop() + $('#chat_area').height()) > $('#chat_area')[0].scrollHeight - (windowSize * 0.5)) {
					$('#chat_area').animate({scrollTop: $("#chat_area")[0].scrollHeight});
				}
				if ($('#chat_window').css('display') === 'block') {
					initMsgCount();
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		},
		complete: function(data) {
		}
	});
}

function getOldMsg() {
	if (chatFirstTime === 0 || msgAjaxSyncFlag === true) {
		return;
	}
	msgAjaxSyncFlag = true;
	var oldScrollHeight = $('#chat_area')[0].scrollHeight;
	$.ajax({
		url: n01_data.phpChat + '?cmd=getoldmsg&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify({time: chatFirstTime}),
		success: function(data) {
			if (data.length > 0) {
				data.sort(
					function(a, b){
						if (a.time !== b.time) {
							return (a.time > b.time) ? -1 : 1;
						}
						return 0;
					}
				);
				for (var i = 0; i < data.length; i++) {
					if (chatFirstTime > data[i].time) {
						chatFirstTime = data[i].time;
					}
					// 日付出力
					var dateStr = toLocaleDateString(data[i].time);
					if (currentOldDate !== '' && currentOldDate !== dateStr) {
						var objDate = $('#chat_date').clone(true).prependTo('#chat_area');
						objDate.attr('id', '');
						objDate.find('.chat_date_msg').text(currentOldDate);
						currentOldDate = dateStr;
					}
					if (currentOldDate === '') {
						currentOldDate = dateStr;
					}
					// メッセージ出力
					var obj = $('#chat_msg').clone(true).prependTo('#chat_area');
					obj.attr('id', '');
					setMsg(obj, data[i]);
				}
				$('#chat_area').scrollTop($('#chat_area')[0].scrollHeight - oldScrollHeight);
				msgAjaxSyncFlag = false;
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			msgAjaxSyncFlag = false;
		},
		complete: function(data) {
		}
	});
}

function initMsgCount() {
	$.ajax({
		url: n01_data.phpChat + '?cmd=check&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify({updatetime: 0}),
		success: function(data) {
			if (data.updateTime) {
				n01_data.chatOptions.chatMsgCheckTime = data.updateTime;
				n01_data.saveChatOptions();
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		},
		complete: function(data) {
		}
	});
}

function checkMsgCount() {
	if ($('#chat_window').css('display') === 'block') {
		return;
	}
	n01_data.restoreChatOptions();
	$.ajax({
		url: n01_data.phpChat + '?cmd=check&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify({updatetime: n01_data.chatOptions.chatMsgCheckTime, poling: 0}),
		success: function(data) {
			if ($('#chat_window').css('display') === 'block') {
				return;
			}
			if (data.updateTime) {
				n01_data.chatOptions.chatMsgCheckTime = data.updateTime;
				n01_data.saveChatOptions();
			}
			if (data.cnt !== undefined) {
				if (data.cnt > 0) {
					$('#chat_count').text(data.cnt);
					$('#chat_count').show();
				} else {
					$('#chat_count').hide();
				}
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		},
		complete: function(data) {
		}
	});
}

function sendMsg() {
	var text = $('#chat_msg_input').val().trim();
	if (text.length > 140) {
		alert(chatRes.char_limit_over);
		return;
	}
	if (text === "") {
		$('#chat_msg_input').val("");
		return;
	}
	$('#chat_msg_input').val("");

	n01_data.restoreOnlineOptions();
	$.ajax({
		url: n01_data.phpChat + '?cmd=putmsg&sid=' + n01_data.onlineOptions.sid,
		type: 'POST',
		dataType: 'json',
		data: JSON.stringify({msg: text}),
		success: function(data) {
			if (data.result === -3) {
				if (text !== "") {
					$('#chat_msg_input').val(text);
				}
				alert('Message Send Error');
				return;
			}
			if (data.result !== 0) {
				if (text !== "") {
					$('#chat_msg_input').val(text);
				}
				alert(chatRes.chat_join_msg);
			}
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			if (text !== "") {
				$('#chat_msg_input').val(text);
			}
			alert('Message Send Error\n\n' + XMLHttpRequest.status + ' ' + errorThrown);
		},
		complete: function(data) {
			checkChange();
			resizeChat();
		}
	});
}
