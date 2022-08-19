import { ws, WS_OUT_PREFIX } from '../utils/ws';

export const wsMiddleware = (_store) => (next) => (action) => {
    if (action.type.startsWith(`${WS_OUT_PREFIX}:`)) {
        ws.send({
            type: action.type.replace(`${WS_OUT_PREFIX}:`, ''),
            payload: action.payload,
        });
    }

    return next(action);
};
