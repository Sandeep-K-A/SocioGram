import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: '',
        userName: '',
        userId: '',
        following: [],
        profilePic: '',
        success: false,
        token: ''
    },
    reducers: {
        login: (state, action) => {
            const { user, success, token } = action.payload;
            state.userName = user.userName
            state.userId = user.userId
            state.id = user._id
            state.following = user.following
            state.profilePic = user.profilePic
            state.success = success
            state.token = token
        },
        logout: (state) => {
            state.userName = ''
            state.userId = ''
            state.id = ''
            state.following = []
            state.profilePic = ''
            state.success = false
            state.token = ''
        },
        updateUserName: (state, action) => {
            const { user } = action.payload;
            state.userName = user.userName
        },
        updateFollowing: (state, action) => {
            const { user } = action.payload;
            state.following = user.following
        },
        updateProfilePic: (state, action) => {
            state.profilePic = action.payload
        }
    }

})

export const { login, logout, updateUserName, updateFollowing, updateProfilePic } = userSlice.actions;
export default userSlice.reducer;