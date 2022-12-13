import {createSlice} from '@reduxjs/toolkit';

export interface InitialState {
  deviceId: string | null;
  deviceName: string | null;
  system: string | null;
}

export const initialState: InitialState = {
  deviceId: null,
  deviceName: null,
  system: null,
};

export const DevicesSlice = createSlice({
  name: 'devices',
  initialState: initialState,
  reducers: {
    setDeviceInfo: (state, action) => {
      state.deviceId =
        action.payload.deviceId !== undefined
          ? action.payload.deviceId
          : state.deviceId;
      state.deviceName =
        action.payload.deviceName !== undefined
          ? action.payload.deviceName
          : state.deviceName;
      state.system =
        action.payload.system !== undefined
          ? action.payload.system
          : state.system;
    },
  },
});

export const {setDeviceInfo} = DevicesSlice.actions;
