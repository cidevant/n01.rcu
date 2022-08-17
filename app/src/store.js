import { createStore, applyMiddleware } from 'redux';
import websocketReducer from './websocket/reducer';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

export default createStore(websocketReducer, composeWithDevTools(applyMiddleware(thunk)));
