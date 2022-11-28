import {createSlice} from '@reduxjs/toolkit';

export interface InitialState {}

export const initialState: InitialState = {};

export const DevicesSlice = createSlice({
  name: 'devices',
  initialState: initialState,
  reducers: {},
});
