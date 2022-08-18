import { configureStore } from '@reduxjs/toolkit';

import ws from './ws';
import game from './game';

const store = configureStore({
    reducer: {
        ws,
        game,
    },
});

export default store;
