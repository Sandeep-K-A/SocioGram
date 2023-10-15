import { createSlice } from "@reduxjs/toolkit";


const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        adminData: {},
        token: '',
        isLoggedIn: false
    },
    reducers: {
        login: (state, action) => {
            const { admin, success, token } = action.payload;
            state.adminData = admin;
            state.isLoggedIn = success;
            state.token = token;
        },
        logout: (state) => {
            state.adminData = {};
            state.isLoggedIn = false
        }
    }
})

export const { login, logout } = adminSlice.actions
export default adminSlice.reducer;
