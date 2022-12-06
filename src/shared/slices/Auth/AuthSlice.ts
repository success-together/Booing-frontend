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
};

export const authentificationSlice = createSlice({
  name: 'authentification',
  initialState: AuthentificationInitialState,
  reducers: {
    setLoggedInUser: (
      state: {
        isLoggedIn: boolean;
        loggedInUser: User | undefined;
        userId ?: string
      },
      action: PayloadAction<any>,
    ) => {
      console.log(action.payload);
      
      state.isLoggedIn = true;
      state.loggedInUser = action.payload.user;
      state.userId = action.payload.user._id
    },
    setToken: (
      state: {
        token: string;
      },
      action: PayloadAction<any>,
    ) => {
      state.token = action.payload;
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

export const {setLoggedInUser, disconnect, setErrorMessage, setToken} =
  authentificationSlice.actions;
