import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {MutableRefObject} from 'react';
import {TouchableWithoutFeedback} from 'react-native';

export interface RootState {
  isLoading: boolean;
  rootRef: MutableRefObject<TouchableWithoutFeedback> | null;
}

export const rootInitialState: RootState = {
  isLoading: false,
  rootRef: null,
};

export const rootSlice = createSlice({
  name: 'root',
  initialState: rootInitialState,
  reducers: {
    setRootLoading: (state: any, action: PayloadAction<boolean>) => {
      console.log('setRootLoading-> ', action.payload)
      state.isLoading = action.payload;
    },
    setRootRef: (
      state: RootState,
      action: PayloadAction<MutableRefObject<TouchableWithoutFeedback>>,
    ) => {
      console.log('payload', action.payload);
      state.rootRef = action.payload;
    },
  },
});

export const {setRootLoading, setRootRef} = rootSlice.actions;
