import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React from 'react';
import {store} from '../../../shared';
import {disconnect} from '../../../shared/slices/Auth/AuthSlice';

export const Logout = async ({navigation}: {navigation: any}) => {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  } catch (error) {
    console.error(error);
  }

  store.dispatch(disconnect());
  // navigation.navigate("Login")
};
