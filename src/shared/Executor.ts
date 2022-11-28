import Interceptor from "./Intersptor";
import axios, { AxiosResponse } from "axios";
import { store } from "./index";
import { ExecutorInterface } from "../models/Executor";
import { setRootLoading } from "./slices/rootSlice";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import AsyncStorage from "@react-native-async-storage/async-storage";


export function Executor(config: ExecutorInterface): Promise<any> {

  // get token from asycn storage 
  // let token : string | null = '';
  // AsyncStorage.getItem("token").then(res => token = res);

  // console.log("token" + store.getState().authentication.token);   
  return new Promise((resolve, reject) => {
    !config.isSilent && store.dispatch(setRootLoading(true));
    // Interceptor[config.method](config.url, config.data)
    axios[config.method](config.url, config.data,
       {
      headers: {
        token: store.getState().authentication.token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
    )
      .then((res: AxiosResponse<any>) => {
        console.log(config.url);
        console.log(config.method);
        console.log(config.data);
        if (res?.status === 200) {
          config?.successFun && config.successFun(res?.data);
          !config.withoutToast &&
            Toast.show({
              type: 'success',
              text1: res?.data?.msg,
              // text2: res.msg
            });
          resolve(res?.data);
        }
        // else {
        //   config?.errorFun && config.errorFun(res);
        //   reject(res?.data);
        // }
        // console.log(config.url);
        // console.log(config.data);
        // console.log(Interceptor[config.method]);

        console.log('excutor ', res.status);
        !config.isSilent && store.dispatch(setRootLoading(false));
      })
      .catch((err: any) => {
        console.log(err?.message);

        if (
          err?.response?.status === 400 &&
          err?.response?.data?.msg &&
          !config.withoutToast
        ) {
          config?.errorFun && config.errorFun(err.response.data);
          Toast.show({
            type: 'error',
            text1: err.response.data.msg,
            // text2: res.msg
          });
        }
        !config.isSilent && store.dispatch(setRootLoading(false));

        reject(err);
      });
  });
}
