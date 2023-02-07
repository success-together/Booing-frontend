import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface InitialState {
  data: any;
}

export const initialState: InitialState = {
  data: [],
};

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: initialState,
  reducers: {
    setWallet: (state: {data: any}, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
  },
});

export const {setWallet} = walletSlice.actions;
