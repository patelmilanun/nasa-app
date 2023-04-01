import { combineReducers } from '@reduxjs/toolkit';
import { reducer as launchReducer } from 'slices/launch';

const rootReducer = combineReducers({
  launch: launchReducer,
});

export default rootReducer;
