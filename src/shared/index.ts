import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'

import { combineReducers, createStore } from 'redux'
import storage from 'redux-persist/lib/storage' 
import { rootSlice } from './slices/rootSlice';
import { authentificationSlice } from './slices/Auth/AuthSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const rootReducer = combineReducers({
  root: rootSlice.reducer,
  authentication: authentificationSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer)
export const persistor = persistStore(store)
export const BaseUrl = "https://booing-app.onrender.com/booing";