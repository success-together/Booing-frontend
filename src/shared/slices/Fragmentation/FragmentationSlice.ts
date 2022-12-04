import {createSlice} from '@reduxjs/toolkit';

export interface InitialState {}

export const initialState: InitialState = {};

export const fragmentationSlice = createSlice({
  name: 'fragmentation',
  initialState: initialState,
  reducers: {},
});
