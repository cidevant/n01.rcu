import { WS_IN_PREFIX, WS_OUT_PREFIX } from '../websocket';

export const ACTIONS = {
    MATCH_START: `${WS_IN_PREFIX}MATCH_START`,
    MATCH_END: `${WS_IN_PREFIX}MATCH_END`,
    SET_SCORE_LEFT: `${WS_IN_PREFIX}SET_SCORE_LEFT`,
    GET_FINISH_DART: `${WS_IN_PREFIX}GET_FINISH_DART`,
    SET_FINISH_DART: `${WS_OUT_PREFIX}SET_FINISH_DART`,
    INPUT_SCORE: `${WS_OUT_PREFIX}INPUT_SCORE`,
};

export function sendInputScore(payload) {
    return {
        type: ACTIONS.INPUT_SCORE,
        payload,
    };
}

export function sendFinishDart(payload) {
    return {
        type: ACTIONS.SET_FINISH_DART,
        payload,
    };
}

const initialState = {
    match: null,
    scoreLeft: null,
    finishDart: null,
    lastScore: null,
};

export default function gameReducer(state, action) {
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {
        case ACTIONS.MATCH_START:
            state = {
                ...state,
                match: action.payload,
            };
            break;
        case ACTIONS.MATCH_END:
            state = {
                ...state,
                match: null,
                scoreLeft: null,
                finishDart: null,
            };
            break;
        case ACTIONS.SET_SCORE_LEFT:
            state = {
                ...state,
                scoreLeft: action.payload,
            };
            break;
        case ACTIONS.GET_FINISH_DART:
            state = {
                ...state,
                finishDart: action.payload,
            };
            break;
        case ACTIONS.SET_FINISH_DART:
            state = {
                ...state,
                finishDart: null,
            };
            break;
        case ACTIONS.INPUT_SCORE:
            state = {
                ...state,
                lastScore: action.payload,
            };
            break;
    }

    return state;
}
