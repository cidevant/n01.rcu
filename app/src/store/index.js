import { configureStore } from '@reduxjs/toolkit';

// middlewares
import { wsMiddleware } from './ws.middleware';

// reducers
import ws from './ws.reducer';
import game from './game.reducer';

// store
export const store = configureStore({
    reducer: {
        ws,
        game,
    },
    middleware: (defaultMiddleware) => defaultMiddleware().concat([wsMiddleware]),
});
export default store;
