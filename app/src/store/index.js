import { configureStore } from '@reduxjs/toolkit';

// middlewares
import { wsMiddleware } from './ws.middleware';
import { gameMiddleware } from './game.middleware';

// reducers
import ws from './ws.reducer';
import game from './game.reducer';
import client from './client.reducer';

// store
export const store = configureStore({
    reducer: {
        ws,
        game,
        client,
    },
    middleware: (defaultMiddleware) => defaultMiddleware().concat([wsMiddleware, gameMiddleware]),
});
export default store;
