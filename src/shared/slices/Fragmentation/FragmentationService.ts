import axios from 'axios';
import {BaseUrl} from '../..';
import {fetchWithTimeout} from '../../Executor';

export const checkForDownloads = async (data: {user_id: string}) => {
  try {
    const url = BaseUrl + '/logged-in-user/checkForDownloads';
    await fetchWithTimeout(url, data, 60000,true);
  } catch (error) {
    console.log(error);
  }
};

export const checkForUploads = async (data: {user_id: string}) => {
  try {
    const url = BaseUrl + '/logged-in-user/checkForUploads';
    await fetchWithTimeout(url, data, 10000,false);
  } catch (error) {
    console.log(error);
  }
};
