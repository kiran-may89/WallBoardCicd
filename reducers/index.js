import {combineReducers} from 'redux';
import user from './user';
import language from './language';

const rootReducer = () =>
  combineReducers({
    user,
    language,
  });

export default rootReducer;
