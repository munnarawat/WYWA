import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        token : localStorage.getItem("token") || null ,
        isAuthenticate : !!localStorage.getItem("token"),
    },
    reducers:{
        loginSuccess:(state, action)=>{
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticate = true;
            localStorage.setItem("token", action.payload.token)
        },
        setUser:(state,action)=>{
            state.user = action.payload;
            state.isAuthenticate = true;
        },
        logOut:(state)=>{
            state.user = null;
            state.isAuthenticate = false;
        }
    }
});

export const {loginSuccess, setUser, logOut} = authSlice.actions;

export default authSlice.reducer;