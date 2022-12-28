import { WS_IN_PREFIX, WS_OUT_PREFIX } from '../utils/ws';
import { ACTIONS as CLIENT_ACTIONS } from './client.reducer';

export const ACTIONS = {
    // in
    SET_SCORE_LEFT: `${WS_IN_PREFIX}:SET_SCORE_LEFT`,
    GET_FINISH_DARTS: `${WS_IN_PREFIX}:GET_FINISH_DARTS`,

    // out
    SET_FINISH_DARTS: `${WS_OUT_PREFIX}:CLIENT:SET_FINISH_DARTS`,
    SET_INPUT_SCORE: `${WS_OUT_PREFIX}:CLIENT:SET_INPUT_SCORE`,
    EXIT_GAME: `${WS_OUT_PREFIX}:CLIENT:EXIT_GAME`,
    TOGGLE_STATS: `${WS_OUT_PREFIX}:CLIENT:TOGGLE_STATS`,
};

export function sendInputScore(payload) {
    return {
        type: ACTIONS.SET_INPUT_SCORE,
        payload,
    };
}

export function setFinishDarts(payload) {
    return {
        type: ACTIONS.SET_FINISH_DARTS,
        payload,
    };
}

export function exitGame(payload) {
    return {
        type: ACTIONS.EXIT_GAME,
        payload,
    };
}

export function toggleStats(payload) {
    return {
        type: ACTIONS.TOGGLE_STATS,
        payload,
    };
}

const initialState = {
    scoreLeft: null,
    finishDarts: null,
    lastScore: null,
};

export default function gameReducer(state, action) {
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {
        // Extract `scoreLeft` from initial data
        case CLIENT_ACTIONS.SET_DATA: {
            const data = action.payload['payload'];

            if (data?.activity === 'game') {
                const game = data?.game;
                const rounds = game?.leg?.playerData?.[game?.playerIndex];

                if (rounds?.length > 0) {
                    const { left } = rounds[rounds.length - 1];

                    if (left > 0) {
                        state = {
                            ...state,
                            scoreLeft: left,
                        };
                    }
                }
            }

            break;
        }
        case ACTIONS.MATCH_END:
            state = { ...initialState };
            break;
        case ACTIONS.SET_SCORE_LEFT:
            state = {
                ...state,
                scoreLeft: action.payload['payload'],
            };
            break;
        case ACTIONS.GET_FINISH_DARTS:
            state = {
                ...state,
                finishDarts: action.payload['payload'],
            };
            break;
        case ACTIONS.SET_FINISH_DARTS:
            state = {
                ...state,
                finishDarts: null,
            };
            break;
        case ACTIONS.SET_INPUT_SCORE:
            state = {
                ...state,
                lastScore: action.payload,
            };
            break;
    }

    return state;
}
