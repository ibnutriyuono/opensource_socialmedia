import {combineReducers} from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducers';

export default combineReducers({
    auth: authReducer,
    errors: errorReducer
});