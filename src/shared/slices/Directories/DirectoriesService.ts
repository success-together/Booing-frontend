import {BaseUrl, store} from '../..';
import {Executor} from '../../Executor';
import {setDirectories, setCategoryInfo} from './DirectoriesSlice';

export const getRecentFiles = async (data: {user_id: string}) => {
  return Executor({
    method: 'post',
    url: `${BaseUrl}/logged-in-user/recentFiles`,
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

export const getCategoryInfo = async (data: {user_id: string}) => {
  return Executor({
    method: 'post',
    url: `${BaseUrl}/logged-in-user/getCategoryInfo`,
    data: data,
    isSilent: true,
    withoutToast: true,
    successFun(res) {
      const category =  {
        image: {count: 0},
        video: {count: 0},
        audio: {count: 0},
        document: {count: 0},
        other: {count: 0},
      }

      for (let i = 0; i < res.data.length; i++) {
        if (res.data[i]['_id'] === 'image') category['image'] = {updated: res.data[i]['updated'], count: res.data[i]['count']}
        else if (res.data[i]['_id'] === 'document') category['document'] = {updated: res.data[i]['updated'], count: res.data[i]['count']}
        else if (res.data[i]['_id'] === 'video') category['video'] = {updated: res.data[i]['updated'], count: res.data[i]['count']}
        else if (res.data[i]['_id'] === 'audio') category['audio'] = {updated: res.data[i]['updated'], count: res.data[i]['count']}
        else {
          if (category['other']['count']) {
            category['other'] = {
              updated: Math.max(category['other']['updated'], res.data[i]['updated']), 
              count: res.data[i]['count'] + (category['other']['count']*1)
            }
          } else {
            category['other'] = {
              updated: res.data[i]['updated'], 
              count: res.data[i]['count']
            }
          }
        }
      }
      store.dispatch(setCategoryInfo(category));
    },
  });
};
