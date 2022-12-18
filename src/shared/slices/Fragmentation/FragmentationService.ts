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
      console.log(e);
      throw e;
    }
  }, 60 * 1000);
};

export const checkForUploads = ({
  user_id,
  deviceRef,
}: {
  user_id: string;
  deviceRef: string;
}) => {
  const url = BaseUrl + '/logged-in-user/checkForUploads';
  const uploadUrl = BaseUrl + '/logged-in-user/uploadFragments';
  let device_id: string | undefined;

  return setInterval(async () => {
    try {
      if (!deviceRef) {
        return;
      }

      if (!device_id) {
        const deviceIdResponse = await axios({
          method: 'POST',
          url: `${BaseUrl}/logged-in-user/getDevices`,
          data: {
            user_id: user_id,
          },
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (deviceIdResponse.status === 200) {
          const data = deviceIdResponse.data.data;
          const device = data.find((e: any) => e.device_ref === deviceRef);

          if (device) {
            device_id = device._id;
          }
        }
        return;
      }

      const result = await axios.post(url, {device_id});

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
      console.log(e);
    }
  }, 60 * 1000);
};

export const downloadFiles = async (data: {user_id: string; type: string}) => {
  return Executor({
    method: 'get',
    url: `${BaseUrl}/logged-in-user/downloadFile/${data.user_id}/${data.type}`,
    isSilent: false,
    withoutToast: true,
  });
};

interface UploadFilesData {
  user_id: string;
  files: {name: string; type: string; data: string}[];
}
export const uploadFiles = (data: UploadFilesData) => {
  return axios({
    url: `${BaseUrl}/logged-in-user/uploadFile/${user_id}`,
    // url: `http://locahlost:3001/logged-in-user/uploadFile/${user_id}`,
    method: 'POST',
    data,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
};
