import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React from 'react';
import {store} from '../../../shared';
import socket from '../../../shared/socket';
import {disconnect} from '../../../shared/slices/Auth/AuthSlice';

export const Logout = async ({navigation}: {navigation: any}) => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    socket.logout()
  } catch (error) {
    console.error(error);
  }

  store.dispatch(disconnect());
  // navigation.navigate("Login")
};
