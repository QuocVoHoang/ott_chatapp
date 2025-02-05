
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  userEmail: string;
  userPhotoUrl: string;
  userUid: string;
}

const initialState: UserState = {
  username: "",
  userEmail: "",
  userPhotoUrl: "",
  userUid: ""
};

interface UserInformationPayload {
  newUsername: string;
  newEmail: string;
  newPhotoUrl: string;
  newUid: string;
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInformation: (state, action: PayloadAction<UserInformationPayload>) => {
      state.username = action.payload.newUsername
      state.userEmail = action.payload.newEmail
      state.userPhotoUrl = action.payload.newPhotoUrl
      state.userUid = action.payload.newUid
    },
  },
});

export const { setUserInformation } = userSlice.actions;
export default userSlice.reducer;