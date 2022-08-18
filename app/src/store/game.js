import { WS_MSG_PREFIX } from '../websocket';

export const ACTIONS = {
    MATCH_START: `${WS_MSG_PREFIX}:MATCH_START`,
    MATCH_END: `${WS_MSG_PREFIX}:MATCH_END`,
    SET_SCORE_LEFT: `${WS_MSG_PREFIX}:SET_SCORE_LEFT`,
    GET_FINISH_DART: `${WS_MSG_PREFIX}:GET_FINISH_DART`,
    SET_FINISH_DART: 'SET_FINISH_DART',
    INPUT_SCORE: 'INPUT_SCORE',
};

export function setFinishDart(payload) {
    return {
        type: ACTIONS.SET_FINISH_DART,
        payload,
    };
}

export function inputScore(payload) {
    return {
        type: ACTIONS.INPUT_SCORE,
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
                lastScore: null,
            };
            break;
    }

    return state;
}
