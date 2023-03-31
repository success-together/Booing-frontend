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
// 
// export const BaseUrl = 'http://10.0.2.2:3001/booing';
// export const FilesUrl = 'http://10.0.2.2:3001/files';
export const FilesUrl = 'https://booing-server.onrender.com/files';
export const BaseUrl = 'https://booing-server.onrender.com/booing';

export const AXIOS_ERROR = 'AxiosError';
export const MAX_SIZE = 26000000; // 16mb


// from backend (needs to be sync with backend)
export const types = {
  document: (type: string) => {
    const arr = [
      'text/csv',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/html',
      'text/calendar',
      'text/javascript',
      'application/json',
      'application/ld+json',
      'text/javascript',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.text',
      'application/pdf',
      'application/x-httpd-php',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/rtf',
      'application/x-sh',
      'text/plain',
      'application/xhtml+xml',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/xml',
      'application/vnd.mozilla.xul+xml',
    ];

    return arr.includes(type) || arr.find(e => e.includes(type));
  },
  apk: (type: string) => type === 'application/vnd.android.package-archive',
  video: (type: string) => type?.startsWith('video/'),
  audio: (type: string) => type?.startsWith('audio/'),
  image: (type: string) => type?.startsWith('image/'),
  download(type: string) {
    return (
      !this.document(type) &&
      !this.apk(type) &&
      !this.video(type) &&
      !this.audio(type) &&
      !this.image(type)
    );
  },
};
