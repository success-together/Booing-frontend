import axios from 'axios';
import ManageApps from '../../../utils/manageApps';
import {Executor} from '../../Executor';
import {store, BaseUrl} from '../../../shared';

export const checkForDownloads = (data: {user_id: string}) => {
  const url = BaseUrl + '/logged-in-user/checkForDownloads';

  return setInterval(async () => {
    try {
      const result = await axios.post(url, data);

      if (result.data?.data?.length > 0) {
        for (const {fragmentID, fileName, user_id, fragment} of result.data
          .data) {
          const name = `${fragmentID}-${fileName}-${user_id}.json`;
          const isExist = await ManageApps.isFileExist(name);
          if (!isExist) {
            await ManageApps.saveFile(name, fragment);
          }
        }
      }
    } catch (e: any) {
      console.log({error: e.message});
    }
  }, 60 * 1000);
};

export const checkForUploads = (data: {user_id: string}) => {
  const url = BaseUrl + '/logged-in-user/checkForUploads';
  const uploadUrl = BaseUrl + '/logged-in-user/uploadFragments';

  return setInterval(async () => {
    try {
      const result = await axios.post(url, data);

      console.log({
        result,
      });

      if (result.data?.data?.length > 0) {
        const data = result.data.data;

        const requestes = [];
        for (const {_id: file_id, updates} of data) {
          for (const {fragmentId, fileName, user_id} of updates) {
            const name = `${fragmentId}-${fileName}-${user_id}.json`;
            const isFileExist = await ManageApps.isFileExist(name);
            if (isFileExist) {
              const fragment = await ManageApps.getFileContent(name);
              requestes.push(
                axios.post(uploadUrl, {
                  file_id,
                  fragment: {
                    fragmentId,
                    fragment,
                  },
                }),
              );
            }
          }
        }

        await Promise.all(requestes);
      }
    } catch (e: any) {
      console.log({errror: e});
    }
  }, 5 * 1000);
};

export const downloadFiles = async (data: {user_id: string}) => {
  return Executor({
    method: 'get',
    url: `${BaseUrl}/logged-in-user/downloadFile/${data.user_id}`,
    isSilent: false,
    withoutToast: true,
  });
};
