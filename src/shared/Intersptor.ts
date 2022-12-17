import axios from 'axios';
// import { logout, refreshMyToken } from "./slices/Auth/AuthService";

const Interceptor = axios.create({
  timeout: 20000,
});

Interceptor.interceptors.request.use((config: any) => {
  // if (localStorage.getItem("supernova_token")) {
  //   config.headers.common = {
  //     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //   };
  // }
  config.headers.common = {
    ...config.headers.common,
    'Content-Type': 'application/json',
  };
  return config;
});

Interceptor.interceptors.response.use(
  (response: any) => response,
  async (error: {
    config: any;
    response: {status: number; data: {message: string}};
  }) => {
    const originalRequest = error.config;
    if (error.response) {
      if (error.response.status === 403) {
        originalRequest._retry = true;
        // await refreshMyToken({
        //   refresh_token: localStorage.getItem("supernova_refresh_token"),
        // })
        //   .then((res) => {
        //     console.log(res);
        //   })
        //   .catch((e) => {
        //     logout();
        //   });
        // originalRequest.headers.Authorization = `Bearer ${localStorage.getItem(
        //   "token"
        // )}`;
        return Interceptor(originalRequest).then((response: any) => {});
      } else if (error.response.status === 401) {
        // logout();
      } else if (error.response.status === 400) {
        // alertMessage(error.response.data.message, false);
      }
      //    else alertMessage("une erreur s'est produite ", false);
    }
  },
);

export default Interceptor;
