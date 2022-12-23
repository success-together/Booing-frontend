import React from 'react';
import axios from 'axios';
import {BaseUrl, store} from '../../../../../shared';
import {setRootLoading} from '../../../../../shared/slices/rootSlice';
import Toast from 'react-native-toast-message';

const useGetUploadData = async (type?: string): Promise<any> => {
  const user_id = store.getState().authentication.userId;

  if (user_id && type !== '') {
    try {
      store.dispatch(setRootLoading(true));
      const res = await axios({
        method: 'GET',
        url: `${BaseUrl}/logged-in-user/downloadFile/${user_id}/${type}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      if (res.status === 200) {
        return (
          res.data?.data?.map((item: any) => ({
            ...item,
            progress: 1,
            hasTriedToUpload: true,
            isImage: type === 'image',
          })) || []
        );
      }
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'there was an error with fetching files',
        text2: e.message,
      });
    } finally {
      store.dispatch(setRootLoading(false));
    }
  }

  return [];
};

export default useGetUploadData;
