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
  space: number;
  coins: number;
  user_id: string;
  isSpaceSelled?: boolean;
}) => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/transaction',
    isSilent: false,
    data: data,
  });
};

export const getStripeSheet = async (data: {
  product: any,
  user_id: string
}) => {
  return Executor({
    method: 'post',
    url: BaseUrl + '/stripe-sheet/'+ data.user_id,
    isSilent: true,
    withoutToast: true,
    data: data,
  });
};
