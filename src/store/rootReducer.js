import {combineReducers} from 'redux';
import dashboardReducer from '../pages/dashboard/reducer';

const state = {};

const rootReducer = combineReducers({
    dashboardReducer: dashboardReducer
});

export default rootReducer;