import { SET_MATCH, MATCH_END, SET_SCORE_LEFT } from './actions';

const initialState = {
    match: null,
    scoreLeft: 0,
};

export default function matchReducer(state, action) {
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {
        case SET_MATCH:
            state.match = action.payload;
            break;
        case MATCH_END:
            state.match = null;
            state.scoreLeft = 0;
            break;
        case SET_SCORE_LEFT:
            state.scoreLeft = action.payload;
            break;
    }

    return state;
}
