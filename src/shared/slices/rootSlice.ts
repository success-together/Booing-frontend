import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RootState {
  isLoading: boolean;
}

export const rootInitialState: RootState = {
  isLoading: false,
};

export const rootSlice = createSlice({
  name: "root",
  initialState: rootInitialState,
  reducers: {
    setRootLoading: (state: any, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setRootLoading } = rootSlice.actions;
