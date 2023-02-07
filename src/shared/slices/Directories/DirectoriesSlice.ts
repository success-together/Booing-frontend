import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface InitialState {
  // data: Array<Directorie>;
  data: any;
}

export const initialState: InitialState = {
  data: [
    // {
    //   createdAt: '',
    //   id: '',
    //   isDirectory: false,
    //   items: 0,
    //   name: '',
    //   type: 0,
    // },
  ],
};

export const directoriesSlice = createSlice({
  name: 'directories',
  initialState: initialState,
  reducers: {
    setDirectories: (state: {data: any}, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
  },
});

export const {setDirectories} = directoriesSlice.actions;
