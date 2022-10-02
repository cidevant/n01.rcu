/*
 * n01_pstats.js
 *
 * Copyright (C) 1996-2017 by Ohno Tomoaki. All rights reserved.
 */

/*eslint-env browser, jquery*/
/*globals n01_data n01_util*/

var allTicks = [];
var gdata = [];
var statList = [];
var statMap = {};

var select_type = 2;
var resources = {
	en : {
		no_data_msg : "No data.",
	},
	ja : {
		button_cancel : "戻る",
		button_history : "履歴",

		td_select_year : "年",
		td_select_month : "月",
		td_select_day : "日",

		no_data_msg : "データがありません。",
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
		$('#button_cancel').text(res.button_cancel);
		$('#button_history').text(res.button_history);

		$('#td_select_year').text(res.td_select_year);
		$('#td_select_month').text(res.td_select_month);
		$('#td_select_day').text(res.td_select_day);
	}
});

$(function() {
	// Optionの読み込み
	n01_data.restoreOptions();
	n01_data.restoreOnlineOptions();
	resize();
	
	getStatsList();

	$(window).resize(function() {
		resize();
	});

	$('#button_cancel').click(function() {
		// 戻る
		window.history.back(-1);
	});

	$('#button_history').click(function() {
		n01_data.options.liveReturnUrl = '';
		n01_data.saveOptions();

		var param = getUrlParam();
		var tid = n01_data.onlineOptions.tid;
		var fid = n01_data.onlineOptions.fid;
		var gid = n01_data.onlineOptions.gid;
		if (param.name) {
			var str = param.name.replace(/\"/g, '""');
			window.location.href = '../../live/history/?name=' + encodeURIComponent('"' + str + '"');
		} else if (tid) {
			window.location.href = '../history/?tid=' + encodeURIComponent(tid);
		} else if (fid) {
			window.location.href = '../history/?fid=' + encodeURIComponent(fid);
		} else if (gid) {
			window.location.href = '../history/?gid=' + encodeURIComponent(gid);
		} else {
			var str = $('#header_title').text().replace(/\"/g, '""');
			window.location.href = '../history/?keyword=' + encodeURIComponent('"' + str + '"');
		}
	});

	$('#td_select_year').click(function() {
		select_type = 0;
		createStatsList(statList);
		$('#td_select_year').addClass("td_select");
		$('#td_select_month').removeClass("td_select");
		$('#td_select_day').removeClass("td_select");
	});
	$('#td_select_month').click(function() {
		select_type = 1;
		createStatsList(statList);
		$('#td_select_year').removeClass("td_select");
		$('#td_select_month').addClass("td_select");
		$('#td_select_day').removeClass("td_select");
	});
	$('#td_select_day').click(function() {
		select_type = 2;
		createStatsList(statList);
		$('#td_select_year').removeClass("td_select");
		$('#td_select_month').removeClass("td_select");
		$('#td_select_day').addClass("td_select");
	});
	
	var param = getUrlParam();
	if (param.mode !== undefined) {
		switch (param.mode) {
		case '0':
			$('#td_select_year').click();
			break;
		case '1':
			$('#td_select_month').click();
			break;
		case '2':
			$('#td_select_day').click();
			break;
		}
	}
	
	$("#graph").bind("plothover", function (event, pos, item) {
		if (item && item.datapoint[0] > 0) {
			var x = allTicks[item.datapoint[0] - 1][1];
			$("#tooltip").html(x + " - " + item.datapoint[1].toFixed(2))
				.css({top: item.pageY+5, left: item.pageX+5})
				.fadeIn(200);
		} else {
			$("#tooltip").hide();
		}
	});
	
	$('.stats_list_item').click(function() {
		statsWindowOpen(this);
	});
});

function resize() {
	n01_util.headerResize();

	var windowSize = ($(window).width() < $(window).height()) ? $(window).width() : ($(window).height() * 0.8);

	var bodyFont = windowSize * 0.06;
	$('body').css('font-size', bodyFont + 'px');

	// モーダルウィンドウ
	var modalWidth = windowSize * 0.9;
	$('.modal_window').css('width', modalWidth + 'px');
	var modalFont = windowSize * 0.06;
	$('.modal_window').css('font-size', modalFont + 'px');

	$('#entry_list_window').css('width', '80%');
	$('.stats_title').css('padding', (windowSize * 0.02) + 'px ' + (windowSize * 0.02) + 'px');
	$('.stats_data').css('padding', (windowSize * 0.02) + 'px ' + (windowSize * 0.02) + 'px');
	$('.stats_table').css('font-size', (windowSize * 0.04) + 'px');
	$('#stats_container').css('height', (windowSize * 0.9) + 'px');
	$('#stats_container').css('padding-top', (windowSize * 0.04) + 'px');
	
	$('#select_table').css('margin-top', (windowSize * 0.03) + 'px');
	$('#select_table').css('margin-bottom', (windowSize * 0.03) + 'px');
	$('#select_table td').css('padding', (windowSize * 0.02) + 'px');

	$('.stats_list_table').css('margin-top', (windowSize * 0.03) + 'px');
	$('.stats_list_table td').css('padding', (windowSize * 0.05) + 'px 0');
	$('.date').css('padding-left', (windowSize * 0.03) + 'px');
	$('#title_date').css('padding-left', (windowSize * 0.03) + 'px');

	$('.set_win_detail').css('font-size', (windowSize * 0.04) + 'px');
	$('.leg_win_detail').css('font-size', (windowSize * 0.04) + 'px');

	$('#message').css('padding', (windowSize * 0.05) + 'px 0');
	$('#message').css('padding-left', (windowSize * 0.03) + 'px');
	$('#message').css('padding-right', (windowSize * 0.03) + 'px');

	$('#tooltip').css('font-size', (windowSize * 0.03) + 'px');
	$('#tooltip').css('padding', (windowSize * 0.01) + 'px');
	$("#tooltip").hide();

	$('.tw').css('height', (windowSize * 0.06) + 'px');
	$('.tw').css('margin-top', (windowSize * 0.005) + 'px');
	$('.tw').css('margin-left', (windowSize * 0.02) + 'px');
	$('.fb').css('height', (windowSize * 0.05) + 'px');
	$('.fb').css('margin-top', (windowSize * 0.005) + 'px');
	$('.fb').css('margin-left', (windowSize * 0.02) + 'px');
	$('.g').css('height', (windowSize * 0.06) + 'px');
	$('.g').css('margin-top', (windowSize * 0.005) + 'px');
	$('.g').css('margin-left', (windowSize * 0.02) + 'px');

	showGraph();
	centeringObject($('#stats_window'));
}

function strWidth(str) {
	var e = $("#ruler");
	var width = e.text(str).get(0).offsetWidth;
	e.empty();
	return width;
}

function showGraph() {
	var windowSize = ($(window).width() < $(window).height()) ? $(window).width() : ($(window).height() * 0.8);

	if (gdata.length > 0) {
		var scroll = true;
		var width = windowSize * 0.05 * gdata.length;
		if (width < $(window).width() * 0.95) {
			width = $(window).width() * 0.95;
			scroll = false;
			$('#graph_area').css('overflow-x', 'hidden');
		} else {
			$('#graph_area').css('overflow-x', 'auto');
		}
		$('#graph').css('width', width + 'px');
		$('#graph').css('height', (windowSize * 0.5) + 'px');
		$('#graph_area').css('height', (windowSize * 0.54) + 'px');

		$('#ruler').css('font-size', (windowSize * 0.03) + 'px');
		var fontMargin = (scroll) ? windowSize * 0.03 : windowSize * 0.08;
		var step = Math.round(allTicks.length / (width / (strWidth('8888/88/88') + fontMargin)));
		if (step <= 0) {
			step = 1;
		}
		var ticks = [];
		for (var i = 0; i < allTicks.length; i++) {
			if (i % step === 0) {
				ticks.push(allTicks[i]);
			}
		}

		var max = null;
		var min = null;
		for (var i = 0; i < gdata.length; i++) {
			if (max === null || max < gdata[i][1]) {
				max = gdata[i][1];
			}
			if (min === null || min > gdata[i][1]) {
				min = gdata[i][1];
			}
		}
		var yMargin = (max - min) * 0.1;
		if (yMargin === 0) {
			yMargin = 1;
		}
		var options = {
			series: {
				lines: {show: true, fill: true, fillColor: {colors: ["rgba(104,164,255,0.0)", "rgba(104,164,255,0.7)"]}, lineWidth: windowSize * 0.004, },
				shadowSize: 0,
			},
			xaxis: {
				show: true,
				ticks: ticks,
			},
			yaxis: {
				position: "right",
				max: max + yMargin,
                		min: min - yMargin,
			},
			grid: {
				backgroundColor: {colors: ["#071939", "#2a4061"]},
				borderWidth: 0,
				hoverable: true,
			},
		};
		$.plot("#graph", [{data: gdata, color: "#ffffff"},], options);

		$('.tickLabel').css('font-size', (windowSize * 0.03) + 'px');
		if (scroll) {
			$("#graph_area").scrollLeft($("#graph_area")[0].scrollWidth);
		}
	} else {
		$('#graph').css('height', '0px');
		$('#graph_area').css('height', '0px');
	}
}

function getUrlParam() {
	var arg = new Object;
	var pair = location.search.substring(1).split('&');
	for(var i = 0; pair[i]; i++) {
		var kv = pair[i].split('=');
		arg[kv[0]] = decodeURIComponent(kv[1]);
	}
	return arg;
}

function getStatsList() {
	var param = getUrlParam();
	
	var url;
	var tid = n01_data.onlineOptions.tid;
	var fid = n01_data.onlineOptions.fid;
	var gid = n01_data.onlineOptions.gid;
	if (param.name !== undefined && param.name !== null && param.name !== '') {
		$('#header_title').text(param.name);
		url = n01_data.phpSite + 'n01_stats.php?cmd=stats_list&name=' + encodeURIComponent(param.name);
	} else if (tid) {
		$('#header_title').text(n01_data.onlineOptions.tname);
		$('#header_title').append('<img src="../twitter/Twitter_Logo_Blue.png" class="tw" />');
		url = n01_data.phpSite + 'n01_stats.php?cmd=stats_list&tid=' + encodeURIComponent(tid);
	} else if (fid) {
		$('#header_title').text(n01_data.onlineOptions.fname);
		$('#header_title').append('<img src="../facebook/f_logo_RGB-Blue_114.png" class="fb" />');
		url = n01_data.phpSite + 'n01_stats.php?cmd=stats_list&fid=' + encodeURIComponent(fid);
	} else if (gid) {
		$('#header_title').text(n01_data.onlineOptions.gname);
		$('#header_title').append('<img src="../google/google_logo.png" class="g" />');
		url = n01_data.phpSite + 'n01_stats.php?cmd=stats_list&gid=' + encodeURIComponent(gid);
	} else {
		var name = n01_data.onlineOptions.playerName;
		if (name === undefined || name === null || name === '') {
			statList = [];
			createStatsList(statList);
			return;
		}
		$('#header_title').text(name);
		url = n01_data.phpSite + 'n01_stats.php?cmd=stats_list&name=' + encodeURIComponent(name);
	}
	$.ajax({
		url: url,
		type: 'POST',
		success: function(data) {
			statList = data;
			statList.sort(
				function(a, b){
					if (a.time !== b.time) {
						return (a.time < b.time) ? -1 : 1;
					}
					return 0;
				}
			);
			createStatsList(statList);
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert('Error\n\n' + XMLHttpRequest.status + ' ' + errorThrown);
		},
		complete: function(data) {
		}
	});
}

function toLocaleStringYear(datetime)
{
	var date = new Date(datetime * 1000);
	return date.getFullYear();
}


function toLocaleStringMonth(datetime)
{
	var date = new Date(datetime * 1000);
	return [
		date.getFullYear(),
		date.getMonth() + 1
		].join('/');
}

function toLocaleStringDay(datetime)
{
	return n01_date_format.formatDate(new Date(datetime * 1000), navigator.language);
}

function createStatsList(data) {
	statMap = {};
	for (var i = 0; i < data.length; i++) {
		var dateStr = "";
		switch (select_type) {
		case 0:
			dateStr = toLocaleStringYear(data[i].time);
			break;
		case 1:
			dateStr = toLocaleStringMonth(data[i].time);
			break;
		case 2:
			dateStr = toLocaleStringDay(data[i].time);
			break;
		}
		var setWin = (data[i].win * 2 > data[i].leg) ? 1 : 0;
		if (statMap[dateStr] === undefined) {
			statMap[dateStr] = [data[i].score, data[i].darts, data[i].win, data[i].leg, setWin, 1,
				data[i].t00, data[i].t40, data[i].t80, data[i].ho, data[i].bst, data[i].wst, data[i].wd, data[i].f9s, data[i].f9d, ];
		} else {
			var st = statMap[dateStr];
			statMap[dateStr] = [st[0] + data[i].score, st[1] + data[i].darts, st[2] + data[i].win, st[3] + data[i].leg, st[4] + setWin, st[5] + 1,
				st[6] + data[i].t00, st[7] + data[i].t40, st[8] + data[i].t80,
				(st[9] < data[i].ho) ? data[i].ho : st[9], ((st[10] > data[i].bst || st[10] <= 0) && data[i].bst > 0) ? data[i].bst : st[10], (st[11] < data[i].wst) ? data[i].wst : st[11],
				st[12] + data[i].wd, st[13] + data[i].f9s, st[14] + data[i].f9d, ];
		}
	}
	var j = 1;
	gdata = [];
	allTicks = [];
	for (var dateStr in statMap) {
		var st = statMap[dateStr];
		if (st[1] !== 0) {
			allTicks.push([j, dateStr]);
			var ave = st[0] / st[1];
			if (n01_data.options.avePPR === 1) {
				ave *= 3;
			}
			gdata.push([j, ave]);
			j++;
		}
	}
	createDetailList(data, statMap);
	resize();
}

function createDetailList(data, map) {
	$('#user_body').empty();
	$('#message').text('');
	$('#message').hide();

	if (data.length === 0) {
		$('#message').text(res.no_data_msg);
		$('#message').show();
	} else {
		for (var dateStr in map) {
			var st = map[dateStr];
			if (st[1] !== 0) {
				var objTitle = $('#stats_list_item').clone(true).prependTo('#user_body');
				objTitle.attr('id', '');
				objTitle.attr('key', dateStr);
				objTitle.find('.date').text(dateStr);
				var ave = st[0] / st[1];
				if (n01_data.options.avePPR === 1) {
					ave *= 3;
				}
				objTitle.find('.stats').text(ave.toFixed(2));

				objTitle.find('.set_win_per').text(((st[4] / st[5]) * 100).toFixed(0) + "%");
				objTitle.find('.set_win_detail').text("(" + st[4] + "/" + st[5] + ")");

				objTitle.find('.leg_win_per').text(((st[2] / st[3]) * 100).toFixed(0) + "%");
				objTitle.find('.leg_win_detail').text("(" + st[2] + "/" + st[3] + ")");
			}
		}
	}
}

// センタリング
function centeringObject(obj) {
	var w = $(window).width();
	var h = $(window).height();
	var cw = obj.width();
	var ch = obj.height();
	obj.css({"left": ((w - cw) / 2) + "px", "top": ((h - ch) / 2) + "px"});
}

function cretateStats(key) {
	var st = statMap[key];
	var item;
	
	item = $('#stats_item_template').clone(true).appendTo('#stats_body');
	item.attr('id', '');
	item.find('.stats_title').text('Date');
	item.find('.stats_data').text(key);

	item = $('#stats_item_template').clone(true).appendTo('#stats_body');
	item.attr('id', '');
	item.find('.stats_title').text('Set');
	item.find('.stats_data').text(((st[4] / st[5]) * 100).toFixed(0) + "% (" + st[4] + "/" + st[5] + ")");

	item = $('#stats_item_template').clone(true).appendTo('#stats_body');
	item.attr('id', '');
	item.find('.stats_title').text('Leg');
	item.find('.stats_data').text(((st[2] / st[3]) * 100).toFixed(0) + "% (" + st[2] + "/" + st[3] + ")");

	item = $('#stats_item_template').clone(true).appendTo('#stats_body');
	item.attr('id', '');
	item.find('.stats_title').text('100+');
	item.find('.stats_data').text(st[6]);

	item = $('#stats_item_template').clone(true).appendTo('#stats_body');
	item.attr('id', '');
	item.find('.stats_title').text('140+');
	item.find('.stats_data').text(st[7]);

	item = $('#stats_item_template').clone(true).appendTo('#stats_body');
	item.attr('id', '');
	item.find('.stats_title').text("180's");
	item.find('.stats_data').text(st[8]);

	item = $('#stats_item_template').clone(true).appendTo('#stats_body');
	item.attr('id', '');
	item.find('.stats_title').text('High Finish');
	item.find('.stats_data').text(st[9]);

	item = $('#stats_item_template').clone(true).appendTo('#stats_body');
	item.attr('id', '');
	item.find('.stats_title').text('Best Leg');
	item.find('.stats_data').text(st[10]);

	item = $('#stats_item_template').clone(true).appendTo('#stats_body');
	item.attr('id', '');
	item.find('.stats_title').text('Worst Leg');
	item.find('.stats_data').text(st[11]);

	item = $('#stats_item_template').clone(true).appendTo('#stats_body');
	item.attr('id', '');
	var ave = 0;
	if (st[1] > 0) {
		ave = st[0] / st[1];
		if (n01_data.options.avePPR === 1) {
			ave *= 3;
		}
	}
	item.find('.stats_title').text('Score');
	item.find('.stats_data').text(ave.toFixed(2));
	
	item = $('#stats_item_template').clone(true).appendTo('#stats_body');
	item.attr('id', '');
	ave = 0;
	if (st[14] > 0) {
		ave = st[13] / st[14];
		if (n01_data.options.avePPR === 1) {
			ave *= 3;
		}
	}
	item.find('.stats_title').text('First 9');
	item.find('.stats_data').text(ave.toFixed(2));
}

function statsWindowOpen(elm) {
	if($('#modal-overlay')[0]) {
		return;
	}
	
	$('#stats_body').empty();
	cretateStats($(elm).attr('key'));

	var backScrollTop = $(window).scrollTop();
	var backScrollLeft = $(window).scrollLeft();
	$('#article').css({'position': 'fixed', 'top': -backScrollTop, 'left': -backScrollLeft, 'width': '97%'});
	$('body').append('<div id="modal-overlay"></div>');
	$('#modal-overlay').show();
	centeringObject($('#stats_window'));
	$('#stats_window').show();

	function statsWindowClose() {
		$('#stats_window').hide();
		$('#modal-overlay').remove();
		$('#article').css({'position': '', 'top':0, 'left':0, 'width': 'auto'});
		$('html,body').scrollTop(backScrollTop);
		$('html,body').scrollLeft(backScrollLeft);
	}

	$('#modal-overlay').unbind().click(function() {
		statsWindowClose();
		return false;
	});
}
