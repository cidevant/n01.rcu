import { configureStore } from '@reduxjs/toolkit';

import ws from './ws';

const store = configureStore({
    reducer: {
        ws,
    },
});

export default store;
