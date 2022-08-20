import { WS_IN_PREFIX, WS_OUT_PREFIX } from '../utils/ws';

const ACTIONS = {
    MATCH_START: `${WS_IN_PREFIX}:MATCH_START`,
    MATCH_END: `${WS_IN_PREFIX}:MATCH_END`,
    SET_SCORE_LEFT: `${WS_IN_PREFIX}:SET_SCORE_LEFT`,
    GET_FINISH_DARTS: `${WS_IN_PREFIX}:GET_FINISH_DARTS`,
    SET_FINISH_DARTS: `${WS_OUT_PREFIX}:CLIENT:SET_FINISH_DARTS`,
    SET_INPUT_SCORE: `${WS_OUT_PREFIX}:CLIENT:SET_INPUT_SCORE`,
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

const initialState = {
    match: null,
    scoreLeft: null,
    finishDarts: null,
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
                match: action.payload['payload'],
            };
            break;
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
