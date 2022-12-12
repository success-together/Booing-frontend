import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface InitialState {}

export const initialState = {
  device: {user_id: ''},
};

interface Device {
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
  type?: string;
  name?: string;
  status?: number;
  lat?: number;
  lon?: number;
  device_ref?: string;
}

export const DevicesSlice = createSlice({
  name: 'devices',
  initialState: initialState,
  reducers: {
    setDevice: (
      state: {
        device: Device;
      },
      action: PayloadAction<any>,
    ) => {
      console.log('payload action' + action.payload);

      state.device = action.payload;
    },
  },
});

export const {setDevice} = DevicesSlice.actions;
