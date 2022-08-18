/* eslint-disable default-case */
// reducers.js

import { SET_SOCKET_CONNECTION_STATE, SET_CLIENT_CONNECTION_STATE } from './actions';

const initialState = {
    socket: null,
    client: null,
    error: null,
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
    }

    return state;
}
