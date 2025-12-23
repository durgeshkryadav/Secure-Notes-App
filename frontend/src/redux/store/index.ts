import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from '../slices/auth.slice';
import notesSlice from '../slices/notes.slice';

const rootReducer = combineReducers({
  auth: authSlice,
  notes: notesSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
