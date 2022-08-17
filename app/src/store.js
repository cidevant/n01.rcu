import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import matchReducer from './redux/match/reducer';
import websocketReducer from './redux/websocket/reducer';

export default createStore(
    combineReducers({
        websocket: websocketReducer,
        match: matchReducer,
    }),
    composeWithDevTools(applyMiddleware(thunk))
);
