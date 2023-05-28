import axios, {AxiosResponse} from 'axios';
import {store} from './index';
import {ExecutorInterface} from '../models/Executor';
import {setRootLoading} from './slices/rootSlice';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

export function Executor(config: ExecutorInterface): Promise<any> {

  return new Promise((resolve, reject) => {
    !config.isSilent && store.dispatch(setRootLoading(true));
    console.log(config.isSilent, config.url);

    axios[config.method](config.url, config.data, {
      headers: config.headers?config.headers:{
        // token: store.getState().authentication.token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res: AxiosResponse<any>) => {
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

        console.log('excutor ', res.status, config.isSilent );
        !config.isSilent && store.dispatch(setRootLoading(false));
      })
      .catch((err: any) => {
        console.log(err);

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

const delay = (delayInms: number) => {
  return new Promise(resolve => setTimeout(() => resolve, delayInms));
};

export function fetchWithTimeout(fn: () => Promise<void>, time: number) {
  // let timerId = setInterval(() => console.log('checking for updates'), 5000);
  // return Promise.race([
  //   axios.post(url, options.body).then((res) => {
  //     console.log(res);
  //   }),
  //   new Promise((_, reject) =>
  //     setTimeout(() => {
  //       clearInterval(timerId);
  //       reject(new Error('timeout'));
  //     }, 999999999999999),
  //   ),
  // ]);
  // while (true) {
  //   console.log('in');
  //   let res = await axios.post(
  //     BaseUrl + '/logged-in-user/checkForDownloads',
  //     options,
  //   );
  //   console.log(res.data);
  //   await delay(5000);
  //   console.log('out');
  // }
}
