import React from 'react';
import axios from 'axios';
import {BaseUrl, store} from '../../../../../shared';

const useGetUploadData = async (type?: string): Promise<any> => {
  const user_id = store.getState().authentication.userId;

  if (user_id && type !== '') {
    try {
      const res = await axios({
        method: 'GET',
        url: `${BaseUrl}/logged-in-user/downloadFile/${user_id}/${type}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      if (res.status === 200) {
        return res.data.data.map((item: any) => ({
          ...item,
          uri: item.file || item.uri,
          progress: 1,
          hasTriedToUpload: true,
          isImage: type === 'image',
        }));
      }
    } catch (e) {
      console.log({error: e});
    }
  }

  return [];
};

export default useGetUploadData;
