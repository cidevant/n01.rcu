import { ws, WS_OUT_PREFIX } from '../utils/ws';

export const gameMiddleware = (_store) => (next) => (action) => {
    // if (action.type.startsWith('')) {

    // }

    return next(action);
};
