import {BaseUrl, store} from '../..';
import {Executor} from '../../Executor';
import {setDevice, setDeviceId} from './DevicesSlice';

export const GetDevicesService = (data: {user_id: string}) => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/logged-in-user/getDevices',
    isSilent: true,
    data,
    withoutToast: true,
  });
};

// ! Create data interface
export const addDevice = async (data: {
  device_ref: string;
  created_at?: Date;
  type: string;
  name: string;
  user_id?: string;
  lat?: number;
  lon?: number;
}) => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/logged-in-user/addDevice',
    isSilent: true,
    data,
    withoutToast: true,
    successFun(data) {
      setDevice(data.data);
    },
  });
};

export const updateGeoLocation = async (data: {
  device_ref: string;
  lat: number;
  lon: number;
}) => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/logged-in-user/updateGeoLocation',
    isSilent: true,
    withoutToast: true,
    data,
  });
};


export const SmartSyncService = async (user_id) => {
  console.log(user_id)
  return Executor({
    method: 'get',
    url: BaseUrl + '/logged-in-user/checkFragments/'+user_id,
    isSilent: true,
    withoutToast: true
  });
}