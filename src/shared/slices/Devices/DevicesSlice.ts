import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface InitialState {
  deviceId: string | null;
  deviceName: string | null;
  system: string | null;
}

export const initialState = {
  device: {user_id: '', device_id: ''},
  freeSpace: {occupyCloud: 0, freeStorage: 0}
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
    setDeviceId: (
      state: typeof initialState,
      action: PayloadAction<string>,
    ) => {
      state.device.device_id = action.payload;
    },
    setOccupy: (
      state: typeof initialState,
      action: PayloadAction<string>,
    ) => {
      console.log(state)
      console.log("setOccupy", action.payload)
      state.freeSpace = {...state.freeSpace, occupyCloud: action.payload};
    },
    setFreeStorage: (
      state: typeof initialState,
      action: PayloadAction<string>,
    ) => {
      console.log(state)
      console.log("setFreeStorage", action.payload)
      state.freeSpace = {...state.freeSpace, freeStorage: action.payload};
    },
  },
});

export const {setDevice, setDeviceId, setFreeStorage, setOccupy} = DevicesSlice.actions;
