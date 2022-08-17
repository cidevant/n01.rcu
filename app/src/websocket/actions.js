export const SET_SCORE_LEFT = 'SET_SCORE_LEFT';
export const SET_MATCH = 'SET_MATCH';
export const SET_CLIENT_CONNECTION_STATE = 'SET_CLIENT_CONNECTION_STATE';
export const SET_SOCKET_CONNECTION_STATE = 'SET_SOCKET_CONNECTION_STATE';
export const GET_FINISH_DART = 'GET_FINISH_DART';
export const SET_FINISH_DART = 'SET_FINISH_DART';
export const MATCH_END = 'MATCH_END';

export function setSocketConnectionState(payload) {
    return {
        type: SET_SOCKET_CONNECTION_STATE,
        payload,
    };
}

export function setClientConnectionState(payload) {
    return {
        type: SET_CLIENT_CONNECTION_STATE,
        payload,
    };
}

export function setMatch(payload) {
    return {
        type: SET_MATCH,
        payload,
    };
}

export function setScoreLeft(payload) {
    return {
        type: SET_SCORE_LEFT,
        payload,
    };
}

export function getFinishDart() {
    return {
        type: GET_FINISH_DART,
    };
}

export function setFinishDart() {
    return {
        type: SET_FINISH_DART,
    };
}
export function matchEnd(payload) {
    return {
        type: MATCH_END,
        payload,
    };
}
