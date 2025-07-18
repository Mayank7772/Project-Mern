import { configureStore } from '@reduxjs/toolkit'
import  userReducer from './user/userSlice.js'
import {persistStore, persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux';

const rootReducer = combineReducers({ user : userReducer });

const persistConfig = {
    key : 'roor',
    storage , 
    version: 1
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer ,
  middleware : (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
    }),
});


export const persistor = persistStore(store);