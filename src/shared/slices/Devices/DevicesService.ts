import React from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { BaseUrl, store } from "../..";
import { Login } from "../../../models/Login";
import { Executor } from "../../Executor";
import { Text, View } from 'react-native';

export const GetDevicesService = () => {
  return Executor({
    method: "get",
    url: BaseUrl + "/logged-in-user/getDevices",
    isSilent: false,
    withoutToast: true,
  });
}
