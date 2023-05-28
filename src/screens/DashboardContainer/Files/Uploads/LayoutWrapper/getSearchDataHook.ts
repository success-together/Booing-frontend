import React from 'react';
import axios from 'axios';
import {BaseUrl, store} from '../../../../../shared';
import {setRootLoading} from '../../../../../shared/slices/rootSlice';
import Toast from 'react-native-toast-message';

const useGetSearchData = async (data: {search: string, user_id: string}): Promise<any> => {
  console.log(data)
  if (data.user_id && data.search !== '') {
    try {
      store.dispatch(setRootLoading(true));
      const res = await axios({
        method: 'POST',
        url: `${BaseUrl}/logged-in-user/searchFile`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        data
      });
      if (res.status === 200) {
        console.log(res.data?.data)
        return (
          res.data?.data?.map((item: any) => ({
            ...item,
            progress: 1,
            hasTriedToUpload: true,
            isImage: item.category === 'image',
          })) || []
        );
      }
    } catch (e: any) {
      Toast.show({
        type: 'error',
        text1: 'there was an error with searching files',
        text2: e.message,
      });
    } finally {
      store.dispatch(setRootLoading(false));
    }
  }

  return [];
};

export default useGetSearchData;
