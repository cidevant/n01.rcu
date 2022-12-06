/*
 * n01_c_stats.js
 *
 * Copyright (C) 1996-2021 by Ohno Tomoaki. All rights reserved.
 */

/*eslint-env browser, jquery*/
/*globals n01_util n01_data*/
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
	},
	ja : {
		header_title : "Stats",
		button_cancel : "戻る",
		button_history : "スコア",

		limit_set_msg1 : "",
		limit_set_msg2 : " Set / ",
		limit_set_msg3 : " Leg先取",
		limit_set_msg4 : " Set先取",
		limit_set_msg5 : " Set",
		limit_leg_msg1 : "",
		limit_leg_msg2 : " Leg先取",
		best_of_msg1 : "Best of ",
		best_of_msg2 : " Leg",
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
		$('#button_history').text(res.button_history);
	}
});

$(function() {
	n01_data.restoreOptions();
	n01_data.restoreOnlineOptions();
	n01_data.restoreSetData();
	if (n01_data.setData === null) {
		window.location.href = '../';
		return;
	}
	if (n01_data.options.css !== undefined && n01_data.options.css !== '') {
		var link = $('<link>').attr({
			'rel': 'stylesheet',
			'href': n01_data.options.css + '.child.css?a=11'
		});
		$('head').append(link);
	}
	$('body')[0].style.setProperty('--color', $('#header').css('background-color'));
	$('#header').show();
	$('#article').show();
	init();
	resize();

	$(window).resize(function() {
		resize();
	});

	$(document).on('keydown', function(e) {
		if($('#modal-overlay')[0]) {
			return false;
		}
		if (e.key !== undefined) {
			switch (e.key) {
			case 'h':
				$('#button_history').click();
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
			case 72:	// h
				$('#button_history').click();
				break;
			case 27:	// ESC
				setTimeout(function() {
					$('#button_cancel').click();
				}, 100);
				break;
			}
		}
		return true;
	});

	$('#button_cancel').click(function() {
		window.parent.statsClose();
	});
	$('#button_history').click(function() {
		n01_data.saveSetData();
		window.location.href = 'c_score.html?a=7';
	});
	
	var tooltipTimer = null;
	$('.flag').on({
		'click': function() {
			clearTimeout(tooltipTimer);
			var top = $(this).offset().top + $(this).height();
			var left = $(this).offset().left;
			if ($(this).attr('player') === "1") {
				left += $(this).width();
			} else {
				left -= $(this).width();
			}
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
			var left = $(this).offset().left;
			if ($(this).attr('player') === "1") {
				left += $(this).width();
			} else {
				left -= $(this).width();
			}
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

function resize() {
	n01_util.headerResize();

	var windowSize = ($(window).width() < $(window).height()) ? $(window).width() : $(window).height();
	var titleFont = windowSize * 0.04;
	$('#title').css('font-size', titleFont + 'px');
	var titlePadding = windowSize * 0.01;
	$('#title').css('padding-bottom', titlePadding + 'px');

	if ($('#tr_sets').is(':visible')) {
		windowSize = ($(window).height() - $('#header_table').height()) / 1.35;
	} else {
		windowSize = ($(window).height() - $('#header_table').height()) / 1.25;
	}
	if (windowSize > $(window).width()) {
		windowSize = $(window).width();
	}

	var bodyFont = windowSize * 0.06;
	$('body').css('font-size', bodyFont + 'px');

	var marginTop = windowSize * 0.01;
	$('.title_table').css('margin-top', marginTop + 'px');

	var padding = windowSize * 0.015;
	$('.stats_table td').css('padding', padding + 'px 0');

	var width = windowSize * 1.8;
	if (width > $(window).width()) {
		width = $('#article').width();
		$('.name_table').css('width', '100%');
		$('.stats_table').css('width', '100%');
	} else {
		$('.name_table').css('width', width + 'px');
		$('.stats_table').css('width', width + 'px');
	}

	var centerWidth = windowSize * 0.4;
	$('td.center').css('width', centerWidth + 'px');
	$('td.left').css('width', ((width - centerWidth) / 2) + 'px');
	$('td.right').css('width', ((width - centerWidth) / 2) + 'px');
	if ($(window).height() > $(window).width()) {
		$('#p1_name').css('text-align', 'left');
		$('#p2_name').css('text-align', 'right');
		var nameCenterWidth = windowSize * 0.03;
		$('#p1_name').css('width', (width / 2 - nameCenterWidth) + 'px');
		$('#p2_name').css('width', (width / 2 - nameCenterWidth) + 'px');
		$('td.name_center').css('width', nameCenterWidth + 'px');
	} else {
		$('#p1_name').css('text-align', 'center');
		$('#p2_name').css('text-align', 'center');
		$('#p1_name').css('width', ((width - centerWidth) / 2) + 'px');
		$('#p2_name').css('width', ((width - centerWidth) / 2) + 'px');
		$('td.name_center').css('width', centerWidth + 'px');
	}

	var flagSize = windowSize * 0.06;
	$('.flag').css('width', flagSize + 'px');
	$('.flag').css('height', flagSize + 'px');
	var flagMargin = windowSize * 0.015;
	$('.flag').css('margin-left', flagMargin + 'px');

	$('.tw').css('height', (windowSize * 0.045) + 'px');
	$('.tw').css('margin-left', (windowSize * 0.015) + 'px');
	$('.tw').css('margin-bottom', (windowSize * 0.007) + 'px');
	$('.fb').css('height', (windowSize * 0.04) + 'px');
	$('.fb').css('margin-left', (windowSize * 0.015) + 'px');
	$('.fb').css('margin-bottom', (windowSize * 0.006) + 'px');
	$('.g').css('height', (windowSize * 0.045) + 'px');
	$('.g').css('margin-left', (windowSize * 0.015) + 'px');
	$('.g').css('margin-bottom', (windowSize * 0.006) + 'px');

	var subtitleFont = windowSize * 0.065;
	$('.subtitle').css('font-size', subtitleFont + 'px');
	var subtitlePadding = windowSize * 0.008;
	$('.subtitle').css('padding', subtitlePadding + 'px 0');

	$('#tooltip').css('font-size', (windowSize * 0.04) + 'px');
	$('#tooltip').css('padding', (windowSize * 0.01) + 'px');

	$('.modal_window').css('width', (windowSize * 0.9) + 'px');
}

function setStats(setData) {
	if (setData !== null) {
		n01_data.setData = setData;
		init();
	}
}

function init() {
	var t = '';
	if (n01_data.setData.scMode === 1) {
		if (n01_data.setData.exitResult === 1) {
			t = res.limit_set_msg1 + n01_data.setData.limitSet + res.limit_set_msg4;
		} else {
			t = n01_data.setData.limitSet + res.limit_set_msg5;
		}
	} else if (n01_data.setData.limitSet > 0) {
		t = res.limit_set_msg1 + n01_data.setData.limitSet + res.limit_set_msg2 + n01_data.setData.limitLeg + res.limit_set_msg3;
	} else if (n01_data.setData.limitLeg > 0) {
		if (n01_data.setData.drawMode === 1) {
			t = res.best_of_msg1 + (n01_data.setData.limitLeg - 1) * 2 + res.best_of_msg2;
		} else {
			t = res.limit_leg_msg1 + n01_data.setData.limitLeg + res.limit_leg_msg2;
		}
	}
	if (t !== '') {
		$('#header_title_detail').text('(' + t + ')');
	}
	$('#title').text(n01_data.setData.title);

	$('#p1_name').find('.name_text').text(n01_data.setData.statsData[0].name);
	if (n01_data.setData.statsData[0].country) {
		$('#p1_name').find('.flag').attr('src', 'image/flags/' + n01_data.setData.statsData[0].country + '.png');
		$('#p1_name').find('.flag').attr('cname', getCountryName(n01_data.setData.statsData[0].country));
		$('#p1_name').find('.flag').show();
	}
	if (n01_data.setData.statsData[0].sname) {
		$('#p1_name').find('.tw').attr('sname', n01_data.setData.statsData[0].sname);
		$('#p1_name').find('.tw').show();
	} else if (n01_data.setData.statsData[0].tid) {
		$('#p1_name').find('.tw').attr('sname', n01_data.setData.statsData[0].tid);
		$('#p1_name').find('.tw').show();
	}
	if (n01_data.setData.statsData[0].fid) {
		$('#p1_name').find('.fb').show();
	}
	if (n01_data.setData.statsData[0].gid) {
		$('#p1_name').find('.g').show();
	}
	$('#p2_name').find('.name_text').text(n01_data.setData.statsData[1].name);
	if (n01_data.setData.statsData[1].country) {
		$('#p2_name').find('.flag').attr('src', 'image/flags/' + n01_data.setData.statsData[1].country + '.png');
		$('#p2_name').find('.flag').attr('cname', getCountryName(n01_data.setData.statsData[1].country));
		$('#p2_name').find('.flag').show();
	}
	if (n01_data.setData.statsData[1].sname) {
		$('#p2_name').find('.tw').attr('sname', n01_data.setData.statsData[1].sname);
		$('#p2_name').find('.tw').show();
	} else if (n01_data.setData.statsData[1].tid) {
		$('#p2_name').find('.tw').attr('sname', n01_data.setData.statsData[1].tid);
		$('#p2_name').find('.tw').show();
	}
	if (n01_data.setData.statsData[1].fid) {
		$('#p2_name').find('.fb').show();
	}
	if (n01_data.setData.statsData[1].gid) {
		$('#p2_name').find('.g').show();
	}
	
	var statsTmplate = {
		winLegs: 0,
		ton00Count: 0,
		ton40Count: 0,
		ton80Count: 0,
		highOut: 0,
		bestLeg: 0,
		worstLeg: 0,
		allScore: 0,
		allDarts: 0,
		winDarts: 0,
		winCount: 0,
		first9Score: 0,
		first9Darts: 0
	};

	if (n01_data.setData.scid !== undefined && n01_data.setData.scid !== '') {
		$('#tr_sets').show();
		if (n01_data.setData.viewMode === 1) {
			$('#p1_sets').text(n01_data.onlineOptions.winSets[0]);
			$('#p2_sets').text(n01_data.onlineOptions.winSets[1]);
		} else {
			$('#p1_sets').text(n01_data.setData.statsData[0].winSets);
			$('#p2_sets').text(n01_data.setData.statsData[1].winSets);
		}
		$.ajax({
			url: n01_data.phpOnline + '?cmd=get_stats&sid=' + n01_data.onlineOptions.sid,
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify({scid: n01_data.setData.scid}),
			success: function(data) {
				showStats(data[0], data[1]);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				var stats1 = $.extend(true, {}, statsTmplate);
				calcPlayer(stats1, 0);
				var stats2 = $.extend(true, {}, statsTmplate);
				calcPlayer(stats2, 1);
				showStats(stats1, stats2);
			},
			complete: function(data) {
			}
		});
	} else {
		var stats1 = $.extend(true, {}, statsTmplate);
		calcPlayer(stats1, 0);
		var stats2 = $.extend(true, {}, statsTmplate);
		calcPlayer(stats2, 1);
		showStats(stats1, stats2);
	}
}

function showStats(stats1, stats2) {
	$('#p1_legs').text(stats1.winLegs);
	$('#p1_ton00').text(stats1.ton00Count);
	$('#p1_ton40').text(stats1.ton40Count);
	$('#p1_ton80').text(stats1.ton80Count);
	$('#p1_highout').text(stats1.highOut);
	$('#p1_best').text(stats1.bestLeg);
	$('#p1_worst').text(stats1.worstLeg);
	if (stats1.winCount > 0) {
		var p1darts = stats1.winDarts / stats1.winCount;
		$('#p1_darts').text(p1darts.toFixed(2));
	}
	if (stats1.allDarts > 0) {
		var p1score = stats1.allScore / stats1.allDarts;
		if (n01_data.options.avePPR === 1) {
			p1score *= 3;
		}
		$('#p1_score').text(p1score.toFixed(2));
	}
	if (stats1.first9Darts > 0) {
		var p1first9 = stats1.first9Score / stats1.first9Darts;
		if (n01_data.options.avePPR === 1) {
			p1first9 *= 3;
		}
		$('#p1_first9').text(p1first9.toFixed(2));
	}

	$('#p2_legs').text(stats2.winLegs);
	$('#p2_ton00').text(stats2.ton00Count);
	$('#p2_ton40').text(stats2.ton40Count);
	$('#p2_ton80').text(stats2.ton80Count);
	$('#p2_highout').text(stats2.highOut);
	$('#p2_best').text(stats2.bestLeg);
	$('#p2_worst').text(stats2.worstLeg);
	if (stats2.winCount > 0) {
		var p2darts = stats2.winDarts / stats2.winCount;
		$('#p2_darts').text(p2darts.toFixed(2));
	}
	if (stats2.allDarts > 0) {
		var p2score = stats2.allScore / stats2.allDarts;
		if (n01_data.options.avePPR === 1) {
			p2score *= 3;
		}
		$('#p2_score').text(p2score.toFixed(2));
	}
	if (stats2.first9Darts > 0) {
		var p2first9 = stats2.first9Score / stats2.first9Darts;
		if (n01_data.options.avePPR === 1) {
			p2first9 *= 3;
		}
		$('#p2_first9').text(p2first9.toFixed(2));
	}
}

function calcPlayer(stats, player) {
	for (var i = 0; i < n01_data.setData.legData.length; i++) {
		calcLeg(stats, player, n01_data.setData.legData[i]);
		if (n01_data.setData.legData[i].endFlag === 0) {
			break;
		}
	}
}

function calcLeg(stats, player, leg) {
	var round;
	if ((leg.first !== leg.currentPlayer && leg.currentPlayer === player) || leg.first === leg.currentPlayer) {
		round = leg.currentRound;
	} else {
		round = leg.currentRound + 1;
	}
	var first9Score = 0;
	var first9Darts = 0;
	for (var i = 1; i <= round; i++) {
		if (leg.playerData[player][i] === undefined) {
			round = i - 1;
			break;
		}
		var score = leg.playerData[player][i].score;
		if (score >=100 && score < 140) {
			stats.ton00Count++;
		}
		if (score >=140 && score < 180) {
			stats.ton40Count++;
		}
		if (score === 180) {
			stats.ton80Count++;
		}
		if (i <= 3) {
			first9Score += score;
			first9Darts += 3;
		}
	}
	if (leg.endFlag === 1 && leg.winner === player) {
		stats.winLegs++;
		if (leg.middleForDiddle === undefined || leg.middleForDiddle === 0) {
			var currentRound = leg.currentRound;
			if (leg.playerData[player][currentRound + 1] === undefined) {
				currentRound--;
			}
			var allScore = leg.playerData[player][0].left;
			var allDarts = currentRound * 3 + leg.playerData[player][currentRound + 1].score * -1;
			if (allDarts < 0) {
				return;
			}
			stats.allScore += allScore;
			stats.allDarts += allDarts;
			if (currentRound + 1 <= 3) {
				first9Score = allScore;
				first9Darts = allDarts;
			}
			var highOut = leg.playerData[player][currentRound].left;
			if (stats.highOut < highOut) {
				stats.highOut = highOut;
			}
			if (highOut >=100 && highOut < 140) {
				stats.ton00Count++;
			}
			if (highOut >=140 && highOut < 180) {
				stats.ton40Count++;
			}
			if (highOut === 180) {
				stats.ton80Count++;
			}
			if (stats.bestLeg === 0 || stats.bestLeg > allDarts) {
				stats.bestLeg = allDarts;
			}
			if (stats.worstLeg < allDarts) {
				stats.worstLeg = allDarts;
			}
			stats.winCount++;
			stats.winDarts += allDarts;
		} else {
			var allScore = leg.playerData[player][0].left - leg.playerData[player][round].left;
			var allDarts = round * 3;
			stats.allScore += allScore;
			stats.allDarts += allDarts;
			if (stats.bestLeg === 0 || stats.bestLeg > allDarts + 1) {
				stats.bestLeg = allDarts + 1;
			}
			if (stats.worstLeg < allDarts + 1) {
				stats.worstLeg = allDarts + 1;
			}
			stats.winCount++;
			stats.winDarts += allDarts + 1;
		}
	} else if (leg.playerData) {
		stats.allScore += leg.playerData[player][0].left - leg.playerData[player][round].left;
		stats.allDarts += round * 3;
	}
	stats.first9Score += first9Score;
	stats.first9Darts += first9Darts;
}
