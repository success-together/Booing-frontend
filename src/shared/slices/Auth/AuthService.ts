import AsyncStorage from '@react-native-async-storage/async-storage';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {BaseUrl, store} from '../..';
import {Login} from '../../../models/Login';
import {Executor} from '../../Executor';
import {setLoggedInUser, setToken} from './AuthSlice';

export const login = (data: Login) => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/signin',
    data,
    isSilent: false,
    successFun: (data: Login) => {
      saveUserData(data);
      saveToken(data);
    },
    withoutToast: false,
  });
};

export const register = (data: any) => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/signup',
    data,
    isSilent: false,
    withoutToast: false,
    successFun: (data: any) => {
      saveUserData(data);
    },
  });
};

export const mailVerification = (data: any) => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/signup/codeVerification',
    data,
    isSilent: false,
    withoutToast: false,
  });
};

export const updateProfile = (data: {
  name?: string;
  phone?: string;
  user_id: string;
}) => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/logged-in-user/updateProfile',
    isSilent: false,
    withoutToast: false,
    data,
    successFun(data) {
      saveUserData(data);
    },
  });
};

export const updatePassword = (data: {
  currentPassword: string;
  newPassword: string;
  user_id: string;
}) => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/logged-in-user/updatePassword',
    data,
    isSilent: false,
    withoutToast: false,
  });
};

export const socialMediaSignIn = (data: {
  name: string;
  email: string;
  socialMedia_ID: string;
}) => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/socialMediaSignup',
    data,
    isSilent : false,
    withoutToast :true,
    successFun (data) {
      console.log("data : ", data);
      saveToken(data)
    }
  });
};

const saveUserData = (data: any) => {
  console.log(data);
  store.dispatch(setLoggedInUser(data.data));
  // setToken(data.data.token);
};

const saveToken = (data: any) => {
  store.dispatch(setToken(data.data.signinToken));
  AsyncStorage.setItem('token', data.data.signinToken);
};
