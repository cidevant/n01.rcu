/*
 * n01_data.js
 *
 * Copyright (C) 1996-2020 by Ohno Tomoaki. All rights reserved.
 */

/*eslint-env browser */
/*globals n01_util */
var n01_data = (function () {
	var me = {};

	// TOPページ(戻り用)
	me.topPage = '../n01.html';
	// SUBページのパス
	me.subPagePath = 'n01_v2/';
	// サーバURL
	me.phpSite = '//tk2-228-23746.vs.sakura.ne.jp/n01/online/';
	me.phpUser = me.phpSite + 'n01_user.php';
	me.phpOnline = me.phpSite + 'n01_online.php';
	me.phpView = me.phpSite + 'n01_view.php';
	me.phpChat = me.phpSite + 'n01_chat.php';
	me.phpChat_p = me.phpSite + 'n01_chat_p.php';
	me.phpStats = me.phpSite + 'n01_stats.php';
	me.phpCam = me.phpSite + 'n01_cam.php';

	me.ws = 'tk2-228-23746.vs.sakura.ne.jp';

	// 設定用接頭辞
	me.generalPrefix = '';
	me.optionPrefix = 'n01_net.';

	// 設定
	me.options = {
		keyShow: 0,
		leftShow: 1,
		roundDarts: 1,
		circleTon: 1,
		avePPR: 1,
		smallKeypad: 0,
		inputTag: 0,
		inputLeft: 0,
		inputLeftCom: 0
	};
	me.saveOptions = function () {
		localStorage.setItem(me.generalPrefix + 'options', JSON.stringify(me.options));
	};
	me.restoreOptions = function () {
		var str = localStorage.getItem(me.generalPrefix + 'options');
		if (str !== null) {
			me.options = JSON.parse(str);
			if (me.options.roundDarts === undefined) {
				me.options.roundDarts = 1;
			}
			if (me.options.circleTon === undefined) {
				me.options.circleTon = 1;
			}
			var ua = n01_util.getUserAgent();
			if (me.options.smallKeypad === undefined && ua.isTablet) {
				me.options.smallKeypad = 1;
			}
		} else {
			var ua = n01_util.getUserAgent();
			if (ua.isTablet) {
				me.options.smallKeypad = 1;
			}
			if (ua.isWindowsPhone || ua.isiOS || ua.isAndroid) {
				me.options.keyShow = 1;
			}
		}
	};

	// カメラ設定
	me.camOptions = {
		webcam: 0,
		audio: 1,
		mute: false,
		camera: '',
		microphone: '',
		camera_auto_zoom: 1,
	};
	me.saveCamOptions = function () {
		localStorage.setItem(me.generalPrefix + 'camOptions', JSON.stringify(me.camOptions));
	};
	me.restoreCamOptions = function () {
		var str = localStorage.getItem(me.generalPrefix + 'camOptions');
		if (str !== null) {
			me.camOptions = JSON.parse(str);
		}
	};

	// オンライン設定
	me.onlineOptions = {
		playerName: '',
		country: '',
		limit: 1,
		limit_set_count: 2,
		limit_set_leg_count: 2,
		limit_leg_count: 2,
		startScore: 501,
		pid: '',
		sid: '',
		cid: '',
		returnTop: '',
		returnUrl: '',
		winSets: [0, 0],
		filter: false,
		ch: 1,
	};
	me.saveOnlineOptions = function () {
		localStorage.setItem(me.optionPrefix + 'onlineOptions', JSON.stringify(me.onlineOptions));
	};
	me.restoreOnlineOptions = function () {
		var str = localStorage.getItem(me.optionPrefix + 'onlineOptions');
		if (str !== null) {
			me.onlineOptions = JSON.parse(str);
		}
		if (me.onlineOptions.country === undefined) {
			me.onlineOptions.country = '';
		}
		if (me.onlineOptions.limit === undefined) {
			me.onlineOptions.limit = 1;
		}
		if (me.onlineOptions.limit_set_count === undefined) {
			me.onlineOptions.limit_set_count = 2;
		}
		if (me.onlineOptions.limit_set_leg_count === undefined) {
			me.onlineOptions.limit_set_leg_count = 2;
		}
		if (me.onlineOptions.startScore === undefined) {
			me.onlineOptions.startScore = 501;
		}
		if (me.onlineOptions.sid === undefined) {
			me.onlineOptions.sid = '';
		}
		if (me.onlineOptions.cid === undefined) {
			me.onlineOptions.cid = '';
		}
		if (me.onlineOptions.filter === undefined) {
			me.onlineOptions.filter = false;
		}
		if (me.onlineOptions.ch === undefined) {
			me.onlineOptions.ch = 1;
		}
	};

	// スタッツデータ
	me.statsData = {
		score: 0,
		darts: 0
	};
	me.saveStatsData = function () {
		localStorage.setItem(me.optionPrefix + 'statsData', JSON.stringify(me.statsData));
	};
	me.restoreStatsData = function () {
		var str = localStorage.getItem(me.optionPrefix + 'statsData');
		if (str !== null) {
			me.statsData = JSON.parse(str);
		}
	};

	// セットデータ
	me.setData = null;
	me.initLegData = {
		first: 0,
		currentRound: 0,
		currentPlayer: 0,
		selectRound: 0,
		selectPlayer: 0,
		endFlag: 0,
		middleForDiddle: 0,
		winner: 0,

		playerData: [[
			{score: 0, left: 0}
		],
		[
			{score: 0, left: 0}
		]]
	};

	me.initSet = function () {
		me.setData = null;
		me.saveSetData();
		localStorage.setItem(me.optionPrefix + 'sendScoreData', null);
	};

	me.saveSetData = function () {
		localStorage.setItem(me.optionPrefix + 'setData', JSON.stringify(me.setData));
	};
	me.restoreSetData = function () {
		var str = localStorage.getItem(me.optionPrefix + 'setData');
		if (str !== null) {
			me.setData = JSON.parse(str);
		}
	};
	me.getSetData = function () {
		var str = localStorage.getItem(me.optionPrefix + 'setData');
		if (str !== null) {
			return JSON.parse(str);
		}
		return null;
	};

	// チャット設定
	me.chatOptions = {
		chatMsgCheckTime: 0,
	};
	me.saveChatOptions = function () {
		localStorage.setItem(me.optionPrefix + 'chatOptions', JSON.stringify(me.chatOptions));
	};
	me.restoreChatOptions = function () {
		var str = localStorage.getItem(me.optionPrefix + 'chatOptions');
		if (str !== null) {
			me.chatOptions = JSON.parse(str);
		}
	};

	// ウォッチリスト設定
	me.watchListOptions = {
		list: [],
	};
	me.saveWatchListOptions = function () {
		localStorage.setItem(me.generalPrefix + 'n01_watchList', JSON.stringify(me.watchListOptions));
	};
	me.restoreWatchListOptions = function () {
		var str = localStorage.getItem(me.generalPrefix + 'n01_watchList');
		if (str !== null) {
			me.watchListOptions = JSON.parse(str);
		}
	};

	return me;
})();
