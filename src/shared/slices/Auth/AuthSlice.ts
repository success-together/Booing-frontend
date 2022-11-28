import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../models/User";

export const AuthentificationInitialState = {
  loggedInUser: undefined,
  isLoggedIn: false,
  profile: {},
  errorMessage: "",
  userId: undefined,
  token: "",
};

// export const setToken = ( token: string) => {
//   localStorage.setItem("token", token);
// };

export const authentificationSlice = createSlice({
  name: "authentification",
  initialState: AuthentificationInitialState,
  reducers: {
    setLoggedInUser: (
      state: {
        isLoggedIn: boolean;
        loggedInUser: User | undefined;
      },
      action: PayloadAction<any>
    ) => {
      state.isLoggedIn = true;
      state.loggedInUser = action.payload.user;
    },
    setToken: (
      state: {
        token : string
      },
      action: PayloadAction<any>
    ) => {    
      state.token = action.payload;
    },

    disconnect: (state: any): void => {
      state.isLoggedIn = false;
      // state.loggedInUser = undefined;
      // state.profile = undefined;
      // state.errorMessage = "";
      // state.userId = undefined;
    },

    setErrorMessage: (state: any, action: PayloadAction<any>) => {
      state.errorMessage = action.payload;
    },
  },
});

export const { setLoggedInUser, disconnect, setErrorMessage ,setToken} =
  authentificationSlice.actions;
