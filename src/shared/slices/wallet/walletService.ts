import {BaseUrl, store} from '../..';
import {Executor} from '../../Executor';
import {setWallet} from './walletSlice';

export const getWallet = async (data: {user_id: string}) => {
  return Executor({
    method: 'get',
    url: BaseUrl + '/getWallet/' + data.user_id,
    isSilent: false,
    withoutToast: true,
    successFun(res) {
      store.dispatch(setWallet(res.data));
    },
  });
};

export const Transaction = async (data: {
  isIncremenet: boolean;
  coins: number;
  user_id: string;
}) => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/transaction',
    isSilent: false,
    data: data,
  });
};
