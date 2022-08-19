import { WS_IN_PREFIX } from '../utils/ws';

const ACTIONS = {
    PAIRED: `${WS_IN_PREFIX}:PAIRED`,
    UNPAIRED: `${WS_IN_PREFIX}:UNPAIRED`,
};

const initialState = {
    status: 'UNPAIRED',
    client: null,
};

export default function clientReducer(state, action) {
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch (action.type) {
        case ACTIONS.PAIRED:
            state = {
                ...state,
                status: 'PAIRED',
                client: action.payload,
            };
            break;
        case ACTIONS.UNPAIRED:
            state = { ...initialState };
            break;
    }

    return state;
}
