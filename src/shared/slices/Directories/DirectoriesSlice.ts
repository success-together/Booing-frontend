import {PayloadAction, createSlice} from '@reduxjs/toolkit';

// export interface InitialState {
//   // data: Array<Directorie>;
//   data: any;
//   category: any;
// }

export const initialState = {
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
  mangin: [],
  category: {
    image: {

    },
    video: {

    },
    audio: {

    },
    document: {

    },
    other: {

    },
  }
};

export const directoriesSlice = createSlice({
  name: 'directories',
  initialState: initialState,
  reducers: {
    setDirectories: (state: {data: any}, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    setCategoryInfo: (state: {data: any}, action: PayloadAction<any>) => {
      console.log(action.payload)
      state.category = action.payload;
    },
  },
});

export const {setDirectories,setCategoryInfo} = directoriesSlice.actions;
