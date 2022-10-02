import _ from 'lodash';
import moment from 'moment';

export const DAY_FORMAT = 'DD/MM/YYYY';

export function getDayStats(data, time) {
    const stats = data?.filter((game) => {
        const start = new Date(time);
        const end = new Date(time);
        const gameTime = game.time * 1000;

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return gameTime >= start.getTime() && gameTime <= end.getTime();
    });

    if (_.isArray(stats) && !_.isEmpty(stats)) {
        const dayStats = stats.reduce(
            (acc, game) => {
                acc.highFinish = Math.max(acc.highFinish, game.ho);
                acc.bestLeg = Math.min(acc.bestLeg, game.bst);
                acc.worstLeg = Math.max(acc.worstLeg, game.wst);
                acc.sets.win += Math.round(game.leg / 2) >= game.win;
                acc.sets.total += 1;
                acc.legs.win += game.win;
                acc.legs.total += game.leg;

                acc['100'] += game.t00;
                acc['140'] += game.t40;
                acc['180'] += game.t80;

                acc.score += game.score;
                acc.darts += game.darts;
                acc.first9Score += game.f9s;
                acc.first9Darts += game.f9d;

                return acc;
            },
            {
                date: Date.now(),
                sets: {
                    win: 0,
                    total: 0,
                },
                legs: {
                    win: 0,
                    total: 0,
                },
                100: 0,
                140: 0,
                180: 0,
                highFinish: 0,
                bestLeg: 0,
                worstLeg: 0,
                score: 0,
                darts: 0,
                first9Score: 0,
                first9Darts: 0,
                average: {
                    score: 0,
                    first9: 0,
                },
            }
        );

        dayStats.average.score = getAverage(dayStats.score, dayStats.darts);
        dayStats.average.first9 = getAverage(dayStats.first9Score, dayStats.first9Darts);

        return dayStats;
    }

    return null;
}

export function getAverage(score, darts) {
    return (score / darts) * 3;
}

export function getDays(data) {
    if (!_.isArray(data) || _.isEmpty(data)) {
        return [];
    }

    const days = {};

    data.forEach((game) => {
        const day = moment(game.time * 1000).format(DAY_FORMAT);

        days[day] = true;
    });

    return Object.keys(days);
}
export function dayToTimestamp(formattedDay) {
    return moment(formattedDay, DAY_FORMAT).valueOf();
}
