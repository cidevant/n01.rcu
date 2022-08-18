import { WS_OUT_PREFIX } from './ws.reducer';
import { ws } from '../websocket/client';

export const wsMiddleware = (_store) => (next) => (action) => {
    // pass action forward (calling this changes store: nextState.store !== _store)
    const nextState = next(action);

    // send message
    if (action.type.startsWith(WS_OUT_PREFIX)) {
        ws.send({
            type: action.type.replace(WS_OUT_PREFIX, ''),
            payload: action.payload,
        });
    }

    // return state
    return nextState;
};
