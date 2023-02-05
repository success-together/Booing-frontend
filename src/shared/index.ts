import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';

import {combineReducers, createStore} from 'redux';
import {rootSlice} from './slices/rootSlice';
import {authentificationSlice} from './slices/Auth/AuthSlice';
import {DevicesSlice} from './slices/Devices/DevicesSlice';
import {fragmentationSlice} from './slices/Fragmentation/FragmentationSlice';
import {directoriesSlice} from './slices/Directories/DirectoriesSlice';
import {walletSlice} from './slices/wallet/walletSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  root: rootSlice.reducer,
  authentication: authentificationSlice.reducer,
  devices: DevicesSlice.reducer,
  fragmentation: fragmentationSlice.reducer,
  directories: directoriesSlice.reducer,
  wallet: walletSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);

export const BaseUrl = 'http://10.0.2.2:3001/booing';
// export const BaseUrl = 'https://booing-server.onrender.com/booing';

export const AXIOS_ERROR = 'AxiosError';
export const MAX_SIZE = 16000000; // 16mb
