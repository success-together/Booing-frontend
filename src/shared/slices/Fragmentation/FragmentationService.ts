import axios from 'axios';
import {BaseUrl} from '../..';
import {Executor, fetchWithTimeout} from '../../Executor';

export const checkForDownloads = (data: {user_id: string}) => {
  try {
    const url = BaseUrl + '/logged-in-user/checkForDownloads';
    // return fetchWithTimeout(url, data, 60 * 1000, true);
  } catch (error) {
    console.log(error);
  }
};

export const checkForUploads = async (data: {user_id: string}) => {
  try {
    const url = BaseUrl + '/logged-in-user/checkForUploads';
    // await fetchWithTimeout(url, data, 10000,false);
  } catch (error) {
    console.log(error);
  }
};

export const downloadFiles = async (data: {user_id: string; type: string}) => {
  return Executor({
    method: 'get',
    url: `${BaseUrl}/logged-in-user/downloadFile/${data.user_id}/${data.type}`,
    isSilent: false,
    withoutToast: true,
  });
};

export const uploadFiles = async (data: FormData, user_id: string) => {
  return axios({
    url: `${BaseUrl}/logged-in-user/uploadFile/${user_id}`,
    method: 'POST',
    data,
    headers: {
      accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(res => {
      console.log('res upload : ', res);
    })
    .catch(err => {
      console.log(err);
    });
};
