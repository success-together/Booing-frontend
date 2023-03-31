import AsyncStorage from '@react-native-async-storage/async-storage';
import {BaseUrl, store} from '../..';
import {Login} from '../../../models/Login';
import {Executor} from '../../Executor';
import {setLoggedInUser, setToken, saveUserAvatar} from './AuthSlice';

export const login = (data: Login) => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/signin',
    data,
    isSilent: false,
    successFun: (data: Login) => {
      console.log(data)
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
    isSilent: true,
    withoutToast: false,
    successFun: (res: any) => {
      console.log(res.data);
      // saveUserData(data);
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

export const updateProfile = (data: any) => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/logged-in-user/updateProfile',
    isSilent: false,
    withoutToast: false,
    data,
    successFun(data) {
      console.log(data.data);
      saveUserData(data.data.user);
      // saveToken(data);
    },
  });
};
export const updateProfilePic = (data, user_id) => {
  return Executor({
    method: 'post',
    url: `${BaseUrl}/logged-in-user/updateProfilePic/${user_id}`,
    isSilent: false,
    withoutToast: false,
    data: data,
    headers: {
      accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    successFun(data) {
      store.dispatch(saveUserAvatar(data?.thumbnail));
    },
  });  
};
export const updatePassword = (data: {
  currentPassword: string;
  newPassword: string;
  user_id: string;
  isForgotPassword: boolean;
}) => {
  console.log(data);

  return Executor({
    method: 'post',
    url: BaseUrl + '/logged-in-user/updatePassword',
    data,
    isSilent: false,
    withoutToast: false,
  });
};

export const resendCode = (data: {
  user_id: string;
}) => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/resendCode',
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
    isSilent: false,
    withoutToast: true,
    successFun(data) {
      saveToken(data);
      store.dispatch(
        setLoggedInUser({isLoggedInUser: true, user: data.data.user}),
      );
    },
  });
};

export const forgetPassword = (data: {email: string}) => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/forgotPassword',
    data,
    isSilent: false,
    withoutToast: false,
  });
};

const saveUserData = (data: any) => {
  store.dispatch(setLoggedInUser(data.data));
  // setToken(data.data.token);
};

const saveToken = (data: any) => {
  store.dispatch(setToken(data.data.signinToken));
  AsyncStorage.setItem('token', data.data.signinToken);
};
