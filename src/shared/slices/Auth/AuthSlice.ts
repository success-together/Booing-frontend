import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {User} from '../../../models/User';

export const AuthentificationInitialState = {
  loggedInUser: undefined,
  isLoggedIn: false,
  profile: {},
  errorMessage: '',
  userId: undefined,
  token: '',
  lastFetchTime: 0,
  filesList: [],
  storage: {
    media: 0,
    cache: 0
  }
};

export const authentificationSlice = createSlice({
  name: 'authentification',
  initialState: AuthentificationInitialState,
  reducers: {
    setLoggedInUser: (
      state: {
        isLoggedIn: boolean;
        loggedInUser: User | undefined;
        userId?: string;
      },
      action: PayloadAction<any>,
    ) => {
      state.isLoggedIn = true;
      state.loggedInUser = action.payload?.user;
      state.userId = action.payload.user?._id;
    },
    setToken: (
      state: {
        token: string;
      },
      action: PayloadAction<any>,
    ) => {
      state.token = action.payload;
    },
    setStorage: (
      state: {
        storage: any;
      },
      action: PayloadAction<any>,
    ) => {
      console.log('storage', action.payload)
      state.storage = {...state.storage, ...action.payload};
    },
    setLastFetchTime: (
      state: {
        lastFetchTime: any;
      },
      action: PayloadAction<any>,
    ) => {
      console.log('lastFetchTime', action.payload)
      state.lastFetchTime = action.payload;
    },
    setFilesList: (
      state: {
        filesList: any;
      },
      action: PayloadAction<any>,
    ) => {
      console.log('filesList', action.payload)
      state.filesList = action.payload;
    },
    saveUserAvatar: (
      state: {
        loggedInUser: User | undefined;
      },
      action: PayloadAction<any>,
    ) => {
      state.loggedInUser = {...state.loggedInUser, avatar: action.payload};
    },

    disconnect: (state: {isLoggedIn: boolean; loggedInUser: any}): void => {
      state.isLoggedIn = false;
      state.loggedInUser = undefined;
      AsyncStorage.removeItem('token');
      // state.loggedInUser = undefined;
      // state.profile = undefined;
      // state.errorMessage = "";
      // state.userId = undefined;
    },

    setErrorMessage: (state: any, action: PayloadAction<any>) => {
      state.errorMessage = action.payload;
    },
  },
});

export const {
  setLoggedInUser, 
  disconnect, 
  setErrorMessage, 
  setToken, 
  saveUserAvatar, 
  setStorage, 
  setLastFetchTime, 
  setFilesList
} = authentificationSlice.actions;
