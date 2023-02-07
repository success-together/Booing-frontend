import {BaseUrl, store} from '../..';
import {Executor} from '../../Executor';
import {setDirectories} from './DirectoriesSlice';

export const getRecentDirectories = async (data: {user_id: string}) => {
  return Executor({
    method: 'post',
    url: `${BaseUrl}/logged-in-user/recentDirectories`,
    data: data,
    isSilent: true,
    withoutToast: true,
  });
};

export const getDirectories = async (data: {user_id: string}) => {
  return Executor({
    method: 'post',
    url: `${BaseUrl}/logged-in-user/directories`,
    data: data,
    isSilent: true,
    withoutToast: true,
    successFun(res) {
      // console.log(res.data);
      store.dispatch(setDirectories(res.data));
    },
  });
};
