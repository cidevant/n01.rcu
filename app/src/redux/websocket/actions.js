export const SET_CLIENT_CONNECTION_STATE = 'SET_CLIENT_CONNECTION_STATE';
export const SET_SOCKET_CONNECTION_STATE = 'SET_SOCKET_CONNECTION_STATE';

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
