import React from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { BaseUrl, store } from "../..";
import { Login } from "../../../models/Login";
import { Executor } from "../../Executor";
import { Text, View } from 'react-native';

export const GetDevicesService = (data : {user_id : string}) => {
  return Executor({
    method: "get",
    url: BaseUrl + "/logged-in-user/getDevices",
    isSilent: false,
    data,
    withoutToast: true,
  });
}

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
    withoutToast: false,
  });
};

export const updateGeoLocation =   async (data : { device_ref : string, lat : number, lon:number })  => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/booing/logged-in-user/updateGeoLocation',
    isSilent : true,
    withoutToast : false,
    data
  });
}