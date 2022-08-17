import { combineReducers } from 'redux';
import TwitterReducers from './TwitterReducers'


const RootReducer = combineReducers({
    twitter: TwitterReducers,
});

export default RootReducer;
