/* eslint-disable default-case */
// reducers.js

import {
    SET_SOCKET_CONNECTION_STATE,
    SET_CLIENT_CONNECTION_STATE,
    SET_MATCH,
    MATCH_END,
    SET_SCORE_LEFT,
} from './actions';

const initialState = {
    match: null,
    scoreLeft: 0,
    connection: {
        socket: null,
        client: null,
    },
};

export default function websocketReducer(state, action) {
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {
        case SET_SOCKET_CONNECTION_STATE:
            state.connection.socket = action.payload;
            break;
        case SET_CLIENT_CONNECTION_STATE:
            state.connection.client = action.payload;
            break;
        case SET_MATCH:
            state.match = action.payload;
            break;
        case MATCH_END:
            state.match = null;
            break;
        case SET_SCORE_LEFT:
            state.scoreLeft = action.payload;
            break;
    }

    return state;
}
