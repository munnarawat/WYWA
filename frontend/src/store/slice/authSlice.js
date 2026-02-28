import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        isAuthenticate : false,
        isLoading:true
    },
    reducers:{
        setUser:(state,action)=>{
            state.user = action.payload;
            state.isAuthenticate = true;
            state.isLoading = false;
        },
        clearUser:(state)=>{
            state.user = null;
            state.isAuthenticate = false;
            state.isLoading = false;
        },
        setLoading:(state,action)=>{
            state.isLoading = action.payload;
        }
    }
});

export const {setUser, clearUser, setLoading} = authSlice.actions;

export default authSlice.reducer;