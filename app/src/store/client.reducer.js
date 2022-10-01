import { WS_IN_PREFIX, WS_OUT_PREFIX } from '../utils/ws';

export const ACTIONS = {
    // in
    SET_DATA: `${WS_IN_PREFIX}:SET_DATA`,
    PAIRED: `${WS_IN_PREFIX}:PAIRED`,
    UNPAIRED: `${WS_IN_PREFIX}:UNPAIRED`,

    // out
    GET_DATA: `${WS_OUT_PREFIX}:CLIENT:GET_DATA`,
};

export function getData() {
    return {
        type: ACTIONS.GET_DATA,
    };
}

const initialState = {
    status: 'UNPAIRED',
    client: null,
    data: null,
};

export default function clientReducer(state, action) {
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {
        case ACTIONS.SET_DATA:
            state = {
                ...state,
                data: action.payload?.payload,
            };
            break;
        case ACTIONS.PAIRED:
            state = {
                ...state,
                status: 'PAIRED',
                client: action.payload?.payload,
            };
            break;
        case 'ws/onclose':
            state = {
                ...state,
                status: 'UNPAIRED',
                client: null,
            };
            break;
        case ACTIONS.UNPAIRED:
            state = { ...initialState };
            break;
    }

    return state;
}
