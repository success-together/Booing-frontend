import axios from 'axios';
import {BaseUrl} from '../..';
import {Executor, fetchWithTimeout} from '../../Executor';

export const checkForDownloads = async (data: {user_id: string}) => {
  try {
    const url = BaseUrl + '/logged-in-user/checkForDownloads';
    // await fetchWithTimeout(url, data, 60000,true);
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

export const downloadFiles = async (data: {user_id: string}) =>{
  return Executor({
    method : 'get',
    url: BaseUrl + '/logged-in-user/downloadFile',
    data,
    isSilent: true,
    withoutToast : true,
    successFun (data){
      console.log(data);
      
    },
    errorFun (data) {
      console.log(data);
      
    }
  })
}
