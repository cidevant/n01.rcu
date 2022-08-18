import { configureStore } from '@reduxjs/toolkit';

// reducers
import ws from './ws.reducer';
import game from './game.reducer';

// middlewares
import { wsMiddleware } from './ws.middleware';

// store
export const store = configureStore({
    reducer: {
        ws,
        game,
    },
    middleware: (defaultMiddleware) => defaultMiddleware().concat([wsMiddleware]),
});
export default store;
